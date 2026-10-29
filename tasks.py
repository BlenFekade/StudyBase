from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas, models
from app.database import get_db

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=list[schemas.TaskOut])
def list_tasks(
    category_id: str | None = None,
    is_completed: bool | None = None,
    priority: models.PriorityLevel | None = None,
    db: Session = Depends(get_db),
):
    return crud.list_tasks(db, category_id=category_id, is_completed=is_completed, priority=priority)


@router.post("", response_model=schemas.TaskOut, status_code=201)
def create_task(payload: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, payload)


@router.get("/{task_id}", response_model=schemas.TaskOut)
def get_task(task_id: str, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: str, payload: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = crud.update_task(db, task_id, payload)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    if not crud.delete_task(db, task_id):
        raise HTTPException(status_code=404, detail="Task not found")


@router.post("/{task_id}/subtasks", response_model=schemas.SubtaskOut, status_code=201)
def add_subtask(task_id: str, payload: schemas.SubtaskCreate, db: Session = Depends(get_db)):
    subtask = crud.add_subtask(db, task_id, payload)
    if not subtask:
        raise HTTPException(status_code=404, detail="Task not found")
    return subtask


@router.patch("/subtasks/{subtask_id}/toggle", response_model=schemas.SubtaskOut)
def toggle_subtask(subtask_id: str, db: Session = Depends(get_db)):
    subtask = crud.toggle_subtask(db, subtask_id)
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    return subtask


@router.delete("/subtasks/{subtask_id}", status_code=204)
def delete_subtask(subtask_id: str, db: Session = Depends(get_db)):
    if not crud.delete_subtask(db, subtask_id):
        raise HTTPException(status_code=404, detail="Subtask not found")
