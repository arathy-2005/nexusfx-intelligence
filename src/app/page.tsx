"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LiveTicker } from "@/components/live-ticker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DISCLAIMER } from "@/lib/constants";
import { FAQS, MARKET_UPDATES, TESTIMONIALS } from "@/lib/demo-data";

const FEATURES = [
  { title: "Live market board", body: "Bid, ask, spread, 24h range, and volume for majors, metals, and crypto." },
  { title: "TradingView charts", body: "Timeframes from 1m to monthly with drawings, indicators, and fullscreen." },
  { title: "AI-style analysis", body: "Trend, S/R, RSI, MACD, EMA, VWAP, ATR, ADX, Fibonacci, and pattern notes." },
  { title: "Educational signals", body: "BUY / SELL / WAIT ideas with confidence, invalidation, and expiry — never auto-traded." },
  { title: "Risk calculators", body: "Lot size, pip value, margin, and risk amount for position planning." },
  { title: "Calendar & news", body: "High-impact events plus Fed, ECB, BOE, RBA, and BOJ coverage." },
];

export default function HomePage() {
  return (
    <div>
      <section className="hero-grid relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-cyan-300">Analysis platform · no execution</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
              See the market clearly.
              <span className="block text-cyan-300">Never confuse analysis with advice.</span>
            </h1>
            <p className="mt-5 max-w-xl text-white/70">
              NexusFX is a production-grade workspace for forex education: live quotes, charts, probability-based ideas,
              and risk math — with a permanent disclaimer on every page.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/market">Open live market</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/analysis">Run AI analysis</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-amber-200/90">{DISCLAIMER}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-white/10 bg-black/40 p-5 shadow-2xl"
          >
            <p className="text-sm text-white/50">Latest market updates</p>
            <ul className="mt-4 grid gap-3">
              {MARKET_UPDATES.map((u) => (
                <li key={u} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  {u}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
      <LiveTicker />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl font-semibold">Built for serious study</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/65">{f.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-semibold">Pricing</h2>
          <p className="mt-2 text-white/60">Educational access only. No brokerage. No order routing.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { name: "Observer", price: "Free", items: ["Live quotes", "Charts", "Calculators"] },
              { name: "Analyst", price: "$19/mo", items: ["Saved analysis", "Journal", "Watchlists"] },
              { name: "Desk", price: "$49/mo", items: ["Admin tools", "Team notes", "Priority calendar"] },
            ].map((p) => (
              <Card key={p.name} className="p-6">
                <p className="text-sm text-cyan-300">{p.name}</p>
                <p className="mt-2 text-3xl font-semibold">{p.price}</p>
                <ul className="mt-4 grid gap-2 text-sm text-white/70">
                  {p.items.map((i) => (
                    <li key={i}>• {i}</li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" variant={p.name === "Analyst" ? "default" : "outline"} asChild>
                  <Link href="/sign-up">Start studying</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl font-semibold">What analysts say</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="p-6">
              <p className="text-sm text-white/80">“{t.quote}”</p>
              <p className="mt-4 text-sm font-medium">{t.name}</p>
              <p className="text-xs text-white/50">{t.role}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-3xl font-semibold">FAQ</h2>
        <div className="mt-6 grid gap-3">
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-white/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
