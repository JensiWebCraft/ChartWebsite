const TASK_KEY = "tasks";

export const getTasks = () => {
  return JSON.parse(localStorage.getItem(TASK_KEY)) || [];
};

export const saveTasks = (tasks) => {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  // window.dispatchEvent(new Event("tasksUpdated"));
};
