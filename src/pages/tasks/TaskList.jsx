import { getTasks } from "../../utils/taskService";

const TaskList = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  const allTasks = getTasks();

  const visibleTasks =
    user.role === "superadmin"
      ? allTasks
      : allTasks.filter((t) => t.createdBy === user.email);

  return (
    <div className="page">
        
      <h2>Task List</h2>

      {visibleTasks.length === 0 && <p>No tasks found</p>}

      {visibleTasks.map((t) => (
        <div key={t.id} className="task-card">
          <h4>{t.title}</h4>
          <p>{t.description}</p>
          <b>Status: {t.status}</b>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
