import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/district/[state]/history?district=DISTRICT_NAME
 * Returns past performance data for that district across all years.
 */
export async function GET(_, context) {
  try {
    const { state } = await context.params; // ✅ FIXED: await params

    const { searchParams } = new URL(_.url);
    const district = searchParams.get("district");

    if (!state) {
      return NextResponse.json(
        { success: false, error: "State parameter missing." },
        { status: 400 }
      );
    }

    if (!district) {
      return NextResponse.json(
        { success: false, error: "District parameter missing." },
        { status: 400 }
      );
    }

    // Directory for that state
    const stateDir = path.join(process.cwd(), "src/lib", state);

    if (!fs.existsSync(stateDir)) {
      return NextResponse.json(
        { success: false, error: `State '${state}' not found.` },
        { status: 404 }
      );
    }

    const files = fs
      .readdirSync(stateDir)
      .filter((f) => f.endsWith(".json"))
      .sort();

    const history = [];

    for (const file of files) {
      const filePath = path.join(stateDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      if (!content.trim()) continue;

      try {
        const data = JSON.parse(content);
        const records = Array.isArray(data) ? data : [data];

        const found = records.find(
          (item) =>
            item.district_name?.toLowerCase() === district.toLowerCase()
        );

        if (found) {
          history.push({
            fin_year: found.fin_year,
            Average_days_of_employment_provided_per_Household:
              Number(found.Average_days_of_employment_provided_per_Household),
            Average_Wage_rate_per_day_per_person: Number(
              found.Average_Wage_rate_per_day_per_person
            ),
            Total_Exp: Number(found.Total_Exp),
            Total_Households_Worked: Number(found.Total_Households_Worked),
          });
        }
      } catch (err) {
        console.warn(`Skipping bad JSON in ${file}`);
      }
    }

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error("Error in /api/district/[state]/history:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
