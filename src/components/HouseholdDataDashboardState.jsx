'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart 
} from 'recharts';

// Custom Hook for Streaming Data
function useHouseholdData(state, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!state) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setData([]);
        setProgress(0);
        setError(null);
        
        const response = await fetch('/api/statewise-ut-household', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: state,
            years: options.years,
            stream: true,
            chunkSize: options.chunkSize || 2
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let totalYears = 0;
        let receivedYears = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(Boolean);
          
          lines.forEach(line => {
            const parsed = JSON.parse(line);
            
            if (parsed.type === 'metadata') {
              totalYears = parsed.total_years;
            } else if (parsed.type === 'data') {
              setData(prev => [...prev, ...parsed.data]);
              receivedYears += parsed.data.length;
              setProgress((receivedYears / totalYears) * 100);
            }
          });
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [state, options.years, options.chunkSize]);
  
  return { data, loading, error, progress };
}

// Main Dashboard Component
export default function HouseholdDataDashboardState() {
  const [selectedState, setSelectedState] = useState('Kerala');
  const [viewMode, setViewMode] = useState('chart'); // 'chart', 'table', 'cards'
  
  const { data, loading, error, progress } = useHouseholdData(selectedState, {
    chunkSize: 3
  });

  // Indian States List
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  // Calculate statistics
  const stats = data.length > 0 ? {
    total: data.reduce((acc, item) => {
      const val = parseInt(item.households_completed_100_days) || 0;
      return acc + val;
    }, 0),
    average: Math.round(
      data.reduce((acc, item) => {
        const val = parseInt(item.households_completed_100_days) || 0;
        return acc + val;
      }, 0) / data.length
    ),
    highest: Math.max(...data.map(item => parseInt(item.households_completed_100_days) || 0)),
    lowestYear: data.reduce((min, item) => {
      const val = parseInt(item.households_completed_100_days) || 0;
      return val < parseInt(min.households_completed_100_days) ? item : min;
    }, data[0])
  } : null;

  // Format chart data
  const chartData = data.map(item => ({
    year: item.year,
    households: parseInt(item.households_completed_100_days) || 0,
    reported: item.is_reported
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MGNREGA Household Data Dashboard
          </h1>
          <p className="text-gray-600">
            Households that completed 100 days of employment under MGNREGA
          </p>
        </div>

        {/* State Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select State / UT
          </label>
          <div className="flex gap-4 flex-wrap">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="flex-1 min-w-[300px] px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select a state...</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('chart')}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === 'chart'
                    ? 'bg-white shadow-md text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Chart
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-white shadow-md text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white shadow-md text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center flex-col">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium mb-2">Loading data...</p>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                !
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Error loading data</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {!loading && !error && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-blue-100 text-sm font-medium mb-1">Total Households</p>
              <p className="text-3xl font-bold">{stats.total.toLocaleString()}</p>
              <p className="text-blue-100 text-xs mt-2">Across all years</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-green-100 text-sm font-medium mb-1">Average per Year</p>
              <p className="text-3xl font-bold">{stats.average.toLocaleString()}</p>
              <p className="text-green-100 text-xs mt-2">Mean households</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-purple-100 text-sm font-medium mb-1">Highest Year</p>
              <p className="text-3xl font-bold">{stats.highest.toLocaleString()}</p>
              <p className="text-purple-100 text-xs mt-2">Peak performance</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-orange-100 text-sm font-medium mb-1">Years Tracked</p>
              <p className="text-3xl font-bold">{data.length}</p>
              <p className="text-orange-100 text-xs mt-2">Data points available</p>
            </div>
          </div>
        )}

        {/* Chart View */}
        {!loading && !error && data.length > 0 && viewMode === 'chart' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Yearly Trend Analysis</h2>
            
            {/* Line Chart */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Line Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [value.toLocaleString(), 'Households']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="households" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Bar Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [value.toLocaleString(), 'Households']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="households" 
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Table View */}
        {!loading && !error && data.length > 0 && viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Year</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Households</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-900 font-medium">{item.year}</td>
                      <td className="px-6 py-4 text-right text-gray-900 font-semibold">
                        {parseInt(item.households_completed_100_days).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.is_reported ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Reported
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Not Reported
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cards View */}
        {!loading && !error && data.length > 0 && viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{item.year}</h3>
                  {item.is_reported ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Reported
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      N/A
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-600 mb-1">Households Completed 100 Days</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {parseInt(item.households_completed_100_days).toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {item.value === 'Not Reported' ? 'Data not reported for this period' : 'Official reported data'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data.length === 0 && selectedState && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">No household data found for {selectedState}</p>
          </div>
        )}
      </div>
    </div>
  );
}