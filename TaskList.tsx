import { useEffect, useState } from "react";
import { TaskAPI, CategoryAPI } from "../api/client";
import type { Category, Task, TaskCreateInput } from "../types";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("active");

  async function refresh() {
    const [taskData, categoryData] = await Promise.all([TaskAPI.list(), CategoryAPI.list()]);
    setTasks(taskData);
    setCategories(categoryData);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(input: TaskCreateInput) {
    await TaskAPI.create(input);
    await refresh();
  }

  async function handleToggle(task: Task) {
    await TaskAPI.update(task.id, { is_completed: !task.is_completed });
    await refresh();
  }

  async function handleDelete(task: Task) {
    await TaskAPI.remove(task.id);
    await refresh();
  }

  const visible = tasks.filter((t) => {
    if (filter === "active") return !t.is_completed;
    if (filter === "completed") return t.is_completed;
    return true;
  });

  return (
    <>
      <h1>Tasks</h1>

      <div className="card">
        <div className="card__title">New task</div>
        <TaskForm categories={categories} onCreate={handleCreate} />
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="card__title" style={{ marginBottom: 0 }}>
            All tasks
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["active", "completed", "all"] as const).map((f) => (
              <button
                key={f}
                className="sidebar__nav-item"
                style={{
                  color: filter === f ? "var(--pine)" : "var(--ink-soft)",
                  background: filter === f ? "var(--pine-soft)" : "transparent",
                  fontSize: "0.8rem",
                  padding: "4px 10px",
                }}
                onClick={() => setFilter(f)}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="empty-state">Loading tasks…</div>}
        {!loading && visible.length === 0 && (
          <div className="empty-state">Nothing here yet. Add a task above to get started.</div>
        )}
        {visible.map((task) => (
          <TaskItem key={task.id} task={task} onToggleComplete={handleToggle} onDelete={handleDelete} />
        ))}
      </div>
    </>
  );
}
