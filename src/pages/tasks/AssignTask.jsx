import { useState } from "react";
import { getTasks, saveTasks } from "../../utils/taskService";
import "./AssignTask.scss";

const AssignTask = () => {
  const [tasks, setTasks] = useState(getTasks());
  const users = JSON.parse(localStorage.getItem("users_list")) || [];

  const handleAssign = (taskId, email) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, assignedTo: email, status: "pending" } : t,
    );

    saveTasks(updated);
    setTasks(updated);
    alert("Task assigned");
  };

  const unassigned = tasks.filter((t) => !t.assignedTo);

  return (
    <div className="assign-page">
      <h2>Assign Tasks</h2>

      {unassigned.length === 0 && (
        <p className="empty">All tasks are assigned</p>
      )}

      <div className="assign-grid">
        {unassigned.map((task) => (
          <div key={task.id} className="assign-card">
            <h4>{task.title}</h4>
            <p>{task.description}</p>

            <select
              defaultValue=""
              onChange={(e) => handleAssign(task.id, e.target.value)}
            >
              <option value="" disabled>
                Assign user
              </option>

              {users
                .filter((u) => u.role === "user")
                .map((u) => (
                  <option key={u.email} value={u.email}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignTask;
