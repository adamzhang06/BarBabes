import json
import re

import httpx

from app.config import settings
from app.models import RecommendationRequest, SobrietyResult, SobrietyTelemetry

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


async def get_sobriety_assessment(
    telemetry: SobrietyTelemetry,
    http_client: httpx.AsyncClient,
) -> SobrietyResult:
    """POST telemetry to Gemini; return parsed JSON { sobriety_score, recommendation, is_emergency }."""
    if not settings.google_gemini_api_key:
        return SobrietyResult(
            sobriety_score=50,
            recommendation="Gemini API key not configured. Cannot assess sobriety.",
            is_emergency=False,
        )
    payload = {
        "contents": [{
            "parts": [{
                "text": _build_prompt(telemetry),
            }],
        }],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 512,
            "responseMimeType": "application/json",
        },
    }
    r = await http_client.post(
        f"{GEMINI_URL}?key={settings.google_gemini_api_key}",
        json=payload,
    )
    r.raise_for_status()
    data = r.json()
    text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "{}")
    parsed = _parse_json_response(text)
    return SobrietyResult(
        sobriety_score=int(parsed.get("sobriety_score", 50)),
        recommendation=str(parsed.get("recommendation", "Unable to assess.")),
        is_emergency=bool(parsed.get("is_emergency", False)),
    )


def _build_prompt(t: SobrietyTelemetry) -> str:
    return (
        "You are a safety assistant. Based on the following sobriety test telemetry, "
        "return a JSON object with exactly: sobriety_score (0-100, 100 = fully sober), "
        "recommendation (short string), is_emergency (boolean). "
        "Consider: high jitter, slow/late reactions, and many typos as signs of impairment. "
        "Set is_emergency true only if you believe the person may be in immediate danger.\n\n"
        f"Telemetry:\n{t.model_dump_json(indent=2)}\n\n"
        "Respond with only valid JSON, no markdown."
    )


async def get_sobriety_recommendation(
    body: RecommendationRequest,
    http_client: httpx.AsyncClient,
) -> SobrietyResult:
    """Return a short recommendation string based on BAC and optional reaction time (for dashboard)."""
    if not settings.google_gemini_api_key:
        return SobrietyResult(
            sobriety_score=50,
            recommendation="API key not configured. Stay safe: if you've been drinking, don't drive.",
            is_emergency=False,
        )
    prompt = (
        "You are a safety assistant. Based ONLY on the following, return a JSON object with exactly: "
        "sobriety_score (0-100, 100=fully sober), recommendation (one short sentence for the user), is_emergency (boolean). "
        "Consider: BAC above 0.08 is illegal to drive in the US; above 0.15 is high risk. "
        "Reaction time over 400ms may suggest impairment. Set is_emergency true only if immediate danger.\n\n"
        f"BAC: {body.bac:.3f}\n"
    )
    if body.reaction_time_ms is not None:
        prompt += f"Reaction time (ms): {body.reaction_time_ms}\n"
    prompt += "\nRespond with only valid JSON, no markdown."
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 256,
            "responseMimeType": "application/json",
        },
    }
    r = await http_client.post(
        f"{GEMINI_URL}?key={settings.google_gemini_api_key}",
        json=payload,
    )
    r.raise_for_status()
    data = r.json()
    text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "{}")
    parsed = _parse_json_response(text)
    return SobrietyResult(
        sobriety_score=int(parsed.get("sobriety_score", 50)),
        recommendation=str(parsed.get("recommendation", "Stay safe.")),
        is_emergency=bool(parsed.get("is_emergency", False)),
    )


def _parse_json_response(text: str) -> dict:
    text = text.strip()
    # Remove markdown code block if present
    if text.startswith("```"):
        text = re.sub(r"^```\w*\n?", "", text)
        text = re.sub(r"\n?```\s*$", "", text)
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError) as _:
        return {
            "sobriety_score": 50,
            "recommendation": "Unable to assess. Response could not be parsed.",
            "is_emergency": False,
        }
