import { Link, Outlet, useNavigate } from "react-router-dom";

function UserLayout({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);        // logout
    navigate("/login");  // redirect
  };

  return (
    <>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/dashboard">Dashboard</Link>{" | "}
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Outlet />
    </>
  );
}

export default UserLayout;
