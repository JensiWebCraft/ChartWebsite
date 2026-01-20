import { useState } from "react";
import { getTasks, saveTasks } from "../../utils/taskService";
import "./AssignTask.scss";

const AssignTask = () => {
  const [tasks, setTasks] = useState(getTasks());
  const users = JSON.parse(localStorage.getItem("users_list")) || [];

  const handleAssign = (taskId, userEmail) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, assignedTo: userEmail, status: "pending" } : t,
    );

    saveTasks(updated);
    setTasks(updated);
    alert("Task assigned successfully");
  };

  const unassignedTasks = tasks.filter((t) => !t.assignedTo);

  return (
    <div className="assign-page">
      <h2>Assign Task</h2>

      {unassignedTasks.length === 0 && (
        <p className="empty">No unassigned tasks available</p>
      )}

      <table className="assign-table">
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Assign To</th>
          </tr>
        </thead>

        <tbody>
          {unassignedTasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>
                <select
                  defaultValue=""
                  onChange={(e) => handleAssign(t.id, e.target.value)}
                >
                  <option value="" disabled>
                    Select user
                  </option>

                  {users
                    .filter((u) => u.role === "user")
                    .map((u) => (
                      <option key={u.email} value={u.email}>
                        {u.name}
                      </option>
                    ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignTask;
