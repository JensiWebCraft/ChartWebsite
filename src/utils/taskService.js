const TASK_KEY = "tasks";

/* 🔹 GET ALL TASKS */
export const getTasks = () => {
  return JSON.parse(localStorage.getItem(TASK_KEY)) || [];
};

/* 🔹 SAVE TASKS + NOTIFY UI */
export const saveTasks = (tasks) => {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));

  // 🔥 IMPORTANT: notify charts & lists
  window.dispatchEvent(new Event("tasksUpdated"));
};

/* 🔹 DELETE TASK */
export const deleteTask = (id) => {
  const tasks = getTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
};

/* 🔹 GET SINGLE TASK (EDIT MODE) */
export const getTaskById = (id) => {
  return getTasks().find((t) => t.id === Number(id));
};
