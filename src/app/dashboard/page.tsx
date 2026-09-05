"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DISCLAIMER } from "@/lib/constants";
import { buildSignals } from "@/lib/demo-data";
import { INSTRUMENTS } from "@/lib/instruments";
import { useWatchStore } from "@/store/watch";

export default function DashboardPage() {
  const { favorites, watchlist, toggleWatch } = useWatchStore();
  const [notes, setNotes] = useState("EURUSD range study — no execution.");
  const [journal, setJournal] = useState([{ pair: "EURUSD", side: "WAIT", notes: "Wait for NFP reaction." }]);
  const signals = buildSignals().slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">User dashboard</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Favorite pairs</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-3 text-sm">{favorites.join(", ") || "None yet"}</CardContent>
        </Card>
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Watchlist</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 p-0 pt-3">
            {INSTRUMENTS.map((i) => (
              <label key={i.symbol} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={watchlist.includes(i.symbol)} onChange={() => toggleWatch(i.symbol)} />
                {i.name}
              </label>
            ))}
          </CardContent>
        </Card>
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 p-0 pt-3 text-sm text-white/70">
            <p>High-impact US NFP in the educational calendar.</p>
            <p>EURUSD idea expired — review only.</p>
            <p>New BOE commentary tagged in news.</p>
          </CardContent>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <CardTitle>Saved analysis</CardTitle>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-3 min-h-28 w-full rounded-xl border border-white/15 bg-black/40 p-3 text-sm" />
        </Card>
        <Card className="p-5">
          <CardTitle>Recent signals</CardTitle>
          <ul className="mt-3 grid gap-2 text-sm">
            {signals.map((s) => (
              <li key={s.id}>
                {s.pair} · {s.side} · {s.confidence}%
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 lg:col-span-3">
          <CardTitle>Trade journal (study log)</CardTitle>
          <form
            className="mt-3 grid gap-2 md:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const pair = (form.elements.namedItem("pair") as HTMLInputElement).value;
              const side = (form.elements.namedItem("side") as HTMLInputElement).value;
              const jnotes = (form.elements.namedItem("jnotes") as HTMLInputElement).value;
              setJournal((j) => [{ pair, side, notes: jnotes }, ...j]);
              form.reset();
            }}
          >
            <input name="pair" placeholder="Pair" className="h-10 rounded-md border border-white/15 bg-black/40 px-3" required />
            <input name="side" placeholder="BUY/SELL/WAIT" className="h-10 rounded-md border border-white/15 bg-black/40 px-3" required />
            <input name="jnotes" placeholder="Notes" className="h-10 rounded-md border border-white/15 bg-black/40 px-3 md:col-span-2" required />
            <Button type="submit" className="md:col-span-4">
              Add journal entry
            </Button>
          </form>
          <ul className="mt-4 grid gap-2 text-sm text-white/75">
            {journal.map((j, i) => (
              <li key={i} className="rounded-lg bg-white/5 p-3">
                {j.pair} · {j.side} — {j.notes}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
