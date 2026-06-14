import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, TrendingUp } from "lucide-react";
import {
  listBlogs,
  getCredits,
  addOpportunityToQueue,
  type Blog,
} from "@/lib/api";
import { Panel, StatCard, Pill, Button, PageHeader } from "@/components/dashboard/primitives";
import { CountUp } from "@/components/ui/count-up";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: SystemConsole,
});

function SystemConsole() {
  const queryClient = useQueryClient();
  const [bonus, setBonus] = useState(0);
  const { data: opportunities = [] } = useQuery({
    queryKey: ["blogs", "opportunity"],
    queryFn: () => listBlogs("opportunity"),
  });
  const { data: finished = [] } = useQuery({
    queryKey: ["blogs", "finished"],
    queryFn: () => listBlogs("finished"),
  });
  const { data: credits } = useQuery({ queryKey: ["credits"], queryFn: getCredits });

  const baseTraffic = finished.reduce((sum, b) => sum + (b.traffic_estimate ?? 0), 0);
  const avgSignal = opportunities.length
    ? Math.round(
        opportunities.reduce((s, b) => s + (b.ai_signal ?? 0), 0) / opportunities.length,
      )
    : 0;

  async function addToQueue(opp: Blog) {
    try {
      const gained = await addOpportunityToQueue(opp);
      setBonus((b) => b + gained);
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
          value={<CountUp value={baseTraffic + bonus} className="text-gradient-traffic" />}
          hint="Monthly organic visitors"
          emphasis
        />
        <StatCard label="Keyword Score" value={`${avgSignal || 84}/100`} hint="Avg opportunity strength" />
        <StatCard label="AI Signals" value={opportunities.length} hint="Live content radar hits" />
        <StatCard
          label="Credits"
          value={credits ? (credits.credits_total - credits.credits_used).toLocaleString() : "—"}
          hint="Remaining this cycle"
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Content Radar</h2>
        {opportunities.length === 0 ? (
          <Panel className="p-8 text-center text-sm text-muted-foreground">
            No opportunities right now — check back soon.
          </Panel>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opp) => (
              <Panel key={opp.id} className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold leading-snug text-ink">{opp.title}</h3>
                  <Pill tone="info">{opp.ai_signal} AI</Pill>
                </div>
                <p className="text-xs text-muted-foreground">{opp.keyword}</p>
                <div className="flex items-center gap-2">
                  <Pill tone="success">
                    <TrendingUp className="h-3 w-3" />
                    {opp.traffic_estimate.toLocaleString()}/mo
                  </Pill>
                  <Pill tone="neutral">{opp.competition ?? "—"} comp.</Pill>
                </div>
                <Button className="mt-1 w-full" onClick={() => addToQueue(opp)}>
                  <Plus className="h-4 w-4" /> Add to Queue
                </Button>
              </Panel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}