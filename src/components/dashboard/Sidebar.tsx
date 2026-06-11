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
  { title: "System Console", icon: Radar, ready: true },
  { title: "Blog Engine", icon: FileText, ready: false },
  { title: "Calendar", icon: CalendarDays, ready: false },
  { title: "Keyword Planner", icon: Search, ready: false },
  { title: "Settings", icon: Settings, ready: false },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-14 items-center border-b border-border px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) =>
          item.ready ? (
            <Link
              key={item.title}
              to="/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                path === "/dashboard"
                  ? "bg-ink text-background"
                  : "text-muted-foreground hover:bg-secondary hover:text-ink",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ) : (
            <button
              key={item.title}
              type="button"
              disabled
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/50"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
              <span className="ml-auto text-[10px] uppercase tracking-wide">soon</span>
            </button>
          ),
        )}
      </nav>
    </aside>
  );
}