import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask } from "../../store/taskSlice";
import "./AssignTask.scss";

const AssignTask = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const users = JSON.parse(localStorage.getItem("users_list")) || [];

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const unassigned = tasks.filter((t) => !t.assignedTo);

  const handleAssign = (taskId, email) => {
    dispatch(
      updateTask({
        id: taskId,
        data: { assignedTo: email, status: "pending" },
      }),
    );
    alert("Task assigned successfully");
  };

  return (
    <div className="assign-page">
      <h2>Assign Tasks</h2>

      {unassigned.length === 0 ? (
        <p className="empty">All tasks are assigned</p>
      ) : (
        <div className="assign-grid">
          {unassigned.map((task) => (
            <div key={task.id} className="assign-card">
              <h4>{task.title}</h4>
              <div
                className="task-desc"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
              <select
                defaultValue=""
                onChange={(e) => handleAssign(task.id, e.target.value)}
              >
                <option value="" disabled>
                  Assign to user
                </option>
                {users
                  .filter((u) => u.role === "user")
                  .map((u) => (
                    <option key={u.email} value={u.email}>
                      {u.name || u.email}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignTask;
