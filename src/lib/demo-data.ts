import { DISCLAIMER } from "./constants";
import { INSTRUMENTS } from "./instruments";
import type { AnalysisResult, Side } from "./analysis";
import { analyzeMarket } from "./analysis";
import { generateCandles } from "./quotes";

export type DemoSignal = {
  id: string;
  pair: string;
  side: Side;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  riskPercent: number;
  trend: string;
  timeframe: string;
  reason: string;
  expiresAt: string;
  published: boolean;
};

export type DemoNews = {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: "FOREX" | "FEDERAL_RESERVE" | "ECB" | "BOE" | "RBA" | "BOJ" | "CENTRAL_BANK" | "GENERAL";
  url: string;
  publishedAt: string;
};

export type DemoEvent = {
  id: string;
  title: string;
  country: string;
  currency: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  forecast: string;
  previous: string;
  actual: string;
  eventTime: string;
};

function hoursFromNow(h: number) {
  return new Date(Date.now() + h * 3600_000).toISOString();
}

export function buildSignals(): DemoSignal[] {
  return INSTRUMENTS.slice(0, 8).map((ins, i) => {
    const tf = ["15m", "1H", "4H", "Daily"][i % 4];
    const analysis = analyzeMarket(ins.symbol, tf, generateCandles(ins.symbol, 180, 60));
    return {
      id: `sig_${ins.symbol}_${i}`,
      pair: ins.name,
      side: analysis.side,
      entry: analysis.entry,
      stopLoss: analysis.stopLoss,
      takeProfit: analysis.takeProfit,
      confidence: analysis.confidence,
      riskPercent: 0.75 + (i % 3) * 0.25,
      trend: analysis.trend,
      timeframe: tf,
      reason: analysis.reasons.slice(0, 2).join(" "),
      expiresAt: hoursFromNow(8 + i * 3),
      published: true,
    };
  });
}

export const NEWS: DemoNews[] = [
  {
    id: "n1",
    title: "Dollar steadies as traders weigh mixed US labor signals",
    summary: "The US dollar held a narrow range as markets digested labor-market data and the implied path of policy.",
    source: "NexusFX Desk",
    category: "FOREX",
    url: "#",
    publishedAt: hoursFromNow(-2),
  },
  {
    id: "n2",
    title: "Federal Reserve speakers emphasize data dependence",
    summary: "Officials reiterated that policy will remain contingent on incoming inflation and employment prints.",
    source: "Fed Watch",
    category: "FEDERAL_RESERVE",
    url: "#",
    publishedAt: hoursFromNow(-5),
  },
  {
    id: "n3",
    title: "ECB keeps optionality on deposit rate path",
    summary: "Euro-area policymakers stressed that inflation risks remain two-sided even as growth stays uneven.",
    source: "Frankfurt Brief",
    category: "ECB",
    url: "#",
    publishedAt: hoursFromNow(-8),
  },
  {
    id: "n4",
    title: "Bank of England monitors services inflation persistence",
    summary: "Sterling remained sensitive to UK services CPI and wage growth as markets priced the next BOE meeting.",
    source: "London Desk",
    category: "BOE",
    url: "#",
    publishedAt: hoursFromNow(-11),
  },
  {
    id: "n5",
    title: "RBA commentary focuses on household cash-flow pressure",
    summary: "The Australian dollar tracked risk sentiment and China demand cues alongside domestic policy commentary.",
    source: "Oceania Note",
    category: "RBA",
    url: "#",
    publishedAt: hoursFromNow(-14),
  },
  {
    id: "n6",
    title: "BOJ remains attentive to yen volatility",
    summary: "Markets continued to debate the pace of Japanese policy normalization after recent FX swings.",
    source: "Tokyo Wire",
    category: "BOJ",
    url: "#",
    publishedAt: hoursFromNow(-18),
  },
  {
    id: "n7",
    title: "Gold holds bid as real yields pause",
    summary: "Bullion found support while traders waited for the next US inflation release.",
    source: "Metals Desk",
    category: "GENERAL",
    url: "#",
    publishedAt: hoursFromNow(-3),
  },
  {
    id: "n8",
    title: "Central banks signal caution into event risk",
    summary: "A packed calendar of CPI and employment data kept major FX pairs in wait-and-see mode.",
    source: "Policy Radar",
    category: "CENTRAL_BANK",
    url: "#",
    publishedAt: hoursFromNow(-6),
  },
];

