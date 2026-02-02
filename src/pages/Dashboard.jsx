import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  const logout = async () => {
    await axios.post(
      "http://localhost:5001/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/");
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Welcome {user.email}</h2>
      <button className="btn btn-danger mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
