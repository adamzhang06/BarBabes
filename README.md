# SafeRound – Drunk-Friendly Safety App

A high-contrast mobile safety app for social drinking. SafeRound combines NFC drink validation, real-time BAC estimation, AI-powered sobriety assessment, and guardian notifications to help keep users safe on a night out.

## Features

- **NFC Drink Validation** — Bartenders write drink metadata (drink ID, alcohol grams, timestamp) to NFC tags. Users scan to validate drinks with a 2-minute cooldown and guardian-initiated cut-off blocking.
- **Widmark BAC Estimation** — Calculates blood alcohol content from weight, sex, alcohol consumed, and elapsed time. Color-coded status: Green (<0.08), Yellow (0.08–0.12), Red (>0.12).
- **AI Sobriety Assessment** — Runs physics-based tests using device sensors (accelerometer jitter, reaction time, typing accuracy) and sends telemetry to Google Gemini for scoring.
- **Guardian Notifications** — Alerts a primary contact when BAC exceeds dangerous levels (>0.12%).
- **Ghosting Prevention** — Automatic emergency notification if a user misses check-ins (3-minute warning, then 2-minute escalation).
- **Life360 Integration** — Deep links into the Life360 app for group location sharing.
- **Session Archiving** — Moves completed session data from MongoDB to Snowflake for long-term safety research.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React Native 0.81 · Expo 54 · Expo Router · NativeWind (Tailwind CSS) |
| **Backend** | Python 3.11+ · FastAPI · Uvicorn · Motor (async MongoDB) · Pydantic v2 |
| **Database** | MongoDB Atlas (live data) · Snowflake (archival) |
| **AI** | Google Gemini 1.5 Flash |
| **Sensors** | react-native-nfc-manager · expo-sensors (Accelerometer) |
| **External** | Life360 deep linking · httpx (async HTTP) |

## Design: Neon Night

The UI is designed for impaired motor skills — large, high-contrast buttons and minimal navigation.

| Role | Color |
|------|-------|
| Background | `#000000` (Black) |
| Safe actions | `#39FF14` (Neon Green) |
| Alerts / emergency | `#FF10F0` (Neon Pink) |

## Project Structure

```
BarBabes/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app & lifespan management
│   │   ├── config.py            # Settings (MongoDB, Gemini, Snowflake)
│   │   ├── db.py                # Motor client initialization
│   │   ├── models.py            # Pydantic request/response schemas
│   │   ├── widmark.py           # BAC calculation (Widmark formula)
│   │   ├── routers/
│   │   │   ├── drinks.py        # POST /validate-drink
│   │   │   ├── bac.py           # POST /bac/estimate
│   │   │   ├── sobriety.py      # POST /sobriety/assess
│   │   │   └── users.py         # User CRUD endpoints
│   │   └── services/
│   │       ├── drink_validation.py   # Cooldown & cut-off logic
│   │       ├── gemini_sobriety.py    # Gemini API integration
│   │       └── indexes.py           # MongoDB index creation
│   ├── pyproject.toml           # Project metadata & dependencies
│   ├── requirements.txt
│   ├── .env.example             # Environment variable template
│   └── seed_data.py             # Demo user seeding script
├── frontend/
│   ├── app/
│   │   ├── _layout.jsx          # Root Stack layout
│   │   ├── index.jsx            # Entry point (SignIn screen)
│   │   └── screens/
│   │       ├── User/
│   │       │   ├── SignIn.jsx    # Login (Google / email)
│   │       │   └── Profile.jsx  # Profile setup form
│   │       └── Profile/
│   │           └── index.jsx    # Profile display
│   ├── package.json
│   ├── app.json                 # Expo configuration
│   └── assets/                  # Icons & images
└── scripts/
    └── archive_session.py       # MongoDB → Snowflake migration
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- A MongoDB Atlas cluster
- A Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/))
- Snowflake account (optional, for archiving)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
# .venv\Scripts\activate         # Windows
pip install -e .
cp .env.example .env
```

Edit `.env` with your credentials:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/saferound?retryWrites=true&w=majority
GOOGLE_GEMINI_API_KEY=<your-key>
SNOWFLAKE_ACCOUNT=<account>       # optional
SNOWFLAKE_USER=<user>             # optional
SNOWFLAKE_PASSWORD=<password>     # optional
SNOWFLAKE_WAREHOUSE=COMPUTE_WH   # optional
SNOWFLAKE_DATABASE=SAFEROUND_ARCHIVE  # optional
SNOWFLAKE_SCHEMA=PUBLIC           # optional
```

Set up MongoDB:
1. Create a `saferound` database with collections `users` and `drinks`.
2. Optionally seed demo data: `python seed_data.py`

Start the server:

```bash
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Interactive docs are at `http://localhost:8000/docs`.

### Frontend (Expo)

```bash
cd frontend
npm install
npx expo start
```

Press **i** for iOS simulator, **a** for Android emulator, or **w** for web.

Set `EXPO_PUBLIC_API_URL` in a `.env` file or `app.config.js` to point to your FastAPI backend (e.g., `http://localhost:8000`).

> **Note:** NFC features require a physical device — simulators do not support NFC.

### Session Archiving (Snowflake)

```bash
pip install pymongo snowflake-connector-python python-dotenv
python scripts/archive_session.py
```

Run on a schedule (e.g., a daily cron job) to move completed session and drink data from MongoDB to Snowflake.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/validate-drink` | Validate a scanned drink (2-min cooldown, cut-off check) |
| `POST` | `/bac/estimate` | Calculate BAC using the Widmark formula |
| `POST` | `/sobriety/assess` | Assess sobriety from sensor telemetry via Gemini AI |
| `GET` | `/users/{user_id}` | Retrieve a user profile |
| `PUT` | `/users/{user_id}` | Create or fully update a user |
| `PATCH` | `/users/{user_id}/cut-off` | Toggle a user's cut-off status |
| `GET` | `/health` | Health check |

## How It Works

### NFC Drink Flow

1. **Bartender** writes drink info (drink ID, alcohol grams, timestamp) to an NDEF tag.
2. **User** scans the tag on their phone.
3. App calls `POST /validate-drink` — the server checks for a 2-minute cooldown and whether the user has been cut off by a guardian.
4. If accepted, the drink is logged. If rejected, a full-screen alert is shown (with a reason: `COOLDOWN` or `SERVICE_DENIED`).

### BAC Calculation

Uses the Widmark formula:

```
BAC = (alcohol_grams / (weight_kg × r)) − (0.015 × hours)
```

Where `r` = 0.68 (male) or 0.55 (female), and 0.015 is the hourly elimination rate.

### Sobriety Testing

Three sensor-based tests feed telemetry to Google Gemini 1.5 Flash:

1. **Straight line walk** — 10 seconds of accelerometer data measuring jitter.
2. **Reaction time** — Tap a dot 5 times; latencies are recorded.
3. **Typing test** — Error rate in a short typing exercise.

Gemini returns a `sobriety_score` (0–100), a `recommendation`, and an `is_emergency` flag. If the API fails, the system falls back to a neutral score of 50.

### Ghosting Prevention

- If a user misses a check-in for 3 minutes, a "Locate Friend" prompt appears.
- After 2 more minutes with no response, an emergency notification is sent to the user's primary contact.

## License

Private / internal use.
