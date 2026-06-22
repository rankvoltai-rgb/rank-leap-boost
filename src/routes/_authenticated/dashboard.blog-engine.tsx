import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { listBlogs, generateBlogArticle, type Blog } from "@/lib/api";
import {
  Panel,
  Pill,
  Button,
  PageHeader,
  Tabs,
  MetricCard,
  EmptyState,
} from "@/components/dashboard/primitives";
import { AiSignalFlames, DifficultyBar } from "@/components/dashboard/signals";
import { Confetti } from "@/components/dashboard/rewards";
import {
  ArticleIcon,
  VoltMark,
  TrendIcon,
  AutopilotIcon,
  PublishIcon,
  TargetIcon,
} from "@/components/dashboard/icons";

export const Route = createFileRoute("/_authenticated/dashboard/blog-engine")({
  component: BlogEngine,
});

type Tab = "opportunity" | "queue" | "finished";

function BlogEngine() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("queue");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);

  const { data: all = [], isLoading } = useQuery({
    queryKey: ["blogs", "all"],
    queryFn: () => listBlogs(),
  });

  const ideas = useMemo(() => all.filter((b) => b.status === "opportunity"), [all]);
  const queue = useMemo(
    () => all.filter((b) => b.status === "scheduled" || b.status === "generating"),
    [all],
  );
  const finished = useMemo(() => all.filter((b) => b.status === "finished"), [all]);

  const visible = tab === "opportunity" ? ideas : tab === "queue" ? queue : finished;

  const totalTraffic = all.reduce((s, b) => s + (b.traffic_estimate ?? 0), 0);
  const avgSeo = finished.length
    ? Math.round(finished.reduce((s, b) => s + (b.seo_score ?? 0), 0) / finished.length)
    : 0;

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "queue", label: "Scheduled", count: queue.length },
    { id: "opportunity", label: "Ideas", count: ideas.length },
    { id: "finished", label: "Published", count: finished.length },
  ];

  async function generate(blog: Blog) {
    setBusyId(blog.id);
    try {
      await generateBlogArticle(blog);
      setConfettiKey((k) => k + 1);
      toast.success(`"${blog.title}" is ready — opening the editor.`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      setTimeout(() => {
        navigate({ to: "/dashboard/editor/$blogId", params: { blogId: blog.id } });
      }, 900);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed.");
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Confetti fireKey={confettiKey} />
      <PageHeader
        title="Articles"
        description="Everything autopilot is writing for you — plus ideas you can queue and drafts you can refine."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Projected Traffic"
          value={totalTraffic}
          hint="Est. monthly visitors across all articles"
          accentValue
          emphasis
        />
        <MetricCard
          label="Published"
          value={finished.length}
          hint="Live articles"
          icon={<PublishIcon className="h-4 w-4" />}
        />
        <MetricCard
          label="In Motion"
          value={queue.length}
          hint="Scheduled & auto-writing"
          icon={<AutopilotIcon className="h-4 w-4" />}
        />
        <MetricCard
          label="Avg SEO Score"
          value={avgSeo}
          hint={finished.length ? "Across published" : "Publish to score"}
          icon={<TargetIcon className="h-4 w-4" />}
          ring={{ value: avgSeo, max: 100 }}
        />
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {isLoading ? (
        <Panel className="flex items-center justify-center p-12 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </Panel>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<ArticleIcon className="h-6 w-6" />}
          title={
            tab === "opportunity"
              ? "No ideas waiting"
              : tab === "queue"
                ? "Nothing scheduled yet"
                : "No published articles yet"
          }
          description={
            tab === "finished"
              ? "Write an article from your queue and it will appear here, ready to share."
              : "Autopilot fills this automatically. You can also add opportunities from your Overview."
          }
          action={
            <Link to="/dashboard">
              <Button>Go to Overview</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3">
          {visible.map((b) => (
            <Panel
              key={b.id}
              hover
              className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{b.title}</p>
                  {b.status === "scheduled" && (
                    <Pill tone="neutral">
                      <AutopilotIcon className="h-3 w-3" /> Autopilot
                    </Pill>
                  )}
                </div>
                {b.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {b.description}
                  </p>
                )}
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {b.status === "generating" && (
                    <Pill tone="info">
                      <Loader2 className="h-3 w-3 animate-spin" /> Auto-writing
                    </Pill>
                  )}
                  <Pill tone="success">
                    <TrendIcon className="h-3 w-3" />
                    {b.traffic_estimate.toLocaleString()}/mo
                  </Pill>
                  {b.status === "finished" && <Pill tone="ink">SEO {b.seo_score}</Pill>}
                  <DifficultyBar label={b.competition} />
                  <AiSignalFlames signal={b.ai_signal ?? 0} />
                  {b.keyword && <Pill tone="neutral">{b.keyword}</Pill>}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {b.status === "finished" ? (
                  <Button
                    onClick={() =>
                      navigate({ to: "/dashboard/editor/$blogId", params: { blogId: b.id } })
                    }
                  >
                    <ArticleIcon className="h-4 w-4" /> Open Editor
                  </Button>
                ) : b.status === "generating" ? (
                  <Pill tone="info">
                    <Loader2 className="h-3 w-3 animate-spin" /> Writing
                  </Pill>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        navigate({ to: "/dashboard/editor/$blogId", params: { blogId: b.id } })
                      }
                    >
                      <ArticleIcon className="h-4 w-4" /> Edit
                    </Button>
                    <Button onClick={() => generate(b)} disabled={busyId === b.id}>
                      {busyId === b.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Writing…
                        </>
                      ) : (
                        <>
                          <VoltMark className="h-4 w-4" /> Write now
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}