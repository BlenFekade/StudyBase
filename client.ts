import axios from "axios";
import type {
  Task,
  TaskCreateInput,
  TaskUpdateInput,
  Category,
  Dashboard,
} from "../types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const DashboardAPI = {
  get: async (): Promise<Dashboard> => (await api.get("/dashboard")).data,
};

export const TaskAPI = {
  list: async (): Promise<Task[]> => (await api.get("/tasks")).data,
  get: async (id: string): Promise<Task> => (await api.get(`/tasks/${id}`)).data,
  create: async (payload: TaskCreateInput): Promise<Task> =>
    (await api.post("/tasks", payload)).data,
  update: async (id: string, payload: TaskUpdateInput): Promise<Task> =>
    (await api.patch(`/tasks/${id}`, payload)).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
  toggleSubtask: async (subtaskId: string) =>
    (await api.patch(`/tasks/subtasks/${subtaskId}/toggle`)).data,
  addSubtask: async (taskId: string, title: string) =>
    (await api.post(`/tasks/${taskId}/subtasks`, { title })).data,
};

export const CategoryAPI = {
  list: async (): Promise<Category[]> => (await api.get("/categories")).data,
  create: async (name: string, color = "#6366f1"): Promise<Category> =>
    (await api.post("/categories", { name, color })).data,
  remove: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export default api;
