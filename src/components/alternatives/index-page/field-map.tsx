/**
 * The hub's focal picture: every tool on one price axis, one lane per kind of
 * product, with Rankbox's own price drawn as a blue reference line through
 * all of them. A toggle swaps the axis from the monthly price to the cost of
 * one article, and the field re-sorts itself; plans that are not sold by the
 * article step off the scale into a lane-end bay rather than being guessed.
 *
 * Arrival: the pins slide in from the start of the axis, cheapest first,
 * while the map is about half on screen, and line up again from scratch the
 * next time it comes into view. Reduced motion shows the finished map.
 *
 * Every number is read from the same rows as the table below it.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CompetitorMark } from "@/components/alternatives/kit";
import { LINE } from "@/components/landing/frame";
import { cn } from "@/lib/utils";
import { UsMark } from "./marks";
import { FIELD_ROWS, KIND_GROUPS, NOT_PER_ARTICLE, type FieldRow } from "./data";
import { EASE, useArrival } from "./motion";

type Mode = "monthly" | "each";

const MODES: { id: Mode; label: string }[] = [
  { id: "monthly", label: "Monthly price" },
  { id: "each", label: "Per article" },
];

/* Geometry, in percent of the track. The scale runs to AXIS; the bay for
   plans not sold by the article sits past BAY_LINE, its chips hung from the
   track's right edge. */
const AXIS = 80;
const BAY_LINE = 84;
const BAY_X = 99;
/* A chip's footprint on the track, for stacking: it hangs CHIP to one side
   of its pin. Chips closer than that climb a level. */
const CHIP = 12;
const ANCHOR = 1.6;
const GAP = 1.5;
/* Past this, a chip hangs to the left of its pin instead. */
const FLIP_AT = AXIS - CHIP + 2;
/* Vertical rhythm, in px. */
const LEVEL = 46;
const LIFT = 14;

function niceMax(values: number[], step: number) {
  return Math.ceil(Math.max(...values) / step) * step;
}

const MONTHLY_MAX = niceMax(
  FIELD_ROWS.map((r) => r.monthly),
  50,
);
const EACH_MAX = niceMax(
  FIELD_ROWS.flatMap((r) => (r.each === null ? [] : [r.each])),
  1,
);

const SCALE: Record<Mode, { max: number; step: number; label: (v: number) => string }> = {
  monthly: { max: MONTHLY_MAX, step: 50, label: (v) => `$${v}` },
  each: { max: EACH_MAX, step: 1, label: (v) => `$${v}` },
};

function ticks(mode: Mode) {
  const { max, step } = SCALE[mode];
  const out: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += step) out.push(v);
  return out;
}

interface Placement {
  x: number;
  level: number;
  flip: boolean;
  parked: boolean;
  value: string;
  /** Order of arrival: cheapest first. */
  order: number;
}

/* ---------- lanes, and where each pin lands in each mode ---------- */

interface Lane {
  id: string;
  label: string;
  rows: FieldRow[];
}

const LANES: Lane[] = [
  { id: "rankbox", label: "Rankbox", rows: FIELD_ROWS.filter((r) => r.us) },
  ...KIND_GROUPS.map((g) => ({
    id: g.kind,
    label: g.label,
    rows: FIELD_ROWS.filter((r) => !r.us && r.kind === g.kind),
  })),
];

function valueIn(mode: Mode, r: FieldRow): number | null {
  return mode === "monthly" ? r.monthly : r.each;
}

function place(mode: Mode): Map<string, Placement> {
  const out = new Map<string, Placement>();
  const max = SCALE[mode].max;

  // Arrival order across the whole map: cheapest first, bay last.
  const ranked = [...FIELD_ROWS].sort(
    (a, b) => (valueIn(mode, a) ?? Infinity) - (valueIn(mode, b) ?? Infinity),
  );
  const order = new Map(ranked.map((r, i) => [r.key, i]));

  for (const lane of LANES) {
    const onScale = lane.rows
      .filter((r) => valueIn(mode, r) !== null)
      .map((r) => ({ r, x: ((valueIn(mode, r) as number) / max) * AXIS }))
      .sort((a, b) => a.x - b.x);
    // Greedy stacking: each chip takes the lowest level it fits on.
    const ends: number[] = [];
    for (const { r, x } of onScale) {
      const flip = x > FLIP_AT;
      const start = flip ? x - CHIP : x - ANCHOR;
      const end = flip ? x + ANCHOR : x + CHIP;
      let level = ends.findIndex((e) => e + GAP <= start);
      if (level === -1) level = ends.length;
      ends[level] = end;
      out.set(r.key, {
        x,
        level,
        flip,
        parked: false,
        value: mode === "monthly" ? r.price : r.perArticle,
        order: order.get(r.key) ?? 0,
      });
    }
    lane.rows
      .filter((r) => valueIn(mode, r) === null)
      .forEach((r, level) =>
        out.set(r.key, {
          x: BAY_X,
          level,
          flip: true,
          parked: true,
          // Off the per-article scale, they show what they are sold at instead.
          value: r.price,
          order: order.get(r.key) ?? 0,
        }),
      );
  }
  return out;
}

