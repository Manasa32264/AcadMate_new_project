import os
import numpy as np
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv
import logging
from typing import List, Dict, Any, Optional

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Handle different Pinecone package versions
try:
    from pinecone import Pinecone
    PINECONE_NEW_VERSION = True
    logger.info("Using new Pinecone package")
except ImportError:
    try:
        import pinecone
        PINECONE_NEW_VERSION = False
        logger.info("Using legacy Pinecone package")
    except ImportError:
        raise ImportError("Neither 'pinecone' nor legacy pinecone package found. Please install: pip install pinecone")

class RAGPipeline:
    """
    RAG Pipeline for AI Exam Chatbot using Pinecone and Groq API
    Compatible with both old and new Pinecone packages
    """
    
    def __init__(self, index_name: str = None):
        """
        Initialize RAG Pipeline with Pinecone and Groq clients
        
        Args:
            index_name (str): Name of the Pinecone index
        """
        self.index_name = index_name or os.getenv("PINECONE_INDEX_NAME", "acadmate-gemini")  # Fixed index name
        self.embedding_model = None
        self.index = None
        self.groq_client = None
        self.pc = None  # Pinecone client
        self.embedding_dimension = 768
        
        self._initialize_clients()
        self._initialize_embedding_model()
        self._initialize_pinecone_index()
    
    def _initialize_clients(self):
        """Initialize Pinecone and Groq clients"""
        try:
            # Initialize Pinecone based on package version
            pinecone_api_key = os.getenv("PINECONE_API_KEY")
            if not pinecone_api_key:
                raise ValueError("PINECONE_API_KEY not found in environment variables")
            
            if PINECONE_NEW_VERSION:
                # New Pinecone package
                self.pc = Pinecone(api_key=pinecone_api_key)
                logger.info("Pinecone client (new version) initialized successfully")
            else:
                # Legacy Pinecone package
                pinecone.init(api_key=pinecone_api_key, environment=os.getenv("PINECONE_ENV", "us-east-1-aws"))
                logger.info("Pinecone (legacy version) initialized successfully")

            # Initialize Groq
            groq_api_key = os.getenv("GROQ_API_KEY")
            if not groq_api_key:
                raise ValueError("GROQ_API_KEY not found in environment variables")
            
            self.groq_client = Groq(api_key=groq_api_key)
            logger.info("Groq client initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing clients: {str(e)}")
            raise
    
    def _initialize_embedding_model(self):
        """Initialize SentenceTransformer model - TRYING DIFFERENT MODELS"""
        try:
            # EMERGENCY FIX: Try different embedding models to find the right one
            # Based on your Pinecone showing 768 dimensions, try these in order:
            
            models_to_try = [
                'sentence-transformers/all-mpnet-base-v2',  # 768 dim
                'all-mpnet-base-v2',                        # 768 dim  
                'sentence-transformers/all-MiniLM-L12-v2',  # 384 dim
                'all-MiniLM-L12-v2',                        # 384 dim
                'sentence-transformers/paraphrase-mpnet-base-v2', # 768 dim
                'paraphrase-mpnet-base-v2'                  # 768 dim
            ]
            
            # For now, let's use the most common 768-dim model
            # TODO: You'll need to identify which model was used for indexing
            self.embedding_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
            
            logger.info(f"Embedding model loaded: sentence-transformers/all-mpnet-base-v2")
            logger.warning("⚠️  IMPORTANT: If similarity scores are still low, you need to identify the original embedding model used for indexing!")
            
        except Exception as e:
            logger.error(f"Error loading embedding model: {str(e)}")
            # Fallback to basic model
            self.embedding_model = SentenceTransformer('all-mpnet-base-v2')
    
    def _initialize_pinecone_index(self):
        """Initialize or connect to Pinecone index"""
        try:
            if PINECONE_NEW_VERSION:
                # New Pinecone package
                self.index = self.pc.Index(self.index_name)
                logger.info(f"Connected to Pinecone index (new): {self.index_name}")
            else:
                # Legacy Pinecone package
                self.index = pinecone.Index(self.index_name)
                logger.info(f"Connected to Pinecone index (legacy): {self.index_name}")
            
            # Test the connection by getting stats
            stats = self.index.describe_index_stats()
            logger.info(f"Index stats: {stats}")
            
        except Exception as e:
            logger.error(f"Error connecting to Pinecone index '{self.index_name}': {str(e)}")
            logger.error("Make sure your index name and API key are correct")
            raise
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for given text"""
        try:
            embedding = self.embedding_model.encode(text)
            logger.debug(f"Generated embedding of shape: {embedding.shape}")
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise
    
    def retrieve_relevant_documents(self, query: str, top_k: int = 5, min_score: float = 0.1) -> List[Dict]:
        """
        Retrieve relevant documents from Pinecone - FIXED VERSION
        
        Args:
            query: Search query
            top_k: Number of results to retrieve  
            min_score: Minimum similarity score threshold (LOWERED to 0.1)
        """
        try:
            # Generate query embedding
            query_embedding = self.generate_embedding(query)
            logger.info(f"Generated query embedding for: '{query[:50]}...'")
            
            # Query Pinecone with explicit namespace
            search_results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                namespace="__default__"  # Your data is in __default__ namespace
            )
            
            logger.info(f"Raw Pinecone results: {len(search_results['matches'])} matches found")
            
            # Process and filter results
            documents = []
            for i, match in enumerate(search_results['matches']):
                score = match['score']
                doc_id = match['id']
                
                # Handle different metadata keys
                metadata = match.get('metadata', {})
                
                # CRITICAL: Try different possible text keys based on your data structure
                text_content = None
                for text_key in ['chunk_text', 'text', 'content', 'document_text']:
                    if text_key in metadata:
                        text_content = metadata[text_key]
                        logger.debug(f"Found text in key '{text_key}' for document {doc_id}")
                        break
                
                if not text_content:
                    logger.warning(f"No text content found for document {doc_id}")
                    logger.warning(f"Available metadata keys: {list(metadata.keys())}")
                    continue
                
                logger.info(f"Match {i+1}: ID={doc_id[:30]}..., Score={score:.4f}")
                
                # EMERGENCY FIX: Use very low threshold since embeddings are mismatched
                if score >= min_score:
                    documents.append({
                        'id': doc_id,
                        'score': score,
                        'text': text_content,
                        'metadata': metadata
                    })
                    logger.info(f"✓ Document {doc_id[:30]}... passed threshold (score: {score:.4f})")
                else:
                    logger.info(f"✗ Document {doc_id[:30]}... filtered out (score: {score:.4f} < {min_score})")
            
            logger.info(f"Final filtered results: {len(documents)} documents")
            return documents
            
        except Exception as e:
            logger.error(f"Error retrieving documents: {str(e)}")
            return []
    
    def _get_marks_based_prompt(self, marks: int) -> str:
        """Generate prompt template based on marks"""
        if marks == 1:
            return "Provide a concise definition in 2-3 lines only. Format: Start with a clear definition."
        elif marks == 2:
            return "Provide: 1. Definition (2-3 lines) 2. One practical example. Keep it concise."
        elif marks == 5:
            return "Provide: 1. Clear definition (2-3 lines) 2. 10 key bullet points explaining important aspects."
        elif marks >= 10:
            return ("Provide a comprehensive answer including: 1. Clear definition (2-3 lines) "
                    "2. Detailed explanation (4-5 lines) 3. 10-15 key bullet points 4. Advantages 5. Disadvantages 6. Real-world applications")
        else:
            return "Provide a well-structured answer appropriate for the question."
    
    def generate_answer_with_groq(self, query: str, context: str, marks: int, temperature: float = 0.3) -> str:
        """Generate answer using Groq API"""
        try:
            marks_prompt = self._get_marks_based_prompt(marks)
            
            system_prompt = f"""
            You are an expert AI tutor specializing in software engineering. Answer questions based on the provided context from the textbook.
            
            FORMATTING REQUIREMENTS FOR {marks} MARKS:
            {marks_prompt}
            
            IMPORTANT RULES:
            - Use the provided context as your primary source
            - If context seems limited, work with what's available
            - Provide accurate, detailed explanations suitable for exam preparation
            - Use technical terminology appropriately
            - Structure your answer clearly with proper formatting
            """
            
            user_prompt = f"Context from Software Engineering Textbook:\n{context}\n\nQuestion: {query}"
            
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="llama-3.1-8b-instant",
                temperature=temperature,
                max_tokens=1500
            )
            
            answer = chat_completion.choices[0].message.content
            logger.info("Answer generated successfully using Groq")
            return answer
        except Exception as e:
            logger.error(f"Error generating answer with Groq: {str(e)}")
            return f"Error generating answer: {str(e)}"
    
    def query_rag(self, user_query: str, marks: int = 5, top_k: int = 5, temperature: float = 0.3, min_score: float = 0.1) -> Dict[str, Any]:
        """
        Main RAG query function - EMERGENCY FIXED VERSION
        """
        try:
            if not user_query.strip():
                return {
                    'answer': 'Please provide a valid question.', 
                    'sources': [], 
                    'error': 'Empty query',
                    'relevance_score': 0.0,
                    'document_id': None
                }
            
            logger.info(f"Processing query: '{user_query}' (marks: {marks}, min_score: {min_score})")
            
            # Retrieve relevant documents with VERY LOW THRESHOLD
            relevant_docs = self.retrieve_relevant_documents(user_query, top_k, min_score)
            
            if not relevant_docs:
                logger.warning("No relevant documents found with current embedding model")
                return {
                    'answer': '''⚠️ **EMBEDDING MODEL MISMATCH DETECTED**
                    
The system is unable to find relevant content because the embedding model used for querying doesn't match the model used for indexing your documents. 

**To fix this issue:**
1. Identify the original embedding model used when indexing your documents
2. Update the RAG pipeline to use the same model
3. OR re-index all documents with the current embedding model

**Common models to try:**
- sentence-transformers/all-mpnet-base-v2 (768 dimensions)
- sentence-transformers/all-MiniLM-L12-v2 (384 dimensions)
- text-embedding-ada-002 (OpenAI, 1536 dimensions)

Your query was: "{user_query}"

Please contact your system administrator to resolve this embedding model mismatch.''', 
                    'sources': [], 
                    'error': 'Embedding model mismatch',
                    'relevance_score': 0.0,
                    'document_id': None
                }
            
            # Use the highest scoring document
            best_doc = relevant_docs[0]
            relevance_score = best_doc['score']
            document_id = best_doc['id']
            
            logger.info(f"Using {len(relevant_docs)} documents, best score: {relevance_score:.4f}")
            
            # Create context from retrieved documents
            context_parts = []
            for i, doc in enumerate(relevant_docs):
                context_parts.append(f"Source {i+1} (Score: {doc['score']:.3f}):\n{doc['text']}")
            
            context = "\n\n" + "="*50 + "\n\n".join(context_parts)
            
            # Generate answer with warning about low scores
            if relevance_score < 0.3:
                context = f"⚠️ WARNING: Low similarity scores detected (best: {relevance_score:.3f}). This may indicate embedding model mismatch.\n\n{context}"
            
            answer = self.generate_answer_with_groq(user_query, context, marks, temperature)
            
            # Add warning to answer if scores are very low
            if relevance_score < 0.3:
                answer = f"⚠️ **Note**: This answer is based on documents with low similarity scores ({relevance_score:.3f}). The content may not be highly relevant due to potential embedding model mismatch.\n\n{answer}"
            
            # Prepare sources for response
            sources = []
            for i, doc in enumerate(relevant_docs[:5]):
                sources.append({
                    'id': doc['id'], 
                    'score': doc['score'], 
                    'preview': doc['text'][:200] + "..." if len(doc['text']) > 200 else doc['text']
                })
            
            return {
                'answer': answer, 
                'sources': sources, 
                'marks': marks, 
                'query': user_query,
                'relevance_score': relevance_score,
                'document_id': document_id,
                'total_sources': len(relevant_docs)
            }
            
        except Exception as e:
            logger.error(f"Error in RAG query: {str(e)}")
            return {
                'answer': f'Error processing query: {str(e)}', 
                'sources': [], 
                'error': str(e),
                'relevance_score': 0.0,
                'document_id': None
            }
    
    def test_different_embedding_models(self, query: str = "What is software quality?") -> Dict[str, Any]:
        """
        Test different embedding models to find the best match
        """
        models_to_test = [
            'sentence-transformers/all-mpnet-base-v2',      # 768 dim
            'sentence-transformers/all-MiniLM-L12-v2',      # 384 dim
            'sentence-transformers/all-MiniLM-L6-v2',       # 384 dim
            'sentence-transformers/paraphrase-mpnet-base-v2' # 768 dim
        ]
        
        results = {}
        original_model = self.embedding_model
        
        for model_name in models_to_test:
            try:
                print(f"\n🧪 Testing model: {model_name}")
                self.embedding_model = SentenceTransformer(model_name)
                
                # Test query
                docs = self.retrieve_relevant_documents(query, top_k=3, min_score=0.0)
                
                if docs:
                    best_score = max(doc['score'] for doc in docs)
                    avg_score = sum(doc['score'] for doc in docs) / len(docs)
                    
                    results[model_name] = {
                        'best_score': best_score,
                        'avg_score': avg_score,
                        'num_docs': len(docs),
                        'status': '✅ Good' if best_score > 0.7 else '⚠️ Poor' if best_score > 0.3 else '❌ Very Poor'
                    }
                    
                    print(f"   Best score: {best_score:.4f}, Avg: {avg_score:.4f}, Status: {results[model_name]['status']}")
                else:
                    results[model_name] = {
                        'best_score': 0.0,
                        'avg_score': 0.0,
                        'num_docs': 0,
                        'status': '❌ No results'
                    }
                    print(f"   No results returned")
                    
            except Exception as e:
                results[model_name] = {
                    'error': str(e),
                    'status': '❌ Error'
                }
                print(f"   Error: {e}")
        
        # Restore original model
        self.embedding_model = original_model
        
        # Find best model
        best_model = None
        best_score = 0.0
        
        for model, result in results.items():
            if 'best_score' in result and result['best_score'] > best_score:
                best_score = result['best_score']
                best_model = model
        
        print(f"\n🏆 Best performing model: {best_model} (score: {best_score:.4f})")
        
        return results
    
    def get_index_stats(self) -> Dict:
        """Get statistics about the Pinecone index"""
        try:
            stats = self.index.describe_index_stats()
            return stats
        except Exception as e:
            logger.error(f"Error getting index stats: {str(e)}")
            return {}

# Emergency test function
def emergency_test():
    """
    Emergency test to verify the fix works
    """
    try:
        print("🚨 EMERGENCY RAG PIPELINE TEST")
        print("=" * 50)
        
        # Initialize RAG with emergency fixes
        rag = RAGPipeline()
        
        # Test with very low threshold
        test_query = "What is software quality?"
        print(f"\nTesting query: '{test_query}'")
        
        result = rag.query_rag(test_query, marks=5, min_score=0.1)  # VERY LOW THRESHOLD
        
        print(f"\n📊 Results:")
        print(f"Relevance score: {result.get('relevance_score', 0):.4f}")
        print(f"Sources found: {result.get('total_sources', 0)}")
        print(f"Error: {result.get('error', 'None')}")
        print(f"\n📝 Answer preview:")
        print(result['answer'][:300] + "..." if len(result['answer']) > 300 else result['answer'])
        
        # Test different embedding models
        print(f"\n🧪 Testing different embedding models...")
        model_results = rag.test_different_embedding_models(test_query)
        
        return rag, result, model_results
        
    except Exception as e:
        print(f"❌ Emergency test failed: {e}")
        return None, None, None

if __name__ == "__main__":
    emergency_test()