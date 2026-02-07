from fastapi import APIRouter

from app.models import SobrietyResult, SobrietyTelemetry
from app.services.gemini_sobriety import get_sobriety_assessment

router = APIRouter(prefix="/sobriety", tags=["sobriety"])


@router.post("/assess", response_model=SobrietyResult)
async def assess_sobriety(body: SobrietyTelemetry):
    return await get_sobriety_assessment(body)
