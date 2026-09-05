"use client";

import { useState } from "react";
import { PageIntro } from "@/components/page-intro";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StrategyPage() {
  const [rsi, setRsi] = useState(55);
  const [adx, setAdx] = useState(20);
  const [ema, setEma] = useState(true);
  const idea = ema && rsi >= 52 && adx >= 18 ? "Study BUY zone" : ema === false && rsi <= 48 ? "Study SELL zone" : "WAIT";
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageIntro title="Strategy builder">Combine rules for research. This does not automate or execute trades.</PageIntro>
      <Card className="grid gap-4 p-6">
        <label className="text-sm">
          RSI threshold {rsi}
          <input type="range" min={40} max={70} value={rsi} onChange={(e) => setRsi(Number(e.target.value))} className="w-full" />
        </label>
        <label className="text-sm">
          ADX floor {adx}
          <input type="range" min={10} max={40} value={adx} onChange={(e) => setAdx(Number(e.target.value))} className="w-full" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={ema} onChange={(e) => setEma(e.target.checked)} />
          Require EMA20 &gt; EMA50 for longs
        </label>
        <p className="text-2xl font-semibold">{idea}</p>
        <Button type="button">Save study rules (local)</Button>
      </Card>
    </div>
  );
}
