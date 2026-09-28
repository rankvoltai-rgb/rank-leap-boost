/**
 * /solutions/aeo-tools, section by section. The hero runs a real AEO tool (the
 * AI search readiness check, same server function as /tools), so a visitor
 * searching for AEO tools is using one within a second of landing. Below it,
 * the toolbox: every free tool in the compartment of the job it does.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, ArrowUpRight, Check, Globe, Loader2, Minus } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { ProductMark } from "@/components/compare/kit";
import { ScoreRing, StatusIcon, readAiError } from "@/components/tools/shared";
import { checkAiReadiness, type ReadinessReport } from "@/lib/tools.functions";
import { JOBS, rollingOut, type JobId } from "@/data/solutions/gates";
import { AEO, AEO_TOOL_COUNT, LANDSCAPE } from "@/data/solutions/aeo-tools";
import type { PricedProduct } from "@/data/solutions/market";
import { CATEGORIES } from "@/data/compare/matchups";
import { PRODUCTS } from "@/data/compare/products";
import { RANKBOX_TRACKING } from "@/data/competitors/shared";
import { PLAN, formatUsd } from "@/data/pricing";
import { formatCheckedOn } from "@/data/alternatives";
import { getFeature } from "@/data/features";
import { FeatureLink, Heading, ToolRow } from "./kit";
import { cn } from "@/lib/utils";

/* ---------- 1. Hero aside: a live AEO check ---------- */

const CHECKS = [
  "AI crawler access",
  "llms.txt",
  "Title",
  "Description",
  "H1",
  "Schema",
  "Canonical",
  "Open Graph",
  "Language",
  "Viewport",
  "Visible content",
  "Response",
];

function verdict(score: number): string {
  if (score >= 85) return "AI engines can read and cite this page.";
  if (score >= 60) return "The basics are there. The failed checks are cheap fixes.";
  return "Engines are likely to skip or misread this page.";
}

