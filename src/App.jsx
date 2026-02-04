import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import UserLayout from "./components/UserLayout";
import { serverEndpoint } from "./config/appConfig";
import { SET_USER } from "./redux/user/action";

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const [loading, setLoading] = useState(true);

  // ✅ Check login from cookie (JWT / refresh flow later)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.post(
          `${serverEndpoint}/auth/is-user-logged-in`,
          {},
          { withCredentials: true }
        );

        dispatch({
          type: SET_USER,
          payload: res.data.user,
        });
      } catch (error) {
        // user not logged in → do nothing (state remains null)
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Routes>
      {/* 🔐 LOGIN */}
      <Route
        path="/"
        element={
          userDetails ? <Navigate to="/dashboard" /> : <Login />
        }
      />

      {/* 📊 DASHBOARD (Protected + Layout) */}
      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <UserLayout>
              <Dashboard />
            </UserLayout>
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* 🚪 LOGOUT */}
      <Route
        path="/logout"
        element={
          userDetails ? <Logout /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
}

export default App;
