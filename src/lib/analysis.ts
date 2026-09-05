import { clamp } from "./utils";
import type { Candle } from "./quotes";

export type Side = "BUY" | "SELL" | "WAIT";

export type AnalysisResult = {
  pair: string;
  timeframe: string;
  side: Side;
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  trend: string;
  support: number;
  resistance: number;
  breakout: string;
  candlestickPattern: string;
  chartPattern: string;
  indicators: {
    rsi: number;
    macd: { macd: number; signal: number; histogram: number };
    ema20: number;
    ema50: number;
    ema200: number;
    vwap: number;
    atr: number;
    adx: number;
    fibonacci: { retracement382: number; retracement618: number; extension1618: number };
    maCrossover: string;
    momentum: string;
  };
  reasons: string[];
  disclaimer: string;
};

function sma(values: number[], period: number) {
  if (values.length < period) return values.at(-1) ?? 0;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function ema(values: number[], period: number) {
  if (!values.length) return 0;
  const k = 2 / (period + 1);
  let prev = values[0];
  for (let i = 1; i < values.length; i++) prev = values[i] * k + prev * (1 - k);
  return prev;
}

function rsi(closes: number[], period = 14) {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function atr(candles: Candle[], period = 14) {
  if (candles.length < period + 1) return candles.at(-1)?.close ?? 0 * 0.002;
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const c = candles[i];
    const prev = candles[i - 1];
    trs.push(Math.max(c.high - c.low, Math.abs(c.high - prev.close), Math.abs(c.low - prev.close)));
  }
  return sma(trs, period);
}

function macd(closes: number[]) {
  const macdLine = ema(closes, 12) - ema(closes, 26);
  const signal = ema([...Array(Math.max(0, closes.length - 9)).fill(macdLine), macdLine], 9);
  return { macd: macdLine, signal, histogram: macdLine - signal };
}

function adxApprox(candles: Candle[]) {
  if (candles.length < 20) return 18;
  const moves = candles.slice(-20).map((c) => Math.abs(c.close - c.open) / c.open);
  return clamp(moves.reduce((a, b) => a + b, 0) * 1800, 8, 62);
}

function vwap(candles: Candle[]) {
  let pv = 0;
  let vol = 0;
  for (const c of candles.slice(-40)) {
    const typical = (c.high + c.low + c.close) / 3;
    pv += typical * c.volume;
    vol += c.volume;
  }
  return vol ? pv / vol : candles.at(-1)?.close ?? 0;
}

function detectCandle(c: Candle) {
  const body = Math.abs(c.close - c.open);
  const range = c.high - c.low || 1e-9;
  const upper = c.high - Math.max(c.open, c.close);
  const lower = Math.min(c.open, c.close) - c.low;
  if (body / range < 0.12) return "Doji";
  if (lower > body * 2 && upper < body * 0.4) return c.close > c.open ? "Hammer" : "Hanging Man";
  if (upper > body * 2 && lower < body * 0.4) return c.close < c.open ? "Shooting Star" : "Inverted Hammer";
  if (body / range > 0.7) return c.close > c.open ? "Bullish Marubozu" : "Bearish Marubozu";
  return c.close >= c.open ? "Bullish candle" : "Bearish candle";
}

function detectChart(candles: Candle[]) {
  const closes = candles.map((c) => c.close);
  const last = closes.slice(-30);
  const min = Math.min(...last);
  const max = Math.max(...last);
  const now = last.at(-1) ?? 0;
  if ((now - min) / (max - min + 1e-9) > 0.92) return "Ascending channel / potential breakout";
  if ((now - min) / (max - min + 1e-9) < 0.12) return "Descending channel / potential breakdown";
  const mid = (max + min) / 2;
  if (Math.abs(now - mid) / now < 0.002) return "Range / rectangle";
  return "Trend continuation structure";
}

export function analyzeMarket(pair: string, timeframe: string, candles: Candle[]): AnalysisResult {
  const closes = candles.map((c) => c.close);
  const last = candles.at(-1)!;
  const price = last.close;
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const support = Math.min(...lows.slice(-40));
  const resistance = Math.max(...highs.slice(-40));
  const rsiValue = rsi(closes);
  const macdValue = macd(closes);
  const ema20 = ema(closes, 20);
  const ema50 = ema(closes, 50);
  const ema200 = ema(closes, 200);
  const atrValue = atr(candles);
  const adxValue = adxApprox(candles);
  const vwapValue = vwap(candles);
  const swingHigh = Math.max(...highs.slice(-60));
  const swingLow = Math.min(...lows.slice(-60));
  const range = swingHigh - swingLow || price * 0.01;

  let score = 0;
  const reasons: string[] = [];
  if (ema20 > ema50 && ema50 > ema200) {
    score += 2;
    reasons.push("EMA stack is bullish (20 > 50 > 200).");
  } else if (ema20 < ema50 && ema50 < ema200) {
    score -= 2;
    reasons.push("EMA stack is bearish (20 < 50 < 200).");
  } else {
    reasons.push("Moving averages are mixed — trend is not fully aligned.");
  }

  if (rsiValue > 62) {
    score += 1;
    reasons.push(`RSI at ${rsiValue.toFixed(1)} shows bullish momentum, approaching overbought.`);
  } else if (rsiValue < 38) {
    score -= 1;
    reasons.push(`RSI at ${rsiValue.toFixed(1)} shows bearish momentum, approaching oversold.`);
  } else {
    reasons.push(`RSI at ${rsiValue.toFixed(1)} is balanced.`);
  }

  if (macdValue.histogram > 0) {
    score += 1;
    reasons.push("MACD histogram is positive.");
  } else {
    score -= 1;
    reasons.push("MACD histogram is negative.");
  }

  if (price > vwapValue) {
    score += 1;
    reasons.push("Price is trading above VWAP.");
  } else {
    score -= 1;
    reasons.push("Price is trading below VWAP.");
  }

  if (adxValue > 25) reasons.push(`ADX ${adxValue.toFixed(1)} suggests a directional market.`);
  else reasons.push(`ADX ${adxValue.toFixed(1)} suggests a weaker trend / range.`);

  let breakout = "No confirmed breakout";
  if (price > resistance * 0.998) {
    breakout = "Testing resistance — breakout watch";
    score += 1;
  } else if (price < support * 1.002) {
    breakout = "Testing support — breakdown watch";
    score -= 1;
  }

  let side: Side = "WAIT";
  if (score >= 3) side = "BUY";
  else if (score <= -3) side = "SELL";

  const confidence = clamp(42 + Math.abs(score) * 9 + (adxValue - 18) * 0.6, 28, 86);
  const stopDistance = atrValue * 1.6;
  const tpDistance = stopDistance * (side === "WAIT" ? 1.5 : 2.1);
  const entry = price;
  const stopLoss = side === "SELL" ? entry + stopDistance : entry - stopDistance;
  const takeProfit = side === "SELL" ? entry - tpDistance : entry + tpDistance;
  const riskReward = Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss);

  const maCrossover =
    ema20 > ema50 ? "Bullish 20/50 EMA relationship" : "Bearish 20/50 EMA relationship";
  const momentum = rsiValue > 55 && macdValue.histogram > 0 ? "Positive" : rsiValue < 45 && macdValue.histogram < 0 ? "Negative" : "Mixed";

  return {
    pair,
    timeframe,
    side,
    confidence: Math.round(confidence),
    entry,
    stopLoss,
    takeProfit,
    riskReward: Number(riskReward.toFixed(2)),
    sentiment: side === "BUY" ? "Bullish" : side === "SELL" ? "Bearish" : "Neutral",
    trend: ema20 > ema200 ? "Uptrend bias" : ema20 < ema200 ? "Downtrend bias" : "Sideways bias",
    support,
    resistance,
    breakout,
    candlestickPattern: detectCandle(last),
    chartPattern: detectChart(candles),
    indicators: {
      rsi: Number(rsiValue.toFixed(2)),
      macd: {
        macd: Number(macdValue.macd.toFixed(6)),
        signal: Number(macdValue.signal.toFixed(6)),
        histogram: Number(macdValue.histogram.toFixed(6)),
      },
      ema20,
      ema50,
      ema200,
      vwap: vwapValue,
      atr: atrValue,
      adx: Number(adxValue.toFixed(2)),
      fibonacci: {
        retracement382: swingHigh - range * 0.382,
        retracement618: swingHigh - range * 0.618,
        extension1618: swingHigh + range * 0.618,
      },
      maCrossover,
      momentum,
    },
    reasons,
    disclaimer: "This application provides market analysis only and is not financial advice.",
  };
}

