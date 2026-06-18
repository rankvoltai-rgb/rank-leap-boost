import { Logo, BrandMark } from "./shared";
import {
  Zap,
  FileText,
  Link2,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const NAV_GENERAL = ["Dashboard", "Articles", "Backlinks", "Settings"];
const NAV_SUPPORT = ["Ask Rankvolt", "Help Center"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const QUEUED = [
  { t: "Best Espresso Machines for Small Cafes in 2026", k: "best espresso machines for cafes", v: "12,300" },
  { t: "How to Choose Coffee Beans: A Complete Guide", k: "how to choose coffee beans", v: "8,100" },
  { t: "Cold Brew vs Iced Coffee: What's the Difference", k: "cold brew vs iced coffee", v: "5,900" },
  { t: "Top 10 Latte Art Techniques for Beginners", k: "latte art techniques beginners", v: "3,400" },
  { t: "Coffee Shop Marketing Ideas That Actually Work", k: "coffee shop marketing ideas", v: "2,900" },
  { t: "How to Start a Coffee Subscription Service", k: "coffee subscription business", v: "4,200" },
  { t: "Best Milk Alternatives for Coffee Shops", k: "milk alternatives coffee", v: "6,700" },
];

export function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevation-lg ring-1 ring-ink/5">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-surface/70 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-0.5 text-[0.6rem] font-medium text-muted-foreground">
          app.rankvolt.com/dashboard
        </span>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-surface/60 p-4 md:flex">
          <Logo className="mb-6" />
          <p className="px-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            General
          </p>
          <div className="mt-2 flex flex-col gap-0.5">
            {NAV_GENERAL.map((n, i) => (
              <span
                key={n}
                className={`rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-ink text-background shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {n}
              </span>
            ))}
          </div>
          <p className="mt-5 px-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Support
          </p>
          <div className="mt-2 flex flex-col gap-0.5">
            {NAV_SUPPORT.map((n) => (
              <span key={n} className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground">
                {n}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-3 pt-6 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-warning" /> 27
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-info" /> 120
            </span>
            <span className="flex items-center gap-1">
              <Link2 className="h-3.5 w-3.5 text-success" /> 3
            </span>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">Dashboard</span>
              <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">Today</span>
              <span className="text-xs text-muted-foreground">February 2026</span>
            </div>
            <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
              ● Calendar Guide
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Next generation in:{" "}
              <span className="font-semibold text-ink">04:32:17</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-muted-foreground">
              <BrandMark name="WordPress" className="h-4 w-4 text-[0.6rem]" /> WordPress
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-success" /> Domain Rating:{" "}
              <span className="font-semibold text-ink">42</span>
            </span>
            <span className="ml-auto hidden gap-2 sm:flex">
              <span className="rounded-md border border-border px-2 py-1 text-muted-foreground">7 queued</span>
              <span className="rounded-md border border-border px-2 py-1 text-info">● 0 generating</span>
              <span className="rounded-md border border-border px-2 py-1 text-success">● 0 published</span>
            </span>
          </div>

          {/* Calendar */}
          <div className="mt-4 grid grid-cols-7 gap-1.5 text-[0.6rem] font-medium text-muted-foreground">
            {DAYS.map((d) => (
              <div key={d} className="px-1">{d}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1.5">
            {QUEUED.map((a, i) => (
              <div
                key={i}
                className="flex min-h-[112px] flex-col rounded-lg border border-border bg-surface/50 p-1.5 transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-sm"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[0.55rem] font-semibold text-background">
                    {i + 1}
                  </span>
                </div>
                <span className="mb-1 w-fit rounded bg-secondary px-1 py-0.5 text-[0.5rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  Queued
                </span>
                <p className="line-clamp-2 text-[0.6rem] font-semibold leading-tight text-ink">{a.t}</p>
                <p className="mt-0.5 line-clamp-1 text-[0.55rem] text-muted-foreground">{a.k}</p>
                <p className="mt-auto flex items-center gap-1 pt-1 text-[0.55rem] font-medium text-muted-foreground">
                  <BarChart3 className="h-3 w-3 text-info" /> {a.v}/mo
                </p>
              </div>
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={`e${i}`}
                className="min-h-[112px] rounded-lg border border-dashed border-border/60 p-1.5 text-[0.55rem] text-muted-foreground"
              >
                {i + 8}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}