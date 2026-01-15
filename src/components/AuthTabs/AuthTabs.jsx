import { useState } from "react";
import Login from "../../pages/Login";
import AddUser from "../../pages/AddUser";
import "./AuthTabs.scss";

function AuthTabs({ onLoginSuccess }) {
  const [active, setActive] = useState("login");

  return (
    <div className="auth-box">
      <div className="tabs">
        <button
          className={active === "login" ? "active" : ""}
          onClick={() => setActive("login")}
        >
          Login
        </button>

        <button
          className={active === "add" ? "active" : ""}
          onClick={() => setActive("add")}
        >
          Add User
        </button>
      </div>

      {active === "login" ? (
        <Login onLoginSuccess={onLoginSuccess} />
      ) : (
        <AddUser onUserCreated={() => setActive("login")} />
      )}
    </div>
  );
}

export default AuthTabs;
