"use client";

import { useEffect, useRef } from "react";
import { TV_INTERVAL, type Timeframe } from "@/lib/instruments";

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => unknown;
    };
  }
}

export function TradingViewChart({
  symbol,
  timeframe,
  theme = "dark",
}: {
  symbol: string;
  timeframe: Timeframe;
  theme?: "dark" | "light";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";
    const holder = document.createElement("div");
    holder.id = "nfx-tv-chart-inner";
    holder.style.height = "100%";
    holder.style.width = "100%";
    container.appendChild(holder);
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (!window.TradingView) return;
      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: TV_INTERVAL[timeframe],
        timezone: "Etc/UTC",
        theme: theme === "dark" ? "dark" : "light",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: false,
        withdateranges: true,
        details: true,
        studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies", "MASimple@tv-basicstudies"],
        container_id: holder.id,
      });
    };
    document.body.appendChild(script);
    return () => {
      container.innerHTML = "";
    };
  }, [symbol, timeframe, theme]);

  return (
    <div className="h-[640px] w-full overflow-hidden rounded-2xl border border-white/10">
      <div id="nfx-tv-chart" ref={ref} className="h-full w-full" />
    </div>
  );
}
