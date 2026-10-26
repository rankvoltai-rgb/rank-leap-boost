/**
 * The guide's focal visual: one Vibe web answer taken apart in four hairline
 * cells, the way the May 2026 capture saw it. The buyer asks in French; Vibe
 * sends Brave a mixed query (a generic term switched to English, the year
 * added); Brave hands back snippets; Vibe cites them out of rank order and
 * answers in French with inline links and a Sources panel.
 *
 * Every word comes from the guide's `preview`. The query lives in
 * `preview.status`, with its rewritten terms in **bold**: a bold run of
 * digits is the year Vibe added, any other bold run is a term it translated.
 *
 * Motion: the cells light up in order while the figure is at least half on
 * screen, and reset once it has left. The server renders the finished frame,
 * which is also the still frame under reduced motion, so the full text is in
 * the HTML either way.
 */
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, ChevronDown, Globe, RotateCcw } from "lucide-react";
import { MistralMark } from "@/components/landing/ai-logos";
import { Band, CELL, CellGrid, LINE, PANEL } from "@/components/landing/frame";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

/* ---------- timeline (ms from the start of a run) ---------- */

const T_QUERY = 900;
const MS_PER_CHAR = 26;
const RESULT_GAP = 260;
const MS_PER_WORD = 60;
/* The finished frame: the server's render, the reduced-motion still, the end of a run. */
const DONE = Number.POSITIVE_INFINITY;

function useAnatomyClock(ref: RefObject<HTMLElement | null>, total: number) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(DONE);
  const [run, setRun] = useState(0);
  const running = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      if (elapsed >= total) {
        setT(DONE);
        running.current = false;
        return;
      }
      setT(elapsed);
      frame = requestAnimationFrame(tick);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      start = 0;
      running.current = true;
      setT(0);
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        /* "Half on screen": half the figure, or half the viewport when the
           figure is taller than the screen (stacked on a phone). */
        const need = Math.min(entry.boundingClientRect.height, window.innerHeight) * 0.5;
        if (entry.isIntersecting && entry.intersectionRect.height >= need) {
          if (!running.current && entry.target.getAttribute("data-armed") === "true") {
            entry.target.setAttribute("data-armed", "false");
            play();
          }
        } else if (!entry.isIntersecting) {
          // Gone: reset to the opening frame, ready to play on the way back.
          cancelAnimationFrame(frame);
          running.current = false;
          entry.target.setAttribute("data-armed", "true");
          setT(-1);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] },
    );
    el.setAttribute("data-armed", "true");
    // Already on screen: start from the top, unless it's barely in view.
    const rect = el.getBoundingClientRect();
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (visible < Math.min(rect.height, window.innerHeight) * 0.5) setT(-1);
    io.observe(el);
    if (run > 0) {
      el.setAttribute("data-armed", "false");
      play();
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ref, reduce, total, run]);

  return { t, reduce: !!reduce, replay: () => setRun((n) => n + 1) };
}

/* ---------- pieces ---------- */

/** Reveals `text` up to `shown` characters; the rest keeps its space, unseen. */
function Typed({ text, shown }: { text: string; shown: number }) {
  if (shown >= text.length) return <>{text}</>;
  const cut = Math.max(0, shown);
  return (
    <>
      {text.slice(0, cut)}
      <span className="invisible">{text.slice(cut)}</span>
    </>
  );
}

function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[4px] bg-ink/[0.06] font-mono text-[0.55rem] font-semibold uppercase text-ink/60",
        className,
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

function Step({
  n,
  label,
  on,
  last = false,
  children,
}: {
  n: number;
  label: string;
  on: boolean;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <li className={cn(CELL, "relative")}>
      <div className="flex h-full flex-col p-5 sm:p-6">
        <p className="flex items-center gap-2.5 text-[0.78rem] font-medium text-ink">
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-[5px] font-mono text-[0.68rem] font-semibold transition-colors duration-500",
              on ? "bg-cta text-white" : "border border-ink/[0.12] bg-white text-ink/50",
            )}
          >
            {String(n).padStart(2, "0")}
          </span>
          {label}
        </p>
        <div
          className={cn(
            "mt-4 flex flex-1 flex-col transition-[opacity,filter] duration-500",
            on ? "opacity-100" : "opacity-35 saturate-0",
          )}
        >
          {children}
        </div>
      </div>
      {!last && (
        <span
          aria-hidden
          className={cn(
            "absolute z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-ink/50 shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
            LINE,
            /* Phone: on the cell's bottom edge. sm (2 columns): only the
               first cell of each row points right. lg: every cell does. */
            "-bottom-3 left-1/2 -translate-x-1/2",
            "sm:bottom-auto sm:left-auto sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-1/2",
            n % 2 === 0 && "sm:hidden lg:flex",
          )}
        >
          <ArrowDown className="h-3 w-3 sm:hidden" />
          <ArrowRight className="hidden h-3 w-3 sm:block" />
        </span>
      )}
    </li>
  );
}

