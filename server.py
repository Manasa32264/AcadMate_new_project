from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_pipeline import RAGPipeline
import logging

# Configure logging
logging.getLogger().setLevel(logging.WARNING)

# Initialize FastAPI
app = FastAPI(title="AI Exam Chatbot API")

# Add CORS middleware - CRITICAL for React to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG pipeline once
try:
    rag = RAGPipeline()
except Exception as e:
    rag = None
    logging.error(f"Failed to initialize RAG: {e}")

# Request model
class QueryRequest(BaseModel):
    question: str
    marks: int = 5
    top_k: int = 5
    temperature: float = 0.3

# API endpoint
@app.post("/ask")
def ask_question(req: QueryRequest):
    if not rag:
        raise HTTPException(status_code=500, detail="RAG pipeline not initialized")

    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        result = rag.query_rag(
            user_query=req.question,
            marks=req.marks,
            top_k=req.top_k,
            temperature=req.temperature
        )
        # Ensure result has 'answer' field that frontend expects
        return {"answer": result.get("answer", str(result))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok", "rag_initialized": rag is not None}