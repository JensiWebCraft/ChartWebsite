import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AuthTabs from "./components/AuthTabs/AuthTabs";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import LoginSuccess from "./components/Animation/LoginSucess";
// import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
// import AdminDashboard from "./pages/dashboard/AdminDashboard";
// import UserDashboard from "./pages/dashboard/UserDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { applyTheme } from "./utils/applyTheme";
import { ToastContainer } from "react-toastify";
import CreateTask from "./pages/tasks/CreateTask";
import AssignTask from "./pages/tasks/AssignTask";
import TaskList from "./pages/tasks/TaskList";
import MyTasks from "./pages/tasks/MyTasks";
import Analysis from "./pages/Analysis/Analysis";

function App() {
  const [authStage, setAuthStage] = useState("auth");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    if (user) {
      applyTheme(user); // ✅ APPLY USER THEME
      setAuthStage("app");
    }
  }, []);

  const handleLoginSuccess = () => {
    setAuthStage("animating");
    setTimeout(() => setAuthStage("app"), 1800);
  };

  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    localStorage.removeItem("role");
    localStorage.removeItem("theme");
    setAuthStage("auth");
  };

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        style={{ zIndex: 10000 }}
      />

      {authStage === "animating" && <LoginSuccess />}

      {authStage === "auth" && <AuthTabs onLoginSuccess={handleLoginSuccess} />}

      {authStage === "app" && (
        <Routes>
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/tasks/create"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <CreateTask />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks/list"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <TaskList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks/assign"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AssignTask />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks/my"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <MyTasks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analysis"
              element={
                <ProtectedRoute allowedRoles={["superadmin", "admin", "user"]}>
                  <Analysis />
                </ProtectedRoute>
              }
            />
            <Route path="/tasks/edit/:id" element={<CreateTask />} />

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
