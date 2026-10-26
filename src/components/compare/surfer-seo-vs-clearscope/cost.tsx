/**
 * The page's focal picture: the seat ladder.
 *
 * What decides Surfer SEO against Clearscope for most teams isn't a feature,
 * it's headcount. Surfer sells 1, 3, 5 or 10 seats by plan; Clearscope
 * includes unlimited users from its first plan. So the picture is a step
 * chart over team size: Surfer's cheapest plan that seats the team climbs a
 * staircase, Clearscope's stays one flat line, and the lower of the two at
 * each size is traced in blue. Blue is earned per team size, never owned by a
 * product.
 *
 * Motion: while about half the card is on screen, a team grows from one
 * person to twelve, the blue trace following it, then the card settles on the
 * size where the lower price changes hands. It goes back to one person when
 * the card leaves the screen, so each visit sees the climb. The server and
 * reduced-motion render is that settled frame, fully traced. Touching any
 * control stops the walk and hands the team size to the reader.
 *
 * Every number is read from the matchup's pricing data (see ./ladder).
 */
import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, CircleDollarSign, Minus, Plus, User, Users } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
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
import { entryPrice } from "@/data/compare/starting-price";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Plan, ProductPricing, Side } from "@/data/compare/types";
import { formatUsd } from "@/data/pricing";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import {
  axisTopFor,
  crossoverOf,
  fitFor,
  ladderOf,
  lowerOf,
  teamSizesFor,
  type Billing,
  type Fit,
  type Ladder,
} from "./ladder";
import { Md } from "./parts";
import { SIDES, WON_TINT, plural } from "./util";

const STEP_MS = 560;
const HOLD_MS = 1500;

/* ---------- the walk ---------- */

interface Walk {
  /** The team size shown. */
  n: number;
  /** How many team sizes the blue trace has reached. */
  reach: number;
  touched: boolean;
  pick: (n: number) => void;
  touch: () => void;
}

function useWalk(ref: RefObject<HTMLElement | null>, sizes: number, still: number): Walk {
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();
  const [touched, setTouched] = useState(false);
  const [frame, setFrame] = useState({ n: still, reach: sizes });

  useEffect(() => {
    if (touched) return;
    if (reduce) {
      setFrame({ n: still, reach: sizes });
      return;
    }
    if (!inView) {
      setFrame({ n: 1, reach: 0 });
      return;
    }
    let n = 0;
    let timer = 0;
    const step = () => {
      n += 1;
      if (n <= sizes) {
        setFrame({ n, reach: n });
        timer = window.setTimeout(step, STEP_MS);
      } else {
        timer = window.setTimeout(() => setFrame({ n: still, reach: sizes }), HOLD_MS);
      }
    };
    timer = window.setTimeout(step, 240);
    return () => window.clearTimeout(timer);
  }, [inView, reduce, touched, sizes, still]);

  return {
    ...frame,
    touched,
    pick: (n) => {
      setTouched(true);
      setFrame({ n, reach: sizes });
    },
    touch: () => {
      setTouched(true);
      setFrame((f) => ({ ...f, reach: sizes }));
    },
  };
}

/* ---------- the chart ---------- */

const pct = (v: number) => `${v}%`;

