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
  { title: "System Console", icon: Radar, to: "/dashboard", ready: true },
  { title: "Blog Engine", icon: FileText, to: "/dashboard/blog-engine", ready: true },
  { title: "Calendar", icon: CalendarDays, to: "/dashboard", ready: false },
  { title: "Keyword Planner", icon: Search, to: "/dashboard", ready: false },
  { title: "Settings", icon: Settings, to: "/dashboard", ready: false },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-14 shrink-0 items-center border-b border-border px-5">
        <Logo />
      </div>
      <p className="px-5 pb-1 pt-4 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        Workspace
      </p>
      <nav className="flex-1 space-y-1 p-3 pt-1">
        {NAV.map((item) =>
          item.ready ? (
            <Link
              key={item.title}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                path === item.to
                  ? "bg-ink text-background shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-ink",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          ) : (
            <button
              key={item.title}
              type="button"
              disabled
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/50"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
              <span className="ml-auto rounded-full border border-border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground/60">
                soon
              </span>
            </button>
          ),
        )}
      </nav>
    </aside>
  );
}