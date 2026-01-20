import { useState } from "react";
import { getTasks, saveTasks } from "../../utils/taskService";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const user = JSON.parse(localStorage.getItem("activeUser"));

  const handleCreate = () => {
    if (!title.trim()) return alert("Title required");

    const tasks = getTasks();

    tasks.push({
      id: Date.now(),
      title,
      description: desc,
      status: "pending",
      createdBy: user.email, 
      assignedTo: null,
      createdAt: new Date().toISOString(),
    });

    saveTasks(tasks);
    setTitle("");
    setDesc("");
    alert("Task created successfully");
  };

  return (
    <div className="page">
      <h2>Create Task</h2>

      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Task description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <button onClick={handleCreate}>Create Task</button>
    </div>
  );
};

export default CreateTask;
