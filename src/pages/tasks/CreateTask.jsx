import { useEffect, useState, useRef } from "react";
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
};

const CreateTask = () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const editorRef = useRef(null);

  const compressImage = (file, maxWidth = 600, quality = 0.6) => {
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

  /* LOAD TASK FOR EDIT */
  useEffect(() => {
    if (!isEdit) return;

    const task = getTaskById(id);
    if (!task) return;

    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "High",
      status: task.status || "pending",
      assignTo: task.assignedTo || "",
      startDate: task.startDate || "",
      dueDate: task.dueDate || "",
    });

    // ✅ restore HTML (image + text)
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = task.description || "";
      }
    }, 0);
  }, [id, isEdit]);

  /* INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* INSERT IMAGE (AUTO SMALL) */
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

    setForm((p) => ({
      ...p,
      description: editorRef.current.innerHTML,
    }));
  };

  /* HANDLE IMAGE PASTE */
  const handlePaste = async (e) => {
    const items = e.clipboardData.items;

    for (let item of items) {
      if (item.type.startsWith("image")) {
        e.preventDefault();
        const file = item.getAsFile();
        const compressed = await compressImage(file);
        insertImage(compressed);
      }
    }
  };

  /* HANDLE IMAGE DROP */
  const handleDrop = async (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );

    for (let file of files) {
      const compressed = await compressImage(file);
      insertImage(compressed);
    }
  };

  /* REMOVE IMAGE CLICK */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handler = (e) => {
      if (e.target.dataset.remove !== undefined) {
        e.target.parentElement.remove();
        setForm((p) => ({
          ...p,
          description: editor.innerHTML,
        }));
      }
    };

    editor.addEventListener("click", handler);
    return () => editor.removeEventListener("click", handler);
  }, []);

  /* SUBMIT */
  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Title required");
      return;
    }

    const tasks = getTasks();

    if (isEdit) {
      saveTasks(
        tasks.map((t) =>
          t.id === Number(id)
            ? { ...t, ...form, updatedAt: new Date().toISOString() }
            : t,
        ),
      );
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

        {/* DESCRIPTION */}
        <div className="field full">
          <label>Description</label>
          <div
            className="description-editor"
            contentEditable
            ref={editorRef}
            onInput={() =>
              setForm((p) => ({
                ...p,
                description: editorRef.current.innerHTML,
              }))
            }
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          ></div>
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
