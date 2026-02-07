from datetime import datetime

from app.db import get_db
from app.models import ValidateDrinkRequest, ValidateDrinkResponse


COOLDOWN_SECONDS = 120  # 2 minutes


async def validate_drink(req: ValidateDrinkRequest) -> ValidateDrinkResponse:
    db = await get_db()
    users = db.users
    drinks = db.drinks

    user = await users.find_one({"user_id": req.user_id})
    if not user:
        return ValidateDrinkResponse(
            allowed=False,
            reason="SERVICE_DENIED",
            message="User not found.",
        )
    if user.get("is_cut_off"):
        return ValidateDrinkResponse(
            allowed=False,
            reason="SERVICE_DENIED",
            message="Service denied. You are cut off.",
        )

    now = req.scanned_at or datetime.utcnow()
    last_drink = await drinks.find_one(
        {"user_id": req.user_id},
        sort=[("timestamp", -1)],
    )
    if last_drink:
        last_ts = last_drink["timestamp"]
        if isinstance(last_ts, datetime) and (now - last_ts).total_seconds() < COOLDOWN_SECONDS:
            return ValidateDrinkResponse(
                allowed=False,
                reason="COOLDOWN",
                message="Please wait 2 minutes between drinks.",
                last_drink_at=last_ts,
            )

    # Record this drink for cooldown and BAC
    await drinks.insert_one({
        "drink_id": req.drink_id,
        "user_id": req.user_id,
        "alcohol_grams": req.alcohol_grams,
        "timestamp": now,
    })

    return ValidateDrinkResponse(
        allowed=True,
        reason="OK",
        message="Drink validated.",
    )
