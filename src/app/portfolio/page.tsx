import { PageIntro } from "@/components/page-intro";
import { Card } from "@/components/ui/card";

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageIntro title="Portfolio">Paper / study book only. NexusFX never holds cash or positions at a broker.</PageIntro>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Study NAV", "$10,000"],
          ["Open study ideas", "3"],
          ["Unrealized (sim)", "+1.2%"],
        ].map(([k, v]) => (
          <Card key={k} className="p-4">
            <p className="text-xs text-white/50">{k}</p>
            <p className="text-2xl font-semibold">{v}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
