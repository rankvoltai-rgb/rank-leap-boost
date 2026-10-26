/**
 * The page's focal figure: Google's own fan-out example drawn as a results
 * page. On the left, the AI Overview a searcher sees; on the right, the
 * related searches the model ran to write it. Each link card carries the
 * number of the sub-query its page won, so the reader can see the card that
 * matters most was earned on a search nobody typed.
 *
 * Motion is calm and only while the figure is at least half on screen: the
 * sub-queries run one by one, their winners light up, the cards land, the
 * answer writes in. It resets when the figure leaves the screen. The server
 * renders the finished frame, which is also what reduced-motion visitors and
 * crawlers get, and a figure already in view at hydration keeps that frame
 * rather than blanking itself.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, CornerDownRight, Link2, RotateCcw, Search } from "lucide-react";
import { GeminiMark, GoogleMark } from "@/components/landing/ai-logos";
import { LINE } from "@/components/landing/frame";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

/* 0 generating · 1–3 each sub-query runs · 4 winners light · 5 cards land ·
   6 answer writes in · 7 the earned card is called out. */
const FINAL = 7;
const TIMELINE = [600, 1300, 2000, 2800, 3500, 4300, 5300];

/* Which result row wins each sub-query: the brand's page is the second
   result for its sub-query, so "wins" never has to mean "ranks first". */
const WINNING_ROW = [1, 0, 2];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function usePlayback() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(FINAL);
  // The replay button only exists once we know motion is allowed, so the
  // server and the first client render agree.
  const [canReplay, setCanReplay] = useState(false);
  const timers = useRef<number[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const play = useCallback(() => {
    clear();
    setStep(0);
    TIMELINE.forEach((at, i) => {
      timers.current.push(window.setTimeout(() => setStep(i + 1), at));
    });
  }, [clear]);

  useEffect(() => {
    const el = ref.current;
    if (reduce || !el || typeof IntersectionObserver === "undefined") return;
    setCanReplay(true);
    let armed = false;
    let first = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        if (first) {
          first = false;
          // Mostly off screen at hydration: reset now, play on arrival.
          if (ratio < 0.25) {
            clear();
            setStep(0);
            armed = true;
          }
          return;
        }
        if (ratio >= 0.5 && armed) {
          armed = false;
          play();
        } else if (!entry.isIntersecting) {
          clear();
          setStep(0);
          armed = true;
        }
      },
      { threshold: [0, 0.25, 0.5] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
      setCanReplay(false);
    };
  }, [reduce, clear, play]);

  return { ref, step, replay: canReplay ? play : undefined };
}

