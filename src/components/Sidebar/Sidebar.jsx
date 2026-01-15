import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "10px",
    color: isActive ? "var(--secondary)" : "#fff",
    textDecoration: "none",
    fontWeight: isActive ? "600" : "400",
    position: "fixed",
    top: "60px",
  });

  return (
    <aside
      style={{
        width: "220px",
        background: "#111827",
        padding: "20px",
      }}
    >
      <NavLink to="/dashboard" style={linkStyle}>
        Dashboard
      </NavLink>

      <NavLink to="/add-user" style={linkStyle}>
        Add User
      </NavLink>
    </aside>
  );
};

export default Sidebar;
