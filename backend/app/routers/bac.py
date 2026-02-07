from fastapi import APIRouter

from app.models import BACInput, BACResult, UserProfile
from app.widmark import compute_bac_result

router = APIRouter(prefix="/bac", tags=["bac"])


@router.post("/estimate", response_model=BACResult)
async def estimate_bac(body: BACInput):
    return compute_bac_result(
        weight_kg=body.weight_kg,
        sex=body.sex,
        alcohol_grams=body.alcohol_grams,
        time_elapsed_minutes=body.time_elapsed_minutes,
    )
