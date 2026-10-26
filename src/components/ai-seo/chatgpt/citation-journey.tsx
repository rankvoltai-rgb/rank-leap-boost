/**
 * The guide's focal visual: one ChatGPT answer followed from prompt to
 * pageview. Four stages, each a thing ChatGPT does that a site owner can see
 * or shape — it rewrites the prompt into searches, reads far more pages than
 * it cites, turns the few it keeps into a citation pill, and a click on that
 * pill arrives in analytics tagged as ChatGPT.
 *
 * The still frame (server render, reduced motion, and the resting state after
 * a run) shows every stage at once, so the picture reads without motion. While
 * at least half of it is on screen it plays through the stages once, dimming
 * the ones not reached yet; scrolled away, it resets. The stage buttons let a
 * reader step through by hand.
 *
 * Words come from the guide: the prompt, status, answer and sources from
 * `preview`, the searches from the guide's fan-out code block.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { BarChart3, Globe, Lock, Search } from "lucide-react";
import { EngineMark } from "@/components/ai-seo/kit";
import { LINE } from "@/components/landing/frame";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

const STAGES = ["Rewrite", "Read", "Cite", "Arrive"] as const;

/* Positions among the pages read that end up cited. Fixed, so server and
   client agree. */
const CITED_AT = [2, 9, 16, 5, 12];

/** null = the still frame: every stage shown. */
type Phase = number | null;

function useJourney(ref: React.RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.5 });
  const [phase, setPhase] = useState<Phase>(null);
  const [run, setRun] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!inView) {
      setPinned(false);
      setPhase(null);
      return;
    }
    if (reduce || pinned) return;
    setRun((r) => r + 1);
    setPhase(0);
    const timers = [2600, 5400, 8000].map((ms, i) => window.setTimeout(() => setPhase(i + 1), ms));
    timers.push(window.setTimeout(() => setPhase(null), 11200));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce, pinned]);

  const pick = (i: number) => {
    setPinned(true);
    setPhase(i);
  };
  return { phase, run, pick, animate: !reduce && phase !== null && !pinned };
}

function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-[0.5rem] font-semibold uppercase text-ink/55 ring-1 ring-white",
        className,
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

