/**
 * The page's focal visual: one content pipeline, research to tracking, with
 * a track for each tool. Each stage takes the feature-matrix row that is that
 * stage's core job, quoted as written, and the track's line is drawn solid
 * where the tool covers the stage and dashed where it covers it in part. Read
 * left to right, the two tracks share a middle and differ at the ends, which
 * is the comparison in one picture.
 *
 * Motion: while the card is about half on screen, a pulse runs down both
 * tracks at once, stage by stage, filling each line and lighting each node.
 * It resets when the card leaves, so it runs again on the way back. With
 * reduced motion the tracks are drawn in full from the start. Before it runs
 * (and in the server HTML) every node already shows its state in grey, so
 * nothing depends on the animation to be read.
 *
 * One DOM, two shapes: from lg the stages are columns and the tools rows; on
 * a phone the stages are rows and the tools columns. Each stage is a subgrid
 * item, so its three cells line up across the whole track either way.
 */
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Workflow } from "lucide-react";
import { Accent, Band, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { ProductMark } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { CellState, MatchupEntry, MatrixRow } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { StateGlyph } from "./parts";
import { SIDES, STATE_LABEL, jump } from "./util";

/* The stage names are ours; each one points at the matrix row that is the
   core of that stage, so every cell below is the matrix's own words. */
const STAGES: { step: string; row: string }[] = [
  { step: "Research", row: "Keyword research" },
  { step: "Plan", row: "Briefs & outlines" },
  { step: "Write", row: "AI article drafting" },
  { step: "Optimize", row: "Live content score" },
  { step: "Publish", row: "Publishes to your CMS" },
  { step: "Refresh", row: "Refresh & republish" },
  { step: "Track", row: "AI visibility tracking" },
];

/* Seconds per stage of the pulse. */
const STEP_S = 0.5;

/* The coloured line for a stage, by how much of it the tool covers. */
const LINE_FILL: Record<CellState, { h: string; v: string }> = {
  yes: { h: "bg-cta", v: "bg-cta" },
  partial: {
    h: "bg-[repeating-linear-gradient(90deg,var(--cta)_0_7px,transparent_7px_12px)]",
    v: "bg-[repeating-linear-gradient(180deg,var(--cta)_0_7px,transparent_7px_12px)]",
  },
  no: {
    h: "bg-[repeating-linear-gradient(90deg,rgba(16,24,40,0.28)_0_2px,transparent_2px_7px)]",
    v: "bg-[repeating-linear-gradient(180deg,rgba(16,24,40,0.28)_0_2px,transparent_2px_7px)]",
  },
};

function TrackCell({
  product,
  cell,
  index,
  progress,
  lit,
}: {
  product: Product;
  cell: MatrixRow["a"];
  index: number;
  progress: MotionValue<number>;
  lit: boolean;
}) {
  const fill = useTransform(progress, [index, index + 1], [0, 1]);
  const fills = LINE_FILL[cell.state];
  return (
    <div className="relative min-w-0 pb-6 pl-8 pr-3 pt-1 lg:pb-7 lg:pl-0 lg:pr-4 lg:pt-6">
      {/* The rail under the line, then the line itself: down the cell on a
          phone, across it from lg. */}
      <span
        aria-hidden
        className="absolute bottom-0 left-[9px] top-1 w-[3px] bg-ink/[0.06] lg:hidden"
      />
      <motion.span
        aria-hidden
        style={{ scaleY: fill }}
        className={cn("absolute bottom-0 left-[9px] top-1 w-[3px] origin-top lg:hidden", fills.v)}
      />
      <span
        aria-hidden
        className="absolute left-0 right-0 top-[calc(1.5rem+9px)] hidden h-[3px] bg-ink/[0.06] lg:block"
      />
      <motion.span
        aria-hidden
        style={{ scaleX: fill }}
        className={cn(
          "absolute left-0 right-0 top-[calc(1.5rem+9px)] hidden h-[3px] origin-left lg:block",
          fills.h,
        )}
      />

      {/* The node: the stage's state, grey until the pulse reaches it. */}
      <span
        className={cn(
          "absolute left-0 top-1 flex h-[21px] w-[21px] items-center justify-center rounded-full bg-white transition-shadow duration-500 lg:top-6",
          lit &&
            cell.state !== "no" &&
            "shadow-[0_0_0_5px_color-mix(in_oklab,var(--cta)_12%,transparent)]",
        )}
      >
        <StateGlyph state={cell.state} lit={lit} className="h-[15px] w-[15px]" />
      </span>

      <p className="sr-only">{product.name}:</p>
      <p
        className={cn(
          "text-[0.79rem] leading-snug transition-colors duration-500 lg:mt-9 lg:text-[0.78rem]",
          cell.state === "no" ? "text-muted-foreground" : lit ? "text-ink" : "text-ink/70",
        )}
      >
        {cell.note}
      </p>
    </div>
  );
}

export function Pipeline({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const rows = entry.matrix.flatMap((g) => g.rows);
  const stages = STAGES.flatMap((s) => {
    const row = rows.find((r) => r.label === s.row);
    return row ? [{ ...s, data: row }] : [];
  });
  const n = stages.length;

  const ref = useRef<HTMLDivElement>(null);
  // Runs once the card is half on screen; resets only once it's fully gone.
  const inView = useInView(ref, { amount: 0.5 });
  const present = useInView(ref);
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const [reached, setReached] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    // A node lights when the pulse is a third of the way into its stage.
    setReached(Math.floor(v + 0.67));
  });

  /* The running pulse lives in a ref, so dipping under half-visible doesn't
     cut it short; only leaving the screen entirely stops and resets it. */
  const run = useRef<ReturnType<typeof animate> | null>(null);
  useEffect(() => {
    if (reduce) {
      run.current?.stop();
      run.current = null;
      progress.set(n);
      return;
    }
    if (!present) {
      run.current?.stop();
      run.current = null;
      progress.set(0);
      return;
    }
    if (inView && !run.current) {
      run.current = animate(progress, n, { duration: n * STEP_S, ease: "linear", delay: 0.25 });
    }
  }, [inView, present, reduce, n, progress]);
  useEffect(() => () => run.current?.stop(), []);

  return (
    <section id="pipeline" aria-labelledby="pipeline-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Workflow}
        eyebrow="Stage by stage"
        title={
          <span id="pipeline-title">
            One content pipeline, <Accent>two different ends</Accent>
          </span>
        }
        subtitle={`${n} stages from research to tracking. Each cell is that stage's row from the feature matrix, as written; the line is solid where a tool covers the stage and dashed where it covers it in part.`}
      />
      <Band inner={cn("px-3 py-8 sm:px-8 sm:py-12 lg:px-6 lg:py-14", PANEL)}>
        <div
          ref={ref}
          className="overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_56px_-28px_rgba(16,24,40,0.3)]"
        >
          {/* The card's own header, like a screen's title bar. */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-ink/[0.07] px-4 py-3 sm:px-6">
            <p className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-cta">
                <Workflow className="h-3.5 w-3.5" aria-hidden />
              </span>
              Coverage by stage
            </p>
            <ul
              aria-label="Key"
              className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.72rem] text-muted-foreground"
            >
              {(Object.keys(STATE_LABEL) as CellState[]).map((s) => (
                <li key={s} className="flex items-center gap-1.5">
                  <StateGlyph state={s} />
                  <span aria-hidden>{STATE_LABEL[s]}</span>
                </li>
              ))}
            </ul>
          </div>

          <ol
            aria-label="Coverage by stage"
            className="grid grid-cols-2 px-3 sm:px-6 lg:grid-flow-col lg:grid-cols-[7.25rem_repeat(7,minmax(0,1fr))] lg:grid-rows-[auto_auto_auto]"
          >
            {/* The lane labels: a header row on a phone, a column from lg. */}
            <li
              aria-hidden
              className="col-span-2 grid grid-cols-subgrid border-b border-ink/[0.07] lg:col-span-1 lg:row-span-3 lg:grid-cols-none lg:grid-rows-subgrid lg:border-b-0 lg:border-r lg:pr-4"
            >
              <span className="hidden border-b border-ink/[0.07] lg:block" />
              {SIDES.map((side) => (
                <span
                  key={side}
                  className="flex min-w-0 items-center gap-2 py-3 lg:items-start lg:py-0 lg:pt-[1.15rem]"
                >
                  <ProductMark
                    product={sides[side]}
                    className="h-6 w-6 text-[0.6rem] lg:h-8 lg:w-8 lg:text-xs"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[0.82rem] font-semibold text-ink lg:whitespace-normal lg:text-[0.88rem] lg:leading-tight">
                      {sides[side].name}
                    </span>
                  </span>
                </span>
              ))}
            </li>

            {stages.map((s, i) => (
              <li
                key={s.row}
                className="col-span-2 grid grid-cols-subgrid lg:col-span-1 lg:row-span-3 lg:grid-cols-none lg:grid-rows-subgrid lg:pl-4"
              >
                <div className="col-span-2 flex min-w-0 items-baseline gap-2 pb-3 pt-5 lg:col-span-1 lg:block lg:border-b lg:border-ink/[0.07] lg:py-4 lg:pr-2">
                  <span className="text-[0.66rem] font-medium tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.88rem] font-semibold tracking-tight text-ink lg:mt-0.5 lg:block lg:text-[0.95rem]">
                    {s.step}
                  </span>
                  <span className="min-w-0 truncate text-[0.72rem] text-muted-foreground lg:mt-0.5 lg:block lg:whitespace-normal lg:leading-snug">
                    <span aria-hidden className="lg:hidden">
                      ·{" "}
                    </span>
                    {s.data.label}
                  </span>
                </div>
                {SIDES.map((side) => (
                  <TrackCell
                    key={side}
                    product={sides[side]}
                    cell={s.data[side]}
                    index={i}
                    progress={progress}
                    lit={reached > i}
                  />
                ))}
              </li>
            ))}
          </ol>

          <p className="border-t border-ink/[0.07] px-4 py-3 text-[0.72rem] text-muted-foreground sm:px-6">
            Taken from the{" "}
            <a
              href="#features"
              onClick={(e) => jump(e, "features")}
              className="text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink/50"
            >
              full feature matrix
            </a>{" "}
            below · facts last checked {formatDate(matchup.updated)}
          </p>
        </div>
      </Band>
    </section>
  );
}
