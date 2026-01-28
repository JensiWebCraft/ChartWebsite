import { useState, useRef, useEffect } from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
import UmberTheme from "fusioncharts/themes/fusioncharts.theme.umber";
import ReactFC from "react-fusioncharts";
import { FiMoreVertical } from "react-icons/fi";
import "./TrendChart.scss";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme, CandyTheme, UmberTheme);

/* 🔹 BUILT-IN FUSION THEMES */
const THEMES = {
  default: "fusion",
  dark: "candy",
  pastel: "umber",
};

const TrendChart = ({ tasks }) => {
  const chartId = "trendChart";
  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [chartTheme, setChartTheme] = useState(THEMES.default);

  /* 🔹 STATUS COUNT */
  const statusCount = {
    pending: 0,
    inprogress: 0,
    completed: 0,
    failed: 0,
  };

  tasks.forEach((t) => {
    if (statusCount[t.status] !== undefined) {
      statusCount[t.status]++;
    }
  });

  const data = Object.keys(statusCount).map((k) => ({
    label: k.toUpperCase(),
    value: statusCount[k],
  }));

  /* 🔹 DOWNLOAD FUNCTION */
  const downloadChart = (type) => {
    FusionCharts.items[chartId]?.exportChart({
      exportFormat: type,
    });
    setMenuOpen(false);
  };

  /* 🔹 CLOSE MENU ON OUTSIDE CLICK */
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
    <div className="chart-card full">
      {/* HEADER */}
      <div className="chart-header">
        <h4>Task Status Distribution</h4>

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

              {/* <p className="menu-title">Download</p>
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
        type="column2d"
        width="100%"
        height="400"
        dataFormat="json"
        dataSource={{
          chart: {
            caption: "Task Status Distribution",
            theme: chartTheme,
            showValues: "1",
            exportEnabled: "1", // 🔑 REQUIRED
          },
          data,
        }}
      />
    </div>
  );
};

export default TrendChart;