function Answer({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((s, i) =>
        s.bold ? (
          <strong key={i} className="font-semibold text-ink">
            {s.text}
          </strong>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function CitationJourney({
  preview,
  fanOut,
  className,
}: {
  preview: AnswerPreview;
  fanOut: string[];
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { phase, run, pick, animate } = useJourney(ref);

  const top = preview.sources[0];
  const pagesRead = Number(preview.status.match(/(\d+)\s*pages?/)?.[1] ?? 20);
  const cited = new Set(CITED_AT.slice(0, preview.sources.length));
  const path = `/${slug(top.title.split(":")[0])}`;

  const reached = (k: number) => phase === null || phase >= k;
  const dim = (k: number) =>
    cn(
      "transition-[opacity,filter] duration-500 motion-reduce:transition-none",
      reached(k) ? "opacity-100" : "opacity-25 saturate-0",
    );
  const on = (k: number) => phase === k;

  const captions = [
    "ChatGPT rewrites the prompt into searches",
    `It reads ${pagesRead} pages and keeps ${preview.sources.length}`,
    "The pages it keeps become a citation pill",
    "A click arrives in your analytics as ChatGPT",
  ];

  return (
    <figure
      ref={ref}
      aria-label="How a ChatGPT answer turns into a visit to your site"
      className={cn("relative w-full", className)}
    >
      {/* ---------- stages ---------- */}
      <div>
        <div
          role="group"
          aria-label="Stages"
          className="flex w-full rounded-lg border border-ink/[0.08] bg-white p-0.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:inline-flex sm:w-auto"
        >
          {STAGES.map((s, i) => (
            <button
              key={s}
              type="button"
              aria-pressed={phase === i}
              onClick={() => pick(i)}
              className={cn(
                "inline-flex h-7 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-1.5 text-[0.74rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 sm:flex-none sm:px-2.5",
                phase === i ? "bg-cta-soft text-cta" : "text-ink/60 hover:text-ink",
              )}
            >
              <span className="font-mono text-[0.65rem] opacity-70">{i + 1}</span>
              {s}
            </button>
          ))}
        </div>
        <figcaption className="mt-2 flex h-5 items-center gap-2 truncate text-[0.78rem] font-medium text-muted-foreground">
          <span aria-hidden className="h-px w-4 shrink-0 bg-cta/40" />
          <span className="truncate">
            {phase === null ? "One answer, followed to one visit" : captions[phase]}
          </span>
        </figcaption>
      </div>

      {/* ---------- the ChatGPT window ---------- */}
      <div
        className={cn(
          "mt-3 overflow-hidden rounded-2xl border bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.28)]",
          LINE,
        )}
      >
        <div className={cn("flex items-center justify-between border-b px-4 py-2.5", LINE)}>
          <span className="flex items-center gap-2 text-[0.78rem] font-semibold text-ink">
            <EngineMark mark="ChatGPT" className="h-4 w-4" />
            ChatGPT
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-cta-soft px-2 py-0.5 text-[0.66rem] font-medium text-cta">
            <Globe aria-hidden className="h-3 w-3" />
            Search
          </span>
        </div>

        <div className="space-y-3.5 p-4 sm:p-5">
          <div className="flex justify-end">
            <p className="max-w-[86%] rounded-3xl bg-ink/[0.05] px-4 py-2.5 text-[0.85rem] leading-relaxed text-ink">
              {preview.prompt}
            </p>
          </div>

          {/* 1 · rewrite */}
          <div
            className={cn(
              "rounded-xl border px-3.5 py-3 transition-colors duration-500",
              on(0) ? "border-cta/35 bg-cta-soft/60" : "border-ink/[0.07] bg-ink/[0.015]",
              dim(0),
            )}
          >
            <p className="flex items-center gap-1.5 text-[0.72rem] font-medium text-muted-foreground">
              <Globe aria-hidden className="h-3.5 w-3.5" />
              {preview.status}
            </p>
            <ul className="mt-2 space-y-1.5">
              {fanOut.map((q, i) => (
                <motion.li
                  key={`${run}-${q}`}
                  initial={animate && phase === 0 ? { opacity: 0, x: -6 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.35 + i * 0.4 }}
                  className="flex min-w-0 items-center gap-2 font-mono text-[0.72rem] text-ink/80"
                >
                  <Search aria-hidden className="h-3 w-3 shrink-0 text-cta" />
                  <span className="truncate">
                    {q.startsWith("site:") ? (
                      <>
                        <span className="text-cta">{q.split(" ")[0]}</span>{" "}
                        {q.split(" ").slice(1).join(" ")}
                      </>
                    ) : (
                      q
                    )}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* 2 · read, and keep a few */}
          <div className={cn("flex items-center gap-3", dim(1))}>
            <div className="flex flex-1 flex-wrap gap-1" aria-hidden>
              {Array.from({ length: pagesRead }, (_, i) => {
                const keep = cited.has(i);
                const filled = phase === null || phase >= 1;
                const marked = keep && filled;
                return (
                  <span
                    key={i}
                    className={cn(
                      "h-2.5 w-2.5 rounded-[3px] border transition-colors duration-300",
                      marked
                        ? "border-cta bg-cta"
                        : filled
                          ? "border-ink/[0.12] bg-ink/[0.12]"
                          : "border-ink/[0.12] bg-transparent",
                    )}
                    style={
                      animate && phase === 1
                        ? { transitionDelay: `${keep ? pagesRead * 45 + 300 : i * 45}ms` }
                        : undefined
                    }
                  />
                );
              })}
            </div>
            <p className="shrink-0 text-right text-[0.68rem] leading-tight text-muted-foreground">
              <span className="font-semibold text-ink">{pagesRead}</span> read
              <br />
              <span className="font-semibold text-cta">{preview.sources.length}</span> cited
            </p>
          </div>

          {/* 3 · cite */}
          <div className={dim(2)}>
            <p className="text-[0.9rem] leading-relaxed text-ink/85">
              <Answer text={preview.answer} />{" "}
              <span className="relative inline-flex align-middle">
                <span
                  className={cn(
                    "inline-flex translate-y-[-1px] items-center rounded-full px-2 py-0.5 text-[0.68rem] font-medium transition-[background-color,color,box-shadow] duration-300",
                    reached(2)
                      ? "bg-cta-soft text-cta ring-1 ring-cta/30"
                      : "bg-ink/[0.05] text-ink/70",
                    on(2) && "ring-4 ring-cta/15",
                  )}
                >
                  {top.domain}
                  <span className="ml-1 opacity-60">+{preview.sources.length - 1}</span>
                </span>
                {phase === 3 && animate && (
                  <motion.svg
                    key={`cursor-${run}`}
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 text-ink drop-shadow"
                    initial={{ x: 26, y: 24, opacity: 0 }}
                    animate={{
                      x: [26, 4, 4, 4],
                      y: [24, 2, 2, 2],
                      opacity: [0, 1, 1, 0],
                      scale: [1, 1, 0.8, 1],
                    }}
                    transition={{ duration: 1.9, times: [0, 0.45, 0.6, 1], ease: "easeOut" }}
                  >
                    <path
                      d="M2 1.5l10.5 6-4.6 1.1L5.6 13z"
                      fill="currentColor"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </motion.svg>
                )}
              </span>
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/[0.1] px-2.5 py-1 text-[0.7rem] font-medium text-ink">
                <span className="flex -space-x-1.5">
                  {preview.sources.map((s) => (
                    <Favicon key={s.domain} domain={s.domain} className="h-4 w-4" />
                  ))}
                </span>
                Sources
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- the click ---------- */}
      <div className={cn("flex items-center justify-center py-1.5", dim(3))} aria-hidden>
        <span className="h-5 border-l border-dashed border-cta/50" />
        <span className="ml-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-cta">
          click
        </span>
      </div>

      {/* 4 · arrive */}
      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-white transition-colors duration-500",
          on(3) ? "border-cta/35" : LINE,
          dim(3),
        )}
      >
        <div className={cn("flex items-center gap-2 border-b bg-ink/[0.02] px-3 py-2", LINE)}>
          <Lock aria-hidden className="h-3 w-3 shrink-0 text-ink/40" />
          <p className="min-w-0 truncate font-mono text-[0.7rem] text-ink/80">
            {top.domain}
            {path}
            <span
              className={cn(
                "rounded px-0.5 transition-colors duration-500",
                reached(3) ? "bg-cta-soft text-cta" : "text-ink/50",
              )}
            >
              ?utm_source=chatgpt.com
            </span>
          </p>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-ink/[0.06] text-[0.68rem]">
          {[
            ["Source", "chatgpt.com"],
            ["Channel", "AI Assistant"],
            ["Landing page", path],
          ].map(([k, v], i) => (
            <div key={k} className="min-w-0 px-3 py-2">
              <dt className="flex items-center gap-1 text-muted-foreground">
                {i === 0 && <BarChart3 aria-hidden className="h-3 w-3 shrink-0" />}
                <span className="truncate">{k}</span>
              </dt>
              <dd
                className={cn(
                  "mt-0.5 truncate font-medium",
                  i === 1 && reached(3) ? "text-cta" : "text-ink",
                )}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </figure>
  );
}
