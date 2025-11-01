"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Loader2, BarChart3, AlertCircle } from "lucide-react";

export default function CompareDistricts() {
  const [states, setStates] = useState([]);
  const [districts1, setDistricts1] = useState([]);
  const [districts2, setDistricts2] = useState([]);
  const [years1, setYears1] = useState([]);
  const [years2, setYears2] = useState([]);

  const [sel1, setSel1] = useState({ state: "", district: "", year: "" });
  const [sel2, setSel2] = useState({ state: "", district: "", year: "" });

  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [selectedFactor, setSelectedFactor] = useState("");
  const [validationError, setValidationError] = useState("");

  // Load states
  useEffect(() => {
    fetch("/api/state")
      .then((r) => r.json())
      .then((d) => setStates(d.states || []))
      .catch(console.error);
  }, []);

  // Load districts & years for a given state
  const loadOptions = async (state, setDistricts, setYears) => {
    if (!state) return;
    const [districtRes, yearRes] = await Promise.all([
      fetch(`/api/districts?state=${state}`),
      fetch(`/api/years?state=${state}`),
    ]);
    const districtData = await districtRes.json();
    const yearData = await yearRes.json();
    setDistricts(districtData.districts || []);
    setYears(yearData.years || []);
  };

  useEffect(() => {
    if (sel1.state) loadOptions(sel1.state, setDistricts1, setYears1);
  }, [sel1.state]);

  useEffect(() => {
    if (sel2.state) loadOptions(sel2.state, setDistricts2, setYears2);
  }, [sel2.state]);

  // Validation function
  const validateSelections = () => {
    if (!sel1.state || !sel1.district || !sel1.year) {
      setValidationError("Please select all fields for District 1");
      return false;
    }
    if (!sel2.state || !sel2.district || !sel2.year) {
      setValidationError("Please select all fields for District 2");
      return false;
    }
    
    // Check if both selections are identical
    if (
      sel1.state === sel2.state &&
      sel1.district === sel2.district &&
      sel1.year === sel2.year
    ) {
      setValidationError("Cannot compare the same district and year. Please select different options.");
      return false;
    }

    setValidationError("");
    return true;
  };

  // Handle compare click
  const handleCompare = async () => {
    if (!validateSelections()) {
      return;
    }

    setLoading(true);
    try {
      // Fetch selected year comparison
      const res = await fetch(
        `/api/compare?state1=${sel1.state}&district1=${encodeURIComponent(
          sel1.district
        )}&year1=${sel1.year}&state2=${sel2.state}&district2=${encodeURIComponent(
          sel2.district
        )}&year2=${sel2.year}`
      );
      const data = await res.json();

      // Fetch multi-year trend
      const trendRes = await fetch(
        `/api/compare-years?state1=${sel1.state}&district1=${encodeURIComponent(
          sel1.district
        )}&state2=${sel2.state}&district2=${encodeURIComponent(sel2.district)}`
      );
      const trendData = await trendRes.json();

      setCompareData({ ...data, trend: trendData });
      if (data?.differences?.length) {
        setSelectedFactor(data.differences[0].metric);
      }
    } catch (err) {
      console.error(err);
      setValidationError("An error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Chart renderer
  const renderCharts = () => {
    if (!compareData?.trend?.success || !selectedFactor) return null;

    const { trend } = compareData;
    const d1 = trend.district1;
    const d2 = trend.district2;
    const timeline = trend.timeline;

    const chartData = timeline.map((t) => ({
      year: t.year,
      [d1.district]: t.metrics[selectedFactor]?.val1 ?? 0,
      [d2.district]: t.metrics[selectedFactor]?.val2 ?? 0,
    }));

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={d1.district} fill="#1e3a8a" />
            <Bar dataKey={d2.district} fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={d1.district} stroke="#1e3a8a" strokeWidth={2} />
          <Line type="monotone" dataKey={d2.district} stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderDistrictData = (labelColor, district) => {
    if (!district?.data) return null;
    return (
      <div
        className={`flex-1 bg-white p-4 rounded-xl shadow-md border-t-4`}
        style={{ borderColor: labelColor }}
      >
        <h4 className="font-semibold text-lg mb-2" style={{ color: labelColor }}>
          {district.district} ({district.year})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {Object.entries(district.data)
            .filter(([_, v]) => typeof v === "number" || !isNaN(parseFloat(v)))
            .map(([key, val]) => (
              <div key={key} className="flex justify-between border-b py-1 text-gray-700">
                <span className="font-medium">{key.replaceAll("_", " ")}:</span>
                <span className="text-right">{Number(val).toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-200 rounded-xl shadow-sm max-w-7xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-center text-[#1e3a8a] mb-6 flex items-center justify-center gap-2">
        <BarChart3 className="text-[#1e3a8a]" /> Compare Districts
      </h2>

      {/* Input Section */}
      <div className="flex flex-wrap justify-center gap-4">
        {/* District 1 */}
        <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md w-full md:w-[45%]">
          <h4 className="font-semibold text-[#1e3a8a]">District 1</h4>
          <select
            value={sel1.state}
            onChange={(e) => setSel1({ ...sel1, state: e.target.value, district: "", year: "" })}
            className="border p-2 rounded text-gray-800"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.display_name}
              </option>
            ))}
          </select>
          <select
            value={sel1.district}
            onChange={(e) => setSel1({ ...sel1, district: e.target.value })}
            className="border p-2 rounded text-gray-800"
            disabled={!sel1.state}
          >
            <option value="">Select District</option>
            {districts1.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={sel1.year}
            onChange={(e) => setSel1({ ...sel1, year: e.target.value })}
            className="border p-2 rounded text-gray-800"
            disabled={!sel1.state}
          >
            <option value="">Select Year</option>
            {years1.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* District 2 */}
        <div className="flex flex-col gap-2 text-gray-800 bg-white p-4 rounded-lg shadow-md w-full md:w-[45%]">
          <h4 className="font-semibold text-[#f59e0b]">District 2</h4>
          <select
            value={sel2.state}
            onChange={(e) => setSel2({ ...sel2, state: e.target.value, district: "", year: "" })}
            className="border p-2 rounded text-gray-800"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.display_name}
              </option>
            ))}
          </select>
          <select
            value={sel2.district}
            onChange={(e) => setSel2({ ...sel2, district: e.target.value })}
            className="border p-2 rounded text-gray-800"
            disabled={!sel2.state}
          >
            <option value="">Select District</option>
            {districts2.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={sel2.year}
            onChange={(e) => setSel2({ ...sel2, year: e.target.value })}
            className="border p-2 rounded text-gray-800"
            disabled={!sel2.state}
          >
            <option value="">Select Year</option>
            {years2.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mt-4 mx-auto max-w-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={handleCompare}
          disabled={loading}
          className="bg-[#1e3a8a] hover:bg-[#16306e] text-white font-semibold px-8 py-2 rounded-lg shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin inline-block" /> : "Compare"}
        </button>
      </div>

      {/* Results */}
      {compareData?.success && (
        <div className="mt-10 flex flex-col gap-6">
          {/* Data panels */}
          <div className="flex flex-col lg:flex-row gap-6">
            {renderDistrictData("#1e3a8a", compareData.district1)}
            {renderDistrictData("#f59e0b", compareData.district2)}
          </div>

          {/* Chart Controls */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-[#1e3a8a]">Chart Type:</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold text-[#1e3a8a]">Compare By:</label>
              <select
                value={selectedFactor}
                onChange={(e) => setSelectedFactor(e.target.value)}
                className="border p-2 rounded"
              >
                {compareData.differences.map((d) => (
                  <option key={d.metric} value={d.metric}>
                    {d.metric.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white shadow-md rounded-xl p-4 mt-4">
            <h3 className="font-semibold text-center text-[#1e3a8a] mb-2">
              {selectedFactor.replaceAll("_", " ")} Trend Over Years (
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart)
            </h3>
            {renderCharts()}
          </div>
        </div>
      )}
    </div>
  )}