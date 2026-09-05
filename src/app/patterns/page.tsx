import { PageIntro } from "@/components/page-intro";
import { Card } from "@/components/ui/card";
import { generateCandles } from "@/lib/quotes";
import { detectPatterns } from "@/lib/intelligence";
import { INSTRUMENTS } from "@/lib/instruments";

export default function PatternsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageIntro title="Pattern scanner">
        Head & shoulders, doubles, triangles, flags, pennants, channels, wedges, cup & handle, plus candlesticks — labeled as study flags.
      </PageIntro>
      <div className="grid gap-3">
        {INSTRUMENTS.map((i) => (
          <Card key={i.symbol} className="p-4">
            <p className="font-medium">{i.name}</p>
            <p className="mt-1 text-sm text-white/70">{detectPatterns(generateCandles(i.symbol, 120, 60)).join(" · ")}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
