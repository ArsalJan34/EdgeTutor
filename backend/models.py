from pydantic import BaseModel
from typing import List

class BulkAnswerSubmission(BaseModel):
    questions: List[dict]
    answers: List[str]
    topic: str
    difficulty: str = "medium"

class ChatLog(BaseModel):
    question: str
    answer: str
    mode: str = "tutor"