const PLACES: Record<Mode, Map<string, Placement>> = {
  monthly: place("monthly"),
  each: place("each"),
};

/* A lane is as tall as its busiest mode, so switching never shifts the page. */
function levelsOf(lane: Lane) {
  let most = 1;
  for (const mode of ["monthly", "each"] as Mode[]) {
    for (const r of lane.rows) most = Math.max(most, (PLACES[mode].get(r.key)?.level ?? 0) + 1);
  }
  return most;
}

const RANKBOX_KEY = FIELD_ROWS.find((r) => r.us)!.key;

/* ---------- pieces ---------- */

function Pin({ row, at, placed }: { row: FieldRow; at: Placement; placed: boolean }) {
  const us = row.us;
  const lift = LIFT + at.level * LEVEL;
  const transition = placed
    ? { duration: 0.85, ease: EASE, delay: 0.08 + at.order * 0.06 }
    : { duration: 0 };

  const value = at.parked ? `${NOT_PER_ARTICLE}, ${at.value}` : at.value;
  const label = `${us ? "Rankbox" : `Rankbox vs ${row.name}`}: ${value}`;
  const chipClass = cn(
    "flex items-center gap-2 whitespace-nowrap rounded-lg border py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_20px_-14px_rgba(16,24,40,0.3)] transition-colors",
    "max-sm:flex-col max-sm:gap-1 max-sm:border-0 max-sm:bg-transparent max-sm:p-0 max-sm:shadow-none",
    at.flip ? "flex-row-reverse pl-2.5 pr-1 text-right" : "pl-1 pr-2.5",
    us
      ? "border-cta/30 bg-cta-soft"
      : "border-ink/[0.08] bg-white hover:border-cta/40 hover:bg-[color-mix(in_oklab,var(--cta)_4%,white)]",
  );
  const chipBody = (
    <>
      {us ? (
        <UsMark className="h-7 w-7 text-brand-blue" />
      ) : (
        <CompetitorMark competitor={row.competitor!} className="h-7 w-7" />
      )}
      <span className="flex flex-col leading-tight max-sm:items-center">
        <span
          className={cn("text-[0.75rem] font-semibold max-sm:hidden", us ? "text-cta" : "text-ink")}
        >
          {row.name}
        </span>
        <span
          className={cn(
            "text-[0.68rem] tabular-nums max-sm:text-[0.6rem]",
            us ? "font-semibold text-cta" : "text-muted-foreground",
            at.parked && "max-sm:hidden",
          )}
        >
          {at.value}
        </span>
      </span>
    </>
  );

  return (
    <motion.div
      className="absolute bottom-0 top-0 w-0"
      initial={false}
      animate={{ left: placed ? `${at.x}%` : "0%", opacity: placed ? 1 : 0 }}
      transition={transition}
      style={{ zIndex: us ? 3 : 2 }}
    >
      {/* The pin's foot on the lane's baseline, and its stem up to the chip. */}
      <motion.span
        aria-hidden
        className={cn(
          "absolute -bottom-[4px] -left-[4px] h-2 w-2 rounded-full ring-2 ring-white",
          us ? "bg-cta" : "bg-ink/35",
        )}
        initial={false}
        animate={{ opacity: at.parked ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        aria-hidden
        className={cn("absolute bottom-0 left-0 w-px", us ? "bg-cta/45" : "bg-ink/[0.14]")}
        initial={false}
        animate={{ height: at.parked ? 0 : lift, opacity: at.parked ? 0 : 1 }}
        transition={transition}
      />
      <motion.div
        className={cn(
          "absolute",
          at.parked ? "right-0" : at.flip ? "-right-[15px]" : "-left-[15px]",
        )}
        initial={false}
        animate={{ bottom: lift }}
        transition={transition}
      >
        {us ? (
          <span className={chipClass}>
            <span className="sr-only">{label}</span>
            <span aria-hidden className="contents">
              {chipBody}
            </span>
          </span>
        ) : (
          <Link
            to="/alternatives/$slug"
            params={{ slug: row.key }}
            aria-label={label}
            className={cn(
              chipClass,
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25",
            )}
          >
            {chipBody}
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}

/* The vertical rules and the scale under the lanes, one set per mode,
   cross-faded so the axis re-labels as the pins move. */
function Gridlines({ mode }: { mode: Mode }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {(["monthly", "each"] as Mode[]).map((m) => (
        <motion.div
          key={m}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: m === mode ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {ticks(m).map((v) => (
            <span
              key={v}
              className="absolute bottom-0 top-0 border-l border-dashed border-ink/[0.07]"
              style={{ left: `${(v / SCALE[m].max) * AXIS}%` }}
            />
          ))}
        </motion.div>
      ))}
      {/* The bay for plans not sold by the article. */}
      <motion.div
        className={cn("absolute bottom-0 right-0 top-0 border-l border-dashed", LINE)}
        style={{
          left: `${BAY_LINE}%`,
          background:
            "repeating-linear-gradient(135deg, transparent 0 6px, color-mix(in oklab, var(--ink) 3%, transparent) 6px 7px)",
        }}
        initial={false}
        animate={{ opacity: mode === "each" ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function AxisLabels({ mode }: { mode: Mode }) {
  return (
    <div aria-hidden className="relative h-8">
      {(["monthly", "each"] as Mode[]).map((m) => (
        <motion.div
          key={m}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: m === mode ? 1 : 0, y: m === mode ? 0 : 4 }}
          transition={{ duration: 0.35 }}
        >
          {ticks(m).map((v) => (
            <span
              key={v}
              className="absolute top-2 -translate-x-1/2 text-[0.68rem] tabular-nums text-muted-foreground"
              style={{ left: `${(v / SCALE[m].max) * AXIS}%` }}
            >
              {SCALE[m].label(v)}
            </span>
          ))}
          {m === "each" && (
            <span
              className="absolute top-2 text-[0.62rem] font-medium leading-tight text-muted-foreground sm:text-[0.68rem]"
              style={{ left: `${BAY_LINE + 1}%` }}
            >
              {NOT_PER_ARTICLE}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* Rankbox's own price, carried down through every lane. */
function ReferenceLine({ mode, placed }: { mode: Mode; placed: boolean }) {
  const at = PLACES[mode].get(RANKBOX_KEY)!;
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute bottom-0 top-0 z-[1] w-0 border-l-[1.5px] border-dashed border-cta/45"
      initial={false}
      animate={{ left: placed ? `${at.x}%` : "0%", opacity: placed ? 1 : 0 }}
      transition={placed ? { duration: 0.85, ease: EASE, delay: 0.08 } : { duration: 0 }}
    />
  );
}

/* ---------- the map ---------- */

const LABEL_COL = "lg:grid lg:grid-cols-[12.5rem_minmax(0,1fr)]";

export function FieldMap() {
  const [mode, setMode] = useState<Mode>("monthly");
  const { ref, placed } = useArrival<HTMLDivElement>(0.5);
  const places = PLACES[mode];

  return (
    <div className="px-4 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8rem] text-muted-foreground">
          Plan closest to 30 articles a month, one site
        </p>
        <div
          role="group"
          aria-label="Scale"
          className="inline-flex w-fit rounded-lg border border-ink/[0.08] bg-white p-0.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[0.8rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25",
                mode === m.id ? "bg-cta-soft text-cta" : "text-muted-foreground hover:text-ink",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={ref} className="mt-6">
        <ul aria-label={`Every tool by ${MODES.find((m) => m.id === mode)!.label.toLowerCase()}`}>
          {LANES.map((lane) => {
            const height = LIFT + levelsOf(lane) * LEVEL + 6;
            const us = lane.id === "rankbox";
            return (
              <li key={lane.id} className={cn("border-t first:border-t-0", LINE, LABEL_COL)}>
                <p
                  className={cn(
                    "pt-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] lg:flex lg:items-end lg:pb-3 lg:pr-4 lg:pt-0",
                    us ? "text-cta" : "text-muted-foreground",
                  )}
                >
                  {lane.label}
                </p>
                <div
                  className={cn(
                    "relative border-b",
                    LINE,
                    us &&
                      "bg-[linear-gradient(to_top,color-mix(in_oklab,var(--cta)_5%,white),white)]",
                  )}
                  style={{ height }}
                >
                  <Gridlines mode={mode} />
                  <ReferenceLine mode={mode} placed={placed} />
                  {lane.rows.map((r) => (
                    <Pin key={r.key} row={r} at={places.get(r.key)!} placed={placed} />
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
        <div className={LABEL_COL}>
          <span aria-hidden className="hidden lg:block" />
          <AxisLabels mode={mode} />
        </div>
      </div>
    </div>
  );
}
