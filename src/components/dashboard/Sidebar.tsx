import { Link, useRouterState } from "@tanstack/react-router";
import {
  Radar,
  FileText,
  CalendarDays,
  Search,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/landing/shared";
import { cn } from "@/lib/utils";

const NAV = [
  { title: "System Console", to: "/dashboard", icon: Radar, exact: true },
  { title: "Blog Engine", to: "/dashboard/blogs", icon: FileText },
  { title: "Calendar", to: "/dashboard/calendar", icon: CalendarDays },
  { title: "Keyword Planner", to: "/dashboard/keywords", icon: Search },
  { title: "Settings", to: "/dashboard/settings", icon: Settings },
] as const;

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-14 items-center border-b border-border px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = item.exact
            ? path === item.to
            : path.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-ink text-background"
                  : "text-muted-foreground hover:bg-secondary hover:text-ink",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}