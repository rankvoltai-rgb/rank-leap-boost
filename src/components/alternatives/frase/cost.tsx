/**
 * What each costs, as arithmetic: Rankbox's one plan and the Frase plan the
 * entry compares against, side by side as two receipts, then every plan
 * Frase sells on one ladder with its cost per article drawn as a bar. The
 * whole ladder is shown because picking the plan is the easiest place for a
 * comparison to cheat; the reader can find their own volume on it.
 */
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Calculator, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, CELL, CellGrid, LINE, SectionHead } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import {
  RANKBOX_CELLS,
  RANKBOX_COST,
  costPerArticle,
  formatCheckedOn,
  type Competitor,
} from "@/data/alternatives";
import { PLAN, formatUsd } from "@/data/pricing";
import { CompetitorMark, RankboxMark } from "../kit";
import { useStill } from "./clock";
import { planPerArticle } from "./model";
import { withAccent } from "./helpers";

interface LadderRow {
  key: string;
  name: string;
  note?: string;
  monthly: number | null;
  articles: number | null;
  per: number | null;
  rankbox?: boolean;
  compared?: boolean;
}

function Receipt({
  mark,
  name,
  plan,
  monthly,
  covers,
  per,
  children,
  tinted,
}: {
  mark: ReactNode;
  name: string;
  plan: string;
  monthly: number;
  covers: string;
  per: number | null;
  children?: ReactNode;
  tinted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col p-6 sm:p-8 lg:p-10",
        tinted && "bg-[color-mix(in_oklab,var(--cta)_4%,white)]",
      )}
    >
      <div className="flex items-center gap-3">
        {mark}
        <p className="text-[0.95rem] font-semibold text-ink">
          {name}
          <span className="ml-1.5 font-normal text-muted-foreground">· {plan}</span>
        </p>
      </div>
      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-[2.6rem] font-medium leading-none tracking-[-0.03em] text-ink">
          {formatUsd(monthly)}
        </span>
        <span className="text-sm text-muted-foreground">/month</span>
      </p>
      <p className="mt-2 text-[0.9rem] text-muted-foreground">{covers}</p>
      <div className={cn("mt-6 flex items-baseline justify-between gap-4 border-t pt-5", LINE)}>
        <span className="text-[0.78rem] font-medium text-muted-foreground">Per article</span>
        <span
          className={cn(
            "font-display text-[1.9rem] font-medium leading-none tracking-[-0.03em]",
            tinted ? "text-brand-blue" : "text-ink",
          )}
        >
          {per !== null ? formatUsd(per) : "Not sold that way"}
        </span>
      </div>
      {children}
    </div>
  );
}

