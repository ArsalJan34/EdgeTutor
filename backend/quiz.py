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
        "easy":   "straightforward recall and basic understanding.",
        "medium": "reasoning and application of concepts.",
        "hard":   "deep understanding and critical analysis.",
    }.get(difficulty, "reasoning and application of concepts.")

    prompt = f"""Generate {num_questions} multiple choice questions about "{topic}".
Difficulty: {difficulty} — {difficulty_instruction}

Text to use:
{context}

Rules:
- Respond with ONLY a JSON array, no extra text, no markdown, no code fences
- Each item must have: question, options (A B C D), answer (A/B/C/D), explanation

[{{"question":"...","options":{{"A":"...","B":"...","C":"...","D":"..."}},"answer":"A","explanation":"..."}}]

JSON:"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "gemma:2b",
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.3, "num_predict": 2048}
        }
    )

    raw = response.json()["response"].strip()
    raw = re.sub(r"```json|```", "", raw).strip()

    # Try 1: direct parse
    try:
        result = json.loads(raw)
        if isinstance(result, list) and result:
            return _validate(result)
    except json.JSONDecodeError:
        pass

    # Try 2: extract array from anywhere in response
    match = re.search(r'\[.*\]', raw, re.DOTALL)
    if match:
        try:
            result = json.loads(match.group())
            if isinstance(result, list) and result:
                return _validate(result)
        except json.JSONDecodeError:
            pass

    # Try 3: extract individual objects
    objects = re.findall(r'\{[^{}]*"question"[^{}]*\}', raw, re.DOTALL)
    if objects:
        result = []
        for obj in objects:
            try:
                result.append(json.loads(obj))
            except json.JSONDecodeError:
                continue
        if result:
            return _validate(result)

    raise ValueError(f"Model did not return valid JSON. Try a different topic or fewer questions.")

def _validate(questions: list) -> list:
    valid = []
    for q in questions:
        if not isinstance(q, dict) or "question" not in q:
            continue
        if "options" not in q or not isinstance(q["options"], dict):
            q["options"] = {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}
        for key in ["A", "B", "C", "D"]:
            if key not in q["options"]:
                q["options"][key] = f"Option {key}"
        if "answer" not in q or q["answer"] not in ["A", "B", "C", "D"]:
            q["answer"] = "A"
        if "explanation" not in q:
            q["explanation"] = ""
        valid.append(q)
    if not valid:
        raise ValueError("Model returned questions in wrong format.")
    return valid

def score_answer(question: dict, selected: str) -> dict:
    correct = question["answer"].upper().strip()
    chosen = selected.upper().strip()
    return {
        "correct": correct == chosen,
        "selected": chosen,
        "correct_answer": correct,
        "explanation": question.get("explanation", "")
    }
