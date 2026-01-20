import { useState } from "react";
import { getTasks, saveTasks } from "../../utils/taskService";
import "./CreateTask.scss";

const initialForm = {
  title: "",
  status: "Not Started",
  assignTo: "",
  priority: "High",
  progress: 45,
  division: "",
  group: "Not Started",
  description: "",
  startDate: "",
  dueDate: "",
};

const CreateTask = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    const tasks = getTasks();

    tasks.push({
      id: Date.now(),
      title: form.title,
      description: form.description,
      status: "pending",
      progress: Number(form.progress),
      priority: form.priority,
      createdBy: user.email,
      assignedTo: form.assignTo || null,
      createdAt: new Date().toISOString(),
    });

    saveTasks(tasks);

    setForm(initialForm);

    alert("Task created successfully");
  };

  const handleCancel = () => {
    setForm(initialForm);
  };

  return (
    <div className="create-task-wrapper">
      <h2>Create Task</h2>

      <div className="task-form">
        <div className="field">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Task Status *</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="field">
          <label>Assign To *</label>
          <input
            name="assignTo"
            placeholder="User email"
            value={form.assignTo}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Priority *</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="field">
          <label>% Complete</label>
          <input
            type="range"
            min="0"
            max="100"
            name="progress"
            value={form.progress}
            onChange={handleChange}
          />
          <span className="range-value">{form.progress}%</span>
        </div>

        <div className="field">
          <label>Group *</label>
          <select name="group" value={form.group} onChange={handleChange}>
            <option>Not Started</option>
            <option>Development</option>
            <option>Testing</option>
          </select>
        </div>

        <div className="field full">
          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Due Date *</label>
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
          SUBMIT
        </button>
        <button className="cancel" onClick={handleCancel}>
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
