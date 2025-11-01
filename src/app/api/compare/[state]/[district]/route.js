import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GET /api/compare/{state}/{district}
export async function GET(_, { params }) {
  try {
    const { state, district } = params;
    const stateDir = path.join(process.cwd(), "src/lib", state);

    if (!fs.existsSync(stateDir)) {
      return NextResponse.json({ success: false, error: "State not found." }, { status: 404 });
    }

    const files = fs.readdirSync(stateDir).filter(f => f.endsWith(".json"));
    const districtHistory = [];

    for (const file of files) {
      const year = file.replace(".json", "");
      const filePath = path.join(stateDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const records = Array.isArray(data) ? data : [data];

      const districtData = records.find(
        (r) => r.district_name?.toLowerCase() === decodeURIComponent(district).toLowerCase()
      );

      if (districtData) {
        districtHistory.push({ year, data: districtData });
      }
    }

    return NextResponse.json({
      success: true,
      state,
      district: decodeURIComponent(district),
      total_years: districtHistory.length,
      history: districtHistory,
    });
  } catch (error) {
    console.error("Error in /api/compare/[state]/[district]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
