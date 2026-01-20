import { useEffect, useState } from "react";
import { getTasks, saveTasks } from "../../utils/taskService";
import "./MyTasks.scss";

const MyTasks = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  const [tasks, setTasks] = useState([]);

  // ✅ ALWAYS filter by email
  useEffect(() => {
    const allTasks = getTasks();
    setTasks(allTasks.filter((t) => t.assignedTo === user.email));
  }, [user.email]);

  const updateStatus = (taskId, status) => {
    const allTasks = getTasks();
    const now = new Date().toISOString();

    const updatedTasks = allTasks.map((task) => {
      if (task.id !== taskId) return task;

      return {
        ...task,
        status,
        updatedAt: now, // ✅ ALWAYS set
        completedAt: status === "completed" ? now : task.completedAt || null,
      };
    });

    saveTasks(updatedTasks);
    setTasks(updatedTasks.filter((t) => t.assignedTo === user.email));
  };

  return (
    <div className="page my-tasks">
      <h2>My Tasks</h2>

      {tasks.length === 0 && <p>No tasks assigned</p>}

      {tasks.map((task) => (
        <div className="task-card" key={task.id}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <b>Status: {task.status}</b>

          <div className="actions">
            <button onClick={() => updateStatus(task.id, "inprogress")}>
              Start
            </button>
            <button onClick={() => updateStatus(task.id, "updated")}>
              Update
            </button>
            <button
              className="success"
              onClick={() => updateStatus(task.id, "completed")}
            >
              Complete
            </button>
            <button
              className="danger"
              onClick={() => updateStatus(task.id, "failed")}
            >
              Fail
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTasks;
