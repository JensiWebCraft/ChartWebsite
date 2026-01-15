import "./Dashboard.scss";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  if (!user) return null;

  return (
    <div className="page">
      <h2>Dashboard</h2>

      <p>
        Welcome, <strong>{user.name}</strong>
      </p>
      <p>Role: {user.role}</p>

      <button className="primary-btn">Dashboard Button</button>
    </div>
  );
};

export default Dashboard;
