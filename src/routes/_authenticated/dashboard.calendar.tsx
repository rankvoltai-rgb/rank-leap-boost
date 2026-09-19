import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { addMonths, format, isSameMonth, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, EmptyState, PageHeader, Tabs } from "@/components/dashboard/primitives";
import { CalendarIcon } from "@/components/dashboard/icons";
import { ArticlePanel } from "@/components/dashboard/ArticlePanel";
import { AutopilotBar } from "@/components/dashboard/AutopilotBar";
import { Agenda, CalendarLegend, MonthGrid } from "@/components/dashboard/CalendarBoard";
import { parseDateKey, placeArticles } from "@/components/dashboard/queue-plan";
import {
  useAllArticles,
  useArticleActions,
  useArticleRouting,
} from "@/components/dashboard/useArticleActions";
import { useIsMobile } from "@/hooks/use-mobile";

type CalendarView = "month" | "agenda";

type CalendarSearch = {
  /** The article open in the slide-over. */
  article?: string;
  /** Omitted for the month view, the default. */
  view?: "agenda";
};

export const Route = createFileRoute("/_authenticated/dashboard/calendar")({
  validateSearch: (search: Record<string, unknown>): CalendarSearch => ({
    article: typeof search.article === "string" && search.article ? search.article : undefined,
    view: search.view === "agenda" ? "agenda" : undefined,
  }),
  component: CalendarPage,
});

function compact(n: number): string {
  return n >= 10_000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : n.toLocaleString();
}

