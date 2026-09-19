import { useMemo, useState } from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Loader2 } from "lucide-react";
import type { Blog } from "@/lib/data";
import { CheckIcon } from "@/components/dashboard/icons";
import { TrafficValue } from "@/components/dashboard/traffic";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  dateKey,
  parseDateKey,
  todayKey,
  type Placed,
  type Tone,
} from "@/components/dashboard/queue-plan";
import { cn } from "@/lib/utils";

const TONE_LABEL: Record<Tone, string> = {
  published: "Published",
  writing: "Writing now",
  scheduled: "Scheduled",
  overdue: "Overdue",
};

/* ── Article chip ───────────────────────────────────────────────── */

const CHIP_TONE: Record<Tone, string> = {
  published: "border-success/20 bg-success/[0.08] hover:bg-success/15",
  writing: "border-info/25 bg-info/10 hover:bg-info/15",
  scheduled: "border-volt/25 bg-volt/10 hover:bg-volt/20",
  overdue: "border-warning/40 bg-warning/15 hover:bg-warning/25",
};

function StatusGlyph({ tone }: { tone: Tone }) {
  if (tone === "published") return <CheckIcon className="h-3 w-3 shrink-0 text-success" />;
  if (tone === "writing") return <Loader2 className="h-3 w-3 shrink-0 animate-spin text-info" />;
  return (
    <span
      aria-hidden
      className={cn(
        "mx-[3px] h-1.5 w-1.5 shrink-0 rounded-full",
        tone === "overdue" ? "bg-warning" : "bg-volt",
      )}
    />
  );
}

/** Queued articles move; published work and work in progress stay where they are. */
function movable(tone: Tone) {
  return tone === "scheduled" || tone === "overdue";
}

function Chip({
  item,
  active,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  item: Placed;
  active: boolean;
  dragging: boolean;
  onOpen: (id: string) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const { blog, tone } = item;
  const canMove = movable(tone) && !!onDragStart;
  return (
    <button
      type="button"
      data-article-link={blog.id}
      draggable={canMove}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", blog.id);
        onDragStart?.();
      }}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(blog.id)}
      title={`${blog.title} — ${TONE_LABEL[tone]}${canMove ? " · drag to another day" : ""}`}
      className={cn(
        "relative flex w-full min-w-0 items-center gap-1.5 rounded-md border px-1.5 py-1 text-left text-[0.72rem] font-medium leading-tight text-ink transition-[background-color,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        CHIP_TONE[tone],
        canMove && "cursor-grab active:cursor-grabbing",
        active && "ring-2 ring-brand-blue/60",
        dragging && "opacity-40",
      )}
    >
      <StatusGlyph tone={tone} />
      <span className="truncate">{blog.title}</span>
      <span className="sr-only">, {TONE_LABEL[tone]}</span>
    </button>
  );
}

/* ── Legend ─────────────────────────────────────────────────────── */

export function CalendarLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      {(["published", "scheduled", "overdue"] as const).map((tone) => (
        <span key={tone} className="inline-flex items-center gap-1.5">
          <StatusGlyph tone={tone} />
          {TONE_LABEL[tone]}
        </span>
      ))}
    </div>
  );
}

/* ── Month grid ─────────────────────────────────────────────────── */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VISIBLE_PER_DAY = 3;