function Plot({
  sides,
  fits,
  sizes,
  top,
  n,
  reach,
}: {
  sides: Record<Side, Product>;
  fits: Record<Side, (Fit | null)[]>;
  sizes: number;
  top: number;
  n: number;
  reach: number;
}) {
  const y = (v: number) => (1 - v / top) * 100;
  const colLeft = (i: number) => (i / sizes) * 100;
  const colW = 100 / sizes;
  const priceAt = (side: Side, i: number) => fits[side][i]?.price ?? null;
  const lower = Array.from({ length: sizes }, (_, i) => lowerOf(fits.a[i], fits.b[i]));
  const env = lower.map((l, i) =>
    l === null ? null : l === "draw" ? priceAt("a", i) : priceAt(l, i),
  );
  const ticks = Array.from({ length: top / 100 + 1 }, (_, i) => i * 100);

  /* Runs of one plan, for the plan labels on the treads. */
  const runs = (side: Side) => {
    const out: { start: number; end: number; fit: Fit }[] = [];
    fits[side].forEach((f, i) => {
      if (!f) return;
      const last = out.at(-1);
      if (last && last.fit.plan.name === f.plan.name) last.end = i;
      else out.push({ start: i, end: i, fit: f });
    });
    return out;
  };

  const i = n - 1;
  const chip = (side: Side) => {
    const p = priceAt(side, i);
    if (p === null) return null;
    const other = priceAt(side === "a" ? "b" : "a", i);
    const above = other === null || p >= other;
    const won = lower[i] === side || lower[i] === "draw";
    const edge = i === 0 ? "0%" : i === sizes - 1 ? "-100%" : "-50%";
    return (
      <span
        key={side}
        className="absolute z-20 hidden transition-[top,left] duration-300 ease-out sm:block"
        style={{
          left: pct(colLeft(i) + (i === 0 ? 0 : i === sizes - 1 ? colW : colW / 2)),
          top: pct(y(p)),
        }}
      >
        <span
          className={cn(
            "absolute flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[0.72rem] font-semibold tabular-nums shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
            won ? "border-cta bg-cta text-white" : "border-ink/[0.1] bg-white text-ink",
          )}
          style={{
            transform: `translate(${edge}, ${above ? "calc(-100% - 10px)" : "10px"})`,
          }}
        >
          <ProductMark product={sides[side]} className="h-3.5 w-3.5 text-[0.4rem]" />
          {formatUsd(p)}
        </span>
      </span>
    );
  };

  return (
    <div className="relative h-[13.5rem] sm:h-[16rem]">
      {/* Price grid. */}
      {ticks.map((t) => (
        <div
          key={t}
          className={cn("absolute inset-x-0 border-t", t === 0 ? "border-ink/[0.14]" : LINE)}
          style={{ top: pct(y(t)) }}
        >
          <span className="absolute -left-2 -translate-x-full -translate-y-1/2 text-[0.66rem] tabular-nums text-muted-foreground">
            {formatUsd(t)}
          </span>
        </div>
      ))}

      {/* The chosen team size. */}
      <div
        className="absolute inset-y-0 bg-cta-soft transition-[left] duration-300 ease-out"
        style={{ left: pct(colLeft(i)), width: pct(colW) }}
      />

      {/* Both ladders in grey: Surfer solid, Clearscope dashed. */}
      {SIDES.map((side) =>
        fits[side].map((f, ci) => {
          const p = f?.price ?? null;
          const prev = ci > 0 ? priceAt(side, ci - 1) : null;
          const style = side === "a" ? "border-solid" : "border-dashed";
          return (
            <span key={`${side}-${ci}`}>
              {p !== null && (
                <span
                  className={cn("absolute h-0 border-t-2 border-ink/25", style)}
                  style={{
                    left: pct(colLeft(ci)),
                    width: pct(colW),
                    top: pct(y(p)),
                    marginTop: -1,
                  }}
                />
              )}
              {p !== null && prev !== null && prev !== p && (
                <span
                  className={cn("absolute w-0 border-l-2 border-ink/25", style)}
                  style={{
                    left: pct(colLeft(ci)),
                    top: pct(y(Math.max(p, prev))),
                    height: pct(Math.abs(y(p) - y(prev))),
                    marginLeft: -1,
                  }}
                />
              )}
              {/* Past the last published plan: the quote-only stretch. */}
              {p === null && prev !== null && (
                <>
                  <span
                    className="absolute w-0 border-l-2 border-dotted border-ink/30"
                    style={{ left: pct(colLeft(ci)), top: 0, height: pct(y(prev)), marginLeft: -1 }}
                  />
                  {f && (
                    <span
                      className="absolute top-1.5 hidden whitespace-nowrap pl-2 text-[0.68rem] font-medium text-muted-foreground md:block"
                      style={{ left: pct(colLeft(ci)) }}
                    >
                      {f.plan.name} · Custom
                    </span>
                  )}
                </>
              )}
            </span>
          );
        }),
      )}

      {/* The lower price at each size, traced in blue as the team grows. */}
      {env.map((p, ci) => {
        if (p === null) return null;
        const on = ci < reach;
        const prev = ci > 0 ? env[ci - 1] : null;
        return (
          <span key={`env-${ci}`}>
            <span
              className="absolute z-10 h-[3px] origin-left rounded-full bg-cta transition-transform duration-[420ms] ease-out"
              style={{
                left: pct(colLeft(ci)),
                width: pct(colW),
                top: pct(y(p)),
                marginTop: -1.5,
                transform: `scaleX(${on ? 1 : 0})`,
              }}
            />
            {prev !== null && prev !== p && (
              <span
                className={cn(
                  "absolute z-10 w-[3px] rounded-full bg-cta transition-transform duration-200 ease-out",
                  p > prev ? "origin-bottom" : "origin-top",
                )}
                style={{
                  left: pct(colLeft(ci)),
                  top: pct(y(Math.max(p, prev))),
                  height: pct(Math.abs(y(p) - y(prev))),
                  marginLeft: -1.5,
                  transform: `scaleY(${on ? 1 : 0})`,
                }}
              />
            )}
          </span>
        );
      })}

      {/* Plan names on the treads (wide screens). */}
      <div className="hidden md:block">
        {runs("a").map(({ start, fit }, k) =>
          fit.price === null ? null : (
            <span
              key={`a-${fit.plan.name}`}
              className="absolute flex items-center gap-1.5 whitespace-nowrap pl-1.5 pt-1.5 text-[0.68rem] font-medium text-ink/60"
              style={{ left: pct(colLeft(start)), top: pct(y(fit.price)) }}
            >
              {k === 0 && <ProductMark product={sides.a} className="h-3.5 w-3.5 text-[0.4rem]" />}
              {k === 0 ? `${sides.a.name} ${fit.plan.name}` : fit.plan.name}
            </span>
          ),
        )}
        {runs("b").map(({ end, fit }) =>
          fit.price === null ? null : (
            <span
              key={`b-${fit.plan.name}`}
              className="absolute flex -translate-x-full -translate-y-full items-center gap-1.5 whitespace-nowrap pb-1.5 pr-1.5 text-[0.68rem] font-medium text-ink/60"
              style={{ left: pct(colLeft(end + 1)), top: pct(y(fit.price)) }}
            >
              <ProductMark product={sides.b} className="h-3.5 w-3.5 text-[0.4rem]" />
              {sides.b.name} {fit.plan.name}
            </span>
          ),
        )}
      </div>

      {/* Where each ladder stands at the chosen size. */}
      {SIDES.map((side) => {
        const p = priceAt(side, i);
        if (p === null) return null;
        const won = lower[i] === side || lower[i] === "draw";
        return (
          <span
            key={`dot-${side}`}
            className={cn(
              "absolute z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-[top,left] duration-300 ease-out",
              won ? "border-white bg-cta shadow-[0_0_0_1px_var(--cta)]" : "border-ink/50 bg-white",
            )}
            style={{ left: pct(colLeft(i) + colW / 2), top: pct(y(p)) }}
          />
        );
      })}
      {SIDES.map(chip)}
    </div>
  );
}

