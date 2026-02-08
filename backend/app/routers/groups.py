import random
import string
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.db import get_db
from app.models import GroupCreate, GroupJoin, GroupNotify

router = APIRouter(prefix="/groups", tags=["groups"])


def _generate_code() -> str:
    return "".join(random.choices(string.digits, k=6))


@router.post("")
async def create_group(body: GroupCreate, db=Depends(get_db)):
    """Create a new group; returns group_id and 6-digit code."""
    code = _generate_code()
    now = datetime.now(timezone.utc)
    doc = {
        "code": code,
        "name": body.name or "My Group",
        "member_ids": [body.user_id],
        "created_at": now,
        "updated_at": now,
    }
    result = await db.groups.insert_one(doc)
    group_id = str(result.inserted_id)
    return {"group_id": group_id, "code": code, "name": doc["name"]}


@router.post("/join")
async def join_group(body: GroupJoin, db=Depends(get_db)):
    """Join a group by 6-digit code."""
    group = await db.groups.find_one({"code": body.code.strip()})
    if not group:
        raise HTTPException(404, "Group not found. Check the code.")
    member_ids = group.get("member_ids") or []
    if body.user_id in member_ids:
        return {"ok": True, "group_id": str(group["_id"]), "message": "Already in group"}
    member_ids.append(body.user_id)
    await db.groups.update_one(
        {"_id": group["_id"]},
        {"$set": {"member_ids": member_ids, "updated_at": datetime.now(timezone.utc)}},
    )
    return {"ok": True, "group_id": str(group["_id"])}


@router.get("/{group_id}/members")
async def get_members(group_id: str, db=Depends(get_db)):
    """Return list of members with user_id, first_name, last_name, phone for the group."""
    from bson import ObjectId
    try:
        oid = ObjectId(group_id)
    except Exception:
        raise HTTPException(400, "Invalid group_id")
    group = await db.groups.find_one({"_id": oid})
    if not group:
        raise HTTPException(404, "Group not found")
    member_ids = group.get("member_ids") or []
    members = []
    for uid in member_ids:
        user = await db.users.find_one({"user_id": uid})
        members.append({
            "user_id": uid,
            "first_name": (user or {}).get("first_name") or "",
            "last_name": (user or {}).get("last_name") or "",
            "phone": (user or {}).get("primary_contact") or (user or {}).get("phone") or "",
            "name": _full_name(user),
        })
    return {"members": members}


def _full_name(user: dict | None) -> str:
    if not user:
        return "Unknown"
    first = (user.get("first_name") or "").strip()
    last = (user.get("last_name") or "").strip()
    if first and last:
        return f"{first} {last}"
    return first or last or "Unknown"


@router.post("/notify")
async def notify_group(body: GroupNotify, db=Depends(get_db)):
    """Notify all other members in the user's group (mock: log message; can plug Expo push later)."""
    group_id = body.group_id
    if not group_id:
        group = await db.groups.find_one({"member_ids": body.user_id})
        if not group:
            raise HTTPException(404, "You are not in a group.")
        group_id = str(group["_id"])
    from bson import ObjectId
    try:
        oid = ObjectId(group_id)
    except Exception:
        raise HTTPException(400, "Invalid group_id")
    group = await db.groups.find_one({"_id": oid})
    if not group:
        raise HTTPException(404, "Group not found")
    member_ids = group.get("member_ids") or []
    if body.user_id not in member_ids:
        raise HTTPException(403, "You are not in this group.")
    user = await db.users.find_one({"user_id": body.user_id})
    name = _full_name(user)
    # message from client is typically the BAC string for the notification text
    status_text = f" Status: BAC {body.message}" if body.message else ""
    message = f"{name} is going home.{status_text}"
    # Mock: in production you would send Expo push to other members
    other_ids = [m for m in member_ids if m != body.user_id]
    return {"ok": True, "notified_count": len(other_ids), "message": message}
