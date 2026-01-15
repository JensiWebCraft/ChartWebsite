import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthTabs from "./components/AuthTabs/AuthTabs";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import Layout from "./components/Layout/Layout";
import { applyTheme } from "./utils/applyTheme";
import { useEffect, useState } from "react";

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
      <Routes>
        {/* 🔐 AUTH TABS (FIRST PAGE) */}
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

        {/* 🔒 PROTECTED ROUTES */}
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
