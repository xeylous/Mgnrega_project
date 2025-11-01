"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TrendChart({ data, dataKey = "Average_Wage_rate_per_day_per_person" }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 mt-6">
      <h3 className="text-lg font-semibold text-[#00416A] mb-4">
        Wage Rate Trend (₹/day)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#16A34A"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
