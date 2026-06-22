import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/landing/shared";
import { cn } from "@/lib/utils";
import { NAV, NAV_FOOTER, type NavItem } from "./nav";

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(`${to}/`);

  const renderItem = (item: NavItem) => {
    const active = isActive(item.to, item.exact);
    return (
      <Link
        key={item.title}
        to={item.to}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[0.8rem] font-medium transition-colors",
          active
            ? "bg-secondary text-ink"
            : "text-muted-foreground hover:bg-secondary/60 hover:text-ink",
        )}
      >
        <item.icon
          className={cn("h-4 w-4 shrink-0", active ? "text-ink" : "text-muted-foreground")}
        />
        {item.title}
      </Link>
    );
  };

  return (
    <aside className="hidden w-60 shrink-0 flex-col overflow-hidden border-r border-border bg-card md:flex">
      <div className="flex h-14 shrink-0 items-center px-5">
        <Logo />
      </div>
      <p className="px-5 pb-1.5 pt-4 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Your Workspace
      </p>
      <nav className="flex-1 space-y-px px-3 pt-1">{NAV.map(renderItem)}</nav>
      <div className="border-t border-border px-3 py-3">
        <div className="space-y-0.5">{NAV_FOOTER.map(renderItem)}</div>
      </div>
    </aside>
  );
}