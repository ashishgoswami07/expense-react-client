import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";
import { useDispatch } from "react-redux";
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
        console.log(error);
      } finally {
        dispatch({ type: CLEAR_USER });
        navigate("/login");
      }
    };

    handleLogout();
  }, [dispatch, navigate]);

  return <p>Logging out...</p>;
}

export default Logout;
