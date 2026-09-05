"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { DISCLAIMER } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import type { Quote } from "@/lib/quotes";
import { Card } from "@/components/ui/card";
import { useWatchStore } from "@/store/watch";

export default function MarketPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => (await fetch("/api/market")).json() as Promise<{ quotes: Quote[] }>,
    refetchInterval: 12000,
  });
  const { favorites, toggleFavorite } = useWatchStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Live market</h1>
      <p className="mt-2 text-sm text-white/60">Indicative quotes for study. Spreads are typical, not broker-specific.</p>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
            <tr>
              {["", "Pair", "Live", "Bid", "Ask", "Spread", "24h High", "24h Low", "Volume"].map((h) => (
                <th key={h} className="px-3 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.quotes ?? []).map((q) => (
              <tr key={q.symbol} className="border-t border-white/10">
                <td className="px-3 py-3">
                  <button onClick={() => toggleFavorite(q.symbol)} aria-label="Favorite">
                    <Star className={favorites.includes(q.symbol) ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-white/30"} />
                  </button>
                </td>
                <td className="px-3 py-3 font-medium">{q.name}</td>
                <td className="px-3 py-3 font-mono">{formatNumber(q.price, q.price > 20 ? 2 : 5)}</td>
                <td className="px-3 py-3 font-mono">{formatNumber(q.bid, q.price > 20 ? 2 : 5)}</td>
                <td className="px-3 py-3 font-mono">{formatNumber(q.ask, q.price > 20 ? 2 : 5)}</td>
                <td className="px-3 py-3 font-mono">{formatNumber(q.spread, q.price > 20 ? 2 : 5)}</td>
                <td className="px-3 py-3 font-mono">{formatNumber(q.high24h, q.price > 20 ? 2 : 5)}</td>
                <td className="px-3 py-3 font-mono">{formatNumber(q.low24h, q.price > 20 ? 2 : 5)}</td>
                <td className="px-3 py-3 font-mono">{Math.round(q.volume).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-6 text-sm text-white/50">Loading quotes…</p>}
      </div>
      <Card className="mt-6 p-4 text-xs text-white/50">
        Prices may be delayed. Volume for FX is a study proxy. {DISCLAIMER}
      </Card>
    </div>
  );
}
