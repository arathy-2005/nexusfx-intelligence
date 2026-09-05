"use client";

import { useMemo, useState } from "react";
import { PageIntro } from "@/components/page-intro";
import { Card } from "@/components/ui/card";
import { backtestReport } from "@/lib/intelligence";
import { INSTRUMENTS } from "@/lib/instruments";

export default function BacktestingPage() {
  const [symbol, setSymbol] = useState("EURUSD");
  const bt = useMemo(() => backtestReport(symbol), [symbol]);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageIntro title="Backtesting">Walk-forward style path, Monte Carlo bands, and classic risk metrics. Educational simulation only.</PageIntro>
      <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3">
        {INSTRUMENTS.map((i) => (
          <option key={i.symbol}>{i.symbol}</option>
        ))}
      </select>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          ["Win rate", `${(bt.winRate * 100).toFixed(1)}%`],
          ["Profit factor", bt.profitFactor.toFixed(2)],
          ["Sharpe", bt.sharpe.toFixed(2)],
          ["Max DD", `${(bt.maxDrawdown * 100).toFixed(1)}%`],
          ["Expectancy", bt.expectancy.toFixed(5)],
          ["Avg trade", bt.averageTrade.toFixed(5)],
        ].map(([k, v]) => (
          <Card key={k} className="p-4">
            <p className="text-xs text-white/50">{k}</p>
            <p className="text-xl font-semibold">{v}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-4 p-4">
        <p className="text-sm text-white/50">Equity curve (sampled)</p>
        <div className="mt-3 flex h-28 items-end gap-[2px]">
          {bt.equityCurve.slice(-80).map((x, i) => (
            <div key={i} className="flex-1 bg-cyan-400/80" style={{ height: `${Math.max(8, (x / (bt.equityEnd || 1)) * 100)}%` }} />
          ))}
        </div>
        <p className="mt-3 text-xs text-white/50">
          Monte Carlo p5 {bt.monteCarlo.p5.toFixed(3)} · p50 {bt.monteCarlo.p50.toFixed(3)} · p95 {bt.monteCarlo.p95.toFixed(3)}
        </p>
      </Card>
    </div>
  );
}
