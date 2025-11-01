import { NextResponse } from "next/server";

// GET /api/health
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "MGNREGA API backend running successfully",
    timestamp: new Date().toISOString(),
  });
}
