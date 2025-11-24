from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb+srv://ahmadmughal_db_user:LoZq7HMwoV5FCekf@cluster0.bbjlybd.mongodb.net/?appName=Cluster0"
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.forge_db
users_collection = db.get_collection("users")