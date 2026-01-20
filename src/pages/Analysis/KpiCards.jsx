const KpiCards = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inprogress = tasks.filter((t) => t.status === "inprogress").length;
  const failed = tasks.filter((t) => t.status === "failed").length;
  const rate = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="kpi-grid">
      <div className="kpi">
        Total Tasks<b>{total}</b>
      </div>
      <div className="kpi">
        Completed<b>{completed}</b>
      </div>
      <div className="kpi">
        In Progress<b>{inprogress}</b>
      </div>
      <div className="kpi">
        Failed<b>{failed}</b>
      </div>
      <div className="kpi">
        Completion<b>{rate}%</b>
      </div>
    </div>
  );
};

export default KpiCards;
