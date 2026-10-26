/**
 * The page's focal visual: the comparison drawn as a butterfly chart.
 *
 * Writesonic starts from the answers and works back; Rankbox starts from the
 * questions and works forward (the entry's own positioning). So the work is
 * laid out top to bottom, from finding what to write to measuring AI
 * visibility, with one row per row of the side-by-side table. Rankbox's bars
 * grow to the left of the label, Writesonic's to the right; a full bar is
 * "included", a shorter one "partly", a dashed stub "not its focus". The
 * lengths encode those three states and nothing else: no scores.
 *
 * Motion tells the same story. Once half the chart is on screen, Rankbox's
 * lane lights from the top (the questions) down while Writesonic's lights
 * from the bottom (the answers) up, a row at a time, until they've crossed.
 * It resets when it leaves the screen. The server renders the finished chart,
 * and with reduced motion that finished chart is all there is.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeftRight, ArrowUp, Check } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import type { CellState, Competitor, MatrixGroup, MatrixRow } from "@/data/alternatives";
import { cn } from "@/lib/utils";
import { STATE_SHORT, THEM_SOFT, THEM_SOLID, splitAccent } from "./lib";

/* Bar length per state: the three states as three lengths, nothing finer. */
const LENGTH: Record<CellState, string> = { yes: "100%", partial: "52%", no: "14%" };
/* One lane step, in ms. */
const STEP_MS = 230;
const START_MS = 380;

type Unit =
  { kind: "group"; group: MatrixGroup } | { kind: "row"; row: MatrixRow; group: MatrixGroup };

/* The stages of the work. Price and seats aren't a stage, so they stay in the
   table further down rather than at the foot of the chart. */
function stagesOf(c: Competitor): MatrixGroup[] {
  const stages = c.matrix.filter((g) => !/^plan\b/i.test(g.group));
  return stages.length ? stages : c.matrix;
}

function Bar({ state, side, on }: { state: CellState; side: "rankbox" | "them"; on: boolean }) {
  const fill =
    state === "no"
      ? "border border-dashed border-ink/25 bg-transparent"
      : side === "rankbox"
        ? state === "yes"
          ? "bg-cta"
          : "bg-[color-mix(in_oklab,var(--cta)_42%,white)]"
        : state === "yes"
          ? THEM_SOLID
          : THEM_SOFT;
  return (
    <span
      className={cn("flex h-full w-full", side === "rankbox" ? "justify-end" : "justify-start")}
    >
      <span
        className={cn(
          "block h-full rounded-[3px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          side === "rankbox" ? "origin-right" : "origin-left",
          fill,
        )}
        style={{ width: LENGTH[state], transform: on ? "scaleX(1)" : "scaleX(0)" }}
      />
    </span>
  );
}

/* A lane's piece of track beside one unit, lit as the lane reaches it. */
function LaneSegment({
  side,
  lit,
  head,
}: {
  side: "rankbox" | "them";
  lit: boolean;
  head: boolean;
}) {
  const rb = side === "rankbox";
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-y-0 w-[2px]",
        rb ? "left-2.5 sm:left-4" : "right-2.5 sm:right-4",
      )}
    >
      <span className="absolute inset-0 bg-ink/[0.07]" />
      <span
        className={cn(
          "absolute inset-0 transition-transform duration-200 ease-linear",
          rb ? "origin-top bg-cta" : cn("origin-bottom", THEM_SOLID),
        )}
        style={{ transform: lit ? "scaleY(1)" : "scaleY(0)" }}
      />
      {head && (
        <span
          className={cn(
            "absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-4",
            rb
              ? "bottom-0 translate-y-1/2 bg-cta ring-cta/15"
              : "top-0 -translate-y-1/2 ring-ink/10",
            !rb && THEM_SOLID,
          )}
        />
      )}
    </span>
  );
}

