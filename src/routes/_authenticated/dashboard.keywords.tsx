import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { listKeywords, addKeyword, deleteKeyword, type Keyword } from "@/lib/api";
import { Panel, Pill, Button, PageHeader, StatCard } from "@/components/dashboard/primitives";
import {
  AddIcon,
  RemoveIcon,
  BeamIcon,
  TrendIcon,
  SignalIcon,
  TargetIcon,
} from "@/components/dashboard/icons";

export const Route = createFileRoute("/_authenticated/dashboard/keywords")({
  component: KeywordPlanner,
});

type Tab = "library" | "discovered";

const TABS: { id: Tab; label: string }[] = [
  { id: "library", label: "Library" },
  { id: "discovered", label: "Discovered" },
];

function trendTone(trend: string): "success" | "warning" | "neutral" {
  const t = trend.toLowerCase();
  if (t === "high") return "success";
  if (t === "medium") return "warning";
  return "neutral";
}

function isHighIntent(k: Keyword): boolean {
  const i = (k.intent ?? "").toLowerCase();
  return i.includes("transactional") || i.includes("high");
}

function KeywordPlanner() {
  const queryClient = useQueryClient();
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Keyword Lab"
        description="Track your target keywords and explore the opportunities our AI discovered."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Keywords" value={keywords.length} hint={`In ${tab}`} emphasis icon={<BeamIcon className="h-4 w-4" />} />
        <StatCard label="Search Volume" value={totalVolume.toLocaleString()} hint="Total monthly searches" icon={<SignalIcon className="h-4 w-4" />} />
        <StatCard label="High Intent" value={highIntent} hint="Transactional / high-intent" icon={<TargetIcon className="h-4 w-4" />} />
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

      <div className="flex gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all " +
              (tab === t.id
                ? "bg-ink text-background shadow-sm"
                : "text-muted-foreground hover:text-ink")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Panel className="flex items-center justify-center p-12 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </Panel>
      ) : keywords.length === 0 ? (
        <Panel className="p-12 text-center text-sm text-muted-foreground">
          {tab === "library"
            ? "No keywords yet — add one above to start tracking."
            : "No discovered keywords yet. Run onboarding to let our AI surface opportunities."}
        </Panel>
      ) : (
        <div className="grid gap-3">
          {keywords.map((k) => (
            <Panel key={k.id} hover className="flex flex-wrap items-center justify-between gap-4 p-4">
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
              </div>
              <Button variant="danger" onClick={() => remove(k)} disabled={busyId === k.id}>
                {busyId === k.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RemoveIcon className="h-4 w-4" />
                )}
                Remove
              </Button>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}