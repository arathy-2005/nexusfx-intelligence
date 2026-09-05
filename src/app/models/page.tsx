"use client";

import { useQuery } from "@tanstack/react-query";
import { PageIntro } from "@/components/page-intro";
import { MODEL_BOARD } from "@/lib/intelligence";
import { Card } from "@/components/ui/card";

export default function ModelsPage() {
  const { data } = useQuery({
    queryKey: ["registry"],
    queryFn: async () => (await fetch("/api/intelligence/registry")).json(),
  });
  const rows = data?.models ?? MODEL_BOARD;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageIntro title="Model performance">Champion selection compares classical boosters, trees, linear models, and sequence nets when the ML API is trained.</PageIntro>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/50">
            <tr>
              {["Family", "Model", "Status", "Accuracy"].map((h) => (
                <th key={h} className="px-3 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r: { family: string; name: string; status: string; accuracy: number | null }) => (
              <tr key={r.name} className="border-t border-white/10">
                <td className="px-3 py-3">{r.family}</td>
                <td className="px-3 py-3">{r.name}</td>
                <td className="px-3 py-3">{r.status}</td>
                <td className="px-3 py-3">{r.accuracy == null ? "n/a" : `${(r.accuracy * 100).toFixed(1)}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card className="mt-4 p-4 text-xs text-white/50">MLflow-style artifacts live in data/registry after `python -m ml.train`. Rollback = copy a history stamp over latest.json.</Card>
    </div>
  );
}
