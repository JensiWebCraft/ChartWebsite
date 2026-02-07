import { useState, useEffect, useRef } from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
import UmberTheme from "fusioncharts/themes/fusioncharts.theme.umber";
import ExcelExport from "fusioncharts/fusioncharts.excelexport";
import ReactFC from "react-fusioncharts";
import { FiMoreVertical } from "react-icons/fi";
import "./UserBarChart.scss";

ReactFC.fcRoot(
  FusionCharts,
  Charts,
  FusionTheme,
  CandyTheme,
  UmberTheme,
  ExcelExport,
);

/* 🔹 BUILT-IN THEMES (LIKE `theme: "candy"`) */
const THEMES = {
  default: "fusion",
  dark: "candy",
  pastel: "umber",
};

const UserBarChart = ({ tasks }) => {
  const chartId = "userBarChart";
  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [chartTheme, setChartTheme] = useState(THEMES.default);

  /* 🔹 TASK COUNT PER USER */
  const map = {};
  tasks.forEach((t) => {
    if (!t.assignedTo) return;
    map[t.assignedTo] = (map[t.assignedTo] || 0) + 1;
  });

  const data = Object.keys(map).map((user) => ({
    label: user,
    value: map[user],
  }));

  /* 🔹 DOWNLOAD */
  const downloadChart = (type) => {
    FusionCharts.items[chartId]?.exportChart({
      exportFormat: type,
    });
    setMenuOpen(false);
  };

  /* 🔹 CLOSE MENU */
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="chart-card">
      {/* HEADER */}
      <div className="chart-header">
        <h4>Tasks Assigned per User</h4>

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
        type="bar2d"
        width="100%"
        height="320"
        dataFormat="json"
        dataSource={{
          chart: {
            caption: "Tasks Assigned per User",
            yAxisName: "Number of Tasks",
            alignCaptionWithCanvas: "0",
            plotToolText: "<b>$dataValue</b> tasks assigned",
            theme: chartTheme,
            showValues: "1",
            exportEnabled: "1",
          },
          data,
        }}
      />
    </div>
  );
};

export default UserBarChart;
