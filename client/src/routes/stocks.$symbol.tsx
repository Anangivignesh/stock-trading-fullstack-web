import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceChart } from "@/components/common/PriceChart";
import { PLBadge } from "@/components/common/PLBadge";
import { TradeModal } from "@/components/trade/TradeModal";
import { getStock, fmtCurrency } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/stocks/$symbol")({
  loader: ({ params }) => {
    const stock = getStock(params.symbol);
    if (!stock) throw notFound();
    return { stock };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.stock.symbol} — SB Stocks` : "Stock — SB Stocks" }],
  }),
  notFoundComponent: () => (
    <AppShell title="Not found">
      <Card><CardContent className="py-16 text-center">
        <p className="text-muted-foreground">Symbol not found.</p>
        <Button asChild className="mt-4"><Link to="/stocks">Back to markets</Link></Button>
      </CardContent></Card>
    </AppShell>
  ),
  component: StockDetail,
});

function StockDetail() {
  const { stock } = Route.useLoaderData();
  const [openTrade, setOpenTrade] = useState(false);
  const [range, setRange] = useState("1M");
  const positive = stock.change >= 0;

  const stats = [
    { label: "Open", value: fmtCurrency(stock.price - stock.change) },
    { label: "Volume", value: stock.volume },
    { label: "Market cap", value: `$${stock.marketCap}` },
    { label: "P/E ratio", value: stock.pe.toFixed(2) },
    { label: "52w high", value: fmtCurrency(stock.high52) },
    { label: "52w low", value: fmtCurrency(stock.low52) },
  ];

  return (
    <AppShell>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/stocks"><ArrowLeft className="h-4 w-4 mr-1" /> Markets</Link>
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="h-14 w-14 rounded-xl grid place-items-center bg-muted font-mono text-sm font-bold shrink-0">{stock.symbol.slice(0, 2)}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-display font-bold">{stock.symbol}</h1>
              <Badge variant="secondary">{stock.sector}</Badge>
            </div>
            <p className="text-muted-foreground truncate">{stock.name}</p>
            <div className="mt-2 flex items-baseline gap-3 flex-wrap">
              <p className="text-3xl sm:text-4xl font-display font-bold tabular-nums">{fmtCurrency(stock.price)}</p>
              <PLBadge value={stock.changePct} />
              <span className={`text-sm tabular-nums ${positive ? "text-success" : "text-danger"}`}>
                {positive ? "+" : ""}{stock.change.toFixed(2)} today
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" onClick={() => toast.success(`${stock.symbol} added to watchlist`)}>
            <Star className="h-4 w-4 mr-2" /> Watch
          </Button>
          <Button onClick={() => setOpenTrade(true)}>Trade</Button>
        </div>
      </div>

      <Card className="mt-6 border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Price chart</CardTitle>
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((r) => (
                <TabsTrigger key={r} value={r}>{r}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <PriceChart symbol={stock.symbol + range} positive={positive} />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader><CardTitle>Key statistics</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">{s.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle>About</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>{stock.name} operates in the {stock.sector.toLowerCase()} sector.</p>
            <p>Simulated data shown for paper trading practice. Not financial advice.</p>
          </CardContent>
        </Card>
      </div>

      <TradeModal stock={stock} open={openTrade} onOpenChange={setOpenTrade} />
    </AppShell>
  );
}
