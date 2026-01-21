// src/pages/dashboard/Dashboard.jsx
import "./Dashboard.scss";
import heroImg from "../assets/image.png";
import analyticsImg from "../assets/image.png";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  if (!user) return <p>Please login again</p>;

  return (
    <div className="dashboard">
      {/* ================= HERO (MEDIUM) ================= */}
      <section className="hero-section">
        <div className="hero-image">
          <img src={heroImg} alt="dashboard" />
        </div>

        <div className="hero-content">
          <h1>Welcome, {user.name}</h1>
          <p>
            Centralized task monitoring and analytics platform designed for
            role-based productivity tracking.
          </p>
        </div>
      </section>

      {/* ================= OVERVIEW CARDS ================= */}
      <section className="overview">
        <div className="card blue">
          <h4>Total Tasks</h4>
          <span>120</span>
        </div>
        <div className="card green">
          <h4>Completed</h4>
          <span>78</span>
        </div>
        <div className="card orange">
          <h4>In Progress</h4>
          <span>30</span>
        </div>
        <div className="card red">
          <h4>Failed</h4>
          <span>12</span>
        </div>
      </section>

      {/* ================= ANALYTICS ================= */}
      <section className="analytics">
        <div className="analytics-image">
          <img src={analyticsImg} alt="charts" />
        </div>

        <div className="analytics-content">
          <h2>Visual Analytics</h2>
          <p>
            Gain insights into task trends, completion rate, and user
            performance using interactive data visualizations.
          </p>

          <ul>
            <li>Task status distribution</li>
            <li>Monthly completion trends</li>
            <li>User productivity overview</li>
          </ul>
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section className="roles">
        <h2>Role-Based Access</h2>

        <div className="role-grid">
          <div className="role-card">
            <h4>Super Admin</h4>
            <p>System-wide analytics & monitoring</p>
          </div>

          <div className="role-card">
            <h4>Admin</h4>
            <p>Create, assign & manage tasks</p>
          </div>

          <div className="role-card">
            <h4>User</h4>
            <p>Execute tasks & update progress</p>
          </div>
        </div>
      </section>

      {/* ================= TOOLS ================= */}
      <section className="tools">
        <h2>Tools & Architecture</h2>

        <div className="tool-tags">
          <span>React</span>
          <span>SCSS</span>
          <span>FusionCharts</span>
          <span>LocalStorage</span>
          <span>RBAC</span>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
