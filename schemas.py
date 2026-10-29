from datetime import date, datetime
from pydantic import BaseModel, ConfigDict

from app.models import PriorityLevel, RecurrenceType


# ---------- Category ----------
class CategoryBase(BaseModel):
    name: str
    color: str = "#6366f1"


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime


# ---------- Subtask ----------
class SubtaskBase(BaseModel):
    title: str
    is_completed: bool = False
    position: int = 0


class SubtaskCreate(SubtaskBase):
    pass


class SubtaskOut(SubtaskBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    task_id: str


# ---------- Task ----------
class TaskBase(BaseModel):
    title: str
    description: str | None = None
    category_id: str | None = None
    priority: PriorityLevel = PriorityLevel.MEDIUM
    due_date: date | None = None
    recurrence: RecurrenceType = RecurrenceType.NONE


class TaskCreate(TaskBase):
    subtasks: list[SubtaskCreate] = []


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category_id: str | None = None
    priority: PriorityLevel | None = None
    due_date: date | None = None
    recurrence: RecurrenceType | None = None
    is_completed: bool | None = None


class TaskOut(TaskBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    is_completed: bool
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime
    category: CategoryOut | None = None
    subtasks: list[SubtaskOut] = []


# ---------- Dashboard ----------
class TaskProgress(BaseModel):
    total: int
    completed: int
    percent_complete: float


class DashboardOut(BaseModel):
    todays_schedule: list[TaskOut]
    upcoming_deadlines: list[TaskOut]
    task_progress: TaskProgress
    motivational_quote: str
