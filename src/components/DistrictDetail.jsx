"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DistrictDetail({ state, district }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!state || !district) return;
    fetch(`/api/district/${state}/history?district=${district}`)
      .then((res) => res.json())
      .then((data) => setHistory(data.history || []));
  }, [state, district]);

  if (!history.length)
    return <p className="text-gray-400 mt-6">No historical data found.</p>;

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-[#00416A] mb-4">
        {district} — Yearly Performance Trends
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fin_year" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Average_days_of_employment_provided_per_Household"
            stroke="#047857" // green
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="Average_Wage_rate_per_day_per_person"
            stroke="#EF4444" // red
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <span className="text-green-600 font-medium">Green</span> line: Average
          days of employment per household
        </p>
        <p>
          <span className="text-red-500 font-medium">Red</span> line: Average
          wage rate per day per person
        </p>
      </div>
    </div>
  );
}
