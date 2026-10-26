/**
 * What each list price buys, as two receipts. Jasper is sold per seat and
 * Rankbox as one plan with a set number of articles, so a "per article"
 * figure exists only on one side; the Jasper receipt says so in the data's
 * words instead of inventing a divisor. Under the receipts, every plan
 * Jasper lists, since picking which plan to compare is the easiest place for
 * a comparison to cheat.
 */
import type { ReactNode } from "react";
import { ArrowUpRight, Receipt as ReceiptIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
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
import { rowsByLabel } from "./helpers";

type Line = { label: string; value: string };

/* The receipt's torn foot: white with a row of bites, so the drop shadow
   follows the edge. */
const TEAR =
  "h-[10px] w-full bg-[radial-gradient(circle_at_50%_100%,transparent_5px,#fff_5.5px)] bg-[length:14px_10px] bg-repeat-x";

function Receipt({
  mark,
  name,
  plan,
  price,
  lines,
  footnote,
  highlight = false,
}: {
  mark: ReactNode;
  name: string;
  plan: string;
  price: string;
  lines: Line[];
  footnote: string;
  highlight?: boolean;
}) {
  return (
    <div className="[filter:drop-shadow(0_1px_1px_rgba(16,24,40,0.06))_drop-shadow(0_16px_24px_rgba(16,24,40,0.1))]">
      <div className="overflow-hidden rounded-t-xl bg-white">
        <div className={cn("h-1", highlight ? "bg-cta" : "bg-ink/[0.08]")} />
        <div className="px-6 pb-6 pt-6 sm:px-7">
          <div className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2.5">
              {mark}
              <span className="min-w-0 truncate text-[0.95rem] font-semibold text-ink">
                {name}
                <span className="font-normal text-muted-foreground"> · {plan}</span>
              </span>
            </span>
            <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              List price
            </span>
          </div>

          <p className="mt-6 flex items-baseline gap-1.5">
            <span className="font-display text-[2.6rem] font-medium leading-none tracking-[-0.04em] text-ink">
              {price}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </p>

          <dl className="mt-6 border-t border-dashed border-ink/15">
            {lines.map((l) => (
              <div
                key={l.label}
                className="flex items-baseline justify-between gap-5 border-b border-dashed border-ink/[0.1] py-2.5"
              >
                <dt className="shrink-0 text-[0.8rem] text-muted-foreground">{l.label}</dt>
                <dd
                  className={cn(
                    "text-right text-[0.84rem] leading-snug text-ink",
                    highlight && "font-medium",
                  )}
                >
                  {l.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-[0.8rem] leading-relaxed text-muted-foreground">{footnote}</p>
        </div>
      </div>
      <div aria-hidden className={TEAR} />
    </div>
  );
}

function PlanLadder({ competitor }: { competitor: Competitor }) {
  const perArticle = (p: PricePlan) =>
    p.monthly !== null && p.articles ? Math.round((p.monthly / p.articles) * 100) / 100 : null;
  return (
    <table className="w-full border-collapse text-left">
      <caption className="border-b border-ink/[0.07] px-6 py-4 text-left text-[0.95rem] font-medium text-ink sm:px-10">
        Every {competitor.name} plan, beside Rankbox
        <span className="ml-2 text-[0.8rem] font-normal text-muted-foreground">
          List prices, per month
        </span>
      </caption>
      <thead>
        <tr className="text-[0.75rem] text-muted-foreground">
          <th scope="col" className="px-6 py-3 font-medium sm:px-10">
            Plan
          </th>
          <th scope="col" className="px-3 py-3 text-right font-medium">
            Monthly
          </th>
          <th scope="col" className="hidden px-3 py-3 text-right font-medium sm:table-cell">
            Articles
          </th>
          <th scope="col" className="px-6 py-3 text-right font-medium sm:px-10">
            Per article
          </th>
        </tr>
      </thead>
      <tbody className="tabular-nums">
        <tr className={cn("border-t bg-[color-mix(in_oklab,var(--cta)_5%,white)]", LINE)}>
          <th scope="row" className="px-6 py-3.5 font-medium text-ink sm:px-10">
            <span className="flex items-center gap-2.5 text-[0.9rem]">
              <RankboxMark className="h-6 w-6" />
              Rankbox {PLAN.name}
            </span>
          </th>
          <td className="px-3 py-3.5 text-right text-[0.9rem] font-medium text-ink">
            {formatUsd(PLAN.monthly)}
          </td>
          <td className="hidden px-3 py-3.5 text-right text-[0.9rem] text-ink sm:table-cell">
            {PLAN.articlesPerMonth}
          </td>
          <td className="px-6 py-3.5 text-right text-[0.9rem] font-medium text-cta sm:px-10">
            {formatUsd(RANKBOX_COST.perArticle)}
          </td>
        </tr>
        {competitor.pricing.plans.map((p) => {
          const each = perArticle(p);
          return (
            <tr key={p.name} className={cn("border-t", LINE)}>
              <th scope="row" className="px-6 py-3.5 font-normal text-ink sm:px-10">
                <span className="flex items-center gap-2.5">
                  <CompetitorMark competitor={competitor} className="h-6 w-6 text-[0.55rem]" />
                  <span className="min-w-0">
                    <span className="block text-[0.9rem]">{p.name}</span>
                    {p.note && (
                      <span className="block text-[0.75rem] text-muted-foreground">{p.note}</span>
                    )}
                  </span>
                </span>
              </th>
              <td className="px-3 py-3.5 text-right text-[0.9rem] text-ink">
                {p.monthly === null ? "Custom" : formatUsd(p.monthly)}
              </td>
              <td className="hidden px-3 py-3.5 text-right text-[0.9rem] text-muted-foreground sm:table-cell">
                {p.articles ?? "—"}
              </td>
              <td className="px-6 py-3.5 text-right text-[0.85rem] text-muted-foreground sm:px-10">
                {each !== null ? formatUsd(each) : "Not per article"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function WhatItBuys({ competitor }: { competitor: Competitor }) {
  const pr = competitor.pricing;
  const theirs = costPerArticle(competitor);
  const [buying, team] = rowsByLabel(competitor, ["What you're buying", "Team members"]);
  const pricingSource = competitor.sources.find((s) => /pricing/i.test(s.label));

  const rankboxLines: Line[] = [
    { label: "Articles included", value: `${PLAN.articlesPerMonth} a month` },
    { label: "Per article", value: formatUsd(RANKBOX_COST.perArticle) },
    { label: "Backlinks", value: RANKBOX_CELLS.backlinks.note },
    { label: "Rewrites", value: RANKBOX_CELLS.rewrites.note },
    ...(team ? [{ label: team.label, value: team.rankbox.note }] : []),
  ];
  const theirLines: Line[] = [
    { label: "Covers", value: pr.covers },
    {
      label: "Articles included",
      value: pr.articles ? `${pr.articles} a month` : "Not sold per article",
    },
    { label: "Per article", value: theirs !== null ? formatUsd(theirs) : "Not sold that way" },
    ...(buying ? [{ label: buying.label, value: buying.them.note }] : []),
    ...(team ? [{ label: team.label, value: team.them.note }] : []),
  ];

  return (
    <section aria-labelledby="cost-title">
      <Spacer />
      <SectionHead
        icon={ReceiptIcon}
        eyebrow="What it costs"
        title={
          <span id="cost-title">
            Two prices that buy <Accent>different things</Accent>
          </span>
        }
        subtitle={`A monthly price only means something next to what it produces. Here is ${competitor.name}'s published plan beside ours.`}
      />
      <Band inner={PANEL}>
        <div className="mx-auto grid max-w-[54rem] items-start gap-8 px-5 py-10 sm:px-10 sm:py-14 md:grid-cols-2 md:gap-7">
          <Reveal>
            <Receipt
              highlight
              mark={<RankboxMark className="h-8 w-8" />}
              name="Rankbox"
              plan={PLAN.name}
              price={formatUsd(PLAN.monthly)}
              lines={rankboxLines}
              footnote={RANKBOX_CELLS.pricingModel.note}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <Receipt
              mark={<CompetitorMark competitor={competitor} className="h-8 w-8" />}
              name={competitor.name}
              plan={pr.plan}
              price={formatUsd(pr.monthly)}
              lines={theirLines}
              footnote={pr.caveat}
            />
          </Reveal>
        </div>
      </Band>
      <Band>
        <Reveal>
          <PlanLadder competitor={competitor} />
        </Reveal>
        {pr.ladderNote && (
          <p className="border-t border-ink/[0.07] px-6 py-3 text-[0.8rem] leading-relaxed text-muted-foreground sm:px-10">
            {pr.ladderNote}
          </p>
        )}
      </Band>
      <Band inner="px-6 py-4 sm:px-10">
        <p className="text-[0.8rem] leading-relaxed text-muted-foreground">
          {competitor.name} list prices taken from their public pricing page on{" "}
          {formatCheckedOn(pr.checkedOn)}, on the plan closest in scope to ours; annual billing and
          promotions may lower it. Prices change — check theirs before deciding.
          {pricingSource && (
            <>
              {" "}
              <a
                href={pricingSource.url}
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex items-center gap-0.5 font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
              >
                {pricingSource.label}
                <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </a>
            </>
          )}
        </p>
      </Band>
    </section>
  );
}
