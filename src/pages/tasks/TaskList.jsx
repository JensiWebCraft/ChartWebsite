import { useEffect, useState, useRef, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiEdit, FiTrash2, FiDownload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask, deleteTask } from "../../store/taskSlice";
import { useNavigate } from "react-router-dom";
import TaskDetailsModal from "./TaskDetailsModal";
import "./TaskList.scss";

const STATUSES = ["pending", "inprogress", "completed", "failed"];

const TaskList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetched = useRef(false);

  const { tasks = [], loading } = useSelector((state) => state.tasks);

  /* 🔐 Safe localStorage parsing */
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("activeUser")) || {};
    } catch {
      return {};
    }
  }, []);

  const users = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("users_list")) || [];
    } catch {
      return [];
    }
  }, []);

  const [selectedUser, setSelectedUser] = useState(
    user.role === "superadmin" ? "all" : user.email,
  );
  const [activeTask, setActiveTask] = useState(null);

  /* 🔐 Prevent double API call */
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    dispatch(fetchTasks());
  }, [dispatch]);

  /* ✅ Memoized filtering */
  const visibleTasks = useMemo(() => {
    if (selectedUser === "all") return tasks;
    return tasks.filter((t) => t.assignedTo === selectedUser);
  }, [tasks, selectedUser]);

  const canDrag = (task) =>
    user.role === "superadmin" || task.assignedTo === user.email;

  const onDragEnd = (result) => {
    if (!result.destination) return;

    dispatch(
      updateTask({
        id: result.draggableId,
        data: { status: result.destination.droppableId },
      }),
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this task?")) {
      dispatch(deleteTask(id));
    }
  };

  /* ✅ CSV Export */
  const downloadCSV = () => {
    const header = "ID,Title,Status,Priority,Assigned\n";

    const rows = tasks.map(
      (t) =>
        `"${t.id}","${t.title}","${t.status}","${t.priority}","${t.assignedTo}"`,
    );

    const blob = new Blob([header + rows.join("\n")], {
      type: "text/csv",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tasks.csv";
    a.click();
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="task-board">
      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">
        {user.role === "superadmin" && (
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="all">All</option>
            {users.map((u) => (
              <option key={u.email} value={u.email}>
                {u.name || u.email}
              </option>
            ))}
          </select>
        )}

        <FiDownload className="csv-icon" onClick={downloadCSV} />
      </div>

      {/* ================= BOARD ================= */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns">
          {STATUSES.map((status) => {
            const tasksByStatus = visibleTasks.filter(
              (t) => t.status === status,
            );

            return (
              <Droppable key={status} droppableId={status}>
                {(dropProvided) => (
                  <div
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    className={`column ${status}`}
                  >
                    <h4>
                      {status} ({tasksByStatus.length})
                    </h4>

                    {tasksByStatus.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                        isDragDisabled={!canDrag(task)}
                      >
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`task-card ${
                              !canDrag(task) ? "locked" : ""
                            }`}
                            onClick={() => setActiveTask(task)}
                          >
                            <h5>{task.title}</h5>

                            <div className="actions">
                              <FiEdit
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tasks/edit/${task.id}`);
                                }}
                              />

                              <FiTrash2
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(task.id);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* ================= MODAL ================= */}
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
