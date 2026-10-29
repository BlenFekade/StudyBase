from datetime import date, datetime, timedelta

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app import models, schemas


# ---------- Categories ----------
def list_categories(db: Session) -> list[models.Category]:
    return db.scalars(select(models.Category).order_by(models.Category.name)).all()


def create_category(db: Session, payload: schemas.CategoryCreate) -> models.Category:
    category = models.Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: str) -> bool:
    category = db.get(models.Category, category_id)
    if not category:
        return False
    db.delete(category)
    db.commit()
    return True


# ---------- Tasks ----------
def list_tasks(
    db: Session,
    category_id: str | None = None,
    is_completed: bool | None = None,
    priority: models.PriorityLevel | None = None,
) -> list[models.Task]:
    stmt = select(models.Task)
    if category_id:
        stmt = stmt.where(models.Task.category_id == category_id)
    if is_completed is not None:
        stmt = stmt.where(models.Task.is_completed == is_completed)
    if priority:
        stmt = stmt.where(models.Task.priority == priority)
    stmt = stmt.order_by(models.Task.due_date.is_(None), models.Task.due_date)
    return db.scalars(stmt).unique().all()


def get_task(db: Session, task_id: str) -> models.Task | None:
    return db.get(models.Task, task_id)


def create_task(db: Session, payload: schemas.TaskCreate) -> models.Task:
    data = payload.model_dump(exclude={"subtasks"})
    task = models.Task(**data)
    task.subtasks = [
        models.Subtask(**sub.model_dump()) for sub in payload.subtasks
    ]
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task_id: str, payload: schemas.TaskUpdate) -> models.Task | None:
    task = db.get(models.Task, task_id)
    if not task:
        return None

    update_data = payload.model_dump(exclude_unset=True)
    was_completed = task.is_completed

    for field, value in update_data.items():
        setattr(task, field, value)

    if "is_completed" in update_data:
        if update_data["is_completed"] and not was_completed:
            task.completed_at = datetime.utcnow()
        elif not update_data["is_completed"]:
            task.completed_at = None

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: str) -> bool:
    task = db.get(models.Task, task_id)
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True


# ---------- Subtasks ----------
def add_subtask(db: Session, task_id: str, payload: schemas.SubtaskCreate) -> models.Subtask | None:
    task = db.get(models.Task, task_id)
    if not task:
        return None
    subtask = models.Subtask(task_id=task_id, **payload.model_dump())
    db.add(subtask)
    db.commit()
    db.refresh(subtask)
    return subtask


def toggle_subtask(db: Session, subtask_id: str) -> models.Subtask | None:
    subtask = db.get(models.Subtask, subtask_id)
    if not subtask:
        return None
    subtask.is_completed = not subtask.is_completed
    db.commit()
    db.refresh(subtask)
    return subtask


def delete_subtask(db: Session, subtask_id: str) -> bool:
    subtask = db.get(models.Subtask, subtask_id)
    if not subtask:
        return False
    db.delete(subtask)
    db.commit()
    return True


# ---------- Dashboard ----------
def get_todays_schedule(db: Session) -> list[models.Task]:
    today = date.today()
    stmt = (
        select(models.Task)
        .where(models.Task.due_date == today)
        .where(models.Task.is_completed == False)  # noqa: E712
        .order_by(models.Task.priority)
    )
    return db.scalars(stmt).unique().all()


def get_upcoming_deadlines(db: Session, days_ahead: int = 7) -> list[models.Task]:
    today = date.today()
    horizon = today + timedelta(days=days_ahead)
    stmt = (
        select(models.Task)
        .where(models.Task.due_date > today)
        .where(models.Task.due_date <= horizon)
        .where(models.Task.is_completed == False)  # noqa: E712
        .order_by(models.Task.due_date)
    )
    return db.scalars(stmt).unique().all()


def get_task_progress(db: Session) -> schemas.TaskProgress:
    total = db.scalar(select(func.count()).select_from(models.Task)) or 0
    completed = (
        db.scalar(
            select(func.count()).select_from(models.Task).where(models.Task.is_completed == True)  # noqa: E712
        )
        or 0
    )
    percent = (completed / total * 100) if total else 0.0
    return schemas.TaskProgress(total=total, completed=completed, percent_complete=round(percent, 1))
