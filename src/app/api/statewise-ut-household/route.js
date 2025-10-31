import { NextResponse } from 'next/server';
import data2015 from '../../../../public/state/ut_state-wise-household_2015-2015.json';
import data2016_2019 from '../../../../public/state/ut_state-wise-household_2016-2019.json';
import data2019_2024 from '../../../../public/state/ut_state-wise-household_2019-2024.json';

// Map years to their respective JSON files and column indices
const dataSourceMap = {
  '2014-15': { source: data2015, columnIndex: 2 },
  '2015-16': { source: data2015, columnIndex: 3 },
  '2016-17': { source: data2016_2019, columnIndex: 2 },
  '2017-18': { source: data2016_2019, columnIndex: 3 },
  '2018-19': { source: data2016_2019, columnIndex: 4 },
  '2019-20': { source: data2019_2024, columnIndex: 2 },
  '2020-21': { source: data2019_2024, columnIndex: 3 },
  '2021-22': { source: data2019_2024, columnIndex: 4 },
  '2022-23': { source: data2019_2024, columnIndex: 5 },
  '2023-24': { source: data2019_2024, columnIndex: 6 }
};

// Get all available years
function getAvailableYears() {
  return Object.keys(dataSourceMap);
}

// Helper function to find state data from a specific JSON source
function getStateDataFromSource(stateName, dataSource) {
  const stateNameLower = stateName.toLowerCase().trim();
  return dataSource.data.find(row => 
    row[1].toLowerCase().trim() === stateNameLower
  );
}

// Helper function to get data for a specific year
function getYearData(stateName, year) {
  const config = dataSourceMap[year];
  if (!config) return null;
  
  const stateData = getStateDataFromSource(stateName, config.source);
  if (!stateData) return null;
  
  const value = stateData[config.columnIndex];
  
  return {
    year: year,
    households_completed_100_days: value,
    value: value === 'NR' ? 'Not Reported' : value,
    is_reported: value !== 'NR' && value !== '0'
  };
}

// GET method - Single or all years query
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const year = searchParams.get('year');
  
  // Validate inputs
  if (!state) {
    return NextResponse.json({
      status: "error",
      message: "'state' parameter is required"
    }, { status: 400 });
  }
  
  // If year is provided, return single year data
  if (year) {
    const yearData = getYearData(state, year);
    
    if (!yearData) {
      return NextResponse.json({
        status: "error",
        message: `Invalid year: ${year}. Available years: ${getAvailableYears().join(', ')}`
      }, { status: 400 });
    }
    
    return NextResponse.json({
      status: "success",
      state: state,
      data: yearData
    }, { status: 200 });
  }
  
  // If no year provided, return all years data
  const availableYears = getAvailableYears();
  const allYearsData = availableYears
    .map(y => getYearData(state, y))
    .filter(Boolean);
  
  if (allYearsData.length === 0) {
    return NextResponse.json({
      status: "error",
      message: `No data found for state: ${state}`
    }, { status: 404 });
  }
  
  return NextResponse.json({
    status: "success",
    state: state,
    total_years: allYearsData.length,
    data: allYearsData
  }, { status: 200 });
}

// POST method - Multiple years with streaming/chunking
export async function POST(request) {
  try {
    const body = await request.json();
    const { state, years, stream = false, chunkSize = 2 } = body;
    
    // Validate inputs
    if (!state) {
      return NextResponse.json({
        status: "error",
        message: "'state' field is required"
      }, { status: 400 });
    }
    
    // Determine which years to fetch
    const yearsToFetch = years && Array.isArray(years) 
      ? years 
      : getAvailableYears();
    
    // Fetch data for requested years
    const requestedData = yearsToFetch
      .map(year => getYearData(state, year))
      .filter(Boolean);
    
    if (requestedData.length === 0) {
      return NextResponse.json({
        status: "error",
        message: `No data found for state: ${state}`
      }, { status: 404 });
    }
    
    // If streaming is enabled, send data in chunks
    if (stream) {
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            // Send metadata first
            const metadata = {
              type: 'metadata',
              status: "success",
              state: state,
              total_years: requestedData.length,
              available_years: yearsToFetch
            };
            controller.enqueue(encoder.encode(JSON.stringify(metadata) + '\n'));
            
            // Send data in chunks
            for (let i = 0; i < requestedData.length; i += chunkSize) {
              const chunk = requestedData.slice(i, i + chunkSize);
              const chunkData = {
                type: 'data',
                chunk_index: Math.floor(i / chunkSize),
                data: chunk
              };
              controller.enqueue(encoder.encode(JSON.stringify(chunkData) + '\n'));
              
              // Small delay to simulate chunking (remove in production for max speed)
              await new Promise(resolve => setTimeout(resolve, 5));
            }
            
            // Send completion signal
            const completion = {
              type: 'complete',
              message: 'All data sent successfully'
            };
            controller.enqueue(encoder.encode(JSON.stringify(completion) + '\n'));
            
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        }
      });
      
      return new Response(readableStream, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'Transfer-Encoding': 'chunked',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
    
    // Regular response without streaming
    return NextResponse.json({
      status: "success",
      state: state,
      total_years: requestedData.length,
      data: requestedData
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Invalid request format",
      details: error.message
    }, { status: 400 });
  }
}