import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkline } from "@/components/common/Sparkline";
import { PLBadge } from "@/components/common/PLBadge";
import { TradeModal } from "@/components/trade/TradeModal";
import { STOCKS, SECTORS, fmtCurrency, type Stock } from "@/lib/mock-data";

export const Route = createFileRoute("/stocks/")({
  head: () => ({ meta: [{ title: "Markets — SB Stocks" }] }),
  component: StocksIndex,
});

function StocksIndex() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("all");
  const [trend, setTrend] = useState<string>("all");
  const [tradeStock, setTradeStock] = useState<Stock | null>(null);

  const filtered = useMemo(() => {
    return STOCKS.filter((s) => {
      if (sector !== "all" && s.sector !== sector) return false;
      if (trend === "up" && s.change < 0) return false;
      if (trend === "down" && s.change >= 0) return false;
      if (q && !`${s.symbol} ${s.name}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, sector, trend]);

  return (
    <AppShell title="Markets">
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by symbol or company..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sector" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sectors</SelectItem>
                {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={trend} onValueChange={setTrend}>
              <SelectTrigger className="w-[140px]"><SlidersHorizontal className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All trends</SelectItem>
                <SelectItem value="up">Gainers</SelectItem>
                <SelectItem value="down">Losers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Desktop table */}
      <Card className="mt-6 border-border/60 hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Symbol</th>
                  <th className="text-left font-medium">Sector</th>
                  <th className="text-right font-medium">Price</th>
                  <th className="text-right font-medium">Change</th>
                  <th className="text-right font-medium">Market cap</th>
                  <th className="text-center font-medium">Trend</th>
                  <th className="text-right px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const positive = s.change >= 0;
                  return (
                    <tr key={s.symbol} className="border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4">
                        <Link to="/stocks/$symbol" params={{ symbol: s.symbol }} className="flex items-center gap-3 hover:text-brand">
                          <div className="h-9 w-9 rounded-lg grid place-items-center bg-muted font-mono text-xs font-semibold">{s.symbol.slice(0, 2)}</div>
                          <div>
                            <p className="font-mono font-semibold">{s.symbol}</p>
                            <p className="text-xs text-muted-foreground">{s.name}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="text-xs text-muted-foreground">{s.sector}</td>
                      <td className="text-right tabular-nums font-semibold">{fmtCurrency(s.price)}</td>
                      <td className="text-right"><PLBadge value={s.changePct} /></td>
                      <td className="text-right tabular-nums text-muted-foreground">${s.marketCap}</td>
                      <td><div className="flex justify-center"><Sparkline symbol={s.symbol} positive={positive} width={90} height={28} /></div></td>
                      <td className="text-right px-4">
                        <Button size="sm" onClick={() => setTradeStock(s)}>Trade</Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-16 text-center text-muted-foreground">No stocks match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile cards */}
      <div className="mt-6 grid gap-3 md:hidden">
        {filtered.map((s) => {
          const positive = s.change >= 0;
          return (
            <Card key={s.symbol} className="border-border/60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link to="/stocks/$symbol" params={{ symbol: s.symbol }} className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg grid place-items-center bg-muted font-mono text-xs font-semibold shrink-0">{s.symbol.slice(0, 2)}</div>
                    <div className="min-w-0">
                      <p className="font-mono font-semibold">{s.symbol}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.name}</p>
                    </div>
                  </Link>
                  <PLBadge value={s.changePct} />
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <Sparkline symbol={s.symbol} positive={positive} />
                  <p className="text-lg font-display font-bold tabular-nums">{fmtCurrency(s.price)}</p>
                </div>
                <Button size="sm" className="w-full mt-3" onClick={() => setTradeStock(s)}>Trade</Button>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="border-border/60"><CardContent className="py-16 text-center text-muted-foreground">No stocks match your filters.</CardContent></Card>
        )}
      </div>

      <TradeModal stock={tradeStock} open={!!tradeStock} onOpenChange={(o) => !o && setTradeStock(null)} />
    </AppShell>
  );
}
