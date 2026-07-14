import React, { useMemo, useState, useEffect } from "react";
import { Download, Search } from "lucide-react";
import { AppShell } from "../components/layout/AppShell";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { fmtCurrency } from "../lib/mock-data";
import { useSession } from "../lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";

export default function TransactionsPage() {
  const session = useSession();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };
    window.addEventListener("sb-portfolio-update", handleUpdate);
    return () => window.removeEventListener("sb-portfolio-update", handleUpdate);
  }, [queryClient]);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosInstance.get('/orders');
      return res.data;
    },
    enabled: !!session?.token,
  });

  const formattedTransactions = orders.map((o) => ({
    id: o._id,
    date: new Date(o.createdAt).toLocaleDateString(),
    symbol: o.symbol,
    side: o.orderType.toUpperCase(),
    shares: o.count,
    price: o.price,
  }));

  const rows = useMemo(() =>
    formattedTransactions.filter((t) => (filter === "all" || t.side === filter) && (!q || t.symbol.toLowerCase().includes(q.toLowerCase()))),
    [formattedTransactions, filter, q]
  );

  return (
    <AppShell title="Transactions">
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search symbol..." className="pl-9" />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="BUY">Buys</TabsTrigger>
              <TabsTrigger value="SELL">Sells</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
        </CardContent>
      </Card>

      <Card className="mt-6 border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left font-medium">Symbol</th>
                  <th className="text-left font-medium">Side</th>
                  <th className="text-right font-medium">Shares</th>
                  <th className="text-right font-medium">Price</th>
                  <th className="text-right px-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 px-4 text-muted-foreground">{t.date}</td>
                    <td className="font-mono font-semibold">{t.symbol}</td>
                    <td><Badge className={t.side === "BUY" ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground"}>{t.side}</Badge></td>
                    <td className="text-right tabular-nums">{t.shares}</td>
                    <td className="text-right tabular-nums">{fmtCurrency(t.price)}</td>
                    <td className="text-right px-4 tabular-nums font-semibold">{fmtCurrency(t.shares * t.price)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">No transactions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
