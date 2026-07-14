import React, { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PriceChart } from "../components/common/PriceChart";
import { PLBadge } from "../components/common/PLBadge";
import { fmtCurrency, getStock } from "../lib/mock-data";
import { useSession } from "../lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";

export default function PortfolioPage() {
  const session = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    };
    window.addEventListener("sb-portfolio-update", handleUpdate);
    return () => window.removeEventListener("sb-portfolio-update", handleUpdate);
  }, [queryClient]);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/profile');
      return res.data;
    },
    enabled: !!session?.token,
  });

  const { data: portfolio = { holdings: [], cashBalance: 100000 } } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const res = await axiosInstance.get('/portfolio');
      return res.data;
    },
    enabled: !!session?.token,
  });

  const holdings = portfolio.holdings || [];

  const formattedHoldings = holdings.map((h) => ({
    symbol: h.symbol,
    shares: h.count,
    avgCost: h.price,
  }));

  const cashBalance = portfolio.cashBalance ?? profile?.balance ?? session?.balance ?? 100000;

  const rows = formattedHoldings.map((h) => {
    const s = getStock(h.symbol) || { price: h.avgCost, change: 0, changePct: 0, name: h.symbol, symbol: h.symbol, sector: "Other" };
    const marketValue = s.price * h.shares;
    const cost = h.avgCost * h.shares;
    const pnl = marketValue - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return { ...h, stock: s, marketValue, cost, pnl, pnlPct };
  });

  const total = rows.reduce((a, r) => a + r.marketValue, 0);
  const totalCost = rows.reduce((a, r) => a + r.cost, 0);
  const totalPnl = total - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const colors = ["var(--chart-1)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-2)"];
  let cum = 0;
  const circumference = 2 * Math.PI * 42;
  const segments = rows.map((r, i) => {
    const frac = total > 0 ? r.marketValue / total : 0;
    const dash = frac * circumference;
    const seg = { offset: -cum * circumference, dash, color: colors[i % colors.length], label: r.symbol, pct: frac * 100 };
    cum += frac;
    return seg;
  });

  return (
    <AppShell title="Portfolio">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60"><CardContent className="p-5">
          <p className="text-xs text-muted-foreground">Total value</p>
          <p className="mt-1 text-2xl font-display font-bold tabular-nums">{fmtCurrency(total + cashBalance)}</p>
          <p className="mt-2 text-xs text-muted-foreground">Invested {fmtCurrency(total)} · Cash {fmtCurrency(cashBalance)}</p>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-5">
          <p className="text-xs text-muted-foreground">Total P&L</p>
          <p className={`mt-1 text-2xl font-display font-bold tabular-nums ${totalPnl >= 0 ? "text-success" : "text-danger"}`}>{fmtCurrency(totalPnl)}</p>
          <div className="mt-2"><PLBadge value={totalPnlPct} /></div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-5">
          <p className="text-xs text-muted-foreground">Positions</p>
          <p className="mt-1 text-2xl font-display font-bold">{rows.length}</p>
          <p className="mt-2 text-xs text-muted-foreground">Across {new Set(rows.map((r) => r.stock.sector)).size} sectors</p>
        </CardContent></Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
          <CardContent><PriceChart symbol="PORTFOLIO" positive={totalPnl >= 0} /></CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle>Allocation</CardTitle></CardHeader>
          <CardContent>
            {rows.length > 0 ? (
              <>
                <div className="flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-40 h-40 -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="12" />
                    {segments.map((s, i) => (
                      <circle key={i} cx="50" cy="50" r="42" fill="none" stroke={s.color} strokeWidth="12"
                        strokeDasharray={`${s.dash} ${circumference}`} strokeDashoffset={s.offset} />
                    ))}
                  </svg>
                </div>
                <div className="mt-4 space-y-2">
                  {segments.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                        <span className="font-mono">{s.label}</span>
                      </div>
                      <span className="tabular-nums text-muted-foreground">{s.pct.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-16">No positions to show allocation.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/60">
        <CardHeader><CardTitle>Holdings</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-2 font-medium">Symbol</th>
                  <th className="text-right font-medium">Shares</th>
                  <th className="text-right font-medium">Avg cost</th>
                  <th className="text-right font-medium">Price</th>
                  <th className="text-right font-medium">Value</th>
                  <th className="text-right font-medium">P&L</th>
                  <th className="text-right font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.symbol} className="border-b border-border/60 last:border-0">
                    <td className="py-3">
                      <Link to="/stocks/$symbol" params={{ symbol: r.symbol }} className="flex items-center gap-3 hover:text-brand">
                        <div className="h-8 w-8 rounded-md grid place-items-center bg-muted font-mono text-[10px] font-semibold">{r.symbol.slice(0, 2)}</div>
                        <div>
                          <p className="font-mono font-semibold">{r.symbol}</p>
                          <p className="text-xs text-muted-foreground">{r.stock.name}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="text-right tabular-nums">{r.shares}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{fmtCurrency(r.avgCost)}</td>
                    <td className="text-right tabular-nums">{fmtCurrency(r.stock.price)}</td>
                    <td className="text-right tabular-nums font-semibold">{fmtCurrency(r.marketValue)}</td>
                    <td className={`text-right tabular-nums ${r.pnl >= 0 ? "text-success" : "text-danger"}`}>{fmtCurrency(r.pnl)}</td>
                    <td className="text-right"><PLBadge value={r.pnlPct} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">You haven't opened any positions yet.</p>
              <Button asChild className="mt-4"><Link to="/stocks">Explore markets</Link></Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
