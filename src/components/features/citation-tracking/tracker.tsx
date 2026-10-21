/**
 * The page's focal picture: one buyer prompt asked of four AI engines at
 * once, their answers coming back side by side, and every answer recorded in
 * a ledger underneath: cited or not, by which article, and how the site's
 * share of answers adds up.
 *
 * On wide screens the four answer tiles sit directly over the ledger's four
 * engine columns, so each answer drops into its own column. The run goes one
 * prompt at a time: the answers arrive, "yoursite.com" is highlighted where
 * an engine cites it, then the row fills in. After the fifth prompt it holds
 * still.
 *
 * It starts once about half of it is on screen, starts over after it leaves,
 * and with reduced motion shows the finished ledger and never moves. The
 * server renders the first frame: every prompt listed, nothing checked yet.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Check, ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import {
  ARTICLES,
  ENGINES,
  PROMPTS,
  SITE,
  TOTAL_ANSWERS,
  TREND,
  citedFor,
  isCited,
  type Answer,
} from "./sample";
import {
  CARD,
  Checking,
  CitedPill,
  EASE,
  MarkTile,
  NotCitedPill,
  Num,
  Pin,
  SampleTag,
} from "./parts";
import { useStill } from "./use-still";

const N = PROMPTS.length;
/* One prompt's turn: the answers arrive, then the row settles. */
const ROW_MS = 3300;
const SETTLE_MS = 1800;
const START_MS = 600;
/* Each engine's answer lands a beat after the one before. */
const STAGGER = 0.16;

/* The ledger's columns. On wide screens the answer tiles use the same
   template, so each tile sits over its engine's column. */
const COLS =
  "grid-cols-[minmax(0,1fr)_repeat(4,2.5rem)] md:grid-cols-[minmax(0,1.55fr)_repeat(4,minmax(0,1fr))]";
const COLS_LG = "lg:grid-cols-[minmax(0,1.55fr)_repeat(4,minmax(0,1fr))]";

const ARIA = `Sample citation tracker for ${SITE}: ${N} buyer prompts asked of ChatGPT, Perplexity, Claude and Google AI Overviews. Each answer is recorded as cited or not cited, with the article that earned it.`;

/* ---------- One engine's answer ---------- */

function AnswerText({
  answer,
  delay,
  instant,
}: {
  answer: Answer;
  delay: number;
  instant: boolean;
}) {
  return (
    <>
      {answer.a}
      {answer.cite && (
        <>
          <motion.span
            className="rounded-[3px] bg-no-repeat px-[2px] font-semibold"
            style={{
              backgroundImage:
                "linear-gradient(color-mix(in oklab, var(--cta) 14%, white), color-mix(in oklab, var(--cta) 14%, white))",
            }}
            initial={instant ? false : { backgroundSize: "0% 100%", color: "#475467" }}
            animate={{ backgroundSize: "100% 100%", color: "#166fe5" }}
            transition={{ delay, duration: 0.55, ease: EASE }}
          >
            {SITE}
          </motion.span>
          {answer.b}
        </>
      )}
    </>
  );
}

function AnswerTile({
  e,
  row,
  phase,
}: {
  e: number;
  row: number;
  /** idle: nothing asked yet. live: arriving now. still: already in. */
  phase: "idle" | "live" | "still";
}) {
  const engine = ENGINES[e];
  const answer = PROMPTS[row].answers[e];
  const instant = phase === "still";
  const arrive = 0.3 + e * STAGGER;
  const mark = arrive + 0.55;
  const verdict = mark + 0.2;
  const article = answer.cite ? ARTICLES[answer.cite] : null;

  return (
    <div className={cn(CARD, "flex h-full flex-col p-3 sm:p-3.5")}>
      <div className="flex items-center gap-2">
        <MarkTile Mark={engine.Mark} className="h-5 w-5 rounded-[5px]" markClassName="h-3 w-3" />
        <span className="truncate text-[0.74rem] font-semibold text-ink">
          <span className="xl:hidden">{engine.short}</span>
          <span className="hidden xl:inline">{engine.name}</span>
        </span>
      </div>

      <div className="relative mt-2.5 h-[6.8rem] overflow-hidden xl:h-[5.75rem]">
        {/* Waiting lines, until the answer arrives. */}
        <motion.div
          className="absolute inset-0 space-y-1.5 pt-1"
          initial={phase === "live" ? { opacity: 1 } : false}
          animate={{ opacity: phase === "idle" ? 1 : 0 }}
          transition={{ delay: phase === "live" ? arrive : 0, duration: 0.25 }}
        >
          {[92, 100, 74].map((w, i) => (
            <span
              key={i}
              className={cn(
                "block h-[0.45rem] rounded-full bg-ink/[0.06]",
                phase === "live" && "motion-safe:animate-pulse",
              )}
              style={{ width: `${w}%` }}
            />
          ))}
        </motion.div>
        {phase !== "idle" && (
          <motion.p
            className="relative text-[0.72rem] leading-[1.55] text-ink/70"
            initial={instant ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: arrive, duration: 0.45, ease: EASE }}
          >
            <AnswerText answer={answer} delay={mark} instant={instant} />
          </motion.p>
        )}
      </div>

      <div className="relative mt-2.5 h-[1.85rem] border-t border-ink/[0.06] pt-2.5">
        {phase === "idle" ? (
          <span className="text-[0.66rem] text-muted-foreground">Waiting</span>
        ) : (
          <>
            {phase === "live" && (
              <motion.span
                className="absolute left-0 top-2.5 flex items-center gap-1.5 text-[0.66rem] text-muted-foreground"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: verdict - 0.1, duration: 0.15 }}
              >
                <Checking />
                Asking
              </motion.span>
            )}
            <motion.span
              className="absolute left-0 right-0 top-2.5 flex min-w-0 items-center gap-1.5"
              initial={instant ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: verdict, type: "spring", stiffness: 480, damping: 26 }}
            >
              {article ? <CitedPill /> : <NotCitedPill />}
              {article && (
                <span className="truncate text-[0.64rem] text-muted-foreground">
                  {article.path}
                </span>
              )}
            </motion.span>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- The prompt being asked ---------- */

