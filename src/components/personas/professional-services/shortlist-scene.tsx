/**
 * The /use-cases/professional-services hero scene: the shortlist. A client
 * asks an AI assistant which CPA firm an Ohio contractor should use for a
 * first audit; the answer names three fictional firms and cites one page from
 * each. Beside it, a table shows which of the four signals each cited page
 * carries (industry, service, region, a recent update), the pattern the two
 * studies on this page found. Under that, the sample firm's own site has no
 * page for the question, and Rankbox works through it: found, drafted,
 * scored, then handed to the firm's reviewer, where the scene stops. It never
 * shows the firm being named: that would be a promised result.
 *
 * The loop walks the three firms, then the sample site's queue. It runs only
 * while half of it is on screen. The first render, the server's, is the full
 * frame, which is also what reduced motion holds, so nothing is ever hidden
 * from a crawler or a still reader.
 */
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Check, Minus, Sparkles } from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import { PRACTICE, SHORTLIST, SIGNALS, persona } from "@/data/persona-pages/professional-services";
import { cn } from "@/lib/utils";
import { FirmTile, SampleTag, SignalChip } from "./parts";
import { SCREEN, SIGNAL_ICONS } from "./tokens";

type Focus = number | "yours" | null;

/* One entry per beat: how long it holds, which firm (or the sample site) is
   in focus, and how far the sample site's article has got. The first beat is
   the full frame the server renders. */
const BEATS: { ms: number; focus: Focus; progress: number }[] = [
  { ms: 2600, focus: null, progress: 4 },
  { ms: 1900, focus: 0, progress: 0 },
  { ms: 1900, focus: 1, progress: 0 },
  { ms: 1900, focus: 2, progress: 0 },
  { ms: 1500, focus: "yours", progress: 0 },
  { ms: 1100, focus: "yours", progress: 1 },
  { ms: 1100, focus: "yours", progress: 2 },
  { ms: 1100, focus: "yours", progress: 3 },
  { ms: 3200, focus: "yours", progress: 4 },
];

const domainOf = (url: string) => url.split("/")[0];

