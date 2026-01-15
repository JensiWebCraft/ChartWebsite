import React from "react";

const Dashboard = () => {
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
      <h2 style={{ color: "black" }}>Dashboard</h2>

      <p>
        Welcome, <strong>{user.name}</strong>
      </p>
      <p>Role: {user.role}</p>

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
    </div>
  );
};

export default Dashboard;
