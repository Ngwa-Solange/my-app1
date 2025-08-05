import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

const BloodStockChart = () => {
  const [dates, setDates] = useState([]);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    axios
      .get("https://blood-bank-backend-fixed.onrender.com/chart/stock-over-time")
      .then((res) => {
        const data = res.data;
        setDates(data.map((item) => item.date));
        setCounts(data.map((item) => item.count));
      })
      .catch((error) => {
        console.error("Error fetching stock over time:", error);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h3 className="text-xl font-semibold mb-4 text-center">Blood Stock Over Time</h3>
      <Plot
        data={[
          {
            x: dates,
            y: counts,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "#c90b34ff" },
          },
        ]}
        layout={{
          title: "Blood Stock Over Time",
          xaxis: { title: "Date", tickformat: "%Y-%m-%d" },
          yaxis: { title: "Number of Donations" },
          margin: { t: 40, l: 50, r: 30, b: 100 },
          height: 450,
        }}
        config={{ responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "450px" }}
      />
    </div>
  );
};

export default BloodStockChart;
