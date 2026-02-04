import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { serverEndpoint } from "../config/appConfig";
import { CLEAR_USER } from "../redux/user/action";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axios.post(
          `${serverEndpoint}/auth/logout`,
          {},
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        // Clear Redux state and redirect
        dispatch({ type: CLEAR_USER });
        navigate("/login");
      }
    };

    handleLogout();
  }, [dispatch, navigate]);

  return (
    <div className="container text-center mt-5">
      <p>Logging out...</p>
    </div>
  );
}

export default Logout;
