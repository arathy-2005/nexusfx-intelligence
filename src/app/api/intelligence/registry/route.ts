import { NextResponse } from "next/server";
import { backtestReport, MODEL_BOARD, scanMarket } from "@/lib/intelligence";
import { DISCLAIMER } from "@/lib/constants";

export async function GET() {
  const ml = process.env.ML_API_URL;
  if (ml) {
    try {
      const res = await fetch(`${ml}/registry`, { cache: "no-store" });
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      /* local */
    }
  }
  return NextResponse.json({
    disclaimer: DISCLAIMER,
    models: MODEL_BOARD,
    backtest: backtestReport(),
    scanner: scanMarket(),
    meta: { model_version: "nfx-ml-1.0.0", source: "in-app ensemble + optional FastAPI" },
  });
}
