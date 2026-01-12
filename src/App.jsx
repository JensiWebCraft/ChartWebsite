import { useState } from "react";
import AuthTabs from "./components/AuthTabs/AuthTabs";
import Dashboard from "./pages/Dashboard";
import "./App.scss";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <Dashboard />
  ) : (
    <AuthTabs onLogin={() => setIsLoggedIn(true)} />
  );
}

export default App;
