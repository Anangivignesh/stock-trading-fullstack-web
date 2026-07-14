import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard,
  LineChart,
  Briefcase,
  Star,
  Receipt,
  TrendingUp,
  Shield,
  LogOut,
  Menu,
  Bell,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { setSession, useSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Markets", url: "/stocks", icon: TrendingUp },
  { title: "Portfolio", url: "/portfolio", icon: Briefcase },
  { title: "Watchlist", url: "/watchlist", icon: Star },
  { title: "Transactions", url: "/transactions", icon: Receipt },
];

function AppSidebar() {
  const user = useSession();
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => currentPath === p || currentPath.startsWith(p + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5 font-display font-bold">
          <span className="grid place-items-center h-8 w-8 rounded-lg gradient-brand text-primary-foreground shrink-0">
            <LineChart className="h-4 w-4" />
          </span>
          <span className="group-data-[collapsible=icon]:hidden">SB Stocks</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Trading</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/admin")} tooltip="Admin panel">
                    <Link to="/admin">
                      <Shield />
                      <span>Admin panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-brand text-brand-foreground text-xs">
              {(user?.name ?? "SB").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate">{user?.name ?? "Guest"}</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email ?? "sign in"}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const navigate = useNavigate();
  const user = useSession();

  const logout = () => {
    setSession(null);
    navigate({ to: "/" });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-background/70 backdrop-blur sticky top-0 z-30">
            <div className="h-full px-3 sm:px-6 flex items-center gap-3">
              <SidebarTrigger>
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <div className={cn("hidden md:block font-display font-semibold text-lg truncate", !title && "opacity-0")}>
                {title ?? "."}
              </div>
              <div className="flex-1 flex justify-end items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search symbol..." className="pl-8 w-56" />
                </div>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                {user ? (
                  <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out">
                    <LogOut className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button asChild size="sm"><Link to="/login">Sign in</Link></Button>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {title && <h1 className="md:hidden text-2xl font-display font-bold mb-4">{title}</h1>}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
