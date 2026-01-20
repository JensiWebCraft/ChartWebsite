import { useState } from "react";
import { getTasks, saveTasks } from "../../utils/taskService";

const AssignTask = () => {
  const [tasks, setTasks] = useState(getTasks());
  const users = JSON.parse(localStorage.getItem("users_list")) || [];

  const handleAssign = (taskId, userEmail) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, assignedTo: userEmail, status: "pending" } : t,
    );

    saveTasks(updated);
    setTasks(updated); 
    alert("Task assigned");
  };

  return (
    <div className="page">
      <h2>Assign Task</h2>

      {tasks
        .filter((t) => !t.assignedTo) 
        .map((t) => (
          <div key={t.id} className="task-card">
            <b>{t.title}</b>

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
          </div>
        ))}
    </div>
  );
};

export default AssignTask;
