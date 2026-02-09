import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../components/common/InputField";
import { addUser, fetchUsers } from "../store/userSlice"; // adjust path
import "./AddUser.scss";

const DEFAULT_THEME = {
  primary: "#4f46e5",
  secondary: "#22c55e",
  font: "#111827",
};

const ADMIN_COLORS = {
  primary: ["#4f46e5", "#0ea5e9", "#16a34a"],
  secondary: ["#22c55e", "#f59e0b", "#ef4444"],
  font: ["#111827", "#1f2937", "#374151"],
};

const PASSWORD_RULES = {
  length: /.{8,}/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

const AddUser = () => {
  const dispatch = useDispatch();
 

  const { users, loading } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

 
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const passwordChecks = {
    length: PASSWORD_RULES.length.test(formData.password),
    uppercase: PASSWORD_RULES.uppercase.test(formData.password),
    lowercase: PASSWORD_RULES.lowercase.test(formData.password),
    special: PASSWORD_RULES.special.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const checkNameExists = (name) =>
    users.some((u) => u.name?.toLowerCase() === name.trim().toLowerCase());

  const checkEmailExists = (email) =>
    users.some((u) => u.email?.toLowerCase() === email.trim().toLowerCase());

  const generateNameSuggestions = (base) => {
    if (!base.trim()) {
      setNameSuggestions([]);
      return;
    }

    const clean = base.trim().replace(/\s+/g, "");
    const list = [];
    let i = 1;

    while (list.length < 5) {
      const candidate = `${clean}${i}`;
      if (
        !users.some((u) => u.name?.toLowerCase() === candidate.toLowerCase())
      ) {
        list.push(candidate);
      }
      i++;
    }
    setNameSuggestions(list);
  };

  const validateForm = () => {
    const err = {};

    // Name
    if (!formData.name.trim()) {
      err.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      err.name = "Minimum 2 characters";
    } else if (checkNameExists(formData.name)) {
      err.name = "Name already taken";
      generateNameSuggestions(formData.name);
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      err.email = "Email required";
    } else if (!emailRegex.test(formData.email.trim())) {
      err.email = "Invalid email";
    } else if (checkEmailExists(formData.email)) {
      err.email = "Email already registered";
    }

    // Password
    if (!formData.password) {
      err.password = "Password is required";
    } else if (!PASSWORD_RULES.length.test(formData.password)) {
      err.password = "Minimum 8 characters required";
    } else if (!PASSWORD_RULES.uppercase.test(formData.password)) {
      err.password = "At least 1 uppercase letter required";
    } else if (!PASSWORD_RULES.lowercase.test(formData.password)) {
      err.password = "At least 1 lowercase letter required";
    } else if (!PASSWORD_RULES.special.test(formData.password)) {
      err.password = "At least 1 special character required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordTouched(true);
    }

    if (name === "name" && value.trim().length >= 2 && checkNameExists(value)) {
      generateNameSuggestions(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      toast.error("Please correct the errors");
      return;
    }

    const newUser = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password, // ← in real app: NEVER send plain password!
      role: formData.role,
      theme: formData.role === "user" ? DEFAULT_THEME : theme,
      createdAt: new Date().toISOString(),
    };

    try {
      await dispatch(addUser(newUser)).unwrap();
      toast.success("User created successfully 🎉");

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
      setTheme(DEFAULT_THEME);
      setErrors({});
      setSubmitted(false);
      setNameSuggestions([]);
      setPasswordTouched(false);
      setNameTouched(false);
      setEmailTouched(false);

      // Optional: navigate("/users") or "/dashboard"
      // setTimeout(() => navigate("/users"), 1200);
    } catch (err) {
      toast.error("Failed to create user: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="add-user-container">
      <div className="card">
        <h2>Create New User</h2>

        {loading && <p style={{ color: "#666" }}>Loading users...</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ position: "relative" }}>
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => setNameTouched(true)}
              error={submitted || nameTouched ? errors.name : ""}
            />

            {(submitted || nameTouched) && nameSuggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,.1)",
                  zIndex: 10,
                }}
              >
                {nameSuggestions.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setFormData((p) => ({ ...p, name: s }));
                      setErrors((p) => ({ ...p, name: "" }));
                      setNameSuggestions([]);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f1f5f9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              handleChange(e);
              if (emailTouched) {
                // optional live validation
              }
            }}
            onBlur={() => setEmailTouched(true)}
            error={submitted || emailTouched ? errors.email : ""}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={passwordTouched ? errors.password : ""}
          />

          {passwordTouched && !isPasswordValid && (
            <ul
              style={{
                fontSize: "12px",
                marginTop: "6px",
                paddingLeft: "20px",
              }}
            >
              <li style={{ color: passwordChecks.length ? "green" : "red" }}>
                {passwordChecks.length ? "✔" : "✖"} Minimum 8 characters
              </li>
              <li style={{ color: passwordChecks.uppercase ? "green" : "red" }}>
                {passwordChecks.uppercase ? "✔" : "✖"} 1 uppercase letter
              </li>
              <li style={{ color: passwordChecks.lowercase ? "green" : "red" }}>
                {passwordChecks.lowercase ? "✔" : "✖"} 1 lowercase letter
              </li>
              <li style={{ color: passwordChecks.special ? "green" : "red" }}>
                {passwordChecks.special ? "✔" : "✖"} 1 special character
              </li>
            </ul>
          )}

          <div style={{ marginTop: "16px" }}>
            <label>Role</label>
            <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
              {["superadmin", "admin", "user"].map((r) => (
                <label key={r} style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={formData.role === r}
                    onChange={handleChange}
                  />{" "}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* ────────────────────────────────────────────── */}
          {/*               THEME SELECTION                  */}
          {/* ────────────────────────────────────────────── */}
          <div className="form-group" style={{ marginTop: "24px" }}>
            <label className="form-label">Theme Selection</label>

            {formData.role === "superadmin" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                {["primary", "secondary", "font"].map((key) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                      {key.toUpperCase()}
                    </p>
                    <input
                      type="color"
                      value={theme[key]}
                      onChange={(e) =>
                        setTheme((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        height: "44px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {formData.role === "admin" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                }}
              >
                {Object.keys(ADMIN_COLORS).map((key) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "10px",
                      }}
                    >
                      {key.toUpperCase()}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      {ADMIN_COLORS[key].map((color) => {
                        const selected = theme[key] === color;
                        return (
                          <div
                            key={color}
                            onClick={() =>
                              setTheme((p) => ({ ...p, [key]: color }))
                            }
                            style={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              background: color,
                              cursor: "pointer",
                              border: selected
                                ? "3px solid #000"
                                : "2px solid #d1d5db",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {selected && (
                              <span
                                style={{
                                  color: "#fff",
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                ✓
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.role === "user" && (
              <div style={{ opacity: 0.6, pointerEvents: "none" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "16px",
                  }}
                >
                  {Object.entries(DEFAULT_THEME).map(([key, color]) => (
                    <div
                      key={key}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                        {key.toUpperCase()}
                      </p>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          margin: "0 auto",
                          borderRadius: "50%",
                          background: color,
                          border: "1px solid #ccc",
                        }}
                      />
                      <small style={{ fontSize: "11px", color: "#6b7280" }}>
                        Default
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn"
            style={{ marginTop: "28px", width: "100%" }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
