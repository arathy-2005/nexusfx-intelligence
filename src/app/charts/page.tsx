"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { TradingViewChart } from "@/components/tradingview-chart";
import { Button } from "@/components/ui/button";
import { INSTRUMENTS, TIMEFRAMES, type Timeframe } from "@/lib/instruments";
import { DISCLAIMER } from "@/lib/constants";

export default function ChartsPage() {
  const [symbol, setSymbol] = useState(INSTRUMENTS[0].tvSymbol);
  const [tf, setTf] = useState<Timeframe>("1H");
  const { resolvedTheme } = useTheme();
  const [full, setFull] = useState(false);

  return (
    <div className={full ? "fixed inset-0 z-50 bg-[#070b14] p-3" : "mx-auto max-w-7xl px-4 py-10"}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Charts</h1>
          <p className="mt-1 text-xs text-amber-200/90">{DISCLAIMER}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            {INSTRUMENTS.map((i) => (
              <option key={i.symbol} value={i.tvSymbol}>
                {i.name}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={() => setFull((v) => !v)}>
            {full ? "Exit fullscreen" : "Fullscreen"}
          </Button>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-1">
        {TIMEFRAMES.map((t) => (
          <Button key={t} size="sm" variant={tf === t ? "default" : "outline"} onClick={() => setTf(t)}>
            {t}
          </Button>
        ))}
      </div>
      <p className="mb-3 text-xs text-white/50">
        Drawing tools, indicators, and symbol search are provided by the TradingView widget toolbar.
      </p>
      <TradingViewChart symbol={symbol} timeframe={tf} theme={resolvedTheme === "light" ? "light" : "dark"} />
    </div>
  );
}
