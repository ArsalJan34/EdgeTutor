from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from rag import store_pdf, query_docs

app = FastAPI()

# CORS - allows frontend on port 3000 to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "EdgeTutor running"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    content = await file.read()

    with open(file.filename, "wb") as f:
        f.write(content)

    chunks = store_pdf(file.filename, collection_name="default")

    return {
        "message": "pdf processed",
        "chunks": chunks
    }

@app.get("/chat")
def chat(q: str):
    answer = query_docs(q, "default")
    return {
        "question": q,
        "answer": answer
    }