function Butterfly({ competitor: c }: { competitor: Competitor }) {
  const groups = stagesOf(c);
  const units: Unit[] = groups.flatMap((group) => [
    { kind: "group" as const, group },
    ...group.rows.map((row) => ({ kind: "row" as const, row, group })),
  ]);
  const total = units.length;
  const rowCount = units.filter((u) => u.kind === "row").length;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();
  // The server and a first paint show the finished chart; it only empties
  // itself once hydrated and off screen, ready to run when it's scrolled to.
  const [step, setStep] = useState(total);

  useEffect(() => {
    if (!inView) setStep(0);
  }, [inView]);

  useEffect(() => {
    if (!inView || reduce || step >= total) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? START_MS : STEP_MS);
    return () => window.clearTimeout(id);
  }, [inView, reduce, step, total]);

  const shown = reduce ? total : step;
  const running = !reduce && shown > 0 && shown < total;
  const rbLit = (k: number) => k < shown;
  const themLit = (k: number) => total - 1 - k < shown;

  const label = `Butterfly chart of ${rowCount} rows from the side-by-side table below, stage by stage from ${groups[0]?.group.toLowerCase()} to ${groups.at(-1)?.group.toLowerCase()}. Rankbox's bars run left, ${c.name}'s run right; a full bar is included, a shorter bar partly, a dashed stub not its focus.`;

  return (
    <div
      ref={ref}
      className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_32px_64px_-36px_rgba(16,24,40,0.35)]"
    >
      {/* Lane heads: who runs which way. */}
      <div className={cn("grid grid-cols-2 border-b", LINE)}>
        <div className="flex gap-3 bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-4 py-4 sm:px-6 sm:py-5">
          <RankboxMark className="h-8 w-8 sm:h-9 sm:w-9" />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[0.9rem] font-semibold text-cta">
              Rankbox
              <ArrowDown aria-hidden className="h-3.5 w-3.5" />
            </p>
            <p className="mt-0.5 text-[0.78rem] leading-snug text-muted-foreground sm:text-[0.82rem]">
              {c.verdict.rankbox}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "flex flex-row-reverse gap-3 border-l px-4 py-4 text-right sm:px-6 sm:py-5",
            LINE,
          )}
        >
          <CompetitorMark competitor={c} className="h-8 w-8 sm:h-9 sm:w-9" />
          <div className="min-w-0">
            <p className="flex items-center justify-end gap-1.5 text-[0.9rem] font-semibold text-ink">
              <ArrowUp aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />
              {c.name}
            </p>
            <p className="mt-0.5 text-[0.78rem] leading-snug text-muted-foreground sm:text-[0.82rem]">
              {c.verdict.them}
            </p>
          </div>
        </div>
      </div>

      {/* The chart. Every value in it is in the table further down, so it is
          one image to assistive tech rather than a second table. */}
      <div role="img" aria-label={label} className="py-3 sm:py-4">
        {units.map((u, k) => {
          const rbHead = running && k === shown - 1;
          const themHead = running && total - 1 - k === shown - 1;
          if (u.kind === "group") {
            const Icon = u.group.icon;
            return (
              <div
                key={`g-${u.group.group}`}
                className={cn("grid grid-cols-[1fr_minmax(7.5rem,15rem)_1fr]", k > 0 && "mt-1.5")}
              >
                <span className="relative">
                  <LaneSegment side="rankbox" lit={rbLit(k)} head={rbHead} />
                </span>
                <span className="flex items-center justify-center gap-1.5 px-1 pb-1 pt-3 text-center">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
                  <span className="text-[0.64rem] font-semibold uppercase leading-tight tracking-[0.13em] text-ink sm:text-[0.68rem]">
                    {u.group.group}
                  </span>
                </span>
                <span className="relative">
                  <LaneSegment side="them" lit={themLit(k)} head={themHead} />
                </span>
              </div>
            );
          }
          const { row } = u;
          const rbOn = rbLit(k);
          const themOn = themLit(k);
          return (
            <div
              key={`r-${row.label}`}
              className="grid grid-cols-[1fr_minmax(7.5rem,15rem)_1fr] items-stretch"
            >
              {/* Rankbox: word at the lane, bar growing out from the label. */}
              <span className="relative flex items-center gap-3 py-1.5 pl-6 pr-2 sm:pl-10 sm:pr-3">
                <LaneSegment side="rankbox" lit={rbOn} head={rbHead} />
                <span
                  className={cn(
                    "hidden w-[5.2rem] shrink-0 text-[0.72rem] font-medium transition-opacity duration-300 sm:block",
                    row.rankbox.state === "no" ? "text-muted-foreground" : "text-cta",
                    rbOn ? "opacity-100" : "opacity-0",
                  )}
                >
                  {STATE_SHORT[row.rankbox.state]}
                </span>
                <span className="h-3 min-w-0 flex-1">
                  <Bar state={row.rankbox.state} side="rankbox" on={rbOn} />
                </span>
              </span>

              <span
                className={cn(
                  "flex items-center justify-center px-1.5 py-1.5 text-center text-[0.76rem] leading-snug transition-colors duration-300 sm:px-2 sm:text-[0.84rem]",
                  rbOn || themOn ? "text-ink" : "text-ink/45",
                )}
              >
                {row.label}
              </span>

              {/* The competitor: mirror image. */}
              <span className="relative flex items-center gap-3 py-1.5 pl-2 pr-6 sm:pl-3 sm:pr-10">
                <span className="h-3 min-w-0 flex-1">
                  <Bar state={row.them.state} side="them" on={themOn} />
                </span>
                <span
                  className={cn(
                    "hidden w-[5.2rem] shrink-0 text-right text-[0.72rem] font-medium transition-opacity duration-300 sm:block",
                    row.them.state === "no" ? "text-muted-foreground" : "text-ink/70",
                    themOn ? "opacity-100" : "opacity-0",
                  )}
                >
                  {STATE_SHORT[row.them.state]}
                </span>
                <LaneSegment side="them" lit={themOn} head={themHead} />
              </span>
            </div>
          );
        })}
      </div>

      {/* Key, and where the detail lives. */}
      <div
        className={cn(
          "flex flex-col gap-3 border-t px-4 py-4 text-[0.76rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6",
          LINE,
        )}
      >
        <ul aria-hidden className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-7 rounded-[3px] bg-cta" />
            Included
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded-[3px] bg-[color-mix(in_oklab,var(--cta)_42%,white)]" />
            Partly
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2 rounded-[3px] border border-dashed border-ink/30" />
            Not its focus
          </li>
        </ul>
        <p>
          {rowCount} rows, each in{" "}
          <a href="#compare" className="font-medium text-ink underline underline-offset-2">
            the side-by-side table
          </a>{" "}
          with its note.
        </p>
      </div>
    </div>
  );
}

