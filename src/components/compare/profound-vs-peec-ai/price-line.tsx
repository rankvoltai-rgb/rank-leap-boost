/**
 * The page's focal visual: both price lists on one ruler.
 *
 * The two trackers report much the same numbers, so the comparison turns on
 * how you get in. Plotted on a shared dollar axis, Peec AI's brand plans sit
 * at published prices along the line, while Profound's brand lane runs from
 * a free trial straight to the quote-only zone with nothing published in
 * between. That gap is the finding; the ruler just draws it to scale.
 *
 * Motion: while the ruler is at least half on screen, each lane draws from
 * left to right and its plans pop in as the line reaches them; it resets
 * once it leaves, and replays when the brands/agencies view changes. The
 * server render, and reduced motion, show the finished ruler.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, CircleDollarSign, MessagesSquare } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import {
  Accent,
  Band,
  LINE,
  LINE_FILL,
  PANEL,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import { entryPrice } from "@/data/compare/starting-price";
import type { MatchupEntry, Plan, ProductPricing, Side } from "@/data/compare/types";
import { formatUsd } from "@/data/pricing";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md } from "./parts";
import { CARD_SHADOW, SIDES, planPrice, planYearly } from "./util";

type View = "brands" | "agencies";
type Phase = "still" | "hidden" | "play";

/* The dollar axis takes the first 80% of a lane; quote-only plans sit in a
   zone of their own at the far end, since they have no point on the axis. */
const AXIS = 0.8;
const CUSTOM = 0.925;
const CUSTOM_ZONE = 0.865;
/* Seconds for a line to cross the whole lane. */
const SWEEP = 1.1;
const EASE = [0.22, 1, 0.36, 1] as const;

const t = (phase: Phase, delay: number, duration: number) =>
  phase === "play" ? { duration, delay, ease: EASE } : { duration: 0 };

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

