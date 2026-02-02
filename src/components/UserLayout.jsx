import { Link, Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

function UserLayout() {
  return (
    <>
      <UserHeader />   {/* Dashboard + Logout links */}
      <Outlet />       {/* Logged-in pages */}
      <UserFooter />
    </>
  );
}

export default UserLayout;
