import chromadb
chroma_client = chromadb.PersistentClient(path="chroma_db")
def get_collection(name: str):
  return chroma_client.get_or_create_collection(name=name)
