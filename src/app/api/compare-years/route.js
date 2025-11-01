import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const state1 = searchParams.get("state1");
    const district1 = searchParams.get("district1");
    const state2 = searchParams.get("state2");
    const district2 = searchParams.get("district2");

    if (!state1 || !district1 || !state2 || !district2) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const loadAllYears = (state) => {
      const dirPath = path.join(process.cwd(), "src/lib", state);
      if (!fs.existsSync(dirPath)) return [];
      return fs
        .readdirSync(dirPath)
        .filter((file) => file.endsWith(".json"))
        .map((file) => file.replace(".json", ""));
    };

    const years1 = loadAllYears(state1);
    const years2 = loadAllYears(state2);
    const commonYears = years1.filter((y) => years2.includes(y));

    if (commonYears.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No common years found",
      });
    }

    const fetchDistrictData = (state, district, year) => {
      const filePath = path.join(process.cwd(), "src/lib", state, `${year}.json`);
      if (!fs.existsSync(filePath)) return null;
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const records = Array.isArray(data) ? data : [data];
      return records.find(
        (r) =>
          r.district_name?.toLowerCase() ===
          decodeURIComponent(district).toLowerCase()
      );
    };

    const timeline = [];
    for (const year of commonYears.sort()) {
      const d1 = fetchDistrictData(state1, district1, year);
      const d2 = fetchDistrictData(state2, district2, year);
      if (!d1 || !d2) continue;

      const keys = Object.keys(d1).filter(
        (k) =>
          d2.hasOwnProperty(k) &&
          !isNaN(parseFloat(d1[k])) &&
          !isNaN(parseFloat(d2[k]))
      );

      const metrics = {};
      for (const k of keys) {
        metrics[k] = { val1: parseFloat(d1[k]), val2: parseFloat(d2[k]) };
      }

      timeline.push({ year, metrics });
    }

    return NextResponse.json({
      success: true,
      district1: { state: state1, district: district1 },
      district2: { state: state2, district: district2 },
      years: commonYears.sort(),
      timeline,
    });
  } catch (error) {
    console.error("Error in /api/compare-years:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
