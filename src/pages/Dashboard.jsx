import React from "react";

const Dashboard = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem("activeUser"));

  if (!user) {
    return <p>No user logged in</p>;
  }

  return (
    <div
      className="dashboard"
      style={{
        background: "var(--admin-bg)",
        color: "var(--font)",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "var(--primary)" }}>Dashboard</h2>

      <p>
        Welcome, <strong>{user.name}</strong>
      </p>
      <p>Role: {user.role}</p>

      {/* PRIMARY BUTTON WITH HOVER → SECONDARY */}
      <button
        style={{
          background: "var(--primary)",
          color: "var(--font)",
          padding: "10px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginRight: "10px",
        }}
        onMouseEnter={(e) => (e.target.style.background = "var(--secondary)")}
        onMouseLeave={(e) => (e.target.style.background = "var(--primary)")}
      >
        Dashboard Button
      </button>

      {/* LOGOUT */}
      <button
        onClick={onLogout}
        style={{
          background: "#ef4444",
          color: "#fff",
          padding: "10px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
