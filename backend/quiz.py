from store import get_collection
from rag import model
import requests
import re
import json

def get_context(topic: str, collection_name: str, top_k: int = 5) -> str:
    collection = get_collection(collection_name)
    query_embedding = model.encode([topic]).tolist()
    results = collection.query(query_embeddings=query_embedding, n_results=top_k)
    chunks = results["documents"][0]
    return "\n\n".join(chunks)

def generate_quiz(topic: str, collection_name: str, num_questions: int = 5, difficulty: str = "medium") -> list:
    context = get_context(topic, collection_name)

    difficulty_instruction = {
        "easy":   "Questions should be straightforward recall and basic understanding.",
        "medium": "Questions should require some reasoning and application of concepts.",
        "hard":   "Questions should be challenging, requiring deep understanding and analysis.",
    }.get(difficulty, "Questions should require some reasoning and application of concepts.")

    prompt = f"""You are an exam question generator. Based ONLY on the context below, generate exactly {num_questions} multiple choice questions.

Difficulty: {difficulty.upper()} — {difficulty_instruction}

Context:
{context}

Rules:
- Each question must have exactly 4 options labeled A, B, C, D
- Only one option is correct
- Questions must be based strictly on the context
- Return ONLY valid JSON, no extra text, no markdown

Return this exact JSON format:
[
  {{
    "question": "question text here",
    "options": {{"A": "option1", "B": "option2", "C": "option3", "D": "option4"}},
    "answer": "A",
    "explanation": "brief explanation why this is correct"
  }}
]"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "gemma:2b", "prompt": prompt, "stream": False}
    )

    raw = response.json()["response"]
    raw = re.sub(r"```json|```", "", raw).strip()

    match = re.search(r'\[.*\]', raw, re.DOTALL)
    if not match:
        raise ValueError("Could not parse quiz JSON from model response")

    return json.loads(match.group())


def score_answer(question: dict, selected: str) -> dict:
    correct = question["answer"].upper().strip()
    chosen = selected.upper().strip()
    is_correct = correct == chosen
    return {
        "correct": is_correct,
        "selected": chosen,
        "correct_answer": correct,
        "explanation": question.get("explanation", "")
    }
