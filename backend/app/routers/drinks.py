from fastapi import APIRouter, HTTPException

from app.models import ValidateDrinkRequest, ValidateDrinkResponse
from app.services.drink_validation import validate_drink

router = APIRouter(prefix="/validate-drink", tags=["drinks"])


@router.post("", response_model=ValidateDrinkResponse)
async def post_validate_drink(body: ValidateDrinkRequest):
    return await validate_drink(body)
