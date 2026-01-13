import React, { useEffect, useState } from "react";
import InputField from "../components/common/InputField";
import { useNavigate } from "react-router-dom";
import "./AddUser.scss";
import { toast } from "react-toastify";

const STORAGE_KEY = "users_list";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

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
  const [existingUsers, setExistingUsers] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : [{ name: "John Doe", email: "john@example.com" }];
  });

  const [formData, setFormData] = useState(initialFormData);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const passwordChecks = {
    length: PASSWORD_RULES.length.test(formData.password),
    uppercase: PASSWORD_RULES.uppercase.test(formData.password),
    lowercase: PASSWORD_RULES.lowercase.test(formData.password),
    special: PASSWORD_RULES.special.test(formData.password),
  };
  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.special;

  const isFormValid = () => {
    if (!formData.name.trim()) return false;
    if (formData.name.length < 2) return false;
    if (checkNameExists(formData.name)) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return false;
    if (checkEmailExists(formData.email)) return false;

    if (!PASSWORD_RULES.length.test(formData.password)) return false;
    if (!PASSWORD_RULES.uppercase.test(formData.password)) return false;
    if (!PASSWORD_RULES.lowercase.test(formData.password)) return false;
    if (!PASSWORD_RULES.special.test(formData.password)) return false;

    return true;
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUsers));
  }, [existingUsers]);

  useEffect(() => {
    if (formData.role === "user") {
      setTheme(DEFAULT_THEME);
    }
  }, [formData.role]);

  const checkNameExists = (name) =>
    existingUsers.some(
      (u) => u.name.toLowerCase() === name.trim().toLowerCase()
    );

  const checkEmailExists = (email) =>
    existingUsers.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

  const generateNameSuggestions = (base) => {
    if (!base.trim()) return setNameSuggestions([]);

    const clean = base.trim().replace(/\s+/g, "");
    const list = [];
    let i = 1;

    while (list.length < 5) {
      const candidate = `${clean}${i}`;
      const exists = existingUsers.some(
        (u) => u.name.toLowerCase() === candidate.toLowerCase()
      );
      if (!exists) list.push(candidate);
      i++;
    }
    setNameSuggestions(list);
  };

  const validateEmail = () => {
    let error = "";
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      error = "Email required";
    } else if (!emailRegex.test(email)) {
      error = "Invalid email";
    } else if (checkEmailExists(email)) {
      error = "Email already registered";
    }

    setErrors((prev) => ({ ...prev, email: error }));
  };

  const validateForm = () => {
    const err = {};

    if (!formData.name.trim()) err.name = "Name is required";
    else if (formData.name.length < 2) err.name = "Minimum 2 characters";
    else if (checkNameExists(formData.name)) err.name = "Name already taken";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) err.email = "Email required";
    else if (!emailRegex.test(formData.email)) err.email = "Invalid email";
    else if (checkEmailExists(formData.email))
      err.email = "Email already registered";

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

      let error = "";

      if (!PASSWORD_RULES.length.test(value)) {
        error = "Minimum 8 characters required";
      } else if (!PASSWORD_RULES.uppercase.test(value)) {
        error = "At least 1 uppercase letter required";
      } else if (!PASSWORD_RULES.lowercase.test(value)) {
        error = "At least 1 lowercase letter required";
      } else if (!PASSWORD_RULES.special.test(value)) {
        error = "At least 1 special character required";
      }

      setErrors((prev) => ({ ...prev, password: error }));
    }

    if (name === "name" && value.length >= 2 && checkNameExists(value)) {
      generateNameSuggestions(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      toast.error("Please correct the errors");
      return;
    }

    const newUser = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      theme: formData.role === "user" ? DEFAULT_THEME : theme,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    setExistingUsers(updatedUsers);

    toast.success("User created successfully 🎉");

    setFormData(initialFormData);
    setErrors({});
    setSubmitted(false);
    setNameSuggestions([]);
    setPasswordTouched(false);
    setNameTouched(false);
    setEmailTouched(false);

    // OPTIONAL: redirect after short delay
    // setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="add-user-container">
      <div className="card">
        <h2>Create New User</h2>

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

            {nameSuggestions.length > 0 && (
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
                      setSubmitted(false);
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
              if (emailTouched) validateEmail();
            }}
            onBlur={() => {
              setEmailTouched(true);
              validateEmail();
            }}
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
            <ul style={{ fontSize: "12px", marginTop: "6px" }}>
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

          <div style={{ marginTop: "12px" }}>
            <label>Role</label>
            <div style={{ display: "flex", gap: "16px" }}>
              {["superadmin", "admin", "user"].map((r) => (
                <label key={r}>
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={formData.role === r}
                    onChange={handleChange}
                  />{" "}
                  {r.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "20px" }}>
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
                        height: "40px",
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
                  gap: "10px",
                }}
              >
                {Object.keys(ADMIN_COLORS).map((key) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "5px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "12px",
                      }}
                    >
                      {key.toUpperCase()}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      {ADMIN_COLORS[key].map((color) => {
                        const selected = theme[key] === color;

                        return (
                          <div
                            key={color}
                            onClick={() =>
                              setTheme((prev) => ({ ...prev, [key]: color }))
                            }
                            style={{
                              width: "17px",
                              height: "17px",
                              borderRadius: "50%",
                              background: color,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: selected
                                ? "3px solid #111"
                                : "2px solid #e5e7eb",
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
                      opacity: 0.6,
                    }}
                  >
                    <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                      {key.toUpperCase()}
                    </p>
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
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
            )}
          </div>

          <button
            style={{ marginTop: "20px" }}
            type="submit"
            className="btn"
            disabled={!isFormValid()}
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
