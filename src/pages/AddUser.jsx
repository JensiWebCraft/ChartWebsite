// AddUser.jsx
import { useState } from "react";

function AddUser({ onUserCreated }) {
  const USER_DEFAULT_THEME = {
    primary: "#4CAF50",
    secondary: "#2196F6",
    font: "#212121",
  };

  const roleLabels = {
    superadmin: "Super Admin",
    admin: "Administrator",
    user: "Regular User",
  };

  const colorOptions = {
    primary: [
      { name: "Green", value: "#4CAF50" },
      { name: "Blue", value: "#2196F6" },
      { name: "Orange", value: "#FF9800" },
    ],
    secondary: [
      { name: "Purple", value: "#9C27B0" },
      { name: "Light Blue", value: "#03A9F4" },
      { name: "Lime", value: "#CDDC39" },
    ],
    font: [
      { name: "Dark Gray", value: "#212121" },
      { name: "White", value: "#FFFFFF" },
      { name: "Deep Orange", value: "#FF5722" },
    ],
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    theme: USER_DEFAULT_THEME,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      if (value === "user") {
        setForm({
          ...form,
          [name]: value,
          theme: USER_DEFAULT_THEME,
        });
      } else {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handleThemeChange = (type, value) => {
    if (form.role === "user") return;

    setForm({
      ...form,
      theme: { ...form.theme, [type]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.role) newErrors.role = "Please select a role";
    if (form.password.length === 0) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({
      ...form,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("users", JSON.stringify(users));

    alert("User created successfully!");
    onUserCreated?.();

    setForm({
      name: "",
      email: "",
      password: "",
      role: "",
      theme: USER_DEFAULT_THEME,
    });
    setErrors({});
  };

  return (
    <div className="add-user-container">
      <form className="add-user-form" onSubmit={handleSubmit}>
        <h2>Add New User</h2>

        {/* NAME */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@domain.com"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* ROLE */}
        <div className="form-group">
          <label>Role</label>
          <div className="role-radio-group">
            {["superadmin", "admin", "user"].map((r) => (
              <label key={r} className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={form.role === r}
                  onChange={handleChange}
                />
                {roleLabels[r]}
              </label>
            ))}
          </div>
          {errors.role && <span className="error">{errors.role}</span>}
        </div>

        {/* ===================== THEME SELECTION ===================== */}

        {form.role === "superadmin" && (
          <div className="theme-section">
            <h3>Custom Theme</h3>
            <div className="superadmin-theme-grid">
              {["primary", "secondary", "font"].map((type) => (
                <div key={type} className="color-picker-group">
                  <label className="color-label">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Color
                  </label>

                  <div className="color-swatches">
                    {[
                      "#4CAF50",
                      "#66BB6A",
                      "#81C784",
                      "#2196F6",
                      "#42A5F5",
                      "#64B5F6",
                      "#FF9800",
                      "#FFB74D",
                      "#FFCC80",
                      "#F44336",
                      "#EF5350",
                      "#E57373",
                      "#9C27B0",
                      "#AB47BC",
                      "#CE93D8",
                      "#009688",
                      "#26A69A",
                      "#4DB6AC",
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-swatch ${
                          form.theme[type] === color ? "selected" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleThemeChange(type, color)}
                        title={color}
                        aria-label={`Select color ${color}`}
                      />
                    ))}

                    {/* Custom color picker */}
                    <div className="custom-color-wrapper">
                      <input
                        type="color"
                        value={form.theme[type]}
                        onChange={(e) =>
                          handleThemeChange(type, e.target.value)
                        }
                        className="hidden-color-input"
                        id={`color-picker-${type}`}
                      />
                      <label
                        htmlFor={`color-picker-${type}`}
                        className={`color-swatch custom-swatch ${
                          form.theme[type] ===
                          document.getElementById(`color-picker-${type}`)?.value
                            ? "selected"
                            : ""
                        }`}
                        style={{ backgroundColor: form.theme[type] }}
                      >
                        <span className="custom-icon">✦</span>
                      </label>
                    </div>
                  </div>

                  <div className="selected-color-preview">
                    <div
                      className="big-color-preview"
                      style={{ backgroundColor: form.theme[type] }}
                    />
                    <span className="hex-code">
                      {form.theme[type].toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {form.role === "admin" && (
          <div className="theme-section">
            <h3>Theme Settings</h3>
            <div className="theme-card">
              <div className="theme-card-header">Primary Color</div>
              <select
                value={form.theme.primary}
                onChange={(e) => handleThemeChange("primary", e.target.value)}
              >
                {colorOptions.primary.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <div
                className="color-display"
                style={{ backgroundColor: form.theme.primary }}
              />
            </div>

            <div className="theme-card">
              <div className="theme-card-header">Secondary Color</div>
              <select
                value={form.theme.secondary}
                onChange={(e) => handleThemeChange("secondary", e.target.value)}
              >
                {colorOptions.secondary.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <div
                className="color-display"
                style={{ backgroundColor: form.theme.secondary }}
              />
            </div>

            <div className="theme-card">
              <div className="theme-card-header">Text Color</div>
              <select
                value={form.theme.font}
                onChange={(e) => handleThemeChange("font", e.target.value)}
              >
                {colorOptions.font.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <div
                className="color-display"
                style={{ backgroundColor: form.theme.font }}
              />
              <div className="font-sample" style={{ color: form.theme.font }}>
                Aa Bb Cc Preview
              </div>
            </div>
          </div>
        )}

        {form.role === "user" && (
          <div className="theme-section fixed-theme">
            <h3>Theme (Fixed for Users)</h3>
            <div className="fixed-preview-grid">
              <div className="fixed-item">
                <div
                  className="small-color"
                  style={{ backgroundColor: form.theme.primary }}
                />
                <span>Primary</span>
              </div>
              <div className="fixed-item">
                <div
                  className="small-color"
                  style={{ backgroundColor: form.theme.secondary }}
                />
                <span>Secondary</span>
              </div>
              <div className="fixed-item">
                <div
                  className="small-color"
                  style={{ backgroundColor: form.theme.font }}
                />
                <span>Text</span>
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="submit-button">
          Create User
        </button>
      </form>
    </div>
  );
}

export default AddUser;
