import os
from typing import List, Dict, Any
from pinecone import Pinecone, ServerlessSpec

class VectorService:
    def __init__(self):
        self.api_key = os.getenv("PINECONE_API_KEY")
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "interview-patterns")
        
        if self.api_key:
            self.pc = Pinecone(api_key=self.api_key)
            # Ensure index exists (simplified check)
            if self.index_name not in self.pc.list_indexes().names():
                self.pc.create_index(
                    name=self.index_name,
                    dimension=1536, # Standard for OpenAI embeddings
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1")
                )
            self.index = self.pc.Index(self.index_name)
        else:
            self.pc = None
            self.index = None

    async def upsert_pattern(self, pattern_id: str, vector: List[float], metadata: Dict[str, Any]):
        """
        Stores an interview pattern vector with metadata.
        """
        if not self.index:
            print("Pinecone not configured, skipping upsert.")
            return

        try:
            self.index.upsert(vectors=[(pattern_id, vector, metadata)])
        except Exception as e:
            print(f"Pinecone Upsert Error: {e}")

    async def query_patterns(self, query_vector: List[float], top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieves top-k similar interview patterns.
        """
        if not self.index:
            # Mock retrieval
            return [
                {"id": "msft_01", "metadata": {"company": "Microsoft", "topic": "System Design"}},
                {"id": "amzn_02", "metadata": {"company": "Amazon", "topic": "Leadership Principles"}}
            ]

        try:
            results = self.index.query(vector=query_vector, top_k=top_k, include_metadata=True)
            return [hit.to_dict() for hit in results.matches]
        except Exception as e:
            print(f"Pinecone Query Error: {e}")
            return []

vector_service = VectorService()
