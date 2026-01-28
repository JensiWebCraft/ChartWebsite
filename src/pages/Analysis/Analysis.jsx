import { useEffect, useState } from "react";
import { getTasks } from "../../utils/taskService";
import KpiCards from "./KpiCards";
import StatusDonut from "./StatusDonut";
import UserBarChart from "./UserBarChart";
import TrendChart from "./TrendChart";
import "./Analysis.scss";

const Analysis = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  const [allTasks, setAllTasks] = useState([]);

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

    setAllTasks(normalized);

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

    const refresh = () => loadData();

    window.addEventListener("tasksUpdated", refresh);

    return () => {
      window.removeEventListener("tasksUpdated", refresh);
    };
  }, []);

  return (
    <div className="analysis-page">
      <KpiCards tasks={tasks} />

      <div className="chart-row">
        <StatusDonut tasks={tasks} />
        <UserBarChart tasks={user.role === "user" ? allTasks : tasks} />
      </div>

      <TrendChart tasks={tasks} />
    </div>
  );
};

export default Analysis;
