from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, engine
from app.routers import tasks, categories, dashboard

settings = get_settings()

app = FastAPI(
    title="Productivity App API",
    description="Backend API for the productivity website (Dashboard + Task Management).",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGIN_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(categories.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def on_startup():
    # Creates tables if they don't already exist.
    # For production use, prefer Alembic migrations instead.
    Base.metadata.create_all(bind=engine)


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
