import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaTasks,
  FaPlusCircle,
  FaClipboardCheck,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.scss";

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard">
        <FaHome />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/add-task">
        <FaTasks />
        <span>Add Task</span>
      </NavLink>

      <NavLink to="/create-task">
        <FaPlusCircle />
        <span>Create Task</span>
      </NavLink>

      <NavLink to="/assign-task">
        <FaClipboardCheck />
        <span>Assign Task</span>
      </NavLink>

      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