export function lotSize(input: {
  balance: number;
  riskPercent: number;
  stopLossPips: number;
  pipValuePerLot: number;
  leverage: number;
  contractSize: number;
  price: number;
}) {
  const riskAmount = input.balance * (input.riskPercent / 100);
  const pipRiskValue = input.stopLossPips * input.pipValuePerLot || 1;
  const lots = riskAmount / pipRiskValue;
  const positionSize = lots * input.contractSize;
  const margin = (positionSize * input.price) / Math.max(input.leverage, 1);
  return {
    lotSize: Number(Math.max(lots, 0).toFixed(3)),
    miniLot: Number((lots * 10).toFixed(3)),
    microLot: Number((lots * 100).toFixed(3)),
    positionSize: Number(positionSize.toFixed(2)),
    riskAmount: Number(riskAmount.toFixed(2)),
    marginRequired: Number(margin.toFixed(2)),
  };
}

export function pipCalc(input: {
  lots: number;
  pips: number;
  pipValuePerLot: number;
  direction: "profit" | "loss";
}) {
  const pipValue = input.lots * input.pipValuePerLot;
  const move = pipValue * input.pips;
  return {
    pipValue: Number(pipValue.toFixed(4)),
    profit: input.direction === "profit" ? Number(move.toFixed(2)) : 0,
    loss: input.direction === "loss" ? Number(move.toFixed(2)) : 0,
    risk: Number(move.toFixed(2)),
  };
}
