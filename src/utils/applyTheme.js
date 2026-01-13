export const applyTheme = (theme, role) => {
  if (!theme) return;

  document.documentElement.style.setProperty("--primary", theme.primary);
  document.documentElement.style.setProperty("--secondary", theme.secondary);
  document.documentElement.style.setProperty("--font", theme.font);

  if (role === "admin" || role === "superadmin") {
    document.documentElement.style.setProperty("--admin-bg", "#e8f5e9");
  } else {
    document.documentElement.style.setProperty("--admin-bg", "#ffffff");
  }
};
