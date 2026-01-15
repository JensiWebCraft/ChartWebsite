const Header = ({ onLogout }) => {
  return (
    <header
      style={{
        height: "60px",
        background: "var(--primary)",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        position: "fixed",
        left: 0,
        top: 0,
        right: 0,
      }}
    >
      <h3>Admin Panel</h3>
      <button onClick={onLogout}>Logout</button>
    </header>
  );
};

export default Header;
