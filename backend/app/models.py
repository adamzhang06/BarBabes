from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


class BiologicalSex(str, Enum):
    MALE = "male"
    FEMALE = "female"


class UserProfile(BaseModel):
    user_id: str
    age: int = Field(..., ge=18)
    weight_kg: float = Field(..., gt=0)
    sex: BiologicalSex
    primary_contact: Optional[str] = None
    is_cut_off: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class DrinkRecord(BaseModel):
    drink_id: str
    user_id: str
    alcohol_grams: float = Field(..., ge=0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ValidateDrinkRequest(BaseModel):
    drink_id: str
    user_id: str
    alcohol_grams: float = Field(..., ge=0)
    scanned_at: Optional[datetime] = None


class ValidateDrinkResponse(BaseModel):
    allowed: bool
    reason: str  # "OK" | "COOLDOWN" | "SERVICE_DENIED"
    message: str
    last_drink_at: Optional[datetime] = None


# Widmark inputs
class BACInput(BaseModel):
    user_id: str
    weight_kg: float = Field(..., gt=0)
    sex: BiologicalSex
    alcohol_grams: float = Field(..., ge=0)
    time_elapsed_minutes: float = Field(..., ge=0)


class BACStatus(str, Enum):
    GREEN = "green"
    YELLOW = "yellow"   # > 0.08
    RED = "red"         # > 0.12


class BACResult(BaseModel):
    bac: float
    status: BACStatus
    notify_guardian: bool  # True when status == RED


# Sobriety test telemetry → Gemini
class SobrietyTelemetry(BaseModel):
    straight_line_jitter: list[dict[str, float]]  # [{x,y,z}, ...] over 10s
    reaction_latencies_ms: list[float]  # 5 taps
    typing_test: dict[str, Any]  # {typo_count, speed_wpm, text_entered}


class SobrietyResult(BaseModel):
    sobriety_score: int = Field(..., ge=0, le=100)
    recommendation: str
    is_emergency: bool
