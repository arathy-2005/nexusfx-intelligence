"use client";

import { useQuery } from "@tanstack/react-query";
import { PageIntro } from "@/components/page-intro";

export default function ScannerPage() {
  const { data } = useQuery({
    queryKey: ["registry-scan"],
    queryFn: async () => (await fetch("/api/intelligence/registry")).json(),
  });
  const rows = data?.scanner ?? [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageIntro title="Market scanner">Ranks majors, metals, and crypto on trend, signal, and pattern flags.</PageIntro>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/50">
            <tr>
              {["Symbol", "Trend", "Signal", "Confidence", "Patterns"].map((h) => (
                <th key={h} className="px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r: { symbol: string; trend: string; signal: string; confidence: number; patterns: string[] }) => (
              <tr key={r.symbol} className="border-t border-white/10">
                <td className="px-3 py-3 font-medium">{r.symbol}</td>
                <td className="px-3 py-3">{r.trend}</td>
                <td className="px-3 py-3">{r.signal}</td>
                <td className="px-3 py-3">{r.confidence}</td>
                <td className="px-3 py-3 text-white/70">{(r.patterns ?? []).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
