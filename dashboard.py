import random

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

QUOTES = [
    "The secret of getting ahead is getting started.",
    "Done is better than perfect.",
    "Focus on being productive instead of busy.",
    "Small daily improvements lead to stunning results.",
    "You don't have to be great to start, but you have to start to be great.",
]


@router.get("", response_model=schemas.DashboardOut)
def get_dashboard(db: Session = Depends(get_db)):
    return schemas.DashboardOut(
        todays_schedule=crud.get_todays_schedule(db),
        upcoming_deadlines=crud.get_upcoming_deadlines(db),
        task_progress=crud.get_task_progress(db),
        motivational_quote=random.choice(QUOTES),
    )
