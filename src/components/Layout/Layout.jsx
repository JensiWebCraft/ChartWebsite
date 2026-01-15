import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import "./Layout.scss";

const Layout = ({ onLogout }) => {
  return (
    <div className="layout">
      <Header />

      <div className="layout-body">
        <Sidebar onLogout={onLogout} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
