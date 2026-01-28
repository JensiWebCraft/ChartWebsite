import { useEffect, useState, useRef } from "react";
import { getTasks, saveTasks, getTaskById } from "../../utils/taskService";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateTask.scss";
import BackButton from "../../components/BackButton/BackButton";
import TaskComments from "../../components/comments/TaskComments";

const initialForm = {
  title: "",
  description: "",
  priority: "High",
  status: "pending",
  assignTo: "",
  startDate: "",
  dueDate: "",
};

const CreateTask = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({}); // errors object for each field
  const [comments, setComments] = useState([]);

  const editorRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const user = JSON.parse(localStorage.getItem("activeUser")) || {
    email: "anonymous@example.com",
    role: "user",
  };

  // Load task only when editing
  useEffect(() => {
    if (!isEdit) {
      setComments([]);
      return;
    }

    const task = getTaskById(id);
    if (!task) {
      toast.error("Task not found");
      navigate("/tasks/list");
      return;
    }

    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "High",
      status: task.status || "pending",
      assignTo: task.assignTo || task.assignedTo || "",
      startDate: task.startDate || "",
      dueDate: task.dueDate || "",
    });

    setComments(task.comments || []);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = task.description || "";
      }
    }, 0);
  }, [id, isEdit, navigate]);

  // Real-time validation when form changes
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required";
        else if (value.trim().length < 3)
          error = "Title must be at least 3 characters";
        break;
      case "startDate":
        if (!value) error = "Start date is required";
        break;
      case "dueDate":
        if (!value) error = "Due date is required";
        else if (form.startDate && value < form.startDate)
          error = "Due date must be after start date";
        break;
      default:
        break;
    }

    return error;
  };

  // Validate description separately (rich text)
  const validateDescription = () => {
    if (!editorRef.current?.innerText.trim()) {
      return "Description is required";
    }
    return "";
  };

  // Update errors on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate the changed field
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Validate description on input
  const handleEditorInput = () => {
    const descError = validateDescription();
    setErrors((prev) => ({ ...prev, description: descError }));
    setForm((prev) => ({
      ...prev,
      description: editorRef.current.innerHTML,
    }));
  };

  // Image handling (unchanged)
  const compressImage = (file, maxWidth = 600, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
      };
    });
  };

  const insertImage = (src) => {
    if (!editorRef.current) return;
    editorRef.current.insertAdjacentHTML(
      "beforeend",
      `
      <div class="img-block" contenteditable="false">
        <img src="${src}" />
        <button class="remove-img" data-remove>×</button>
      </div>
      <p><br/></p>
    `,
    );
    setForm((prev) => ({
      ...prev,
      description: editorRef.current.innerHTML,
    }));
    // Re-validate description after image add
    const descError = validateDescription();
    setErrors((prev) => ({ ...prev, description: descError }));
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const compressed = await compressImage(file);
          insertImage(compressed);
        }
      }
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).filter((f) =>
      f.type.startsWith("image/"),
    );
    for (const file of files) {
      const compressed = await compressImage(file);
      insertImage(compressed);
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handler = (e) => {
      if (e.target.dataset.remove !== undefined) {
        e.target.closest(".img-block")?.remove();
        setForm((prev) => ({
          ...prev,
          description: editor.innerHTML,
        }));
        const descError = validateDescription();
        setErrors((prev) => ({ ...prev, description: descError }));
      }
    };

    editor.addEventListener("click", handler);
    return () => editor.removeEventListener("click", handler);
  }, []);

  // Full form validation before submit
  const validateForm = () => {
    const newErrors = {};

    newErrors.title = validateField("title", form.title);
    newErrors.startDate = validateField("startDate", form.startDate);
    newErrors.dueDate = validateField("dueDate", form.dueDate);
    newErrors.description = validateDescription();

    setErrors(newErrors);

    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const currentDescription = editorRef.current?.innerHTML || form.description;

    const taskData = {
      ...form,
      description: currentDescription,
      assignTo: form.assignTo.trim(),
      comments,
    };

    const allTasks = getTasks();

    if (isEdit) {
      saveTasks(
        allTasks.map((t) =>
          t.id === Number(id)
            ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
            : t,
        ),
      );
      toast.success("Task updated successfully");
    } else {
      saveTasks([
        ...allTasks,
        {
          id: Date.now(),
          ...taskData,
          createdBy: user.email,
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success("Task created successfully");
    }

    setTimeout(() => navigate("/tasks/list"), 1500);
  };

  const handleNewComment = (newComment) => {
    setComments((prev) => [...prev, newComment]);

    // Save immediately
    const allTasks = getTasks();

    if (isEdit) {
      const updatedTasks = allTasks.map((t) =>
        t.id === Number(id)
          ? { ...t, comments: [...(t.comments || []), newComment] }
          : t,
      );
      saveTasks(updatedTasks);
    } else {
      // Create mode - save as real task
      const taskData = {
        id: Date.now(),
        ...form,
        description: editorRef.current?.innerHTML || form.description,
        assignTo: form.assignTo.trim(),
        comments: [...comments, newComment],
        createdBy: user.email,
        createdAt: new Date().toISOString(),
      };

      saveTasks([...allTasks, taskData]);
    }

    toast.success("Comment added");
  };

  return (
    <div className="create-task-wrapper">
      {isEdit && <BackButton />}
      <ToastContainer position="top-right" autoClose={2000} />

      <h2>{isEdit ? "Edit Task" : "Create Task"}</h2>

      <div className="task-form">
        <div className="field">
          <label>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
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
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="field full">
          <label>Description *</label>
          <div
            className="description-editor"
            contentEditable
            ref={editorRef}
            onInput={handleEditorInput}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          />
          {errors.description && (
            <span className="error">{errors.description}</span>
          )}
        </div>

        <div className="field">
          <label>Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
          {errors.startDate && (
            <span className="error">{errors.startDate}</span>
          )}
        </div>

        <div className="field">
          <label>Due Date *</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
          {errors.dueDate && <span className="error">{errors.dueDate}</span>}
        </div>
      </div>

      {/* Comments box – visible on both create and edit */}
      <TaskComments
        comments={comments}
        currentUser={user}
        onSave={handleNewComment}
      />

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
