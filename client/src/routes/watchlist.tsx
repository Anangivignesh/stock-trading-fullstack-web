import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, StarOff, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/common/Sparkline";
import { PLBadge } from "@/components/common/PLBadge";
import { TradeModal } from "@/components/trade/TradeModal";
import { WATCHLIST, getStock, fmtCurrency, type Stock } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/watchlist")({
  head: () => ({ meta: [{ title: "Watchlist — SB Stocks" }] }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const [list, setList] = useState<string[]>(WATCHLIST);
  const [trade, setTrade] = useState<Stock | null>(null);
  const remove = (sym: string) => {
    setList(list.filter((s) => s !== sym));
    toast.success(`${sym} removed from watchlist`);
  };

  return (
    <AppShell title="Watchlist">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">Track the tickers you care about.</p>
        <Button asChild size="sm"><Link to="/stocks"><Plus className="h-4 w-4 mr-1" /> Add stock</Link></Button>
      </div>

      {list.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-20 text-center">
            <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-muted">
              <StarOff className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 font-display font-semibold text-lg">Your watchlist is empty</p>
            <p className="text-sm text-muted-foreground">Add stocks to follow their price movements.</p>
            <Button asChild className="mt-6"><Link to="/stocks">Browse markets</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((sym) => {
            const s = getStock(sym)!;
            const positive = s.change >= 0;
            return (
              <Card key={sym} className="border-border/60">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link to="/stocks/$symbol" params={{ symbol: sym }} className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg grid place-items-center bg-muted font-mono text-xs font-semibold shrink-0">{sym.slice(0, 2)}</div>
                      <div className="min-w-0">
                        <p className="font-mono font-semibold">{sym}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.name}</p>
                      </div>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => remove(sym)} aria-label="Remove">
                      <Star className="h-4 w-4 fill-brand text-brand" />
                    </Button>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-xl font-display font-bold tabular-nums">{fmtCurrency(s.price)}</p>
                      <PLBadge value={s.changePct} className="mt-1" />
                    </div>
                    <Sparkline symbol={sym} positive={positive} />
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-4" onClick={() => setTrade(s)}>Trade</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <TradeModal stock={trade} open={!!trade} onOpenChange={(o) => !o && setTrade(null)} />
    </AppShell>
  );
}
