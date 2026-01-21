import { useEffect, useState } from "react";
import { getTasks, saveTasks, getTaskById } from "../../utils/taskService";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateTask.scss";

const initialForm = {
  title: "",
  description: "",
  priority: "High",
  status: "pending",
  assignTo: "",
  startDate: "",
  dueDate: "",
  images: [],
};

const CreateTask = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);

  /* 🔹 LOAD TASK FOR EDIT */
  useEffect(() => {
    if (isEdit) {
      const task = getTaskById(id);
      if (task) {
        setForm({
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "High",
          status: task.status || "pending",
          assignTo: task.assignedTo || "",
          startDate: task.startDate || "",
          dueDate: task.dueDate || "",
          images: task.images || [],
        });
      }
    }
  }, [id, isEdit]);

  /* 🔹 HANDLE INPUT */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* 🔹 IMAGE DRAG & DROP */
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((p) => ({ ...p, images: [...p.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  /* 🔹 SUBMIT */
  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Title required");
      return;
    }

    const tasks = getTasks();

    if (isEdit) {
      const updated = tasks.map((t) =>
        t.id === Number(id)
          ? { ...t, ...form, updatedAt: new Date().toISOString() }
          : t,
      );

      saveTasks(updated);
      alert("Task updated successfully");
    } else {
      saveTasks([
        ...tasks,
        {
          id: Date.now(),
          ...form,
          createdBy: user.email,
          createdAt: new Date().toISOString(),
        },
      ]);
      alert("Task created successfully");
    }

    navigate("/tasks/list");
  };

  return (
    <div className="create-task-wrapper">
      <h2>{isEdit ? "Edit Task" : "Create Task"}</h2>

      <div className="task-form">
        <div className="field">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="field">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="field full">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <div
            className="image-drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            Drag & drop images here
          </div>

          {form.images.length > 0 && (
            <div className="image-preview">
              {form.images.map((img, i) => (
                <img key={i} src={img} alt="task" />
              ))}
            </div>
          )}
        </div>

        <div className="field">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="actions">
        <button className="submit" onClick={handleSubmit}>
          {isEdit ? "UPDATE" : "CREATE"}
        </button>
        <button className="cancel" onClick={() => navigate("/tasks/list")}>
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
