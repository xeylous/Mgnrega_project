import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(_, context) {
  try {
    const { state, year } = await context.params; // ✅ FIXED: await params

    if (!state || !year) {
      return NextResponse.json(
        { success: false, error: "Missing state or year" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "src/lib", state, `${year}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: "Data not found for given state/year" },
        { status: 404 }
      );
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in /api/district/[state]/[year]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
