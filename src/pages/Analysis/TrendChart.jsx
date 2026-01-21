// src/pages/analysis/TrendChart.jsx

import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const TrendChart = ({ tasks }) => {
  const statusCount = {
    pending: 0,
    inprogress: 0,
    updated: 0,
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

  return (
    <div className="chart-card full">
      <ReactFC
        type="column2d"
        width="100%"
        height="400"
        dataFormat="json"
        dataSource={{
          chart: {
            caption: "Task Status Distribution",
            theme: "fusion",
            paletteColors: "#22c55e,#38bdf8,#fbbf24,#6366f1,#ef4444",
            showValues: "1",
          },
          data,
        }}
      />
    </div>
  );
};

export default TrendChart;
