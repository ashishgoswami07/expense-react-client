import { useSelector } from "react-redux";

function Dashboard() {
  const user = useSelector((state) => state.userDetails);

  if (!user) return null; // prevents crash

  return (
    <div className="container text-center">
      <h4>Welcome, {user.name}</h4>
    </div>
  );
}

export default Dashboard;
