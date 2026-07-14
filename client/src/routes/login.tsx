import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LineChart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — SB Stocks" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    if (password.length < 6) errs.password = "At least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    login(email, password)
      .then(() => {
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      })
      .catch((err) => {
        toast.error(err.message || "Invalid email or password");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 gradient-hero border-r border-border">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <span className="grid place-items-center h-8 w-8 rounded-lg gradient-brand text-primary-foreground">
            <LineChart className="h-4 w-4" />
          </span>
          SB Stocks
        </Link>
        <div className="max-w-md">
          <h2 className="text-3xl font-display font-bold">Welcome back, trader.</h2>
          <p className="mt-3 text-muted-foreground">Pick up where you left off — your portfolio is waiting.</p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SB Stocks</p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-md border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Sign in</CardTitle>
            <CardDescription>Access your paper trading account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-invalid={!!errors.email} />
                {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-brand hover:underline">Forgot?</a>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" aria-invalid={!!errors.password} />
                {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign in
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Tip: use an email containing "admin" to explore the admin panel.
              </p>
              <p className="text-sm text-center text-muted-foreground">
                No account? <Link to="/register" className="text-brand font-medium hover:underline">Create one</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
