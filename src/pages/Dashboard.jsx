import { useSelector } from "react-redux";

function Dashboard() {
  const user = useSelector((state) => state.userDetails);

  return (
    <div className="container text-center">
      <h4>Welcome, {user?.name || user?.email}</h4>
    </div>
  );
}

export default Dashboard;
