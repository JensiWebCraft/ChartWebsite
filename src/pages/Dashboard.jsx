// src/pages/dashboard/Dashboard.jsx
import "./Dashboard.scss";
import heroImg from "../assets/image.png";
import analyticsImg from "../assets/image.png";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));

  if (!user) return <p className="no-user">Please login again</p>;

  return (
    <div className="dashboard">
      {/* HERO SECTION */}
      <section className="hero-section">
        <img src={heroImg} alt="Dashboard" className="hero-bg" />

        <div className="hero-content">
          <h1>Welcome, {user.name}</h1>
          <p>
            Centralized task monitoring and analytics platform designed for
            role-based productivity tracking.
          </p>
        </div>
      </section>

      {/* STATS CARDS */}
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

      {/* ANALYTICS */}
      <section className="analytics">
        <div className="analytics-image">
          <img src={analyticsImg} alt="Analytics" />
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

      <section className="analytics">
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
        <div className="analytics-image">
          <img src={analyticsImg} alt="Analytics" />
        </div>
      </section>

      {/* ROLES */}
      <section className="roles">
        <h2 className="section-title">Access Control</h2>

        <div className="role-grid">
          <div className="role-card super">
            <h4>Super Admin</h4>
            <p>Full system access, analytics & configuration control</p>
          </div>

          <div className="role-card admin">
            <h4>Admin</h4>
            <p>Task creation, assignment & team management</p>
          </div>

          <div className="role-card user">
            <h4>User</h4>
            <p>Execute tasks, update progress & view reports</p>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="tools">
        <h2 className="section-title">Technology Stack</h2>

        <div className="tools-grid">
          <div className="tool-card">⚛ React</div>
          <div className="tool-card">🎨 SCSS</div>
          <div className="tool-card">📊 FusionCharts</div>
          <div className="tool-card">🔐 RBAC</div>
          <div className="tool-card">💾 LocalStorage</div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
