import { Link, useRouterState } from "@tanstack/react-router";
import {
  Radar,
  FileText,
  CalendarDays,
  Search,
  CreditCard,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/landing/shared";
import { cn } from "@/lib/utils";

const NAV = [
  { title: "System Console", icon: Radar, to: "/dashboard", exact: true },
  { title: "Blog Engine", icon: FileText, to: "/dashboard/blog-engine" },
  { title: "Calendar", icon: CalendarDays, to: "/dashboard/calendar" },
  { title: "Keyword Planner", icon: Search, to: "/dashboard/keywords" },
  { title: "Billing", icon: CreditCard, to: "/dashboard/billing" },
  { title: "Settings", icon: Settings, to: "/dashboard/settings" },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(`${to}/`);
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-14 shrink-0 items-center border-b border-border px-5">
        <Logo />
      </div>
      <p className="px-5 pb-1 pt-4 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        Workspace
      </p>
      <nav className="flex-1 space-y-1 p-3 pt-1">
        {NAV.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive(item.to, item.exact)
                ? "bg-ink text-background shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-ink",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}