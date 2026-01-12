import { useState } from "react";

function AddUser({ onUserCreated }) {
  const [form, setForm] = useState({
    id: "",
    email: "",
    password: "",
    role: "",
    theme: "#4caf50",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.id.trim()) newErrors.id = "User ID is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.role) newErrors.role = "Please select a role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    localStorage.setItem("user", JSON.stringify(form));
    onUserCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="form add-user">
      <h3>Add User</h3>
      <input
        name="id"
        placeholder="User ID"
        value={form.id}
        onChange={handleChange}
      />
      {errors.id && <span className="error">{errors.id}</span>}

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <label>
        <input type="radio" name="role" value="admin" onChange={handleChange} />{" "}
        Admin
      </label>

      <label>
        <input type="radio" name="role" value="user" onChange={handleChange} />{" "}
        User
      </label>
      {errors.role && <span className="error">{errors.role}</span>}

      <label>Choose Theme</label>
      <input
        type="color"
        name="theme"
        value={form.theme}
        onChange={handleChange}
      />

      <button style={{ background: form.theme, color: "orange" }}>
        Add User
      </button>
    </form>
  );
}

export default AddUser;
