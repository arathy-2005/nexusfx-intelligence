import { DISCLAIMER } from "@/lib/constants";
import { buildSignals } from "@/lib/demo-data";
import { formatNumber } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function SignalsPage() {
  const signals = buildSignals();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Educational signals</h1>
      <p className="mt-2 text-sm text-white/65">
        Probability-framed ideas for study. They expire, include invalidation, and are never routed to a broker.
      </p>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/50">
            <tr>
              {["Pair", "Signal", "Entry", "Stop loss", "Take profit", "Confidence %", "Risk %", "Trend", "Timeframe", "Reason", "Expiry"].map(
                (h) => (
                  <th key={h} className="px-3 py-3 font-medium">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {signals.map((s) => (
              <tr key={s.id} className="border-t border-white/10 align-top">
                <td className="px-3 py-3 font-medium">{s.pair}</td>
                <td className="px-3 py-3">
                  <span
                    className={
                      s.side === "BUY"
                        ? "text-emerald-400"
                        : s.side === "SELL"
                          ? "text-rose-400"
                          : "text-amber-300"
                    }
                  >
                    {s.side}
                  </span>
                </td>
                <td className="px-3 py-3 font-mono">{formatNumber(s.entry, 5)}</td>
                <td className="px-3 py-3 font-mono">{formatNumber(s.stopLoss, 5)}</td>
                <td className="px-3 py-3 font-mono">{formatNumber(s.takeProfit, 5)}</td>
                <td className="px-3 py-3">{s.confidence}</td>
                <td className="px-3 py-3">{s.riskPercent}</td>
                <td className="px-3 py-3">{s.trend}</td>
                <td className="px-3 py-3">{s.timeframe}</td>
                <td className="max-w-xs px-3 py-3 text-white/70">{s.reason}</td>
                <td className="px-3 py-3 text-xs">{new Date(s.expiresAt).toUTCString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card className="mt-6 p-4 text-xs text-white/50">{DISCLAIMER}</Card>
    </div>
  );
}
