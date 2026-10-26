/**
 * What each one costs, as a ladder: both products' plans on one dollar axis,
 * so the shape of the choice shows at a glance — one rung and a quote on one
 * side, a long climb on the other — with a billing switch that slides every
 * rung between its monthly and yearly price. Quote-only plans sit past the
 * end of the axis, where a price would be. Under it, each side's plans in
 * full, then what the list prices leave out and the date they were read.
 *
 * Every number is the entry's pricing data; nothing is computed but the
 * positions.
 */
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarCheck, CircleDollarSign, Receipt } from "lucide-react";
import { Accent, Band, LINE, LINE_FILL, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { ProductMark } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import { entryPrice } from "@/data/compare/starting-price";
import type { MatchupEntry, Plan, ProductPricing } from "@/data/compare/types";
import { formatUsd } from "@/data/pricing";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md } from "./atoms";
import { EASE, SIDES } from "./lib";

type Billing = "monthly" | "yearly";

/** The plan's monthly-equivalent price on this billing; null when quote-only. */
function priceAt(pl: Plan, billing: Billing): number | null {
  if (pl.monthly === null) return null;
  return billing === "yearly" ? (pl.annual ?? pl.monthly) : pl.monthly;
}

const billedLabel = (b: Billing) => (b === "yearly" ? "billed yearly" : "billed monthly");

/* ---------- the ladder ---------- */

/* Room past the axis for quote-only plans. */
const QUOTE_ZONE = "mr-[4.5rem] sm:mr-24";

