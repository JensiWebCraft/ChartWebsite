import { useEffect, useState } from "react";
import { getTasks } from "../../utils/taskService";
import "./TaskList.scss";
import { FiEdit, FiTrash2, FiDownload } from "react-icons/fi";
import { downloadCSV } from "../../utils/csvExport";
import { useNavigate } from "react-router-dom";
import TaskDetailsModal from "./TaskDetailsModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ✅ ADD PENDING COLUMN */
const STATUSES = ["pending", "inprogress", "completed", "failed"];

const TaskList = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  const users = JSON.parse(localStorage.getItem("users_list")) || [];
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(
    user.role === "superadmin" ? "all" : user.email,
  );
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  /* 🔹 LOAD TASKS */
  const loadData = () => {
    const all = getTasks();
    const visible =
      selectedUser === "all"
        ? all
        : all.filter((t) => t.assignedTo === selectedUser);

    setTasks(visible);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("tasksUpdated", loadData);
    return () => window.removeEventListener("tasksUpdated", loadData);
  }, [selectedUser]);

  /* 🔹 PERMISSION */
  const canDragTask = (task) => {
    if (user.role === "superadmin") return true;
    return task.assignedTo === user.email;
  };

  /* 🔹 DRAG START */
  const onDragStart = (e, task) => {
    if (!canDragTask(task)) return;
    e.dataTransfer.setData("taskId", task.id);
  };

  /* 🔹 DROP (STATUS UPDATE + TOAST) */
  const onDrop = (e, newStatus) => {
    e.preventDefault();

    const taskId = Number(e.dataTransfer.getData("taskId"));
    if (!taskId) return;

    const all = getTasks();
    const updated = all.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t,
    );

    localStorage.setItem("tasks", JSON.stringify(updated));
    window.dispatchEvent(new Event("tasksUpdated"));

    toast.success(`Task moved to ${newStatus.toUpperCase()}`);
  };

  /* 🔹 DELETE TASK */
  const handleDelete = (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    const updated = getTasks().filter((t) => t.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(updated));
    window.dispatchEvent(new Event("tasksUpdated"));

    toast.error("Task deleted");
  };

  return (
    <div className="task-board">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* HEADER */}
      <div className="filter-bar">
        <h3>Tasks</h3>

        {user.role === "superadmin" && (
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="all">All Users</option>
            {users.map((u) => (
              <option key={u.email} value={u.email}>
                {u.name}
              </option>
            ))}
          </select>
        )}

        <FiDownload
          className="csv-icon"
          title="Download CSV"
          onClick={() => downloadCSV(tasks, "task-report.csv")}
        />
      </div>

      {/* COLUMNS */}
      <div className="columns">
        {STATUSES.map((status) => {
          const statusTasks = tasks.filter((t) => t.status === status);

          return (
            <div
              key={status}
              className={`column ${status}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, status)}
            >
              <h4>
                {status === "inprogress"
                  ? "In Progress"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </h4>

              {statusTasks.length === 0 && (
                <p className="empty">Drop tasks here</p>
              )}

              {statusTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-card ${
                    canDragTask(task) ? "draggable" : "locked"
                  }`}
                  draggable={canDragTask(task)}
                  onDragStart={(e) => onDragStart(e, task)}
                  onClick={() => setActiveTask(task)}
                >
                  <h5>{task.title}</h5>

                  <div className="actions" onClick={(e) => e.stopPropagation()}>
                    <FiEdit
                      title="Edit"
                      onClick={() => navigate(`/tasks/edit/${task.id}`)}
                    />
                    <FiTrash2
                      title="Delete"
                      onClick={() => handleDelete(task.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {activeTask && (
        <TaskDetailsModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
