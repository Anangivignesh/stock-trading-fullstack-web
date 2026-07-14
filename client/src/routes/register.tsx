import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LineChart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { register } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — SB Stocks" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.password.length < 6) errs.password = "At least 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords don't match";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    register(form.name, form.email, form.password)
      .then(() => {
        toast.success("Account created — welcome!");
        navigate({ to: "/dashboard" });
      })
      .catch((err) => {
        toast.error(err.message || "Registration failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center p-6 sm:p-10 order-2 lg:order-1">
        <Card className="w-full max-w-md border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Create your account</CardTitle>
            <CardDescription>Start with $100,000 in virtual cash</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={form.name} onChange={set("name")} placeholder="Jordan Trader" />
                {errors.name && <p className="text-xs text-danger">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
                {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={form.password} onChange={set("password")} />
                  {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirm</Label>
                  <Input id="confirm" type="password" value={form.confirm} onChange={set("confirm")} />
                  {errors.confirm && <p className="text-xs text-danger">{errors.confirm}</p>}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create account
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have one? <Link to="/login" className="text-brand font-medium hover:underline">Sign in</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:flex flex-col justify-between p-10 gradient-hero border-l border-border order-1 lg:order-2">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <span className="grid place-items-center h-8 w-8 rounded-lg gradient-brand text-primary-foreground">
            <LineChart className="h-4 w-4" />
          </span>
          SB Stocks
        </Link>
        <div className="max-w-md">
          <h2 className="text-3xl font-display font-bold">Level up your trading.</h2>
          <p className="mt-3 text-muted-foreground">Practice real market conditions with zero downside.</p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SB Stocks</p>
      </div>
    </div>
  );
}
