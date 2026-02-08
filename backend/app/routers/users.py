from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.db import get_db
from app.models import BiologicalSex, UserProfile, UserProfileUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.post("")
async def create_user(body: UserProfile, db=Depends(get_db)):
    existing = await db.users.find_one({"user_id": body.user_id})
    if existing:
        raise HTTPException(409, "User already exists")
    doc = body.model_dump()
    now = datetime.now(timezone.utc)
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.users.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


@router.get("/{user_id}")
async def get_user(user_id: str, db=Depends(get_db)):
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(404, "User not found")
    user["_id"] = str(user["_id"])
    return user


@router.put("/{user_id}")
async def upsert_user(user_id: str, body: UserProfile, db=Depends(get_db)):
    doc = body.model_dump()
    doc["user_id"] = user_id
    doc["updated_at"] = datetime.now(timezone.utc)
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": doc},
        upsert=True,
    )
    return {"ok": True}


@router.patch("/{user_id}")
async def patch_user(user_id: str, body: UserProfileUpdate, db=Depends(get_db)):
    """Partial update for profile. Only provided fields are updated."""
    doc = body.model_dump(exclude_unset=True)
    if not doc:
        return {"ok": True}
    doc["user_id"] = user_id  # from path
    doc["updated_at"] = datetime.now(timezone.utc)
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": doc},
        upsert=True,
    )
    return {"ok": True}


@router.patch("/{user_id}/cut-off")
async def set_cut_off(user_id: str, is_cut_off: bool, db=Depends(get_db)):
    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"is_cut_off": is_cut_off, "updated_at": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        raise HTTPException(404, "User not found")
    return {"is_cut_off": is_cut_off}
