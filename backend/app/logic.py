# app/logic.py
from datetime import datetime, timezone

from app.models import (
    BiologicalSex,
    BACResult,
    BACStatus,
    ValidateDrinkRequest,
    ValidateDrinkResponse,
)

# --------------------
# Constants
# --------------------

# Widmark constants
R_MALE = 0.68
R_FEMALE = 0.55
BETA_PER_HOUR = 0.015

# Drink policy
COOLDOWN_SECONDS = 120  # 2 minutes


# --------------------
# BAC Calculation
# --------------------

def compute_bac(
    *,
    weight_lb: float,
    sex: BiologicalSex,
    alcohol_grams: float,
    time_elapsed_minutes: float,
) -> BACResult:
    """
    Compute BAC using Widmark formula and return status + guardian flag.
    """
    weight_kg = weight_lb * 0.453592
    hours = time_elapsed_minutes / 60.0

    r = R_MALE if sex == BiologicalSex.MALE else R_FEMALE

    peak_bac = alcohol_grams / (weight_kg * r)
    elimination = BETA_PER_HOUR * hours
    bac = max(0.0, round(peak_bac - elimination, 4))

    if bac > 0.12:
        status = BACStatus.RED
    elif bac > 0.08:
        status = BACStatus.YELLOW
    else:
        status = BACStatus.GREEN

    return BACResult(
        bac=bac,
        status=status,
        notify_guardian=(status == BACStatus.RED),
    )


# --------------------
# Drink Validation Logic
# --------------------

async def validate_drink(
    db,
    req: ValidateDrinkRequest,
) -> ValidateDrinkResponse:
    """
    Core drink authorization logic:
    - user exists
    - not cut off
    - cooldown enforced
    - drink recorded
    """

    users = db.users
    drinks = db.drinks

    # --- User existence ---
    user = await users.find_one({"user_id": req.user_id})
    if not user:
        return ValidateDrinkResponse(
            allowed=False,
            reason="SERVICE_DENIED",
            message="User not found.",
        )

    # --- Cut-off check ---
    if user.get("is_cut_off"):
        return ValidateDrinkResponse(
            allowed=False,
            reason="SERVICE_DENIED",
            message="You are currently cut off.",
        )

    now = req.scanned_at or datetime.now(timezone.utc)

    # --- Cooldown enforcement ---
    last_drink = await drinks.find_one(
        {"user_id": req.user_id},
        sort=[("timestamp", -1)],
    )

    if last_drink:
        last_ts = last_drink["timestamp"]
        delta = (now - last_ts).total_seconds()

        if delta < COOLDOWN_SECONDS:
            return ValidateDrinkResponse(
                allowed=False,
                reason="COOLDOWN",
                message="Please wait before ordering another drink.",
                last_drink_at=last_ts,
            )

    # --- Record drink ---
    await drinks.insert_one(
        {
            "user_id": req.user_id,
            "drink_id": req.drink_id,
            "alcohol_grams": req.alcohol_grams,
            "timestamp": now,
        }
    )

    return ValidateDrinkResponse(
        allowed=True,
        reason="OK",
        message="Drink approved.",
    )