export function MonthGrid({
  month,
  items,
  loading,
  openId,
  onOpen,
  onMove,
}: {
  month: Date;
  items: Placed[];
  loading?: boolean;
  openId?: string;
  onOpen: (id: string) => void;
  onMove: (blog: Blog, day: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overDay, setOverDay] = useState<string | null>(null);
  const today = todayKey();

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month)),
        end: endOfWeek(endOfMonth(month)),
      }),
    [month],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, Placed[]>();
    for (const item of items) {
      if (!item.day) continue;
      const list = map.get(item.day) ?? [];
      list.push(item);
      map.set(item.day, list);
    }
    return map;
  }, [items]);

  const unscheduled = items.filter((i) => !i.day);

  function endDrag() {
    setDragId(null);
    setOverDay(null);
  }

  function drop(day: string) {
    const item = items.find((i) => i.blog.id === dragId);
    endDrag();
    if (item && item.day !== day) onMove(item.blog, day);
  }

  const chipProps = (item: Placed) => ({
    item,
    active: item.blog.id === openId,
    dragging: item.blog.id === dragId,
    onOpen,
    onDragStart: () => setDragId(item.blog.id),
    onDragEnd: endDrag,
  });

  return (
    <div className="space-y-3">
      {unscheduled.length > 0 && (
        <div className="rounded-card border border-dashed border-border bg-card px-4 py-3">
          <p className="mb-2 text-xs text-muted-foreground">
            <span className="font-semibold text-ink">No day yet.</span> Drag onto the calendar to
            schedule.
          </p>
          <div className="grid gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
            {unscheduled.map((item) => (
              <Chip key={item.blog.id} {...chipProps(item)} />
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-card border border-border bg-card">
        <div className="grid grid-cols-7 border-b border-border bg-secondary/30">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-2.5 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((date) => {
            const day = dateKey(date);
            const list = byDay.get(day) ?? [];
            const inMonth = isSameMonth(date, month);
            const isToday = day === today;
            const isPast = day < today;
            // Autopilot can't write in the past, so the past doesn't take drops.
            const accepts = !!dragId && !isPast;
            const hidden = list.length - VISIBLE_PER_DAY;
            return (
              <div
                key={day}
                data-day={day}
                onDragOver={(e) => {
                  if (!accepts) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (overDay !== day) setOverDay(day);
                }}
                onDragLeave={() => overDay === day && setOverDay(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  if (accepts) drop(day);
                }}
                className={cn(
                  "flex min-h-[7.25rem] min-w-0 flex-col gap-1 border-b border-r border-border p-1.5 transition-colors [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0",
                  isPast && "bg-secondary/35",
                  isToday && "bg-brand-blue/[0.04]",
                  dragId && isPast && "cursor-not-allowed",
                  overDay === day &&
                    "bg-volt/10 shadow-[inset_0_0_0_2px_color-mix(in_oklab,var(--volt)_45%,transparent)]",
                )}
              >
                <div className="flex h-6 items-center justify-between px-0.5">
                  <span
                    className={cn(
                      "grid h-6 min-w-6 place-items-center rounded-full px-1 text-xs font-semibold tabular-nums",
                      isToday
                        ? "bg-brand-blue text-white"
                        : !inMonth
                          ? "text-muted-foreground/45"
                          : isPast
                            ? "text-muted-foreground"
                            : "text-ink",
                    )}
                  >
                    {format(date, "d")}
                  </span>
                  {isToday && (
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.09em] text-brand-blue">
                      Today
                    </span>
                  )}
                </div>

                {loading ? (
                  inMonth && date.getDate() % 3 !== 0 && <div className="skeleton h-5 w-full" />
                ) : (
                  <div className="flex min-w-0 flex-col gap-1">
                    {list.slice(0, VISIBLE_PER_DAY).map((item) => (
                      <Chip key={item.blog.id} {...chipProps(item)} />
                    ))}
                    {hidden > 0 && (
                      <Popover>
                        <PopoverTrigger className="rounded-md px-1.5 py-0.5 text-left text-[0.68rem] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink">
                          +{hidden} more
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-72 rounded-card border-border p-2 shadow-elevation-lg"
                        >
                          <p className="px-1 pb-2 text-xs font-semibold text-ink">
                            {format(date, "EEEE, MMMM d")}
                          </p>
                          <div className="flex flex-col gap-1">
                            {list.map((item) => (
                              <Chip key={item.blog.id} {...chipProps(item)} />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Agenda ─────────────────────────────────────────────────────── */

function dayHeading(day: string, today: string): { label: string; date: string } {
  const date = format(parseDateKey(day), "EEE, MMM d");
  if (day === today) return { label: "Today", date };
  if (day === dateKey(addDays(parseDateKey(today), 1))) return { label: "Tomorrow", date };
  return { label: format(parseDateKey(day), "EEEE"), date: format(parseDateKey(day), "MMM d") };
}

/**
 * What's coming, in order: anything overdue first (it needs a decision), then
 * each upcoming day. Published history lives in the month view and on Articles.
 */
export function Agenda({
  items,
  openId,
  onOpen,
}: {
  items: Placed[];
  openId?: string;
  onOpen: (id: string) => void;
}) {
  const today = todayKey();
  const groups = useMemo(() => {
    const overdue = items.filter((i) => i.tone === "overdue");
    const byDay = new Map<string, Placed[]>();
    for (const item of items) {
      if (item.tone === "overdue" || item.tone === "published" || !item.day) continue;
      const list = byDay.get(item.day) ?? [];
      list.push(item);
      byDay.set(item.day, list);
    }
    const days = [...byDay.entries()].map(([day, list]) => ({
      key: day,
      ...dayHeading(day, today),
      list,
    }));
    return overdue.length
      ? [{ key: "overdue", label: "Overdue", date: "Not written yet", list: overdue }, ...days]
      : days;
  }, [items, today]);

  if (groups.length === 0) return null;

  return (
    // One list, day headers inside it: a card per day would repeat the same
    // frame thirty times. overflow-clip (not hidden) keeps the headers sticky.
    <div className="overflow-clip rounded-card border border-border bg-card">
      {groups.map((g) => (
        <section key={g.key} className="border-b border-border last:border-b-0">
          <header className="sticky top-0 z-[1] flex items-baseline gap-2 border-b border-border bg-secondary px-4 py-2">
            <h3
              className={cn(
                "text-sm font-semibold",
                g.label === "Today" ? "text-brand-blue" : "text-ink",
              )}
            >
              {g.label}
            </h3>
            <span className="text-xs text-muted-foreground">{g.date}</span>
            <span className="ml-auto text-xs tabular-nums text-muted-foreground">
              {g.list.length} {g.list.length === 1 ? "article" : "articles"}
            </span>
          </header>
          <ul className="divide-y divide-border">
            {g.list.map((item) => (
              <li key={item.blog.id}>
                <button
                  type="button"
                  data-article-link={item.blog.id}
                  onClick={() => onOpen(item.blog.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/40 focus-visible:bg-secondary/40 focus-visible:outline-none",
                    item.blog.id === openId && "bg-secondary/60",
                  )}
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center">
                    <StatusGlyph tone={item.tone} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {item.blog.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {item.tone === "overdue" && item.day
                        ? `Was due ${format(parseDateKey(item.day), "MMM d")}`
                        : item.tone === "writing"
                          ? "Writing now"
                          : (item.blog.keyword ?? "Scheduled")}
                    </span>
                  </span>
                  <TrafficValue
                    value={item.blog.traffic_estimate ?? 0}
                    className="hidden shrink-0 text-xs sm:inline-flex"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
