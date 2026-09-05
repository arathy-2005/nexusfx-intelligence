"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageIntro } from "@/components/page-intro";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { INSTRUMENTS } from "@/lib/instruments";
import { HORIZONS, type Horizon } from "@/lib/intelligence";

export default function PredictionsPage() {
  const [symbol, setSymbol] = useState("EURUSD");
  const [horizon, setHorizon] = useState<Horizon>("1H");
  const { data } = useQuery({
    queryKey: ["pred", symbol, horizon],
    queryFn: async () => (await fetch(`/api/intelligence/predict?symbol=${symbol}&horizon=${horizon}`)).json(),
  });
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageIntro title="AI predictions">Next-bar through next-week direction as probabilities, not guarantees.</PageIntro>
      <div className="flex flex-wrap gap-2">
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="h-10 rounded-md border border-white/15 bg-black/40 px-3">
          {INSTRUMENTS.map((i) => (
            <option key={i.symbol} value={i.symbol}>
              {i.name}
            </option>
          ))}
        </select>
        {HORIZONS.map((h) => (
          <Button key={h} size="sm" variant={horizon === h ? "default" : "outline"} onClick={() => setHorizon(h)}>
            {h}
          </Button>
        ))}
      </div>
      <Card className="mt-6 p-6">
        <p className="text-sm text-white/50">{data?.horizon} · {data?.modelVersion}</p>
        <p className="mt-2 text-4xl font-semibold">{data?.trend}</p>
        <p className="mt-2">Confidence {data?.confidence}% · Historical accuracy pack in registry</p>
        <div className="mt-4 grid gap-1 text-sm">
          {data?.probability &&
            Object.entries(data.probability as Record<string, number>).map(([k, v]) => (
              <p key={k}>
                {k}: {(Number(v) * 100).toFixed(1)}%
              </p>
            ))}
        </div>
      </Card>
    </div>
  );
}
