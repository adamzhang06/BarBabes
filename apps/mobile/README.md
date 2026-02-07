# SafeRound Mobile (Expo)

## Setup

1. `npm install`
2. Add `assets/icon.png` (1024×1024 recommended) or run once: `npx create-expo-app _tmp --template blank && cp _tmp/assets/icon.png assets/ 2>/dev/null || true`
3. Create `.env` with `EXPO_PUBLIC_API_URL=http://YOUR_BACKEND_URL` (e.g. your machine IP for device: `http://192.168.1.x:8000`).
4. `npx expo start` — use a physical device for NFC.

## NFC

- **Bartender:** Writes `drink_id`, `alcohol_grams`, timestamp to NDEF.
- **User:** Scans tag → POST `/validate-drink` → success or rejected (red strobe + X).

## Life360

The "View Group on Life360" button opens `life360://`. Install Life360 on the device for deep link to work.
