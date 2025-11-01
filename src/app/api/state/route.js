import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GET /api/states
export async function GET() {
  try {
    // Path to your data directory
    const dataDir = path.join(process.cwd(), "src/lib");

    // Get all folders (each folder = one state)
    const states = fs
      .readdirSync(dataDir)
      .filter((name) => fs.lstatSync(path.join(dataDir, name)).isDirectory());

    // Format response (optional: make it more readable)
    const formattedStates = states.map((state) => ({
      id: state,
      display_name: state.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    }));

    return NextResponse.json({
      success: true,
      total_states: formattedStates.length,
      states: formattedStates,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
