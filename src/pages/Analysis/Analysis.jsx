import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../store/taskSlice";

import KpiCards from "./KpiCards";
import StatusDonut from "./StatusDonut";
import UserBarChart from "./UserBarChart";
import TrendChart from "./TrendChart";

import "./Analysis.scss";

const Analysis = () => {
  const dispatch = useDispatch();

  const { tasks = [], loading, error } = useSelector((state) => state.tasks);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("activeUser"));
    } catch {
      return null;
    }
  }, []);

  // 🔹 Fetch tasks once user exists
  useEffect(() => {
    if (user) {
      dispatch(fetchTasks());
    }
  }, [dispatch, user]);

  // 🔹 Filter tasks based on role (MEMOIZED)
  const visibleTasks = useMemo(() => {
    if (!user || tasks.length === 0) return [];

    switch (user.role) {
      case "superadmin":
        return tasks;

      case "admin":
        return tasks.filter((t) => t.createdBy === user.email);

      default:
        return tasks.filter((t) => t.assignedTo === user.email);
    }
  }, [tasks, user]);

  // 🔹 Normalize data once (MEMOIZED)
  const normalizedTasks = useMemo(() => {
    return visibleTasks.map((t) => ({
      ...t,
      assignedTo:
        t.assignedTo && typeof t.assignedTo === "object"
          ? t.assignedTo.email
          : t.assignedTo || "Unassigned",
    }));
  }, [visibleTasks]);

  // 🔹 Guards
  if (!user) {
    return (
      <div className="analysis-page">
        <p
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#e53e3e",
          }}
        >
          Please login to view analytics.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="analysis-page">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-page">
        <p
          style={{
            color: "#e53e3e",
            padding: "2rem",
          }}
        >
          Failed to load tasks: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <KpiCards tasks={normalizedTasks} />

      <div className="chart-row">
        <StatusDonut tasks={normalizedTasks} />
        <UserBarChart
          tasks={user.role === "user" ? normalizedTasks : visibleTasks}
        />
      </div>

      <TrendChart tasks={normalizedTasks} />
    </div>
  );
};

export default Analysis;
