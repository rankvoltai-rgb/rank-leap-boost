import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CalendarDays,
  ArrowUpToLine,
  TrendingUp,
  Loader2,
  CalendarClock,
} from "lucide-react";
import { listBlogs, prioritizeBlog, updateBlog, type Blog } from "@/lib/api";
import { Panel, Pill, Button, PageHeader, StatCard } from "@/components/dashboard/primitives";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/calendar")({
  component: CalendarPage,
});

function formatDateKey(iso: string | null): string {
  return iso ?? "unscheduled";
}

function prettyDate(key: string): string {
  if (key === "unscheduled") return "Unscheduled";
  const d = new Date(`${key}T00:00:00`);
  if (Number.isNaN(d.getTime())) return key;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function CalendarPage() {
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ["blogs", "calendar"],
    queryFn: async () => {
      const lists = await Promise.all([listBlogs("scheduled"), listBlogs("generating")]);
      return lists.flat();
    },
  });

  const groups = useMemo(() => {
    const map = new Map<string, Blog[]>();
    for (const b of queue) {
      const key = formatDateKey(b.scheduled_date);
      const arr = map.get(key) ?? [];
      arr.push(b);
      map.set(key, arr);
    }
    return [...map.entries()].sort(([a], [b]) => {
      if (a === "unscheduled") return 1;
      if (b === "unscheduled") return -1;
      return a.localeCompare(b);
    });
  }, [queue]);

  const dates = queue.map((b) => b.scheduled_date).filter(Boolean) as string[];
  const nextDate = dates.sort()[0] ?? null;
  const totalTraffic = queue.reduce((s, b) => s + (b.traffic_estimate ?? 0), 0);

  async function prioritize(blog: Blog) {
    setBusyId(blog.id);
    try {
      await prioritizeBlog(blog.id);
      toast.success(`"${blog.title}" moved to the top of the queue.`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not prioritize.");
    } finally {
      setBusyId(null);
    }
  }

  async function reschedule(blog: Blog, date: Date) {
    const scheduled_date = format(date, "yyyy-MM-dd");
    setBusyId(blog.id);
    try {
      await updateBlog(blog.id, { scheduled_date });
      toast.success(`Rescheduled to ${prettyDate(scheduled_date)}.`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reschedule.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Your upcoming publishing schedule — reorder and reschedule queued articles."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="In Queue" value={queue.length} hint="Articles scheduled" emphasis />
        <StatCard
          label="Next Publish"
          value={nextDate ? prettyDate(nextDate).replace(/^[A-Za-z]+, /, "") : "—"}
          hint="Soonest scheduled date"
        />
        <StatCard
          label="Queued Traffic"
          value={totalTraffic.toLocaleString()}
          hint="Est. monthly visitors"
        />
      </div>

      {isLoading ? (
        <Panel className="flex items-center justify-center p-12 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </Panel>
      ) : queue.length === 0 ? (
        <Panel className="flex flex-col items-center gap-3 p-12 text-center">
          <CalendarDays className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nothing scheduled yet. Add opportunities to your queue to fill the calendar.
          </p>
          <Link to="/dashboard/blog-engine">
            <Button>Browse opportunities</Button>
          </Link>
        </Panel>
      ) : (
        <div className="space-y-6">
          {groups.map(([key, blogs]) => (
            <div key={key}>
              <div className="mb-3 flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-ink">{prettyDate(key)}</h2>
                <span className="text-xs text-muted-foreground">
                  {blogs.length} {blogs.length === 1 ? "article" : "articles"}
                </span>
              </div>
              <div className="grid gap-3">
                {blogs.map((b) => (
                  <Panel key={b.id} hover className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-ink">{b.title}</p>
                        {b.status === "generating" && (
                          <Pill tone="info">
                            <Loader2 className="h-3 w-3 animate-spin" /> Writing
                          </Pill>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Pill tone="success">
                          <TrendingUp className="h-3 w-3" />
                          {b.traffic_estimate.toLocaleString()}/mo
                        </Pill>
                        {b.keyword && <Pill tone="neutral">{b.keyword}</Pill>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" disabled={busyId === b.id}>
                            <CalendarDays className="h-4 w-4" /> Reschedule
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={b.scheduled_date ? new Date(`${b.scheduled_date}T00:00:00`) : undefined}
                            onSelect={(date) => date && reschedule(b, date)}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button onClick={() => prioritize(b)} disabled={busyId === b.id}>
                        {busyId === b.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowUpToLine className="h-4 w-4" />
                        )}
                        Prioritize
                      </Button>
                    </div>
                  </Panel>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}