from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import settings
from app.db import close_db, get_db
from app.routers import bac, drinks, sobriety, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_db()
    yield
    await close_db()


app = FastAPI(
    title="SafeRound API",
    description="Safety and drink validation backend",
    lifespan=lifespan,
)

app.include_router(drinks.router)
app.include_router(bac.router)
app.include_router(sobriety.router)
app.include_router(users.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
