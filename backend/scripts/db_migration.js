const { Pool, Client } = require('pg');
const config = require('../config'); // Import centralized database config

const client = new Client({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: "postgres",
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
});

const createDatabaseAndTables = async () => {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL default database.");

        // Check if `taskdb` exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${config.DB_NAME}';`);
        if (res.rowCount === 0) {
            console.log(`Database '${config.DB_NAME}' does not exist. Creating now...`);
            await client.query(`CREATE DATABASE ${config.DB_NAME};`);
            console.log(`Database '${config.DB_NAME}' created successfully.`);
        } else {
            console.log(`Database '${config.DB_NAME}' already exists.`);
        }

        await client.end(); // Close initial connection

        // Connect to `taskdb`
        const pool = new Pool({ connectionString: config.DATABASE_URL });

        // Create tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                isComplete BOOLEAN DEFAULT false,
                userId INT REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        console.log("Database and tables setup complete!");
        pool.end();
    } catch (err) {
        console.error("Error during database setup:", err);
    }
};

// Run the migration script
createDatabaseAndTables();
