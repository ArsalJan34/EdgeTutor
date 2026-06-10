from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rag import store_pdf, query_docs
from quiz import generate_quiz, score_answer
from database import init_db, get_conn
from models import BulkAnswerSubmission
import os

app = FastAPI()
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── CORE ────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "EdgeTutor running"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename or "upload.pdf"
    safe_path = os.path.basename(filename)
    with open(safe_path, "wb") as f:
        f.write(content)
    chunks = store_pdf(safe_path, collection_name="default")
    return {"message": "pdf processed", "chunks": chunks}

@app.get("/chat")
def chat(q: str, mode: str = "tutor"):
    if mode not in ("tutor", "socratic"):
        raise HTTPException(status_code=400, detail="mode must be 'tutor' or 'socratic'")
    answer = query_docs(q, "default", mode=mode)
    conn = get_conn()
    conn.execute(
        "INSERT INTO chat_sessions (question, answer, mode) VALUES (?, ?, ?)",
        (q, answer, mode)
    )
    conn.commit()
    conn.close()
    return {"question": q, "answer": answer, "mode": mode}

# ── QUIZ ────────────────────────────────────────

@app.get("/quiz/generate")
def quiz_generate(topic: str, num_questions: int = 5, difficulty: str = "medium"):
    try:
        questions = generate_quiz(topic, "default", num_questions, difficulty)
        return {"topic": topic, "questions": questions, "difficulty": difficulty}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model error: {str(e)}")

@app.post("/quiz/score")
def quiz_score(submission: BulkAnswerSubmission):
    if len(submission.questions) != len(submission.answers):
        raise HTTPException(status_code=400, detail="Questions and answers count must match")

    results = []
    score = 0
    for q, a in zip(submission.questions, submission.answers):
        result = score_answer(q, a)
        results.append({
            "question": q["question"],
            "options": q["options"],
            **result
        })
        if result["correct"]:
            score += 1

    total = len(submission.questions)
    percentage = round((score / total) * 100)

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO quiz_attempts (topic, score, total, percentage, difficulty) VALUES (?, ?, ?, ?, ?)",
        (submission.topic, score, total, percentage, submission.difficulty)
    )
    attempt_id = cur.lastrowid
    for r in results:
        cur.execute(
            "INSERT INTO quiz_results (attempt_id, question, correct, selected, correct_ans) VALUES (?, ?, ?, ?, ?)",
            (attempt_id, r["question"], 1 if r["correct"] else 0, r["selected"], r["correct_answer"])
        )
    conn.commit()
    conn.close()

    return {
        "score": score,
        "total": total,
        "percentage": percentage,
        "difficulty": submission.difficulty,
        "next_difficulty": _next_difficulty(submission.difficulty, percentage),
        "results": results
    }

# ── PROGRESS ────────────────────────────────────

@app.get("/progress/summary")
def progress_summary():
    conn = get_conn()
    attempts = conn.execute(
        "SELECT * FROM quiz_attempts ORDER BY created_at DESC"
    ).fetchall()

    if not attempts:
        conn.close()
        return {
            "total_quizzes": 0,
            "average_score": 0,
            "best_score": 0,
            "current_difficulty": "medium",
            "topics": [],
            "recent_attempts": []
        }

    rows = [dict(r) for r in attempts]
    total_quizzes = len(rows)
    average_score = round(sum(r["percentage"] for r in rows) / total_quizzes)
    best_score = max(r["percentage"] for r in rows)

    topic_map: dict = {}
    for r in rows:
        t = r["topic"]
        if t not in topic_map:
            topic_map[t] = {"topic": t, "attempts": 0, "total_pct": 0}
        topic_map[t]["attempts"] += 1
        topic_map[t]["total_pct"] += r["percentage"]

    topics = sorted([
        {
            "topic": v["topic"],
            "attempts": v["attempts"],
            "average": round(v["total_pct"] / v["attempts"])
        }
        for v in topic_map.values()
    ], key=lambda x: x["average"])

    latest = rows[0]
    current_difficulty = _next_difficulty(latest["difficulty"], latest["percentage"])

    conn.close()
    return {
        "total_quizzes": total_quizzes,
        "average_score": average_score,
        "best_score": best_score,
        "current_difficulty": current_difficulty,
        "topics": topics,
        "recent_attempts": rows[:10]
    }

@app.get("/progress/chat-history")
def chat_history(limit: int = 20):
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM chat_sessions ORDER BY created_at DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return {"sessions": [dict(r) for r in rows]}

# ── HELPER ──────────────────────────────────────

def _next_difficulty(current: str, percentage: int) -> str:
    if percentage >= 80:
        return "hard"
    elif percentage >= 50:
        return "medium"
    else:
        return "easy"
