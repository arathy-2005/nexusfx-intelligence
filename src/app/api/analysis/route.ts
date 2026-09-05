import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeMarket } from "@/lib/analysis";
import { generateCandles } from "@/lib/quotes";
import { getInstrument, TIMEFRAMES } from "@/lib/instruments";
import { assertSameOrigin, clientKey, rateLimit } from "@/lib/security";
import { DISCLAIMER } from "@/lib/constants";

const schema = z.object({
  pair: z.string().min(3).max(12),
  timeframe: z.string(),
});

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const limited = rateLimit(clientKey(request, "analysis"), 30);
  if (!limited.ok) return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const ins = getInstrument(body.data.pair);
  if (!ins) return NextResponse.json({ error: "Unknown pair" }, { status: 400 });
  const tf = TIMEFRAMES.includes(body.data.timeframe as (typeof TIMEFRAMES)[number])
    ? body.data.timeframe
    : "1H";
  const analysis = analyzeMarket(ins.symbol, tf, generateCandles(ins.symbol));
  return NextResponse.json({ analysis, disclaimer: DISCLAIMER });
}
