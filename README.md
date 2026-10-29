# Productivity App — Phase 1 (MVP)

Full-stack scaffold: **FastAPI (Python) backend** + **React/TypeScript frontend**, backed by **SQL Server**.

Implements the Phase 1 MVP:
- **Dashboard** — today's schedule, upcoming deadlines, task progress (with a progress ring), motivational quote
- **Task Management** — create/edit/delete tasks, categories, priority levels, due dates, recurring tasks, subtasks

```
productivity-app/
├── backend/           FastAPI + SQLAlchemy + SQL Server
│   └── app/
│       ├── main.py         # app entrypoint, CORS, router registration
│       ├── config.py       # settings loaded from .env
│       ├── database.py     # SQLAlchemy engine/session
│       ├── models.py       # Task, Category, Subtask ORM models
│       ├── schemas.py      # Pydantic request/response models
│       ├── crud.py         # DB access logic
│       └── routers/        # /api/tasks, /api/categories, /api/dashboard
├── frontend/          React + TypeScript (Vite)
│   └── src/
│       ├── components/     # Dashboard, TaskList, TaskForm, TaskItem, Sidebar
│       ├── api/client.ts   # typed API client (axios)
│       └── types/          # shared TS types matching backend schemas
└── docker-compose.yml # local SQL Server for development
```

## 1. Database (SQL Server)

Fastest path — run SQL Server locally with Docker:

```bash
docker compose up -d
```

Then create the database (the app creates tables automatically, but not the database itself):

```bash
docker exec -it productivity-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'YourStrong@Passw0rd' -C \
  -Q "CREATE DATABASE ProductivityDB"
```

Already have SQL Server (local install, Azure SQL, etc.)? Just point `backend/.env` at it — no Docker needed.

## 2. Backend

Requires the [ODBC Driver 18 for SQL Server](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server) installed on your machine.

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # edit with your SQL Server credentials
uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

Tables are auto-created on startup via `Base.metadata.create_all`. For anything beyond local dev, switch to **Alembic** migrations (already in requirements.txt) instead.

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173
- Vite proxies `/api/*` to `http://localhost:8000`, so no CORS config needed in dev.

## API overview

| Method | Endpoint                          | Purpose                          |
|--------|------------------------------------|-----------------------------------|
| GET    | `/api/dashboard`                   | Schedule, deadlines, progress, quote |
| GET    | `/api/tasks`                       | List tasks (filter by category/status/priority) |
| POST   | `/api/tasks`                       | Create task (+ optional subtasks) |
| PATCH  | `/api/tasks/{id}`                  | Update / complete a task |
| DELETE | `/api/tasks/{id}`                  | Delete a task |
| POST   | `/api/tasks/{id}/subtasks`         | Add a subtask |
| PATCH  | `/api/tasks/subtasks/{id}/toggle`  | Toggle subtask completion |
| GET    | `/api/categories`                  | List categories |
| POST   | `/api/categories`                  | Create category |

## Notes on "recurring tasks"

The MVP stores a `recurrence` field (`DAILY` / `WEEKLY` / `MONTHLY` / `YEARLY`) on each task. Actually *spawning* the next occurrence when a recurring task is completed is a natural Phase 2 addition — e.g. a small check in the `PATCH /api/tasks/{id}` handler that creates the next instance when `is_completed` flips to `true` and `recurrence != NONE`.

## Suggested next phases

- Auth (JWT) + per-user data scoping
- Weather widget (call a weather API from the dashboard endpoint)
- Notifications/reminders for due dates
- Calendar view, drag-and-drop reordering
- Alembic migrations instead of `create_all`