function Favicon({ domain, on = false }: { domain: string; on?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.55rem] font-semibold uppercase",
        on ? "bg-cta text-white" : "bg-ink/[0.06] text-ink/60",
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

function Bar({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block h-2 rounded-full bg-ink/[0.06]", className)} />;
}

/* The answer, with the cited brand picked out and Google's inline link chip
   after it. */
function AnswerText({ text, domain }: { text: string; domain: string }) {
  return (
    <p className="text-[0.86rem] leading-[1.65] text-ink/85">
      {parseInline(text).map((s, i) =>
        s.bold ? (
          <span
            key={i}
            className="font-semibold text-ink underline decoration-cta decoration-2 underline-offset-[3px]"
          >
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}{" "}
      <span className="inline-flex translate-y-[2px] items-center gap-1 rounded-full border border-ink/[0.1] bg-white py-0.5 pl-0.5 pr-1.5 align-baseline text-[0.62rem] font-medium text-ink/70">
        <Favicon domain={domain} on />
        <Link2 aria-hidden className="h-2.5 w-2.5" />
      </span>
    </p>
  );
}

function LinkCard({
  source,
  index,
  step,
}: {
  source: AnswerPreview["sources"][number];
  index: number;
  step: number;
}) {
  const landed = step >= 5;
  const earned = index === 0 && step >= FINAL;
  const lit = step >= 4;
  return (
    <li
      className={cn(
        "relative w-[11.5rem] shrink-0 rounded-lg border p-2.5 transition-[box-shadow,border-color,background-color] duration-500 lg:w-auto",
        earned
          ? "border-cta/50 bg-white shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_16%,transparent)]"
          : landed
            ? "border-ink/[0.09] bg-white"
            : "border-dashed border-ink/[0.14] bg-white/60",
      )}
    >
      <span
        className={cn(
          "absolute -right-1.5 -top-1.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full px-1 font-mono text-[0.58rem] font-semibold transition-colors duration-500",
          lit ? "bg-cta text-white" : "bg-ink/[0.08] text-ink/50",
        )}
        aria-label={`Won fan-out query ${index + 1}`}
      >
        {index + 1}
      </span>
      {/* The empty slot and the landed card share one cell. */}
      <div className="grid">
        <motion.div
          initial={false}
          animate={{ opacity: landed ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          aria-hidden
          className="space-y-2 pt-0.5 [grid-area:1/1]"
        >
          <Bar className="w-full" />
          <Bar className="w-3/4" />
          <Bar className="mt-3 w-1/2" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ opacity: landed ? 1 : 0, y: landed ? 0 : 6 }}
          transition={{ duration: 0.45, delay: landed ? index * 0.12 : 0, ease: EASE }}
          className="[grid-area:1/1]"
        >
          <p className="line-clamp-2 text-[0.7rem] font-medium leading-snug text-ink">
            {source.title}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[0.62rem] text-muted-foreground">
            <Favicon domain={source.domain} on={index === 0} />
            <span className="truncate">{source.domain}</span>
          </p>
        </motion.div>
      </div>
    </li>
  );
}

function SubQuery({
  query,
  index,
  winner,
  step,
}: {
  query: string;
  index: number;
  winner?: AnswerPreview["sources"][number];
  step: number;
}) {
  const ran = step >= index + 1;
  const lit = step >= 4;
  return (
    <motion.li
      initial={false}
      animate={{ opacity: ran ? 1 : 0.5 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative"
    >
      {/* The branch from the typed query. */}
      <span
        aria-hidden
        className="absolute -left-5 top-[1.15rem] h-px w-5 border-t border-dashed border-ink/20"
      />
      <div className="rounded-lg border border-ink/[0.09] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <p className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full px-1 font-mono text-[0.58rem] font-semibold transition-colors duration-500",
              lit ? "bg-cta text-white" : "bg-ink/[0.08] text-ink/55",
            )}
          >
            {index + 1}
          </span>
          <Search aria-hidden className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="min-w-0 truncate text-[0.78rem] font-medium text-ink">{query}</span>
        </p>
        <ol className="mt-2.5 space-y-1.5">
          {[0, 1, 2].map((row) => {
            const wins = ran && row === WINNING_ROW[index] && winner;
            return (
              <li
                key={row}
                className={cn(
                  "flex h-6 items-center gap-2 rounded-md px-1.5 transition-colors duration-500",
                  wins && lit && "bg-cta-soft",
                )}
              >
                <span className="w-3 shrink-0 font-mono text-[0.58rem] text-ink/40">{row + 1}</span>
                {wins ? (
                  <motion.span
                    /* The finished frame (server render) arrives still. */
                    initial={step >= FINAL ? false : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="flex min-w-0 flex-1 items-center gap-2"
                  >
                    <Favicon domain={winner.domain} on={lit && index === 0} />
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-[0.68rem]",
                        lit ? "font-medium text-cta" : "text-ink/70",
                      )}
                    >
                      {winner.domain}
                    </span>
                    <CornerDownRight
                      aria-hidden
                      className={cn(
                        "h-3 w-3 shrink-0 transition-opacity duration-500",
                        lit ? "text-cta opacity-100" : "opacity-0",
                      )}
                    />
                  </motion.span>
                ) : (
                  <Bar className={row === 0 ? "w-3/5" : "w-2/5"} />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </motion.li>
  );
}

export function FanOutFigure({
  preview,
  fanOut,
  caption,
}: {
  preview: AnswerPreview;
  /** The sub-queries, in the same order as `preview.sources`. */
  fanOut: string[];
  caption: string;
}) {
  const { ref, step, replay } = usePlayback();
  const answerOn = step >= 6;
  const earned = step >= FINAL;
  const brand = preview.sources[0];

  return (
    <figure ref={ref} aria-label={caption} className="relative">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)] lg:gap-8">
        {/* ---------- the results page ---------- */}
        <div className="min-w-0 overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_28px_56px_-32px_rgba(16,24,40,0.3)]">
          <div className={cn("flex items-center gap-3 border-b px-4 py-3 sm:px-5", LINE)}>
            <GoogleMark className="h-5 w-5 shrink-0" />
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-ink/[0.1] px-3.5 py-2 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
              <span className="min-w-0 flex-1 truncate text-[0.84rem] text-ink">
                {preview.prompt}
              </span>
              <Search aria-hidden className="h-3.5 w-3.5 shrink-0 text-cta" />
            </div>
          </div>
          <div
            aria-hidden
            className={cn(
              "flex gap-5 overflow-hidden border-b px-4 text-[0.7rem] text-muted-foreground sm:px-5",
              LINE,
            )}
          >
            {["All", "AI Mode", "Images", "Videos", "News"].map((t) => (
              <span
                key={t}
                className={cn(
                  "shrink-0 py-2",
                  t === "All" && "border-b-2 border-cta font-medium text-cta",
                )}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="p-4 sm:p-5">
            <div className="rounded-xl border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_55%,white)] p-3.5 sm:p-4">
              <p className="flex items-center gap-2 text-[0.8rem] font-semibold text-ink">
                <GeminiMark className="h-4 w-4" />
                {preview.status}
                <motion.span
                  initial={false}
                  animate={{ opacity: answerOn ? 0 : 1 }}
                  className="ml-auto text-[0.66rem] font-medium text-muted-foreground"
                  aria-hidden
                >
                  {step < 4 ? "Searching…" : "Writing…"}
                </motion.span>
              </p>

              <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_10.5rem]">
                {/* The answer and its placeholder share one cell, so nothing
                    shifts when the text arrives. */}
                <div className="grid">
                  <motion.div
                    initial={false}
                    animate={{ opacity: answerOn ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden
                    className="space-y-2.5 pt-1 [grid-area:1/1]"
                  >
                    <Bar className="w-full animate-pulse motion-reduce:animate-none" />
                    <Bar className="w-11/12 animate-pulse motion-reduce:animate-none" />
                    <Bar className="w-4/5 animate-pulse motion-reduce:animate-none" />
                    <Bar className="w-2/3 animate-pulse motion-reduce:animate-none" />
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{ opacity: answerOn ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="[grid-area:1/1]"
                  >
                    <AnswerText text={preview.answer} domain={brand.domain} />
                  </motion.div>
                </div>

                <ol
                  aria-label="Link cards"
                  className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 pt-1.5 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
                >
                  {preview.sources.slice(0, 3).map((s, i) => (
                    <LinkCard key={s.domain} source={s} index={i} step={step} />
                  ))}
                </ol>
              </div>

              <motion.p
                initial={false}
                animate={{ opacity: earned ? 1 : 0, y: earned ? 0 : 4 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-3 flex items-start gap-2 rounded-lg border border-cta/20 bg-cta-soft px-3 py-2 text-[0.72rem] leading-snug text-cta"
              >
                <CornerDownRight aria-hidden className="mt-0.5 h-3 w-3 shrink-0 rotate-180" />
                <span>
                  <span className="font-semibold">{brand.domain}</span> earned card 1 by winning
                  fan-out query 1. It isn&rsquo;t in the top 10 for the typed query.
                </span>
              </motion.p>

              <div className="mt-3 flex items-center justify-between border-t border-ink/[0.06] pt-2.5 text-[0.68rem] text-muted-foreground">
                <span>Explore new angles</span>
                <ChevronDown aria-hidden className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* The classic results, below the Overview. */}
            <div aria-hidden className="mt-4 space-y-3 px-1">
              {[0, 1].map((r) => (
                <div key={r} className="space-y-1.5">
                  <Bar className="w-1/4 bg-ink/[0.05]" />
                  <Bar className={cn("h-2.5 bg-cta/15", r ? "w-1/2" : "w-2/3")} />
                  <Bar className="w-5/6 bg-ink/[0.04]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- the searches behind it ---------- */}
        <div className="min-w-0 lg:self-center">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Behind the answer: query fan-out
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-ink/[0.1] bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <Search aria-hidden className="h-3.5 w-3.5 shrink-0 text-ink/60" />
            <span className="min-w-0 flex-1 truncate text-[0.8rem] font-medium text-ink">
              {preview.prompt}
            </span>
            <span className="shrink-0 rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.08em] text-ink/55">
              Typed
            </span>
          </div>
          <ol className="relative ml-3 mt-0 space-y-3 border-l border-dashed border-ink/20 pb-1 pl-5 pt-3">
            {fanOut.slice(0, 3).map((q, i) => (
              <SubQuery key={q} query={q} index={i} winner={preview.sources[i]} step={step} />
            ))}
          </ol>
        </div>
      </div>

      <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[0.78rem] leading-relaxed text-muted-foreground">
        <span className="max-w-2xl">{caption}</span>
        {replay && (
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.78rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.18]"
          >
            <RotateCcw aria-hidden className="h-3.5 w-3.5" />
            Replay
          </button>
        )}
      </figcaption>
    </figure>
  );
}
