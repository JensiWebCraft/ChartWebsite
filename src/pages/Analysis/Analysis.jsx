import { useEffect, useState } from "react";
import { getTasks } from "../../utils/taskService";
import KpiCards from "./KpiCards";
import StatusDonut from "./StatusDonut";
import UserBarChart from "./UserBarChart";
import TrendChart from "./TrendChart";
import "./Analysis.scss";

const Analysis = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));

  if (!user) {
    return <p style={{ padding: "20px" }}>Please login again</p>;
  }

  const [tasks, setTasks] = useState([]);

  const loadData = () => {
    const all = getTasks();

    const normalized = all.map((t) => ({
      ...t,
      assignedTo:
        t.assignedTo && typeof t.assignedTo === "object"
          ? t.assignedTo.email
          : t.assignedTo,
    }));

    const visible =
      user.role === "superadmin"
        ? normalized
        : user.role === "admin"
          ? normalized.filter((t) => t.createdBy === user.email)
          : normalized.filter((t) => t.assignedTo === user.email);

    setTasks(visible);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analysis-page">
      <KpiCards tasks={tasks} />

      <div className="chart-row">
        <StatusDonut tasks={tasks} />
        {user.role !== "user" && <UserBarChart tasks={tasks} />}
      </div>

      <TrendChart tasks={tasks} />
    </div>
  );
};

export default Analysis;
