import React from "react";
import "./InputField.scss";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder = "",
  required = false,
  ...props
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${error ? "input-error" : ""}`}
        {...props}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InputField;
