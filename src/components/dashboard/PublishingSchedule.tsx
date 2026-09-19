/**
 * The week ahead: which day each queued article publishes on.
 *
 * The week strip is the control — a day carries a dot when something is
 * scheduled — and the list below shows that day's articles. Autopilot writes
 * in queue order, so this is the plan the engine is working to, not a diary
 * the user has to maintain.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Panel } from "./primitives";
import { CalendarIcon } from "./icons";
import type { Blog } from "@/lib/data";

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Local midnight, so "today" matches the user's calendar rather than UTC. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

/** `scheduled_date` is a plain YYYY-MM-DD; parsing it as UTC shifts the day. */
function scheduledKey(blog: Blog): string {
  return (blog.scheduled_date ?? "").slice(0, 10);
}

export function PublishingSchedule({ blogs }: { blogs: Blog[] }) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });
  const [selected, setSelected] = useState(dayKey(today));

  const scheduled = blogs.filter((b) => b.scheduled_date);
  const forDay = scheduled
    .filter((b) => scheduledKey(b) === selected)
    .sort((a, b) => (a.queue_position ?? 0) - (b.queue_position ?? 0));
  const later = scheduled.filter((b) => scheduledKey(b) > dayKey(days[6])).length;

  return (
    <Panel className="flex flex-col overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-base font-semibold text-ink">Publishing schedule</h2>
        <Link
          to="/dashboard/calendar"
          className="ml-auto rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
        >
          Open calendar
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 px-4 pb-4">
        {days.map((date) => {
          const key = dayKey(date);
          const count = scheduled.filter((b) => scheduledKey(b) === key).length;
          const active = key === selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-center gap-1 rounded-card px-1 py-2 transition-colors",
                active ? "bg-brand-blue text-white" : "text-muted-foreground hover:bg-secondary",
              )}
            >
              <span className="text-[0.65rem] font-medium uppercase">
                {DAY_LABELS[date.getDay()]}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  active ? "text-white" : "text-ink",
                )}
              >
                {date.getDate()}
              </span>
              <span
                aria-hidden
                className={cn(
                  "h-1 w-1 rounded-full",
                  count ? (active ? "bg-white" : "bg-brand-blue") : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="flex-1 border-t border-border">
        {forDay.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            Nothing scheduled for this day.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {forDay.map((blog) => (
              <li key={blog.id} className="flex items-start gap-3 px-5 py-3.5">
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 h-8 w-0.5 shrink-0 rounded-full",
                    blog.status === "generating" ? "bg-brand-blue" : "bg-border",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to="/dashboard/blog-engine"
                    search={{ article: blog.id }}
                    className="block truncate text-sm font-medium text-ink hover:underline"
                    title={blog.title}
                  >
                    {blog.title}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {blog.keyword ?? "No keyword"}
                    {blog.status === "generating" ? " · writing now" : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                  +{blog.traffic_estimate.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {later > 0 && (
        <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          {later} more scheduled beyond this week.
        </p>
      )}
    </Panel>
  );
}
