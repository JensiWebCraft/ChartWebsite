import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getTasks } from "../../utils/taskService";
import "./TaskList.scss";
import { FiEdit, FiTrash2, FiDownload } from "react-icons/fi";
import { downloadCSV } from "../../utils/csvExport";
import { useNavigate } from "react-router-dom";
import TaskDetailsModal from "./TaskDetailsModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const getAssignedUser = (email) => users.find((u) => u.email === email);

  /* LOAD TASKS */
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

  /* PERMISSION */
  const canDragTask = (task) =>
    user.role === "superadmin" || task.assignedTo === user.email;

  /* ✅ NPM DRAG END */
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // same place → do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const allTasks = [...getTasks()];

    // dragged task
    const movedTask = allTasks.find((t) => t.id.toString() === draggableId);

    // remove from old position
    const remaining = allTasks.filter((t) => t.id.toString() !== draggableId);

    // tasks in destination column
    const destinationTasks = remaining.filter(
      (t) => t.status === destination.droppableId,
    );

    // insert at new index
    destinationTasks.splice(destination.index, 0, {
      ...movedTask,
      status: destination.droppableId,
    });

    // rebuild full list
    const updated = [
      ...remaining.filter((t) => t.status !== destination.droppableId),
      ...destinationTasks,
    ];

    localStorage.setItem("tasks", JSON.stringify(updated));
    window.dispatchEvent(new Event("tasksUpdated"));

    toast.success(`Task moved to ${destination.droppableId.toUpperCase()}`);
  };

  const handleDelete = (taskId) => {
    toast.error("Task deleted", {
      autoClose: 1500, // toast visible time
      onClose: () => {
        const updated = getTasks().filter((t) => t.id !== taskId);
        localStorage.setItem("tasks", JSON.stringify(updated));
        window.dispatchEvent(new Event("tasksUpdated"));
      },
    });
  };

  return (
    <div className="task-board">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* FILTER BAR (UNCHANGED) */}
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
          onClick={() => downloadCSV(tasks, "task-report.csv")}
        />
      </div>

      {/* ✅ NPM DRAG CONTEXT */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns">
          {STATUSES.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className={`column ${status}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h4>
                    {status === "inprogress"
                      ? "In Progress"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </h4>

                  {tasks
                    .filter((t) => t.status === status)
                    .map((task, index) => {
                      const assignedUser = getAssignedUser(task.assignedTo);

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                          isDragDisabled={!canDragTask(task)}
                        >
                          {(provided) => (
                            <div
                              className={`task-card ${
                                canDragTask(task) ? "draggable" : "locked"
                              }`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setActiveTask(task)}
                            >
                              <h5>{task.title}</h5>

                              {assignedUser && (
                                <div className="assigned-info">
                                  <span className="assigned-name">
                                    {assignedUser.name}
                                  </span>
                                  <span
                                    className={`role-badge ${assignedUser.role}`}
                                  >
                                    {assignedUser.role}
                                  </span>
                                </div>
                              )}

                              <div
                                className="actions"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FiEdit
                                  onClick={() =>
                                    navigate(`/tasks/edit/${task.id}`)
                                  }
                                />
                                <FiTrash2
                                  title="Delete"
                                  onClick={(e) => {
                                    e.stopPropagation(); // 🔑 prevent card click
                                    handleDelete(task.id);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

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
