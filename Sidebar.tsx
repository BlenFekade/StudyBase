interface Props {
  active: "dashboard" | "tasks";
  onNavigate: (view: "dashboard" | "tasks") => void;
}

export default function Sidebar({ active, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        Focus<span>Board</span>
      </div>
      <button
        className={`sidebar__nav-item ${active === "dashboard" ? "active" : ""}`}
        onClick={() => onNavigate("dashboard")}
      >
        Dashboard
      </button>
      <button
        className={`sidebar__nav-item ${active === "tasks" ? "active" : ""}`}
        onClick={() => onNavigate("tasks")}
      >
        Tasks
      </button>
    </aside>
  );
}
