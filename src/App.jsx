import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthTabs from "./components/AuthTabs/AuthTabs";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import Layout from "./components/Layout/Layout";
import { applyTheme } from "./utils/applyTheme";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔹 Auto login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    if (user) {
      applyTheme(user.theme, user.role);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <AuthTabs onLoginSuccess={() => setIsLoggedIn(true)} />
            )
          }
        />

        {isLoggedIn && (
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-user" element={<AddUser />} />
          </Route>
        )}

        {/* 🚫 FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
