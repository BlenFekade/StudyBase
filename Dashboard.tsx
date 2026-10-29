import { useEffect, useState } from "react";
import { DashboardAPI, TaskAPI } from "../api/client";
import type { Dashboard as DashboardData, Task } from "../types";
import TaskItem from "./TaskItem";

function ProgressRing({ percent }: { percent: number }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg className="progress-ring" width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={radius} fill="none" stroke="var(--line)" strokeWidth="10" />
      <circle
        cx="55"
        cy="55"
        r={radius}
        fill="none"
        stroke="var(--pine)"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
      />
      <text x="55" y="61" textAnchor="middle" fontSize="20" fontWeight="600">
        {Math.round(percent)}%
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  async function refresh() {
    setData(await DashboardAPI.get());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleToggle(task: Task) {
    await TaskAPI.update(task.id, { is_completed: !task.is_completed });
    await refresh();
  }

  if (!data) return <div className="empty-state">Loading dashboard…</div>;

  return (
    <>
      <h1>Good to see you</h1>
      <div className="quote-banner">&ldquo;{data.motivational_quote}&rdquo;</div>

      <div className="dashboard-grid">
        <div>
          <div className="card">
            <div className="card__title">Today&rsquo;s schedule</div>
            {data.todays_schedule.length === 0 && (
              <div className="empty-state">Nothing due today. Enjoy the clear runway.</div>
            )}
            {data.todays_schedule.map((task) => (
              <TaskItem key={task.id} task={task} onToggleComplete={handleToggle} />
            ))}
          </div>

          <div className="card">
            <div className="card__title">Upcoming deadlines</div>
            {data.upcoming_deadlines.length === 0 && (
              <div className="empty-state">Nothing on the horizon this week.</div>
            )}
            {data.upcoming_deadlines.map((task) => (
              <TaskItem key={task.id} task={task} onToggleComplete={handleToggle} />
            ))}
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card__title">Task progress</div>
            <div className="progress-ring-wrap">
              <ProgressRing percent={data.task_progress.percent_complete} />
              <div className="progress-stats">
                {data.task_progress.completed} / {data.task_progress.total} complete
                <br />
                {data.task_progress.total - data.task_progress.completed} remaining
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
