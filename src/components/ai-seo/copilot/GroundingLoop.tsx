/**
 * The Copilot guide's focal visual: how one citation is made. The question
 * becomes a few-word Bing query, Bing's index decides which pages may be
 * used (IndexNow delivers the fresh one, `nocache` limits one, `noarchive`
 * drops one), the answer links its sources, and Bing Webmaster Tools later
 * reports the query-to-page pair back to the site that was cited.
 *
 * It plays once while it's at least a third on screen and resets when it
 * leaves. The server render and reduced-motion visitors get the finished
 * frame, which reads on its own.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { BarChart3, Check, ChevronRight, Minus, RotateCcw, Search, X, Zap } from "lucide-react";
import { EngineMark } from "@/components/ai-seo/kit";
import { LINE, PANEL } from "@/components/landing/frame";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";
import { LOOP, STATE_LABEL, type IndexRow } from "./loop-data";

/* When each step lands, in ms after the loop comes into view. */
const TIMES = [700, 1150, 1600, 2000, 2900, 3300, 3750, 4200, 4900, 5600, 6400];
const FINAL = TIMES.length;

/** "pipefolk.io" -> "Pipefolk": a source listing shows the site's name. */
function siteName(domain: string) {
  const name = domain.split(".")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function fade(shown: boolean) {
  return cn(
    "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
    shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-20",
  );
}

function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[4px] bg-ink/[0.06] font-mono text-[0.55rem] font-medium uppercase text-ink/60",
        className,
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

function StageTitle({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[0.82rem] font-medium text-ink">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft font-mono text-[0.68rem] text-cta">
        {n}
      </span>
      {children}
    </p>
  );
}

/* The arrow between stages: on the column's left edge on desktop, on its top
   edge when the stages stack. */
function Handoff() {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
        "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 lg:left-0 lg:top-1/2",
        LINE,
      )}
    >
      <ChevronRight className="h-3.5 w-3.5 rotate-90 lg:rotate-0" />
    </span>
  );
}

function IndexLine({ row, step }: { row: IndexRow; step: number }) {
  const scanned = step >= row.at;
  /* The fresh page reads as merely indexed until IndexNow's ping lands. */
  const state = row.state === "fresh" && step < 5 ? "indexed" : row.state;
  const dropped = scanned && state === "noarchive";
  const Icon = state === "noarchive" ? X : state === "nocache" ? Minus : Check;
  return (
    <li
      className={cn(
        "flex items-center gap-2.5 border-b px-3 py-2 transition-[background-color,opacity] duration-500 last:border-b-0 motion-reduce:transition-none",
        LINE,
        scanned ? "opacity-100" : "opacity-45",
        scanned && state === "fresh" && "bg-cta-soft",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
          !scanned && "bg-ink/[0.05] text-transparent",
          scanned && (state === "noarchive" ? "bg-ink/[0.08] text-ink/50" : "bg-cta text-white"),
          scanned && state === "nocache" && "bg-cta/40",
        )}
      >
        <Icon aria-hidden className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate font-mono text-[0.72rem]",
          dropped ? "text-ink/40 line-through" : "text-ink/80",
        )}
      >
        {row.url}
      </span>
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.64rem] font-medium",
          state === "fresh" && "bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
          state === "indexed" && "bg-ink/[0.04] text-ink/60",
          state === "nocache" && "bg-ink/[0.04] text-ink/70",
          state === "noarchive" && "bg-ink/[0.04] text-ink/50",
        )}
      >
        {state === "fresh" && <Zap aria-hidden className="h-2.5 w-2.5" />}
        {STATE_LABEL[state]}
      </span>
    </li>
  );
}

