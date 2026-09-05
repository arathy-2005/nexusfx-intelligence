import { PageIntro } from "@/components/page-intro";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <PageIntro title="Settings">Theme follows the header toggle. ML_API_URL points the app at FastAPI when Docker/Railway is up.</PageIntro>
      <Card className="grid gap-3 p-5 text-sm">
        <p>Default timeframe: 1H</p>
        <p>Study risk: 1%</p>
        <p>Account currency: USD</p>
        <p>Nightly retrain: enabled in ml/nightly.py / GitHub Actions</p>
      </Card>
    </div>
  );
}
