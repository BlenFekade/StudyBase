export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type RecurrenceType = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  position: number;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  category: Category | null;
  priority: PriorityLevel;
  due_date: string | null;
  recurrence: RecurrenceType;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  subtasks: Subtask[];
}

export interface TaskCreateInput {
  title: string;
  description?: string | null;
  category_id?: string | null;
  priority?: PriorityLevel;
  due_date?: string | null;
  recurrence?: RecurrenceType;
  subtasks?: { title: string; is_completed?: boolean; position?: number }[];
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  category_id?: string | null;
  priority?: PriorityLevel;
  due_date?: string | null;
  recurrence?: RecurrenceType;
  is_completed?: boolean;
}

export interface TaskProgress {
  total: number;
  completed: number;
  percent_complete: number;
}

export interface Dashboard {
  todays_schedule: Task[];
  upcoming_deadlines: Task[];
  task_progress: TaskProgress;
  motivational_quote: string;
}
