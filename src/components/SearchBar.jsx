"use client";
import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

export default function SearchBar({ onResult }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [years, setYears] = useState([]);

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ✅ Fetch states
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch("/api/state");
        const data = await res.json();
        setStates(data.states || []);
      } catch (err) {
        console.error("Error fetching states:", err);
      } finally {
        setFetching(false);
      }
    }
    loadInitialData();
  }, []);

  // ✅ Fetch districts + years when state changes
  useEffect(() => {
    if (!state) {
      setDistricts([]);
      setYears([]);
      setDistrict("");
      setYear("");
      return;
    }

    async function loadStateData() {
      try {
        const [districtRes, yearRes] = await Promise.all([
          fetch(`/api/districts?state=${state}`),
          fetch(`/api/years?state=${state}`),
        ]);
        const districtData = await districtRes.json();
        const yearData = await yearRes.json();
        setDistricts(districtData.districts || []);
        setYears(yearData.years || []);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    loadStateData();
  }, [state]);

  // ✅ Handle search
  const handleSearch = async () => {
    if (!state || !district || !year) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/district/${state}/${year}`);
      const currentData = await res.json();

      const districtData = Array.isArray(currentData.data)
        ? currentData.data.find(
            (d) => d.district_name?.toLowerCase() === district.toLowerCase()
          )
        : currentData.data;

      const historyRes = await fetch(
        `/api/district/${state}/history?district=${encodeURIComponent(district)}`
      );
      const historyData = await historyRes.json();

      onResult({
        state,
        district,
        year,
        result: {
          data: districtData || null,
          history: historyData.history || [],
        },
      });
    } catch (e) {
      console.error("Error fetching:", e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clear results on change
  const handleChange = (setter, value) => {
    setter(value);
    onResult(null);
  };

  // ✅ Skeleton while fetching
  if (fetching) {
    return (
      <div className="flex flex-wrap justify-center gap-3 mb-6 w-full max-w-5xl animate-pulse">
        <div className="h-10 w-[200px] bg-gray-200 rounded-lg" />
        <div className="h-10 w-[200px] bg-gray-200 rounded-lg" />
        <div className="h-10 w-[200px] bg-gray-200 rounded-lg" />
        <div className="h-10 w-[120px] bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div
      className="
        flex flex-wrap lg:flex-nowrap justify-center items-center gap-4 
        mb-6 w-full max-w-5xl
      "
    >
      {/* State Dropdown */}
      <select
        value={state}
        onChange={(e) => handleChange(setState, e.target.value)}
        className="border rounded-lg px-3 py-2 text-gray-800 shadow-sm 
                   focus:ring-2 focus:ring-[#1e3a8a]
                   w-full sm:w-[200px] lg:w-[240px]"
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.id} value={s.id}>
            {s.display_name}
          </option>
        ))}
      </select>

      {/* District Dropdown */}
      <select
        value={district}
        onChange={(e) => handleChange(setDistrict, e.target.value)}
        disabled={!state}
        className="border rounded-lg px-3 py-2 text-gray-800 shadow-sm 
                   focus:ring-2 focus:ring-[#1e3a8a]
                   w-full sm:w-[240px] lg:w-[280px] 
                   disabled:opacity-60"
      >
        <option value="">Select District</option>
        {districts.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Year Dropdown */}
      <select
        value={year}
        onChange={(e) => handleChange(setYear, e.target.value)}
        disabled={!state || !district}
        className="border rounded-lg px-3 py-2 text-gray-800 shadow-sm 
                   focus:ring-2 focus:ring-[#1e3a8a]
                   w-full sm:w-[180px] lg:w-[200px] 
                   disabled:opacity-60"
      >
        <option value="">Select Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={loading || !state || !district || !year}
        className={`${
          loading ? "bg-gray-400" : "bg-[#1e3a8a] hover:bg-[#16306e]"
        } text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 
           transition-all w-full sm:w-[150px] lg:w-[160px]`}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Search size={18} />
        )}
        {loading ? "Loading..." : "Search"}
      </button>
    </div>
  );
}
