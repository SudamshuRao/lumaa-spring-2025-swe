#!/bin/bash

echo "Installing project dependencies..."
npm install
echo "Dependencies installed successfully!"

# Run the migration script
echo "Setting up database..."
node scripts/db_migration.js
echo "Database setup complete!"

# Start the backend server
echo "Starting the backend server..."
npm run dev
