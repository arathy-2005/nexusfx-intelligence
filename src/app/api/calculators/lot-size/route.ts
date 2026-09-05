import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lotSize } from "@/lib/analysis";
import { getInstrument } from "@/lib/instruments";
import { assertSameOrigin } from "@/lib/security";
import { DISCLAIMER } from "@/lib/constants";

const schema = z.object({
  balance: z.number().positive(),
  riskPercent: z.number().positive().max(10),
  stopLossPips: z.number().positive(),
  pair: z.string(),
  leverage: z.number().positive(),
  price: z.number().positive(),
});

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const ins = getInstrument(body.data.pair);
  if (!ins) return NextResponse.json({ error: "Unknown pair" }, { status: 400 });
  const result = lotSize({
    ...body.data,
    pipValuePerLot: ins.pipSize * ins.contractSize,
    contractSize: ins.contractSize,
  });
  return NextResponse.json({ result, disclaimer: DISCLAIMER });
}
