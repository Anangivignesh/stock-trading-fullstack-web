import React, { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, DollarSign, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { PriceChart } from "../components/common/PriceChart";
import { PLBadge } from "../components/common/PLBadge";
import { Sparkline } from "../components/common/Sparkline";
import { STOCKS, WATCHLIST, fmtCurrency, getStock } from "../lib/mock-data";
import { useSession } from "../lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";

export default function Dashboard() {
  const session = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosInstance.get('/orders');
      return res.data;
    },
    enabled: !!session?.token,
  });

  const formattedHoldings = holdings.map((h) => ({
    symbol: h.symbol,
    shares: h.count,
    avgCost: h.price,
  }));

  const formattedTransactions = orders.map((o) => ({
    id: o._id,
    date: new Date(o.createdAt).toLocaleDateString(),
    symbol: o.symbol,
    side: o.orderType.toUpperCase(),
    shares: o.count,
    price: o.price,
  }));

  const cashBalance = portfolio.cashBalance ?? profile?.balance ?? session?.balance ?? 100000;

  const holdingsWithMarket = formattedHoldings.map((h) => {
    const s = getStock(h.symbol) || { price: h.avgCost, change: 0, changePct: 0, name: h.symbol, symbol: h.symbol, sector: "Other" };
    const marketValue = s.price * h.shares;
    const cost = h.avgCost * h.shares;
    const pnl = marketValue - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return { ...h, stock: s, marketValue, cost, pnl, pnlPct };
  });

  const portfolioValue = holdingsWithMarket.reduce((a, h) => a + h.marketValue, 0);
  const totalCost = holdingsWithMarket.reduce((a, h) => a + h.cost, 0);
  const totalPnl = portfolioValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
  const netWorth = cashBalance + portfolioValue;

  const stats = [
    { label: "Portfolio value", value: fmtCurrency(netWorth), icon: Wallet, hint: <PLBadge value={totalPnlPct} /> },
    { label: "Cash balance", value: fmtCurrency(cashBalance), icon: DollarSign, hint: "Available to trade" },
    { label: "Invested", value: fmtCurrency(portfolioValue), icon: PiggyBank, hint: `${formattedHoldings.length} positions` },
    { label: "Today's P&L", value: fmtCurrency(totalPnl), icon: TrendingUp, hint: <PLBadge value={totalPnlPct} /> },
  ];

  return (
    <AppShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="mt-2 text-2xl font-display font-bold tabular-nums">{s.value}</p>
                </div>
                <div className="h-9 w-9 grid place-items-center rounded-lg bg-brand/10 text-brand">
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{s.hint}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Portfolio performance</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Last 90 days</p>
            </div>
            <Badge className="bg-success text-success-foreground gap-1"><ArrowUpRight className="h-3 w-3" /> +{totalPnlPct.toFixed(2)}%</Badge>
          </CardHeader>
          <CardContent>
            <PriceChart symbol="PORT" positive={totalPnl >= 0} />
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Watchlist</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/watchlist">View all</Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {WATCHLIST.slice(0, 5).map((sym) => {
              const s = getStock(sym);
              const positive = s.change >= 0;
              return (
                <Link key={sym} to="/stocks/$symbol" params={{ symbol: sym }} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg grid place-items-center bg-muted font-mono text-xs font-semibold shrink-0">{sym.slice(0, 2)}</div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-semibold">{sym}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Sparkline symbol={sym} positive={positive} width={60} height={24} />
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">{fmtCurrency(s.price)}</p>
                      <p className={`text-xs tabular-nums ${positive ? "text-success" : "text-danger"}`}>{positive ? "+" : ""}{s.changePct.toFixed(2)}%</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your holdings</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/portfolio">See portfolio</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b border-border">
                  <tr>
                    <th className="text-left py-2 font-medium">Symbol</th>
                    <th className="text-right font-medium">Shares</th>
                    <th className="text-right font-medium">Price</th>
                    <th className="text-right font-medium">Value</th>
                    <th className="text-right font-medium">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {holdingsWithMarket.map((h) => (
                    <tr key={h.symbol} className="border-b border-border/60 last:border-0">
                      <td className="py-3">
                        <Link to="/stocks/$symbol" params={{ symbol: h.symbol }} className="flex items-center gap-3 hover:text-brand">
                          <div className="h-8 w-8 rounded-md grid place-items-center bg-muted font-mono text-[10px] font-semibold">{h.symbol.slice(0, 2)}</div>
                          <div>
                            <p className="font-mono font-semibold">{h.symbol}</p>
                            <p className="text-xs text-muted-foreground">{h.stock.name}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="text-right tabular-nums">{h.shares}</td>
                      <td className="text-right tabular-nums">{fmtCurrency(h.stock.price)}</td>
                      <td className="text-right tabular-nums font-semibold">{fmtCurrency(h.marketValue)}</td>
                      <td className="text-right"><PLBadge value={h.pnlPct} /></td>
                    </tr>
                  ))}
                  {formattedHoldings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        You don't own any stocks yet. Go to <Link to="/stocks" className="text-brand hover:underline">Markets</Link> to start trading!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent activity</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/transactions">View all</Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {formattedTransactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Badge variant={t.side === "BUY" ? "default" : "destructive"} className={t.side === "BUY" ? "bg-success text-success-foreground" : ""}>{t.side}</Badge>
                  <div>
                    <p className="font-mono font-semibold">{t.symbol}</p>
                    <p className="text-xs text-muted-foreground">{t.date} · {t.shares} sh</p>
                  </div>
                </div>
                <p className="tabular-nums font-semibold">{fmtCurrency(t.shares * t.price)}</p>
              </div>
            ))}
            {formattedTransactions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="border-border/60">
          <CardHeader><CardTitle>Market movers</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[...STOCKS].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 4).map((s) => {
                const positive = s.change >= 0;
                return (
                  <Link key={s.symbol} to="/stocks/$symbol" params={{ symbol: s.symbol }} className="rounded-xl border border-border p-4 hover:border-brand/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-semibold">{s.symbol}</p>
                      <PLBadge value={s.changePct} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{s.name}</p>
                    <div className="mt-3 flex items-end justify-between">
                      <Sparkline symbol={s.symbol} positive={positive} />
                      <p className="text-lg font-display font-bold tabular-nums">{fmtCurrency(s.price)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
