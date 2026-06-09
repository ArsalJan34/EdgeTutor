from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from store import get_collection
import requests
import json

model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_text(pdf_file):
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or " "
    return text

def chunk_text(text, chunk_size=800):
    return [
        text[i:i + chunk_size]
        for i in range(0, len(text), chunk_size)
    ]

def store_pdf(pdf_file, collection_name: str):
    text = extract_text(pdf_file)
    chunks = chunk_text(text)
    collection = get_collection(collection_name)
    embeddings = model.encode(chunks).tolist()
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[f"chunk-{i}" for i in range(len(chunks))]
    )
    return len(chunks)

def query_docs(question: str, collection_name: str, top_k=3):
    # Step 1 - get relevant chunks from ChromaDB
    collection = get_collection(collection_name)
    query_embedding = model.encode([question]).tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k
    )
    chunks = results["documents"][0]

    # Step 2 - build prompt with context
    context = "\n\n".join(chunks)
    prompt = f"""You are EdgeTutor, an AI tutor. Use the context below to answer the student's question clearly and helpfully.

Context from uploaded document:
{context}

Student question: {question}

Answer:"""

    # Step 3 - send to Ollama
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "gemma:2b",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()
    return result["response"]
