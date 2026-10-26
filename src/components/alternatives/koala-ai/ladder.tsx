/**
 * Every plan Koala sells, beside Rankbox's one, as a hairline table. Picking
 * the plan is where a comparison cheats most easily, so the whole ladder is
 * shown. Each price is drawn as a bar against the most expensive plan, with
 * Rankbox's price as a dashed line through every row, so the reader can see
 * where their own volume sits. Per-article cost is only worked out where a
 * plan is sold by the article; a plan sold by the word says so instead.
 */
import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, LINE, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { PLAN, formatUsd } from "@/data/pricing";
import {
  RANKBOX_COST,
  formatCheckedOn,
  type Competitor,
  type PricePlan,
} from "@/data/alternatives";
import { Accent } from "@/components/landing/frame";
import { RANKBOX_TINT, displayUrl } from "./tokens";

function PriceBar({ value, max, marker }: { value: number; max: number; marker?: number }) {
  const pct = (n: number) => `${Math.max(1.5, (n / max) * 100).toFixed(2)}%`;
  return (
    <span aria-hidden className="relative mt-2 block h-1.5 w-full rounded-full bg-ink/[0.05]">
      <span
        className={cn(
          "absolute inset-y-0 left-0 rounded-full",
          marker === undefined ? "bg-cta" : "bg-[color-mix(in_oklab,var(--ink)_32%,white)]",
        )}
        style={{ width: pct(value) }}
      />
      {marker !== undefined && (
        <span
          className="absolute -inset-y-1.5 w-0 border-l border-dashed border-cta"
          style={{ left: pct(marker) }}
        />
      )}
    </span>
  );
}

export function PlanLadder({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const plans = c.pricing.plans;
  const priced = plans.map((p) => p.monthly).filter((n): n is number => n !== null);
  const max = Math.max(PLAN.monthly, ...priced);
  const perArticle = (p: PricePlan) =>
    p.monthly !== null && p.articles ? Math.round((p.monthly / p.articles) * 100) / 100 : null;
  const pricingSource = c.sources.find((s) => /pricing/.test(s.url));

  return (
    <section id="pricing" aria-labelledby="ladder-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <SectionHead
        icon={Coins}
        eyebrow="What it costs"
        title={
          <span id="ladder-title">
            {plans.length} {c.name} plans, <Accent>one Rankbox plan</Accent>
          </span>
        }
        subtitle={c.pricing.caveat}
      />
      <Band>
        <Reveal>
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[22rem] border-collapse text-left">
              <caption className="sr-only">
                Every {c.name} plan beside Rankbox, list prices a month, checked{" "}
                {formatCheckedOn(c.pricing.checkedOn)}
              </caption>
              <thead>
                <tr className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <th scope="col" className="px-5 py-4 font-semibold sm:px-10">
                    Plan
                  </th>
                  <th
                    scope="col"
                    className={cn("w-[38%] border-l px-4 py-4 font-semibold sm:px-6", LINE)}
                  >
                    <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      Price a month
                      <span className="flex items-center gap-1.5 font-medium normal-case tracking-normal text-cta">
                        <span aria-hidden className="h-3 w-0 border-l border-dashed border-cta" />
                        Rankbox
                      </span>
                    </span>
                  </th>
                  <th
                    scope="col"
                    className={cn("border-l px-4 py-4 text-right font-semibold sm:px-10", LINE)}
                  >
                    Per article
                  </th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                <tr className={cn("border-t", LINE, RANKBOX_TINT)}>
                  <th scope="row" className="px-5 py-4 font-normal sm:px-10">
                    <span className="flex items-center gap-2.5">
                      <RankboxMark className="h-7 w-7" />
                      <span className="min-w-0">
                        <span className="block text-[0.9rem] font-semibold text-ink">
                          Rankbox {PLAN.name}
                        </span>
                        <span className="block text-[0.78rem] text-muted-foreground">
                          {PLAN.articlesPerMonth} articles a month
                        </span>
                      </span>
                    </span>
                  </th>
                  <td className={cn("border-l px-4 py-4 sm:px-6", LINE)}>
                    <span className="text-[0.95rem] font-semibold text-ink">
                      {formatUsd(PLAN.monthly)}
                    </span>
                    <PriceBar value={PLAN.monthly} max={max} />
                  </td>
                  <td
                    className={cn(
                      "border-l px-4 py-4 text-right text-[0.95rem] font-semibold text-cta sm:px-10",
                      LINE,
                    )}
                  >
                    {formatUsd(RANKBOX_COST.perArticle)}
                  </td>
                </tr>
                {plans.map((p) => {
                  const each = perArticle(p);
                  const compared = p.name === c.pricing.plan;
                  return (
                    <tr key={p.name} className={cn("border-t", LINE)}>
                      <th scope="row" className="px-5 py-4 font-normal sm:px-10">
                        <span className="flex items-center gap-2.5">
                          <CompetitorMark competitor={c} className="h-7 w-7 text-[0.6rem]" />
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.9rem] font-medium text-ink">
                              {p.name}
                              {compared && (
                                <span className="rounded-md bg-[color-mix(in_oklab,var(--ink)_6%,white)] px-1.5 py-px text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-ink/70">
                                  Compared
                                </span>
                              )}
                            </span>
                            {p.note && (
                              <span className="block text-[0.78rem] text-muted-foreground">
                                {p.note}
                              </span>
                            )}
                          </span>
                        </span>
                      </th>
                      <td className={cn("border-l px-4 py-4 sm:px-6", LINE)}>
                        <span className="text-[0.95rem] text-ink">
                          {p.monthly === null ? "Custom" : formatUsd(p.monthly)}
                        </span>
                        {p.monthly !== null && (
                          <PriceBar value={p.monthly} max={max} marker={PLAN.monthly} />
                        )}
                      </td>
                      <td
                        className={cn(
                          "border-l px-4 py-4 text-right text-[0.85rem] text-muted-foreground sm:px-10",
                          LINE,
                        )}
                      >
                        {each !== null ? formatUsd(each) : "Not per article"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Band>
      <Band inner="px-5 py-5 sm:px-10">
        <p className="mx-auto max-w-3xl text-center text-[0.78rem] leading-relaxed text-muted-foreground">
          {c.pricing.ladderNote} {c.name}&rsquo;s {c.pricing.plan} plan covers {c.pricing.covers}.
          List prices billed monthly, from{" "}
          {pricingSource ? (
            <a
              href={pricingSource.url}
              target="_blank"
              rel="noopener nofollow"
              className="font-medium text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
            >
              {displayUrl(pricingSource.url)}
            </a>
          ) : (
            `${c.name}'s pricing page`
          )}{" "}
          on {formatCheckedOn(c.pricing.checkedOn)}; annual billing and promotions may lower them.
        </p>
      </Band>
    </section>
  );
}