/* The two "where each differs" lists, as a pair of hairline cells. */
function DiffLists({ competitor: c }: { competitor: Competitor }) {
  const p = c.positioning;
  return (
    <div className="grid lg:grid-cols-2">
      <Reveal className="h-full">
        <div className="flex h-full flex-col p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <RankboxMark className="h-10 w-10" />
            <div>
              <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                {p.rankboxTitle}
              </h3>
              <p className="text-[0.82rem] text-muted-foreground">
                {p.rankboxTag ?? "An engine, not an editor"}
              </p>
            </div>
          </div>
          <ul className="mt-6 space-y-3">
            {p.rankbox.map((item) => (
              <li key={item} className="flex gap-3 text-[0.92rem] leading-snug text-ink">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal delay={0.06} className={cn("h-full border-t lg:border-l lg:border-t-0", LINE)}>
        <div className="flex h-full flex-col p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <CompetitorMark competitor={c} className="h-10 w-10" />
            <div>
              <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                {p.themTitle}
              </h3>
              <p className="text-[0.82rem] text-muted-foreground">{c.category}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-3">
            {p.them.map((item) => (
              <li key={item} className="flex gap-3 text-[0.92rem] leading-snug text-ink">
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white",
                    THEM_SOLID,
                  )}
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

export function WritesonicOppositeEnds({ competitor: c }: { competitor: Competitor }) {
  const { lead, accent } = splitAccent(c.positioning.title);
  return (
    <section aria-labelledby="ends-title">
      <Spacer />
      <SectionHead
        icon={ArrowLeftRight}
        eyebrow="Opposite ends"
        title={
          <span id="ends-title">
            {lead} <Accent>{accent}</Accent>
          </span>
        }
        subtitle={c.positioning.body}
      />
      <Band inner={PANEL}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="px-3 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-14"
        >
          <Butterfly competitor={c} />
        </motion.div>
      </Band>
      <Band>
        <DiffLists competitor={c} />
      </Band>
    </section>
  );
}