/* ---------- the card ---------- */

function Readout({
  side,
  product,
  fit,
  billing,
  lower,
  otherPriced,
}: {
  side: Side;
  product: Product;
  fit: Fit | null;
  billing: Billing;
  lower: Side | "draw" | null;
  /** Whether the other product publishes a price at this size. */
  otherPriced: boolean;
}) {
  const won = lower === side || lower === "draw";
  return (
    <div
      className={cn(
        "flex h-full flex-col p-4 transition-colors sm:p-6",
        won ? WON_TINT : "bg-white",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <ProductMark product={product} className="h-6 w-6 text-[0.6rem]" />
          <span className="text-[0.88rem] font-semibold text-ink">{product.name}</span>
        </span>
        {won && fit && (
          <span className="rounded-md bg-cta px-1.5 py-0.5 text-[0.66rem] font-semibold text-white">
            {otherPriced ? "Lower list price" : "Only list price"}
          </span>
        )}
      </div>
      {fit ? (
        <>
          <p className="mt-4 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {fit.plan.name}
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
            <span className="font-display text-[1.9rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums sm:text-[2.3rem]">
              {fit.price === null ? "Custom" : formatUsd(fit.price)}
            </span>
            <span className="text-[0.8rem] text-muted-foreground">
              {fit.price === null
                ? "quote only"
                : fit.monthlyOnly
                  ? "/mo · monthly price; no annual price published"
                  : `/mo · billed ${billing}`}
            </span>
          </p>
          <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground sm:text-[0.84rem]">
            {fit.plan.includes}
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No published plan.</p>
      )}
    </div>
  );
}

function SeatLadder({
  sides,
  ladders,
  sizes,
  billing,
  setBilling,
  walk,
  cardRef,
}: {
  sides: Record<Side, Product>;
  ladders: Record<Side, Ladder>;
  sizes: number;
  billing: Billing;
  setBilling: (b: Billing) => void;
  walk: Walk;
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  const { n, reach } = walk;
  const fits = {
    a: Array.from({ length: sizes }, (_, i) => fitFor(ladders.a, i + 1, billing)),
    b: Array.from({ length: sizes }, (_, i) => fitFor(ladders.b, i + 1, billing)),
  };
  const top = axisTopFor(ladders.a, ladders.b, sizes);
  const lower = lowerOf(fits.a[n - 1], fits.b[n - 1]);

  /* The chart in a sentence, for screen readers. */
  const describe = (side: Side) => {
    const priced = fits[side].filter((f): f is Fit & { price: number } => f?.price != null);
    const lo = priced[0];
    const hi = priced.at(-1);
    if (!lo || !hi) return `${sides[side].name}: no published price.`;
    return lo.price === hi.price
      ? `${sides[side].name} ${lo.plan.name} is ${formatUsd(lo.price)} a month at every team size shown.`
      : `${sides[side].name}'s lowest plan with enough seats rises from ${formatUsd(lo.price)} a month for one person to ${formatUsd(hi.price)} for ${priced.length}; larger teams get a custom quote.`;
  };

  return (
    <div
      ref={cardRef}
      className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_48px_-28px_rgba(16,24,40,0.28)]"
    >
      {/* Controls. */}
      <div
        className={cn(
          "flex flex-wrap items-end justify-between gap-4 border-b px-4 py-4 sm:px-6",
          LINE,
        )}
      >
        <div>
          <p id="team-size-label" className="text-[0.75rem] font-medium text-muted-foreground">
            People who need a login
          </p>
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              aria-label="One fewer person"
              disabled={n <= 1}
              onClick={() => walk.pick(Math.max(1, n - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink transition-colors hover:border-ink/[0.2] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <p className="min-w-[6.5rem] text-center font-display text-[1.6rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums">
              {plural(n, "person", "people")}
            </p>
            <button
              type="button"
              aria-label="One more person"
              disabled={n >= sizes}
              onClick={() => walk.pick(Math.min(sizes, n + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink transition-colors hover:border-ink/[0.2] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div role="group" aria-label={`${sides.a.name} billing`}>
          <p className="text-[0.75rem] font-medium text-muted-foreground">{sides.a.name} billed</p>
          <div className="mt-1 inline-flex rounded-lg border border-ink/[0.08] bg-ink/[0.03] p-0.5">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={billing === b}
                onClick={() => {
                  walk.touch();
                  setBilling(b);
                }}
                className={cn(
                  "h-8 rounded-md px-3 text-[0.8rem] font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                  billing === b
                    ? "bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                    : "text-muted-foreground hover:text-ink",
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend. */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-5 gap-y-1.5 border-b px-4 py-2.5 text-[0.72rem] text-muted-foreground sm:px-6",
          LINE,
        )}
      >
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="w-5 border-t-2 border-ink/30" />
          {sides.a.name}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="w-5 border-t-2 border-dashed border-ink/30" />
          {sides.b.name}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-[3px] w-5 rounded-full bg-cta" />
          Lowest published price at that size
        </span>
      </div>

      {/* The chart, its y-axis in the left gutter. */}
      <div className="pb-1 pl-12 pr-4 pt-6 sm:pl-16 sm:pr-6">
        <div role="img" aria-label={`${describe("a")} ${describe("b")}`}>
          <div aria-hidden>
            <Plot sides={sides} fits={fits} sizes={sizes} top={top} n={n} reach={reach} />
          </div>
        </div>

        {/* The x-axis is the team: one seat per size, each a button. */}
        <div
          role="group"
          aria-labelledby="team-size-label"
          className="grid"
          style={{ gridTemplateColumns: `repeat(${sizes}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: sizes }, (_, k) => {
            const size = k + 1;
            const filled = size <= n;
            const current = size === n;
            return (
              <button
                key={size}
                type="button"
                aria-label={plural(size, "person", "people")}
                aria-pressed={current}
                onClick={() => walk.pick(size)}
                className="group flex flex-col items-center gap-1 rounded-md py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
              >
                <User
                  aria-hidden
                  className={cn(
                    "h-4 w-4 transition-colors duration-200 sm:h-[1.1rem] sm:w-[1.1rem]",
                    filled ? "fill-cta/15 text-cta" : "text-ink/20 group-hover:text-ink/45",
                  )}
                />
                <span
                  className={cn(
                    "text-[0.66rem] tabular-nums transition-colors sm:text-[0.72rem]",
                    current ? "font-semibold text-cta" : "text-muted-foreground",
                  )}
                >
                  {size}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Where the chosen team lands on each. */}
      <div
        aria-live={walk.touched ? "polite" : "off"}
        className={cn("grid grid-cols-2 gap-px border-t", LINE, LINE_FILL)}
      >
        {SIDES.map((side) => (
          <Readout
            key={side}
            side={side}
            product={sides[side]}
            fit={fits[side][n - 1]}
            billing={billing}
            lower={lower}
            otherPriced={fits[side === "a" ? "b" : "a"][n - 1]?.price != null}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- the plan sheets ---------- */

function PlanRows({ plans, current }: { plans: Plan[]; current?: string }) {
  return (
    <ul className={cn("divide-y border-y", LINE, "divide-ink/[0.07]")}>
      {plans.map((pl) => {
        const on = pl.name === current;
        return (
          <li
            key={pl.name}
            className={cn(
              "flex items-start justify-between gap-4 px-3 py-3.5 transition-colors duration-300",
              on ? "bg-cta-soft" : "bg-white",
            )}
          >
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                {pl.name}
                {pl.forAgencies && (
                  <span className="rounded border border-ink/[0.1] px-1 text-[0.62rem] font-medium text-muted-foreground">
                    For agencies
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-[0.78rem] leading-snug text-muted-foreground">
                {pl.includes}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums text-ink">
                {pl.monthly === null
                  ? "Custom"
                  : pl.monthly === 0
                    ? "Free"
                    : `${formatUsd(pl.monthly)}/mo`}
              </p>
              {pl.annual !== undefined && pl.monthly !== null && pl.annual < pl.monthly && (
                <p className="mt-0.5 text-[0.7rem] tabular-nums text-muted-foreground">
                  {formatUsd(pl.annual)}/mo yearly
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function PlanSheet({
  product,
  pricing,
  current,
}: {
  product: Product;
  pricing: ProductPricing;
  current?: string;
}) {
  const from = entryPrice(pricing);
  return (
    <div className="flex h-full flex-col bg-white p-5 sm:p-8">
      <div className="flex items-center gap-3">
        <ProductMark product={product} className="h-10 w-10 text-sm" />
        <div className="min-w-0">
          <h3 className="text-[1rem] font-semibold text-ink">{product.name}</h3>
          <p className="text-[0.8rem] text-muted-foreground">{pricing.model}</p>
        </div>
      </div>
      <p className="mt-6 text-[0.72rem] font-medium text-muted-foreground">Starts at</p>
      {from ? (
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-[2.2rem] font-medium leading-none tracking-[-0.035em] text-ink tabular-nums">
            {formatUsd(from.monthly)}
          </span>
          <span className="text-sm text-muted-foreground">/month</span>
          {from.annual !== undefined && from.annual < from.monthly && (
            <span className="text-sm text-muted-foreground">
              · {formatUsd(from.annual)}/mo billed yearly
            </span>
          )}
        </p>
      ) : (
        <p className="mt-1 font-display text-[2rem] font-medium tracking-tight text-ink">
          Custom quote
        </p>
      )}
      <div className="-mx-3 mt-6 flex-1">
        <PlanRows plans={pricing.plans} current={current} />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
          <CircleDollarSign className="h-4 w-4 shrink-0 text-cta" aria-hidden />
          {pricing.trial}
        </p>
        <a
          href={pricing.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 text-[0.8rem] font-medium text-ink underline-offset-4 hover:text-cta hover:underline"
        >
          {product.name} pricing page
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}

/* ---------- the section ---------- */

export function CostByTeamSize({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const ladders = { a: ladderOf(entry.pricing.a), b: ladderOf(entry.pricing.b) };
  const sizes = teamSizesFor([ladders.a, ladders.b]);
  const [billing, setBilling] = useState<Billing>("monthly");
  const still = crossoverOf(ladders.a, ladders.b, sizes, billing) ?? sizes;
  const cardRef = useRef<HTMLDivElement>(null);
  const walk = useWalk(cardRef, sizes, still);
  const current = {
    a: fitFor(ladders.a, walk.n, billing)?.plan.name,
    b: fitFor(ladders.b, walk.n, billing)?.plan.name,
  };
  const pricingRound = entry.rounds.find((r) => r.id === "pricing");
  const leftOut = SIDES.flatMap((s) => ladders[s].leftOut.map((p) => ({ side: s, plan: p })));
  const checked = formatDate(entry.pricing.checkedOn);

  return (
    <section id="cost" aria-labelledby="cost-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Users}
        eyebrow="Cost by team size"
        title={
          <span id="cost-title">
            What your team size <Accent>costs on each</Accent>
          </span>
        }
        subtitle={pricingRound ? <Md text={pricingRound.verdict} /> : undefined}
      />

      <Band inner={cn("px-3 py-10 sm:px-8 sm:py-14 lg:px-12", PANEL)}>
        <Reveal y={24}>
          <SeatLadder
            sides={sides}
            ladders={ladders}
            sizes={sizes}
            billing={billing}
            setBilling={setBilling}
            walk={walk}
            cardRef={cardRef}
          />
        </Reveal>
        <div className="mx-auto mt-5 max-w-3xl space-y-1.5 px-2 text-center text-[0.8rem] leading-relaxed text-muted-foreground">
          <p>
            The lowest-priced plan that seats each team size, from both pricing pages as read on{" "}
            <time dateTime={entry.pricing.checkedOn}>{checked}</time>.
          </p>
          {leftOut.map(({ side, plan }) => (
            <p key={plan.name}>
              Left off the chart, {sides[side].name} {plan.name}: {plan.includes}.
            </p>
          ))}
        </div>
      </Band>

      <Band>
        <div className={cn("grid gap-px lg:grid-cols-2", LINE_FILL)}>
          {SIDES.map((side) => (
            <PlanSheet
              key={side}
              product={sides[side]}
              pricing={entry.pricing[side]}
              current={current[side]}
            />
          ))}
        </div>
      </Band>

      <Band inner="px-5 py-7 sm:px-10 sm:py-8">
        <div className="grid gap-3 lg:grid-cols-[13rem_1fr] lg:gap-10">
          <p className="text-[0.82rem] font-semibold text-ink">
            What the list prices leave out
            <span className="mt-1 block text-[0.75rem] font-normal text-muted-foreground">
              Checked <time dateTime={entry.pricing.checkedOn}>{checked}</time>
            </span>
          </p>
          <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
            <Md text={entry.pricing.note} />
          </p>
        </div>
      </Band>
    </section>
  );
}
