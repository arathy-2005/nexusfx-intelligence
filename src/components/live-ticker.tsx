"use client";

import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";
import type { Quote } from "@/lib/quotes";

export function LiveTicker() {
  const { data } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const res = await fetch("/api/market");
      const json = await res.json();
      return json.quotes as Quote[];
    },
    refetchInterval: 15000,
  });

  const quotes = data ?? [];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black/40">
      <div className="flex min-w-full animate-[ticker_40s_linear_infinite] gap-10 py-2 whitespace-nowrap">
        {[...quotes, ...quotes].map((q, i) => (
          <span key={`${q.symbol}-${i}`} className="inline-flex items-center gap-2 text-xs text-white/80">
            <span className="font-semibold text-white">{q.name}</span>
            <span className="font-mono">{formatNumber(q.price, q.price > 20 ? 2 : 5)}</span>
            <span className={q.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {q.change24h >= 0 ? "+" : ""}
              {q.change24h.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
