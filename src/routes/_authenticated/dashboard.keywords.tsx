import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { listKeywords, addKeyword, deleteKeyword, createBlog, type Keyword } from "@/lib/api";
import {
  Panel,
  Pill,
  Button,
  PageHeader,
  MetricCard,
  Tabs,
  EmptyState,
} from "@/components/dashboard/primitives";
import { MeterBar } from "@/components/dashboard/signals";
import {
  AddIcon,
  RemoveIcon,
  BeamIcon,
  TrendIcon,
  SignalIcon,
  TargetIcon,
  VoltMark,
} from "@/components/dashboard/icons";

export const Route = createFileRoute("/_authenticated/dashboard/keywords")({
  component: KeywordPlanner,
});

type Tab = "library" | "discovered";

function trendTone(trend: string): "success" | "warning" | "neutral" {
  const t = trend.toLowerCase();
  if (t === "high") return "success";
  if (t === "medium") return "warning";
  return "neutral";
}

function isHighIntent(k: Keyword): boolean {
  const i = (k.intent ?? "").toLowerCase();
  return i.includes("transactional") || i.includes("high") || i.includes("commercial");
}

function opportunityScore(k: Keyword): number {
  const volume = Math.min(40, (Math.log10(Math.max(1, k.search_volume)) / 5) * 40);
  const intent = isHighIntent(k) ? 35 : (k.intent ?? "").toLowerCase().includes("local") ? 28 : 18;
  const t = (k.trend ?? "").toLowerCase();
  const trend = t.includes("high") ? 25 : t.includes("medium") ? 16 : 8;
  return Math.round(Math.min(100, volume + intent + trend));
}

function scoreTone(score: number): "volt" | "success" | "warning" {
  if (score >= 75) return "success";
  if (score >= 50) return "volt";
  return "warning";
}

function KeywordPlanner() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("library");
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data: keywords = [], isLoading } = useQuery({
    queryKey: ["keywords", tab],
    queryFn: () => listKeywords(tab),
  });

  const totalVolume = keywords.reduce((s, k) => s + (k.search_volume ?? 0), 0);
  const highIntent = keywords.filter(isHighIntent).length;

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "library", label: "Library", count: tab === "library" ? keywords.length : 0 },
    { id: "discovered", label: "Discovered", count: tab === "discovered" ? keywords.length : 0 },
  ];

  const ranked = useMemo(
    () => [...keywords].sort((a, b) => opportunityScore(b) - opportunityScore(a)),
    [keywords],
  );
  const clusters = useMemo(() => {
    if (tab !== "discovered") return null;
    const map = new Map<string, Keyword[]>();
    for (const k of ranked) {
      const key = (k.intent ?? "Other").trim() || "Other";
      const arr = map.get(key) ?? [];
      arr.push(k);
      map.set(key, arr);
    }
    return [...map.entries()];
  }, [ranked, tab]);

  async function add() {
    const name = input.trim();
    if (!name) return;
    setAdding(true);
    try {
      await addKeyword(name, "library", { tag: "Library", trend: "Medium" });
      setInput("");
      toast.success(`Added "${name}" to your library.`);
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
      if (tab !== "library") setTab("library");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add keyword.");
    } finally {
      setAdding(false);
    }
  }

  async function remove(k: Keyword) {
    setBusyId(k.id);
    try {
      await deleteKeyword(k.id);
      toast.success(`Removed "${k.name}".`);
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove keyword.");
    } finally {
      setBusyId(null);
    }
  }

  async function draft(k: Keyword) {
    setBusyId(k.id);
    try {
      const title = k.name.replace(/\b\w/g, (c) => c.toUpperCase());
      await createBlog({
        title,
        description: `Article targeting "${k.name}".`,
        keyword: k.name,
        traffic_estimate: k.traffic_estimate || Math.round(k.search_volume * 0.25),
        competition: isHighIntent(k) ? "High" : "Medium",
        ai_signal: opportunityScore(k),
        status: "opportunity",
        tags: [],
      });
      toast.success(`Drafted an idea for "${k.name}".`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate({ to: "/dashboard/blog-engine" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not draft article.");
    } finally {
      setBusyId(null);
    }
  }

  function Row({ k }: { k: Keyword }) {
    const score = opportunityScore(k);
    return (
      <Panel hover className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{k.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Pill tone="info">
              <SignalIcon className="h-3.5 w-3.5" />
              {k.search_volume.toLocaleString()} vol.
            </Pill>
            {k.traffic_estimate > 0 && (
              <Pill tone="success">
                <TrendIcon className="h-3.5 w-3.5" />
                {k.traffic_estimate.toLocaleString()}/mo
              </Pill>
            )}
            {k.intent && (
              <Pill tone="neutral">
                <TargetIcon className="h-3.5 w-3.5" />
                {k.intent}
              </Pill>
            )}
            <Pill tone={trendTone(k.trend)}>{k.trend} trend</Pill>
          </div>
          <MeterBar value={score} tone={scoreTone(score)} className="mt-3 max-w-xs">
            <div className="flex items-center justify-between text-[0.65rem] font-medium text-muted-foreground">
              <span className="uppercase tracking-wide">Opportunity</span>
              <span className="tabular-nums text-ink">{score}/100</span>
            </div>
          </MeterBar>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button onClick={() => draft(k)} disabled={busyId === k.id}>
            {busyId === k.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <VoltMark className="h-4 w-4" />
            )}
            Draft article
          </Button>
          <Button variant="danger" onClick={() => remove(k)} disabled={busyId === k.id}>
            <RemoveIcon className="h-4 w-4" />
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Keyword Lab"
        description="Track your target keywords and explore the opportunities our AI discovered."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricCard
          label="Keywords"
          value={keywords.length}
          hint={`In ${tab}`}
          icon={<BeamIcon className="h-4 w-4" />}
          emphasis
        />
        <MetricCard
          label="Search Volume"
          value={totalVolume}
          hint="Total monthly searches"
          accentValue
          icon={<SignalIcon className="h-4 w-4" />}
        />
        <MetricCard
          label="High Intent"
          value={highIntent}
          hint="Transactional / commercial"
          icon={<TargetIcon className="h-4 w-4" />}
        />
      </div>

      {tab === "library" && (
        <Panel className="flex flex-wrap items-center gap-2 p-3">
          <div className="relative flex-1">
            <BeamIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Add a keyword to track…"
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button onClick={add} disabled={adding || !input.trim()}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <AddIcon className="h-4 w-4" />}
            Add
          </Button>
        </Panel>
      )}

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {isLoading ? (
        <Panel className="flex items-center justify-center p-12 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </Panel>
      ) : keywords.length === 0 ? (
        <EmptyState
          icon={<BeamIcon className="h-6 w-6" />}
          title={tab === "library" ? "No keywords tracked yet" : "No discovered keywords yet"}
          description={
            tab === "library"
              ? "Add a keyword above to start tracking its opportunity score."
              : "Run onboarding to let our AI surface high-opportunity keywords for your niche."
          }
        />
      ) : clusters ? (
        <div className="space-y-6">
          {clusters.map(([intent, items]) => (
            <div key={intent}>
              <div className="mb-2.5 flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {intent}
                </h3>
                <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[0.62rem] font-semibold tabular-nums text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="grid gap-3">
                {items.map((k) => (
                  <Row key={k.id} k={k} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {ranked.map((k) => (
            <Row key={k.id} k={k} />
          ))}
        </div>
      )}
    </div>
  );
}