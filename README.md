# **README: Full-Stack Task Management App**
This README provides step-by-step instructions for setting up, running, and testing both the **backend** and **frontend**.

Project Directory Structure:

```
task_manager/
│── backend/            # All files for the Node.js backend
│   ├── scripts/        # Automated Set Up for backend
|   └── .env            # Environment Variables to be set by User
│── frontend/           # All files for the React frontend
|   └── .env            # Environment Variables to be set by User
│── demo.md             # Screen recording of the demo
└── README.md           # This file
```

---

# **Task Management App**
A **full-stack task management application** built using:
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + PostgreSQL
- **Authentication:** JWT (JSON Web Tokens), bcrypt
- **Database:** PostgreSQL

**Note:** Application allows all authenticated users to update any task, even if user has not created the task.

---

## **0. Install Prerequisites**

Ensure you have the following installed:

- Node.js
- PostgreSQL
- Git

Verify using CLI:
```sh
node -v
npm -v
psql --version
git --version
```

PostgreSQL may not be added to path, and hence the `psql` command may not work.

---

## **1. Environment Variables**
To run this project, **create a `.env` file** in both the **backend** and **frontend** folders.

## **Backend (`backend/.env`)**
```
# Server Configuration
PORT=5000

# PostgreSQL Configuration
DB_NAME=taskdb
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/taskdb

# JWT Secret Key (for authentication)
JWT_SECRET=your_secret_key
```
🔹 **Make sure `DATABASE_URL` matches your PostgreSQL credentials.**

---

## **Frontend (`frontend/.env`)**
```
# API URL (connect to the Backend)
VITE_API_URL=http://localhost:5000
```
🔹 **Modify this URL if running the backend on a different port or deploying.**

---

## **2. Setting Up the Backend (Node.js, PostgreSQL)**

## **Method 1: Automated Setup (Recommended)**
The backend setup is fully automated using a **shell script (for Linux/macOS) or a batch script (for Windows)**.

### **🔹 For Linux/macOS**
```sh
cd backend
bash scripts/setup_backend.sh
```

### **🔹 For Windows**
```sh
cd backend
scripts\setup_backend.bat
```
**This will:**
1. **Install dependencies (`npm install`)**
2. **Run database migrations (`node scripts/db_migration.js`)**
3. **Start the backend (`npm run dev`)** on `http://localhost:5000/`

---

## **Method 2: Manual Setup**
### **Step 1: Install Dependencies**
Navigate to the backend folder and install dependencies:
```sh
cd backend
npm install
```

---

### **Step 2: Run Database Migrations**
Ensure PostgreSQL is running, then create the database and tables:
```sh
node scripts/db_migration.js
```
**This will create the `taskdb` database and necessary tables (`users`, `tasks`).**

---

### **Step 3: Start the Backend Server**
Run the backend in development mode:
```sh
npm run dev
```
**The server should now be running on `http://localhost:5000/`.**

---

## **3. Setting Up the Frontend (React, TypeScript, Vite)**

### **Step 1: Install Dependencies**
Navigate to the frontend folder and install dependencies:
```sh
cd frontend
npm install
```

---

### **Step 2: Point Frontend to Backend**
Ensure **`frontend/.env`** is correctly set:
```
VITE_API_URL=http://localhost:5000
```
**This allows the frontend to communicate with the backend.**

---

### **Step 3: Start the Frontend**
Run:
```sh
npm run dev
```
**The frontend should now be available at `http://localhost:5173/`.**

---

## **4. Testing the Application**
### **Step 1: Register a User**
Use **Postman** or `curl` to create a new user:
```sh
curl -X POST http://localhost:5000/auth/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'
```
**Response should return a success message.**

---

### **Step 2: Log In**
```sh
curl -X POST http://localhost:5000/auth/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'
```
**Response should return a JWT token.**

---

### **Step 3: Create a Task**
```sh
curl -X POST http://localhost:5000/tasks -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json" -d '{"title":"New Task", "description":"Task Description"}'
```
**Response should return the created task.**

---

### **Step 4: Fetch Tasks**
```sh
curl -X GET http://localhost:5000/tasks -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response should return a list of tasks.**

---

### **Step 5: Update a Task**
```sh
curl -X PUT http://localhost:5000/tasks/1 -H "Authorization: Bearer YOUR_JWT_TOKEN" -H "Content-Type: application/json" -d '{"title":"Updated Task", "description":"Updated Description", "isComplete":true}'
```
**Response should return the updated task.**

---

### **Step 6: Delete a Task**
```sh
curl -X DELETE http://localhost:5000/tasks/1 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response should confirm deletion.**

---

## **5. Contributors**
- **Developer**: Sudamshu
- **Salary Expectation**: 2800$ - 4200$

---
