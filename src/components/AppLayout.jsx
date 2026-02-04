import { Outlet, useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import Footer from "./Footer";

function UserLayout({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);        // clear user state
    navigate("/login");  // redirect to login
  };

  return (
    <>
      <UserHeader onLogout={handleLogout} />
      <main className="container my-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default UserLayout;
