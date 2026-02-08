from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List

from pydantic import BaseModel, Field


class BiologicalSex(str, Enum):
    MALE = "male"
    FEMALE = "female"


# --------------------
# Core domain models
# --------------------

class UserProfile(BaseModel):
    user_id: int
    user_name: str
    age: int = Field(..., ge=18)
    weight_lb: float = Field(..., gt=0)
    sex: BiologicalSex
    number: str
    primary_contact: Optional[str] = None
    is_cut_off: bool = False


class UserEvent(BaseModel):
    user_id: int
    group_id: int
    bac_level: float = Field(..., ge=0)
    is_cut_off: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserProfileUpdate(BaseModel):
    """Partial update for profile (e.g. BarBabes). All fields optional."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=18)
    weight_kg: Optional[float] = Field(None, gt=0)
    sex: Optional[BiologicalSex] = None
    primary_contact: Optional[str] = None
    emergency_contacts: Optional[list[str]] = None  # max 2; validate in router if needed
    height_cm: Optional[float] = Field(None, ge=0)
    tolerance: Optional[int] = Field(None, ge=1, le=10)


class DrinkRecord(BaseModel):
    user_id: int
    bar_name: str
    drink_id: str
    bac_level: float = Field(..., ge=0)
    alcohol_grams: float = Field(..., ge=0)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GroupProfile(BaseModel):
    group_id: int
    user_list: List[int]


# --------------------
# Sobriety models (THIS WAS MISSING)
# --------------------

class SobrietyTelemetry(BaseModel):
    user_id: int
    reaction_time_ms: float = Field(..., gt=0)
    typing_error_rate: float = Field(..., ge=0, le=1)
    motion_jitter: float = Field(..., ge=0)
    game_score: Optional[float] = None
    recorded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SobrietyResult(BaseModel):
    sobriety_score: int = Field(..., ge=0, le=100)
    recommendation: str
    is_emergency: bool

# --------------------
# BAC models
# --------------------

class BACInput(BaseModel):
    weight_lb: float = Field(..., gt=0)
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
# Drink validation models
# --------------------

class ValidateDrinkRequest(BaseModel):
    user_id: int
    drink_id: str
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


# Simple BAC + reaction time → Gemini recommendation (for dashboard)
class RecommendationRequest(BaseModel):
    bac: float = Field(..., ge=0)
    reaction_time_ms: Optional[float] = Field(None, ge=0)


# Group model for Create/Join
class GroupCreate(BaseModel):
    user_id: str
    name: Optional[str] = None


class GroupJoin(BaseModel):
    code: str  # 6-digit
    user_id: str


class GroupNotify(BaseModel):
    user_id: str
    group_id: Optional[str] = None  # if not set, backend finds user's group
    message: Optional[str] = None  # optional override; default includes BAC