/**
 * The focal picture of /compare/semrush-vs-ahrefs: both price lists on one
 * dollar scale, drawn as a ladder. Semrush's plans hang off the left rail,
 * Ahrefs' off the right, each at its published monthly price, and a budget
 * line rises through them like a water level: every plan under it is in
 * reach, and the top one on each side is what that budget buys.
 *
 * The readout beside it says it in words, from the data verbatim, and the
 * full price sheet below highlights the same two plans.
 *
 * Motion: while the ladder is at least half on screen the budget climbs from
 * rung to rung and wraps; it goes back to its still frame when it leaves.
 * Touching the slider or a preset hands the budget to the visitor and stops
 * the climb. With reduced motion it holds the still frame, at about $200,
 * where the two suites' AI-tracking plans sit side by side. SSR renders that
 * still frame, so the first paint matches on server and client.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, CircleDollarSign, Pause, Play } from "lucide-react";
import {
  Accent,
  Band,
  LINE,
  LINE_FILL,
  PANEL,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { ProductMark } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import { entryPrice } from "@/data/compare/starting-price";
import type { MatchupEntry, Plan, ProductPricing, Side } from "@/data/compare/types";
import { formatUsd } from "@/data/pricing";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md } from "./md";
import { useStill } from "./still";

const SIDES: Side[] = ["a", "b"];

/* ---------- geometry ---------- */

/** Top of the drawn scale, in USD a month. Plans above it sit in the band over the ladder. */
const CAP = 600;
/** Height of the scale, in px. */
const PLOT = 400;
/** Room under $0 and over the cap, so chips at either end aren't clipped. */
const PAD = 18;
/** The least vertical room between two chips on one rail. */
const GAP = 30;
const TICKS = [0, 100, 200, 300, 400, 500, 600];
/** The price the still frame stops on: the stop closest to this. */
const STILL_NEAR = 200;
/** ms on each rung, and on the top rung before wrapping. */
const DWELL = 1500;
const HOLD = 2600;

type Priced = Plan & { monthly: number };

interface Rung {
  plan: Priced;
  /** px above $0 where the price really sits. */
  at: number;
  /** px above $0 where its chip sits, nudged up when two prices crowd. */
  label: number;
}

const y = (usd: number) => (Math.min(usd, CAP) / CAP) * PLOT;

function ladderOf(p: ProductPricing): { rungs: Rung[]; beyond: Plan[] } {
  const priced = p.plans
    .filter((pl): pl is Priced => pl.monthly !== null && pl.monthly <= CAP)
    .sort((x, z) => x.monthly - z.monthly);
  let prev = -Infinity;
  const rungs = priced.map((plan) => {
    const at = y(plan.monthly);
    const label = Math.max(at, prev + GAP);
    prev = label;
    return { plan, at, label };
  });
  const beyond = p.plans.filter((pl) => pl.monthly === null || pl.monthly > CAP);
  return { rungs, beyond };
}

/** Every price on either list that the scale shows: the budget's stops. */
function stopsOf(entry: MatchupEntry): number[] {
  const prices = SIDES.flatMap((s) =>
    entry.pricing[s].plans
      .map((pl) => pl.monthly)
      .filter((m): m is number => m !== null && m <= CAP),
  );
  return [...new Set(prices)].sort((x, z) => x - z);
}

/** The dearest plan a budget reaches, if any. */
function planAt(p: ProductPricing, budget: number): Priced | null {
  const reach = p.plans.filter((pl): pl is Priced => pl.monthly !== null && pl.monthly <= budget);
  return reach.length ? reach.reduce((x, z) => (z.monthly >= x.monthly ? z : x)) : null;
}

/** The next plan up from a budget: the cheapest priced one above it, else a quote-only one. */
function nextAbove(p: ProductPricing, budget: number): Plan | null {
  const above = p.plans.filter((pl): pl is Priced => pl.monthly !== null && pl.monthly > budget);
  if (above.length) return above.reduce((x, z) => (z.monthly < x.monthly ? z : x));
  return p.plans.find((pl) => pl.monthly === null) ?? null;
}

