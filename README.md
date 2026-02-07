# SafeRound – Drunk-Friendly Safety App

High-contrast safety app: NFC drink validation, Widmark BAC, physics-based sobriety tests (Gemini AI), Life360 deep linking, and session archiving to Snowflake.

## Tech Stack

- **Frontend:** React Native (Expo Router) + NativeWind (Tailwind)
- **Backend:** FastAPI (Python) + Motor (async MongoDB Atlas)
- **Sensors:** react-native-nfc-manager, expo-sensors (Accelerometer)
- **AI:** Google Gemini API
- **External:** Life360 deep linking
- **Archive:** Snowflake (script: `scripts/archive_session.py`)

## Design: Neon Night

- **Background:** `#000000`
- **Safe actions:** Neon Green `#39FF14`
- **Alerts / emergency:** Neon Pink `#FF10F0`
- Large, high-contrast buttons and text; minimal navigation for impaired motor skills.

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -e .
cp .env.example .env    # set MONGODB_URI, GOOGLE_GEMINI_API_KEY
uvicorn app.main:app --reload
```

- **MongoDB:** Create a `saferound` DB with collections: `users`, `drinks`. Seed a user with `user_id`, `is_cut_off`, etc.
- **Endpoints:**  
  - `POST /validate-drink` – drink validation (2-min cooldown, guardian block)  
  - `POST /bac/estimate` – Widmark BAC  
  - `POST /sobriety/assess` – Gemini sobriety from telemetry  
  - `GET/PUT /users/{user_id}`, `PATCH /users/{user_id}/cut-off`

### Mobile (Expo)

```bash
cd apps/mobile
npm install
# Set EXPO_PUBLIC_API_URL in .env or app.config.js to your FastAPI URL
npx expo start
```

- **NFC:** Use a physical device; simulator has no NFC.
- **Bartender mode:** Writes `drink_id` + `alcohol_grams` + timestamp to NDEF tag.
- **User scan:** Reads tag → `POST /validate-drink` → success or rejected (full-screen red strobe + X for bartender).

### Archive to Snowflake

```bash
# From repo root, with backend .env or env vars set
pip install pymongo snowflake-connector-python python-dotenv
python scripts/archive_session.py
```

Run on a schedule (e.g. daily) to move completed session/drink data from MongoDB to Snowflake.

## Features

1. **NFC Safety Handshake** – Bartender writes tag; user scans → validate with cooldown & cut-off.
2. **Widmark BAC** – Weight, sex, alcohol grams, time → BAC; Yellow >0.08, Red >0.12 (notify guardian).
3. **Sobriety tests** – Straight line (accelerometer 10s), reaction (tap dot 5×), typing; telemetry → Gemini → `sobriety_score`, `recommendation`, `is_emergency`.
4. **Life360** – “View Group on Life360” opens `life360://`.
5. **Ghosting** – Missed check-in 3 min → “Locate Friend”; 2 min later → mock emergency to primary contact.
6. **Data** – MongoDB for live data; Snowflake for archival via `archive_session.py`.

## License

Private / internal use.
