import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, TrendingUp, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Sparkline } from "@/components/common/Sparkline";
import { STOCKS, fmtCurrency, fmtPct } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const featured = STOCKS.slice(0, 4);
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Sparkles className="h-3 w-3" /> New · Options paper trading beta
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.05] tracking-tight">
              Trade the market.<br />
              <span className="bg-clip-text text-transparent gradient-brand">Without the risk.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              SB Stocks gives you $100,000 in virtual funds to master real market movements — build portfolios, track P&L, and level up your strategy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/register">Start trading free <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/stocks">Explore markets</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div><span className="font-display font-bold text-2xl text-foreground">120K+</span><br />active traders</div>
              <div><span className="font-display font-bold text-2xl text-foreground">$2.4B</span><br />virtual volume</div>
              <div><span className="font-display font-bold text-2xl text-foreground">4.9★</span><br />app rating</div>
            </div>
          </div>

          {/* Hero visual: mock ticker cards */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 gradient-brand blur-3xl opacity-20 rounded-3xl" />
            <Card className="border-border/60 shadow-2xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Portfolio value</p>
                    <p className="text-3xl font-display font-bold tabular-nums">$127,842.19</p>
                  </div>
                  <Badge className="bg-success text-success-foreground gap-1"><TrendingUp className="h-3 w-3" /> +12.84%</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {featured.map((s) => {
                    const positive = s.change >= 0;
                    return (
                      <div key={s.symbol} className="rounded-xl border border-border p-3 bg-background/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm font-semibold">{s.symbol}</p>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[110px]">{s.name}</p>
                          </div>
                          <span className={`text-xs font-semibold ${positive ? "text-success" : "text-danger"}`}>{fmtPct(s.changePct)}</span>
                        </div>
                        <div className="mt-2 flex items-end justify-between">
                          <Sparkline symbol={s.symbol} positive={positive} width={80} height={28} />
                          <p className="text-sm font-semibold tabular-nums">{fmtCurrency(s.price)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand uppercase tracking-wider">Why SB Stocks</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold">Everything you need to trade smarter.</h2>
            <p className="mt-3 text-muted-foreground">A polished simulator that mirrors real markets — so when you go live, you're ready.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BarChart3, title: "Live-style dashboards", body: "Track holdings, allocation, and P&L across every position in one clean view." },
              { icon: Wallet, title: "Virtual funds", body: "Start with $100,000 in paper cash and grow your account with confidence." },
              { icon: Zap, title: "Instant execution", body: "Mock market orders fill instantly so you can focus on strategy, not latency." },
              { icon: ShieldCheck, title: "Risk-free learning", body: "Test aggressive positions and long-tail bets without ever losing real money." },
              { icon: TrendingUp, title: "Watchlists & alerts", body: "Curate the tickers that matter and never miss a breakout." },
              { icon: Sparkles, title: "Beautiful UI", body: "A premium fintech interface that makes trading feel effortless." },
            ].map((f) => (
              <Card key={f.title} className="border-border/60 hover:border-brand/50 transition-colors">
                <CardContent className="p-6">
                  <div className="h-10 w-10 grid place-items-center rounded-lg gradient-brand text-primary-foreground mb-4">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-center">Start trading in 3 steps</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Create your account", d: "Sign up in seconds — no card, no risk." },
              { n: "02", t: "Fund with virtual cash", d: "You start with $100K to invest across our markets." },
              { n: "03", t: "Trade and track", d: "Buy, sell, watch. Learn how your strategy performs over time." },
            ].map((s) => (
              <Card key={s.n} className="border-border/60">
                <CardContent className="p-6">
                  <p className="font-display font-bold text-4xl bg-clip-text text-transparent gradient-brand">{s.n}</p>
                  <h3 className="mt-3 font-semibold text-lg">{s.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Card className="border-border/60 overflow-hidden">
            <CardContent className="p-10 sm:p-14 gradient-hero text-center">
              <h2 className="text-3xl sm:text-4xl font-display font-bold">Free forever. No card required.</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Everything you need to master trading — completely free while we're in beta.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg"><Link to="/register">Create free account</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/login">I have an account</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </MarketingLayout>
  );
}
