export type Quote = {
  symbol: string;
  name: string;
  price: number;
  bid: number;
  ask: number;
  spread: number;
  high24h: number;
  low24h: number;
  volume: number;
  change24h: number;
  updatedAt: string;
};

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const BASE: Record<string, number> = {
  EURUSD: 1.0874,
  GBPUSD: 1.2718,
  USDJPY: 149.62,
  AUDUSD: 0.6621,
  USDCAD: 1.3614,
  USDCHF: 0.8892,
  NZDUSD: 0.6018,
  XAUUSD: 2486.4,
  XAGUSD: 29.18,
  BTCUSD: 64120,
  ETHUSD: 2715,
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function syntheticQuote(symbol: string, name: string, pipSize: number, spreadPips: number): Quote {
  const base = BASE[symbol] ?? 1;
  const t = Date.now() / 60000;
  const wave = Math.sin(t / 7 + symbol.length) * 0.0018 + Math.cos(t / 13) * 0.0009;
  const noise = (seededRandom(Math.floor(t) + symbol.charCodeAt(0)) - 0.5) * 0.0008;
  const price = base * (1 + wave + noise);
  const spread = pipSize * spreadPips;
  const high24h = price * 1.004;
  const low24h = price * 0.996;
  return {
    symbol,
    name,
    price,
    bid: price - spread / 2,
    ask: price + spread / 2,
    spread,
    high24h,
    low24h,
    volume: Math.round(12000 + seededRandom(symbol.length * 99) * 80000),
    change24h: (wave + noise) * 100,
    updatedAt: new Date().toISOString(),
  };
}

export function generateCandles(symbol: string, count = 220, timeframeMinutes = 60): Candle[] {
  const base = BASE[symbol] ?? 1;
  const vol = symbol.includes("BTC") ? 0.012 : symbol.includes("XAU") ? 0.004 : 0.0018;
  const now = Date.now();
  let price = base * 0.992;
  const candles: Candle[] = [];
  for (let i = count; i >= 0; i--) {
    const drift = (seededRandom(i + symbol.length * 17) - 0.48) * vol;
    const open = price;
    const close = open * (1 + drift);
    const high = Math.max(open, close) * (1 + seededRandom(i * 3) * vol * 0.6);
    const low = Math.min(open, close) * (1 - seededRandom(i * 5) * vol * 0.6);
    candles.push({
      time: now - i * timeframeMinutes * 60_000,
      open,
      high,
      low,
      close,
      volume: 800 + seededRandom(i * 9) * 4200,
    });
    price = close;
  }
  return candles;
}
