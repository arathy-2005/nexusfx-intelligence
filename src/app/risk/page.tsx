import { PageIntro } from "@/components/page-intro";
import { Card } from "@/components/ui/card";

export default function RiskPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageIntro title="Risk management">Position sizing, volatility, and correlation context for study — not order routing.</PageIntro>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-5">
          <p className="font-medium">Suggested study risk</p>
          <p className="mt-2 text-sm text-white/70">Keep idea risk at 0.5–1.0% of notional study capital. ATR-based stops are shown on the AI desk.</p>
        </Card>
        <Card className="p-5">
          <p className="font-medium">Correlation watch</p>
          <p className="mt-2 text-sm text-white/70">EURUSD vs DXY typically inverse; gold vs real yields; BTC vs risk-on beta. Treat as context, not certainty.</p>
        </Card>
      </div>
    </div>
  );
}
