import { useEffect, useState } from "react";
import { getTasks, saveTasks } from "../../utils/taskService";
import "./MyTasks.scss";
import BackButton from "../../components/BackButton/BackButton";

const MyTasks = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));

  // 🔒 Safety check
  if (!user) {
    return <p style={{ padding: "20px" }}>Please login again</p>;
  }

  const [tasks, setTasks] = useState([]);

  // 🔄 Load tasks assigned to this user
  useEffect(() => {
    const allTasks = getTasks();
    setTasks(allTasks.filter((t) => t.assignedTo === user.email));
  }, [user.email]);

  // 🔄 Update task status
  const updateStatus = (taskId, status) => {
    const allTasks = getTasks();
    const now = new Date().toISOString();

    const updatedTasks = allTasks.map((task) => {
      if (task.id !== taskId) return task;

      return {
        ...task,
        status,
        updatedAt: now,
        completedAt: status === "completed" ? now : task.completedAt || null,
      };
    });

    saveTasks(updatedTasks);

    // Refresh only this user's tasks
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

          {/* 🖼 IMAGE DISPLAY */}
          {task.images?.length > 0 && (
            <div className="task-images">
              {task.images.map((img, i) => (
                <img key={i} src={img} alt="task" />
              ))}
            </div>
          )}

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
