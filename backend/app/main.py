import logging
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import create_client
from app.routers import bac, drinks, sobriety, users
from app.services.indexes import create_indexes

# --------------------
# Logging
# --------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --------------------
# Lifespan (startup / shutdown)
# --------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- MongoDB ----
    client = create_client()

    try:
        await client.admin.command("ping")
        logger.info("✅ Successfully connected to MongoDB")
    except Exception as e:
        logger.exception("❌ MongoDB connection failed")
        raise RuntimeError(
            "MongoDB connection failed. Check MONGODB_URI."
        ) from e

    # attach db to app state (THIS IS IMPORTANT)
    app.state.db = client.get_database("saferound")

    # create indexes once on startup
    await create_indexes(app.state.db)

    # ---- Shared HTTP client (Gemini, etc.) ----
    app.state.http_client = httpx.AsyncClient(timeout=30.0)

    yield  # ---- app runs here ----

    # ---- Shutdown cleanup ----
    await app.state.http_client.aclose()
    client.close()
    logger.info("🛑 Shutdown complete")

# --------------------
# App initialization
# --------------------
app = FastAPI(
    title="SafeRound API",
    description="Safety and drink validation backend",
    version="1.0.0",
    lifespan=lifespan,
)

# --------------------
# CORS Middleware (DO NOT REMOVE)
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # web dev
        "http://localhost:19006",     # expo web
        "http://127.0.0.1:19006",
        "http://10.186.38.91:19006",  # expo on phone
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⚠️ Dev-only shortcut (DO NOT SHIP):
# allow_origins=["*"]

# --------------------
# Routers
# --------------------
# app.include_router(drinks.router, prefix="/drinks", tags=["Drinks"])
# app.include_router(bac.router, prefix="/bac", tags=["BAC"])
# app.include_router(sobriety.router, prefix="/sobriety", tags=["Sobriety"])
# app.include_router(users.router, prefix="/users", tags=["Users"])

# --------------------
# Root & Health
# --------------------
@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "SafeRound API",
        "docs": "/docs",
        "health": "/health",
    }

@app.get("/health")
async def health():
    return {"status": "ok"}