function Rung({ plan, price, pct }: { plan: Plan; price: number; pct: number }) {
  // Labels hug the dot near either end so they never spill past the track.
  const align = pct < 12 ? "-left-1.5" : pct > 88 ? "-right-1.5" : "left-0 -translate-x-1/2";
  return (
    <motion.div
      className="absolute top-1/2 z-10"
      initial={false}
      animate={{ left: `${pct}%` }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <span className="absolute left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cta ring-4 ring-white" />
      <span
        className={cn(
          "absolute bottom-3 whitespace-nowrap text-[0.74rem] font-medium text-ink",
          align,
        )}
      >
        {plan.name}
      </span>
      <span
        className={cn(
          "absolute top-3 whitespace-nowrap text-[0.74rem] tabular-nums text-muted-foreground",
          align,
        )}
      >
        {formatUsd(price)}
      </span>
    </motion.div>
  );
}

function Rail({
  product,
  pricing,
  billing,
  max,
}: {
  product: Product;
  pricing: ProductPricing;
  billing: Billing;
  max: number;
}) {
  const priced = pricing.plans
    .map((pl) => ({ pl, price: priceAt(pl, billing) }))
    .filter((x): x is { pl: Plan; price: number } => x.price !== null);
  const quoted = pricing.plans.filter((pl) => pl.monthly === null);
  const pct = (n: number) => (n / max) * 100;
  const lo = priced.length ? pct(Math.min(...priced.map((x) => x.price))) : 0;
  const hi = priced.length ? pct(Math.max(...priced.map((x) => x.price))) : 0;

  return (
    <div className={cn("grid gap-y-3 border-b py-6 sm:grid-cols-[11rem_1fr] sm:py-7", LINE)}>
      <div className="flex items-center gap-3 sm:pr-6">
        <ProductMark product={product} className="h-9 w-9 text-sm" />
        <div className="min-w-0">
          <p className="text-[0.95rem] font-semibold leading-tight text-ink">{product.name}</p>
          <p className="mt-0.5 text-[0.75rem] leading-snug text-muted-foreground">
            {pricing.model}
          </p>
        </div>
      </div>

      <div className={cn("relative h-[4.25rem]", QUOTE_ZONE)}>
        {/* The axis line, running on dashed into the quote zone. */}
        <span className="absolute inset-x-0 top-1/2 h-px bg-ink/[0.1]" />
        <span className="absolute left-full top-1/2 w-[4.5rem] border-t border-dashed border-ink/[0.16] sm:w-24" />
        {/* The product's price range, lowest plan to highest. */}
        {priced.length > 1 && (
          <motion.span
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-cta-soft ring-1 ring-cta/15"
            initial={false}
            animate={{ left: `${lo}%`, width: `${hi - lo}%` }}
            transition={{ duration: 0.65, ease: EASE }}
          />
        )}
        {priced.map(({ pl, price }) => (
          <Rung key={pl.name} plan={pl} price={price} pct={pct(price)} />
        ))}
        {quoted.length > 0 && (
          <span className="absolute left-full top-1/2 z-10 w-[4.5rem] sm:w-24">
            <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-cta bg-white ring-4 ring-white" />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.74rem] font-medium text-ink">
              {quoted.map((pl) => pl.name).join(" · ")}
            </span>
            <span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap text-[0.74rem] text-muted-foreground">
              Custom
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

function Axis({ max, step }: { max: number; step: number }) {
  const ticks = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);
  return (
    <div className="grid pt-3 sm:grid-cols-[11rem_1fr]">
      <span className="hidden text-[0.72rem] text-muted-foreground sm:block">Per month</span>
      <div className={cn("relative h-5", QUOTE_ZONE)}>
        {ticks.map((t) => (
          <span
            key={t}
            className={cn(
              "absolute top-0 text-[0.7rem] tabular-nums text-muted-foreground",
              t === 0 ? "left-0" : t === max ? "right-0" : "-translate-x-1/2",
            )}
            style={t === 0 || t === max ? undefined : { left: `${(t / max) * 100}%` }}
          >
            {formatUsd(t)}
          </span>
        ))}
        <span className="absolute left-full top-0 w-[4.5rem] text-center text-[0.7rem] text-muted-foreground sm:w-24">
          Quote
        </span>
      </div>
    </div>
  );
}

function BillingSwitch({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (b: Billing) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Billing"
      className="inline-flex rounded-lg border border-ink/[0.09] bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      {(["monthly", "yearly"] as const).map((b) => (
        <button
          key={b}
          type="button"
          role="radio"
          aria-checked={billing === b}
          onClick={() => onChange(b)}
          className={cn(
            "h-8 rounded-md px-3.5 text-[0.82rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
            billing === b ? "bg-cta-soft text-cta-hover" : "text-muted-foreground hover:text-ink",
          )}
        >
          {b === "monthly" ? "Billed monthly" : "Billed yearly"}
        </button>
      ))}
    </div>
  );
}

/* ---------- each side's plans ---------- */

function PlanRows({ plans, billing }: { plans: Plan[]; billing: Billing }) {
  return (
    <ul className={cn("divide-y border-y", LINE, "divide-ink/[0.07]")}>
      {plans.map((pl) => {
        const now = priceAt(pl, billing);
        const other = billing === "yearly" ? pl.monthly : pl.annual;
        return (
          <li key={pl.name} className="flex items-start justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <p className="text-[0.92rem] font-medium text-ink">{pl.name}</p>
              <p className="mt-0.5 text-[0.8rem] leading-snug text-muted-foreground">
                {pl.includes}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[0.92rem] font-semibold tabular-nums text-ink">
                {now === null ? "Custom" : now === 0 ? "Free" : `${formatUsd(now)}/mo`}
              </p>
              {now !== null && other != null && other !== now && (
                <p className="mt-0.5 text-[0.72rem] tabular-nums text-muted-foreground">
                  {formatUsd(other)}/mo {billing === "yearly" ? "monthly" : "yearly"}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function PlanColumn({
  product,
  pricing,
  billing,
}: {
  product: Product;
  pricing: ProductPricing;
  billing: Billing;
}) {
  const from = entryPrice(pricing);
  const start = from ? (billing === "yearly" ? (from.annual ?? from.monthly) : from.monthly) : null;
  const brandPlans = pricing.plans.filter((pl) => !pl.forAgencies);
  const agencyPlans = pricing.plans.filter((pl) => pl.forAgencies);
  return (
    <div className="flex h-full flex-col px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
      <div className="flex items-center gap-3">
        <ProductMark product={product} className="h-10 w-10 text-sm" />
        <div className="min-w-0">
          <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">{product.name}</h3>
          <p className="text-[0.78rem] text-muted-foreground">{pricing.model}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[0.75rem] text-muted-foreground">Starts at</p>
        {start !== null && from ? (
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-[2.6rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
              {formatUsd(start)}
            </span>
            <span className="text-sm text-muted-foreground">/month, {billedLabel(billing)}</span>
          </p>
        ) : (
          <p className="mt-1 font-display text-[2rem] font-medium tracking-[-0.03em] text-ink">
            Custom quote
          </p>
        )}
      </div>

      <div className="mt-6 flex-1">
        <PlanRows plans={brandPlans} billing={billing} />
        {agencyPlans.length > 0 && (
          <>
            <p className="mt-5 text-[0.75rem] text-muted-foreground">For agencies</p>
            <div className="mt-2">
              <PlanRows plans={agencyPlans} billing={billing} />
            </div>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
          <CircleDollarSign aria-hidden className="h-4 w-4 shrink-0 text-cta" />
          {pricing.trial}
        </p>
        <a
          href={pricing.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 text-[0.8rem] font-medium text-cta underline-offset-4 hover:underline"
        >
          {product.name} pricing page
          <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

/* ---------- the section ---------- */

export function Pricing({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const [billing, setBilling] = useState<Billing>("monthly");
  const plans = SIDES.flatMap((s) => entry.pricing[s].plans);
  const hasYearly = plans.some((pl) => pl.annual !== undefined && pl.annual !== pl.monthly);
  const top = Math.max(0, ...plans.map((pl) => pl.monthly ?? 0));
  const step = top <= 600 ? 100 : top <= 1500 ? 250 : 500;
  const max = Math.max(step, Math.ceil(top / step) * step);

  const describe = (side: "a" | "b") =>
    `${sides[side].name}: ${entry.pricing[side].plans
      .map((pl) => {
        const p = priceAt(pl, billing);
        return `${pl.name} ${p === null ? "custom quote" : formatUsd(p)}`;
      })
      .join(", ")}.`;
  const ladderLabel = `List prices per month, ${billedLabel(billing)}. ${describe("a")} ${describe("b")}`;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-20">
      <Spacer />
      <SectionHead
        icon={Receipt}
        eyebrow="Pricing"
        title={
          <span id="pricing-title">
            What each one <Accent>costs</Accent>
          </span>
        }
        subtitle={`Published list prices, read from both pricing pages on ${formatDate(entry.pricing.checkedOn)}.`}
      />

      <Band>
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 pt-8 sm:px-10 lg:px-12">
          <p className="text-[0.85rem] text-muted-foreground">
            Every plan on one axis, per month, {billedLabel(billing)}
          </p>
          {hasYearly && <BillingSwitch billing={billing} onChange={setBilling} />}
        </div>
        <Reveal className="px-5 pb-8 pt-2 sm:px-10 lg:px-12">
          <div role="img" aria-label={ladderLabel}>
            <div aria-hidden>
              {SIDES.map((side) => (
                <Rail
                  key={side}
                  product={sides[side]}
                  pricing={entry.pricing[side]}
                  billing={billing}
                  max={max}
                />
              ))}
              <Axis max={max} step={step} />
            </div>
          </div>
        </Reveal>
      </Band>

      <Band>
        <div className={cn("grid gap-px lg:grid-cols-2", LINE_FILL)}>
          {SIDES.map((side) => (
            <div key={side} className="bg-white">
              <PlanColumn product={sides[side]} pricing={entry.pricing[side]} billing={billing} />
            </div>
          ))}
        </div>
      </Band>

      <Band inner="grid gap-4 px-6 py-6 sm:px-10 lg:grid-cols-[14rem_1fr] lg:gap-8 lg:px-12">
        <p className="flex items-start gap-2 text-[0.8rem] font-medium text-ink">
          <CalendarCheck aria-hidden className="mt-px h-4 w-4 shrink-0 text-cta" />
          <span>
            Checked on{" "}
            <time dateTime={entry.pricing.checkedOn}>{formatDate(entry.pricing.checkedOn)}</time>
          </span>
        </p>
        <p className="text-[0.85rem] leading-relaxed text-muted-foreground">
          <Md text={entry.pricing.note} />
        </p>
      </Band>
    </section>
  );
}
