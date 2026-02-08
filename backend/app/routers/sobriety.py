from fastapi import APIRouter, Request

from app.models import RecommendationRequest, SobrietyResult, SobrietyTelemetry
from app.services.gemini_sobriety import get_sobriety_assessment, get_sobriety_recommendation

router = APIRouter(prefix="/sobriety", tags=["sobriety"])


@router.post("/assess", response_model=SobrietyResult)
async def assess_sobriety(body: SobrietyTelemetry, request: Request):
    http_client = request.app.state.http_client
    return await get_sobriety_assessment(body, http_client)


@router.post("/recommendation", response_model=SobrietyResult)
async def recommendation(body: RecommendationRequest, request: Request):
    """Dashboard: get a short recommendation from BAC and optional reaction time."""
    http_client = request.app.state.http_client
    return await get_sobriety_recommendation(body, http_client)
