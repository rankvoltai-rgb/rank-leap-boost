/**
 * The page's focal picture: one article's trip from a buyer's question to
 * yoursite.com, with Rankbox and Jasper as two lanes beside the steps.
 *
 * The argument of this comparison is the data's own positioning line, "the
 * difference is everything either side of the writing", so the board lists
 * the matrix rows that make up the article loop in the order the work
 * happens, and sets each product's state on its lane. Nothing on it is
 * drawn: every row label, state and caption is read from the matrix.
 * Below the loop sits the one row that is outside it, marketing copy beyond
 * articles, where Jasper is the one with the tick.
 *
 * While the board is about half on screen a playhead walks the steps, the
 * Rankbox lane fills behind it, the finished article lands, and the
 * playhead visits the row beyond the loop before starting over. Leaving the
 * screen resets it. With reduced motion it holds the finished frame.
 */
import { useMemo } from "react";
import { motion } from "motion/react";
import { FileText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Competitor, MatrixRow } from "@/data/alternatives";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { usePhases } from "./clock";
import { SCREEN, STATE_LABEL, rowsByLabel } from "./helpers";
import { StateToken } from "./parts";

/* The loop, in the order the work happens. Brand voice sits with the
   writing, where Jasper is strongest. */
const LOOP = [
  "Buyer-question research",
  "Long-form with live research",
  "Brand voice",
  "Inline source citations",
  "Quality gate",
  "Publishes to your CMS",
  "Runs on a schedule",
] as const;
const BEYOND = ["Marketing copy formats"] as const;

const STEP_MS = 1700;
const LANDED_MS = 2600;
const BEYOND_MS = 2800;
const EASE = [0.16, 1, 0.3, 1] as const;
/* Stable targets, so the chip pops once when the article lands rather than
   on every render. */
const POP = { scale: [0.8, 1.06, 1] };
const REST = { scale: 1 };

const COLS =
  "grid grid-cols-[minmax(0,1fr)_4rem_4rem] sm:grid-cols-[minmax(0,1fr)_5.25rem_5.25rem]";

function boardLabel(c: Competitor, loop: MatrixRow[], beyond: MatrixRow[]): string {
  const say = (r: MatrixRow) =>
    `${r.label}: Rankbox ${STATE_LABEL[r.rankbox.state].toLowerCase()}, ${c.name} ${STATE_LABEL[r.them.state].toLowerCase()}`;
  return [
    `${loop.length} steps from a buyer's question to your site. ${loop.map(say).join("; ")}.`,
    beyond.length ? ` Beyond articles: ${beyond.map(say).join("; ")}.` : "",
  ].join("");
}

function Lane({
  state,
  active,
  ringId,
  fill,
  first,
  last,
  tone,
}: {
  state: MatrixRow["rankbox"]["state"];
  active: boolean;
  ringId: string;
  /** How much of this cell's line is filled: none, the half above, or all. */
  fill: "none" | "top" | "all";
  first: boolean;
  last: boolean;
  tone: "cta" | "ink";
}) {
  const base = tone === "cta" ? "bg-cta/15" : "bg-ink/[0.09]";
  const on = tone === "cta" ? "bg-cta" : "bg-ink/[0.09]";
  return (
    <div className="relative flex items-center justify-center">
      {!first && (
        <span
          className={cn(
            "absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2 transition-colors duration-500",
            fill === "none" ? base : on,
          )}
        />
      )}
      {!last && (
        <span
          className={cn(
            "absolute bottom-0 left-1/2 h-1/2 w-[2px] -translate-x-1/2 transition-colors duration-500",
            fill === "all" ? on : base,
          )}
        />
      )}
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white">
        {active && (
          <motion.span
            layoutId={ringId}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0 rounded-full ring-2 ring-cta/30"
          />
        )}
        <StateToken state={state} size="md" />
      </span>
    </div>
  );
}

function StepRow({
  row,
  n,
  active,
  passed,
  phase,
  index,
  count,
  isLoop,
}: {
  row: MatrixRow;
  n: number | null;
  active: boolean;
  passed: boolean;
  phase: number;
  index: number;
  count: number;
  isLoop: boolean;
}) {
  // The Rankbox lane fills down to the playhead, and all the way once the
  // article has landed (phase >= count).
  const fill: "none" | "top" | "all" = !isLoop
    ? "none"
    : phase > index
      ? "all"
      : phase === index
        ? "top"
        : "none";
  return (
    <li className={cn("relative px-3 sm:px-4", COLS)}>
      {active && (
        <motion.span
          layoutId="relay-row"
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute inset-x-1.5 inset-y-0.5 rounded-lg bg-cta-soft"
        />
      )}
      <div className="relative flex min-w-0 items-center gap-2.5 py-2.5 pr-2">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[0.72rem] font-semibold tabular-nums transition-colors duration-500",
            active
              ? "bg-cta text-white"
              : passed
                ? "bg-cta-soft text-cta"
                : "border border-ink/[0.1] bg-white text-muted-foreground",
          )}
        >
          {n ?? "+"}
        </span>
        <span
          className={cn(
            "min-w-0 text-[0.8rem] leading-snug transition-colors duration-500 sm:text-[0.86rem]",
            active ? "font-medium text-ink" : "text-ink/80",
          )}
        >
          {row.label}
        </span>
      </div>
      <Lane
        state={row.rankbox.state}
        active={active}
        ringId="relay-ring-rankbox"
        fill={fill}
        first={!isLoop || index === 0}
        last={!isLoop || index === count - 1}
        tone="cta"
      />
      <Lane
        state={row.them.state}
        active={active}
        ringId="relay-ring-them"
        fill="none"
        first={!isLoop || index === 0}
        last={!isLoop || index === count - 1}
        tone="ink"
      />
    </li>
  );
}

