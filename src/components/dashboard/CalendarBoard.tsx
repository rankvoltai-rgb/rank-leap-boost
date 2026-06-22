import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  TrendingUp,
  ArrowUpToLine,
  CalendarDays,
  PenLine,
  Inbox,
  X,
} from "lucide-react";
import type { Blog } from "@/lib/api";
import { Button, Pill } from "@/components/dashboard/primitives";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type CalendarView = "month" | "week" | "list";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DATE_FMT = "yyyy-MM-dd";

function keyOf(date: Date): string {
  return format(date, DATE_FMT);
}

function parseKey(key: string): Date {
  return new Date(`${key}T00:00:00`);
}

export function prettyDate(key: string): string {
  if (key === "unscheduled") return "Unscheduled";
  const d = parseKey(key);
  if (Number.isNaN(d.getTime())) return key;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

interface BoardProps {
  events: Blog[];
  busyId: string | null;
  onReschedule: (blog: Blog, date: Date) => void;
  onPrioritize: (blog: Blog) => void;
}

/* ---------------- Event chip + detail popover ---------------- */

function EventChip({
  blog,
  busyId,
  onReschedule,
  onPrioritize,
  compact,
  onDragStart,
  onDragEnd,
}: {
  blog: Blog;
  busyId: string | null;
  onReschedule: (blog: Blog, date: Date) => void;
  onPrioritize: (blog: Blog) => void;
  compact?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const generating = blog.status === "generating";
  const busy = busyId === blog.id;

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setShowCal(false); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", blog.id);
            onDragStart?.();
          }}
          onDragEnd={() => onDragEnd?.()}
          className={cn(
            "group flex w-full items-center gap-1.5 rounded-md border px-1.5 text-left transition-colors",
            "cursor-grab active:cursor-grabbing",
            compact ? "py-0.5" : "py-1",
            generating
              ? "border-warning/30 bg-warning/15 hover:bg-warning/25"
              : "border-volt/25 bg-volt/10 hover:bg-volt/20",
          )}
          title={blog.title}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              generating ? "animate-pulse bg-warning" : "bg-volt",
            )}
          />
          <span className="truncate text-[0.72rem] font-medium leading-tight text-ink">
            {blog.title}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <div className="flex items-start justify-between gap-2 border-b border-border p-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-ink">{blog.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {blog.scheduled_date ? prettyDate(blog.scheduled_date) : "Unscheduled"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          {generating ? (
            <Pill tone="warning">
              <Loader2 className="h-3 w-3 animate-spin" /> Writing
            </Pill>
          ) : (
            <Pill tone="info">Scheduled</Pill>
          )}
          <Pill tone="success">
            <TrendingUp className="h-3 w-3" />
            {blog.traffic_estimate.toLocaleString()}/mo
          </Pill>
          {blog.keyword && <Pill tone="neutral">{blog.keyword}</Pill>}
        </div>

        {showCal ? (
          <div className="border-t border-border p-2">
            <Calendar
              mode="single"
              selected={blog.scheduled_date ? parseKey(blog.scheduled_date) : undefined}
              onSelect={(date) => {
                if (date) {
                  onReschedule(blog, date);
                  setOpen(false);
                }
              }}
              initialFocus
              className={cn("pointer-events-auto p-2")}
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 border-t border-border p-3">
            <Button variant="ghost" onClick={() => setShowCal(true)} disabled={busy}>
              <CalendarDays className="h-4 w-4" /> Reschedule
            </Button>
            <Button onClick={() => onPrioritize(blog)} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpToLine className="h-4 w-4" />}
              Prioritize
            </Button>
            <Link to="/dashboard/editor/$blogId" params={{ blogId: blog.id }} className="contents">
              <Button variant="ghost">
                <PenLine className="h-4 w-4" /> Open
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- Grid (month / week) ---------------- */

function Grid({
  days,
  anchor,
  view,
  byDay,
  board,
  dragId,
  setDragId,
  dragOverKey,
  setDragOverKey,
}: {
  days: Date[];
  anchor: Date;
  view: "month" | "week";
  byDay: Map<string, Blog[]>;
  board: BoardProps;
  dragId: string | null;
  setDragId: (id: string | null) => void;
  dragOverKey: string | null;
  setDragOverKey: (k: string | null) => void;
}) {
  const maxVisible = view === "week" ? 99 : 3;

  function drop(key: string) {
    if (!dragId) return;
    const blog = board.events.find((b) => b.id === dragId);
    setDragOverKey(null);
    setDragId(null);
    if (!blog) return;
    if (blog.scheduled_date === key) return;
    board.onReschedule(blog, parseKey(key));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevation">
      <div className="grid grid-cols-7 border-b border-border bg-secondary/40">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="px-2 py-2 text-center text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
          >
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d[0]}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = keyOf(day);
          const inMonth = view === "week" || isSameMonth(day, anchor);
          const today = isToday(day);
          const items = byDay.get(key) ?? [];
          const overflow = items.length - maxVisible;
          const isOver = dragOverKey === key;
          return (
            <div
              key={key}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (dragOverKey !== key) setDragOverKey(key);
              }}
              onDragLeave={() => {
                if (dragOverKey === key) setDragOverKey(null);
              }}
              onDrop={() => drop(key)}
              className={cn(
                "flex flex-col gap-1 border-b border-r border-border p-1.5 transition-colors",
                "[&:nth-child(7n)]:border-r-0",
                view === "month" ? "min-h-[104px]" : "min-h-[320px]",
                !inMonth && "bg-secondary/20",
                isOver && "bg-volt/10 ring-1 ring-inset ring-volt/40",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid h-6 min-w-6 place-items-center rounded-full px-1 text-xs font-semibold tabular-nums",
                    today
                      ? "bg-volt text-background"
                      : inMonth
                        ? "text-ink"
                        : "text-muted-foreground/60",
                  )}
                >
                  {format(day, "d")}
                </span>
                {items.length > 0 && (
                  <span className="text-[0.6rem] font-medium text-muted-foreground tabular-nums">
                    {items.length}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {items.slice(0, maxVisible).map((b) => (
                  <EventChip
                    key={b.id}
                    blog={b}
                    busyId={board.busyId}
                    onReschedule={board.onReschedule}
                    onPrioritize={board.onPrioritize}
                    compact={view === "month"}
                    onDragStart={() => setDragId(b.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setDragOverKey(null);
                    }}
                  />
                ))}
                {overflow > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="rounded-md px-1.5 py-0.5 text-left text-[0.68rem] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
                      >
                        +{overflow} more
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-72 p-3">
                      <p className="mb-2 text-xs font-semibold text-ink">{prettyDate(key)}</p>
                      <div className="flex flex-col gap-1.5">
                        {items.map((b) => (
                          <EventChip
                            key={b.id}
                            blog={b}
                            busyId={board.busyId}
                            onReschedule={board.onReschedule}
                            onPrioritize={board.onPrioritize}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Agenda / list ---------------- */

function Agenda({ board }: { board: BoardProps }) {
  const groups = useMemo(() => {
    const map = new Map<string, Blog[]>();
    for (const b of board.events) {
      const key = b.scheduled_date ?? "unscheduled";
      const arr = map.get(key) ?? [];
      arr.push(b);
      map.set(key, arr);
    }
    return [...map.entries()].sort(([a], [b]) => {
      if (a === "unscheduled") return 1;
      if (b === "unscheduled") return -1;
      return a.localeCompare(b);
    });
  }, [board.events]);

  return (
    <div className="space-y-5">
      {groups.map(([key, blogs]) => (
        <div key={key} className="rounded-2xl border border-border bg-card p-4 shadow-elevation">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-ink">{prettyDate(key)}</h2>
            <span className="text-xs text-muted-foreground">
              {blogs.length} {blogs.length === 1 ? "article" : "articles"}
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {blogs.map((b) => (
              <EventChip
                key={b.id}
                blog={b}
                busyId={board.busyId}
                onReschedule={board.onReschedule}
                onPrioritize={board.onPrioritize}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Unscheduled strip ---------------- */

function UnscheduledStrip({
  items,
  board,
  setDragId,
}: {
  items: Blog[];
  board: BoardProps;
  setDragId: (id: string | null) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Inbox className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-semibold text-ink">Unscheduled</p>
        <span className="text-xs text-muted-foreground">drag onto a day to schedule</span>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((b) => (
          <EventChip
            key={b.id}
            blog={b}
            busyId={board.busyId}
            onReschedule={board.onReschedule}
            onPrioritize={board.onPrioritize}
            onDragStart={() => setDragId(b.id)}
            onDragEnd={() => setDragId(null)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Main board ---------------- */

export function CalendarBoard({
  view,
  setView,
  events,
  busyId,
  onReschedule,
  onPrioritize,
}: {
  view: CalendarView;
  setView: (v: CalendarView) => void;
} & BoardProps) {
  const [anchor, setAnchor] = useState(() => new Date());
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const board: BoardProps = { events, busyId, onReschedule, onPrioritize };

  const byDay = useMemo(() => {
    const map = new Map<string, Blog[]>();
    for (const b of events) {
      if (!b.scheduled_date) continue;
      const arr = map.get(b.scheduled_date) ?? [];
      arr.push(b);
      map.set(b.scheduled_date, arr);
    }
    return map;
  }, [events]);

  const unscheduled = useMemo(() => events.filter((b) => !b.scheduled_date), [events]);

  const days = useMemo(() => {
    if (view === "week") {
      const start = startOfWeek(anchor);
      return eachDayOfInterval({ start, end: endOfWeek(anchor) });
    }
    const start = startOfWeek(startOfMonth(anchor));
    const end = endOfWeek(endOfMonth(anchor));
    return eachDayOfInterval({ start, end });
  }, [anchor, view]);

  const label =
    view === "week"
      ? `${format(startOfWeek(anchor), "MMM d")} – ${format(endOfWeek(anchor), "MMM d, yyyy")}`
      : format(anchor, "MMMM yyyy");

  const isCurrentPeriod =
    view === "month"
      ? isSameMonth(anchor, new Date())
      : isSameDay(startOfWeek(anchor), startOfWeek(new Date()));

  function step(dir: 1 | -1) {
    setAnchor((d) => (view === "week" ? addWeeks(d, dir) : addMonths(d, dir)));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setAnchor(new Date())} disabled={view === "list" || isCurrentPeriod}>
            Today
          </Button>
          {view !== "list" && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => step(-1)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-ink transition-colors hover:bg-secondary"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-ink transition-colors hover:bg-secondary"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          {view !== "list" && (
            <h2 className="ml-1 text-lg font-semibold tracking-tight text-ink">{label}</h2>
          )}
        </div>

        <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
          {(["month", "week", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-all",
                view === v ? "bg-ink text-background shadow-sm" : "text-muted-foreground hover:text-ink",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view !== "list" && (
        <UnscheduledStrip items={unscheduled} board={board} setDragId={setDragId} />
      )}

      <motion.div
        key={`${view}-${label}`}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {view === "list" ? (
          <Agenda board={board} />
        ) : (
          <Grid
            days={days}
            anchor={anchor}
            view={view}
            byDay={byDay}
            board={board}
            dragId={dragId}
            setDragId={setDragId}
            dragOverKey={dragOverKey}
            setDragOverKey={setDragOverKey}
          />
        )}
      </motion.div>
    </div>
  );
}
