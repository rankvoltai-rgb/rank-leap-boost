/**
 * Part 2 — What we found.
 *
 * Runs the site analysis, then shows everything it produced: the keyword set
 * (fully editable) plus the context that drives article quality — niche,
 * audience, geo, competitors, semantic clusters and current AI visibility.
 * The previous onboarding threw all of that away and showed twelve bare
 * keyword names.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Field, TextareaField } from "@/components/ui/field";
import { analyzeSite, type DraftKeyword, type SiteAnalysis } from "@/lib/data";
import { reducedMotion } from "./constants";

const SCAN_STEPS = [
  "Fetching your pages",
  "Reading your positioning",
  "Mapping buyer questions",
  "Sizing the keyword set",
  "Checking AI answer coverage",
];

const INTENTS = ["Commercial", "Informational", "Transactional", "Navigational"];
const TRENDS = ["Rising", "Steady", "Declining"];

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

  return (
    <div className="max-w-xl">
      <ol className="space-y-2.5">
        {SCAN_STEPS.map((label, i) => {
          const complete = i < step || done;
          const active = i === step && !done;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                complete
                  ? "border-border bg-card"
                  : active
                    ? "border-brand-blue/40 bg-brand-blue/5"
                    : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-semibold",
                  complete && "bg-brand-blue/10 text-brand-blue",
                  active && "bg-brand-blue text-white",
                  !complete && !active && "border border-border text-muted-foreground",
                )}
              >
                {complete ? (
                  <Check className="h-3.5 w-3.5" />
                ) : active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "text-sm",
                  complete || active ? "font-medium text-ink" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function KeywordRow({
  kw,
  onPatch,
  onRemove,
}: {
  kw: DraftKeyword;
  onPatch: (patch: Partial<DraftKeyword>) => void;
  onRemove: () => void;
}) {
  return (
    <tr className="group border-b border-border last:border-0">
      <td className="py-1.5 pl-3 pr-2">
        <input
          value={kw.name}
          onChange={(e) => onPatch({ name: e.target.value })}
          aria-label="Keyword"
          title={kw.name}
          className="w-full rounded-md bg-transparent px-1.5 py-1 text-[0.82rem] text-ink outline-none transition-colors hover:bg-secondary/60 focus:bg-secondary focus:ring-2 focus:ring-volt/20"
        />
      </td>
      <td className="whitespace-nowrap px-2 py-1.5 text-right tabular-nums">
        <input
          value={kw.search_volume === 0 ? "" : String(kw.search_volume)}
          placeholder="—"
          inputMode="numeric"
          onChange={(e) => {
            const n = Number(e.target.value.replace(/[^\d]/g, ""));
            onPatch({ search_volume: Number.isFinite(n) ? n : 0 });
          }}
          aria-label="Monthly searches"
          className="w-14 rounded-md bg-transparent px-1 py-1 text-right text-[0.82rem] text-muted-foreground outline-none transition-colors hover:bg-secondary/60 focus:bg-secondary focus:text-ink focus:ring-2 focus:ring-volt/20"
        />
      </td>
      <td className="whitespace-nowrap px-2 py-1.5">
        <select
          value={kw.intent}
          onChange={(e) => onPatch({ intent: e.target.value })}
          aria-label="Intent"
          className="max-w-[7.5rem] rounded-md border-0 bg-transparent px-0.5 py-1 text-xs text-muted-foreground outline-none transition-colors hover:bg-secondary/60 focus:bg-secondary focus:ring-2 focus:ring-volt/20"
        >
          {INTENTS.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </td>
      <td className="whitespace-nowrap px-2 py-1.5">
        <select
          value={kw.trend}
          onChange={(e) => onPatch({ trend: e.target.value })}
          aria-label="Trend"
          className="cursor-pointer rounded-md border-0 bg-transparent p-0 text-xs outline-none"
        >
          {TRENDS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </td>
      <td className="w-10 pr-2 text-right">
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${kw.name}`}
          className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus:opacity-100 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </td>
    </tr>
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
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-sm leading-snug text-ink">
            <span
              className={cn(
                "mt-1.5 h-1 w-1 shrink-0 rounded-full",
                tone === "warn" ? "bg-flame" : "bg-volt",
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
 * Everything the analysis learned beyond keywords, tucked behind one line: it
 * briefs every article, but the decision on this step is the keyword set.
 */
function BrandContext({
  value,
  onChange,
}: {
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
    <div className="mt-5 rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">What we learned about your brand</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {summary || "Niche, audience and voice — used to brief every article"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="space-y-6 border-t border-border px-4 py-5">
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
          <div className="grid gap-5 sm:grid-cols-2">
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
}: {
  url: string;
  brandName: string;
  description: string;
  value: Part2Value;
  onChange: (patch: Partial<Part2Value>) => void;
  onNext: () => void;
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

  if (scanning) return <Scanning done={scanDone} />;

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

  return (
    <motion.div
      initial={reducedMotion() ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-1">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/30 px-4 py-2.5">
          <p className="text-sm font-semibold text-ink">{value.keywords.length} keywords</p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {totalVolume.toLocaleString()} monthly searches
          </p>
        </div>

        <div className="max-h-[26rem] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border text-left">
                <th className="w-full py-2 pl-4 pr-2 text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                  Keyword
                </th>
                <th className="whitespace-nowrap px-2 py-2 text-right text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                  Searches
                </th>
                <th className="whitespace-nowrap px-2 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                  Intent
                </th>
                <th className="whitespace-nowrap px-2 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                  Trend
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {value.keywords.map((kw) => (
                <KeywordRow
                  key={kw.id}
                  kw={kw}
                  onPatch={(patch) =>
                    onChange({
                      keywords: value.keywords.map((k) =>
                        k.id === kw.id ? { ...k, ...patch } : k,
                      ),
                    })
                  }
                  onRemove={() =>
                    onChange({ keywords: value.keywords.filter((k) => k.id !== kw.id) })
                  }
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 border-t border-border bg-secondary/20 px-3 py-2.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="Add a keyword you know converts…"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={addKeyword}
            disabled={!newKeyword.trim()}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-ink transition-colors hover:bg-secondary disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>

      <BrandContext value={value} onChange={onChange} />

      <div className="mt-8 flex items-center justify-end gap-4">
        <p className="hidden text-xs text-muted-foreground sm:block">One article per keyword</p>
        <button
          type="button"
          disabled={value.keywords.length === 0}
          onClick={onNext}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-white shadow-2 transition-all hover:-translate-y-0.5 hover:bg-brand-blue/90 disabled:translate-y-0 disabled:opacity-50"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
