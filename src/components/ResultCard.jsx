"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { ChartBar, CalendarDays, Wallet, Users, ChevronDown, ChevronUp } from "lucide-react";

export default function ResultCard({ state, district, year, result }) {
  const [graphType, setGraphType] = useState("Line");
  const [showDetails, setShowDetails] = useState(true);

  const current = result?.data;
  const history = result?.history || [];

  const data = history.map((d) => ({
    year: d.fin_year,
    AvgDays: +d.Average_days_of_employment_provided_per_Household || 0,
    WageRate: +d.Average_Wage_rate_per_day_per_person || 0,
    Expenditure: +d.Total_Exp || 0,
  }));

  const renderChart = () => {
    if (!data?.length) return null;
    switch (graphType) {
      case "Bar":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="AvgDays" fill="#1e3a8a" />
              <Bar dataKey="WageRate" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "Area":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="AvgDays" fill="#1e3a8a" stroke="#1e3a8a" />
              <Area type="monotone" dataKey="WageRate" fill="#3b82f6" stroke="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="AvgDays" stroke="#1e3a8a" />
              <Line type="monotone" dataKey="WageRate" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-4xl border border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a8a]">
            {district} – {state}
          </h2>
          <p className="text-gray-600 text-sm">Financial Year: {year}</p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-[#1e3a8a] flex items-center hover:underline"
        >
          {showDetails ? (
            <>
              Hide Details <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show Details <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="h-5 w-5 text-blue-700" />
                <p className="text-sm text-gray-500">Avg Days of Employment / HH</p>
              </div>
              <p className="text-xl items-center font-semibold text-gray-800">
                {current?.Average_days_of_employment_provided_per_Household ?? "N/A"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-5 w-5 text-blue-700" />
                <p className="text-sm text-gray-500">Avg Wage Rate (₹)</p>
              </div>
              <p className="text-xl font-semibold text-gray-800">
                {current?.Average_Wage_rate_per_day_per_person ?? "N/A"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <ChartBar className="h-5 w-5 text-blue-700" />
                <p className="text-sm text-gray-500">Total Expenditure (₹ lakh)</p>
              </div>
              <p className="text-xl font-semibold text-gray-800">
                {current?.Total_Exp ?? "N/A"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-blue-700" />
                <p className="text-sm text-gray-500">Total HHs Worked</p>
              </div>
              <p className="text-xl font-semibold text-gray-800">
                {current?.Total_Households_Worked ?? "N/A"}
              </p>
            </div>
          </div>

          {/* Other Info Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries(current || {})
              .filter(
                ([key]) =>
                  ![
                    "Average_days_of_employment_provided_per_Household",
                    "Average_Wage_rate_per_day_per_person",
                    "Total_Exp",
                    "Total_Households_Worked",
                    "district_name",
                    "state_name",
                    "fin_year",
                    "month",
                    "state_code",
                    "district_code",
                  ].includes(key)
              )
              .map(([key, value]) => (
                <div
                  key={key}
                  className="p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition"
                >
                  <p className="text-sm text-gray-500 capitalize">
                    {key.replaceAll("_", " ")}
                  </p>
                  <p className="text-lg font-medium text-gray-800 mt-1">{value || "N/A"}</p>
                </div>
              ))}
          </div>

          {/* Graph Selector */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-700 font-medium">Select Graph Type:</p>
            <select
              value={graphType}
              onChange={(e) => setGraphType(e.target.value)}
              className="border rounded-lg px-3 py-1 text-gray-800 text-sm focus:ring focus:ring-blue-200"
            >
              <option>Line</option>
              <option>Bar</option>
              <option>Area</option>
            </select>
          </div>

          {/* Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            {data?.length ? (
              renderChart()
            ) : (
              <p className="text-center text-gray-500 py-6">
                No historical data available
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
