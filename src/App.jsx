<<<<<<< HEAD
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
=======
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./components/AppLayout";
function App() {
    //value of useradetails represent whether
    const [userDetails, setUserDetails] = useState(null);

    return (
        <Routes>
            <Route path="/" element={userDetails ? (<Navigate to="/dashboard"/>):(
                <AppLayout>
                    <Home />
                </AppLayout>
            )
            }/>
            <Route path="/login" element={userDetails ? (<Navigate to="/dashboard"/>):(
                <AppLayout>
                    <Login setUser={setUserDetails}/>
                </AppLayout>
            )
            }/>
            <Route path="/dashboard"element={
                userDetails?(<Dashboard user={userDetails}/>):(
                    <Navigate to="/login"/>
                )
            }
            />
        </Routes>
    );
}
    
export default App;
>>>>>>> 12c0b2c51e84a22e48010364432d41959c682335
