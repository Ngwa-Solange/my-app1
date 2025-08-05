import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const BloodTypeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://blood-bank-backend-fixed.onrender.com/chart/blood-types")
      .then((res) => {
        const chartData = Object.entries(res.data).map(([type, count]) => ({
          type,
          count,
        }));
        setData(chartData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BloodTypeChart;