function Dashboard({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("activeUser"));

  if (!user) return <p>No user logged in</p>;

  return (
    <div
      className="dashboard"
      style={{
        background: "var(--admin-bg)",
        color: "var(--font)",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "var(--primary)" }}>Dashboard</h2>
      <p>Role: {user.role}</p>

      <button
        style={{
          background: "var(--primary)",
          color: "var(--font)",
          marginRight: "10px",
        }}
        onMouseEnter={(e) => (e.target.style.background = "var(--secondary)")}
        onMouseLeave={(e) => (e.target.style.background = "var(--primary)")}
      >
        Dashboard Button
      </button>

      <button
        onClick={onLogout}
        style={{
          background: "#ef4444",
          color: "#fff",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
