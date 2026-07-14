import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { fmtCurrency, type Stock } from "@/lib/mock-data";
import { useSession, setSession } from "@/lib/auth";
import axiosInstance from "../../services/axiosInstance";

export function TradeModal({
  stock,
  open,
  onOpenChange,
}: {
  stock: Stock | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [shares, setShares] = useState("1");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const session = useSession();

  if (!stock) return null;
  const qty = Math.max(0, Number(shares) || 0);
  const total = qty * stock.price;

  const submit = async () => {
    if (qty <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    if (!session) {
      toast.error("You must be logged in to trade");
      return;
    }

    try {
      const response = await axiosInstance.post('/orders', {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        count: qty,
        totalPrice: total,
        stockType: "delivery",
        orderType: side,
      });
      
      const data = response.data;

      // Update session balance
      setSession({
        ...session,
        balance: data.balance,
      });

      toast.success(`${side === "buy" ? "Bought" : "Sold"} ${qty} ${stock.symbol} @ ${fmtCurrency(stock.price)}`);
      onOpenChange(false);
      setShares("1");
      window.dispatchEvent(new Event("sb-portfolio-update"));
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Trade failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Trade {stock.symbol} <span className="text-muted-foreground font-normal">· {stock.name}</span>
          </DialogTitle>
        </DialogHeader>
        <Tabs value={side} onValueChange={(v) => setSide(v as "buy" | "sell")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value={side} className="space-y-4 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Market price</span>
              <span className="font-semibold tabular-nums">{fmtCurrency(stock.price)}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qty">Shares</Label>
              <Input id="qty" type="number" min={0} step={1} value={shares} onChange={(e) => setShares(e.target.value)} />
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated total</span>
              <span className="text-lg font-display font-semibold tabular-nums">{fmtCurrency(total)}</span>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className={side === "sell" ? "bg-danger text-danger-foreground hover:bg-danger/90" : ""}>
            {side === "buy" ? "Confirm buy" : "Confirm sell"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
