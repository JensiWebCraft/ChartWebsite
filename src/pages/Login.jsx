import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      setError("No user found. Please add user first.");
      return;
    }

    if (email === savedUser.email && password === savedUser.password) {
      localStorage.setItem("themeColor", savedUser.theme);
      localStorage.setItem("role", savedUser.role);
      onLoginSuccess();
    } else {
      setError("Invalid email or password");
    }
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
