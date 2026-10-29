import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TaskList from "./components/TaskList";

export default function App() {
  const [view, setView] = useState<"dashboard" | "tasks">("dashboard");

  return (
    <div className="app-shell">
      <Sidebar active={view} onNavigate={setView} />
      <main className="main">{view === "dashboard" ? <Dashboard /> : <TaskList />}</main>
    </div>
  );
}
