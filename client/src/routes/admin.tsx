import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Pencil, Plus, Trash2, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PLBadge } from "@/components/common/PLBadge";
import { PriceChart } from "@/components/common/PriceChart";
import { STOCKS, fmtCurrency, type Stock } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — SB Stocks" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [stocks, setStocks] = useState<Stock[]>(STOCKS);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ symbol: "", name: "", sector: "Technology", price: "" });

  const add = () => {
    if (!draft.symbol || !draft.name || !draft.price) {
      toast.error("Fill all fields");
      return;
    }
    setStocks([{ symbol: draft.symbol.toUpperCase(), name: draft.name, sector: draft.sector, price: Number(draft.price), change: 0, changePct: 0, marketCap: "—", volume: "—", pe: 0, high52: Number(draft.price), low52: Number(draft.price) }, ...stocks]);
    setOpen(false);
    setDraft({ symbol: "", name: "", sector: "Technology", price: "" });
    toast.success("Stock added");
  };
  const remove = (sym: string) => {
    setStocks(stocks.filter((s) => s.symbol !== sym));
    toast.success(`${sym} removed`);
  };

  const stats = [
    { label: "Total users", value: "12,438", icon: Users, delta: 4.2 },
    { label: "Active traders (24h)", value: "3,204", icon: Activity, delta: 1.6 },
    { label: "Trades today", value: "18,921", icon: TrendingUp, delta: -0.9 },
    { label: "Listed stocks", value: `${stocks.length}`, icon: TrendingUp, delta: 0 },
  ];

  return (
    <AppShell title="Admin panel">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60"><CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-2xl font-display font-bold tabular-nums">{s.value}</p>
              </div>
              <div className="h-9 w-9 grid place-items-center rounded-lg bg-brand/10 text-brand"><s.icon className="h-4 w-4" /></div>
            </div>
            {s.delta !== 0 && <div className="mt-3"><PLBadge value={s.delta} /></div>}
          </CardContent></Card>
        ))}
      </div>

      <Card className="mt-6 border-border/60">
        <CardHeader><CardTitle>Platform activity</CardTitle></CardHeader>
        <CardContent><PriceChart symbol="ADMIN" positive /></CardContent>
      </Card>

      <Card className="mt-6 border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stock management</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add stock</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Add new stock</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Symbol</Label><Input value={draft.symbol} onChange={(e) => setDraft({ ...draft, symbol: e.target.value })} placeholder="TSLA" /></div>
                  <div className="space-y-1.5"><Label>Price</Label><Input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} /></div>
                </div>
                <div className="space-y-1.5"><Label>Company name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Sector</Label><Input value={draft.sector} onChange={(e) => setDraft({ ...draft, sector: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={add}>Add stock</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Symbol</th>
                  <th className="text-left font-medium">Company</th>
                  <th className="text-left font-medium">Sector</th>
                  <th className="text-right font-medium">Price</th>
                  <th className="text-right font-medium">Change</th>
                  <th className="text-right px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr key={s.symbol} className="border-b border-border/60 last:border-0">
                    <td className="py-3 px-4 font-mono font-semibold">{s.symbol}</td>
                    <td>{s.name}</td>
                    <td className="text-muted-foreground text-xs">{s.sector}</td>
                    <td className="text-right tabular-nums">{fmtCurrency(s.price)}</td>
                    <td className="text-right"><PLBadge value={s.changePct} /></td>
                    <td className="text-right px-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Edit form would open here")}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(s.symbol)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