function CalendarPage() {
  const { article, view: viewParam } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const isMobile = useIsMobile();
  // Seven columns of titles don't fit a phone; the agenda does.
  const view: CalendarView = isMobile ? "agenda" : (viewParam ?? "month");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  const routing = useArticleRouting(article, (id, replace) =>
    navigate({ search: (prev) => ({ ...prev, article: id }), replace }),
  );
  const actions = useArticleActions({ openId: article, onOpen: routing.open });
  const { data: all = [], isLoading } = useAllArticles();

  const placed = useMemo(() => placeArticles(all, actions.isWriting), [all, actions.isWriting]);

  // Arriving by link to an article in another month: show that month behind it.
  const landed = useRef(false);
  useEffect(() => {
    if (landed.current || isLoading) return;
    landed.current = true;
    const day = placed.find((p) => p.blog.id === article)?.day;
    if (day) setMonth(startOfMonth(parseDateKey(day)));
    // Only on first load — afterwards the user's own navigation wins.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // The month in numbers: what it holds and what it's worth.
  const monthKey = format(month, "yyyy-MM");
  const inMonth = placed.filter((p) => p.day?.startsWith(monthKey));
  const publishedInMonth = inMonth.filter((p) => p.tone === "published").length;
  const trafficInMonth = inMonth.reduce((s, p) => s + (p.blog.traffic_estimate ?? 0), 0);
  const upcoming = placed.filter((p) => p.tone !== "published" && p.day);
  const trafficUpcoming = upcoming.reduce((s, p) => s + (p.blog.traffic_estimate ?? 0), 0);

  // The panel's arrows walk what's on screen, in calendar order.
  const walk = view === "agenda" ? upcoming : [...placed.filter((p) => !p.day), ...inMonth];
  const fallback = walk.some((p) => p.blog.id === article) ? walk : placed;
  const index = article ? fallback.findIndex((p) => p.blog.id === article) : -1;
  const prevId = index > 0 ? fallback[index - 1].blog.id : undefined;
  const nextId =
    index >= 0 && index < fallback.length - 1 ? fallback[index + 1].blog.id : undefined;

  function setView(next: CalendarView) {
    navigate({
      search: (prev) => ({ ...prev, view: next === "agenda" ? "agenda" : undefined }),
      replace: true,
    });
  }

  const isThisMonth = isSameMonth(month, new Date());
  const hasAnything = placed.length > 0;

  return (
    <div className="space-y-5">
      {actions.dialogs}

      <PageHeader
        title="Calendar"
        description={
          "What autopilot has published, and when it writes the rest." +
          (view === "month" ? " Drag an article to another day to move it." : "")
        }
      />

      <AutopilotBar
        articles={all}
        subscription={actions.subscription}
        credits={actions.credits}
        remaining={actions.remaining}
        onStartTrial={actions.openTrial}
        onUpgrade={actions.openPaywall}
        onCommitQueue={actions.commitQueue}
      />

      {!isLoading && !hasAnything ? (
        <EmptyState
          icon={<CalendarIcon className="h-6 w-6" />}
          title="Nothing on the calendar yet"
          description="Schedule an idea and autopilot writes it on its day. Published articles show up here too."
          action={
            <Link to="/dashboard/blog-engine" search={{ view: "ideas" }}>
              <Button>Browse ideas</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {view === "month" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMonth((m) => addMonths(m, -1))}
                    aria-label="Previous month"
                    className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonth((m) => addMonths(m, 1))}
                    aria-label="Next month"
                    className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-tight tracking-tight text-ink">
                    {format(month, "MMMM yyyy")}
                  </h2>
                  {!isLoading && (
                    <p className="text-xs text-muted-foreground">
                      {inMonth.length === 0
                        ? "Nothing this month"
                        : `${inMonth.length} ${inMonth.length === 1 ? "article" : "articles"} · ${publishedInMonth} published · ${compact(trafficInMonth)} est. visits/mo`}
                    </p>
                  )}
                </div>
                {!isThisMonth && (
                  <Button variant="ghost" onClick={() => setMonth(startOfMonth(new Date()))}>
                    Today
                  </Button>
                )}
              </div>
            )}

            {view === "agenda" && (
              <div>
                <h2 className="text-lg font-semibold leading-tight tracking-tight text-ink">
                  Upcoming
                </h2>
                {!isLoading && (
                  <p className="text-xs text-muted-foreground">
                    {upcoming.length === 0
                      ? "Nothing scheduled"
                      : `${upcoming.length} ${upcoming.length === 1 ? "article" : "articles"} · ${compact(trafficUpcoming)} est. visits/mo`}
                  </p>
                )}
              </div>
            )}

            <div className="ml-auto flex items-center gap-5">
              {view === "month" && (
                <div className="hidden lg:block">
                  <CalendarLegend />
                </div>
              )}
              {!isMobile && (
                <Tabs
                  tabs={[
                    { id: "month" as const, label: "Month" },
                    { id: "agenda" as const, label: "Agenda" },
                  ]}
                  value={view}
                  onChange={setView}
                />
              )}
            </div>
          </div>

          {view === "month" ? (
            <MonthGrid
              month={month}
              items={placed}
              loading={isLoading}
              openId={article}
              onOpen={routing.open}
              onMove={(blog, day) => void actions.reschedule(blog, day)}
            />
          ) : upcoming.length === 0 && !isLoading ? (
            <EmptyState
              icon={<CalendarIcon className="h-6 w-6" />}
              title="Nothing coming up"
              description="Everything scheduled is written. Schedule an idea and autopilot takes it from there."
              action={
                <Link to="/dashboard/blog-engine" search={{ view: "ideas" }}>
                  <Button>Browse ideas</Button>
                </Link>
              }
            />
          ) : (
            <Agenda items={placed} openId={article} onOpen={routing.open} />
          )}
        </>
      )}

      <ArticlePanel
        articleId={article}
        blog={article ? all.find((b) => b.id === article) : undefined}
        loading={isLoading}
        writing={!!article && actions.writingIds.has(article)}
        nav={{
          onClose: routing.close,
          onPrev: prevId ? () => routing.show(prevId) : undefined,
          onNext: nextId ? () => routing.show(nextId) : undefined,
          position: index >= 0 ? { index, total: fallback.length } : null,
        }}
        actions={{
          creditsLeft: actions.remaining,
          onWrite: (b) => void actions.write(b),
          onSchedule: actions.schedule,
          onDelete: (b) => actions.remove(b, routing.close),
          onReschedule: actions.reschedule,
        }}
      />
    </div>
  );
}
