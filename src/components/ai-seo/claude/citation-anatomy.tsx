/**
 * The page's focal visual: one Claude answer, then what its citation actually
 * carries. Claude's web-search citations quote at most 150 characters of the
 * source (`cited_text` in Anthropic's API), so the lower panel fills a meter to
 * that cap and cuts the quote where Claude would. That cut is the guide's
 * whole argument about writing quotable sentences, shown rather than told.
 *
 * The answer card is drawn in Claude's own colours because it depicts Claude;
 * the rest of the page stays in Rankbox's. It plays only while half of it is
 * on screen, holds its finished frame when it leaves, and never moves under
 * reduced motion. The server renders that finished frame.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ChevronDown, Globe } from "lucide-react";
import { EngineMark } from "@/components/ai-seo/kit";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline, plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

const CAP = 150;

/* 0 asked · 1 searching · 2 writing · 3 cited (the still frame). */
type Phase = 0 | 1 | 2 | 3;
const HOLD: Record<Phase, number> = { 0: 1000, 1: 2600, 2: 2300, 3: 5600 };

function useCount(target: number, run: boolean) {
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!run) {
      setN(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1100);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    setN(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run]);
  return n;
}

function Favicon({ domain }: { domain: string }) {
  return (
    <span
      aria-hidden
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-[#e8e4da] text-[0.55rem] font-semibold uppercase text-ink/60"
    >
      {domain.charAt(0)}
    </span>
  );
}

export function CitationAnatomy({
  preview,
  className,
}: {
  preview: AnswerPreview;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(3);
  /* Whether this visit has played a full cycle yet. The meter only counts up
     after one, so hydrating on the finished frame doesn't empty it. */
  const [played, setPlayed] = useState(false);
  const run = inView && !reduce;

  // Off screen (or with reduced motion), rest on the finished frame.
  useEffect(() => {
    if (!run) {
      setPhase(3);
      setPlayed(false);
    }
  }, [run]);

  useEffect(() => {
    if (!run) return;
    const id = window.setTimeout(() => {
      if (phase === 3) setPlayed(true);
      setPhase(((phase + 1) % 4) as Phase);
    }, HOLD[phase]);
    return () => window.clearTimeout(id);
  }, [run, phase]);

  const spans = parseInline(preview.answer);
  const words = spans.flatMap((s, si) =>
    s.text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((w, wi) => ({ key: `${si}-${wi}`, text: w, bold: !!s.bold })),
  );
  const full = plainText(preview.answer);
  const cut = full.length > CAP;
  const quoted = cut ? full.slice(0, CAP) : full;
  const count = useCount(Math.min(full.length, CAP), run && played && phase === 3);
  const source = preview.sources[0];
  const animateWords = run && phase === 2;

  return (
    <div ref={ref} className={cn("text-left", className)}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06),0_28px_64px_-28px_rgba(16,24,40,0.35)] ring-1 ring-ink/[0.08]">
        {/* ---------- the answer, as Claude shows it ---------- */}
        <div className="bg-[#faf9f5] px-4 pb-5 pt-3.5 sm:px-6">
          <div className="flex items-center gap-2 text-[0.75rem] font-medium text-ink/60">
            <EngineMark mark="Claude" className="h-4 w-4" />
            Claude
          </div>

          <div className="mt-4 flex justify-end">
            <p className="max-w-[88%] rounded-2xl bg-[#f0eee6] px-3.5 py-2.5 text-[0.88rem] leading-relaxed text-ink/90">
              {preview.prompt}
            </p>
          </div>

          <div
            className={cn(
              "mt-4 flex items-center justify-between rounded-lg border border-[#e8e4da] bg-white/70 px-3 py-2 text-[0.75rem] font-medium text-ink/65 transition-opacity duration-300",
              phase === 0 ? "opacity-0" : "opacity-100",
            )}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <Globe
                aria-hidden
                className={cn("h-3.5 w-3.5 shrink-0", phase === 1 && "animate-pulse text-cta")}
              />
              <span className="truncate">{phase === 1 ? "Searching the web" : preview.status}</span>
            </span>
            <ChevronDown
              aria-hidden
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-transform duration-300",
                phase === 1 && "rotate-180",
              )}
            />
          </div>

          {/* Results and answer share one grid cell, so the card never changes height. */}
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)]">
            <ul
              aria-hidden={phase !== 1}
              className={cn(
                "col-start-1 row-start-1 space-y-1.5 transition-opacity duration-300",
                phase === 1 ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {preview.sources.map((s, i) => (
                <motion.li
                  key={`${s.domain}-${i}`}
                  initial={false}
                  animate={phase === 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                  transition={{ duration: 0.3, delay: phase === 1 ? 0.25 + i * 0.35 : 0 }}
                  className="flex items-center gap-2 rounded-md bg-white/80 px-2.5 py-1.5 text-[0.75rem] ring-1 ring-[#e8e4da]"
                >
                  <Favicon domain={s.domain} />
                  <span className="min-w-0 truncate font-medium text-ink/80">{s.title}</span>
                  <span className="ml-auto shrink-0 text-ink/45">{s.domain}</span>
                </motion.li>
              ))}
            </ul>

            <p
              className={cn(
                "col-start-1 row-start-1 font-serif text-[1rem] leading-[1.65] text-ink/90 transition-opacity duration-300 sm:text-[1.05rem]",
                phase >= 2 ? "opacity-100" : "opacity-0",
              )}
            >
              {words.map((w, i) =>
                animateWords ? (
                  <motion.span
                    key={w.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: i * 0.045 }}
                    className={cn(
                      w.bold &&
                        "font-semibold text-ink underline decoration-cta decoration-2 underline-offset-[3px]",
                    )}
                  >
                    {w.text}
                  </motion.span>
                ) : (
                  <span
                    key={w.key}
                    className={cn(
                      w.bold &&
                        "font-semibold text-ink underline decoration-cta decoration-2 underline-offset-[3px]",
                    )}
                  >
                    {w.text}
                  </span>
                ),
              )}{" "}
              <span
                className={cn(
                  "inline-flex translate-y-[-2px] items-center gap-1 rounded-md border border-[#e8e4da] bg-white px-1.5 py-0.5 align-middle font-sans text-[0.68rem] font-medium text-ink/75 transition-[opacity,box-shadow] duration-500",
                  phase === 3
                    ? "opacity-100 shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_22%,transparent)]"
                    : "opacity-0",
                )}
              >
                {source.domain}
                {preview.sources.length > 1 && (
                  <span className="text-ink/45">+{preview.sources.length - 1}</span>
                )}
              </span>
            </p>
          </div>
        </div>

        {/* ---------- what the citation carries ---------- */}
        <div className="border-t border-ink/[0.08] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.8rem] font-semibold text-ink">What the citation carries</p>
            <span className="truncate text-[0.75rem] text-muted-foreground">{source.title}</span>
          </div>

          <dl className="mt-3 space-y-2.5 text-[0.8rem]">
            <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-2">
              <dt className="font-mono text-[0.72rem] text-muted-foreground">url</dt>
              <dd className="truncate font-medium text-ink">{source.domain}</dd>
            </div>
            <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-2">
              <dt className="font-mono text-[0.72rem] text-muted-foreground">cited_text</dt>
              <dd
                className={cn(
                  "leading-relaxed text-ink/80 transition-opacity duration-500",
                  phase === 3 ? "opacity-100" : "opacity-35",
                )}
              >
                <mark className="rounded-[3px] bg-cta-soft px-0.5 text-ink">{quoted}</mark>
                {cut && <span className="text-muted-foreground">…</span>}
              </dd>
            </div>
          </dl>

          <div className="mt-4">
            <div
              className="h-1.5 overflow-hidden rounded-full bg-ink/[0.07]"
              role="meter"
              aria-label="Characters quoted"
              aria-valuemin={0}
              aria-valuemax={CAP}
              aria-valuenow={Math.min(full.length, CAP)}
            >
              <div
                className="h-full rounded-full bg-cta"
                style={{ width: `${((phase === 3 ? count : 0) / CAP) * 100}%` }}
              />
            </div>
            <p className="mt-2 flex items-center justify-between text-[0.75rem] text-muted-foreground">
              <span>
                <span className="font-semibold tabular-nums text-ink">
                  {phase === 3 ? count : 0}
                </span>{" "}
                of {CAP} characters
              </span>
              {cut && <span>The rest of the sentence is cut</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
