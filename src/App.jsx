import { useEffect, useState } from "react";
import AuthTabs from "./components/AuthTabs/AuthTabs";
import Dashboard from "./pages/Dashboard";
import { applyTheme } from "./utils/applyTheme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔹 Auto-login if active user exists
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    if (user) {
      applyTheme(user.theme, user.role);
      setIsLoggedIn(true);
    }
  }, []);

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("activeUser");

    // reset theme (optional)
    document.documentElement.style.removeProperty("--primary");
    document.documentElement.style.removeProperty("--secondary");
    document.documentElement.style.removeProperty("--font");

    setIsLoggedIn(false);
  };

  return (
    <>
      {/* 🔔 Toasts (GLOBAL) */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* 🔐 Auth / Dashboard switch */}
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <AuthTabs onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

export default App;
