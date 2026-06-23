import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarDays, Loader2 } from "lucide-react";
import { listBlogs, prioritizeBlog, updateBlog, type Blog } from "@/lib/api";
import { Panel, Button, PageHeader } from "@/components/dashboard/primitives";
import { CalendarBoard, prettyDate, type CalendarView } from "@/components/dashboard/CalendarBoard";

export const Route = createFileRoute("/_authenticated/dashboard/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [view, setView] = useState<CalendarView>("month");

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ["blogs", "calendar"],
    queryFn: async () => {
      const lists = await Promise.all([listBlogs("scheduled"), listBlogs("generating")]);
      return lists.flat();
    },
  });

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
    if (blog.scheduled_date === scheduled_date) return;
    setBusyId(blog.id);
    // Optimistic update so the chip moves immediately.
    queryClient.setQueryData<Blog[]>(["blogs", "calendar"], (prev) =>
      (prev ?? []).map((b) => (b.id === blog.id ? { ...b, scheduled_date } : b)),
    );
    try {
      await updateBlog(blog.id, { scheduled_date });
      toast.success(`"${blog.title}" → ${prettyDate(scheduled_date)}.`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reschedule.");
      queryClient.invalidateQueries({ queryKey: ["blogs", "calendar"] });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Your autopilot publishing schedule — drag, reorder, or reschedule anything autopilot has queued."
      />

      {isLoading ? (
        <Panel className="flex items-center justify-center p-12 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </Panel>
      ) : queue.length === 0 ? (
        <Panel className="flex flex-col items-center gap-3 p-12 text-center">
          <CalendarDays className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nothing scheduled yet. Add opportunities from your Overview and autopilot fills the calendar.
          </p>
          <Link to="/dashboard">
            <Button>Go to Overview</Button>
          </Link>
        </Panel>
      ) : (
        <CalendarBoard
          view={view}
          setView={setView}
          events={queue}
          busyId={busyId}
          onReschedule={reschedule}
          onPrioritize={prioritize}
        />
      )}
    </div>
  );
}
