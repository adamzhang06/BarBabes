# app/api_int.py
import json
import httpx

from app.models import SobrietyTelemetry, SobrietyResult
from app.config import settings


SYSTEM_PROMPT = """
You are assessing human sobriety based on game and sensor telemetry.

Return ONLY valid JSON matching this schema:
{
  "sobriety_score": number (0-100),
  "recommendation": string,
  "is_emergency": boolean
}

Interpretation guidelines:
- Higher jitter, slower reactions, and many typing errors reduce the score
- < 40 indicates impaired
- < 25 indicates dangerous impairment (emergency)
- Be conservative and safety-focused
"""


async def assess_sobriety(
    telemetry: SobrietyTelemetry,
    http_client: httpx.AsyncClient,
) -> SobrietyResult:
    # Fallback if Gemini is not configured
    if not settings.google_gemini_api_key:
        return SobrietyResult(
            sobriety_score=50,
            recommendation="Sobriety AI not configured; defaulting to neutral score.",
            is_emergency=False,
        )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": SYSTEM_PROMPT},
                    {
                        "text": (
                            "Sobriety telemetry:\n"
                            + telemetry.model_dump_json()
                        )
                    },
                ],
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2,
        },
    }

    response = await http_client.post(
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-1.5-flash:generateContent",
        params={"key": settings.google_gemini_api_key},
        json=payload,
    )

    response.raise_for_status()
    data = response.json()

    try:
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        parsed_json = json.loads(raw_text)
        return SobrietyResult.model_validate(parsed_json)

    except Exception:
        # Hard safety fallback
        return SobrietyResult(
            sobriety_score=30,
            recommendation="Unable to reliably assess sobriety. Play it safe.",
            is_emergency=True,
        )