export function RelayBoard({
  competitor,
  className,
}: {
  competitor: Competitor;
  className?: string;
}) {
  const loop = rowsByLabel(competitor, LOOP);
  const beyond = rowsByLabel(competitor, BEYOND);
  const durations = useMemo(
    () => [
      ...Array.from({ length: loop.length }, () => STEP_MS),
      LANDED_MS,
      ...Array.from({ length: beyond.length }, () => BEYOND_MS),
    ],
    [loop.length, beyond.length],
  );
  const { ref, phase: running, still } = usePhases<HTMLDivElement>(durations);

  // The finished frame: every step passed, the article landed.
  const phase = still ? loop.length : running;
  const landed = phase >= loop.length;
  const beyondActive = phase > loop.length;

  const status =
    phase < loop.length
      ? `Step ${phase + 1} of ${loop.length}`
      : beyondActive
        ? "Beyond articles"
        : "Article ready";

  const captions = [
    ...loop.map((r) => r.detail),
    competitor.verdict.rankbox,
    ...beyond.map((r) => r.detail),
  ];

  return (
    <div
      ref={ref}
      role="img"
      aria-label={boardLabel(competitor, loop, beyond)}
      className={cn(SCREEN, "w-full overflow-hidden", className)}
    >
      {/* Window bar */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-3">
        <span className="flex min-w-0 items-center gap-2 text-[0.8rem] font-medium text-ink">
          <FileText className="h-3.5 w-3.5 shrink-0 text-cta" />
          <span className="truncate">One article, question to site</span>
        </span>
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold tabular-nums transition-colors duration-300",
            landed && !beyondActive ? "bg-cta text-white" : "bg-cta-soft text-cta",
          )}
        >
          {status}
        </span>
      </div>

      {/* Lane heads */}
      <div className={cn("items-end px-3 pb-1 pt-3.5 sm:px-4", COLS)}>
        <span className="pb-1 pl-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Step
        </span>
        <span className="flex flex-col items-center gap-1">
          <RankboxMark className="h-7 w-7" />
          <span className="text-[0.68rem] font-semibold text-ink">Rankbox</span>
        </span>
        <span className="flex flex-col items-center gap-1">
          <CompetitorMark competitor={competitor} className="h-7 w-7 text-[0.6rem]" />
          <span className="max-w-full truncate text-[0.68rem] font-semibold text-ink">
            {competitor.name}
          </span>
        </span>
      </div>

      <ol className="pb-1">
        {loop.map((row, i) => (
          <StepRow
            key={row.label}
            row={row}
            n={i + 1}
            index={i}
            count={loop.length}
            phase={phase}
            active={!still && phase === i}
            passed={phase > i}
            isLoop
          />
        ))}
      </ol>

      {/* The article lands */}
      <div className="mx-3 mb-2 mt-1 flex items-center justify-between gap-3 rounded-lg border border-dashed border-ink/[0.12] px-3 py-2 sm:mx-4">
        <span className="flex min-w-0 items-center gap-2 text-[0.8rem] text-ink/80">
          <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">yoursite.com</span>
        </span>
        <motion.span
          initial={false}
          animate={landed && !still ? POP : REST}
          transition={{ duration: 0.5, ease: EASE }}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[0.7rem] font-semibold",
            landed
              ? "bg-cta text-white"
              : "border border-dashed border-ink/15 text-muted-foreground",
          )}
        >
          <FileText className="h-3 w-3" />
          {landed ? "New article" : "In progress"}
        </motion.span>
      </div>

      {beyond.length > 0 && (
        <>
          <div className="flex items-center gap-3 px-4 pb-0.5 pt-2.5">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Beyond articles
            </span>
            <span className="h-px flex-1 border-t border-dashed border-ink/[0.12]" />
          </div>
          <ul className="pb-2">
            {beyond.map((row, i) => (
              <StepRow
                key={row.label}
                row={row}
                n={null}
                index={i}
                count={beyond.length}
                phase={phase}
                active={!still && phase === loop.length + 1 + i}
                passed={false}
                isLoop={false}
              />
            ))}
          </ul>
        </>
      )}

      {/* Caption: what the active row is about, read from the matrix. Every
          caption sits in the same grid cell, so the card never changes
          height as they swap. */}
      <div className="grid border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-3">
        {captions.map((text, i) => (
          <p
            key={i}
            className={cn(
              "col-start-1 row-start-1 text-[0.8rem] leading-relaxed text-muted-foreground transition-opacity duration-300",
              i === phase ? "opacity-100" : "opacity-0",
            )}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
