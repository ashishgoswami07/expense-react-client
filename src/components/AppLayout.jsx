<<<<<<< HEAD
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
=======
import Header from "./Header";
import Footer from "./Footer";

function AppLayout({ children }){
    return(
        <>
            <Header/>
            {children}
            <Footer/>
        </>
    )
}

export default AppLayout;
>>>>>>> 12c0b2c51e84a22e48010364432d41959c682335
