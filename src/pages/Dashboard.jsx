import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("activeUser"));

  useEffect(() => {
    if (!user) return;

    if (user.role === "superadmin") {
      navigate("/dashboard", { replace: true });
    } else if (user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  return null;
};

export default Dashboard;
