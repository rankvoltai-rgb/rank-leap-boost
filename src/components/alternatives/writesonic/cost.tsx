/**
 * What the money buys, shown as arithmetic rather than as a claim: Rankbox's
 * one plan beside the Writesonic plan the entry compares against, each with
 * its articles drawn one square per article on the same grid, then every plan
 * Writesonic sells with its price drawn to scale.
 *
 * Every Writesonic figure is the entry's own (pricing, covers, caveat, plans);
 * every Rankbox line is a shared Rankbox cell, so one flag updates it here and
 * on every other comparison.
 */
import { Check, Receipt } from "lucide-react";
import {
  Band,
  CELL,
  CellGrid,
  LINE,
  PANEL,
  SectionHead,
  Spacer,
  Accent,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { PLAN, formatUsd } from "@/data/pricing";
import {
  RANKBOX_CELLS,
  RANKBOX_COST,
  costPerArticle,
  formatCheckedOn,
  type Competitor,
  type PricePlan,
} from "@/data/alternatives";
import { cn } from "@/lib/utils";
import { THEM_SOLID } from "./lib";

/* One square per article, ten to a row, the same size on both cards so the
   two counts compare at a glance. */
function ArticleSquares({ count, side }: { count: number; side: "rankbox" | "them" }) {
  return (
    <div aria-hidden className="grid grid-cols-10 gap-1 sm:gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn("aspect-square rounded-[3px]", side === "rankbox" ? "bg-cta" : THEM_SOLID)}
        />
      ))}
    </div>
  );
}

function PriceLine({ amount }: { amount: number }) {
  return (
    <p className="mt-5 flex items-baseline gap-1.5 text-ink">
      <span className="font-display text-[2.6rem] font-medium leading-none tracking-[-0.04em] tabular-nums">
        {formatUsd(amount)}
      </span>
      <span className="text-sm text-muted-foreground">/month</span>
    </p>
  );
}

