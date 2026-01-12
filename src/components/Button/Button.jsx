import "./Button.scss";

function Button({ text, active, onClick }) {
  return (
    <button className={`btn ${active ? "active" : ""}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
