from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGODB_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.prepai_db

async def get_database():
    return db
