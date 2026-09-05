"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-[#070b14] p-8 text-white">
        <h1 className="text-xl font-semibold">NexusFX failed to start in this browser</h1>
        <p className="mt-2 text-sm text-white/70">Hard-refresh (Ctrl+Shift+R) or try another browser.</p>
        <button type="button" className="mt-4 rounded bg-cyan-400 px-3 py-2 text-slate-950" onClick={reset}>
          Retry
        </button>
      </body>
    </html>
  );
}
