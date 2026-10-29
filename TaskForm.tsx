import { useState } from "react";
import type { Category, PriorityLevel, RecurrenceType, TaskCreateInput } from "../types";

interface Props {
  categories: Category[];
  onCreate: (input: TaskCreateInput) => Promise<void>;
}

export default function TaskForm({ categories, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("NONE");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function addSubtask() {
    const trimmed = subtaskInput.trim();
    if (!trimmed) return;
    setSubtasks((prev) => [...prev, trimmed]);
    setSubtaskInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() || null,
        category_id: categoryId || null,
        priority,
        due_date: dueDate || null,
        recurrence,
        subtasks: subtasks.map((t, i) => ({ title: t, position: i })),
      });
      setTitle("");
      setDescription("");
      setCategoryId("");
      setPriority("MEDIUM");
      setDueDate("");
      setRecurrence("NONE");
      setSubtasks([]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="full">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to get done?"
          required
        />
      </div>

      <div className="full">
        <label>Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
        />
      </div>

      <div>
        <label>Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">None</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value as PriorityLevel)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div>
        <label>Due date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <div>
        <label>Repeats</label>
        <select value={recurrence} onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}>
          <option value="NONE">Does not repeat</option>
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>

      <div className="full">
        <label>Subtasks</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            placeholder="Add a subtask and press Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSubtask();
              }
            }}
          />
        </div>
        {subtasks.map((s, i) => (
          <div className="subtask-row" key={i}>
            • {s}
          </div>
        ))}
      </div>

      <div className="full">
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add task"}
        </button>
      </div>
    </form>
  );
}
