# app/widmark.py
from app.models import BACResult, BACStatus, BiologicalSex

# Widmark constants
R_MALE = 0.68
R_FEMALE = 0.55
BETA_PER_HOUR = 0.015  # average elimination rate (% BAC per hour)


def widmark_bac(
    weight_kg: float,
    sex: BiologicalSex,
    alcohol_grams: float,
    time_elapsed_hours: float,
) -> float:
    """
    Estimate BAC using Widmark formula (metric version).

    BAC = (alcohol_grams / (weight_kg * r)) - (beta * hours)

    Returns BAC as decimal (e.g. 0.08 = 0.08%)
    """
    r = R_MALE if sex == BiologicalSex.MALE else R_FEMALE

    peak_bac = alcohol_grams / (weight_kg * r)
    elimination = BETA_PER_HOUR * time_elapsed_hours

    bac = max(0.0, peak_bac - elimination)
    return round(bac, 4)


def compute_bac_result(
    weight_kg: float,
    sex: BiologicalSex,
    alcohol_grams: float,
    time_elapsed_minutes: float,
) -> BACResult:
    """
    Compute BAC and classify risk level.
    """
    hours = time_elapsed_minutes / 60.0
    bac = widmark_bac(weight_kg, sex, alcohol_grams, hours)

    if bac >= 0.12:
        status = BACStatus.RED
    elif bac >= 0.08:
        status = BACStatus.YELLOW
    else:
        status = BACStatus.GREEN

    return BACResult(
        bac=bac,
        status=status,
        notify_guardian=(status == BACStatus.RED),
    )