import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/compare?state1=XX&district1=YY&year1=2024-2025&state2=AA&district2=BB&year2=2024-2025
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const state1 = searchParams.get("state1");
    const district1 = searchParams.get("district1");
    const year1 = searchParams.get("year1");
    const state2 = searchParams.get("state2");
    const district2 = searchParams.get("district2");
    const year2 = searchParams.get("year2");

    if (!state1 || !district1 || !year1 || !state2 || !district2 || !year2) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    // ✅ Helper: Fetch district data for given state + year
    const fetchDistrictData = (state, district, year) => {
      const filePath = path.join(process.cwd(), "src/lib", state, `${year}.json`);
      if (!fs.existsSync(filePath)) return null;
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const records = Array.isArray(data) ? data : [data];
      return records.find(
        (r) =>
          r.district_name?.toLowerCase() === decodeURIComponent(district).toLowerCase()
      );
    };

    const data1 = fetchDistrictData(state1, district1, year1);
    const data2 = fetchDistrictData(state2, district2, year2);

    if (!data1 || !data2) {
      return NextResponse.json(
        {
          success: false,
          error: "District data not found for one or both selections",
        },
        { status: 404 }
      );
    }

    // ✅ Find all numeric keys common to both objects
    const allKeys = Object.keys(data1).filter(
      (key) =>
        data2.hasOwnProperty(key) &&
        !isNaN(parseFloat(data1[key])) &&
        !isNaN(parseFloat(data2[key]))
    );

    // ✅ Compute differences dynamically
    const differences = allKeys.map((key) => {
      const val1 = parseFloat(data1[key]) || 0;
      const val2 = parseFloat(data2[key]) || 0;
      const diff = val2 - val1;
      const percent = val1 ? ((diff / val1) * 100).toFixed(2) : 0;
      return {
        metric: key,
        val1,
        val2,
        diff,
        percent: parseFloat(percent),
      };
    });

    return NextResponse.json({
      success: true,
      district1: { state: state1, district: district1, year: year1, data: data1 },
      district2: { state: state2, district: district2, year: year2, data: data2 },
      total_metrics: differences.length,
      differences,
    });
  } catch (error) {
    console.error("Error in /api/compare:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
