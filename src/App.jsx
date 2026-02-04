import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import UserLayout from "./components/UserLayout";
import { serverEndpoint } from "./config/appConfig";

function App() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check if user already logged in (JWT cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.post(
          `${serverEndpoint}/auth/is-user-logged-in`,
          {},
          { withCredentials: true }
        );
        setUserDetails(res.data.user);
      } catch (err) {
        setUserDetails(null);
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
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login setUser={setUserDetails} />
          )
        }
      />

      {/* 📊 DASHBOARD (Protected + Layout) */}
      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <UserLayout user={userDetails}>
              <Dashboard user={userDetails} />
            </UserLayout>
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* 🚪 LOGOUT */}
      <Route
        path="/logout"
        element={<Logout setUser={setUserDetails} />}
      />
    </Routes>
  );
}

export default App;