function priceLabel(pl: Plan): string {
  return pl.monthly === null ? "Custom" : formatUsd(pl.monthly);
}

/* Horizontal anchors, as CSS: the spine sits in the middle, the rails are its edges. */
const RAIL_L = "calc(50% - var(--spine) / 2)";
const RAIL_R = "calc(50% + var(--spine) / 2)";
const CHIP_L = "calc(50% + var(--spine) / 2 + var(--conn))";

/* ---------- the section ---------- */

export function PriceLadderSection({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const stops = stopsOf(entry);
  const still = stops.reduce(
    (best, s, i) => (Math.abs(s - STILL_NEAR) < Math.abs(stops[best] - STILL_NEAR) ? i : best),
    0,
  );

  const [stop, setStop] = useState(still);
  const [auto, setAuto] = useState(true);
  const stopRef = useRef(stop);
  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useStill();
  const playing = auto && inView && !reduce;

  useEffect(() => {
    if (reduce) return;
    if (!inView) {
      // Off screen: back to the still frame, unless the visitor chose a budget.
      if (auto) setStop(still);
      return;
    }
    if (!auto) return;
    let i = stopRef.current;
    let id = 0;
    const last = stops.length - 1;
    const tick = () => {
      id = window.setTimeout(
        () => {
          i = (i + 1) % stops.length;
          setStop(i);
          tick();
        },
        i === last ? HOLD : DWELL,
      );
    };
    tick();
    return () => window.clearTimeout(id);
  }, [inView, auto, reduce, still, stops.length]);

  const choose = (i: number) => {
    setAuto(false);
    setStop(i);
  };

  const budget = stops[stop];
  const picked: Record<Side, Priced | null> = {
    a: planAt(entry.pricing.a, budget),
    b: planAt(entry.pricing.b, budget),
  };

  return (
    <section id="price-ladder" aria-labelledby="ladder-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={CircleDollarSign}
        eyebrow="Price ladder"
        title={
          <span id="ladder-title">
            What each one costs, <Accent>rung by rung</Accent>
          </span>
        }
        subtitle={`Every published plan on one dollar scale, read from both pricing pages on ${formatDate(entry.pricing.checkedOn)}. Move the budget to see which plan each one sells you at that price.`}
      />

      <Band>
        <div className={cn("grid gap-px lg:grid-cols-[1.12fr_1fr]", LINE_FILL)}>
          <div className={cn(PANEL, "px-4 py-8 sm:px-8 sm:py-10 lg:px-10")}>
            <div ref={ref}>
              <Ladder sides={sides} entry={entry} budget={budget} reduce={reduce} />
            </div>
          </div>

          <div className="bg-white px-6 py-8 sm:px-10 sm:py-10 lg:px-10">
            <Readout
              sides={sides}
              entry={entry}
              stops={stops}
              stop={stop}
              picked={picked}
              playing={playing}
              canPlay={!reduce}
              onChoose={choose}
              onToggle={() => setAuto((v) => !v)}
            />
          </div>
        </div>
      </Band>

      <Band>
        <PriceSheet sides={sides} entry={entry} picked={picked} budget={budget} />
      </Band>

      <Band inner="px-6 py-6 sm:px-10 lg:px-12">
        <p className="text-[0.84rem] leading-relaxed text-muted-foreground">
          <span className="font-medium text-ink">What the list prices leave out. </span>
          <Md text={entry.pricing.note} />
        </p>
        <p className="mt-3 text-[0.78rem] text-muted-foreground">
          Monthly list prices in USD, checked on{" "}
          <time dateTime={entry.pricing.checkedOn} className="font-medium text-ink">
            {formatDate(entry.pricing.checkedOn)}
          </time>
          .
        </p>
      </Band>
    </section>
  );
}

/* ---------- the ladder ---------- */

function chipTone(state: "picked" | "reached" | "ahead") {
  return state === "picked"
    ? "border-cta bg-cta text-white shadow-[0_6px_18px_-8px_rgba(22,111,229,0.7)]"
    : state === "reached"
      ? "border-ink/[0.1] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
      : "border-dashed border-ink/[0.16] bg-white/80 text-muted-foreground";
}

function Chip({ plan, state }: { plan: Plan; state: "picked" | "reached" | "ahead" }) {
  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center gap-1.5 whitespace-nowrap rounded-md border px-2 text-[0.7rem] font-medium transition-[background-color,border-color,color,box-shadow] duration-300 sm:px-2.5 sm:text-[0.78rem]",
        chipTone(state),
      )}
    >
      <span>{plan.name}</span>
      <span className={cn("tabular-nums", state === "picked" ? "text-white/85" : "opacity-70")}>
        {priceLabel(plan)}
      </span>
    </span>
  );
}

