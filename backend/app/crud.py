# app/crud.py
from datetime import datetime, timezone
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models import UserProfile, DrinkRecord

async def get_user(db: AsyncIOMotorDatabase, user_id: int) -> Optional[dict]:
    return await db.users.find_one({"user_id": user_id})


async def create_user(db: AsyncIOMotorDatabase, user: UserProfile) -> None:
    now = datetime.now(timezone.utc)
    doc = user.model_dump()
    doc.update({"created_at": now, "updated_at": now})
    await db.users.insert_one(doc)


async def set_cutoff(db: AsyncIOMotorDatabase, user_id: int, is_cut_off: bool):
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"is_cut_off": is_cut_off, "updated_at": datetime.now(timezone.utc)}},
    )

async def get_last_drink(db: AsyncIOMotorDatabase, user_id: int) -> Optional[dict]:
    return await db.drinks.find_one(
        {"user_id": user_id},
        sort=[("timestamp", -1)],
    )


async def insert_drink(db: AsyncIOMotorDatabase, record: DrinkRecord):
    await db.drinks.insert_one(record.model_dump())


async def get_user_drinks(db: AsyncIOMotorDatabase, user_id: int) -> List[dict]:
    cursor = db.drinks.find({"user_id": user_id})
    return [doc async for doc in cursor]