export const applyTheme = (user) => {
  if (!user || !user.theme) return;

  const root = document.documentElement;

  // USER → fixed default
  if (user.role === "user") {
    root.style.setProperty("--primary", "#4f46e5");
    root.style.setProperty("--secondary", "#22c55e");
    root.style.setProperty("--text-main", "#111827");
    return;
  }

  // ADMIN & SUPERADMIN → apply saved theme
  Object.entries(user.theme).forEach(([key, value]) => {
    if (key === "font") {
      root.style.setProperty("--text-main", value);
    } else {
      root.style.setProperty(`--${key}`, value);
    }
  });
};
