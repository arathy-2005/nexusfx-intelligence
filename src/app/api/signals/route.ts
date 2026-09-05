import { NextResponse } from "next/server";
import { buildSignals } from "@/lib/demo-data";
import { DISCLAIMER } from "@/lib/constants";

export async function GET() {
  return NextResponse.json({ signals: buildSignals(), disclaimer: DISCLAIMER });
}
