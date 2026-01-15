import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthTabs from "./components/AuthTabs/AuthTabs";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import LoginSuccess from "./components/Animation/LoginSucess";
import { applyTheme } from "./utils/applyTheme";

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
