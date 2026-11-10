/**
 * The page's focal visual: a sample results page where an AI Overview opens
 * above the reader's own blue link. Four beats, each named in the notes
 * beside it: the page holds position 1 at the top of the screen; the
 * overview opens and pushes it below the first screen while it keeps that
 * position; the overview quotes a passage from one of its sources; and
 * Rankbox's draft, a new article written for that kind of passage, is shown
 * at the corner of the page, never inside the overview, because whether an
 * overview quotes you is Google's call.
 *
 * It runs only while half of it is on screen and starts over when it leaves.
 * Under reduced motion it holds the last beat, with every note at full
 * strength. The first render is always the opening beat, so the server and
 * the client agree. The overview opens with a CSS grid-rows transition, so
 * the results below it move in the page's own flow.
 */
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Check, Search, Sparkles } from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import { page } from "@/data/persona-pages/losing-traffic-to-ai-overviews";
import { cn } from "@/lib/utils";
import { OVERVIEW_TINT, RESULT_BLUE, SCREEN } from "./tokens";

const S = page.serp;

/* How long each beat holds, and what it shows. The note lit is the beat's
   own index. */
const BEATS = [
  { ms: 2800, overview: false, quote: false, draft: false },
  { ms: 3600, overview: true, quote: false, draft: false },
  { ms: 3400, overview: true, quote: true, draft: false },
  { ms: 5200, overview: true, quote: true, draft: true },
] as const;
const REST = BEATS.length - 1;

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

function SampleTag() {
  return (
    <span className="shrink-0 rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      Sample
    </span>
  );
}

/** A plain letter tile standing in for a site's favicon. */
function Favicon({ domain, yours = false }: { domain: string; yours?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-full border text-[0.55rem] font-bold uppercase",
        yours ? "border-cta/25 bg-cta-soft text-cta" : "border-ink/[0.08] bg-white text-ink/55",
      )}
    >
      {domain[0]}
    </span>
  );
}

