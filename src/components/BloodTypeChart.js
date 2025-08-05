import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

const BloodTypeChart = () => {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    axios
      .get("https://blood-bank-backend-fixed.onrender.com/chart/blood-types")
      .then((res) => {
        const sortedData = res.data.sort((a, b) => a.label.localeCompare(b.label));
        setLabels(sortedData.map((item) => item.label));
        setValues(sortedData.map((item) => Number(item.value)));
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
      });
  }, []);

  // Summary boxes displayed horizontally, units on one line next to blood type
  const renderSummaryBoxes = () => (
    <div className="flex flex-wrap gap-4 justify-center mt-4">
      {labels.map((label, idx) => (
        <div
          key={label}
          className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow px-4 py-2 text-center text-sm font-semibold text-blue-900 border border-blue-300 flex items-center space-x-3"
          style={{ minWidth: 100 }}
        >
          <div className="text-blue-800 text-md">{label}</div>
          <div className="text-blue-800 text-sm font-bold">{values[idx]} units</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-3">Blood Type Distribution</h3>

      {/* Chart type selector above the chart */}
      <div className="mb-4 flex justify-center">
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border rounded px-3 py-1 text-sm bg-white text-gray-700 shadow-sm"
        >
          <option value="bar">Bar</option>
          <option value="horizontal">Horizontal Bar</option>
          <option value="pie">Pie</option>
          <option value="donut">Donut</option>
        </select>
      </div>

      <Plot
        data={[
          {
            type:
              chartType === "pie" || chartType === "donut"
                ? "pie"
                : chartType === "line"
                ? "scatter"
                : "bar",
            x:
              chartType === "bar" ||
              chartType === "horizontal" ||
              chartType === "line"
                ? labels
                : undefined,
            y:
              chartType === "bar" ||
              chartType === "horizontal" ||
              chartType === "line"
                ? values
                : undefined,
            labels:
              chartType === "pie" || chartType === "donut" ? labels : undefined,
            values:
              chartType === "pie" || chartType === "donut" ? values : undefined,
            orientation: chartType === "horizontal" ? "h" : "v",
            marker: {
              color:
                chartType === "pie" || chartType === "donut"
                  ? undefined
                  : "rgba(0,123,255,0.8)",
            },
            mode: chartType === "line" ? "lines+markers" : undefined,
            hole: chartType === "donut" ? 0.4 : 0,
            text: values.map((v) => v.toLocaleString()),
            textposition:
              chartType === "pie" || chartType === "donut" ? "inside" : "auto",
          },
        ]}
        layout={{
          title: "Blood Type Distribution",
          xaxis: {
            title:
              chartType === "bar" || chartType === "line" ? "Blood Type" : "",
            tickangle: -30,
            automargin: true,
          },
          yaxis: {
            title:
              chartType === "bar" ||
              chartType === "horizontal" ||
              chartType === "line"
                ? "Units Available"
                : "",
            tickformat: ",d",
            range:
              chartType === "bar" ||
              chartType === "horizontal" ||
              chartType === "line"
                ? [Math.max(0, Math.min(...values) - 50), Math.max(...values) + 50]
                : undefined,
            automargin: true,
          },
          height: chartType === "line" ? 500 : 450,
          margin: { t: 40, l: 50, r: 30, b: 60 },
          bargap: 0.3,
          showlegend: chartType === "pie" || chartType === "donut",
        }}
        config={{ responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "450px" }}
      />

      {/* Summary boxes below the chart */}
      {renderSummaryBoxes()}
    </div>
  );
};

export default BloodTypeChart;
