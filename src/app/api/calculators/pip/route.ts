import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { pipCalc } from "@/lib/analysis";
import { getInstrument } from "@/lib/instruments";
import { assertSameOrigin } from "@/lib/security";
import { DISCLAIMER } from "@/lib/constants";

const schema = z.object({
  lots: z.number().positive(),
  pips: z.number().positive(),
  pair: z.string(),
  direction: z.enum(["profit", "loss"]),
});

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const ins = getInstrument(body.data.pair);
  if (!ins) return NextResponse.json({ error: "Unknown pair" }, { status: 400 });
  const result = pipCalc({
    lots: body.data.lots,
    pips: body.data.pips,
    direction: body.data.direction,
    pipValuePerLot: ins.pipSize * ins.contractSize,
  });
  return NextResponse.json({ result, disclaimer: DISCLAIMER });
}
