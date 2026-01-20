import { getTasks } from "../../utils/taskService";
import "./TaskList.scss";

const TaskList = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  const allTasks = getTasks();

  const visibleTasks =
    user.role === "superadmin"
      ? allTasks
      : allTasks.filter((t) => t.createdBy === user.email);

  return (
    <div className="task-page">
      <h2>Task List</h2>

      {visibleTasks.length === 0 && <p className="empty">No tasks found</p>}

      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {visibleTasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>
                <span className={`status ${t.status}`}>{t.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
