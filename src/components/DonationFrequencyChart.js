import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const DonationFrequencyChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://blood-bank-backend-fixed.onrender.com/donations?limit=100")
      .then((res) => res.json())
      .then((donations) => {
        const grouped = {};
        donations.forEach((donation) => {
          const date = donation.donation_date?.split("T")[0]; // format: YYYY-MM-DD
          if (grouped[date]) {
            grouped[date]++;
          } else {
            grouped[date] = 1;
          }
        });

        const sortedDates = Object.keys(grouped).sort();
        const frequencies = sortedDates.map((date) => grouped[date]);

        setData({
          x: sortedDates,
          y: frequencies,
          type: "bar",
          marker: { color: "steelblue" },
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch donation data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-500">Loading chart...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Donations Over Time</h2>
      <Plot
        data={[data]}
        layout={{
          autosize: true,
          margin: { t: 40, b: 40, l: 40, r: 20 },
          xaxis: { title: "Date" },
          yaxis: { title: "Number of Donations" },
          paper_bgcolor: "white",
          plot_bgcolor: "white",
        }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default DonationFrequencyChart;