export function ShortlistScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState(0);

  // Off screen or reduced motion: back to the full frame, still.
  useEffect(() => {
    if (reduce || !inView) setBeat(0);
  }, [reduce, inView]);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setTimeout(() => setBeat((b) => (b + 1) % BEATS.length), BEATS[beat].ms);
    return () => window.clearTimeout(id);
  }, [beat, inView, reduce]);

  const { focus, progress } = BEATS[beat];
  const run = inView && !reduce;
  const brand = persona.topics?.brand ?? "Your firm";
  const domain = persona.topics?.domain ?? "yourfirm.example";

  return (
    <div
      ref={ref}
      role="img"
      aria-label={SHORTLIST.description}
      className="mx-auto grid w-full max-w-[64rem] grid-cols-[minmax(0,1fr)] gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]"
    >
      {/* The AI answer. */}
      <div className={cn(SCREEN, "flex flex-col overflow-hidden")}>
        <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <p className="truncate text-[0.8rem] font-semibold text-ink">AI answer</p>
          </div>
          <SampleTag />
        </div>

        <div className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-4 sm:px-5">
          {/* The client's question. */}
          <p className="ml-auto max-w-[88%] rounded-xl rounded-br-sm bg-[color-mix(in_oklab,var(--surface)_80%,white)] px-3.5 py-2.5 text-[0.82rem] leading-snug text-ink ring-1 ring-ink/[0.05]">
            {SHORTLIST.question}
          </p>

          <div className="text-[0.82rem] leading-relaxed text-ink/80">
            <p>{SHORTLIST.lead}</p>
            <ol className="mt-2.5 space-y-1.5">
              {SHORTLIST.firms.map((f, i) => {
                const on = focus === i;
                return (
                  <li
                    key={f.name}
                    className={cn(
                      "relative flex gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-500",
                      on ? "bg-cta-soft" : "bg-transparent",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-cta transition-opacity duration-500",
                        on ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="mt-px font-display text-[0.8rem] font-semibold tabular-nums text-muted-foreground">
                      {i + 1}.
                    </span>
                    <span className="min-w-0">
                      <span className="font-semibold text-ink">{f.name}</span>, {f.why}
                      <sup
                        className={cn(
                          "ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded px-1 align-[0.2em] text-[0.58rem] font-semibold transition-colors duration-500",
                          on ? "bg-cta text-white" : "bg-ink/[0.06] text-ink/60",
                        )}
                      >
                        {i + 1}
                      </sup>
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-ink/70">{SHORTLIST.tail}</p>
          </div>

          {/* The pages the answer cites. */}
          <div className="mt-auto border-t border-ink/[0.06] pt-3">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Sources
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {SHORTLIST.firms.map((f, i) => (
                <li
                  key={f.url}
                  className={cn(
                    "inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-md border bg-white py-1 pl-1 pr-2 text-[0.66rem] transition-colors duration-500",
                    focus === i ? "border-cta/40 text-ink" : "border-ink/[0.08] text-ink/65",
                  )}
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-ink/[0.06] text-[0.56rem] font-semibold text-ink/70">
                    {i + 1}
                  </span>
                  <span className="truncate">{domainOf(f.url)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:gap-4">
        {/* What each cited page shows. */}
        <div className={cn(SCREEN, "overflow-hidden")}>
          <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-3">
            <p className="truncate text-[0.8rem] font-semibold text-ink">
              {SHORTLIST.signalsTitle}
            </p>
            <SampleTag />
          </div>
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">{SHORTLIST.signalsTitle}</caption>
            <thead>
              <tr className="border-b border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)]">
                <th
                  scope="col"
                  className="w-[34%] py-2 pl-3 pr-1 text-[0.6rem] font-medium text-muted-foreground sm:w-[32%] sm:pl-4"
                >
                  Cited page
                </th>
                {SIGNALS.map((s) => {
                  const Icon = SIGNAL_ICONS[s.id];
                  return (
                    <th
                      key={s.id}
                      scope="col"
                      className="px-0.5 py-2 text-center text-[0.6rem] font-medium text-muted-foreground last:pr-2 sm:px-1"
                    >
                      <span className="inline-flex flex-col items-center gap-0.5 sm:flex-row sm:gap-1">
                        <Icon className="h-3 w-3" />
                        {s.label}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {SHORTLIST.firms.map((f, i) => (
                <tr
                  key={f.url}
                  className={cn(
                    "border-b border-ink/[0.05] transition-colors duration-500 last:border-b-0",
                    focus === i ? "bg-cta-soft" : "bg-white",
                  )}
                >
                  <th scope="row" className="py-2.5 pl-3 pr-1 font-normal sm:pl-4">
                    <span className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                      <FirmTile
                        letter={f.name[0]}
                        className="hidden h-5 w-5 text-[0.6rem] min-[400px]:flex"
                      />
                      <span className="truncate text-[0.72rem] font-medium text-ink">
                        {f.short}
                      </span>
                    </span>
                  </th>
                  {SIGNALS.map((s) => {
                    const has = f.signals.includes(s.id);
                    return (
                      <td key={s.id} className="px-0.5 py-2.5 text-center last:pr-2 sm:px-1">
                        {has ? (
                          <span
                            className={cn(
                              "inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-500",
                              focus === i ? "bg-cta text-white" : "bg-cta-soft text-brand-blue",
                            )}
                          >
                            <Check className="h-3 w-3" strokeWidth={2.8} />
                            <span className="sr-only">Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center text-ink/25">
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">No</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-ink/[0.06] px-4 py-2 text-[0.64rem] text-muted-foreground">
            {SHORTLIST.signalsNote}
          </p>
        </div>

        {/* The sample firm's site, against the same question. */}
        <div
          className={cn(
            SCREEN,
            "overflow-hidden transition-shadow duration-500",
            focus === "yours" && "ring-2 ring-cta/25",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <FirmTile letter={brand[0]} />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[0.8rem] font-semibold text-ink">
                  {SHORTLIST.yoursTitle}
                </p>
                <p className="truncate text-[0.64rem] text-muted-foreground">
                  {brand} · {domain}
                </p>
              </div>
            </div>
            <SampleTag />
          </div>

          <div className="px-4 py-3">
            <p className="flex items-center gap-2 text-[0.72rem] font-medium text-ink/70">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" />
              {SHORTLIST.yoursEmpty}
            </p>

            <div className="mt-3 rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_45%,white)] p-3">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta text-white">
                  <Mark className="h-3 w-3" />
                </span>
                <p className="min-w-0 text-[0.76rem] font-semibold leading-snug text-ink">
                  {SHORTLIST.draft}
                </p>
              </div>
              <ul className="mt-2 flex flex-wrap gap-1 pl-7">
                {PRACTICE.map((p) => (
                  <li key={p.signal}>
                    <SignalChip id={p.signal} label={p.value} />
                  </li>
                ))}
              </ul>

              <ol className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-1 pl-7 sm:grid-cols-2">
                {SHORTLIST.progress.map((label, i) => {
                  const last = i === SHORTLIST.progress.length - 1;
                  const done = !last && progress > i;
                  const waiting = last && progress > i;
                  return (
                    <li
                      key={label}
                      className={cn(
                        "flex min-w-0 items-center gap-1.5 text-[0.68rem] transition-colors duration-300",
                        done || waiting ? "text-ink" : "text-ink/35",
                      )}
                    >
                      {waiting ? (
                        <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                          {run && (
                            <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-cta/50 motion-reduce:animate-none" />
                          )}
                          <span className="relative h-2 w-2 rounded-full bg-cta" />
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                            done ? "bg-success text-white" : "border border-ink/15 bg-white",
                          )}
                        >
                          {done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                        </span>
                      )}
                      <span className={cn("truncate", waiting && "font-semibold text-cta")}>
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
