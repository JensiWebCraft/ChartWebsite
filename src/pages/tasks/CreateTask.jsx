// src/components/CreateTask.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask, fetchTasks } from "../../store/taskSlice";
import BackButton from "../../components/BackButton/BackButton";
import TaskComments from "../../components/comments/TaskComments";
import "./CreateTask.scss";

const initialForm = {
  title: "",
  description: "",
  priority: "High",
  status: "pending",
  assignedTo: "", // ← confirm this matches your MockAPI field exactly
  startDate: "",
  dueDate: "",
};

const CreateTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState([]);
  const editorRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("activeUser")) || {
    email: "anonymous@example.com",
    role: "user",
  };

  const users = JSON.parse(localStorage.getItem("users_list")) || [];
  // Load task data when editing
  useEffect(() => {
    console.log("tasks", tasks);
    const A = tasks.filter((t) => {
      return t?.comments?.length > 0;
    });
    console.log(A);
    setNewComment(A);
    if (!isEdit) {
      setForm(initialForm);
      setComments([]);
      return;
    }

    if (tasks.length === 0 && !tasksLoading) {
      dispatch(fetchTasks());
    }

    // Safer ID comparison (string vs string)
    const task = tasks.find((t) => String(t.id) === String(id));

    if (!task) {
      // Wait for loading to finish before showing error
      if (!tasksLoading) {
        toast.error("Task not found");
        navigate("/tasks/list");
      }
      return;
    }

    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "High",
      status: task.status || "pending",
      assignedTo: task.assignedTo || task.assignTo || "", // handles both spellings
      startDate: task.startDate || "",
      dueDate: task.dueDate || "",
    });

    // Always make comments an array
    setComments(Array.isArray(task.comments) ? task.comments : []);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = task.description || "";
      }
    }, 100);
  }, [id, isEdit, navigate, tasks, dispatch, tasksLoading]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required";
        else if (value.trim().length < 5)
          error = "Title must be at least 5 characters";
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

  const validateDescription = () =>
    editorRef.current?.innerText.trim() ? "" : "Description is required";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

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
        <img src="${src}" alt="Uploaded" />
        <button class="remove-img" data-remove>×</button>
      </div>
      <p><br/></p>
    `,
    );
    setForm((prev) => ({ ...prev, description: editorRef.current.innerHTML }));
    setErrors((prev) => ({ ...prev, description: validateDescription() }));
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

    const removeHandler = (e) => {
      if (e.target.dataset.remove !== undefined) {
        e.target.closest(".img-block")?.remove();
        setForm((prev) => ({
          ...prev,
          description: editor.innerHTML,
        }));
        setErrors((prev) => ({ ...prev, description: validateDescription() }));
      }
    };

    editor.addEventListener("click", removeHandler);
    return () => editor.removeEventListener("click", removeHandler);
  }, []);

  const validateForm = () => {
    const newErrors = {
      title: validateField("title", form.title),
      startDate: validateField("startDate", form.startDate),
      dueDate: validateField("dueDate", form.dueDate),
      description: validateDescription(),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);

    const taskPayload = {
      ...form,
      description: editorRef.current?.innerHTML || "",
      assignedTo: form.assignedTo || null, // allow unassigned
      createdBy: user.email,
      // Critical: Do NOT send createdAt on update!
      createdAt: isEdit ? undefined : new Date().toISOString(),
      comments: Array.isArray(comments) ? comments : [],
    };

    try {
      if (isEdit) {
        await dispatch(updateTask({ id, data: taskPayload })).unwrap();
        toast.success("Task updated successfully!");
      } else {
        await dispatch(createTask(taskPayload)).unwrap();
        toast.success("Task created successfully!");
      }

      setTimeout(() => navigate("/tasks/list"), 1800);
    } catch (err) {
      console.error("Task save failed:", err);
      toast.error("Failed to save task: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewComment = (newComment) => {
    const updatedComments = Array.isArray(comments)
      ? [...comments, newComment]
      : [newComment];

    setComments(updatedComments);

    if (isEdit) {
      dispatch(
        updateTask({
          id,
          data: {
            ...form,
            description: editorRef.current?.innerHTML || "",
            comments: updatedComments,
          },
        }),
      );
    }

    toast.success("Comment added");
  };

  if (isEdit && (tasksLoading || !tasks.some((t) => String(t.id) === id))) {
    return <div className="loading">Loading task...</div>;
  }

  return (
    <div className="create-task-wrapper">
      {isEdit && <BackButton />}
      <ToastContainer position="top-right" autoClose={2000} />

      <h2>{isEdit ? "Edit Task" : "Create Task"}</h2>

      <div className="task-form">
        {/* Title */}
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

        {/* Status */}
        <div className="field">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="field">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Description */}
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

        {/* Dates */}
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

        {/* Assign To - populated with users */}
        <div className="field">
          <label>Assign To</label>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
          >
            <option value="">Unassigned</option>
            {users
              .filter((u) => u.role === "user")
              .map((u) => (
                <option key={u.email} value={u.email}>
                  {u.name || u.email}
                </option>
              ))}
          </select>
        </div>
      </div>

      <TaskComments
        comments={comments}
        newComments={newComment}
        currentUser={user}
        onSave={handleNewComment}
      />

      <div className="actions">
        <button
          className="submit"
          onClick={handleSubmit}
          disabled={submitting || Object.values(errors).some((e) => e)}
        >
          {submitting ? "Saving..." : isEdit ? "UPDATE" : "CREATE"}
        </button>
        <button
          className="cancel"
          onClick={() => navigate("/tasks/list")}
          disabled={submitting}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