function PerArticle({ value, highlight }: { value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "mt-5 flex items-baseline justify-between gap-3 rounded-lg border px-4 py-3",
        highlight ? "border-cta/25 bg-cta-soft" : "border-ink/[0.08] bg-white",
      )}
    >
      <span className="text-[0.8rem] text-muted-foreground">Per article</span>
      <span
        className={cn(
          "font-display text-[1.5rem] font-medium tracking-[-0.03em] tabular-nums",
          highlight ? "text-cta" : "text-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}

const CARD =
  "flex h-full flex-col rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_20px_40px_-28px_rgba(16,24,40,0.3)] sm:p-7";

function Receipts({ competitor: c }: { competitor: Competitor }) {
  const theirs = costPerArticle(c);
  const rankboxLines = [
    RANKBOX_CELLS.pricingModel.note,
    RANKBOX_CELLS.backlinks.note,
    RANKBOX_CELLS.reddit.note,
    RANKBOX_CELLS.rewrites.note,
  ];
  const covers = c.pricing.covers.split(/,\s+/);

  return (
    <div className="grid gap-4 px-4 py-8 sm:gap-6 sm:px-8 sm:py-12 lg:grid-cols-2 lg:px-12">
      <Reveal className="h-full">
        <div className={cn(CARD, "border-[1.5px] border-cta")}>
          <div className="flex items-center gap-3">
            <RankboxMark className="h-9 w-9" />
            <p className="text-[1rem] font-semibold text-ink">Rankbox</p>
            <span className="rounded-md bg-cta-soft px-2 py-0.5 text-xs font-medium text-cta">
              {PLAN.name}
            </span>
          </div>
          <PriceLine amount={PLAN.monthly} />
          <div className="mt-6">
            <ArticleSquares count={PLAN.articlesPerMonth} side="rankbox" />
            <p className="mt-2.5 text-[0.8rem] font-medium text-ink">
              {PLAN.articlesPerMonth} articles a month
            </p>
          </div>
          <PerArticle value={formatUsd(RANKBOX_COST.perArticle)} highlight />
          <ul className="mt-6 space-y-2.5">
            {rankboxLines.map((l) => (
              <li key={l} className="flex gap-2.5 text-[0.86rem] leading-snug text-ink/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cta" strokeWidth={2.5} />
                {l}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.06} className="h-full">
        <div className={cn(CARD, "border border-ink/[0.09]")}>
          <div className="flex items-center gap-3">
            <CompetitorMark competitor={c} className="h-9 w-9" />
            <p className="text-[1rem] font-semibold text-ink">{c.name}</p>
            <span className="rounded-md bg-ink/[0.05] px-2 py-0.5 text-xs font-medium text-ink/75">
              {c.pricing.plan}
            </span>
          </div>
          <PriceLine amount={c.pricing.monthly} />
          {c.pricing.articles ? (
            <div className="mt-6">
              <ArticleSquares count={c.pricing.articles} side="them" />
              <p className="mt-2.5 text-[0.8rem] font-medium text-ink">
                {c.pricing.articles} articles a month
              </p>
            </div>
          ) : null}
          <PerArticle value={theirs !== null ? formatUsd(theirs) : "Not sold that way"} />
          <ul className="mt-6 space-y-2.5">
            {covers.map((l) => (
              <li
                key={l}
                className="flex gap-2.5 text-[0.86rem] leading-snug text-ink/85 first-letter:uppercase"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-[color-mix(in_oklab,var(--ink)_62%,white)]"
                  strokeWidth={2.5}
                />
                <span className="first-letter:uppercase">{l}</span>
              </li>
            ))}
          </ul>
          <p
            className={cn(
              "mt-6 border-t pt-5 text-[0.84rem] leading-relaxed text-muted-foreground",
              LINE,
            )}
          >
            {c.pricing.caveat}
          </p>
        </div>
      </Reveal>
    </div>
  );
}

/* A plan's price drawn to scale against the dearest one listed. */
function PriceBar({ amount, max, rb }: { amount: number; max: number; rb?: boolean }) {
  return (
    <span
      aria-hidden
      className="mt-2 hidden h-1.5 w-full max-w-[14rem] rounded-full bg-ink/[0.05] sm:block"
    >
      <span
        className={cn("block h-full rounded-full", rb ? "bg-cta" : THEM_SOLID)}
        style={{ width: `${Math.max((amount / max) * 100, 3)}%` }}
      />
    </span>
  );
}

/* Every plan they sell, so the reader can find their own volume on it; the
   plan picked above is only one rung. Prices are drawn to scale against the
   dearest listed plan. Per-article cost appears only where a plan is sold by
   the article. */
function PlanLadder({ competitor: c }: { competitor: Competitor }) {
  const plans = c.pricing.plans;
  const max = Math.max(
    PLAN.monthly,
    ...plans.map((p) => p.monthly).filter((n): n is number => n !== null),
  );
  const each = (p: PricePlan) =>
    p.monthly !== null && p.articles ? Math.round((p.monthly / p.articles) * 100) / 100 : null;

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9rem]">
        <caption className={cn("border-b px-5 py-4 text-left sm:px-8", LINE)}>
          <span className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[0.95rem] font-medium text-ink">Every {c.name} plan</span>
            <span className="text-xs text-muted-foreground">
              List prices, billed monthly · checked {formatCheckedOn(c.pricing.checkedOn)}
            </span>
          </span>
        </caption>
        <thead>
          <tr className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
            <th scope="col" className="px-5 py-3 font-semibold sm:px-8">
              Plan
            </th>
            <th scope="col" className={cn("border-l px-4 py-3 font-semibold", LINE)}>
              Monthly
            </th>
            <th scope="col" className={cn("border-l px-4 py-3 text-right font-semibold", LINE)}>
              Articles
            </th>
            <th
              scope="col"
              className={cn("border-l px-5 py-3 text-right font-semibold sm:px-8", LINE)}
            >
              Per article
            </th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          <tr className={cn("border-t bg-[color-mix(in_oklab,var(--cta)_5%,white)]", LINE)}>
            <th scope="row" className="px-5 py-4 font-medium text-ink sm:px-8">
              <span className="flex items-center gap-2.5">
                <RankboxMark className="h-6 w-6" />
                Rankbox {PLAN.name}
              </span>
            </th>
            <td className={cn("border-l px-4 py-4 font-medium text-cta", LINE)}>
              {formatUsd(PLAN.monthly)}
              <PriceBar amount={PLAN.monthly} max={max} rb />
            </td>
            <td className={cn("border-l px-4 py-4 text-right text-ink", LINE)}>
              {PLAN.articlesPerMonth}
            </td>
            <td className={cn("border-l px-5 py-4 text-right font-medium text-cta sm:px-8", LINE)}>
              {formatUsd(RANKBOX_COST.perArticle)}
            </td>
          </tr>
          {plans.map((p) => {
            const per = each(p);
            const compared = p.name === c.pricing.plan;
            return (
              <tr key={p.name} className={cn("border-t", LINE)}>
                <th scope="row" className="px-5 py-4 font-normal text-ink sm:px-8">
                  <span className="flex items-start gap-2.5">
                    <CompetitorMark competitor={c} className="mt-0.5 h-6 w-6 text-[0.55rem]" />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2 font-medium">
                        {p.name}
                        {compared && (
                          <span className="rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.65rem] font-medium text-ink/70">
                            Compared above
                          </span>
                        )}
                      </span>
                      {p.note && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">{p.note}</span>
                      )}
                    </span>
                  </span>
                </th>
                <td className={cn("border-l px-4 py-4 text-ink", LINE)}>
                  {p.monthly === null ? "Custom" : formatUsd(p.monthly)}
                  {p.monthly !== null && <PriceBar amount={p.monthly} max={max} />}
                </td>
                <td className={cn("border-l px-4 py-4 text-right text-muted-foreground", LINE)}>
                  {p.articles ?? "—"}
                </td>
                <td
                  className={cn(
                    "border-l px-5 py-4 text-right text-muted-foreground sm:px-8",
                    LINE,
                  )}
                >
                  {per !== null ? formatUsd(per) : "Not per article"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function WritesonicCost({ competitor: c }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="cost-title">
      <Spacer />
      <SectionHead
        icon={Receipt}
        eyebrow="What it costs"
        title={
          <span id="cost-title">
            What each plan <Accent>actually buys</Accent>
          </span>
        }
        subtitle={`Rankbox's one plan beside ${c.name}'s ${c.pricing.plan}, the plan the comparison is drawn against, then every plan ${c.name} lists.`}
      />

      {/* The entry's own headline figures, as a row of hairline cells. */}
      <Band>
        <CellGrid className="grid-cols-2 lg:grid-cols-4">
          {c.specs.map((s) => (
            <li
              key={s.label}
              className={cn(CELL, "flex flex-col-reverse px-5 py-7 sm:px-8 sm:py-9")}
            >
              <p className="mt-2 text-[0.84rem] leading-snug text-muted-foreground">{s.label}</p>
              <p className="font-display text-[1.7rem] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[2rem]">
                {s.value}
              </p>
            </li>
          ))}
        </CellGrid>
      </Band>

      <Band inner={PANEL}>
        <Receipts competitor={c} />
      </Band>

      <Band>
        <Reveal>
          <PlanLadder competitor={c} />
        </Reveal>
      </Band>

      <Band inner="px-6 py-4 text-center">
        <p className="mx-auto max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {c.name} list prices taken from their public pricing page on{" "}
          {formatCheckedOn(c.pricing.checkedOn)}; annual billing and promotions may lower them.
          {c.pricing.ladderNote ? ` ${c.pricing.ladderNote}` : ""} Prices change, so check theirs
          before deciding.
        </p>
      </Band>
    </section>
  );
}
