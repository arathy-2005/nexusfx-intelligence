import { DISCLAIMER } from "@/lib/constants";

export default function DocsPage() {
  return (
    <article className="prose prose-invert mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Documentation</h1>
      <p className="mt-2 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <h2 className="mt-8 text-xl font-semibold">What this product is</h2>
      <p className="mt-2 text-sm text-white/70">
        NexusFX is an educational analysis workspace. It does not place trades, hold funds, or connect to broker execution APIs.
      </p>
      <h2 className="mt-8 text-xl font-semibold">API overview</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-white/70">
        <li>GET /api/market — live quotes</li>
        <li>POST /api/analysis — indicator-based idea</li>
        <li>GET /api/signals — educational signals</li>
        <li>GET /api/news — news feed</li>
        <li>GET /api/calendar — economic calendar</li>
        <li>POST /api/calculators/lot-size and /api/calculators/pip</li>
        <li>POST /api/auth/login · register · logout · GET /api/auth/me</li>
      </ul>
      <p className="mt-6 text-sm">
        Full installation and deployment notes live in the repository README.
      </p>
    </article>
  );
}
