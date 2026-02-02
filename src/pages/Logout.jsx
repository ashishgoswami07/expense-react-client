import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await axios.post(
        "http://localhost:5001/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/login");
    };
    logout();
  }, []);

  return <p>Logging out...</p>;
}

export default Logout;
