import { useState } from "react";
import { applyTheme } from "../utils/applyTheme";
import "./Login.scss";
import { toast } from "react-toastify";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users_list")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      setError("User not found or password incorrect");
      return;
    }

    localStorage.setItem("activeUser", JSON.stringify(user));

    applyTheme(user.theme, user.role);
    toast.success("Login successful 🎉", {
      onOpen: () => {
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      },
    });
  };

  return (
    <form onSubmit={handleLogin} className="form login">
      <h3>Login</h3>

      {error && <p className="error">{error}</p>}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Login</button>
    </form>
  );
}

export default Login;
