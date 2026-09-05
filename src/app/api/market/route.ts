import { NextRequest, NextResponse } from "next/server";
import { getQuotes } from "@/lib/market";
import { clientKey, rateLimit } from "@/lib/security";
import { DISCLAIMER } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const limited = rateLimit(clientKey(request, "market"), 90);
  if (!limited.ok) return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  const quotes = await getQuotes();
  return NextResponse.json({ quotes, disclaimer: DISCLAIMER });
}
