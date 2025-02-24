@echo off
echo Installing project dependencies...
npm install
echo Dependencies installed successfully!

echo Setting up database...
node scripts\db_migration.js
echo Database setup complete!

echo Starting the backend server...
npm run dev
