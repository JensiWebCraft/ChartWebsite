import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
ReactFC.fcRoot(FusionCharts, Charts);

const UserBarChart = ({ tasks }) => {
  const map = {};
  tasks.forEach((t) => {
    if (!t.assignedTo) return;
    map[t.assignedTo] = (map[t.assignedTo] || 0) + 1;
  });

  const data = Object.keys(map).map((u) => ({
    label: u,
    value: map[u],
  }));

  return (
    <div className="chart-card">
      <ReactFC
        type="bar2d"
        width="100%"
        height="320"
        dataFormat="json"
        dataSource={{
          chart: {
            caption: "Tasks Assigned per User",
            theme: "fusion",
            paletteColors: "#14b8a6",
          },
          data,
        }}
      />
    </div>
  );
};

export default UserBarChart;
