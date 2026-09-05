"use client";

import { useMemo, useState } from "react";
import { DISCLAIMER } from "@/lib/constants";
import { NEWS } from "@/lib/demo-data";
import { Card } from "@/components/ui/card";

const CATS = ["ALL", "FOREX", "CENTRAL_BANK", "FEDERAL_RESERVE", "ECB", "BOE", "RBA", "BOJ"] as const;

export default function NewsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("ALL");
  const rows = useMemo(
    () =>
      NEWS.filter((n) => (cat === "ALL" ? true : n.category === cat)).filter(
        (n) => n.title.toLowerCase().includes(q.toLowerCase()) || n.summary.toLowerCase().includes(q.toLowerCase()),
      ),
    [q, cat],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Market news</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search headlines…"
        className="mt-6 h-11 w-full rounded-xl border border-white/15 bg-black/40 px-4"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1 text-xs ${cat === c ? "bg-cyan-400 text-slate-950" : "bg-white/10"}`}>
            {c.replaceAll("_", " ")}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4">
        {rows.map((n) => (
          <Card key={n.id} className="p-5">
            <p className="text-xs uppercase tracking-wide text-cyan-300">{n.category.replaceAll("_", " ")}</p>
            <h2 className="mt-1 text-lg font-semibold">{n.title}</h2>
            <p className="mt-2 text-sm text-white/70">{n.summary}</p>
            <p className="mt-3 text-xs text-white/40">
              {n.source} · {new Date(n.publishedAt).toUTCString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
