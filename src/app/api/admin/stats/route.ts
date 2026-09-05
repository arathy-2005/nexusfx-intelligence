import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { buildSignals, NEWS } from "@/lib/demo-data";
import { DISCLAIMER } from "@/lib/constants";

export async function GET() {
  const user = await readSession();
  if (user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({
    users: 2,
    signals: buildSignals().length,
    news: NEWS.length,
    disclaimer: DISCLAIMER,
  });
}
