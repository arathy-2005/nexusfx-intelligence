import { NextRequest, NextResponse } from "next/server";
import { intelligencePredict, type Horizon } from "@/lib/intelligence";
import { clientKey, rateLimit } from "@/lib/security";

const ML = process.env.ML_API_URL;

export async function GET(request: NextRequest) {
  const limited = rateLimit(clientKey(request, "intel"), 80);
  if (!limited.ok) return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  const symbol = request.nextUrl.searchParams.get("symbol") || "EURUSD";
  const horizon = (request.nextUrl.searchParams.get("horizon") || "1H") as Horizon;
  if (ML) {
    try {
      const res = await fetch(`${ML}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, horizon: horizon === "1H" ? "h1" : horizon === "4H" ? "h4" : "d1" }),
        cache: "no-store",
      });
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      /* fall through */
    }
  }
  return NextResponse.json(intelligencePredict(symbol, horizon));
}