function Ladder({
  sides,
  entry,
  budget,
  reduce,
}: {
  sides: Record<Side, Product>;
  entry: MatchupEntry;
  budget: number;
  reduce: boolean;
}) {
  const ladders = { a: ladderOf(entry.pricing.a), b: ladderOf(entry.pricing.b) };
  const level = y(budget);
  const glide = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 120, damping: 22, mass: 0.9 };

  const describe = SIDES.map(
    (s) =>
      `${sides[s].name}: ${entry.pricing[s].plans.map((pl) => `${pl.name} ${priceLabel(pl)}`).join(", ")}`,
  ).join(". ");

  return (
    <figure
      role="img"
      aria-label={`Price ladder, monthly list prices. ${describe}. Budget line at ${formatUsd(budget)} a month.`}
      className="mx-auto max-w-[34rem] rounded-xl border border-ink/[0.07] bg-white px-3 pb-4 pt-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-24px_rgba(16,24,40,0.28)] [--conn:12px] [--spine:58px] sm:px-5 sm:pt-5 sm:[--conn:22px] sm:[--spine:76px]"
    >
      {/* Who hangs off which rail. */}
      <div aria-hidden className="grid grid-cols-[1fr_var(--spine)_1fr] items-center">
        <span className="flex items-center justify-end gap-2 pr-2 text-[0.82rem] font-semibold text-ink sm:text-[0.9rem]">
          {sides.a.name}
          <ProductMark product={sides.a} className="h-6 w-6 text-[0.6rem] sm:h-7 sm:w-7" />
        </span>
        <span className="text-center text-[0.62rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          /mo
        </span>
        <span className="flex items-center gap-2 pl-2 text-[0.82rem] font-semibold text-ink sm:text-[0.9rem]">
          <ProductMark product={sides.b} className="h-6 w-6 text-[0.6rem] sm:h-7 sm:w-7" />
          {sides.b.name}
        </span>
      </div>

      {/* Off the scale: quote-only plans and anything over the cap. */}
      <div aria-hidden className="relative mt-4 h-12">
        <span
          className="absolute inset-y-0 border-l border-dashed border-ink/[0.16]"
          style={{ left: RAIL_L }}
        />
        <span
          className="absolute inset-y-0 border-l border-dashed border-ink/[0.16]"
          style={{ left: RAIL_R }}
        />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-white px-1 text-[0.62rem] font-medium text-muted-foreground"
          style={{ left: "50%" }}
        >
          {formatUsd(CAP)}+
        </span>
        {SIDES.map((s) => (
          <div
            key={s}
            className={cn(
              "absolute top-1/2 flex -translate-y-1/2 flex-col gap-1",
              s === "a" ? "items-end" : "items-start",
            )}
            style={s === "a" ? { right: `calc(${RAIL_R} + var(--conn))` } : { left: CHIP_L }}
          >
            {ladders[s].beyond.map((pl) => (
              <Chip key={pl.name} plan={pl} state="ahead" />
            ))}
          </div>
        ))}
      </div>

      {/* The scale. */}
      <div aria-hidden className="relative" style={{ height: PLOT + PAD * 2 }}>
        {/* The water level: everything under it is in reach. */}
        <motion.div
          className="absolute inset-x-0 bottom-0 rounded-b-lg border-t-2 border-cta bg-[linear-gradient(to_top,color-mix(in_oklab,var(--cta)_11%,white),color-mix(in_oklab,var(--cta)_4%,white))]"
          initial={false}
          animate={{ height: PAD + level }}
          transition={glide}
        />

        {/* Rails. */}
        {[RAIL_L, RAIL_R].map((left) => (
          <span
            key={left}
            className="absolute w-px bg-ink/[0.18]"
            style={{ left, bottom: PAD, height: PLOT + PAD }}
          />
        ))}

        {/* Every $100, a rung between the rails. */}
        {TICKS.map((t) => (
          <div
            key={t}
            className="absolute"
            style={{ left: RAIL_L, width: "var(--spine)", bottom: PAD + y(t) }}
          >
            <span className="block h-px w-full bg-ink/[0.14]" />
            <span
              className={cn(
                "absolute bottom-1 left-1/2 -translate-x-1/2 text-[0.62rem] tabular-nums text-muted-foreground transition-opacity duration-300",
                // The budget's tag sits in the spine; the label under it steps aside.
                Math.abs(t - budget) < 24 && "opacity-0",
              )}
            >
              {formatUsd(t)}
            </span>
          </div>
        ))}

        {/* Each plan: a dot on its rail at the true price, a connector, a chip. */}
        {SIDES.map((s) => {
          const { rungs } = ladders[s];
          const top = topReached(rungs, budget);
          return rungs.map((r) => {
            const reached = r.plan.monthly <= budget;
            const state = r === top ? "picked" : reached ? "reached" : "ahead";
            const low = Math.min(r.at, r.label);
            const h = Math.abs(r.label - r.at) + 2;
            const yAt = ((Math.max(r.at, r.label) + 1 - r.at) / h) * 100;
            const yLabel = ((Math.max(r.at, r.label) + 1 - r.label) / h) * 100;
            return (
              <div key={`${s}-${r.plan.name}`}>
                <svg
                  className={cn(
                    "absolute overflow-visible transition-colors duration-300",
                    reached ? "text-cta" : "text-ink/25",
                  )}
                  style={{
                    bottom: PAD + low - 1,
                    height: h,
                    width: "var(--conn)",
                    ...(s === "a" ? { right: RAIL_R } : { left: RAIL_R }),
                  }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1={s === "a" ? 100 : 0}
                    y1={yAt}
                    x2={s === "a" ? 0 : 100}
                    y2={yLabel}
                    stroke="currentColor"
                    strokeWidth={1.25}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span
                  className={cn(
                    "absolute h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 transition-colors duration-300",
                    reached ? "border-cta bg-cta" : "border-ink/25 bg-white",
                  )}
                  style={{ left: s === "a" ? RAIL_L : RAIL_R, bottom: PAD + r.at }}
                />
                <span
                  className="absolute z-10 translate-y-1/2"
                  style={{
                    bottom: PAD + r.label,
                    ...(s === "a" ? { right: `calc(${RAIL_R} + var(--conn))` } : { left: CHIP_L }),
                  }}
                >
                  <Chip plan={r.plan} state={state} />
                </span>
              </div>
            );
          });
        })}

        {/* The budget's tag, riding the water line in the spine. */}
        <motion.span
          className="absolute left-1/2 z-20 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-md bg-cta px-1.5 py-0.5 text-[0.7rem] font-semibold tabular-nums text-white shadow-[0_4px_12px_-4px_rgba(22,111,229,0.6)] sm:px-2 sm:text-[0.76rem]"
          initial={false}
          animate={{ bottom: PAD + level }}
          transition={glide}
        >
          {formatUsd(budget)}
        </motion.span>
      </div>
    </figure>
  );
}

