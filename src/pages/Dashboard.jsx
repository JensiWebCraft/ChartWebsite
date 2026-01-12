function Dashboard() {
  const theme = localStorage.getItem("themeColor") || "#4caf50";
  const role = localStorage.getItem("role");

  return (
    <div
      className="dashboard"
      style={{
        borderColor: theme,
        background: theme + "20",
      }}
    >
      <h2 style={{ color: theme }}>Dashboard</h2>
      <p>Role: {role}</p>

      <button style={{ background: theme, color: "orange" }}>
        Dashboard Button
      </button>
    </div>
  );
}

export default Dashboard;
