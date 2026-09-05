import { NextRequest, NextResponse } from "next/server";
import { CALENDAR } from "@/lib/demo-data";
import { DISCLAIMER } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const impact = request.nextUrl.searchParams.get("impact");
  const events = CALENDAR.filter((e) => !impact || impact === "ALL" || e.impact === impact);
  return NextResponse.json({ events, disclaimer: DISCLAIMER });
}