function topReached(rungs: Rung[], budget: number): Rung | undefined {
  return rungs.filter((r) => r.plan.monthly <= budget).at(-1);
}

/* ---------- the readout ---------- */

function Readout({
  sides,
  entry,
  stops,
  stop,
  picked: chosen,
  playing,
  canPlay,
  onChoose,
  onToggle,
}: {
  sides: Record<Side, Product>;
  entry: MatchupEntry;
  stops: number[];
  stop: number;
  picked: Record<Side, Priced | null>;
  playing: boolean;
  canPlay: boolean;
  onChoose: (i: number) => void;
  onToggle: () => void;
}) {
  const budget = stops[stop];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.8rem] font-medium text-muted-foreground">Monthly budget</p>
          <p className="mt-1 font-display text-[2.6rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums sm:text-[3rem]">
            {formatUsd(budget)}
            <span className="ml-1.5 align-baseline text-[0.95rem] font-normal tracking-normal text-muted-foreground">
              /month
            </span>
          </p>
        </div>
        {canPlay && (
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-2.5 py-1.5 text-[0.76rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            {playing ? (
              <Pause className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Play className="h-3.5 w-3.5" aria-hidden />
            )}
            {playing ? "Pause the climb" : "Play the climb"}
          </button>
        )}
      </div>

      <input
        type="range"
        min={0}
        max={stops.length - 1}
        step={1}
        value={stop}
        onChange={(e) => onChoose(Number(e.target.value))}
        aria-label="Monthly budget"
        aria-valuetext={`${formatUsd(budget)} a month`}
        className="mt-6 h-2 w-full cursor-pointer accent-cta"
      />

      <div className="mt-4 flex flex-wrap gap-1" role="group" aria-label="Budget presets">
        {stops.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => onChoose(i)}
            aria-pressed={i === stop}
            className={cn(
              "rounded-md border px-[0.4rem] py-1 text-[0.72rem] font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
              i === stop
                ? "border-cta bg-cta text-white"
                : "border-ink/[0.1] bg-white text-ink/75 hover:border-ink/[0.2] hover:text-ink",
            )}
          >
            {formatUsd(s)}
          </button>
        ))}
      </div>

      <div
        aria-live={playing ? "off" : "polite"}
        className={cn(
          "mt-7 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-1",
          LINE,
          LINE_FILL,
        )}
      >
        {SIDES.map((s) => (
          <AtBudget
            key={s}
            product={sides[s]}
            pricing={entry.pricing[s]}
            plan={chosen[s]}
            budget={budget}
          />
        ))}
      </div>
    </div>
  );
}

