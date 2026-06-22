import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/landing/shared";
import { cn } from "@/lib/utils";
import { NAV, NAV_FOOTER, type NavItem } from "./nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(`${to}/`);

  const renderItem = (item: NavItem) => {
    const active = isActive(item.to, item.exact);
    return (
      <Link
        key={item.title}
        to={item.to}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-secondary text-ink"
            : "text-muted-foreground hover:bg-secondary/60 hover:text-ink",
        )}
      >
        <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-ink" : "text-muted-foreground")} />
        {item.title}
      </Link>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-ink transition-colors hover:bg-secondary md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 overflow-hidden p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-14 items-center border-b border-border px-5">
          <Logo />
        </div>
        <p className="px-5 pb-1.5 pt-5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Your Workspace
        </p>
        <nav className="space-y-0.5 px-3 pt-1">{NAV.map(renderItem)}</nav>
        <div className="mt-3 border-t border-border px-3 py-3">
          <div className="space-y-0.5">{NAV_FOOTER.map(renderItem)}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
