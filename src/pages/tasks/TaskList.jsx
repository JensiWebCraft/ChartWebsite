import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../../utils/taskService";
import "./TaskList.scss";
import { FiEdit, FiTrash2, FiDownload } from "react-icons/fi";
import { downloadCSV } from "../../utils/csvExport";
import { useNavigate } from "react-router-dom";
import TaskDetailsModal from "./TaskDetailsModal";

const STATUSES = ["inprogress", "completed", "failed"];

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

  /* 🔹 AUTO REFRESH */
  useEffect(() => {
    loadData();
    window.addEventListener("tasksUpdated", loadData);
    return () => window.removeEventListener("tasksUpdated", loadData);
  }, [selectedUser]);

  return (
    <div className="task-board">
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
            <div key={status} className={`column ${status}`}>
              <h4>{status.toUpperCase()}</h4>

              {statusTasks.length === 0 && <p className="empty">No tasks</p>}

              {statusTasks.map((task) => (
                <div
                  key={task.id}
                  className="task-card"
                  onClick={() => setActiveTask(task)}
                >
                  <h5>{task.title}</h5>
                  <p>{task.description}</p>

                  {/* ACTIONS */}
                  <div className="actions" onClick={(e) => e.stopPropagation()}>
                    <FiEdit
                      title="Edit"
                      onClick={() => navigate(`/tasks/edit/${task.id}`)}
                    />
                    <FiTrash2
                      title="Delete"
                      onClick={() => {
                        if (window.confirm("Delete this task?")) {
                          deleteTask(task.id);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* TASK DETAILS MODAL */}
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