function PromptCard({
  row,
  resolved,
  running,
}: {
  row: number;
  resolved: number;
  running: boolean;
}) {
  return (
    <div className={cn(CARD, "flex h-full flex-col p-3.5 sm:p-4")}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
          <Pin n={4} />
          Buyer prompt
        </span>
        <span className="text-[0.66rem] text-muted-foreground tabular-nums">
          {row + 1} of {N}
        </span>
      </div>
      <div className="relative mt-3 min-h-[3.4rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={row}
            className="w-full rounded-lg rounded-br-sm border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-3 py-2 text-[0.82rem] lg:ml-auto lg:w-fit lg:max-w-full font-medium leading-snug text-ink"
            initial={running ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {PROMPTS[row].q}?
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-auto pt-4">
        <div className="flex gap-1">
          {PROMPTS.map((p, i) => (
            <span
              key={p.q}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-500",
                i < resolved ? "bg-cta" : i === row && running ? "bg-cta/35" : "bg-ink/[0.07]",
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-[0.66rem] text-muted-foreground">
          Checked on {ENGINES.length} engines
        </p>
      </div>
    </div>
  );
}

/* ---------- The ledger ---------- */

type CellState = "idle" | "checking" | "live" | "still";

function LedgerCell({ cited, state, e }: { cited: boolean; state: CellState; e: number }) {
  if (state === "idle") {
    return <span className="block h-[3px] w-3 rounded-full bg-ink/[0.1]" />;
  }
  if (state === "checking") return <Checking />;
  return (
    <motion.span
      className="flex"
      initial={state === "live" ? { opacity: 0, scale: 0.7 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.22 + e * 0.09, type: "spring", stiffness: 520, damping: 26 }}
    >
      <span className="md:hidden">{cited ? <CitedPill compact /> : <NotCitedPill compact />}</span>
      <span className="hidden md:flex">{cited ? <CitedPill /> : <NotCitedPill />}</span>
    </motion.span>
  );
}

function Sparkline() {
  const w = 120;
  const h = 34;
  const top = Math.max(...TREND);
  const pts = TREND.map(
    (v, i) => [(i / (TREND.length - 1)) * w, h - 2 - (v / top) * (h - 8)] as const,
  );
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`-4 -4 ${w + 8} ${h + 8}`} className="h-9 w-[7.5rem] shrink-0 overflow-visible">
      <path d={`${line} L${w} ${h} L0 ${h} Z`} className="fill-cta/10" />
      <path d={line} fill="none" strokeWidth={1.75} strokeLinejoin="round" className="stroke-cta" />
      <circle cx={lx} cy={ly} r={3} strokeWidth={1.5} className="fill-cta stroke-white" />
    </svg>
  );
}

/* ---------- The whole picture ---------- */

export function CitationTracker() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useStill();
  /* -1: nothing asked yet. 0..N-1: that prompt is out. N: all done. */
  const [row, setRow] = useState(-1);
  /* The row whose answers have all come back and been recorded. */
  const [settledRow, setSettledRow] = useState(-1);

  // Off screen, start over, so the next visit sees the run from the top.
  useEffect(() => {
    if (!inView) {
      setRow(-1);
      setSettledRow(-1);
    }
  }, [inView]);

  useEffect(() => {
    if (!inView || reduce || row >= N) return;
    if (row < 0) {
      const id = window.setTimeout(() => setRow(0), START_MS);
      return () => window.clearTimeout(id);
    }
    const settle = window.setTimeout(() => setSettledRow(row), SETTLE_MS);
    const next = window.setTimeout(() => setRow(row + 1), ROW_MS);
    return () => {
      window.clearTimeout(settle);
      window.clearTimeout(next);
    };
  }, [inView, reduce, row]);

  const still = Boolean(reduce);
  const done = still || row >= N;
  const idle = !still && row < 0;
  const running = !still && row >= 0 && row < N;
  const settled = running && settledRow === row;
  /* The prompt on show: the current one, the first before the run, the last after. */
  const shown = done ? N - 1 : Math.max(0, row);
  /* Rows whose answers are in the ledger. */
  const resolved = done ? N : idle ? 0 : row + (settled ? 1 : 0);

  const tilePhase: "idle" | "live" | "still" = idle ? "idle" : done || still ? "still" : "live";
  const cellState = (r: number): CellState => {
    if (r < resolved) return r === row && settled ? "live" : "still";
    if (r === row && running) return "checking";
    return "idle";
  };

  const total = ENGINES.reduce((n, _, e) => n + citedFor(e, resolved), 0);
  const shownPrompt = PROMPTS[shown];
  const shownArticle = shownPrompt.article ? ARTICLES[shownPrompt.article] : null;
  const shownCites = ENGINES.filter((_, e) => isCited(shown, e)).length;
  const shownIn = shown < resolved;

  return (
    <div ref={ref} role="img" aria-label={ARIA} className="text-left">
      {/* The prompt and the four answers. */}
      <div className={cn("grid grid-cols-1 gap-2.5 lg:gap-0", COLS_LG)}>
        <div className="lg:pr-3">
          <PromptCard row={shown} resolved={resolved} running={running} />
        </div>
        <div className="relative grid grid-cols-2 gap-2.5 md:grid-cols-4 lg:contents">
          {ENGINES.map((engine, e) => (
            <div key={engine.name} className="relative lg:px-1.5">
              {e === 0 && <Pin n={1} className="absolute -left-1.5 -top-1.5 z-10 lg:left-0" />}
              <AnswerTile
                key={idle ? "idle" : `row-${shown}`}
                e={e}
                row={shown}
                phase={tilePhase}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Each answer drops into its column. */}
      <div aria-hidden className={cn("hidden h-8 lg:grid", COLS_LG)}>
        <div />
        {ENGINES.map((engine, e) => (
          <div key={engine.name} className="relative flex justify-center">
            <span className="h-full w-px bg-[linear-gradient(to_bottom,rgba(16,24,40,0.14),rgba(16,24,40,0.06))]" />
            <span className="absolute -bottom-[3px] h-[5px] w-[5px] rounded-full border border-ink/[0.18] bg-white" />
            {settled && isCited(row, e) && (
              <motion.span
                key={`drop-${row}-${e}`}
                className="absolute top-0 h-3 w-[2px] rounded-full bg-cta"
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 30, opacity: [0, 1, 1, 0] }}
                transition={{ delay: e * 0.09, duration: 0.5, ease: "easeIn" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* The ledger. */}
      <div
        className={cn(
          "mt-3 overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06] lg:mt-0",
          "shadow-[0_2px_4px_rgba(4,24,72,0.05),0_32px_72px_-28px_rgba(4,24,72,0.34)]",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-ink/[0.07] px-3.5 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <Mark className="h-[1.1rem] w-[1.1rem] shrink-0 text-brand-blue" />
            <span className="text-[0.85rem] font-semibold text-ink">Citations</span>
            <span className="flex items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.68rem] font-medium text-ink">
              {SITE}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
              {running ? (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cta" />
                  </span>
                  Checking prompt {row + 1} of {N}
                </>
              ) : done ? (
                <>
                  <Check className="h-3 w-3 text-cta" strokeWidth={3} />
                  {N} prompts checked
                </>
              ) : (
                <>
                  {N} prompts · {ENGINES.length} engines
                </>
              )}
            </span>
            <SampleTag />
          </div>
        </div>

        {/* Column heads: each engine's share of the prompts so far. */}
        <div className={cn("grid border-b border-ink/[0.07] bg-ink/[0.015]", COLS)}>
          <div className="flex items-end px-3.5 py-2.5 text-[0.66rem] font-medium text-muted-foreground sm:px-4">
            Prompt
          </div>
          {ENGINES.map((engine, e) => {
            const n = citedFor(e, resolved);
            return (
              <div
                key={engine.name}
                className="flex flex-col items-center justify-end gap-1.5 px-1 py-2.5 md:px-3"
              >
                <span className="flex items-center gap-1.5">
                  <MarkTile
                    Mark={engine.Mark}
                    className="h-5 w-5 rounded-[5px]"
                    markClassName="h-3 w-3"
                  />
                  <span className="hidden truncate text-[0.7rem] font-medium text-ink md:inline">
                    {engine.short}
                  </span>
                </span>
                <span className="hidden w-full items-center gap-2 md:flex">
                  <span className="block h-1 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
                    <span
                      className="block h-full rounded-full bg-cta transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ width: `${(n / N) * 100}%` }}
                    />
                  </span>
                  <span className="text-[0.64rem] font-semibold text-ink tabular-nums">
                    {n}/{N}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* One row per prompt. */}
        <div>
          {PROMPTS.map((p, r) => {
            const active = running && r === row;
            const state = cellState(r);
            const gap = p.article === null && r < resolved;
            return (
              <div
                key={p.q}
                className={cn(
                  "relative grid h-11 items-center border-b border-ink/[0.05] transition-colors duration-500 last:border-b-0",
                  COLS,
                  active && "bg-[color-mix(in_oklab,var(--cta)_5%,white)]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="ledger-row"
                    className="absolute inset-y-0 left-0 w-[2px] bg-cta"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
                <div className="flex min-w-0 items-center gap-2 px-3.5 sm:px-4">
                  <span
                    className={cn(
                      "line-clamp-2 min-w-0 text-[0.74rem] leading-snug sm:text-[0.78rem] md:line-clamp-1",
                      active ? "font-medium text-ink" : "text-ink/80",
                    )}
                  >
                    {p.q}
                  </span>
                  {gap && (
                    <motion.span
                      className="shrink-0 rounded-md bg-[#fdf4e4] px-1.5 py-0.5 text-[0.6rem] font-semibold text-[#b45309]"
                      initial={state === "live" ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Gap
                    </motion.span>
                  )}
                </div>
                {ENGINES.map((engine, e) => (
                  <div key={engine.name} className="flex justify-center px-1 py-2.5 md:px-3">
                    <LedgerCell cited={isCited(r, e)} state={state} e={e} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Totals: share of answers, the article behind the current row, the trend. */}
        <div
          className={cn(
            "grid gap-px border-t border-ink/[0.07] bg-ink/[0.07]",
            "md:grid-cols-[minmax(0,1.55fr)_minmax(0,2fr)_minmax(0,2fr)]",
          )}
        >
          <div className="bg-white px-3.5 py-3 sm:px-4">
            <p className="text-[0.66rem] text-muted-foreground">Answers citing {SITE}</p>
            <p className="mt-1 flex items-baseline gap-1 text-[1.25rem] font-semibold leading-none tracking-tight text-ink">
              <Num value={total} run={running} />
              <span className="text-[0.78rem] font-medium text-muted-foreground">
                of {TOTAL_ANSWERS}
              </span>
            </p>
            <div className="mt-2.5 flex gap-[3px]">
              {PROMPTS.flatMap((p, r) =>
                ENGINES.map((engine, e) => (
                  <span
                    key={`${r}-${e}`}
                    className={cn(
                      "h-1.5 flex-1 rounded-[2px] transition-colors duration-500",
                      r >= resolved ? "bg-ink/[0.05]" : isCited(r, e) ? "bg-cta" : "bg-ink/[0.14]",
                    )}
                  />
                )),
              )}
            </div>
          </div>

          <div className="min-w-0 bg-white px-3.5 py-3 sm:px-4">
            <p className="flex items-center gap-1.5 text-[0.66rem] text-muted-foreground">
              <Pin n={2} />
              Earned by
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shown}
                className="mt-1.5 flex min-w-0 items-center gap-2.5"
                initial={running ? { opacity: 0, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.14 } }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {shownArticle ? (
                  <>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cta-soft text-cta">
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.76rem] font-medium text-ink">
                        {shownArticle.title}
                      </span>
                      <span className="block truncate text-[0.66rem] text-muted-foreground">
                        {shownIn
                          ? `${shownArticle.path} · cited by ${shownCites} of ${ENGINES.length}`
                          : shownArticle.path}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#fdf4e4] text-[#b45309]">
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.76rem] font-medium text-ink">
                        No article yet
                      </span>
                      <span className="block truncate text-[0.66rem] text-muted-foreground">
                        {shownPrompt.q}
                      </span>
                    </span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between gap-3 bg-white px-3.5 py-3 sm:px-4">
            <div>
              <p className="flex items-center gap-1.5 text-[0.66rem] text-muted-foreground">
                <Pin n={3} />
                Over time
              </p>
              <p className="mt-1.5 text-[0.76rem] font-medium text-ink">Visibility trend</p>
            </div>
            <Sparkline />
          </div>
        </div>
      </div>
    </div>
  );
}
