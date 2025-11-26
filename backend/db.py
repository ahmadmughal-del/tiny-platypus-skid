import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = os.environ.get("DATABASE_URL")
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.forge_db
users_collection = db.get_collection("users")
