import streamlit as st
import time
from rag_pipeline import RAGPipeline
import logging

# Configure page
st.set_page_config(
    page_title="AI Exam Chatbot",
    page_icon="🤖",
    layout="wide"
)

# Configure logging to suppress INFO messages in Streamlit
logging.getLogger().setLevel(logging.WARNING)

# Initialize RAG Pipeline
@st.cache_resource
def initialize_rag():
    """Initialize RAG pipeline - cached to avoid reloading"""
    try:
        with st.spinner("Initializing AI Chatbot..."):
            rag = RAGPipeline()
            return rag, None
    except Exception as e:
        return None, str(e)

def main():
    st.title("AI Exam Chatbot")
    st.write("Ask any academic question and get detailed answers based on our knowledge base!")
    
    # Initialize RAG
    rag, error = initialize_rag()
    
    if error:
        st.error(f"Failed to initialize chatbot: {error}")
        st.info("Please check your API keys in the .env file and make sure all dependencies are installed.")
        st.stop()
    
    # Sidebar
    with st.sidebar:
        st.header("Settings")
        
        # Marks selection
        marks = st.selectbox(
            "Select question marks:",
            options=[1, 2, 5, 10, 15, 20],
            index=2,  # Default to 5 marks
            help="This affects the detail level of the answer"
        )
        
        # Advanced settings
        st.subheader("Advanced Settings")
        top_k = st.slider("Number of sources to retrieve:", 1, 10, 5)
        temperature = st.slider("Response creativity:", 0.0, 1.0, 0.3, 0.1)
        
        # Index stats
        if st.button("Show Index Stats"):
            try:
                stats = rag.get_index_stats()
                st.json(stats)
            except Exception as e:
                st.error(f"Error getting stats: {e}")
    
    # Main chat interface
    col1, col2 = st.columns([3, 1])
    
    with col1:
        # Query input
        user_query = st.text_area(
            "Enter your question:",
            height=100,
            placeholder="e.g., What is machine learning? Explain neural networks."
        )
    
    with col2:
        st.write("") # spacer
        st.write("") # spacer
        ask_button = st.button("Ask Question", type="primary", use_container_width=True)
        clear_button = st.button("Clear", use_container_width=True)
    
    if clear_button:
        st.rerun()
    
    # Process query
    if ask_button and user_query.strip():
        with st.spinner("Thinking..."):
            # Query the RAG pipeline
            result = rag.query_rag(
                user_query=user_query,
                marks=marks,
                top_k=top_k,
                temperature=temperature
            )
        
        # Display results
        if result.get('error') and result['error'] != 'No documents found':
            st.error(f"Error: {result['error']}")
        else:
            # Answer section
            st.subheader("Answer")
            st.write(result['answer'])
            
            # Sources section
            if result['sources']:
                st.subheader("Sources")
                
                # Create tabs for each source
                source_tabs = st.tabs([f"Source {i+1}" for i in range(len(result['sources']))])
                
                for i, (tab, source) in enumerate(zip(source_tabs, result['sources'])):
                    with tab:
                        st.write(f"**Relevance Score:** {source['score']:.3f}")
                        st.write(f"**Document ID:** `{source['id']}`")
                        st.write("**Preview:**")
                        st.write(source['preview'])
                        
                        # Expandable full content if available
                        if len(source.get('text', source['preview'])) > len(source['preview']):
                            with st.expander("Show full content"):
                                st.write(source.get('text', source['preview']))
            
            else:
                st.warning("No relevant sources found in the knowledge base.")
                st.info("The chatbot answered based on its general knowledge.")
    
    elif ask_button and not user_query.strip():
        st.warning("Please enter a question first!")
    
    # Footer
    st.divider()
    
    col1, col2, col3 = st.columns(3)
    with col1:
        if st.button("Sample Questions"):
            st.session_state.show_samples = not st.session_state.get('show_samples', False)
    
    with col2:
        if st.button("How to Use"):
            st.session_state.show_help = not st.session_state.get('show_help', False)
    
    with col3:
        if st.button("Troubleshooting"):
            st.session_state.show_troubleshoot = not st.session_state.get('show_troubleshoot', False)
    
    # Sample questions
    if st.session_state.get('show_samples', False):
        st.subheader("Sample Questions")
        sample_questions = [
            "What is machine learning?",
            "Explain neural networks",
            "What are the types of machine learning algorithms?",
            "How does deep learning work?",
            "What is the difference between AI and ML?",
            "Explain supervised learning with examples"
        ]
        
        cols = st.columns(2)
        for i, question in enumerate(sample_questions):
            with cols[i % 2]:
                if st.button(question, key=f"sample_{i}"):
                    st.session_state.sample_query = question
                    st.rerun()
        
        # Auto-fill from sample
        if hasattr(st.session_state, 'sample_query'):
            st.info(f"Selected: {st.session_state.sample_query}")
            del st.session_state.sample_query
    
    # Help section
    if st.session_state.get('show_help', False):
        st.subheader("How to Use")
        st.write("""
        1. **Enter your question** in the text area
        2. **Select the marks** for your question (affects answer detail)
        3. **Click 'Ask Question'** to get your answer
        4. **Review the sources** to see where the information came from
        
        **Tips:**
        - Be specific in your questions for better results
        - Higher marks = more detailed answers
        - Check the sources to verify information
        - Use the advanced settings to customize responses
        """)
    
    # Troubleshooting
    if st.session_state.get('show_troubleshoot', False):
        st.subheader("Troubleshooting")
        st.write("""
        **Common Issues:**
        
        1. **"No relevant sources found"**
           - Try rephrasing your question
           - Use more general terms
           - Check if the topic is in our knowledge base
        
        2. **Slow responses**
           - Reduce the number of sources (top_k)
           - This is normal for the first query (model loading)
        
        3. **Connection errors**
           - Check your internet connection
           - Verify API keys in .env file
        
        4. **Poor answer quality**
           - Increase the number of sources
           - Try different temperature settings
           - Be more specific in your question
        """)

if __name__ == "__main__":
    main()