function ResultsPage({ step }: { step: number }) {
  const beat = BEATS[step];
  return (
    <div
      role="img"
      aria-label={S.ariaLabel}
      className={cn(SCREEN, "flex flex-col overflow-hidden")}
    >
      {/* The search bar. */}
      <div className="flex items-center gap-3 border-b border-ink/[0.07] px-3 py-2.5 sm:px-4">
        <span aria-hidden className="hidden shrink-0 gap-1.5 sm:flex">
          <span className="h-2 w-2 rounded-full bg-ink/[0.1]" />
          <span className="h-2 w-2 rounded-full bg-ink/[0.1]" />
          <span className="h-2 w-2 rounded-full bg-ink/[0.1]" />
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-ink/[0.08] bg-white px-3 py-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
          <Search aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-[0.78rem] text-ink">{S.query}</span>
        </div>
        <SampleTag />
      </div>

      {/* The first screen, and a little of what sits under it. */}
      <div className="relative h-[25rem] overflow-hidden sm:h-[26rem]">
        <div className="px-3.5 pt-4 sm:px-6">
          {/* The overview opens from nothing, pushing the results down. */}
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-[900ms] motion-reduce:transition-none",
              EASE,
              beat.overview ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                className={cn(
                  "mb-4 flex min-h-[16rem] flex-col rounded-xl border border-ink/[0.06] p-3.5 transition-opacity duration-700 motion-reduce:transition-none sm:p-4",
                  OVERVIEW_TINT,
                  beat.overview ? "opacity-100" : "opacity-0",
                )}
              >
                <p className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-[#6d4fd6] shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  {S.overviewTitle}
                </p>
                <p className="mt-2.5 text-[0.78rem] leading-[1.6] text-ink/80 sm:text-[0.8rem]">
                  {S.overview.before}
                  <span
                    className={cn(
                      "rounded-[3px] box-decoration-clone transition-[background-color,color] duration-500 motion-reduce:transition-none",
                      beat.quote ? "bg-[#dce7ff] text-ink" : "bg-transparent",
                    )}
                  >
                    {S.overview.quoted}
                  </span>
                  <span
                    className={cn(
                      "ml-0.5 inline-flex h-3.5 min-w-3.5 -translate-y-px items-center justify-center rounded-full px-1 align-middle text-[0.5rem] font-bold transition-colors duration-500 motion-reduce:transition-none",
                      beat.quote ? "bg-cta text-white" : "bg-ink/[0.08] text-ink/50",
                    )}
                  >
                    1
                  </span>
                  {S.overview.after}
                </p>
                <ul className="mt-2.5 hidden space-y-1 sm:block">
                  {S.overview.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[0.76rem] leading-snug text-ink/70">
                      <span
                        aria-hidden
                        className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-ink/40"
                      />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* The sources it quotes. The first one carries the passage. */}
                <ul className="mt-3 flex gap-2 overflow-hidden">
                  {S.sources.map((src, i) => {
                    const quoted = i === 0 && beat.quote;
                    return (
                      <li
                        key={src.domain}
                        className={cn(
                          "relative flex min-w-0 shrink-0 items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 transition-[box-shadow,border-color] duration-500 motion-reduce:transition-none sm:min-w-[9.5rem] sm:shrink",
                          quoted
                            ? "border-cta/40 shadow-[0_0_0_3px_rgba(22,111,229,0.14)]"
                            : "border-ink/[0.07]",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.5rem] font-bold transition-colors duration-500",
                            quoted ? "bg-cta text-white" : "bg-ink/[0.07] text-ink/55",
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 leading-tight">
                          <span className="block truncate text-[0.64rem] font-medium text-ink">
                            {src.title}
                          </span>
                          <span className="block truncate text-[0.58rem] text-muted-foreground">
                            {src.domain}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-auto pt-3 text-[0.68rem] font-medium text-ink/55">
                  {S.overview.more}
                </p>
              </div>
            </div>
          </div>

          {/* The ten blue links, or the first three of them. */}
          <ol className="space-y-4">
            {S.results.map((r) => {
              const yours = "yours" in r && r.yours;
              return (
                <li key={r.domain} className="relative">
                  {yours && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -left-3.5 top-0.5 h-[calc(100%-0.25rem)] w-[2px] rounded-full bg-cta transition-opacity duration-500 sm:-left-6",
                        step === 0 ? "opacity-100" : "opacity-40",
                      )}
                    />
                  )}
                  <div className="flex min-w-0 items-center gap-2">
                    <Favicon domain={r.domain} yours={yours} />
                    <span className="min-w-0 truncate text-[0.66rem] leading-tight text-ink/60">
                      {r.domain} <span className="text-ink/40">› {r.path}</span>
                    </span>
                    {yours && (
                      <span className="ml-auto shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.58rem] font-semibold text-cta">
                        {S.yoursTag}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-[0.9rem] font-medium leading-snug sm:text-[0.95rem]",
                      RESULT_BLUE,
                    )}
                  >
                    {r.title}
                  </p>
                  <p className="mt-0.5 truncate text-[0.72rem] text-ink/55">{r.snippet}</p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* The bottom of the first screen. What falls under it is greyed. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[17rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.62)_60%,#fff_100%)]"
        >
          <div className="absolute inset-x-0 top-0 border-t border-dashed border-ink/25" />
          <span className="absolute right-3 top-0 -translate-y-1/2 rounded-full border border-ink/[0.1] bg-white px-2 py-0.5 text-[0.58rem] font-medium text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] sm:right-5">
            {S.foldLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Rankbox's draft, a sample, scored. On wide screens it floats at the
 * results page's lower corner, over what fell below the first screen, and
 * only on the last beat; narrower, it sits under the last note, dimmed until
 * that beat.
 */
function DraftCard({ on, floating = false }: { on: boolean; floating?: boolean }) {
  const d = S.draft;
  return (
    <div
      aria-hidden
      className={cn(
        SCREEN,
        "p-3 transition-[opacity,transform,filter] duration-700 motion-reduce:transition-none",
        EASE,
        floating
          ? cn(
              "absolute -bottom-10 -right-6 z-10 hidden w-[17.5rem] lg:block",
              on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
            )
          : cn(
              "mt-3 lg:hidden",
              on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-45 grayscale",
            ),
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta text-white">
          <Mark className="h-3 w-3" />
        </span>
        <span className="rounded-md border border-ink/[0.08] px-1.5 py-px text-[0.58rem] font-medium text-muted-foreground">
          {d.label}
        </span>
        <span className="ml-auto">
          <SampleTag />
        </span>
      </div>
      <p className="mt-2 text-[0.8rem] font-semibold leading-snug text-ink">{d.title}</p>
      <ul className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1">
        {d.lines.map((line) => (
          <li key={line} className="flex items-center gap-1 text-[0.68rem] text-ink/70">
            <Check className="h-3 w-3 shrink-0 text-success" strokeWidth={2.6} />
            {line}
          </li>
        ))}
      </ul>
      <div className="mt-2.5 flex gap-1.5">
        <span className="rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.62rem] font-medium text-ink/70">
          SEO <span className="font-semibold tabular-nums text-ink">{d.seo}</span>
        </span>
        <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-medium text-cta">
          GEO <span className="font-semibold tabular-nums">{d.geo}</span>
        </span>
      </div>
    </div>
  );
}

export function OverviewScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  // Reduced motion: the last beat, still. Off screen: back to the start.
  useEffect(() => {
    if (reduce) setStep(REST);
    else if (!inView) setStep(0);
  }, [reduce, inView]);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % BEATS.length), BEATS[step].ms);
    return () => window.clearTimeout(id);
  }, [step, inView, reduce]);

  const still = Boolean(reduce);

  return (
    <div
      ref={ref}
      className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center lg:gap-9 lg:pb-9 xl:grid-cols-[minmax(0,1fr)_19rem]"
    >
      <div className="relative">
        <ResultsPage step={step} />
        <DraftCard on={still || BEATS[step].draft} floating />
      </div>

      <div className="flex flex-col justify-center">
        <p className="px-1 text-[0.72rem] font-medium text-muted-foreground">{S.notesTitle}</p>
        <ol className="mt-2.5 space-y-1.5">
          {S.notes.map((n, i) => {
            const active = still || i === step;
            const done = !still && i < step;
            return (
              <li
                key={n.title}
                className={cn(
                  "rounded-xl border px-3 py-2 transition-[background-color,border-color,box-shadow,opacity] duration-500 motion-reduce:transition-none",
                  active && !still
                    ? "border-cta/20 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_12px_28px_-18px_rgba(22,111,229,0.45)]"
                    : "border-transparent",
                  !active && !done && "opacity-55",
                )}
              >
                <div className="flex gap-2.5">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.62rem] font-semibold transition-colors duration-500",
                      active
                        ? "bg-cta text-white"
                        : done
                          ? "bg-cta-soft text-cta"
                          : "border border-ink/[0.12] bg-white text-ink/55",
                    )}
                  >
                    {done ? <Check className="h-3 w-3" strokeWidth={2.6} /> : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.84rem] font-semibold leading-snug text-ink">{n.title}</p>
                    <p className="mt-0.5 text-[0.76rem] leading-snug text-muted-foreground">
                      {n.body}
                    </p>
                  </div>
                </div>
                {i === S.notes.length - 1 && <DraftCard on={still || BEATS[step].draft} />}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
