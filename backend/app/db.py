from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

client: AsyncIOMotorClient | None = None


def get_db_sync():
    global client
    if client is None:
        client = AsyncIOMotorClient(settings.mongodb_uri)
    return client.get_database("saferound")


async def get_db():
    return get_db_sync()


async def close_db():
    global client
    if client:
        client.close()
        client = None
