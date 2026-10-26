/**
 * "Same autopilot idea. Very different arithmetic." The section the page is
 * built around: the climb up SEObot's credit ladder (climb.tsx), Rankbox's
 * four numbers in a hairline row, then every SEObot plan as a table with
 * its cost per article worked out, so the picture can be checked line by
 * line. Picking the plan to compare against is where a comparison can cheat,
 * so the whole ladder is shown.
 */
import { ArrowUpRight, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/landing/shared";
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
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { PLAN, formatUsd } from "@/data/pricing";
import { RANKBOX_COST, formatCheckedOn, type Competitor } from "@/data/alternatives";
import { Climb } from "./climb";
import { rungsOf, splitSentence } from "./math";
import { RANKBOX_TINT } from "./tokens";

function PlanTable({ competitor }: { competitor: Competitor }) {
  const rungs = rungsOf(competitor);
  const unpriced = competitor.pricing.plans.filter((p) => p.monthly === null || !p.articles);
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[21rem] border-collapse text-left">
        <caption className="px-4 py-5 text-left sm:px-8">
          <span className="block text-[1.05rem] font-medium tracking-tight text-ink">
            Every {competitor.name} plan, priced per article
          </span>
          <span className="mt-0.5 block text-[0.82rem] text-muted-foreground">
            List prices a month, with Rankbox&rsquo;s one plan on top
          </span>
        </caption>
        <thead>
          <tr
            className={cn(
              "border-t text-[0.64rem] uppercase tracking-[0.08em] sm:text-[0.68rem]",
              LINE,
            )}
          >
            <th scope="col" className="py-3 pl-4 pr-2 font-semibold text-muted-foreground sm:pl-8">
              Plan
            </th>
            <th
              scope="col"
              className={cn(
                "border-l px-2.5 py-3 text-right sm:px-4 font-semibold text-muted-foreground",
                LINE,
              )}
            >
              Monthly
            </th>
            <th
              scope="col"
              className={cn(
                "border-l px-2.5 py-3 text-right sm:px-4 font-semibold text-muted-foreground",
                LINE,
              )}
            >
              Articles
            </th>
            <th
              scope="col"
              className={cn(
                "border-l py-3 pl-2.5 pr-4 text-right sm:pl-5 font-semibold text-muted-foreground sm:pr-8",
                LINE,
              )}
            >
              Per article
            </th>
          </tr>
        </thead>
        <tbody className="text-[0.84rem] tabular-nums sm:text-[0.9rem]">
          <tr className={cn("border-t", LINE, RANKBOX_TINT)}>
            <th scope="row" className="py-3.5 pl-4 pr-2 font-medium text-ink sm:pl-8">
              <span className="flex items-center gap-2.5">
                <RankboxMark className="h-6 w-6" />
                Rankbox {PLAN.name}
              </span>
            </th>
            <td
              className={cn("border-l px-2.5 py-3.5 text-right sm:px-4 font-medium text-ink", LINE)}
            >
              {formatUsd(PLAN.monthly)}
            </td>
            <td className={cn("border-l px-2.5 py-3.5 text-right sm:px-4 text-ink", LINE)}>
              {PLAN.articlesPerMonth}
            </td>
            <td
              className={cn(
                "border-l py-3.5 pl-2.5 pr-4 text-right sm:pl-5 font-semibold text-cta sm:pr-8",
                LINE,
              )}
            >
              {formatUsd(RANKBOX_COST.perArticle)}
            </td>
          </tr>
          {rungs.map((r) => {
            const compared = r.name === competitor.pricing.plan;
            return (
              <tr key={r.name} className={cn("border-t", LINE)}>
                <th scope="row" className="py-3.5 pl-4 pr-2 font-normal text-ink sm:pl-8">
                  <span className="flex items-start gap-2.5">
                    <CompetitorMark
                      competitor={competitor}
                      className="mt-0.5 h-6 w-6 text-[0.5rem]"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        {r.name}
                        {compared && (
                          <span className="rounded-md bg-cta-soft px-1.5 py-px text-[0.68rem] font-medium text-cta-hover">
                            Compared
                          </span>
                        )}
                      </span>
                      {compared && (
                        <span className="mt-0.5 block text-[0.75rem] text-muted-foreground">
                          {competitor.pricing.covers}
                        </span>
                      )}
                      {r.note && (
                        <span className="mt-0.5 block text-[0.75rem] text-muted-foreground">
                          {r.note}
                        </span>
                      )}
                    </span>
                  </span>
                </th>
                <td className={cn("border-l px-2.5 py-3.5 text-right sm:px-4 text-ink", LINE)}>
                  {formatUsd(r.monthly)}
                </td>
                <td
                  className={cn(
                    "border-l px-2.5 py-3.5 text-right sm:px-4 text-muted-foreground",
                    LINE,
                  )}
                >
                  {r.articles}
                </td>
                <td
                  className={cn(
                    "border-l py-3.5 pl-2.5 pr-4 text-right sm:pl-5 text-muted-foreground sm:pr-8",
                    LINE,
                  )}
                >
                  {formatUsd(r.each)}
                </td>
              </tr>
            );
          })}
          {unpriced.map((p) => (
            <tr key={p.name} className={cn("border-t", LINE)}>
              <th scope="row" className="py-3.5 pl-4 pr-2 font-normal text-ink sm:pl-8">
                {p.name}
                {p.note && (
                  <span className="mt-0.5 block text-[0.75rem] text-muted-foreground">
                    {p.note}
                  </span>
                )}
              </th>
              <td className={cn("border-l px-2.5 py-3.5 text-right sm:px-4 text-ink", LINE)}>
                {p.monthly === null ? "Custom" : formatUsd(p.monthly)}
              </td>
              <td
                className={cn(
                  "border-l px-2.5 py-3.5 text-right sm:px-4 text-muted-foreground",
                  LINE,
                )}
              >
                {p.articles ?? "—"}
              </td>
              <td
                className={cn(
                  "border-l py-3.5 pl-2.5 pr-4 text-right sm:pl-5 text-muted-foreground sm:pr-8",
                  LINE,
                )}
              >
                Not per article
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Arithmetic({ competitor }: { competitor: Competitor }) {
  const { lead, accent } = splitSentence(competitor.positioning.title);
  const pricingSource = competitor.sources.find((s) => /pricing/i.test(s.label));

  return (
    <section id="cost" aria-labelledby="cost-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Calculator}
        eyebrow="The arithmetic"
        title={
          <span id="cost-title">
            {lead} <Accent>{accent}</Accent>
          </span>
        }
        subtitle={competitor.positioning.body}
      />

      {/* The climb, on the grey panel. */}
      <Band inner={cn("overflow-hidden", PANEL)}>
        <div className="relative px-3 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-12 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(16,24,40,0.08)_1px,transparent_1.3px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_20%,transparent_80%)]"
          />
          <Reveal y={24} className="relative">
            <Climb competitor={competitor} />
          </Reveal>
        </div>
      </Band>

      {/* Rankbox's four numbers. */}
      <Band>
        <CellGrid className="grid-cols-2 lg:grid-cols-4">
          {competitor.specs.map((s, i) => (
            <li key={s.label} className={cn(CELL, "bg-white")}>
              <Reveal delay={i * 0.05} className="flex h-full flex-col px-5 py-7 sm:px-8 sm:py-8">
                <p className="font-display text-[1.6rem] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[1.9rem]">
                  {s.value}
                </p>
                <p className="mt-2.5 text-balance text-[0.82rem] leading-snug text-muted-foreground">
                  {s.label}
                </p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>

      <Band>
        <PlanTable competitor={competitor} />
      </Band>

      <Band inner="px-5 py-5 sm:px-8">
        <p className="max-w-4xl text-[0.8rem] leading-relaxed text-muted-foreground">
          {competitor.name} plans checked on {formatCheckedOn(competitor.pricing.checkedOn)}.{" "}
          {competitor.pricing.caveat}
          {competitor.pricing.ladderNote ? ` ${competitor.pricing.ladderNote}` : ""}{" "}
          {pricingSource && (
            <a
              href={pricingSource.url}
              target="_blank"
              rel="noopener nofollow"
              className="inline-flex items-center gap-0.5 font-medium text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
            >
              {pricingSource.label}
              <ArrowUpRight aria-hidden className="h-3 w-3" />
            </a>
          )}
        </p>
      </Band>
    </section>
  );
}
