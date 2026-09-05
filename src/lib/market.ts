import { INSTRUMENTS } from "./instruments";
import { syntheticQuote, type Quote } from "./quotes";

async function fetchJson<T>(url: string, timeoutMs = 4000): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type FxPayload = { rates?: Record<string, number> };
type CoinPayload = { bitcoin?: { usd: number; usd_24h_vol?: number }; ethereum?: { usd: number; usd_24h_vol?: number } };

export async function getQuotes(): Promise<Quote[]> {
  const fx = await fetchJson<FxPayload>("https://open.er-api.com/v6/latest/USD");
  const coins = await fetchJson<CoinPayload>(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_vol=true",
  );

  return INSTRUMENTS.map((ins) => {
    const fallback = syntheticQuote(ins.symbol, ins.name, ins.pipSize, ins.typicalSpreadPips);
    let price = fallback.price;
    if (fx?.rates) {
      const map: Record<string, () => number | undefined> = {
        EURUSD: () => (fx.rates!.EUR ? 1 / fx.rates!.EUR : undefined),
        GBPUSD: () => (fx.rates!.GBP ? 1 / fx.rates!.GBP : undefined),
        USDJPY: () => fx.rates!.JPY,
        AUDUSD: () => (fx.rates!.AUD ? 1 / fx.rates!.AUD : undefined),
        USDCAD: () => fx.rates!.CAD,
        USDCHF: () => fx.rates!.CHF,
        NZDUSD: () => (fx.rates!.NZD ? 1 / fx.rates!.NZD : undefined),
      };
      const live = map[ins.symbol]?.();
      if (live) price = live;
    }
    if (ins.symbol === "BTCUSD" && coins?.bitcoin?.usd) price = coins.bitcoin.usd;
    if (ins.symbol === "ETHUSD" && coins?.ethereum?.usd) price = coins.ethereum.usd;

    const spread = ins.pipSize * ins.typicalSpreadPips;
    return {
      ...fallback,
      price,
      bid: price - spread / 2,
      ask: price + spread / 2,
      spread,
      high24h: price * 1.0048,
      low24h: price * 0.9954,
      volume:
        ins.symbol === "BTCUSD"
          ? Math.round(coins?.bitcoin?.usd_24h_vol ?? fallback.volume)
          : ins.symbol === "ETHUSD"
            ? Math.round(coins?.ethereum?.usd_24h_vol ?? fallback.volume)
            : fallback.volume,
      updatedAt: new Date().toISOString(),
    };
  });
}
