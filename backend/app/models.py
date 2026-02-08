from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


class BiologicalSex(str, Enum):
    MALE = "male"
    FEMALE = "female"


# --------------------
# Users (user_id = str, e.g. email; MongoDB-compatible)
# --------------------

class UserProfile(BaseModel):
    user_name: str
    email: str
    password: str
    age: int = Field(..., ge=18)
    weight_lb: float = Field(..., gt=0)
    sex: BiologicalSex
    number: str
    primary_contact: Optional[str] = None
    is_cut_off: bool = False
    height_cm: Optional[float] = Field(None, ge=0)
    tolerance: Optional[int] = Field(None, ge=1, le=10)


class UserEvent(BaseModel):
    user_id: int
    group_id: int
    bac_level: float = Field(..., ge=0)
    is_cut_off: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DrinkRecord(BaseModel):
    user_id: int
    bar_name: str
    drink_id: str
    bac_level: float = Field(..., ge=0)
    alcohol_grams: float = Field(..., ge=0)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GroupProfile(BaseModel):
    group_name: str
    user_list: List[int]


# --------------------
# BAC (Widmark)
# --------------------

class BACInput(BaseModel):
    user_id: str
    weight_kg: float = Field(..., gt=0)
    sex: BiologicalSex
    alcohol_grams: float = Field(..., ge=0)
    time_elapsed_minutes: float = Field(..., ge=0)


class BACStatus(str, Enum):
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"


class BACResult(BaseModel):
    bac: float = Field(..., ge=0)
    status: BACStatus
    notify_guardian: bool


# --------------------
# Sobriety (Gemini): telemetry includes BAC for holistic score
# --------------------

class SobrietyTelemetry(BaseModel):
    straight_line_jitter: list[dict[str, float]] = Field(default_factory=list)  # [{x,y,z}, ...]
    reaction_latencies_ms: list[float] = Field(default_factory=list)  # e.g. 5 taps
    typing_test: dict[str, Any] = Field(default_factory=dict)  # {typo_count, speed_wpm, text_entered}
    bac: float = Field(0.0, ge=0)  # current BAC; if > 0.08 AI must recommend not driving


class SobrietyResult(BaseModel):
    sobriety_score: int = Field(..., ge=0, le=100)
    recommendation: str
    is_emergency: bool


class RecommendationRequest(BaseModel):
    bac: float = Field(..., ge=0)
    reaction_time_ms: Optional[float] = Field(None, ge=0)


# --------------------
# Groups (member_ids and code per groups.py)
# --------------------

class GroupCreate(BaseModel):
    user_id: str
    name: Optional[str] = None


class GroupJoin(BaseModel):
    user_id: str
    code: Optional[str] = None
    group_id: Optional[str] = None


class GroupNotify(BaseModel):
    user_id: str
    group_id: Optional[str] = None
    message: Optional[str] = None


# --------------------
# Drink validation (optional; user_id str)
# --------------------

class ValidateDrinkRequest(BaseModel):
    user_id: str
    drink_id: str
    alcohol_grams: float = Field(..., ge=0)
    scanned_at: Optional[datetime] = None


class ValidateDrinkResponse(BaseModel):
    allowed: bool
    reason: str
    message: str
    last_drink_at: Optional[datetime] = None
