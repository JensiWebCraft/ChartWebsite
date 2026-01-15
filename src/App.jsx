import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AuthTabs from "./components/AuthTabs/AuthTabs";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import LoginSuccess from "./components/Animation/LoginSucess";
import { applyTheme } from "./utils/applyTheme";
import { ToastContainer } from "react-toastify";

function App() {
  const [authStage, setAuthStage] = useState("auth");
  // auth | animating | app

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    if (user) {
      applyTheme(user.theme, user.role);
      setAuthStage("app");
    }
  }, []);

  const handleLoginSuccess = () => {
    setAuthStage("animating");
    setTimeout(() => setAuthStage("app"), 1800);
  };

  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    setAuthStage("auth");
  };

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        style={{ zIndex: 10000 }}
      />
      {/* LOGIN SUCCESS ANIMATION */}
      {authStage === "animating" && <LoginSuccess />}

      {/* AUTH PAGE */}
      {authStage === "auth" && <AuthTabs onLoginSuccess={handleLoginSuccess} />}

      {/* MAIN APP */}
      {authStage === "app" && (
        <Routes>
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
