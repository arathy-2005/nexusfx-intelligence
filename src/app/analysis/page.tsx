"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INSTRUMENTS, TIMEFRAMES } from "@/lib/instruments";
import { DISCLAIMER } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/analysis";

export default function AnalysisPage() {
  const [pair, setPair] = useState("EURUSD");
  const [timeframe, setTimeframe] = useState("1H");
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pair, timeframe }),
      });
      return (await res.json()) as { analysis: AnalysisResult };
    },
  });
  const a = mutation.data?.analysis;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">AI analysis</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/65">
        Rules-based scoring of trend, momentum, and volatility. Outputs are study ideas with BUY / SELL / WAIT — not
        orders and not advice.
      </p>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <select className="h-10 rounded-md border border-white/15 bg-black/40 px-3" value={pair} onChange={(e) => setPair(e.target.value)}>
          {INSTRUMENTS.map((i) => (
            <option key={i.symbol} value={i.symbol}>
              {i.name}
            </option>
          ))}
        </select>
        <select className="h-10 rounded-md border border-white/15 bg-black/40 px-3" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          {TIMEFRAMES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Analyzing…" : "Generate analysis"}
        </Button>
      </div>

      {a && (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-1">
            <p className="text-sm text-white/50">Idea</p>
            <p className="mt-2 text-4xl font-semibold">{a.side}</p>
            <p className="mt-2 text-sm">Confidence {a.confidence}%</p>
            <p className="text-sm">Sentiment {a.sentiment}</p>
            <p className="text-sm">R:R {a.riskReward}</p>
            <dl className="mt-4 grid gap-1 text-sm">
              <div>Entry {formatNumber(a.entry, 5)}</div>
              <div>Stop {formatNumber(a.stopLoss, 5)}</div>
              <div>Target {formatNumber(a.takeProfit, 5)}</div>
            </dl>
          </Card>
          <Card className="p-5 lg:col-span-2">
            <CardHeader className="p-0">
              <CardTitle>Structure & indicators</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 p-0 pt-3 text-sm text-white/75">
              <p>Trend: {a.trend}</p>
              <p>Support {formatNumber(a.support, 5)} · Resistance {formatNumber(a.resistance, 5)}</p>
              <p>Breakout: {a.breakout}</p>
              <p>Candle: {a.candlestickPattern} · Chart: {a.chartPattern}</p>
              <p>RSI {a.indicators.rsi} · ADX {a.indicators.adx} · ATR {formatNumber(a.indicators.atr, 5)}</p>
              <p>
                EMA20 {formatNumber(a.indicators.ema20, 5)} · EMA50 {formatNumber(a.indicators.ema50, 5)} · EMA200{" "}
                {formatNumber(a.indicators.ema200, 5)}
              </p>
              <p>
                MACD {a.indicators.macd.macd.toFixed(5)} / signal {a.indicators.macd.signal.toFixed(5)} · VWAP{" "}
                {formatNumber(a.indicators.vwap, 5)}
              </p>
              <p>
                Fib 38.2 {formatNumber(a.indicators.fibonacci.retracement382, 5)} · 61.8{" "}
                {formatNumber(a.indicators.fibonacci.retracement618, 5)}
              </p>
              <p>
                {a.indicators.maCrossover} · Momentum {a.indicators.momentum}
              </p>
            </CardContent>
          </Card>
          <Card className="p-5 lg:col-span-3">
            <CardTitle>Reasoning</CardTitle>
            <ul className="mt-3 grid gap-2 text-sm text-white/70">
              {a.reasons.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