export function LiveScanner() {
  const run = useServerFn(checkAiReadiness);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<ReadinessReport | null>(null);

  async function scan(target: string) {
    if (!target.trim() || loading) return;
    setLoading(true);
    setError("");
    setReport(null);
    try {
      setReport(await run({ data: { url: target.trim() } }));
    } catch (err) {
      setError(readAiError(err));
    } finally {
      setLoading(false);
    }
  }

  const fixes = report?.checks.filter((c) => c.status === "fail" || c.status === "warn") ?? [];
  const allowed = report?.snapshot.bots.filter((b) => b.allowed).length ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card text-ink shadow-elevation-lg ring-1 ring-ink/5">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface/70 px-5 py-3">
        <p className="text-sm font-semibold">AI search readiness check</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[0.7rem] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Live, free
        </span>
      </div>

      <div className="p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void scan(url);
          }}
          className="flex gap-2"
        >
          <label className="sr-only" htmlFor="aeo-scan-url">
            Page URL to check
          </label>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 focus-within:border-cta focus-within:ring-2 focus-within:ring-cta/20">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              id="aeo-scan-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yoursite.com"
              className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-cta px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cta-hover disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Checking" : "Check"}
          </button>
        </form>

        <div aria-live="polite" className="mt-5">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-ink">{error}</p>
          )}

          {loading && (
            <div className="space-y-2.5" aria-label="Checking the page">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-surface" />
              ))}
            </div>
          )}

          {report && !loading && (
            <div className="space-y-4">
              <ScoreRing
                size={92}
                score={report.score}
                label={`${report.passed} of ${report.checks.length} checks pass`}
                caption={verdict(report.score)}
              />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-ink tabular-nums">
                  {allowed} of {report.snapshot.bots.length}
                </span>{" "}
                AI crawlers allowed by robots.txt
              </p>
              {fixes.length > 0 ? (
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {fixes.slice(0, 3).map((c) => (
                    <li key={c.id} className="flex gap-2.5 px-3 py-2.5">
                      <StatusIcon status={c.status} className="mt-px h-4 w-4" />
                      <span className="min-w-0">
                        <span className="block text-[0.83rem] font-semibold text-ink">
                          {c.label}
                        </span>
                        {c.fix && (
                          <span className="mt-0.5 block text-[0.78rem] leading-snug text-muted-foreground">
                            {c.fix}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg bg-success/10 px-3 py-2.5 text-sm text-ink">
                  Every check passes. The next gate is having a page for each question.
                </p>
              )}
              <Link
                to="/tools/$slug"
                params={{ slug: "ai-search-readiness-check" }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:underline"
              >
                {fixes.length > 3 ? `See all ${fixes.length} fixes` : "Open the full report"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {!report && !loading && !error && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Fetches your page the way an AI crawler does, without JavaScript, and runs{" "}
                {CHECKS.length} checks:
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {CHECKS.map((c) => (
                  <li
                    key={c}
                    className="rounded-md border border-border bg-background px-2 py-1 text-[0.72rem] font-medium text-muted-foreground"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setUrl("rankbox.xyz");
                  void scan("rankbox.xyz");
                }}
                className="mt-4 text-xs font-semibold text-cta hover:underline"
              >
                Try it on rankbox.xyz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- 2. The toolbox ---------- */

export function Toolbox() {
  return (
    <section
      id="toolbox"
      aria-labelledby="toolbox-title"
      className="scroll-mt-24 border-b border-border bg-surface/50 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading id="toolbox-title" title={AEO.toolkitTitle} intro={AEO.toolkitIntro} />

        {/* One box, five compartments: the page's promise, drawn. */}
        <div className="mt-14 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-elevation">
          <div className="flex items-center justify-between gap-4 border-b border-border bg-ink px-6 py-4 text-background">
            <p className="font-display text-sm font-semibold">
              The Rankbox AEO toolbox
              <span className="ml-2 font-sans font-normal text-background/60">
                {AEO_TOOL_COUNT} free tools
              </span>
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1 text-xs font-semibold text-background/80 hover:text-background"
            >
              All free tools
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ol className="divide-y divide-border">
            {JOBS.map((job, i) => (
              <li
                key={job.id}
                id={`job-${job.id}`}
                className="grid scroll-mt-24 gap-6 px-6 py-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-10 lg:py-10"
              >
                <div>
                  <p className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cta-soft font-display text-xs font-semibold tabular-nums text-cta">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">{job.name}</span>
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-ink">
                    {job.question}
                  </h3>
                  <p className="mt-2.5 text-[0.93rem] leading-relaxed text-muted-foreground">
                    {job.why}
                  </p>
                </div>
                <div className="min-w-0">
                  <div className="-mx-3 grid gap-x-4 sm:grid-cols-2">
                    {job.tools.map((t) => (
                      <ToolRow key={t} slug={t} />
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl border border-dashed border-border px-4 py-3.5">
                    <p className="text-xs font-semibold text-ink">
                      {job.features.length > 0 ? "On autopilot in Rankbox" : "In Rankbox"}
                    </p>
                    <p className="mt-1 text-[0.85rem] leading-relaxed text-muted-foreground">
                      {job.rankbox}
                    </p>
                    {job.features.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {job.features.map((f) => (
                          <FeatureLink key={f} slug={f} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. The market ---------- */

const JOB_NAME = Object.fromEntries(JOBS.map((j) => [j.id, j.name])) as Record<JobId, string>;

function Covers({ jobs, auto }: { jobs: JobId[]; auto?: JobId[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Jobs covered">
      {JOBS.map((j) => {
        const on = jobs.includes(j.id);
        const isAuto = auto?.includes(j.id);
        return (
          <li
            key={j.id}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.72rem] font-medium",
              on
                ? isAuto
                  ? "bg-cta text-white"
                  : "bg-cta-soft text-cta ring-1 ring-inset ring-cta/25"
                : "bg-surface text-muted-foreground/70",
            )}
          >
            {on ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {j.name}
            <span className="sr-only">
              {on ? (isAuto ? ", on autopilot" : ", covered") : ", not covered"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function price(p: PricedProduct): string {
  return p.from ? `from ${formatUsd(p.from.monthly)}/mo` : "custom quote";
}

export function Landscape({ priced }: { priced: Record<string, PricedProduct> }) {
  const checked = Object.values(priced)[0]?.checkedOn;
  return (
    <section aria-labelledby="market-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Heading id="market-title" title={AEO.landscapeTitle} intro={AEO.landscapeIntro} />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {LANDSCAPE.map((row, i) => {
            const cat = CATEGORIES.find((c) => c.id === row.category)!;
            return (
              <Reveal key={row.category} delay={i * 0.04} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-ink">{cat.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{row.job}</p>
                  <div className="mt-4">
                    <Covers jobs={row.covers as JobId[]} />
                  </div>
                  <ul className="mt-5 flex-1 divide-y divide-border border-t border-border">
                    {row.products.map((slug) => {
                      const p = priced[slug];
                      if (!p) return null;
                      return (
                        <li key={slug}>
                          <Link
                            to="/compare/$slug"
                            params={{ slug: p.matchup }}
                            className="group flex items-center gap-3 py-3"
                          >
                            <ProductMark product={PRODUCTS[p.slug]} className="h-8 w-8 text-xs" />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-ink group-hover:text-cta">
                                {p.name}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {p.kind}
                              </span>
                            </span>
                            <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-ink">
                              {price(p)}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.08}>
          <div className="mt-5 grid gap-6 rounded-2xl border-2 border-cta/40 bg-cta-soft/40 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Rankbox</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Runs the three jobs that never finish on autopilot, and gives you free tools for the
                other two. {RANKBOX_TRACKING.cell.note}
              </p>
              <div className="mt-4">
                <Covers
                  jobs={["readable", "answered", "liftable", "corroborated", "measured"]}
                  auto={["answered", "liftable", "corroborated"]}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Solid: on autopilot. Tinted: with the free tools.
              </p>
            </div>
            <div className="md:text-right">
              <p className="font-display text-3xl font-bold tracking-tight text-ink">
                {formatUsd(PLAN.monthly)}
                <span className="text-base font-medium text-muted-foreground">/mo</span>
              </p>
              <p className="text-xs text-muted-foreground">one site, everything included</p>
            </div>
          </div>
        </Reveal>

        {checked && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Starting prices are each vendor&rsquo;s cheapest plan for a brand, billed monthly, from
            their own pricing pages, checked {formatCheckedOn(checked)}. Each name links to a
            sourced head-to-head.
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------- 4. The plan, by job ---------- */

const AUTOPILOT: { job: JobId; value: string; unit: string; feature: string }[] = [
  {
    job: "answered",
    value: `${PLAN.articlesPerMonth}`,
    unit: "articles a month, one per buyer question",
    feature: "citation-ready-writer",
  },
  {
    job: "liftable",
    value: "6",
    unit: "AI-readiness checks on every draft",
    feature: "seo-geo-score",
  },
  {
    job: "corroborated",
    value: `${PLAN.backlinkCreditsPerMonth} + ${PLAN.redditRepliesPerMonth}`,
    unit: "backlink credits and Reddit reply drafts a month",
    feature: "authority-backlinks",
  },
];

export function Autopilot() {
  return (
    <section aria-labelledby="autopilot-title" className="border-t border-border pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-5">
        <Heading id="autopilot-title" title={AEO.autopilotTitle} intro={AEO.autopilotIntro} />
        <div className="mx-auto mt-12 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {AUTOPILOT.map((a) => {
            const f = getFeature(a.feature)!;
            return (
              <Link
                key={a.job}
                to="/features/$slug"
                params={{ slug: a.feature }}
                className="group flex flex-col bg-card p-6 transition-colors hover:bg-surface/60"
              >
                <span className="text-xs font-semibold text-cta">{JOB_NAME[a.job]}</span>
                <span className="mt-3 font-display text-4xl font-semibold tabular-nums tracking-tight text-ink">
                  {a.value}
                </span>
                <span className="mt-1.5 flex-1 text-sm leading-snug text-muted-foreground">
                  {a.unit}
                </span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-cta">
                  {f.name}
                  {rollingOut(a.feature) && (
                    <span className="rounded bg-surface px-1.5 py-px text-[0.65rem] font-medium text-muted-foreground">
                      Rolling out
                    </span>
                  )}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
