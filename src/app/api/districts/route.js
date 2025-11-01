import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/districts?state=andaman_nicobar
 * Returns all unique district names for a given state across all years.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");

    if (!state) {
      return NextResponse.json(
        { success: false, error: "State parameter is required." },
        { status: 400 }
      );
    }

    // Path to the given state’s folder
    const stateDir = path.join(process.cwd(), "src/lib", state);

    if (!fs.existsSync(stateDir)) {
      return NextResponse.json(
        { success: false, error: `State '${state}' not found.` },
        { status: 404 }
      );
    }

    // Read all year JSON files
    const yearFiles = fs
      .readdirSync(stateDir)
      .filter((file) => file.endsWith(".json"));

    const districtSet = new Set();

    // Loop through all year files and collect district names
    for (const file of yearFiles) {
      const filePath = path.join(stateDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      if (!content.trim()) continue;

      try {
        const data = JSON.parse(content);

        // Handle both array or single object formats
        const records = Array.isArray(data) ? data : [data];

        records.forEach((item) => {
          if (item.district_name) districtSet.add(item.district_name.trim());
        });
      } catch (err) {
        console.warn(`Skipping invalid JSON file: ${filePath}`);
      }
    }

    const districts = Array.from(districtSet).sort();

    return NextResponse.json({
      success: true,
      state,
      total_districts: districts.length,
      districts,
    });
  } catch (error) {
    console.error("Error in /api/districts:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
