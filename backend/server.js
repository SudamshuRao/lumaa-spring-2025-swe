require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Define API Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// PostgreSQL Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Test database connection
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// Default API Route
app.get('/', (req, res) => {
    res.send('Task Manager Backend is Running');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
