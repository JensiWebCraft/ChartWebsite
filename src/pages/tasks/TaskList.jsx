import { useEffect, useState } from "react";
import { getTasks } from "../../utils/taskService";
import "./TaskList.scss";
import { FiEdit, FiTrash2, FiDownload } from "react-icons/fi";
import { downloadCSV } from "../../utils/csvExport";
import { useNavigate } from "react-router-dom";
import TaskDetailsModal from "./TaskDetailsModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../../components/BackButton/BackButton";

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

  const getAssignedUser = (email) => {
    return users.find((u) => u.email === email);
  };

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
  /* 🔹 DRAG START – make sure data is set and effect is allowed */
  const onDragStart = (e, task) => {
    if (!canDragTask(task)) return;

    e.dataTransfer.setData("text/plain", task.id.toString());
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.dropEffect = "move";
  };

  /* 🔹 Allow drop – must be on EVERY potential drop target */
  const allowDrop = (e) => {
    e.preventDefault(); // must call this
    e.stopPropagation(); // sometimes helps
    e.dataTransfer.dropEffect = "move"; // visual feedback
  };

  /* 🔹 DROP – add logging to debug */
  const onDrop = (e, newStatus) => {
    e.preventDefault();
    e.stopPropagation();

    const taskIdRaw =
      e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("taskId");
    const taskId = Number(taskIdRaw);

    console.log(`[DROP] on ${newStatus} - taskId:`, taskId); // ← check console!

    if (isNaN(taskId) || !taskId) {
      console.warn("Invalid taskId from dataTransfer");
      return;
    }

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
              onDragEnter={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDragOver={allowDrop}
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

              {statusTasks.map((task) => {
                const assignedUser = getAssignedUser(task.assignedTo);

                return (
                  <div
                    key={task.id}
                    className={`task-card ${canDragTask(task) ? "draggable" : "locked"}`}
                    draggable={canDragTask(task)}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragOver={allowDrop}
                    onDrop={(e) => onDrop(e, task.status)}
                    onClick={() => setActiveTask(task)}
                  >
                    <h5>{task.title}</h5>

                    {/* ✅ ASSIGNED INFO */}
                    {assignedUser && (
                      <div className="assigned-info">
                        <span className="assigned-name">
                          {assignedUser.name}
                        </span>
                        <span className={`role-badge ${assignedUser.role}`}>
                          {assignedUser.role}
                        </span>
                      </div>
                    )}

                    <div
                      className="actions"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                );
              })}
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