export const CALENDAR: DemoEvent[] = [
  { id: "e1", title: "US Non-Farm Payrolls", country: "United States", currency: "USD", impact: "HIGH", forecast: "180K", previous: "175K", actual: "—", eventTime: hoursFromNow(18) },
  { id: "e2", title: "Eurozone CPI (YoY)", country: "Eurozone", currency: "EUR", impact: "HIGH", forecast: "2.4%", previous: "2.5%", actual: "—", eventTime: hoursFromNow(26) },
  { id: "e3", title: "UK GDP (QoQ)", country: "United Kingdom", currency: "GBP", impact: "HIGH", forecast: "0.2%", previous: "0.1%", actual: "—", eventTime: hoursFromNow(42) },
  { id: "e4", title: "Canada CPI (YoY)", country: "Canada", currency: "CAD", impact: "MEDIUM", forecast: "2.3%", previous: "2.4%", actual: "—", eventTime: hoursFromNow(30) },
  { id: "e5", title: "Australia Employment Change", country: "Australia", currency: "AUD", impact: "MEDIUM", forecast: "25.0K", previous: "21.1K", actual: "—", eventTime: hoursFromNow(50) },
  { id: "e6", title: "Japan Tokyo CPI (YoY)", country: "Japan", currency: "JPY", impact: "MEDIUM", forecast: "2.1%", previous: "2.2%", actual: "—", eventTime: hoursFromNow(8) },
  { id: "e7", title: "Switzerland SNB Sight Deposits", country: "Switzerland", currency: "CHF", impact: "LOW", forecast: "—", previous: "—", actual: "—", eventTime: hoursFromNow(12) },
  { id: "e8", title: "New Zealand Trade Balance", country: "New Zealand", currency: "NZD", impact: "LOW", forecast: "$0.15B", previous: "$0.09B", actual: "—", eventTime: hoursFromNow(36) },
  { id: "e9", title: "FOMC Member Speech", country: "United States", currency: "USD", impact: "MEDIUM", forecast: "—", previous: "—", actual: "—", eventTime: hoursFromNow(6) },
  { id: "e10", title: "ECB President Remarks", country: "Eurozone", currency: "EUR", impact: "HIGH", forecast: "—", previous: "—", actual: "—", eventTime: hoursFromNow(22) },
];

export const TESTIMONIALS = [
  { name: "Priya Menon", role: "Independent analyst", quote: "The probability framing and risk tools keep me disciplined. I treat every idea as education, not a command." },
  { name: "James Okonkwo", role: "Macro student", quote: "Charts, calendar, and lot sizing in one place. The disclaimer culture is exactly how analysis software should behave." },
  { name: "Elena Varga", role: "Desk researcher", quote: "Clean UI, fast quotes, and structured AI notes I can actually audit against the indicators." },
];

export const FAQS = [
  { q: "Does NexusFX place trades?", a: "No. This is an analysis and education platform. It never executes orders or connects to a broker for live trading." },
  { q: "Is this financial advice?", a: "No. Every page states that the application provides market analysis only and is not financial advice." },
  { q: "Where do prices come from?", a: "Quotes are aggregated from public FX and crypto endpoints when available, with a transparent simulated fallback so the UI always functions." },
  { q: "How are BUY / SELL / WAIT ideas generated?", a: "A rules-based engine scores trend, momentum, and volatility indicators. Outputs include confidence, invalidation (stop), and targets for study — not instructions to trade." },
  { q: "Can I use this on mobile?", a: "Yes. Layouts are responsive for desktop, tablet, and phone." },
];

export function sampleAnalysis(symbol: string, timeframe: string): AnalysisResult {
  return analyzeMarket(symbol, timeframe, generateCandles(symbol, 200, 60));
}

export const MARKET_UPDATES = [
  "EUR/USD consolidates ahead of US labor data — analysis only, not advice.",
  "Gold remains bid as real yields stabilize.",
  "USD/JPY tracks Treasury yield swings; BOJ event risk in focus.",
  "Cable sensitive to UK services inflation prints.",
];

export { DISCLAIMER };
