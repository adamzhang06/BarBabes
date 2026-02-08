"""
Widmark formula for estimated Blood Alcohol Content (BAC).

BAC = (A * 5.14 / W * r) - (0.015 * H)
- A = total alcohol consumed (oz of pure alcohol) -> we use grams, convert appropriately
- W = body weight (lb) -> we use kg
- r = alcohol distribution ratio: 0.73 male, 0.66 female
- H = hours since first drink

Using grams and kg:
  alcohol_oz_pure = alcohol_grams / 28.3495  (grams to oz)
  W_lb = weight_kg * 2.20462
  So: BAC = (alcohol_grams/28.3495 * 5.14 / (weight_kg*2.20462) * r) - (0.015 * H)

Simplified with grams and kg (Widmark in metric):
  BAC ≈ (alcohol_grams / (weight_kg * r_metric)) - (0.015 * H)
  where r_metric is in kg: male ~0.68, female ~0.55 (empirically scaled from oz/lb).
  
Standard Widmark: BAC = (grams_ethanol / (weight_kg * r)) - (beta * hours)
  r (distribution): male 0.7, female 0.6
  beta (elimination): ~0.015 per hour
"""
from app.models import BACResult, BACStatus, BiologicalSex


# Widmark r factor (volume of distribution): grams per kg body weight per unit BAC
# Male ~0.68, Female ~0.55 (ethanol density and body water %)
R_MALE = 0.68
R_FEMALE = 0.55
BETA_PER_HOUR = 0.015  # average elimination rate


def widmark_bac(
    weight_kg: float,
    sex: BiologicalSex,
    alcohol_grams: float,
    time_elapsed_hours: float,
) -> float:
    """
    Estimate BAC using Widmark formula.
    weight_kg: body weight in kg
    sex: BiologicalSex
    alcohol_grams: total ethanol in grams
    time_elapsed_hours: hours since consumption started (for elimination)
    Returns BAC as decimal (e.g. 0.08 = 0.08%).
    """
    r = R_MALE if sex == BiologicalSex.MALE else R_FEMALE
    # Peak BAC from dose (no time): grams / (weight_kg * r) gives approximate BAC
    # Standard form: BAC = (A / (W * r)) - (beta * t)
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
    """Compute BAC and return status (green/yellow/red) and guardian notification flag."""
    hours = time_elapsed_minutes / 60.0
    bac = widmark_bac(weight_kg, sex, alcohol_grams, hours)
    status = BACStatus.GREEN
    if bac > 0.12:
        status = BACStatus.RED
    elif bac > 0.08:
        status = BACStatus.YELLOW
    return BACResult(
        bac=bac,
        status=status,
        notify_guardian=(status == BACStatus.RED),
    )