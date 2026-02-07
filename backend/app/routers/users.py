from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.db import get_db
from app.models import BiologicalSex, UserProfile

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}")
async def get_user(user_id: str):
    db = await get_db()
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(404, "User not found")
    user["_id"] = str(user["_id"])
    return user


@router.put("/{user_id}")
async def upsert_user(user_id: str, body: UserProfile):
    db = await get_db()
    doc = body.model_dump()
    doc["user_id"] = user_id
    doc["updated_at"] = datetime.utcnow()
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": doc},
        upsert=True,
    )
    return {"ok": True}


@router.patch("/{user_id}/cut-off")
async def set_cut_off(user_id: str, is_cut_off: bool):
    db = await get_db()
    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"is_cut_off": is_cut_off, "updated_at": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(404, "User not found")
    return {"is_cut_off": is_cut_off}
