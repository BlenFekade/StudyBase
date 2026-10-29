import type { Task } from "../types";

interface Props {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

function formatDate(d: string | null): string | null {
  if (!d) return null;
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function TaskItem({ task, onToggleComplete, onDelete }: Props) {
  const due = formatDate(task.due_date);

  return (
    <div className="task-row">
      <input
        type="checkbox"
        className="task-row__checkbox"
        checked={task.is_completed}
        onChange={() => onToggleComplete(task)}
      />
      <div>
        <div className={`task-row__title ${task.is_completed ? "done" : ""}`}>
          {task.title}
        </div>
        <div className="task-row__meta">
          <span className={`pill pill--${task.priority}`}>{task.priority}</span>
          {task.category && <span>{task.category.name}</span>}
          {due && <span>Due {due}</span>}
          {task.subtasks.length > 0 && (
            <span>
              {task.subtasks.filter((s) => s.is_completed).length}/{task.subtasks.length} subtasks
            </span>
          )}
        </div>
      </div>
      {onDelete && (
        <button className="task-row__delete" onClick={() => onDelete(task)} title="Delete task">
          ✕
        </button>
      )}
    </div>
  );
}