function AtBudget({
  product,
  pricing,
  plan,
  budget,
}: {
  product: Product;
  pricing: ProductPricing;
  plan: Priced | null;
  budget: number;
}) {
  const next = nextAbove(pricing, budget);
  return (
    <div className="flex flex-col bg-white p-5">
      <p className="flex items-center gap-2 text-[0.8rem] font-medium text-muted-foreground">
        <ProductMark product={product} className="h-5 w-5 text-[0.5rem]" />
        {product.name} at {formatUsd(budget)}
      </p>
      {plan ? (
        <>
          <p className="mt-3 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.02em] text-ink">
            {plan.name}
          </p>
          <p className="mt-0.5 text-[0.82rem] tabular-nums text-ink/70">
            {plan.monthly === 0 ? "Free" : `${formatUsd(plan.monthly)}/mo`}
            {plan.annual !== undefined && plan.annual < plan.monthly && (
              <span className="text-muted-foreground">
                {" "}
                · {formatUsd(plan.annual)}/mo billed yearly
              </span>
            )}
          </p>
          <p className="mt-3 flex-1 text-[0.85rem] leading-relaxed text-muted-foreground">
            {plan.includes}
          </p>
        </>
      ) : (
        <>
          <p className="mt-3 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.02em] text-ink/45">
            Below its cheapest plan
          </p>
          <p className="mt-3 flex-1 text-[0.85rem] leading-relaxed text-muted-foreground">
            {pricing.trial}
          </p>
        </>
      )}
      {next && (
        <p className={cn("mt-4 border-t pt-3 text-[0.76rem] text-muted-foreground", LINE)}>
          Next rung:{" "}
          <span className="font-medium text-ink">
            {next.name}, {next.monthly === null ? "custom quote" : `${formatUsd(next.monthly)}/mo`}
          </span>
        </p>
      )}
    </div>
  );
}

