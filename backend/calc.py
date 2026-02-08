# app/calc.py
from datetime import datetime
from app.models import BiologicalSex

R_MALE = 0.68
R_FEMALE = 0.55
BETA = 0.015

def compute_bac(
    weight_kg: float,
    sex: BiologicalSex,
    alcohol_grams: float,
    hours_elapsed: float,
) -> float:
    r = R_MALE if sex == BiologicalSex.MALE else R_FEMALE
    bac = (alcohol_grams / (weight_kg * r)) - (BETA * hours_elapsed)
    return round(max(bac, 0.0), 4)

def can_take_new_drink(last_drink_time: datetime, now: datetime) -> bool:
    return (now - last_drink_time).total_seconds() >= 120