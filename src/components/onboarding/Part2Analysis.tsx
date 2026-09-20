/**
 * Step 2 — Keywords.
 *
 * Runs the site analysis, then shows everything it produced: the keyword set
 * (editable) plus the context that drives article quality — niche, audience,
 * geo, competitors, semantic clusters and current AI visibility — tucked behind
 * one disclosure, because the decision on this step is the keyword set.
 *
 * Rows read as a list, not a spreadsheet: intent and trend are shown, not
 * edited, and search volume is data rather than an input — typing over it only
 * inflated the projection.
 */
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Minus,
  Plus,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Field, TextareaField } from "@/components/ui/field";
import { analyzeSite, type DraftKeyword, type SiteAnalysis } from "@/lib/data";
import { domainOf } from "@/lib/site-meta";
import { reducedMotion } from "./constants";
import { ActionBar, PRIMARY_BUTTON, StepHeader } from "./shell";

const SCAN_STEPS = [
  "Fetching your pages",
  "Reading your positioning",
  "Mapping buyer questions",
  "Sizing the keyword set",
  "Checking AI answer coverage",
];

function Scanning({ done }: { done: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => {
      // Hold one short of the end until the real work finishes.
      setStep((s) => Math.min(s + 1, SCAN_STEPS.length - (done ? 1 : 2)));
    }, 900);
    return () => window.clearInterval(id);
  }, [done]);

  const progress = done ? 100 : Math.round(((step + 0.6) / SCAN_STEPS.length) * 100);

  return (
    <div aria-live="polite">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-1 sm:p-7">
        <div
          role="progressbar"
          aria-label="Analyzing your site"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-1 overflow-hidden rounded-full bg-secondary"
        >
          <div
            className="h-full rounded-full bg-brand-blue transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="mt-6 space-y-3.5">
          {SCAN_STEPS.map((label, i) => {
            const complete = i < step || done;
            const active = i === step && !done;
            return (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {complete ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm transition-colors",
                    complete
                      ? "text-ink"
                      : active
                        ? "font-medium text-ink"
                        : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      {/* The shape of what's coming, so the wait reads as progress. */}
      <div aria-hidden className="mt-4 space-y-2 opacity-60">
        {[88, 72, 80, 64].map((w) => (
          <div
            key={w}
            className="flex items-center gap-4 rounded-xl border border-border/70 bg-card px-4 py-3.5"
          >
            <span className="h-3 rounded-full bg-shimmer" style={{ width: `${w * 0.5}%` }} />
            <span className="ml-auto h-3 w-12 rounded-full bg-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

const INTENT_TONE: Record<string, string> = {
  Commercial: "bg-brand-blue/10 text-brand-blue",
  Transactional: "bg-success/10 text-success",
  Informational: "bg-secondary text-muted-foreground",
  Navigational: "bg-secondary text-muted-foreground",
};

function Trend({ trend }: { trend: string }) {
  const Icon = trend === "Rising" ? TrendingUp : trend === "Declining" ? TrendingDown : Minus;
  return (
    <span
      title={trend}
      className={cn(
        "flex justify-center",
        trend === "Rising" && "text-success",
        trend === "Declining" && "text-flame",
        trend !== "Rising" && trend !== "Declining" && "text-muted-foreground/60",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="sr-only">{trend}</span>
    </span>
  );
}

const ROW =
  "grid grid-cols-[minmax(0,1fr)_4rem_1.25rem_1.75rem] items-center gap-2.5 sm:grid-cols-[minmax(0,1fr)_7rem_4.5rem_1.25rem_1.75rem] sm:gap-3";

function KeywordRow({
  kw,
  onRename,
  onRemove,
}: {
  kw: DraftKeyword;
  onRename: (name: string) => void;
  onRemove: () => void;
}) {
  return (
    <li className={cn(ROW, "group px-4 py-2 transition-colors hover:bg-surface/70")}>
      {/* A one-line textarea so long keywords wrap instead of truncating on
          narrow screens; Enter finishes the edit rather than adding a line. */}
      <textarea
        value={kw.name}
        rows={1}
        onChange={(e) => onRename(e.target.value.replace(/\n/g, " "))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        aria-label="Keyword"
        className="-mx-1.5 block min-w-0 resize-none rounded-md bg-transparent px-1.5 py-1 text-sm leading-snug text-ink outline-none transition-colors [field-sizing:content] focus:bg-secondary"
      />
      <span className="hidden sm:block">
        <span
          className={cn(
            "inline-flex rounded-md px-1.5 py-0.5 text-[0.7rem] font-medium",
            INTENT_TONE[kw.intent] ?? INTENT_TONE.Informational,
          )}
        >
          {kw.intent}
        </span>
      </span>
      <span className="text-right">
        {kw.search_volume > 0 ? (
          <span className="text-sm tabular-nums text-ink">{kw.search_volume.toLocaleString()}</span>
        ) : (
          <span
            className="text-sm text-muted-foreground"
            title="No search data yet for keywords you add"
          >
            —
          </span>
        )}
      </span>
      <Trend trend={kw.trend} />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${kw.name}`}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-secondary hover:text-destructive focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}

function InsightList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warn";
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-sm leading-snug text-ink">
            <span
              className={cn(
                "mt-[0.45rem] h-1 w-1 shrink-0 rounded-full",
                tone === "warn" ? "bg-flame" : "bg-brand-blue",
              )}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface Part2Value {
  niche: string;
  audience: string;
  brandTone: string;
  geo: string;
  services: string[];
  competitors: string[];
  semanticClusters: string[];
  aiVisibility: string[];
  missingOpportunities: string[];
  keywords: DraftKeyword[];
  analyzedUrl: string;
}

/**
 * Everything the analysis learned beyond keywords, behind one line: it briefs
 * every article, but most people only need to know it's there.
 */
function BrandContext({
  brandName,
  value,
  onChange,
}: {
  brandName: string;
  value: Part2Value;
  onChange: (patch: Partial<Part2Value>) => void;
}) {
  const [open, setOpen] = useState(false);
  const summary = [
    value.niche,
    value.geo,
    value.competitors.length ? `${value.competitors.length} competitors` : "",
    value.missingOpportunities.length ? `${value.missingOpportunities.length} content gaps` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-surface"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">
            What we learned about {brandName.trim() || "your brand"}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {summary || "Niche, audience and voice, used to brief every article"}
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          {open ? "Hide" : "Review"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="space-y-7 border-t border-border px-5 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Niche" value={value.niche} onChange={(v) => onChange({ niche: v })} />
            <Field label="Market" value={value.geo} onChange={(v) => onChange({ geo: v })} />
            <TextareaField
              className="sm:col-span-2"
              label="Who you're writing for"
              value={value.audience}
              onChange={(v) => onChange({ audience: v })}
              rows={2}
            />
            <TextareaField
              className="sm:col-span-2"
              label="Brand voice"
              value={value.brandTone}
              onChange={(v) => onChange({ brandTone: v })}
              rows={2}
              hint="Every article is written in this tone"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <InsightList title="Content gaps" items={value.missingOpportunities} tone="warn" />
            <InsightList title="Who you're up against" items={value.competitors} />
            <InsightList title="Topic clusters" items={value.semanticClusters} />
            <InsightList title="AI visibility today" items={value.aiVisibility} />
          </div>
        </div>
      )}
    </div>
  );
}

export function Part2Analysis({
  url,
  brandName,
  description,
  value,
  onChange,
  onNext,
  onBack,
}: {
  url: string;
  brandName: string;
  description: string;
  value: Part2Value;
  onChange: (patch: Partial<Part2Value>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  // Keywords for a different site (the user went back and changed it) are stale.
  const hasAnalysis = value.keywords.length > 0 && value.analyzedUrl === url;
  const [scanning, setScanning] = useState(!hasAnalysis);
  const [scanDone, setScanDone] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const started = useRef(false);
  // The route mounts, unmounts and remounts once before settling. `started`
  // survives that (it is a ref), so the fetch fires only once — which means a
  // per-effect `cancelled` closure would be left set by the discarded first
  // pass and would swallow the only result. This re-arms on every run and is
  // only left false by a genuine unmount.
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    if (hasAnalysis || started.current) return;
    started.current = true;
    (async () => {
      try {
        const a: SiteAnalysis = await analyzeSite({ url, brandName, description });
        if (!alive.current) return;
        setScanDone(true);
        onChange({
          niche: a.niche,
          audience: a.audience,
          brandTone: a.brand_tone,
          geo: a.geo,
          services: a.services,
          competitors: a.competitors,
          semanticClusters: a.semantic_clusters,
          aiVisibility: a.ai_visibility,
          missingOpportunities: a.missing_opportunities,
          keywords: a.keywords,
          analyzedUrl: url,
        });
        // Let the final tick land before swapping views.
        window.setTimeout(() => alive.current && setScanning(false), 500);
      } catch {
        if (alive.current) {
          toast.error("Analysis failed. You can still add keywords by hand.");
          setScanning(false);
        }
      }
    })();
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Undo reads the list as it is when clicked, not as it was when removed.
  const latestKeywords = useRef(value.keywords);
  latestKeywords.current = value.keywords;

  const domain = url.trim() ? domainOf(url) : "your site";

  if (scanning) {
    return (
      <>
        <StepHeader
          n={2}
          title={`Reading ${domain}…`}
          subtitle="Mapping the questions your buyers ask search and AI. This takes about 20 seconds."
        />
        <Scanning done={scanDone} />
      </>
    );
  }

  const totalVolume = value.keywords.reduce((s, k) => s + k.search_volume, 0);

  function addKeyword() {
    const name = newKeyword.trim().toLowerCase();
    if (!name) return;
    if (value.keywords.some((k) => k.name.toLowerCase() === name)) {
      toast.error("That keyword is already in the list.");
      return;
    }
    onChange({
      keywords: [
        ...value.keywords,
        {
          id: `kw-manual-${Date.now()}`,
          name,
          // Left at zero rather than inventing a number — the old flow
          // hard-coded 800 searches for anything typed by hand.
          search_volume: 0,
          intent: "Commercial",
          trend: "Steady",
          manual: true,
        },
      ],
    });
    setNewKeyword("");
  }

  function removeKeyword(kw: DraftKeyword) {
    const index = value.keywords.findIndex((k) => k.id === kw.id);
    onChange({ keywords: value.keywords.filter((k) => k.id !== kw.id) });
    toast(`Removed “${kw.name}”`, {
      action: {
        label: "Undo",
        onClick: () => {
          const now = latestKeywords.current;
          if (now.some((k) => k.id === kw.id)) return;
          const next = [...now];
          next.splice(Math.min(index, next.length), 0, kw);
          onChange({ keywords: next });
        },
      },
    });
  }

  return (
    <motion.div
      initial={reducedMotion() ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StepHeader
        n={2}
        title="Pick the searches to win"
        subtitle={
          value.keywords.length
            ? `We found ${value.keywords.length} searches your buyers make. Remove any that don't fit, or add your own. Each one becomes an article.`
            : "Add the searches you want to win. Each one becomes an article."
        }
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-1">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
          <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword();
              }
            }}
            aria-label="Add a keyword"
            placeholder="Add a keyword you know converts"
            className="h-9 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted-foreground"
          />
          {newKeyword.trim() && (
            <button
              type="button"
              onClick={addKeyword}
              className="inline-flex h-8 shrink-0 items-center rounded-lg bg-ink px-3 text-xs font-semibold text-background transition-opacity hover:opacity-85"
            >
              Add
            </button>
          )}
        </div>

        <div
          className={cn(
            ROW,
            "border-b border-border bg-surface/60 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
          )}
        >
          <span>{value.keywords.length} keywords</span>
          <span className="hidden sm:block">Intent</span>
          <span className="text-right">Searches</span>
          <span className="sr-only">Trend</span>
          <span />
        </div>

        {value.keywords.length ? (
          <ul className="divide-y divide-border/70">
            {value.keywords.map((kw) => (
              <KeywordRow
                key={kw.id}
                kw={kw}
                onRename={(name) =>
                  onChange({
                    keywords: value.keywords.map((k) => (k.id === kw.id ? { ...k, name } : k)),
                  })
                }
                onRemove={() => removeKeyword(kw)}
              />
            ))}
          </ul>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No keywords yet. Add one above to build your plan.
          </p>
        )}

        <div className="flex items-center justify-between border-t border-border bg-surface/60 px-4 py-2.5 text-xs text-muted-foreground">
          <span>Monthly searches, all keywords</span>
          <span className="font-semibold tabular-nums text-ink">
            {totalVolume.toLocaleString()}
          </span>
        </div>
      </div>

      <BrandContext brandName={brandName} value={value} onChange={onChange} />

      <ActionBar
        onBack={onBack}
        note={
          <span className="hidden sm:inline">
            {value.keywords.length} articles, one per keyword
          </span>
        }
      >
        <button
          type="button"
          disabled={value.keywords.length === 0}
          onClick={onNext}
          className={PRIMARY_BUTTON}
        >
          Build my plan
          <ArrowRight className="h-4 w-4" />
        </button>
      </ActionBar>
    </motion.div>
  );
}
