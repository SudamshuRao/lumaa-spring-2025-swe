import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import { useEffect, useState } from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); // Updates state when token changes
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        setIsAuthenticated(false); // Update state
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes (Only accessible when NOT logged in) */}
                <Route path="/" element={!isAuthenticated ? <Login onAuthChange={checkAuthStatus} /> : <Navigate to="/tasks" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/tasks" />} />

                {/* Protected Routes (Only accessible when logged in) */}
                <Route path="/tasks" element={isAuthenticated ? <Tasks onLogout={handleLogout} /> : <Navigate to="/" />} />

                {/* Catch-All Redirect */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/tasks" : "/"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
