"use client";

import { useMemo, useState } from "react";
import { DISCLAIMER } from "@/lib/constants";
import { CALENDAR } from "@/lib/demo-data";
import { Card } from "@/components/ui/card";

export default function CalendarPage() {
  const [impact, setImpact] = useState("ALL");
  const rows = useMemo(
    () => CALENDAR.filter((e) => (impact === "ALL" ? true : e.impact === impact)),
    [impact],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Economic calendar</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["ALL", "HIGH", "MEDIUM", "LOW"].map((i) => (
          <button
            key={i}
            onClick={() => setImpact(i)}
            className={`rounded-full px-3 py-1 text-xs ${impact === i ? "bg-cyan-400 text-slate-950" : "bg-white/10"}`}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/50">
            <tr>
              {["Time (UTC)", "Event", "Country", "Currency", "Impact", "Forecast", "Previous", "Actual"].map((h) => (
                <th key={h} className="px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-white/10">
                <td className="px-3 py-3 text-xs">{new Date(e.eventTime).toUTCString()}</td>
                <td className="px-3 py-3 font-medium">{e.title}</td>
                <td className="px-3 py-3">{e.country}</td>
                <td className="px-3 py-3">{e.currency}</td>
                <td className="px-3 py-3">
                  <span className={e.impact === "HIGH" ? "text-rose-400" : e.impact === "MEDIUM" ? "text-amber-300" : "text-white/60"}>
                    {e.impact}
                  </span>
                </td>
                <td className="px-3 py-3">{e.forecast}</td>
                <td className="px-3 py-3">{e.previous}</td>
                <td className="px-3 py-3">{e.actual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card className="mt-6 p-4 text-xs text-white/50">Educational calendar sample. Confirm times with a primary source. {DISCLAIMER}</Card>
    </div>
  );
}
