import Link from "next/link";
import { DISCLAIMER } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalculatorsIndex() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Risk calculators</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/calculators/lot-size">
          <Card className="h-full p-2 hover:bg-white/5">
            <CardHeader>
              <CardTitle>Forex lot size calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/65">
              Convert account risk, stop distance, pair, and leverage into lots, position size, and margin.
            </CardContent>
          </Card>
        </Link>
        <Link href="/calculators/pip">
          <Card className="h-full p-2 hover:bg-white/5">
            <CardHeader>
              <CardTitle>Pip calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/65">Pip value, hypothetical profit, loss, and risk for a given move.</CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
