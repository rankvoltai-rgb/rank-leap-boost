/**
 * The window's sidebar: the sample site, the dashboard's own navigation
 * (labels and icons from components/dashboard/nav), and the three recent
 * runs. A recent run is a real button: clicking one plays it.
 *
 * Rows are 32px with 13/18 medium labels, as in the reference.
 */
import { memo } from "react";
import {
  ChevronDown,
  ChevronsUpDown,
  FileText,
  HelpCircle,
  Inbox,
  PanelLeft,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV } from "@/components/dashboard/nav";
import { RUNS, SIDEBAR_W, SITE } from "./script";

const ROW =
  "flex h-8 w-full items-center gap-2.5 rounded-lg px-2 text-[13px] font-medium leading-[18px]";

export const Sidebar = memo(function Sidebar({
  run,
  queue,
  onPick,
}: {
  run: number;
  queue: number;
  onPick: (run: number) => void;
}) {
  return (
    <aside
      className="flex h-full shrink-0 flex-col border-r border-ink/[0.07] bg-[#fafafb] px-3 pb-3 pt-3"
      style={{ width: SIDEBAR_W }}
    >
      <div className="flex h-8 items-center justify-between px-2">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] text-[10px] font-bold leading-none text-white"
            style={{ backgroundColor: SITE.color }}
          >
            {SITE.initial}
          </span>
          <span className="truncate text-[13px] font-semibold leading-[18px] text-ink">
            {SITE.name}
          </span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={2} />
        </span>
        <Inbox className="h-4 w-4 shrink-0 text-ink/55" strokeWidth={1.75} />
      </div>

      <ul className="mt-3 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const on = item.title === "Articles";
          return (
            <li
              key={item.title}
              className={cn(ROW, on ? "bg-ink/[0.055] text-ink" : "text-ink/80")}
            >
              <Icon className={cn("h-4 w-4 shrink-0", on ? "text-cta" : "text-ink/50")} />
              <span className="flex-1">{item.title}</span>
              {item.showsQueueCount && (
                <span className="text-[12px] font-medium tabular-nums text-muted-foreground">
                  {queue}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex h-6 items-center justify-between px-2 text-muted-foreground">
        <span className="flex items-center gap-1 text-[12px] font-medium leading-[18px]">
          Recent
          <ChevronDown className="h-3 w-3" strokeWidth={2} />
        </span>
        <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
      </div>
      <ul className="mt-1 space-y-0.5">
        {RUNS.map((r, i) => {
          const on = i === run;
          return (
            <li key={r.id}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => onPick(i)}
                className={cn(
                  ROW,
                  "text-left transition-colors duration-300",
                  on ? "bg-ink/[0.055] text-ink" : "text-ink/80 hover:bg-ink/[0.03]",
                )}
              >
                <FileText className="h-4 w-4 shrink-0 text-cta" strokeWidth={1.75} />
                <span className="truncate">{r.title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex h-8 items-center justify-between px-2 text-ink/50">
        <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
        <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
      </div>
    </aside>
  );
});
