export type InstrumentKind = "forex" | "metal" | "crypto";

export type Instrument = {
  symbol: string;
  name: string;
  kind: InstrumentKind;
  tvSymbol: string;
  pipSize: number;
  contractSize: number;
  typicalSpreadPips: number;
  quotePrecision: number;
};

export const INSTRUMENTS: Instrument[] = [
  { symbol: "EURUSD", name: "EUR/USD", kind: "forex", tvSymbol: "FX:EURUSD", pipSize: 0.0001, contractSize: 100000, typicalSpreadPips: 1.1, quotePrecision: 5 },
  { symbol: "GBPUSD", name: "GBP/USD", kind: "forex", tvSymbol: "FX:GBPUSD", pipSize: 0.0001, contractSize: 100000, typicalSpreadPips: 1.3, quotePrecision: 5 },
  { symbol: "USDJPY", name: "USD/JPY", kind: "forex", tvSymbol: "FX:USDJPY", pipSize: 0.01, contractSize: 100000, typicalSpreadPips: 1.0, quotePrecision: 3 },
  { symbol: "AUDUSD", name: "AUD/USD", kind: "forex", tvSymbol: "FX:AUDUSD", pipSize: 0.0001, contractSize: 100000, typicalSpreadPips: 1.2, quotePrecision: 5 },
  { symbol: "USDCAD", name: "USD/CAD", kind: "forex", tvSymbol: "FX:USDCAD", pipSize: 0.0001, contractSize: 100000, typicalSpreadPips: 1.4, quotePrecision: 5 },
  { symbol: "USDCHF", name: "USD/CHF", kind: "forex", tvSymbol: "FX:USDCHF", pipSize: 0.0001, contractSize: 100000, typicalSpreadPips: 1.3, quotePrecision: 5 },
  { symbol: "NZDUSD", name: "NZD/USD", kind: "forex", tvSymbol: "FX:NZDUSD", pipSize: 0.0001, contractSize: 100000, typicalSpreadPips: 1.6, quotePrecision: 5 },
  { symbol: "XAUUSD", name: "Gold (XAU/USD)", kind: "metal", tvSymbol: "TVC:GOLD", pipSize: 0.1, contractSize: 100, typicalSpreadPips: 2.5, quotePrecision: 2 },
  { symbol: "XAGUSD", name: "Silver (XAG/USD)", kind: "metal", tvSymbol: "TVC:SILVER", pipSize: 0.01, contractSize: 5000, typicalSpreadPips: 3.0, quotePrecision: 3 },
  { symbol: "BTCUSD", name: "Bitcoin", kind: "crypto", tvSymbol: "BITSTAMP:BTCUSD", pipSize: 1, contractSize: 1, typicalSpreadPips: 8, quotePrecision: 2 },
  { symbol: "ETHUSD", name: "Ethereum", kind: "crypto", tvSymbol: "BITSTAMP:ETHUSD", pipSize: 0.1, contractSize: 1, typicalSpreadPips: 6, quotePrecision: 2 },
];

export function getInstrument(symbol: string) {
  return INSTRUMENTS.find((i) => i.symbol === symbol.toUpperCase().replace("/", ""));
}

export const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1H", "4H", "Daily", "Weekly", "Monthly"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export const TV_INTERVAL: Record<Timeframe, string> = {
  "1m": "1",
  "5m": "5",
  "15m": "15",
  "30m": "30",
  "1H": "60",
  "4H": "240",
  Daily: "D",
  Weekly: "W",
  Monthly: "M",
};
