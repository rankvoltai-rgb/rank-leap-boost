import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listBlogs, listKeywords } from "@/lib/api";
import { computeVisibility, type EngineScore } from "@/lib/visibility";
import {
  Panel,
  Pill,
  Button,
  PageHeader,
  MetricCard,
  EmptyState,
} from "@/components/dashboard/primitives";
import { ProgressRing } from "@/components/dashboard/rewards";
import { MeterBar } from "@/components/dashboard/signals";
import { RadarIcon, TrendIcon, CheckIcon, TargetIcon, VoltMark } from "@/components/dashboard/icons";
import { AI_ALGORITHM_MARKS } from "@/components/landing/ai-logos";

export const Route = createFileRoute("/_authenticated/dashboard/visibility")({
  head: () => ({
    meta: [
      { title: "Rank — Rankvolt" },
      {
        name: "description",
        content:
          "See how visible your brand is across AI answer engines and which topics to win next.",
      },
    ],
  }),
  component: VisibilityPage,
});

const MARK_BY_NAME = Object.fromEntries(AI_ALGORITHM_MARKS.map((m) => [m.name, m.Mark]));

function scoreTone(score: number): "success" | "volt" | "warning" {
  if (score >= 70) return "success";
  if (score >= 45) return "volt";
  return "warning";
}

function EngineCard({ engine }: { engine: EngineScore }) {
  const Mark = MARK_BY_NAME[engine.name];
  const tone = scoreTone(engine.score);
  return (
    <Panel className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card shadow-sm">
            {Mark ? <Mark className="h-5 w-5" /> : <RadarIcon className="h-5 w-5" />}
          </span>
          <span className="text-sm font-semibold text-ink">{engine.name}</span>
        </div>
        {engine.delta > 0 && (
          <Pill tone="success">
            <TrendIcon className="h-3 w-3" />+{engine.delta}
          </Pill>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-3xl font-semibold tabular-nums text-ink">{engine.score}</p>
        <span className="pb-1 text-[0.65rem] uppercase tracking-wide text-muted-foreground">
          / 100 citability
        </span>
      </div>
      <MeterBar value={engine.score} tone={tone} />
    </Panel>
  );
}

function VisibilityPage() {
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs", "all"],
    queryFn: () => listBlogs(),
  });
  const { data: kwLibrary = [] } = useQuery({
    queryKey: ["keywords", "library"],
    queryFn: () => listKeywords("library"),
  });
  const { data: kwDiscovered = [] } = useQuery({
    queryKey: ["keywords", "discovered"],
    queryFn: () => listKeywords("discovered"),
  });

  const model = useMemo(
    () => computeVisibility(blogs, [...kwLibrary, ...kwDiscovered]),
    [blogs, kwLibrary, kwDiscovered],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rank"
        description="An estimate of how citable your content is across AI answer engines — and the topics to win next."
      />

      <Panel className="relative overflow-hidden p-5 sm:p-6">
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-volt to-transparent" />
        <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <div className="flex items-center gap-4">
            <ProgressRing value={model.overall} max={100} size={96} stroke={8}>
              <span className="text-2xl font-semibold tabular-nums text-ink">{model.overall}</span>
            </ProgressRing>
            <div>
              <div className="flex items-center gap-2">
                <RadarIcon className="h-4 w-4 text-volt" accent />
                <h2 className="text-base font-semibold text-ink">Overall visibility</h2>
              </div>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Estimated from your {model.citableArticles} published{" "}
                {model.citableArticles === 1 ? "article" : "articles"} and how well they're
                structured to be cited by AI.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Pill tone="info">Updated from your live content</Pill>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricCard
          label="Citable Articles"
          value={model.citableArticles}
          hint="Published & answer-ready"
          icon={<CheckIcon className="h-4 w-4" />}
          emphasis
        />
        <MetricCard
          label="Topics Owned"
          value={model.owned.length}
          hint="You're the answer here"
          icon={<TargetIcon className="h-4 w-4" />}
        />
        <MetricCard
          label="Topics To Win"
          value={model.toWin.length}
          hint="Gaps ready to capture"
          icon={<RadarIcon className="h-4 w-4" />}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">By answer engine</h2>
        {isLoading ? (
          <Panel className="p-12 text-center text-sm text-muted-foreground">Loading…</Panel>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {model.engines.map((e) => (
              <EngineCard key={e.name} engine={e} />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-ink">Topics you own</h2>
          {model.owned.length === 0 ? (
            <EmptyState
              icon={<TargetIcon className="h-6 w-6" />}
              title="Nothing cited yet"
              description="Publish articles and they'll start showing up here as topics you own."
              action={
                <Link to="/dashboard/blog-engine">
                  <Button>Go to Articles</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {model.owned.map((t) => (
                <Panel key={t.id} hover className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{t.title}</p>
                    {t.keyword && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.keyword}</p>
                    )}
                  </div>
                  <Pill tone="success">{t.signal} signal</Pill>
                </Panel>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-ink">Topics to win</h2>
          {model.toWin.length === 0 ? (
            <EmptyState
              icon={<RadarIcon className="h-6 w-6" />}
              title="No open gaps right now"
              description="Explore Keyword Lab to surface new topics you can become the answer for."
              action={
                <Link to="/dashboard/keywords">
                  <Button>Open Keyword Lab</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {model.toWin.map((t) => (
                <Panel key={t.id} hover className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{t.title}</p>
                    {t.keyword && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.keyword}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Pill tone="warning">{t.signal} potential</Pill>
                    <Link to="/dashboard/keywords">
                      <Button variant="ghost">
                        <VoltMark className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}