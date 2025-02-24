import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../styles/Tasks.css";

interface Task {
    id: number;
    title: string;
    description: string;
    isComplete: boolean;
    userId: number;
}

interface TasksProps {
    onLogout: () => void;
}

const Tasks: React.FC<TasksProps> = ({ onLogout }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editData, setEditData] = useState<{ title: string; description: string; isComplete: boolean }>({
        title: "",
        description: "",
        isComplete: false,
    });

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getTasks(token as string);
            const formattedTasks = response.data.map((task: any) => ({
                ...task,
                isComplete: Boolean(task.iscomplete),
            }));
            setTasks(formattedTasks);
        } catch {
            setError("Unable to load tasks. Please try again later.");
        }
    };

    const handleCreateTask = async () => {
        if (!token || !newTask.trim()) {
            setError("Task title cannot be empty.");
            return;
        }
        try {
            const response = await createTask(token, newTask, newDescription);
            setTasks((prevTasks) => [...prevTasks, response.data]);
            setNewTask("");
            setNewDescription("");
            setError(null);
        } catch {
            setError("Failed to add task. Please try again.");
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTaskId(task.id);
        setEditData({ title: task.title, description: task.description, isComplete: task.isComplete });
    };

    const handleUpdateTask = async (taskId: number) => {
        if (!token) return;
        try {
            await updateTask(token, taskId, editData);
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === taskId ? { ...task, ...editData } : task))
            );
            setEditingTaskId(null);
        } catch {
            setError("Unable to update task. Please try again.");
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!token) return;
        try {
            await deleteTask(token, taskId);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
            setError(null);
        } catch {
            setError("Unable to delete task. Please try again.");
        }
    };

    const handleLogout = () => {
        onLogout();
        navigate("/");
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            await handleCreateTask();
        }
    };

    return (
        <div className="tasks-container">
            <div className="tasks-box">
                <h2>Tasks</h2>
                {error && <p className="error-message">{error}</p>}
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>

                <div className="task-input-container">
                    <input
                        type="text"
                        placeholder="New Task Title"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <textarea
                        placeholder="New Task Description"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <button onClick={handleCreateTask}>Add Task</button>
                </div>

                <ul className="task-list">
                    {tasks.map((task) => (
                        <li key={task.id} className="task-item">
                            {editingTaskId === task.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    />
                                    <textarea
                                        value={editData.description}
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    />
                                    <select
                                        value={editData.isComplete ? "Completed" : "Pending"}
                                        onChange={(e) =>
                                            setEditData({ ...editData, isComplete: e.target.value === "Completed" })
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <button className="save-button" onClick={() => handleUpdateTask(task.id)}>
                                        <FontAwesomeIcon icon={faSave} /> Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span><strong>Title:</strong> {task.title}</span>
                                    <span><strong>Description:</strong> {task.description}</span>
                                    <span><strong>Status:</strong>
                                        <span className={`task-status ${task.isComplete ? "completed" : "pending"}`}>{task.isComplete ? "Completed" : "Pending"}</span>
                                    </span>
                                    <div className="task-actions">
                                        <button className="edit-button" onClick={() => handleEditTask(task)}>
                                            <FontAwesomeIcon icon={faPencilAlt} /> Edit
                                        </button>
                                        <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>
                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Tasks;
