/**
 * Pricing as one ladder: every plan from both pricing pages on a single
 * dollar scale, cheapest first, so the reader sees where the two price lists
 * interleave instead of reading two cards side by side. The billing switch
 * redraws the bars on the same scale (the monthly top price), so going yearly
 * visibly shortens them. Quote-only plans close the list without a bar.
 *
 * Above the ladder, each product's terms: where it starts, how it's sold, the
 * trial, and its pricing page. Below it, the data's own note on what the list
 * prices leave out.
 */
import { useState } from "react";
import { ArrowUpRight, CircleDollarSign, Info, Tag } from "lucide-react";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  PANEL,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { ProductMark } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import { entryPrice } from "@/data/compare/starting-price";
import type { MatchupEntry, Plan, Side } from "@/data/compare/types";
import { formatUsd } from "@/data/pricing";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Rich } from "./parts";
import { SIDES } from "./util";

type Billing = "annual" | "monthly";

const priceOf = (pl: Plan, billing: Billing) =>
  pl.monthly === null ? null : billing === "annual" ? (pl.annual ?? pl.monthly) : pl.monthly;

export function PriceLadder({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const [billing, setBilling] = useState<Billing>("annual");

  const plans = SIDES.flatMap((side) => entry.pricing[side].plans.map((plan) => ({ side, plan })));
  const priced = plans
    .filter(({ plan }) => plan.monthly !== null)
    .sort(
      (x, y) =>
        (priceOf(x.plan, billing) ?? 0) - (priceOf(y.plan, billing) ?? 0) ||
        x.side.localeCompare(y.side),
    );
  const quoted = plans.filter(({ plan }) => plan.monthly === null);
  /* One scale for both switches: the top monthly price. */
  const top = Math.max(...priced.map(({ plan }) => plan.monthly ?? 0));
  const entryOf = Object.fromEntries(
    SIDES.map((side) => [side, entryPrice(entry.pricing[side])]),
  ) as Record<Side, ReturnType<typeof entryPrice>>;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={CircleDollarSign}
        eyebrow="Pricing"
        title={
          <span id="pricing-title">
            Every plan, <Accent>on one ladder</Accent>
          </span>
        }
        subtitle={`Published list prices from both pricing pages, read on ${formatDate(entry.pricing.checkedOn)}, on one scale and cheapest first.`}
      />

      {/* Each product's terms. */}
      <Band>
        <CellGrid className="md:grid-cols-2">
          {SIDES.map((side) => {
            const p = entry.pricing[side];
            const from = entryOf[side];
            return (
              <li key={side} className={cn(CELL, "px-5 py-7 sm:px-8")}>
                <div className="flex items-center gap-3">
                  <ProductMark product={sides[side]} className="h-9 w-9 text-sm" />
                  <div className="min-w-0">
                    <p className="text-[0.95rem] font-semibold text-ink">{sides[side].name}</p>
                    <p className="text-[0.78rem] text-muted-foreground">{p.model}</p>
                  </div>
                </div>
                <p className="mt-5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Starts at
                </p>
                {from ? (
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums">
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
                  <p className="mt-1 font-display text-[1.6rem] font-medium text-ink">
                    Custom quote
                  </p>
                )}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-[0.82rem] text-ink/80">
                    <Tag className="h-3.5 w-3.5 shrink-0 text-cta" aria-hidden />
                    {p.trial}
                  </p>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-[0.8rem] font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink/60"
                  >
                    {sides[side].name} pricing page
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </li>
            );
          })}
        </CellGrid>
      </Band>

      {/* The switch. */}
      <Band
        inner={cn("flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8", PANEL)}
      >
        <p className="text-[0.82rem] text-muted-foreground">
          <span className="font-medium text-ink">{priced.length + quoted.length} plans</span>,
          cheapest first
        </p>
        <div
          role="group"
          aria-label="Billing"
          className="inline-flex rounded-lg border border-ink/[0.08] bg-white p-0.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          {(
            [
              ["annual", "Billed yearly"],
              ["monthly", "Billed monthly"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={billing === value}
              onClick={() => setBilling(value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[0.8rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                billing === value ? "bg-cta text-white" : "text-ink/70 hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </Band>

      {/* The ladder. */}
      <Band>
        <ol aria-label="Every plan, cheapest first" className="divide-y divide-ink/[0.07]">
          {priced.map(({ side, plan }, i) => {
            const price = priceOf(plan, billing) ?? 0;
            const isEntry = entryOf[side]?.monthly === plan.monthly && !plan.forAgencies;
            return (
              <li key={`${side}-${plan.name}`}>
                <Reveal
                  delay={Math.min(i, 6) * 0.03}
                  y={10}
                  className="grid items-center gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-ink/[0.012] sm:px-8 md:grid-cols-[13rem_minmax(0,1fr)_minmax(0,17rem)]"
                >
                  <div className="flex items-center gap-2.5">
                    <ProductMark product={sides[side]} className="h-7 w-7 text-[0.65rem]" />
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-2 text-[0.92rem] font-semibold text-ink">
                        {plan.name}
                        {isEntry && (
                          <span className="rounded bg-cta-soft px-1.5 py-px text-[0.62rem] font-semibold text-cta">
                            Entry plan
                          </span>
                        )}
                        {plan.forAgencies && (
                          <span className="rounded border border-ink/[0.1] px-1.5 py-px text-[0.62rem] font-medium text-muted-foreground">
                            For agencies
                          </span>
                        )}
                      </p>
                      <p className="text-[0.74rem] text-muted-foreground">{sides[side].name}</p>
                    </div>
                  </div>
                  <p className="text-[0.82rem] leading-snug text-muted-foreground md:order-none">
                    {plan.includes}
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden
                      className="h-2 flex-1 overflow-hidden rounded-full bg-ink/[0.05]"
                    >
                      <div
                        className="h-full rounded-full bg-cta transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ width: `${(price / top) * 100}%` }}
                      />
                    </div>
                    <p className="w-[6.5rem] shrink-0 text-right">
                      <span className="text-[1rem] font-semibold text-ink tabular-nums">
                        {formatUsd(price)}
                      </span>
                      <span className="text-[0.75rem] text-muted-foreground">/mo</span>
                      <span className="block text-[0.66rem] text-muted-foreground">
                        {billing === "annual" && plan.annual !== undefined
                          ? `billed yearly · ${formatUsd(plan.monthly ?? 0)} monthly`
                          : billing === "monthly" && plan.annual !== undefined
                            ? `billed monthly · ${formatUsd(plan.annual)} yearly`
                            : "billed monthly"}
                      </span>
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
          {quoted.map(({ side, plan }) => (
            <li
              key={`${side}-${plan.name}`}
              className="grid items-center gap-x-6 gap-y-2 px-5 py-4 sm:px-8 md:grid-cols-[13rem_minmax(0,1fr)_minmax(0,17rem)]"
            >
              <div className="flex items-center gap-2.5">
                <ProductMark product={sides[side]} className="h-7 w-7 text-[0.65rem]" />
                <div className="min-w-0">
                  <p className="text-[0.92rem] font-semibold text-ink">{plan.name}</p>
                  <p className="text-[0.74rem] text-muted-foreground">{sides[side].name}</p>
                </div>
              </div>
              <p className="text-[0.82rem] leading-snug text-muted-foreground">{plan.includes}</p>
              <p className="text-[0.88rem] font-medium text-ink md:text-right">Custom quote</p>
            </li>
          ))}
        </ol>
      </Band>

      {/* What the list prices leave out. */}
      <Band inner={cn("px-5 py-6 sm:px-8", PANEL)}>
        <div className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-cta">
            <Info className="h-3.5 w-3.5" aria-hidden />
          </span>
          <p className={cn("max-w-4xl text-[0.86rem] leading-relaxed text-muted-foreground", LINE)}>
            <Rich text={entry.pricing.note} />
          </p>
        </div>
      </Band>
    </section>
  );
}
