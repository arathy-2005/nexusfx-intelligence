"use client";

import { useQuery } from "@tanstack/react-query";
import { PageIntro } from "@/components/page-intro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INSTRUMENTS } from "@/lib/instruments";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function IntelligencePage() {
  const [symbol, setSymbol] = useState("EURUSD");
  const { data } = useQuery({
    queryKey: ["intel", symbol],
    queryFn: async () => (await fetch(`/api/intelligence/predict?symbol=${symbol}&horizon=1H`)).json(),
    refetchInterval: 30000,
  });

  const tiles = [
    ["Trend", data?.trend ?? "—"],
    ["Signal", data?.signal ?? "—"],
    ["Confidence", data?.confidence != null ? `${data.confidence}%` : "—"],
    ["Risk score", data?.riskScore ?? "—"],
    ["Volatility", data?.volatilityScore ?? "—"],
    ["News sentiment", data?.newsSentiment ?? "—"],
    ["Economic impact", data?.economicImpact ?? "—"],
    ["Model", data?.modelVersion ?? "nfx-ml-1.0.0"],
  ];

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-8">
      <PageIntro title="AI desk">
        Institutional-style intelligence board. Probabilities only — no orders are sent to any broker.
      </PageIntro>
      <div className="mb-4 flex flex-wrap gap-2">
        {INSTRUMENTS.map((i) => (
          <Button key={i.symbol} size="sm" variant={symbol === i.symbol ? "default" : "outline"} onClick={() => setSymbol(i.symbol)}>
            {i.symbol}
          </Button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {tiles.map(([k, v]) => (
          <Card key={k} className="p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">{k}</p>
            <p className="mt-1 text-2xl font-semibold">{String(v)}</p>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Probabilities</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 p-0 pt-3 text-sm">
            {data?.probability &&
              Object.entries(data.probability as Record<string, number>).map(([k, v]) => (
                <p key={k}>
                  {k}: {(v * 100).toFixed(1)}%
                </p>
              ))}
            <p>Entry {data?.entry?.toFixed?.(5)} · SL {data?.stopLoss?.toFixed?.(5)} · TP {data?.takeProfit?.toFixed?.(5)}</p>
            <p>R:R {data?.riskReward} · Hold {data?.expectedHolding}</p>
          </CardContent>
        </Card>
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Explainability (SHAP-style)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 p-0 pt-3 text-sm text-white/75">
            {(data?.topFeatures ?? []).map((f: { feature: string; shap: number; importance: number }) => (
              <p key={f.feature}>
                {f.feature} · SHAP {f.shap} · weight {(f.importance * 100).toFixed(0)}%
              </p>
            ))}
            <p className="text-xs text-white/40">Training date: {data?.trainedAt}</p>
          </CardContent>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <CardTitle>Why this idea</CardTitle>
          <ul className="mt-3 grid gap-2 text-sm text-white/70">
            {(data?.reasons ?? []).map((r: string) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
