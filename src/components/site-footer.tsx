import Link from "next/link";
import { DISCLAIMER, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#05070d]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-white/60">Educational market analysis. No trade execution.</p>
        </div>
        <div>
          <p className="text-sm font-medium">Platform</p>
          <div className="mt-3 grid gap-2 text-sm text-white/60">
            <Link href="/market">Live market</Link>
            <Link href="/charts">Charts</Link>
            <Link href="/analysis">AI analysis</Link>
            <Link href="/signals">Signals</Link>
            <Link href="/intelligence">AI desk</Link>
            <Link href="/predictions">Predictions</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Research</p>
          <div className="mt-3 grid gap-2 text-sm text-white/60">
            <Link href="/models">Model performance</Link>
            <Link href="/backtesting">Backtesting</Link>
            <Link href="/scanner">Market scanner</Link>
            <Link href="/calendar">Economic calendar</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Account</p>
          <div className="mt-3 grid gap-2 text-sm text-white/60">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/sign-in">Sign in</Link>
            <Link href="/docs">Documentation</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-amber-100/90">{DISCLAIMER}</div>
    </footer>
  );
}
