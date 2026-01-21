export const downloadCSV = (tasks, filename = "tasks.csv") => {
  if (!tasks || tasks.length === 0) {
    alert("No data to download");
    return;
  }

  const headers = [
    "Title",
    "Description",
    "Status",
    "Assigned To",
    "Created By",
    "Created At",
  ];

  const rows = tasks.map((t) => [
    t.title,
    t.description,
    t.status,
    t.assignedTo || "",
    t.createdBy || "",
    t.createdAt || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