export function PriceLine({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const { pricing } = entry;
  const [view, setView] = useState<View>("brands");
  const [active, setActive] = useState<string | null>(null);

  /* One scale for both views, so switching never rescales the ruler. */
  const top = useMemo(() => {
    const max = Math.max(...SIDES.flatMap((s) => pricing[s].plans.map((p) => p.monthly ?? 0)));
    return Math.max(200, Math.ceil(max / 200) * 200);
  }, [pricing]);
  const ticks = Array.from({ length: top / 200 + 1 }, (_, i) => i * 200);

  /* Draw only while half the ruler is on screen; reset when it leaves. */
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const phase: Phase = !ready || reduce ? "still" : inView ? "play" : "hidden";

  const lanes = SIDES.map((side) => ({
    side,
    product: sides[side],
    pricing: pricing[side],
    plans: pricing[side].plans.filter((p) => (view === "agencies") === Boolean(p.forAgencies)),
  }));
  const activePlan = lanes
    .flatMap((l) => l.plans.map((plan) => ({ ...l, plan })))
    .find((x) => `${x.side}:${x.plan.name}` === active);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={CircleDollarSign}
        eyebrow={`Pricing, checked ${formatDate(pricing.checkedOn)}`}
        title={
          <span id="pricing-title">
            Same metrics, <Accent>two ways in</Accent>
          </span>
        }
        subtitle={`Published list prices, read from both pricing pages on ${formatDate(pricing.checkedOn)}, on one dollar scale.`}
      />

      <Band inner={cn("overflow-hidden", PANEL)}>
        <div className="relative px-3 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <Reveal y={28}>
            <div
              ref={ref}
              className={cn(
                "mx-auto max-w-5xl rounded-2xl border border-ink/[0.07] bg-white",
                CARD_SHADOW,
              )}
            >
              {/* Card chrome: what is plotted, and the view switch. */}
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6",
                  LINE,
                )}
              >
                <p className="text-[0.8rem] text-muted-foreground">
                  <span className="font-medium text-ink">Monthly list price</span> · USD, billed
                  monthly
                </p>
                <div
                  role="group"
                  aria-label="Plans to plot"
                  className="flex rounded-lg border border-ink/[0.08] bg-ink/[0.02] p-0.5"
                >
                  {(["brands", "agencies"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={view === v}
                      onClick={() => {
                        setView(v);
                        setActive(null);
                      }}
                      className={cn(
                        "h-8 rounded-md px-3 text-[0.8rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                        view === v
                          ? "bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                          : "text-muted-foreground hover:text-ink",
                      )}
                    >
                      For {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 pb-2 pt-4 sm:px-6 sm:pt-6">
                <div className="divide-y divide-ink/[0.07]">
                  {lanes.map((lane, li) => (
                    <Lane
                      key={`${view}-${lane.side}`}
                      {...lane}
                      view={view}
                      top={top}
                      phase={phase}
                      replay={ready && !reduce}
                      delay={li * 0.18}
                      active={active}
                      onActive={setActive}
                    />
                  ))}
                </div>

                {/* The axis, under the lanes' tracks only. */}
                <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-8">
                  <p className="hidden pt-3 text-[0.72rem] text-muted-foreground lg:block">
                    Per month
                  </p>
                  <div aria-hidden className="relative h-9">
                    <span className={cn("absolute inset-x-0 top-0 border-t", LINE)} />
                    {ticks.map((v) => (
                      <span
                        key={v}
                        className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                        style={{ left: pct((v / top) * AXIS) }}
                      >
                        <span className="h-1.5 w-px bg-ink/20" />
                        <span className="mt-1 text-[0.66rem] tabular-nums text-muted-foreground">
                          {formatUsd(v)}
                        </span>
                      </span>
                    ))}
                    <span
                      className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                      style={{ left: pct(CUSTOM) }}
                    >
                      <span className="h-1.5 w-px bg-ink/20" />
                      <span className="mt-1 text-[0.66rem] text-muted-foreground">Custom</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* What the selected plan includes, in the vendor's terms. */}
              <div
                aria-live="polite"
                className={cn(
                  "flex min-h-[3.75rem] items-center gap-3 border-t px-4 py-3 sm:px-6",
                  LINE,
                  activePlan ? "bg-cta-soft" : "bg-white",
                )}
              >
                {activePlan ? (
                  <>
                    <ProductMark product={activePlan.product} className="h-7 w-7 text-[0.6rem]" />
                    <p className="min-w-0 text-[0.84rem] leading-snug text-ink">
                      <span className="font-semibold">
                        {activePlan.product.name} {activePlan.plan.name}
                      </span>{" "}
                      <span className="tabular-nums text-cta">
                        · {planPrice(activePlan.plan)}
                        {planYearly(activePlan.plan) && ` · ${planYearly(activePlan.plan)}`}
                      </span>
                      <span className="block text-muted-foreground sm:inline">
                        <span className="hidden sm:inline"> — </span>
                        {activePlan.plan.includes}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-[0.82rem] text-muted-foreground">
                    Select a plan on the ruler to see what it includes.
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </Band>

      <Band>
        <div className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          {SIDES.map((side) => (
            <PlanSheet key={side} product={sides[side]} pricing={pricing[side]} />
          ))}
        </div>
      </Band>

      <Band inner="px-6 py-6 sm:px-10">
        <p className="mx-auto max-w-3xl text-center text-[0.84rem] leading-relaxed text-muted-foreground">
          <Md text={pricing.note} />
        </p>
      </Band>
    </section>
  );
}

/* ---------- one product's lane ---------- */

function Lane({
  side,
  product,
  pricing,
  plans,
  view,
  top,
  phase,
  replay,
  delay,
  active,
  onActive,
}: {
  side: Side;
  product: Product;
  pricing: ProductPricing;
  plans: Plan[];
  view: View;
  top: number;
  phase: Phase;
  /** Remounted by a view switch: start undrawn so the new lane draws in. */
  replay: boolean;
  delay: number;
  active: string | null;
  onActive: (id: string | null) => void;
}) {
  const from = entryPrice(pricing);
  const stops = plans
    .map((plan) => ({
      plan,
      pos: plan.monthly === null ? CUSTOM : (plan.monthly / top) * AXIS,
    }))
    .sort((x, y) => x.pos - y.pos);
  const published = stops.filter((s) => s.plan.monthly !== null);
  const hasCustom = stops.some((s) => s.plan.monthly === null);
  const first = published[0]?.pos ?? 0;
  const last = published.at(-1)?.pos ?? 0;
  const initial = replay ? ("hidden" as const) : false;

  return (
    <div className="grid pb-1 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-8">
      <div className="flex items-center gap-3 pb-1 pt-3 lg:py-5">
        <ProductMark product={product} className="h-9 w-9 text-sm" />
        <div className="min-w-0">
          <p className="text-[0.95rem] font-medium leading-tight text-ink">{product.name}</p>
          <p className="mt-0.5 text-[0.74rem] leading-snug text-muted-foreground">
            {view === "brands"
              ? from
                ? `Starts at ${formatUsd(from.monthly)}/mo${
                    from.annual !== undefined && from.annual < from.monthly
                      ? ` · ${formatUsd(from.annual)} yearly`
                      : ""
                  }`
                : "Starts at: custom quote"
              : pricing.model}
          </p>
        </div>
      </div>

      <div className="relative h-[8.75rem] sm:h-[6.75rem]">
        {/* The quote-only zone, hatched. */}
        <span
          aria-hidden
          className="absolute inset-y-1.5 right-0 rounded-md border border-dashed border-ink/[0.1] bg-[repeating-linear-gradient(135deg,rgba(16,24,40,0.035)_0_6px,transparent_6px_12px)]"
          style={{ left: pct(CUSTOM_ZONE) }}
        />

        {/* The rail: where a price could sit. */}
        <span
          aria-hidden
          className="absolute left-0 top-1/2 border-t border-dotted border-ink/15 sm:top-[1.75rem]"
          style={{ width: pct(CUSTOM_ZONE) }}
        />

        {/* Published prices, joined. */}
        {published.length > 1 && (
          <motion.span
            aria-hidden
            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-cta/70 sm:top-[1.75rem]"
            style={{ left: pct(first), width: pct(last - first), originX: 0 }}
            initial={initial && { scaleX: 0 }}
            animate={{ scaleX: phase === "hidden" ? 0 : 1 }}
            transition={t(phase, delay + first * SWEEP, (last - first) * SWEEP)}
          />
        )}

        {/* From the last published price to the quote: no number on the way. */}
        {hasCustom && (
          <motion.span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 border-t-2 border-dashed border-ink/25 sm:top-[1.75rem]"
            style={{ left: pct(last), width: pct(CUSTOM - last), originX: 0 }}
            initial={initial && { scaleX: 0 }}
            animate={{ scaleX: phase === "hidden" ? 0 : 1 }}
            transition={t(phase, delay + last * SWEEP, (CUSTOM - last) * SWEEP)}
          />
        )}

        <ul aria-label={`${product.name} ${view === "brands" ? "brand" : "agency"} plans`}>
          {stops.map((s, i) => (
            <Stop
              key={s.plan.name}
              id={`${side}:${s.plan.name}`}
              product={product}
              plan={s.plan}
              pos={s.pos}
              above={i % 2 === 1}
              phase={phase}
              initial={initial}
              delay={delay + s.pos * SWEEP}
              active={active === `${side}:${s.plan.name}`}
              onActive={onActive}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stop({
  id,
  product,
  plan,
  pos,
  above,
  phase,
  initial,
  delay,
  active,
  onActive,
}: {
  id: string;
  product: Product;
  plan: Plan;
  pos: number;
  /** On a phone, every other label sits above the line so neighbours never collide. */
  above: boolean;
  phase: Phase;
  initial: "hidden" | false;
  delay: number;
  active: boolean;
  onActive: (id: string | null) => void;
}) {
  const custom = plan.monthly === null;
  const yearly = planYearly(plan);
  const align = pos < 0.07 ? "start" : pos > 0.86 ? "end" : "center";

  return (
    <motion.li
      className="absolute top-1/2 sm:top-[1.75rem]"
      style={{ left: pct(pos) }}
      initial={initial && { opacity: 0, scale: 0.6 }}
      animate={{
        opacity: phase === "hidden" ? 0 : 1,
        scale: phase === "hidden" ? 0.6 : 1,
      }}
      transition={t(phase, delay + 0.08, 0.4)}
    >
      <button
        type="button"
        aria-pressed={active}
        aria-label={`${product.name} ${plan.name}: ${planPrice(plan)}${yearly ? `, ${yearly}` : ""}`}
        onClick={() => onActive(id)}
        onMouseEnter={() => onActive(id)}
        onFocus={() => onActive(id)}
        className={cn(
          "absolute left-0 top-0 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white transition-[box-shadow,background-color,border-color] focus-visible:outline-none",
          custom ? "border-dashed border-ink/35" : "border-cta",
          active
            ? "border-solid border-cta bg-cta shadow-[0_0_0_5px_color-mix(in_oklab,var(--cta)_16%,transparent)]"
            : "hover:shadow-[0_0_0_5px_color-mix(in_oklab,var(--cta)_10%,transparent)] focus-visible:shadow-[0_0_0_5px_color-mix(in_oklab,var(--cta)_22%,transparent)]",
        )}
      >
        {custom ? (
          <MessagesSquare
            className={cn("h-2.5 w-2.5", active ? "text-white" : "text-muted-foreground")}
            aria-hidden
          />
        ) : (
          <span
            aria-hidden
            className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-white" : "bg-cta")}
          />
        )}
      </button>

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute w-max max-w-[7.5rem] leading-tight",
          above ? "bottom-3.5 sm:bottom-auto sm:top-3.5" : "top-3.5",
          align === "start" && "left-0 -translate-x-2.5 text-left",
          align === "center" && "left-0 -translate-x-1/2 text-center",
          align === "end" && "right-0 translate-x-2.5 text-right",
        )}
      >
        <span className="block text-[0.7rem] text-muted-foreground">{plan.name}</span>
        <span
          className={cn(
            "block text-[0.86rem] font-semibold tabular-nums",
            active ? "text-cta" : "text-ink",
          )}
        >
          {planPrice(plan)}
        </span>
        {yearly && (
          <span className="block text-[0.64rem] tabular-nums text-muted-foreground">{yearly}</span>
        )}
      </span>
    </motion.li>
  );
}

/* ---------- the full plan sheets ---------- */

function PlanRows({ plans }: { plans: Plan[] }) {
  return (
    <ul className={cn("divide-y border-y", LINE, "divide-ink/[0.07]")}>
      {plans.map((pl) => (
        <li key={pl.name} className="flex items-start justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="text-[0.88rem] font-medium text-ink">{pl.name}</p>
            <p className="mt-0.5 text-[0.78rem] leading-snug text-muted-foreground">
              {pl.includes}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[0.88rem] font-semibold tabular-nums text-ink">{planPrice(pl)}</p>
            {planYearly(pl) && (
              <p className="mt-0.5 text-[0.7rem] tabular-nums text-muted-foreground">
                {planYearly(pl)}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function PlanSheet({ product, pricing }: { product: Product; pricing: ProductPricing }) {
  const brand = pricing.plans.filter((p) => !p.forAgencies);
  const agency = pricing.plans.filter((p) => p.forAgencies);
  return (
    <div className="flex flex-col bg-white px-5 py-8 sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <ProductMark product={product} className="h-10 w-10 text-sm" />
        <div className="min-w-0">
          <h3 className="text-[1.05rem] font-medium tracking-tight text-ink">
            {product.name} plans
          </h3>
          <p className="text-[0.78rem] text-muted-foreground">{pricing.model}</p>
        </div>
      </div>
      <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-cta-soft px-2.5 py-1.5 text-[0.78rem] font-medium text-cta">
        <CircleDollarSign className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {pricing.trial}
      </p>
      <p className="mt-6 text-[0.74rem] font-medium text-muted-foreground">For brands</p>
      <PlanRows plans={brand} />
      {agency.length > 0 && (
        <>
          <p className="mt-6 text-[0.74rem] font-medium text-muted-foreground">For agencies</p>
          <PlanRows plans={agency} />
        </>
      )}
      <a
        href={pricing.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-5 inline-flex w-fit items-center gap-1 text-[0.8rem] font-medium text-ink underline-offset-4 hover:text-cta hover:underline"
      >
        {product.name} pricing page
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    </div>
  );
}
