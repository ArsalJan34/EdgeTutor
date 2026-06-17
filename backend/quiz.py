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

    prompt = f"""You are a quiz generator. Output ONLY a JSON array, nothing else.

Generate {num_questions} multiple choice questions about "{topic}" using this text:

{context}

Difficulty: {difficulty} — {difficulty_instruction}

Output format (JSON array only, no markdown, no explanation outside JSON):
[
  {{
    "question": "What is ...?",
    "options": {{
      "A": "First actual answer choice",
      "B": "Second actual answer choice",
      "C": "Third actual answer choice",
      "D": "Fourth actual answer choice"
    }},
    "answer": "B",
    "explanation": "Because ..."
  }}
]

IMPORTANT: Write real, meaningful answer choices. Never write "Option A" or "Option B".
Output the JSON array now:"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3:latest",
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

    raise ValueError("Model did not return valid JSON. Try a different topic or fewer questions.")

def _validate(questions: list) -> list:
    valid = []
    for q in questions:
        if not isinstance(q, dict) or "question" not in q:
            continue
        if "options" not in q or not isinstance(q["options"], dict):
            continue  # skip instead of filling with placeholders

        # Skip if any option looks like a placeholder
        options = q["options"]
        has_placeholders = any(
            str(v).strip().lower() in [f"option {k.lower()}", f"option{k.lower()}", "..."]
            for k, v in options.items()
        )
        if has_placeholders:
            continue  # skip bad questions entirely

        # Make sure all 4 keys exist
        if not all(key in options for key in ["A", "B", "C", "D"]):
            continue

        if "answer" not in q or q["answer"] not in ["A", "B", "C", "D"]:
            q["answer"] = "A"
        if "explanation" not in q:
            q["explanation"] = ""
        valid.append(q)

    if not valid:
        raise ValueError("Model returned questions in wrong format. Try a simpler topic or fewer questions.")
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
