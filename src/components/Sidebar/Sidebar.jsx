import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaPlusCircle,
  FaClipboardCheck,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";
import "./Sidebar.scss";

const Sidebar = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  const role = user?.role;

  return (
    <aside className="sidebar">
      {/* Dashboard - all roles */}
      <NavLink to="/dashboard">
        <FaHome />
        <span>Dashboard</span>
      </NavLink>

      {(role === "admin" || role === "superadmin") && (
        <NavLink to="/tasks/list">
          <FaTasks />
          <span>Task List</span>
        </NavLink>
      )}

      {(role === "admin" || role === "superadmin") && (
        <NavLink to="/tasks/create">
          <FaPlusCircle />
          <span>Create Task</span>
        </NavLink>
      )}

      {(role === "admin" || role === "superadmin") && (
        <NavLink to="/tasks/assign">
          <FaClipboardCheck />
          <span>Assign Task</span>
        </NavLink>
      )}

      {/* My Tasks - User only */}
      {role === "user" && (
        <NavLink to="/tasks/my">
          <FaTasks />
          <span>My Tasks</span>
        </NavLink>
      )}

      {(role === "admin" || role === "superadmin" || role === "user") && (
        <NavLink to="/analysis">
          <FaChartBar />
          <span>Analysis</span>
        </NavLink>
      )}

      {/* Logout */}
      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
