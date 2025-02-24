import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Register User
export const registerUser = async (username: string, password: string) => {
    return api.post("/auth/register", { username, password });
};

// Login User
export const loginUser = async (username: string, password: string) => {
    return api.post("/auth/login", { username, password });
};

// Fetch Tasks
export const getTasks = async (token: string) => {
    return api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Create Task
export const createTask = async (token: string, title: string, description: string) => {
    return api.post("/tasks", { title, description }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Update Task
export const updateTask = async (token: string, taskId: number, updatedTask: { title: string; description: string; isComplete: boolean }) => {
    return api.put(`/tasks/${taskId}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Delete Task
export const deleteTask = async (token: string, taskId: number) => {
    return api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
