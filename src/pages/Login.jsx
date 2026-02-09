import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUsers } from "../store/userSlice"; // adjust path if needed
import "./Login.scss";

// You can move this to a separate auth slice later — keeping it simple for now
const setActiveUser = (user) => {
  localStorage.setItem("activeUser", JSON.stringify(user)); // still using this for session
  // Alternative: dispatch to redux auth slice → better long-term
};

function Login({ onLoginSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    users,
    loading,
    error: usersError,
  } = useSelector((state) => state.users);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState(false);

  // Load users once when component mounts (if not already loaded)
  useEffect(() => {
    if (users.length === 0 && !loading) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length, loading]);

  const handleLogin = (e) => {
    e.preventDefault();
    setTouched(true);

    if (!email.trim() || !password.trim()) {
      setFormError("Please enter email and password");
      return;
    }

    if (loading) return;

    // Find user (plain password comparison — insecure in real apps!)
    const foundUser = users.find(
      (u) =>
        u.email?.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password, // ← NEVER do this in production!
    );

    if (!foundUser) {
      setFormError("Invalid email or password");
      toast.error("Login failed");
      return;
    }

    // Success
    setActiveUser(foundUser); // still using localStorage for active user
    toast.success(`Welcome back, ${foundUser.name}!`);

    setFormError("");
    setEmail("");
    setPassword("");

    // Either call callback or navigate
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      // Typical redirect — adjust route as needed
      navigate("/dashboard"); // or "/" or "/users"
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="form login">
        <h3>Login</h3>

        {(formError || usersError) && (
          <p className="error">
            {formError || usersError || "Something went wrong"}
          </p>
        )}

        {loading && <p className="loading">Loading users...</p>}

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched) setFormError("");
            }}
            onBlur={() => setTouched(true)}
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (touched) setFormError("");
            }}
            onBlur={() => setTouched(true)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim() || !password.trim()}
        >
          {loading ? "Checking..." : "Login"}
        </button>

        <p
          className="hint"
          style={{ marginTop: "16px", fontSize: "0.9rem", color: "#666" }}
        ></p>
      </form>
    </div>
  );
}

export default Login;
