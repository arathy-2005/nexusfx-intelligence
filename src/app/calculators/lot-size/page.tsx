"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INSTRUMENTS } from "@/lib/instruments";
import { DISCLAIMER } from "@/lib/constants";
import { lotSize } from "@/lib/analysis";
import { formatUsd } from "@/lib/utils";

export default function LotSizePage() {
  const [balance, setBalance] = useState(10000);
  const [risk, setRisk] = useState(1);
  const [sl, setSl] = useState(20);
  const [pair, setPair] = useState("EURUSD");
  const [leverage, setLeverage] = useState(30);
  const ins = INSTRUMENTS.find((i) => i.symbol === pair)!;
  const result = lotSize({
    balance,
    riskPercent: risk,
    stopLossPips: sl,
    pipValuePerLot: ins.pipSize * ins.contractSize,
    leverage,
    contractSize: ins.contractSize,
    price: pair.includes("JPY") ? 149.6 : pair.includes("XAU") ? 2480 : pair.includes("BTC") ? 64000 : 1.08,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Lot size calculator</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <Card className="mt-6 grid gap-4 p-6">
        <label className="grid gap-1 text-sm">
          Account balance
          <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Risk %
          <input type="number" value={risk} onChange={(e) => setRisk(Number(e.target.value))} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Stop loss (pips)
          <input type="number" value={sl} onChange={(e) => setSl(Number(e.target.value))} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Currency pair
          <select value={pair} onChange={(e) => setPair(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3">
            {INSTRUMENTS.map((i) => (
              <option key={i.symbol} value={i.symbol}>
                {i.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Leverage
          <input type="number" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
        </label>
        <Button type="button">Recalculate (live)</Button>
        <div className="grid gap-2 rounded-xl bg-white/5 p-4 text-sm">
          <p>Lot size: {result.lotSize}</p>
          <p>Mini lot: {result.miniLot}</p>
          <p>Micro lot: {result.microLot}</p>
          <p>Position size: {result.positionSize.toLocaleString()} units</p>
          <p>Risk amount: {formatUsd(result.riskAmount)}</p>
          <p>Margin required: {formatUsd(result.marginRequired)}</p>
        </div>
      </Card>
    </div>
  );
}