function Bar({
  value,
  max,
  rankbox,
  still,
}: {
  value: number;
  max: number;
  rankbox?: boolean;
  still: boolean;
}) {
  return (
    <span
      aria-hidden
      className="relative hidden h-2 w-full max-w-[11rem] overflow-hidden rounded-full bg-ink/[0.05] sm:block"
    >
      <motion.span
        className={cn("absolute inset-y-0 left-0 rounded-full", rankbox ? "bg-cta" : "bg-ink/30")}
        initial={{ width: 0 }}
        whileInView={{ width: `${(value / max) * 100}%` }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: still ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}

export function CostSection({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const still = useStill();
  const theirs = costPerArticle(c);
  const rows: LadderRow[] = [
    {
      key: "rankbox",
      name: `Rankbox ${PLAN.name}`,
      monthly: PLAN.monthly,
      articles: PLAN.articlesPerMonth,
      per: RANKBOX_COST.perArticle,
      rankbox: true,
    },
    ...c.pricing.plans.map((p) => ({
      key: p.name,
      name: p.name,
      note: p.note,
      monthly: p.monthly,
      articles: p.articles,
      per: planPerArticle(p),
      compared: p.name === c.pricing.plan,
    })),
  ];
  const max = Math.max(...rows.map((r) => r.per ?? 0));

  return (
    <section id="cost" aria-labelledby="cost-title" className="scroll-mt-16">
      <SectionHead
        icon={Calculator}
        eyebrow="What it costs"
        title={<span id="cost-title">{withAccent("Every plan, priced per article", 3)}</span>}
        subtitle={`A monthly price only means something next to what it produces. Here is ${c.name}'s published plan beside Rankbox's one plan, then every plan ${c.name} sells.`}
      />

      <Band>
        <CellGrid className="md:grid-cols-2">
          <li className={CELL}>
            <Reveal className="h-full">
              <Receipt
                tinted
                mark={<RankboxMark className="h-9 w-9" />}
                name="Rankbox"
                plan={PLAN.name}
                monthly={PLAN.monthly}
                covers={RANKBOX_CELLS.pricingModel.note}
                per={RANKBOX_COST.perArticle}
              >
                <ul className="mt-6 space-y-2.5">
                  {[
                    RANKBOX_CELLS.backlinks.note,
                    RANKBOX_CELLS.reddit.note,
                    RANKBOX_CELLS.rewrites.note,
                  ].map((l) => (
                    <li key={l} className="flex gap-2.5 text-[0.86rem] leading-snug text-ink/80">
                      <span
                        aria-hidden
                        className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-cta"
                      />
                      {l}
                    </li>
                  ))}
                </ul>
              </Receipt>
            </Reveal>
          </li>
          <li className={CELL}>
            <Reveal delay={0.06} className="h-full">
              <Receipt
                mark={<CompetitorMark competitor={c} className="h-9 w-9" />}
                name={c.name}
                plan={c.pricing.plan}
                monthly={c.pricing.monthly}
                covers={c.pricing.covers}
                per={theirs}
              >
                <p className="mt-6 text-[0.86rem] leading-relaxed text-muted-foreground">
                  {c.pricing.caveat}
                </p>
              </Receipt>
            </Reveal>
          </li>
        </CellGrid>
      </Band>

      <Band>
        <div className="relative overflow-x-auto">
          <table className="w-full border-collapse text-left sm:min-w-[600px]">
            <caption className="sr-only">
              Every {c.name} plan beside Rankbox, with the cost per article
            </caption>
            <thead>
              <tr className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <th scope="col" className="px-4 py-4 font-semibold sm:px-8">
                  Plan
                </th>
                <th
                  scope="col"
                  className={cn("border-l px-4 py-4 text-right font-semibold sm:px-5", LINE)}
                >
                  Monthly
                </th>
                <th
                  scope="col"
                  className={cn(
                    "hidden border-l px-5 py-4 text-right font-semibold sm:table-cell",
                    LINE,
                  )}
                >
                  Articles
                </th>
                <th scope="col" className={cn("border-l px-4 py-4 font-semibold sm:px-8", LINE)}>
                  Per article
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((r) => (
                <tr
                  key={r.key}
                  className={cn(
                    "border-t",
                    LINE,
                    r.rankbox && "bg-[color-mix(in_oklab,var(--cta)_4%,white)]",
                  )}
                >
                  <th scope="row" className="px-4 py-4 align-middle font-normal sm:px-8">
                    <span className="flex items-center gap-3">
                      {r.rankbox ? (
                        <RankboxMark className="hidden h-7 w-7 sm:flex" />
                      ) : (
                        <CompetitorMark
                          competitor={c}
                          className="hidden h-7 w-7 text-[0.55rem] sm:flex"
                        />
                      )}
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2 text-[0.92rem] font-medium text-ink">
                          {r.name}
                          {r.compared && (
                            <span className="rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.62rem] font-semibold text-ink/70">
                              Compared above
                            </span>
                          )}
                        </span>
                        {r.note && (
                          <span className="mt-0.5 block text-[0.78rem] text-muted-foreground">
                            {r.note}
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <td
                    className={cn(
                      "border-l px-4 py-4 text-right text-[0.9rem] text-ink sm:px-5",
                      LINE,
                    )}
                  >
                    {r.monthly === null ? "Custom" : formatUsd(r.monthly)}
                    {r.articles !== null && (
                      <span className="block text-[0.72rem] text-muted-foreground sm:hidden">
                        {r.articles} articles
                      </span>
                    )}
                  </td>
                  <td
                    className={cn(
                      "hidden border-l px-5 py-4 text-right text-[0.9rem] text-ink/80 sm:table-cell",
                      LINE,
                    )}
                  >
                    {r.articles ?? "—"}
                  </td>
                  <td className={cn("border-l px-4 py-4 sm:px-8", LINE)}>
                    {r.per !== null ? (
                      <span className="flex items-center gap-3">
                        <Bar value={r.per} max={max} rankbox={r.rankbox} still={still} />
                        <span
                          className={cn(
                            "w-14 shrink-0 text-[0.9rem]",
                            r.rankbox ? "font-semibold text-brand-blue" : "text-ink",
                          )}
                        >
                          {formatUsd(r.per)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[0.85rem] text-muted-foreground">Not per article</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>

      <Band inner="px-6 py-4 sm:px-8">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <CalendarCheck aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" />
          <span>
            {c.name} list prices from their public pricing page, checked on{" "}
            {formatCheckedOn(c.pricing.checkedOn)}, billed monthly; annual billing and promotions
            may lower them. Prices change, so check theirs before deciding.
            {c.pricing.ladderNote && <> {c.pricing.ladderNote}</>}
          </span>
        </p>
      </Band>
    </section>
  );
}