/* ---------- the figure ---------- */

export function VibeAnatomy({
  preview,
  title,
  caption,
}: {
  preview: AnswerPreview;
  title: string;
  caption: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const query = parseInline(preview.status);
  const queryText = query.map((s) => s.text).join("");
  const answer = parseInline(preview.answer);
  const words = answer.flatMap((s, i) =>
    s.text.split(/(?<=\s)/).map((w, j) => ({ w, bold: !!s.bold, key: `${i}-${j}` })),
  );

  /* Brave's ranks put the reader's page third: Vibe still cites it first,
     as the capture saw it do with lower-ranked results. */
  const [brand, ...others] = preview.sources;
  const ranked = [...others, brand];
  const citeOrder = new Map(preview.sources.slice(0, 2).map((s, i) => [s.domain, i + 1]));

  const tResults = T_QUERY + queryText.length * MS_PER_CHAR + 350;
  const tPicks = tResults + ranked.length * RESULT_GAP + 300;
  const tAnswer = tPicks + 500;
  const tSources = tAnswer + words.length * MS_PER_WORD + 350;
  const total = tSources + 600;

  const { t, reduce, replay } = useAnatomyClock(ref, total);
  const chars = Math.floor((t - T_QUERY) / MS_PER_CHAR);
  const shownWords = Math.floor((t - tAnswer) / MS_PER_WORD);
  const sourcesOpen = t >= tSources;

  let charIndex = 0;

  return (
    <figure aria-labelledby="vibe-anatomy-title" className="m-0">
      <Band inner="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-5 py-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <h2
            id="vibe-anatomy-title"
            className="font-display text-[1.2rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.35rem]"
          >
            {title}
          </h2>
          <figcaption className="mt-1 text-[0.82rem] leading-relaxed text-muted-foreground">
            {caption}
          </figcaption>
        </div>
        {!reduce && (
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.78rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.18] hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            <RotateCcw aria-hidden className="h-3.5 w-3.5" />
            Replay
          </button>
        )}
      </Band>

      <Band>
        <div ref={ref}>
          <CellGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1 · the prompt */}
            <Step n={1} label="Your buyer asks, in French" on={t >= 0}>
              <div className="flex justify-end">
                <p className="max-w-[95%] rounded-xl rounded-br-[4px] bg-ink/[0.05] px-3.5 py-2.5 text-[0.88rem] leading-relaxed text-ink">
                  {preview.prompt}
                </p>
              </div>
              <p className="mt-2 flex justify-end">
                <span className="rounded-[4px] border border-ink/[0.1] px-1.5 py-px font-mono text-[0.62rem] font-semibold text-ink/60">
                  FR
                </span>
              </p>
              {/* The composer: web search is a tool the user switches on. */}
              <div
                className={cn(
                  "mt-auto flex items-center gap-2 rounded-lg border bg-white px-2.5 py-2 pt-2",
                  LINE,
                )}
              >
                <span
                  aria-hidden
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.1] text-[0.9rem] leading-none text-ink/60"
                >
                  +
                </span>
                <span className="text-[0.68rem] text-muted-foreground">Tools</span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-cta-soft px-2 py-1 text-[0.68rem] font-medium text-cta">
                  <Globe aria-hidden className="h-3 w-3" />
                  Web search
                  <span
                    aria-hidden
                    className="relative ml-0.5 inline-block h-3 w-5 rounded-full bg-cta"
                  >
                    <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white" />
                  </span>
                </span>
              </div>
            </Step>

            {/* 2 · the rewritten query */}
            <Step n={2} label="Vibe rewrites it for Brave" on={t >= T_QUERY}>
              <div
                className={cn(
                  "rounded-lg border p-3.5 font-mono text-[0.78rem] leading-[1.7]",
                  LINE,
                  PANEL,
                )}
              >
                <span className="text-muted-foreground">web_search(</span>
                <span className="block text-ink">
                  &ldquo;
                  {query.map((s, i) => {
                    const from = charIndex;
                    charIndex += s.text.length;
                    const typed = <Typed text={s.text} shown={chars - from} />;
                    if (!s.bold) return <span key={i}>{typed}</span>;
                    const year = /^\d{4}$/.test(s.text.trim());
                    return (
                      <mark
                        key={i}
                        className={cn(
                          "rounded-[3px] px-0.5 text-ink",
                          year ? "bg-warning/25" : "bg-cta-soft text-cta",
                        )}
                      >
                        {typed}
                      </mark>
                    );
                  })}
                  &rdquo;
                </span>
                <span className="text-muted-foreground">)</span>
              </div>
              <ul className="mt-auto space-y-1.5 pt-4 text-[0.72rem] text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-[2px] bg-cta-soft ring-1 ring-cta/30"
                  />
                  Generic term switched to English
                </li>
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-[2px] bg-warning/30 ring-1 ring-warning/50"
                  />
                  Current year added
                </li>
              </ul>
            </Step>

            {/* 3 · Brave's results */}
            <Step n={3} label="Brave returns snippets" on={t >= tResults}>
              <ol className="space-y-2">
                {ranked.map((s, i) => {
                  const order = citeOrder.get(s.domain);
                  const shown = t >= tResults + i * RESULT_GAP;
                  return (
                    <li
                      key={s.domain}
                      className={cn(
                        "rounded-lg border bg-white p-2.5 transition-[opacity,transform] duration-500",
                        LINE,
                        shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                        t >= tPicks && !order && "opacity-50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[0.62rem] font-semibold text-muted-foreground">
                          #{i + 1}
                        </span>
                        <Favicon domain={s.domain} className="h-3.5 w-3.5" />
                        <span className="min-w-0 truncate text-[0.68rem] text-muted-foreground">
                          {s.domain}
                        </span>
                        {order && (
                          <span
                            className={cn(
                              "ml-auto shrink-0 rounded-[4px] px-1.5 py-px text-[0.6rem] font-semibold transition-colors duration-500",
                              t >= tPicks ? "bg-cta text-white" : "bg-ink/[0.05] text-transparent",
                            )}
                          >
                            {order === 1 ? "cited 1st" : "cited 2nd"}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[0.76rem] font-medium leading-snug text-ink">
                        {s.title}
                      </p>
                      <p className="mt-1 font-mono text-[0.6rem] text-muted-foreground">
                        &quot;source&quot;: &quot;brave&quot;
                      </p>
                    </li>
                  );
                })}
              </ol>
            </Step>

            {/* 4 · the answer */}
            <Step n={4} label="Vibe answers, with sources" on={t >= tAnswer} last>
              <div className={cn("rounded-lg border bg-white p-3.5", LINE)}>
                <div className="flex items-center gap-2 text-[0.68rem] font-medium text-muted-foreground">
                  <MistralMark className="h-4 w-4" />
                  <Globe aria-hidden className="h-3.5 w-3.5 text-cta" />
                  Web search
                </div>
                <p className="mt-2.5 text-[0.86rem] leading-relaxed text-ink/85">
                  {words.map(({ w, bold, key }, i) => {
                    const seen = i < shownWords;
                    return (
                      <span
                        key={key}
                        className={cn(
                          "transition-opacity duration-200",
                          seen ? "opacity-100" : "opacity-0",
                          bold &&
                            "font-semibold text-ink underline decoration-brand-blue decoration-2 underline-offset-2",
                        )}
                      >
                        {w}
                      </span>
                    );
                  })}{" "}
                  <span
                    className={cn(
                      "whitespace-nowrap rounded-[4px] bg-cta-soft px-1.5 py-px text-[0.68rem] font-medium text-cta transition-opacity duration-300",
                      shownWords >= words.length ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {brand.domain}
                  </span>
                </p>
                <div className={cn("mt-3 overflow-hidden rounded-md border", LINE)}>
                  <p
                    className={cn(
                      "flex items-center justify-between px-2.5 py-1.5 text-[0.68rem] font-semibold text-ink",
                      PANEL,
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex -space-x-1">
                        {preview.sources.map((s) => (
                          <Favicon
                            key={s.domain}
                            domain={s.domain}
                            className="h-3.5 w-3.5 ring-1 ring-white"
                          />
                        ))}
                      </span>
                      Sources
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-300",
                        sourcesOpen && "rotate-180",
                      )}
                    />
                  </p>
                  <div
                    className={cn(
                      /* The panel keeps its space while closed, so opening
                         and resetting it never moves the page. */
                      "transition-[clip-path,opacity] duration-500 ease-out",
                      sourcesOpen
                        ? "opacity-100 [clip-path:inset(0_0_0_0)]"
                        : "opacity-0 [clip-path:inset(0_0_100%_0)]",
                    )}
                  >
                    <ul className="divide-y divide-ink/[0.07]">
                      {preview.sources.map((s) => (
                        <li
                          key={s.domain}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-[0.64rem]"
                        >
                          <Favicon domain={s.domain} className="h-3 w-3" />
                          <span className="min-w-0 flex-1 truncate font-medium text-ink">
                            {s.title}
                          </span>
                          <span className="shrink-0 text-muted-foreground">{s.domain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Step>
          </CellGrid>
        </div>
      </Band>
    </figure>
  );
}
