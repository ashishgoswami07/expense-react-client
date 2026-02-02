import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check if user already logged in (JWT cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5001/auth/is-user-logged-in",
          {},
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Routes>
      {/* 🔐 LOGIN */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login setUser={setUser} />   // ✅ IMPORTANT
          )
        }
      />

      {/* 📊 DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard user={user} setUser={setUser} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;
