import certifi

from fastapi import Request
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings


def create_client() -> AsyncIOMotorClient:
    """Create Motor client with Atlas TLS. Connection and ping happen in lifespan."""
    return AsyncIOMotorClient(
        settings.mongodb_uri,
        tlsCAFile=certifi.where(),
    )

async def get_db(request: Request):
    """Dependency that yields the database session from app.state (set in lifespan)."""
    yield request.app.state.db
