export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  marketCap: string;
  volume: string;
  pe: number;
  high52: number;
  low52: number;
};

export const STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", price: 227.14, change: 2.31, changePct: 1.03, marketCap: "3.45T", volume: "48.2M", pe: 34.1, high52: 240.12, low52: 164.08 },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", price: 429.82, change: -1.98, changePct: -0.46, marketCap: "3.19T", volume: "22.9M", pe: 36.4, high52: 468.35, low52: 309.45 },
  { symbol: "NVDA", name: "NVIDIA Corp.", sector: "Semiconductors", price: 138.44, change: 4.12, changePct: 3.07, marketCap: "3.40T", volume: "210.5M", pe: 68.2, high52: 152.89, low52: 45.61 },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Communication", price: 176.29, change: 0.84, changePct: 0.48, marketCap: "2.18T", volume: "18.4M", pe: 25.6, high52: 191.75, low52: 121.46 },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", price: 189.71, change: -0.62, changePct: -0.33, marketCap: "1.99T", volume: "31.0M", pe: 43.2, high52: 201.20, low52: 118.35 },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", price: 248.98, change: 6.42, changePct: 2.65, marketCap: "793.4B", volume: "88.1M", pe: 71.9, high52: 299.29, low52: 138.80 },
  { symbol: "META", name: "Meta Platforms", sector: "Communication", price: 512.44, change: -3.11, changePct: -0.60, marketCap: "1.30T", volume: "14.2M", pe: 27.4, high52: 542.81, low52: 279.40 },
  { symbol: "JPM", name: "JPMorgan Chase", sector: "Financial Services", price: 214.55, change: 1.09, changePct: 0.51, marketCap: "612.4B", volume: "8.9M", pe: 12.3, high52: 225.48, low52: 135.19 },
  { symbol: "V", name: "Visa Inc.", sector: "Financial Services", price: 278.11, change: 0.44, changePct: 0.16, marketCap: "552.1B", volume: "5.6M", pe: 30.9, high52: 290.96, low52: 227.68 },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Communication", price: 704.20, change: -8.55, changePct: -1.20, marketCap: "302.5B", volume: "3.4M", pe: 44.1, high52: 736.20, low52: 344.73 },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Semiconductors", price: 158.33, change: 2.88, changePct: 1.85, marketCap: "256.1B", volume: "42.7M", pe: 152.8, high52: 227.30, low52: 93.11 },
  { symbol: "DIS", name: "Walt Disney Co.", sector: "Communication", price: 94.72, change: -0.31, changePct: -0.33, marketCap: "172.9B", volume: "9.8M", pe: 39.6, high52: 123.74, low52: 82.03 },
];

export const SECTORS = Array.from(new Set(STOCKS.map((s) => s.sector))).sort();

export type Holding = { symbol: string; shares: number; avgCost: number };
export const HOLDINGS: Holding[] = [
  { symbol: "AAPL", shares: 25, avgCost: 189.4 },
  { symbol: "NVDA", shares: 40, avgCost: 98.2 },
  { symbol: "MSFT", shares: 10, avgCost: 402.5 },
  { symbol: "TSLA", shares: 15, avgCost: 220.1 },
  { symbol: "V", shares: 12, avgCost: 254.0 },
];

export type Txn = {
  id: string;
  date: string;
  symbol: string;
  side: "BUY" | "SELL";
  shares: number;
  price: number;
};
export const TRANSACTIONS: Txn[] = [
  { id: "t1", date: "2026-07-11", symbol: "NVDA", side: "BUY", shares: 10, price: 134.22 },
  { id: "t2", date: "2026-07-10", symbol: "AAPL", side: "BUY", shares: 5, price: 224.88 },
  { id: "t3", date: "2026-07-08", symbol: "TSLA", side: "SELL", shares: 4, price: 244.15 },
  { id: "t4", date: "2026-07-05", symbol: "MSFT", side: "BUY", shares: 2, price: 421.44 },
  { id: "t5", date: "2026-07-01", symbol: "V", side: "BUY", shares: 6, price: 271.10 },
  { id: "t6", date: "2026-06-28", symbol: "NVDA", side: "BUY", shares: 15, price: 121.09 },
];

export const WATCHLIST = ["META", "AMD", "GOOGL", "NFLX", "AMZN"];

export const STARTING_CASH = 25_430.55;

export function getStock(symbol: string): Stock | undefined {
  return STOCKS.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
}

export function fmtCurrency(n: number, opts: Intl.NumberFormatOptions = {}) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2, ...opts });
}
export function fmtPct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

// Deterministic mini sparkline series (pseudo-random from symbol)
export function sparkline(symbol: string, points = 40, base = 100) {
  const seed = [...symbol].reduce((a, c) => a + c.charCodeAt(0), 0);
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    const r = Math.sin(seed + i * 1.3) * 0.5 + Math.sin(seed * 0.7 + i * 0.4);
    v += r * (base * 0.012);
    out.push(v);
  }
  return out;
}
