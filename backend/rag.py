from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from store import get_collection
import requests

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

def query_docs(question: str, collection_name: str, top_k: int = 3, mode: str = "tutor") -> str:
    collection = get_collection(collection_name)
    query_embedding = model.encode([question]).tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k
    )
    chunks = results["documents"][0]
    context = "\n\n".join(chunks)

    if mode == "socratic":
        prompt = f"""You are EdgeTutor in Socratic mode. Do NOT give the answer directly.
Guide the student with 1-2 thoughtful questions to help them discover the answer.
Keep your response under 4 sentences.

Context:
{context}

Student question: {question}

Guiding questions:"""
    else:
        prompt = f"""You are EdgeTutor, an AI tutor. Use the context below to answer the student's question clearly and helpfully.

Context from uploaded document:
{context}

Student question: {question}

Answer:"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3:latest", "prompt": prompt, "stream": False}
    )
    return response.json()["response"]
