import os
import time
import re
import json

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

# --- LlamaIndex Core Imports ---
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
    Settings,
)
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.llms.gemini import Gemini
from llama_index.core.memory import ChatMemoryBuffer
import dotenv
load_dotenv()

# Load API key from environment
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("Missing GEMINI_API_KEY environment variable")

# --- File Paths ---
TEXTBOOKS_PATH = r"C:\Users\chandu\OneDrive\Documents\Hackathon\Prepify\Textbooks"
QUESTION_PAPERS_PATH = r"C:\Users\chandu\OneDrive\Documents\Hackathon\Prepify\QuestionPapers"
STORAGE_PATH = "./storage"

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Prepify RAG API",
    description="API for Prepify's chat and flashcard features.",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Variables & Pydantic Models ---
INDEX = None
CHAT_ENGINE = None
FLASH_ENGINE = None


class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    response: str


class FlashcardRequest(BaseModel):
    topic: str
    existing_questions: List[str] = []


class Flashcard(BaseModel):
    question: str
    answer: str


class FlashcardResponse(BaseModel):
    flashcards: List[Flashcard]


# --- Core RAG Logic ---

def initialize_models():
    print("Initializing Gemini models...")
    Settings.llm = Gemini(api_key=gemini_api_key, model_name="models/gemini-1.5-flash-latest")
    Settings.embed_model = GeminiEmbedding(api_key=gemini_api_key, model_name="models/text-embedding-004")
    print("Models initialized.")


def get_index():
    global INDEX
    if INDEX is None:
        if not os.path.exists(STORAGE_PATH):
            print("Building new index...")
            documents = SimpleDirectoryReader(TEXTBOOKS_PATH, recursive=True).load_data() + \
                        SimpleDirectoryReader(QUESTION_PAPERS_PATH, recursive=True).load_data()
            INDEX = VectorStoreIndex.from_documents(documents)
            INDEX.storage_context.persist(persist_dir=STORAGE_PATH)
        else:
            print("Loading existing index...")
            storage_context = StorageContext.from_defaults(persist_dir=STORAGE_PATH)
            INDEX = load_index_from_storage(storage_context)
    return INDEX


def get_chat_engine():
    global CHAT_ENGINE
    if CHAT_ENGINE is None:
        # ... (chat engine logic remains the same)
        index = get_index()
        memory = ChatMemoryBuffer.from_defaults(token_limit=3000)
        system_prompt = (
            "You are Professor StudyBuddy, an expert tutor for Operating Systems. "
            "Your role is to:\n"
            "1. Answer academic questions using textbooks and question papers\n"
            "2. Explain concepts clearly with examples and analogies\n"
            "3. Maintain a supportive, encouraging teaching style\n"
            "4. Only respond to academic questions about Operating Systems\n\n"
            "Rules:\n"
            "- For greetings, respond briefly and redirect to academics\n"
            "- For non-academic questions, politely redirect\n"
            "- For academic questions, provide detailed answers\n"
            "- Always maintain context from previous questions\n"
            "- If unsure, ask for clarification\n"
        )
        CHAT_ENGINE = index.as_chat_engine(chat_mode="context", memory=memory, system_prompt=system_prompt)
    return CHAT_ENGINE


def get_flash_engine():
    global FLASH_ENGINE
    if FLASH_ENGINE is None:
        index = get_index()
        print("Creating flashcard engine...")
        FLASH_ENGINE = index.as_query_engine(
            similarity_top_k=3,
            system_prompt=(
                "You are an Operating Systems flashcard generator. Follow these rules:\n"
                "1. ONLY generate questions about Operating Systems topics.\n"
                "2. ALWAYS output in this EXACT JSON format: {\"flashcards\": [{\"q\": \"question text\", \"a\": \"answer text\"}]}\n"
                "3. Questions must be exam-style. Answers must be concise (1-3 sentences).\n"
                "4. Never add any other text, greetings, or explanations outside the JSON structure."
            )
        )
        print("Flashcard engine ready.")
    return FLASH_ENGINE


@app.on_event("startup")
async def startup_event():
    print("Server startup sequence initiated...")
    initialize_models()
    get_index()
    get_chat_engine()
    get_flash_engine()
    print("Server is fully initialized and ready to accept requests.")


# --- API Endpoints ---

@app.post("/chat", response_model=ChatResponse)
async def handle_chat_query(request: ChatRequest):
    # ... (chat endpoint remains the same)
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    response = await CHAT_ENGINE.achat(request.query)
    return ChatResponse(response=str(response))


@app.post("/flashcards", response_model=FlashcardResponse)
async def handle_flashcard_request(request: FlashcardRequest):
    if not request.topic or not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    if FLASH_ENGINE is None:
        raise HTTPException(status_code=503, detail="Flashcard engine is not available.")

    print(f"Received flashcard request for topic: {request.topic}")

    avoid_prompt = f"\nAvoid repeating these questions: {', '.join(request.existing_questions[:5])}" if request.existing_questions else ""

    prompt = f"""
    Generate 5 distinct Operating Systems exam flashcards EXCLUSIVELY about: {request.topic}.
    The questions should be suitable for university-level exams.
    Answers must be concise and accurate, based on standard textbook content.
    Use STRICT JSON format with NO additional text.{avoid_prompt}

    Output format:
    {{"flashcards": [{{"q":"Question text", "a":"Answer text"}}]}}
    """

    try:
        response = await FLASH_ENGINE.aquery(prompt)
        response_text = str(response).replace("```json", "").replace("```", "").strip()

        # Robust JSON extraction
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if not json_match:
            raise ValueError("No JSON object found in the response.")

        data = json.loads(json_match.group(0))

        if "flashcards" not in data or not isinstance(data["flashcards"], list):
            raise ValueError("Invalid JSON structure from model.")

        # Validate and format cards
        valid_cards = [
            Flashcard(question=card.get("q", ""), answer=card.get("a", ""))
            for card in data["flashcards"]
            if card.get("q") and card.get("a")
        ]

        print(f"Successfully generated {len(valid_cards)} flashcards.")
        return FlashcardResponse(flashcards=valid_cards[:5])

    except Exception as e:
        print(f"Error generating flashcards: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate flashcards: {e}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)