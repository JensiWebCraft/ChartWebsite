import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import "./Layout.scss";

const Layout = ({ onLogout }) => {
  return (
    <div className="layout">
      <Header onLogout={onLogout} />

      <div className="layout-body">
        <Sidebar />
        <main className="layout-content">
          <Outlet /> {/* ROUTED PAGE */}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
