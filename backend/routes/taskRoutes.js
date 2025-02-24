const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// Get Tasks
router.get('/', authenticate, async (req, res) => {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
});

// Create Task
router.post('/', authenticate, async (req, res) => {
    const { title, description } = req.body;
    const result = await pool.query(
        "INSERT INTO tasks (title, description, userId) VALUES ($1, $2, $3) RETURNING *",
        [title, description, req.userId]
    );
    res.status(201).json(result.rows[0]);
});

// Update Task
router.put('/:id', authenticate, async (req, res) => {
    const taskId = req.params.id;
    const { title, description, isComplete } = req.body;

    try {
        // Check if task exists
        const checkTask = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskId]);
        if (checkTask.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Update task
        const updatedTask = await pool.query(
            "UPDATE tasks SET title = $1, description = $2, isComplete = $3 WHERE id = $4 RETURNING *",
            [title, description, isComplete, taskId]
        );

        res.json(updatedTask.rows[0]);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Unable to update task. Please try again." });
    }
});

// Delete Task
router.delete('/:id', authenticate, async (req, res) => {
    const taskId = req.params.id;

    try {
        // Check if task exists
        const checkTask = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskId]);
        if (checkTask.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Delete the task
        await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

module.exports = router;
