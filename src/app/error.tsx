"use client";

import { DISCLAIMER } from "@/lib/constants";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">This page could not finish loading</h1>
      <p className="mt-3 text-sm text-white/70">Refresh once. If it persists, open the site in a private window (extensions sometimes block scripts).</p>
      <p className="mt-3 text-xs text-amber-200/90">{DISCLAIMER}</p>
      <button type="button" onClick={reset} className="mt-6 rounded-md bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950">
        Try again
      </button>
    </div>
  );
}
