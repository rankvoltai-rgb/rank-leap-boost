import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Plus, TrendingUp } from "lucide-react";
import {
  listBlogs,
  getCredits,
  addOpportunityToQueue,
  type Blog,
} from "@/lib/api";
import { Panel, StatCard, Pill, Button, PageHeader } from "@/components/dashboard/primitives";
import { CountUp } from "@/components/ui/count-up";
import { AI_ALGORITHM_MARKS } from "@/components/landing/ai-logos";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: SystemConsole,
});

function AlgorithmLogos() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {AI_ALGORITHM_MARKS.map(({ name, Mark }) => (
        <span
          key={name}
          title={name}
          aria-label={name}
          className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card shadow-sm"
        >
          <Mark className="h-5 w-5" />
        </span>
      ))}
    </div>
  );
}

function RadarRow({ opp, action }: { opp: Blog; action?: React.ReactNode }) {
  return (
    <Panel hover className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 sm:p-5">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-ink">{opp.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Pill tone="neutral">{opp.keyword}</Pill>
          <Pill tone="success">
            <TrendingUp className="h-3 w-3" />
            {opp.traffic_estimate.toLocaleString()}/mo
          </Pill>
          <Pill tone="info">{opp.ai_signal} AI</Pill>
          <Pill tone="neutral">{opp.competition ?? "—"} comp.</Pill>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </Panel>
  );
}

function RadarSection({
  label,
  count,
  empty,
  children,
}: {
  label: string;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </h3>
        <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <Panel className="p-6 text-center text-sm text-muted-foreground">{empty}</Panel>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </section>
  );
}

function SystemConsole() {
  const queryClient = useQueryClient();

  // Welcome users arriving from a completed checkout, then clean the URL.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      toast.success("You're all set — your free trial is active!");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const { data: allBlogs = [] } = useQuery({
    queryKey: ["blogs", "all"],
    queryFn: () => listBlogs(),
  });
  const { data: opportunities = [] } = useQuery({
    queryKey: ["blogs", "opportunity"],
    queryFn: () => listBlogs("opportunity"),
  });
  const { data: scheduled = [] } = useQuery({
    queryKey: ["blogs", "scheduled"],
    queryFn: () => listBlogs("scheduled"),
  });
  const { data: generating = [] } = useQuery({
    queryKey: ["blogs", "generating"],
    queryFn: () => listBlogs("generating"),
  });
  const { data: credits } = useQuery({ queryKey: ["credits"], queryFn: getCredits });

  const estimatedTraffic = allBlogs.reduce((sum, b) => sum + (b.traffic_estimate ?? 0), 0);
  const avgSignal = opportunities.length
    ? Math.round(
        opportunities.reduce((s, b) => s + (b.ai_signal ?? 0), 0) / opportunities.length,
      )
    : 0;

  const selected = [...generating, ...scheduled];

  async function addToQueue(opp: Blog) {
    try {
      const gained = await addOpportunityToQueue(opp);
      toast.success(`Added to queue · +${gained.toLocaleString()} est. traffic`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add to queue.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Console"
        description="Your live SEO engine — opportunities, signals, and traffic at a glance."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Estimated Traffic"
          value={<CountUp value={estimatedTraffic} className="text-gradient-traffic" />}
          hint="Monthly organic visitors"
          emphasis
        />
        <StatCard label="Keyword Score" value={`${avgSignal || 84}/100`} hint="Avg opportunity strength" />
        <StatCard
          label="AI Algorithms"
          media={<AlgorithmLogos />}
          hint="Optimized for citation across leading AI engines"
        />
        <StatCard
          label="Credits"
          value={credits ? (credits.credits_total - credits.credits_used).toLocaleString() : "—"}
          hint="Remaining this cycle"
        />
      </div>

      <div className="space-y-5">
        <h2 className="text-sm font-semibold text-ink">Content Radar</h2>

        <RadarSection
          label="Selected"
          count={selected.length}
          empty="Nothing queued yet — add an opportunity below."
        >
          {selected.map((opp) => (
            <RadarRow
              key={opp.id}
              opp={opp}
              action={<Pill tone="success"><Check className="h-3 w-3" /> Queued</Pill>}
            />
          ))}
        </RadarSection>

        <RadarSection
          label="Add to Queue"
          count={opportunities.length}
          empty="No new opportunities right now — check back soon."
        >
          {opportunities.map((opp) => (
            <RadarRow
              key={opp.id}
              opp={opp}
              action={
                <Button onClick={() => addToQueue(opp)}>
                  <Plus className="h-4 w-4" /> Add to Queue
                </Button>
              }
            />
          ))}
        </RadarSection>
      </div>
    </div>
  );
}