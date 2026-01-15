import getInitials from "../../utils/getInitials";
import "./Header.scss";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));

  const initials = getInitials(user?.name);

  return (
    <header className="header">
      <h3>Admin Panel</h3>

      <div className="header-right">
        <div className="profile">
          <div className="info">
            <span className="name">{user?.name}</span>
            <span className="role">{user?.role}</span>
          </div>
          <div className="avatar">{initials}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