/* ---------- the full price sheet ---------- */

function PriceSheet({
  sides,
  entry,
  picked: chosen,
  budget,
}: {
  sides: Record<Side, Product>;
  entry: MatchupEntry;
  picked: Record<Side, Priced | null>;
  budget: number;
}) {
  return (
    <div className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
      {SIDES.map((s) => {
        const p = entry.pricing[s];
        const from = entryPrice(p);
        return (
          <div key={s} className="flex flex-col bg-white">
            <div className="px-6 pt-8 sm:px-10">
              <div className="flex items-center gap-3">
                <ProductMark product={sides[s]} className="h-10 w-10 text-sm" />
                <div className="min-w-0">
                  <h3 className="text-[1.05rem] font-semibold text-ink">{sides[s].name} plans</h3>
                  <p className="text-[0.8rem] text-muted-foreground">{p.model}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-[0.76rem] font-medium text-muted-foreground">Starts at</p>
                {from ? (
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-[2.2rem] font-medium leading-none tracking-[-0.035em] text-ink tabular-nums">
                      {formatUsd(from.monthly)}
                    </span>
                    <span className="text-[0.85rem] text-muted-foreground">/month</span>
                    {from.annual !== undefined && from.annual < from.monthly && (
                      <span className="text-[0.85rem] text-muted-foreground">
                        · {formatUsd(from.annual)}/mo billed yearly
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="mt-1 font-display text-[1.8rem] font-medium text-ink">
                    Custom quote
                  </p>
                )}
              </div>
            </div>

            <ul className={cn("mt-6 flex-1 border-t", LINE)}>
              {p.plans.map((pl) => {
                const on = chosen[s]?.name === pl.name;
                return (
                  <li
                    key={pl.name}
                    className={cn(
                      "flex items-start justify-between gap-4 border-b px-6 py-3.5 transition-[background-color,box-shadow] duration-300 sm:px-10",
                      LINE,
                      on &&
                        "bg-[color-mix(in_oklab,var(--cta)_6%,white)] shadow-[inset_3px_0_0_var(--cta)]",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-[0.9rem] font-medium text-ink">
                        {pl.name}
                        {on && (
                          <span className="rounded bg-cta-soft px-1.5 py-px text-[0.66rem] font-semibold text-cta">
                            At {formatUsd(budget)}
                          </span>
                        )}
                        {pl.forAgencies && (
                          <span className="rounded border border-ink/[0.1] px-1.5 py-px text-[0.66rem] font-medium text-muted-foreground">
                            For agencies
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[0.8rem] leading-snug text-muted-foreground">
                        {pl.includes}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[0.9rem] font-medium tabular-nums text-ink">
                        {pl.monthly === null
                          ? "Custom"
                          : pl.monthly === 0
                            ? "Free"
                            : `${formatUsd(pl.monthly)}/mo`}
                      </p>
                      {pl.annual !== undefined && pl.monthly !== null && pl.annual < pl.monthly && (
                        <p className="mt-0.5 text-[0.72rem] tabular-nums text-muted-foreground">
                          {formatUsd(pl.annual)}/mo yearly
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-10">
              <p className="max-w-sm text-[0.8rem] leading-snug text-muted-foreground">{p.trial}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex shrink-0 items-center gap-1 text-[0.8rem] font-medium text-cta underline-offset-4 hover:underline"
              >
                {sides[s].name} pricing page
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
