"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { INSTRUMENTS } from "@/lib/instruments";
import { DISCLAIMER } from "@/lib/constants";
import { pipCalc } from "@/lib/analysis";
import { formatUsd } from "@/lib/utils";

export default function PipPage() {
  const [lots, setLots] = useState(0.1);
  const [pips, setPips] = useState(25);
  const [pair, setPair] = useState("EURUSD");
  const ins = INSTRUMENTS.find((i) => i.symbol === pair)!;
  const profit = pipCalc({ lots, pips, pipValuePerLot: ins.pipSize * ins.contractSize, direction: "profit" });
  const loss = pipCalc({ lots, pips, pipValuePerLot: ins.pipSize * ins.contractSize, direction: "loss" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Pip calculator</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <Card className="mt-6 grid gap-4 p-6">
        <label className="grid gap-1 text-sm">
          Pair
          <select value={pair} onChange={(e) => setPair(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3">
            {INSTRUMENTS.map((i) => (
              <option key={i.symbol} value={i.symbol}>
                {i.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Lots
          <input type="number" step="0.01" value={lots} onChange={(e) => setLots(Number(e.target.value))} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Pips
          <input type="number" value={pips} onChange={(e) => setPips(Number(e.target.value))} className="h-10 rounded-md border border-white/15 bg-black/40 px-3" />
        </label>
        <div className="grid gap-2 rounded-xl bg-white/5 p-4 text-sm">
          <p>Pip value: {formatUsd(profit.pipValue)}</p>
          <p>Hypothetical profit: {formatUsd(profit.profit)}</p>
          <p>Hypothetical loss: {formatUsd(loss.loss)}</p>
          <p>Risk (same distance): {formatUsd(profit.risk)}</p>
        </div>
      </Card>
    </div>
  );
}
