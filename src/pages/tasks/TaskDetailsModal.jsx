import "./TaskDetailsModal.scss";
import { FiX } from "react-icons/fi";

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>

        <h3>{task.title}</h3>
        <p className="desc">{task.description}</p>

        <div className="meta">
          <span>
            Status: <b>{task.status}</b>
          </span>
          <span>
            Priority: <b>{task.priority || "High"}</b>
          </span>
          <span>
            Assigned To: <b>{task.assignedTo || "Not assigned"}</b>
          </span>
        </div>

        {task.images?.length > 0 && (
          <div className="images">
            {task.images.map((img, i) => (
              <img key={i} src={img} alt="task" />
            ))}
          </div>
        )}

        <div className="dates">
          <span>Start: {task.startDate || "-"}</span>
          <span>Due: {task.dueDate || "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
