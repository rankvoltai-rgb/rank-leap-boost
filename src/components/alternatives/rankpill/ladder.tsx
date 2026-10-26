/**
 * What a month costs: every way RankPill sells its one plan, as bars on one
 * scale, with Rankbox's single price drawn as a dashed rule through all of
 * them. Picking which of their prices to compare against is where a
 * comparison usually cheats, so all of them are here, cheapest billing
 * included, with the per-article and twelve-month sums worked out beside.
 *
 * The bars grow in while the table is on screen and rewind when it leaves;
 * with reduced motion they are simply drawn.
 */
import { motion } from "motion/react";
import { ArrowUpRight, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN, formatUsd } from "@/data/pricing";
import { Accent, Band, LINE, LINE_FILL, SectionHead, Spacer } from "@/components/landing/frame";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { formatCheckedOn, type Competitor } from "@/data/alternatives";
import { RANKBOX_TINT, cents, displayUrl, sourceFor, useOnScreen } from "./lib";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Rung {
  key: string;
  name: string;
  note?: string;
  monthly: number | null;
  articles: number | null;
  rankbox: boolean;
}

export function CostLadder({ competitor: c }: { competitor: Competitor }) {
  const { ref, on, reduce } = useOnScreen(0.4);
  const rungs: Rung[] = [
    {
      key: "rankbox",
      name: `Rankbox ${PLAN.name}`,
      note: "Billed monthly",
      monthly: PLAN.monthly,
      articles: PLAN.articlesPerMonth,
      rankbox: true,
    },
    ...c.pricing.plans.map((p) => ({
      key: p.name,
      name: `${c.name} ${p.name}`,
      note: p.note,
      monthly: p.monthly,
      articles: p.articles,
      rankbox: false,
    })),
  ];
  const max = Math.max(...rungs.map((r) => r.monthly ?? 0));
  const guide = (PLAN.monthly / max) * 100;
  const pricingSource = sourceFor(c, "/pricing") ?? c.sources[0];

  return (
    <section id="cost" aria-labelledby="cost-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <SectionHead
        icon={Receipt}
        eyebrow="What a month costs"
        title={
          <span id="cost-title">
            Every way to pay for {c.name}, <Accent>beside one Rankbox price</Accent>
          </span>
        }
        subtitle={`${c.name}'s ${c.pricing.plan} plan covers ${c.pricing.covers}. Here is each billing option on its pricing page, on one scale with Rankbox's plan.`}
      />

      <Band>
        <div ref={ref}>
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Monthly price, price per article, and twelve-month cost of each {c.name} billing
              option and the Rankbox plan
            </caption>
            <thead>
              <tr className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                <th scope="col" className="px-5 py-4 font-medium sm:w-[30%] sm:px-6 lg:px-10">
                  Plan
                </th>
                <th scope="col" className={cn("border-l px-4 py-4 font-medium sm:px-6", LINE)}>
                  Per month
                </th>
                <th
                  scope="col"
                  className={cn(
                    "hidden border-l px-4 py-4 text-right font-medium sm:table-cell sm:w-[14%]",
                    LINE,
                  )}
                >
                  Per article
                </th>
                <th
                  scope="col"
                  className={cn(
                    "hidden border-l px-4 py-4 text-right font-medium sm:table-cell sm:w-[15%] lg:px-10",
                    LINE,
                  )}
                >
                  12 months
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rungs.map((r, i) => {
                const each =
                  r.monthly !== null && r.articles ? cents(r.monthly / r.articles) : null;
                const year = r.monthly !== null ? cents(r.monthly * 12) : null;
                const width = r.monthly !== null ? (r.monthly / max) * 100 : 0;
                return (
                  <tr key={r.key} className={cn("border-t", LINE, r.rankbox && RANKBOX_TINT)}>
                    <th scope="row" className="px-5 py-4 align-middle font-normal sm:px-6 lg:px-10">
                      <span className="flex items-center gap-2.5">
                        {r.rankbox ? (
                          <RankboxMark className="h-6 w-6" />
                        ) : (
                          <CompetitorMark competitor={c} className="h-6 w-6 text-[0.5rem]" />
                        )}
                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block text-[0.88rem] font-medium leading-snug",
                              r.rankbox ? "text-cta" : "text-ink",
                            )}
                          >
                            {r.name}
                          </span>
                          {r.note && (
                            <span className="block text-[0.75rem] leading-snug text-muted-foreground">
                              {r.note}
                            </span>
                          )}
                        </span>
                      </span>
                    </th>
                    <td className={cn("border-l px-4 py-4 align-middle sm:px-6", LINE)}>
                      <span className="relative flex h-7 items-center">
                        {/* Rankbox's price, ruled through every bar. */}
                        <span
                          aria-hidden
                          className="absolute -inset-y-4 border-l border-dashed border-cta/50"
                          style={{ left: `${guide}%` }}
                        />
                        <motion.span
                          aria-hidden
                          initial={false}
                          animate={{ scaleX: on ? 1 : 0 }}
                          transition={
                            reduce ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: i * 0.1 }
                          }
                          className={cn(
                            "absolute inset-y-0 left-0 origin-left rounded-md",
                            r.rankbox
                              ? "bg-cta"
                              : "bg-[repeating-linear-gradient(135deg,color-mix(in_oklab,var(--ink)_9%,white)_0_6px,color-mix(in_oklab,var(--ink)_5%,white)_6px_12px)] ring-1 ring-inset ring-ink/[0.08]",
                          )}
                          style={{ width: `${width}%` }}
                        />
                        <span
                          className={cn(
                            "relative z-10 px-2.5 text-[0.88rem] font-semibold",
                            r.rankbox ? "text-white" : "text-ink",
                          )}
                        >
                          {r.monthly === null ? "Custom" : formatUsd(r.monthly)}
                        </span>
                      </span>
                      {/* On a phone the two sums ride under the bar. */}
                      <span className="mt-1.5 block text-[0.72rem] text-muted-foreground sm:hidden">
                        {each !== null ? `${formatUsd(each)} an article` : "Not per article"}
                        {year !== null && ` · ${formatUsd(year)} over 12 months`}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "hidden border-l px-4 py-4 text-right align-middle text-[0.88rem] sm:table-cell",
                        LINE,
                        r.rankbox ? "font-semibold text-ink" : "text-ink/75",
                      )}
                    >
                      {each !== null ? formatUsd(each) : "—"}
                    </td>
                    <td
                      className={cn(
                        "hidden border-l px-4 py-4 text-right align-middle text-[0.88rem] sm:table-cell lg:px-10",
                        LINE,
                        r.rankbox ? "font-semibold text-ink" : "text-ink/75",
                      )}
                    >
                      {year !== null ? formatUsd(year) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Band>

      {/* What the number covers, and where it was read. */}
      <Band>
        <div className={cn("grid gap-px md:grid-cols-[1.4fr_1fr]", LINE_FILL)}>
          <div className="bg-white px-5 py-7 sm:px-8 lg:px-10">
            <h3 className="text-[0.95rem] font-semibold tracking-tight text-ink">
              What {c.name}&rsquo;s {c.pricing.plan} plan covers
            </h3>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
              {c.pricing.caveat}
            </p>
            {c.pricing.ladderNote && (
              <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground">
                {c.pricing.ladderNote}
              </p>
            )}
          </div>
          <div className="bg-white px-5 py-7 sm:px-8 lg:px-10">
            <h3 className="text-[0.95rem] font-semibold tracking-tight text-ink">
              Checked {formatCheckedOn(c.pricing.checkedOn)}
            </h3>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
              List prices from {c.name}&rsquo;s public pricing page, shown per month. Twelve-month
              sums are the monthly rate times twelve. Prices change, so check theirs before
              deciding.
            </p>
            <a
              href={pricingSource.url}
              target="_blank"
              rel="noopener nofollow"
              className="group mt-4 inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.18]"
            >
              {displayUrl(pricingSource.url)}
              <ArrowUpRight
                aria-hidden
                className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </Band>
    </section>
  );
}
