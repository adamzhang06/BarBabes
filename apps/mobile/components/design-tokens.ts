/**
 * Neon Night Design System – SafeRound
 * High-contrast, drunk-friendly UI.
 */
export const colors = {
  background: "#000000",
  surface: "#0a0a0a",
  safe: "#39FF14",   // Neon green – safe actions
  alert: "#FF10F0",  // Neon pink – alerts / emergency
  rejected: "#FF3333",
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.7)",
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: "700" as const },
  headline: { fontSize: 24, fontWeight: "700" as const },
  body: { fontSize: 20, fontWeight: "500" as const },
  button: { fontSize: 24, fontWeight: "700" as const },
  largeButton: { fontSize: 28, fontWeight: "700" as const },
};

export const spacing = {
  touchTarget: 56,
  screenPadding: 24,
  cardPadding: 20,
};