export function GroundingLoop({ preview }: { preview: AnswerPreview }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.35 });
  const [step, setStep] = useState(FINAL);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce) {
      setStep(FINAL);
      return;
    }
    setStep(0);
    if (!inView) return;
    const timers = TIMES.map((t, i) => window.setTimeout(() => setStep(i + 1), t));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, reduce, run]);

  const on = (n: number) => step >= n;
  const [first, second] = preview.sources;
  const extra = Math.max(1, preview.sources.length - 2);

  return (
    <figure ref={ref} aria-label="How a Copilot citation is made: an illustration">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* ---------- 1: the question becomes queries ---------- */}
        <div className="relative px-5 py-6 sm:px-8 lg:px-7 lg:py-8">
          <StageTitle n={1}>Copilot rewrites the question</StageTitle>
          <div className="mt-5 flex justify-end">
            <p
              className={cn(
                "max-w-[90%] rounded-2xl rounded-br-md border px-3.5 py-2.5 text-[0.86rem] leading-relaxed text-ink",
                LINE,
                PANEL,
              )}
            >
              {preview.prompt}
            </p>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-[0.74rem] text-ink/55">
            <EngineMark mark="Copilot" className="h-3.5 w-3.5" />
            {preview.status}
          </p>
          <ul className="mt-3 space-y-2" aria-label="Grounding queries">
            {LOOP.queries.map((q, i) => (
              <li key={q} className={fade(on(i + 1))}>
                <span
                  className={cn(
                    "inline-flex max-w-full items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 font-mono text-[0.74rem] text-ink transition-shadow duration-500",
                    LINE,
                    i === LOOP.activeQuery &&
                      on(5) &&
                      "border-cta/40 shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_12%,transparent)]",
                  )}
                >
                  <Search aria-hidden className="h-3 w-3 shrink-0 text-cta" />
                  <span className="truncate">{q}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- 2: Bing's index decides ---------- */}
        <div
          className={cn(
            "relative border-t px-5 py-6 sm:px-8 lg:border-l lg:border-t-0 lg:px-7 lg:py-8",
            LINE,
          )}
        >
          <Handoff />
          <StageTitle n={2}>Bing&rsquo;s index decides what&rsquo;s usable</StageTitle>

          {/* IndexNow, the fast lane: a ping travels from the CMS into Bing. */}
          <div className="mt-5 flex items-center gap-2 text-[0.68rem] font-medium text-ink/60">
            <span className="shrink-0">Your CMS</span>
            <span className="relative h-px flex-1 bg-ink/[0.12]">
              <span
                aria-hidden
                className={cn(
                  "absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-cta transition-[left,opacity] duration-[900ms] ease-in-out motion-reduce:transition-none",
                  on(4) ? "left-[calc(100%-7px)]" : "left-0",
                  on(5) ? "opacity-0" : "opacity-100",
                )}
              />
            </span>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors duration-500",
                on(4) && !on(6) ? "bg-cta text-white" : "bg-cta-soft text-cta",
              )}
            >
              <Zap aria-hidden className="h-2.5 w-2.5" />
              IndexNow
            </span>
            <span className="h-px w-4 shrink-0 bg-ink/[0.12]" />
            <span className="shrink-0">Bing</span>
          </div>

          <div className={cn("mt-4 overflow-hidden rounded-lg border bg-white", LINE)}>
            <p
              className={cn(
                "flex items-center gap-2 border-b px-3 py-2 font-mono text-[0.72rem] transition-colors duration-500",
                LINE,
                PANEL,
                on(5) ? "text-ink" : "text-ink/35",
              )}
            >
              <Search aria-hidden className="h-3 w-3 shrink-0 text-cta" />
              <span className="truncate">{LOOP.queries[LOOP.activeQuery]}</span>
            </p>
            <ul>
              {LOOP.index.map((row) => (
                <IndexLine key={row.url} row={row} step={step} />
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- 3: the answer links its sources ---------- */}
        <div
          className={cn(
            "relative border-t px-5 py-6 sm:px-8 lg:border-l lg:border-t-0 lg:px-7 lg:py-8",
            LINE,
          )}
        >
          <Handoff />
          <StageTitle n={3}>The answer links its sources</StageTitle>
          <div className={cn("mt-5", fade(on(9)))}>
            <p className="flex items-center gap-1.5 text-[0.74rem] font-medium text-ink/60">
              <EngineMark mark="Copilot" className="h-3.5 w-3.5" />
              Copilot
            </p>
            <p className="mt-2 text-[0.86rem] leading-relaxed text-ink/85">
              {parseInline(preview.answer).map((s, i) =>
                s.bold ? (
                  <span
                    key={i}
                    className="font-semibold text-ink underline decoration-cta decoration-2 underline-offset-2"
                  >
                    {s.text}
                  </span>
                ) : (
                  <span key={i}>{s.text}</span>
                ),
              )}
              <span
                className={cn(
                  "mx-1 inline-flex h-5 translate-y-[-1px] items-center rounded-md bg-ink/[0.06] px-1.5 align-middle text-[0.64rem] font-medium text-ink transition-shadow duration-500",
                  on(10) && "shadow-[0_0_0_2px_color-mix(in_oklab,var(--cta)_45%,transparent)]",
                )}
              >
                {siteName(first.domain)} +{extra}
              </span>
            </p>
          </div>
          <div className={cn("mt-4 grid grid-cols-3 gap-2", fade(on(10)))}>
            {[first, second].map((s, i) => (
              <div
                key={s.domain}
                className={cn(
                  "min-w-0 rounded-lg border bg-white p-2",
                  i === 0
                    ? "border-cta/40 shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_10%,transparent)]"
                    : LINE,
                )}
              >
                <p className="flex items-center gap-1 text-[0.6rem] text-ink/55">
                  <Favicon domain={s.domain} className="h-3 w-3" />
                  <span className="truncate">{siteName(s.domain)}</span>
                </p>
                <p className="mt-1 line-clamp-3 text-[0.64rem] font-medium leading-snug text-ink">
                  {s.title}
                </p>
              </div>
            ))}
            <div
              className={cn(
                "flex min-w-0 flex-col justify-between rounded-lg border bg-white p-2",
                LINE,
              )}
            >
              <span className="flex -space-x-1">
                {preview.sources.map((s) => (
                  <Favicon
                    key={s.domain}
                    domain={s.domain}
                    className="h-3.5 w-3.5 ring-2 ring-white"
                  />
                ))}
              </span>
              <span className="text-[0.66rem] font-medium text-ink">Show all</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- 4: Bing reports it back ---------- */}
      <div
        className={cn(
          "flex flex-col gap-3 border-t px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-7",
          LINE,
          PANEL,
        )}
      >
        <p className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
          <BarChart3 aria-hidden className="h-4 w-4 text-cta" />
          Later, in Bing Webmaster Tools: AI Performance
        </p>
        <dl
          className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem]", fade(on(11)))}
        >
          <div className="flex items-center gap-1.5">
            <dt className="text-ink/55">Grounding query</dt>
            <dd className={cn("rounded-md border bg-white px-1.5 py-0.5 font-mono text-ink", LINE)}>
              {LOOP.receipt.query}
            </dd>
          </div>
          <ChevronRight aria-hidden className="hidden h-3.5 w-3.5 text-ink/30 sm:block" />
          <div className="flex items-center gap-1.5">
            <dt className="text-ink/55">Cited page</dt>
            <dd className={cn("rounded-md border bg-white px-1.5 py-0.5 font-mono text-ink", LINE)}>
              {LOOP.receipt.page}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Citations</dt>
            <dd
              className={cn(
                "rounded-md bg-cta px-1.5 py-0.5 font-mono font-medium text-white transition-transform duration-300 motion-reduce:transition-none",
                on(11) ? "scale-100" : "scale-90",
              )}
            >
              +1 citation
            </dd>
          </div>
        </dl>
      </div>

      <figcaption
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3 text-[0.74rem] text-ink/55 sm:px-8 lg:px-7",
          LINE,
        )}
      >
        <span>
          Illustration. The brands and domains are invented; the steps follow Microsoft&rsquo;s
          documentation.
        </span>
        {!reduce && (
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            <RotateCcw aria-hidden className="h-3 w-3" />
            Replay
          </button>
        )}
      </figcaption>
    </figure>
  );
}
