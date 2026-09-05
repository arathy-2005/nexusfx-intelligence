import { PageIntro } from "@/components/page-intro";
import { Card } from "@/components/ui/card";
import { MODEL_BOARD } from "@/lib/intelligence";

export default function MonitoringPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageIntro title="Model monitoring">Drift, accuracy, and deployment history. Nightly job writes data/registry/history.</PageIntro>
      <div className="grid gap-3">
        {MODEL_BOARD.map((m) => (
          <Card key={m.name} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-white/50">{m.status}</p>
            </div>
            <p className="text-sm">{m.accuracy == null ? "research" : `${(m.accuracy * 100).toFixed(1)}% live-study acc.`}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
