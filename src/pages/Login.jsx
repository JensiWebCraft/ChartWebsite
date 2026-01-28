import { useState } from "react";

import "./Login.scss";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users_list")) || [];

    if (!users.length) {
      setError("No users found. Please create a user first.");
      return;
    }

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("activeUser", JSON.stringify(user));
    onLoginSuccess();
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
