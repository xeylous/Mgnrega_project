import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");

  if (!state)
    return NextResponse.json({ success: false, error: "Missing state" }, { status: 400 });

  const dir = path.join(process.cwd(), "src/lib", state);
  if (!fs.existsSync(dir))
    return NextResponse.json({ success: false, error: "State not found" }, { status: 404 });

  const years = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));

  return NextResponse.json({ success: true, years });
}
