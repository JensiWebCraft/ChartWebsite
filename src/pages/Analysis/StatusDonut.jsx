import { useState, useRef, useEffect } from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
import UmberTheme from "fusioncharts/themes/fusioncharts.theme.umber";
import ReactFC from "react-fusioncharts";
import { FiMoreVertical } from "react-icons/fi";
import "./StatusDonut.scss";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme, CandyTheme, UmberTheme);

/* 🔹 BUILT-IN FUSION THEMES (LIKE YOUR EXAMPLE) */
const THEMES = {
  default: "fusion",
  dark: "candy",
  pastel: "umber",
};

const StatusDonut = ({ tasks }) => {
  const chartId = "statusDonutChart";
  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [chartTheme, setChartTheme] = useState(THEMES.default);

  const count = (status) => tasks.filter((t) => t.status === status).length;

  /* 🔹 DOWNLOAD */
  const downloadChart = (type) => {
    FusionCharts.items[chartId]?.exportChart({
      exportFormat: type,
    });
    setMenuOpen(false);
  };

  /* 🔹 CLOSE MENU */
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <div className="chart-card">
      {/* HEADER */}
      <div className="chart-header">
        <h4>Tasks by Status</h4>

        <div className="menu-wrapper" ref={menuRef}>
          <FiMoreVertical
            className="menu-icon"
            onClick={() => setMenuOpen((p) => !p)}
          />

          {menuOpen && (
            <div className="chart-menu">
              <p className="menu-title">Theme</p>

              <button
                className={chartTheme === THEMES.default ? "active" : ""}
                onClick={() => {
                  (setChartTheme(THEMES.default), setMenuOpen(false));
                }}
              >
                fusion
              </button>
              <button
                className={chartTheme === THEMES.dark ? "active" : ""}
                onClick={() => {
                  (setChartTheme(THEMES.dark), setMenuOpen(false));
                }}
              >
                candy
              </button>
              <button
                className={chartTheme === THEMES.pastel ? "active" : ""}
                onClick={() => {
                  (setChartTheme(THEMES.pastel), setMenuOpen(false));
                }}
              >
                umber
              </button>

              <hr />
              {/* 
              <p className="menu-title">Download</p>
              <button onClick={() => downloadChart("png")}>PNG</button>
              <button onClick={() => downloadChart("jpg")}>JPG</button>
              <button onClick={() => downloadChart("svg")}>SVG</button> */}
            </div>
          )}
        </div>
      </div>

      {/* CHART */}
      <ReactFC
        id={chartId}
        type="doughnut2d"
        width="100%"
        height="320"
        dataFormat="json"
        dataSource={{
          chart: {
            caption: "Tasks by Status",
            subcaption: "All users",
            theme: chartTheme, // ✅ SAME AS `theme: "candy"`
            showPercentValues: "1",
            defaultCenterLabel: "Tasks",
            centerLabel: "$label: $value",
            doughnutRadius: "70%",
            exportEnabled: "1", // 🔑 REQUIRED FOR DOWNLOAD
          },
          data: [
            { label: "Pending", value: count("pending") },
            { label: "In Progress", value: count("inprogress") },
            { label: "Completed", value: count("completed") },
            { label: "Failed", value: count("failed") },
          ],
        }}
      />
    </div>
  );
};

export default StatusDonut;
