import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
// import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Charts);

const StatusDonut = ({ tasks }) => {
  const count = (s) => tasks.filter((t) => t.status === s).length;

  return (
    <div className="chart-card">
      <ReactFC
        type="doughnut2d"
        width="100%"
        height="350"
        dataFormat="json"
        dataSource={{
          chart: {
            caption: "Tasks by Status",
            theme: "fusion",
            doughnutRadius: "70%",
            paletteColors: "#4cc9f0,#38bdf8,#90dbf4,#22c55e,#ef4444",
          },
          data: [
            { label: "Pending", value: count("pending") },
            { label: "In Progress", value: count("inprogress") },
            { label: "Updated", value: count("updated") },
            { label: "Completed", value: count("completed") },
            { label: "Failed", value: count("failed") },
          ],
        }}
      />
    </div>
  );
};

export default StatusDonut;
