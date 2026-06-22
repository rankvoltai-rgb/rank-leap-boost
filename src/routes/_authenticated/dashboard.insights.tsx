import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listBlogs, type Blog } from "@/lib/api";
import { Panel, Button, PageHeader, MetricCard, EmptyState } from "@/components/dashboard/primitives";
import { Sparkline } from "@/components/dashboard/signals";
import { ChartIcon, TrendIcon, PublishIcon, TargetIcon } from "@/components/dashboard/icons";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Rankvolt" },
      {
        name: "description",
        content:
          "Track your content trajectory: traffic growth, publishing cadence, and SEO quality.",
      },
    ],
  }),
  component: InsightsPage,
});

function weekKey(d: Date): string {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday-indexed
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

function InsightsPage() {
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs", "all"],
    queryFn: () => listBlogs(),
  });

  const published = useMemo(() => blogs.filter((b) => b.status === "finished"), [blogs]);

  const liveTraffic = published.reduce((s, b) => s + (b.traffic_estimate ?? 0), 0);
  const projectedTraffic = blogs.reduce((s, b) => s + (b.traffic_estimate ?? 0), 0);
  const avgSeo = published.length
    ? Math.round(published.reduce((s, b) => s + (b.seo_score ?? 0), 0) / published.length)
    : 0;

  const trajectory = useMemo(() => {
    const dated = [...published].sort(
      (a, b) =>
        new Date(a.updated_at ?? a.created_at).getTime() -
        new Date(b.updated_at ?? b.created_at).getTime(),
    );
    let acc = 0;
    return dated.map((b) => (acc += b.traffic_estimate ?? 0));
  }, [published]);

  const weeks = useMemo(() => {
    const map = new Map<string, number>();
    const now = new Date();
    for (let i = 7; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      map.set(weekKey(d), 0);
    }
    for (const b of published) {
      const k = weekKey(new Date(b.updated_at ?? b.created_at));
      if (map.has(k)) map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].map(([k, count]) => ({ week: k, count }));
  }, [published]);
  const maxWeek = Math.max(1, ...weeks.map((w) => w.count));
  const bestWeek = Math.max(0, ...weeks.map((w) => w.count));

  const buckets = useMemo(() => {
    const defs = [
      { label: "90+", tone: "bg-success", test: (s: number) => s >= 90 },
      { label: "75–89", tone: "bg-volt", test: (s: number) => s >= 75 && s < 90 },
      { label: "55–74", tone: "bg-warning", test: (s: number) => s >= 55 && s < 75 },
      { label: "< 55", tone: "bg-destructive", test: (s: number) => s < 55 },
    ];
    return defs.map((d) => ({
      ...d,
      count: published.filter((b: Blog) => d.test(b.seo_score ?? 0)).length,
    }));
  }, [published]);
  const maxBucket = Math.max(1, ...buckets.map((b) => b.count));

  const deliveredPct = projectedTraffic > 0 ? Math.round((liveTraffic / projectedTraffic) * 100) : 0;

  if (!isLoading && published.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Insights"
          description="Track your content trajectory: traffic growth, publishing cadence, and SEO quality."
        />
        <EmptyState
          icon={<ChartIcon className="h-6 w-6" />}
          title="No data to chart yet"
          description="Publish your first articles and your growth trajectory will appear here."
          action={
            <Link to="/dashboard/blog-engine">
              <Button>Go to Articles</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insights"
        description="Track your content trajectory: traffic growth, publishing cadence, and SEO quality."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Live Traffic"
          value={liveTraffic}
          hint="Est. monthly visitors from published"
          accentValue
          emphasis
        />
        <MetricCard
          label="Published"
          value={published.length}
          hint="Total live articles"
          icon={<PublishIcon className="h-4 w-4" />}
        />
        <MetricCard
          label="Avg SEO Score"
          value={avgSeo}
          hint="Across published"
          icon={<TargetIcon className="h-4 w-4" />}
          ring={{ value: avgSeo, max: 100 }}
        />
        <MetricCard
          label="Best Week"
          value={bestWeek}
          hint="Articles in a single week"
          icon={<TrendIcon className="h-4 w-4" />}
        />
      </div>

      <Panel className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Traffic trajectory</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Cumulative estimated monthly traffic as articles go live.
            </p>
          </div>
          <p className="text-2xl font-semibold tabular-nums text-volt">
            {liveTraffic.toLocaleString()}
          </p>
        </div>
        <div className="mt-4 h-32">
          <Sparkline
            data={trajectory.length > 1 ? trajectory : [0, ...trajectory]}
            height={128}
            className="h-32"
          />
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink">Publishing cadence</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Articles published per week (last 8).</p>
          <div className="mt-5 flex h-36 items-end justify-between gap-2">
            {weeks.map((w) => (
              <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-28 w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-volt/80 transition-all duration-700"
                    style={{ height: `${Math.max(4, (w.count / maxWeek) * 100)}%` }}
                    title={`${w.count} published`}
                  />
                </div>
                <span className="text-[0.6rem] tabular-nums text-muted-foreground">
                  {new Date(`${w.week}T00:00:00`).toLocaleDateString(undefined, {
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink">SEO score distribution</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Quality spread across published articles.
          </p>
          <div className="mt-5 space-y-3">
            {buckets.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">
                  {b.label}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", b.tone)}
                    style={{ width: `${(b.count / maxBucket) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-xs font-semibold tabular-nums text-ink">
                  {b.count}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">Traffic delivered vs. projected</span>
            <span className="text-sm font-semibold tabular-nums text-ink">{deliveredPct}%</span>
          </div>
        </Panel>
      </div>
    </div>
  );
}