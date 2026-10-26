/**
 * The body of /alternatives/byword, in the landing page's frame.
 *
 * The page is built around volume, because that is the whole difference:
 * Byword is a bulk engine sold in steps of articles a month, Rankbox is one
 * plan that writes for one site every day. So after the month strip the page
 * goes straight to the short answer, then the plan ladder (where a reader
 * finds their own volume), then the cases where Byword is the better buy —
 * before any feature rows — and only then the full matrix, the three places
 * the products part ways, switching, questions, and the sources.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
  Calculator,
  Check,
  FileSearch,
  HelpCircle,
  Layers,
  Plus,
  Quote,
  Rows3,
  Scale,
  Shuffle,
  Swords,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { ProductMark } from "@/components/compare/kit";
import { LEGAL_CONTACT } from "@/components/legal/legal-ui";
import { cn } from "@/lib/utils";
import { getFeature } from "@/data/features";
import { PLAN, formatUsd } from "@/data/pricing";
import { PRODUCTS, type ProductSlug } from "@/data/compare/products";
import { matchupTitle, matchupsFor } from "@/data/compare/matchups";
import {
  COMPETITORS,
  RANKBOX_COST,
  RANKBOX_SNAPSHOT,
  costPerArticle,
  formatCheckedOn,
  type CellState,
  type Competitor,
  type PricePlan,
} from "@/data/alternatives";
import { MonthStrip } from "./month-strip";
import { BattlegroundSample } from "./samples";
import {
  AccentTitle,
  Kicker,
  RANKBOX_TINT,
  STATE_LABEL,
  StateMark,
  displayUrl,
  findRow,
} from "./parts";

/* ---------- The difference: bulk or daily ---------- */

export function BulkOrDaily({ competitor }: { competitor: Competitor }) {
  const p = competitor.positioning;
  return (
    <section aria-labelledby="difference-title">
      <Spacer />
      <SectionHead
        icon={Shuffle}
        eyebrow="The real difference"
        title={
          <span id="difference-title">
            <AccentTitle text={p.title} />
          </span>
        }
        subtitle={p.body}
      />
      <Band inner={cn("px-3 py-10 sm:px-8 sm:py-14 lg:px-12", PANEL)}>
        <Reveal y={24}>
          <MonthStrip competitor={competitor} />
        </Reveal>
      </Band>
      <Band>
        <div className="grid lg:grid-cols-2">
          <Reveal className={cn("border-b p-6 sm:p-10 lg:border-b-0 lg:border-r", LINE)}>
            <div className="flex items-center gap-3">
              <CompetitorMark competitor={competitor} className="h-10 w-10" />
              <div className="min-w-0">
                <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                  {p.themTitle}
                </h3>
                <p className="text-[0.8rem] text-muted-foreground">{competitor.category}</p>
              </div>
            </div>
            <DiffList items={p.them} />
          </Reveal>
          <Reveal delay={0.06} className={cn("p-6 sm:p-10", RANKBOX_TINT)}>
            <div className="flex items-center gap-3">
              <RankboxMark className="h-10 w-10" />
              <div className="min-w-0">
                <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                  {p.rankboxTitle}
                </h3>
                <p className="text-[0.8rem] text-muted-foreground">
                  {p.rankboxTag ?? RANKBOX_SNAPSHOT.bestFor}
                </p>
              </div>
            </div>
            <DiffList items={p.rankbox} rankbox />
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

function DiffList({ items, rankbox = false }: { items: string[]; rankbox?: boolean }) {
  return (
    <ol
      className={cn(
        "mt-6 divide-y border-t",
        rankbox ? "divide-cta/10 border-cta/10" : "divide-ink/[0.07] border-ink/[0.07]",
      )}
    >
      {items.map((item, i) => (
        <li key={item} className="flex gap-4 py-3.5 text-[0.92rem] leading-snug text-ink">
          <span
            className={cn(
              "w-5 shrink-0 pt-px text-[0.72rem] font-medium tabular-nums",
              rankbox ? "text-cta" : "text-muted-foreground",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          {item}
        </li>
      ))}
    </ol>
  );
}

/* ---------- The short answer ---------- */

/* The quotable paragraph, set large in a band of its own, then each
   product's job in a line, then the four numbers that back it. */
export function ShortAnswer({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="short-answer-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Quote} className="w-fit">
              Rankbox vs {competitor.name}
            </Pill>
            <h2
              id="short-answer-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
            >
              The <Accent>short answer</Accent>
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <p className="text-pretty text-[1.05rem] leading-[1.7] text-ink sm:text-[1.18rem]">
              {competitor.shortAnswer}
            </p>
          </Reveal>
        </div>
      </Band>
      <Band>
        <div className="grid sm:grid-cols-2">
          <div className={cn("flex gap-3.5 border-b p-6 sm:border-b-0 sm:border-r sm:p-8", LINE)}>
            <CompetitorMark competitor={competitor} className="h-9 w-9" />
            <div>
              <Kicker>{competitor.name}</Kicker>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-ink">
                {competitor.verdict.them}
              </p>
            </div>
          </div>
          <div className={cn("flex gap-3.5 p-6 sm:p-8", RANKBOX_TINT)}>
            <RankboxMark className="h-9 w-9" />
            <div>
              <Kicker className="text-cta">Rankbox</Kicker>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-ink">
                {competitor.verdict.rankbox}
              </p>
            </div>
          </div>
        </div>
      </Band>
      <Band>
        <CellGrid className="grid-cols-2 lg:grid-cols-4">
          {competitor.specs.map((s, i) => (
            <li key={s.label} className={CELL}>
              <Reveal
                delay={i * 0.05}
                className="flex h-full flex-col-reverse justify-end p-6 sm:p-8"
              >
                <p className="mt-2 text-[0.85rem] leading-snug text-muted-foreground">{s.label}</p>
                <p className="font-display text-[1.7rem] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[2.1rem]">
                  {s.value}
                </p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Cost: the plan ladder ---------- */

function perArticle(p: PricePlan): number | null {
  return p.monthly !== null && p.articles ? Math.round((p.monthly / p.articles) * 100) / 100 : null;
}

/* Every plan Byword sells, with Rankbox's one plan on top, so a reader can
   find their own volume rather than trust the plan we picked. The bars are
   cost per article, drawn to one scale. */
export function CostLadder({ competitor }: { competitor: Competitor }) {
  const reduce = useReducedMotion();
  const plans = competitor.pricing.plans;
  const each = plans.map(perArticle);
  const max = Math.max(RANKBOX_COST.perArticle, ...each.filter((n): n is number => n !== null));
  const theirs = costPerArticle(competitor);
  const thirty = findRow(competitor, "Price for 30 articles");
  const checked = formatCheckedOn(competitor.pricing.checkedOn);

  const bar = (value: number, i: number, rankbox: boolean) => (
    <span className="mt-1.5 block h-1.5 w-full max-w-[12rem] overflow-hidden rounded-full bg-ink/[0.05]">
      <motion.span
        className={cn("block h-full rounded-full", rankbox ? "bg-cta" : "bg-ink/25")}
        initial={reduce ? false : { width: 0 }}
        whileInView={{ width: `${(value / max) * 100}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={reduce ? { width: `${(value / max) * 100}%` } : undefined}
      />
    </span>
  );

  return (
    <section id="cost" aria-labelledby="cost-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Calculator}
        eyebrow="What it costs"
        title={
          <span id="cost-title">
            Every {competitor.name} plan, <Accent>beside Rankbox&rsquo;s one</Accent>
          </span>
        }
        subtitle={`List prices from ${competitor.name}'s pricing page, checked ${checked}. Cost per article is worked out only where a plan is sold by the article.`}
      />

      <Band>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <caption className="sr-only">
              Monthly list price, articles a month and cost per article: Rankbox {PLAN.name} and
              every {competitor.name} plan
            </caption>
            <thead>
              <tr className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-white px-6 py-3.5 font-semibold sm:px-8"
                >
                  Plan
                </th>
                <th
                  scope="col"
                  className={cn("border-l px-5 py-3.5 text-right font-semibold", LINE)}
                >
                  A month
                </th>
                <th
                  scope="col"
                  className={cn("border-l px-5 py-3.5 text-right font-semibold", LINE)}
                >
                  Articles
                </th>
                <th scope="col" className={cn("border-l px-5 py-3.5 font-semibold sm:px-8", LINE)}>
                  Per article
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              <tr className={cn("border-t", LINE, RANKBOX_TINT)}>
                <th
                  scope="row"
                  className={cn("sticky left-0 z-10 px-6 py-4 sm:px-8", RANKBOX_TINT)}
                >
                  <span className="flex items-center gap-3">
                    <RankboxMark className="h-7 w-7" />
                    <span>
                      <span className="block text-[0.92rem] font-semibold text-cta">
                        Rankbox {PLAN.name}
                      </span>
                      <span className="block text-[0.75rem] font-normal text-muted-foreground">
                        {PLAN.sites} site · one flat plan
                      </span>
                    </span>
                  </span>
                </th>
                <td
                  className={cn(
                    "border-l px-5 py-4 text-right text-[0.95rem] font-semibold text-ink",
                    LINE,
                  )}
                >
                  {formatUsd(PLAN.monthly)}
                </td>
                <td className={cn("border-l px-5 py-4 text-right text-[0.95rem] text-ink", LINE)}>
                  {PLAN.articlesPerMonth}
                </td>
                <td className={cn("border-l px-5 py-4 sm:px-8", LINE)}>
                  <span className="text-[0.95rem] font-semibold text-cta">
                    {formatUsd(RANKBOX_COST.perArticle)}
                  </span>
                  {bar(RANKBOX_COST.perArticle, 0, true)}
                </td>
              </tr>
              {plans.map((p, i) => {
                const value = each[i];
                const compared = p.name === competitor.pricing.plan;
                return (
                  <tr key={p.name} className={cn("border-t", LINE)}>
                    <th scope="row" className="sticky left-0 z-10 bg-white px-6 py-4 sm:px-8">
                      <span className="flex items-center gap-3">
                        <CompetitorMark competitor={competitor} className="h-7 w-7 text-[0.6rem]" />
                        <span>
                          <span className="flex items-center gap-2 text-[0.92rem] font-medium text-ink">
                            {p.name}
                            {compared && (
                              <span className="rounded-md border border-ink/[0.1] bg-white px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                                Compared
                              </span>
                            )}
                          </span>
                          {p.note && (
                            <span className="block text-[0.75rem] font-normal text-muted-foreground">
                              {p.note}
                            </span>
                          )}
                        </span>
                      </span>
                    </th>
                    <td
                      className={cn("border-l px-5 py-4 text-right text-[0.95rem] text-ink", LINE)}
                    >
                      {p.monthly === null ? "Custom" : formatUsd(p.monthly)}
                    </td>
                    <td
                      className={cn(
                        "border-l px-5 py-4 text-right text-[0.95rem] text-muted-foreground",
                        LINE,
                      )}
                    >
                      {p.articles ?? "—"}
                    </td>
                    <td className={cn("border-l px-5 py-4 sm:px-8", LINE)}>
                      {value !== null ? (
                        <>
                          <span className="text-[0.95rem] text-ink">{formatUsd(value)}</span>
                          {bar(value, i + 1, false)}
                        </>
                      ) : (
                        <span className="text-[0.85rem] text-muted-foreground">
                          Not per article
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Band>

      {/* The same thirty articles, priced on each side. */}
      <Band>
        <div className="grid md:grid-cols-2">
          <div className={cn("border-b p-6 sm:p-10 md:border-b-0 md:border-r", LINE)}>
            <div className="flex items-center gap-2.5">
              <CompetitorMark competitor={competitor} className="h-7 w-7 text-[0.6rem]" />
              <p className="text-[0.9rem] font-semibold text-ink">
                {competitor.name}{" "}
                <span className="font-normal text-muted-foreground">
                  · {competitor.pricing.plan}
                </span>
              </p>
            </div>
            <p className="mt-5 font-display text-[2.6rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
              {formatUsd(competitor.pricing.monthly)}
              <span className="ml-1.5 font-sans text-base font-normal tracking-normal text-muted-foreground">
                /month
              </span>
            </p>
            <p className="mt-2 text-[0.85rem] text-muted-foreground">{competitor.pricing.covers}</p>
            {theirs !== null && (
              <p className="mt-4 text-[0.85rem] text-ink">
                <span className="font-semibold tabular-nums">{formatUsd(theirs)}</span>{" "}
                <span className="text-muted-foreground">per article</span>
              </p>
            )}
            {thirty && (
              <div className="mt-5 rounded-lg border border-ink/[0.08] bg-white p-4">
                <Kicker>{thirty.label}</Kicker>
                <p className="mt-1.5 flex gap-2.5 text-[0.88rem] leading-snug text-ink">
                  <StateMark state={thirty.them.state} />
                  {thirty.them.note}
                </p>
              </div>
            )}
            <p className="mt-5 text-[0.85rem] leading-relaxed text-muted-foreground">
              {competitor.pricing.caveat}
            </p>
          </div>

          <div className={cn("p-6 sm:p-10", RANKBOX_TINT)}>
            <div className="flex items-center gap-2.5">
              <RankboxMark className="h-7 w-7" />
              <p className="text-[0.9rem] font-semibold text-ink">
                Rankbox <span className="font-normal text-muted-foreground">· {PLAN.name}</span>
              </p>
            </div>
            <p className="mt-5 font-display text-[2.6rem] font-medium leading-none tracking-[-0.04em] text-cta tabular-nums">
              {formatUsd(PLAN.monthly)}
              <span className="ml-1.5 font-sans text-base font-normal tracking-normal text-muted-foreground">
                /month
              </span>
            </p>
            <p className="mt-2 text-[0.85rem] text-muted-foreground">
              {PLAN.articlesPerMonth} articles a month for {PLAN.sites} site
            </p>
            <p className="mt-4 text-[0.85rem] text-ink">
              <span className="font-semibold tabular-nums">
                {formatUsd(RANKBOX_COST.perArticle)}
              </span>{" "}
              <span className="text-muted-foreground">per article</span>
            </p>
            {thirty && (
              <div className="mt-5 rounded-lg border border-cta/20 bg-white p-4">
                <Kicker className="text-cta">{thirty.label}</Kicker>
                <p className="mt-1.5 flex gap-2.5 text-[0.88rem] leading-snug text-ink">
                  <StateMark state={thirty.rankbox.state} rankbox />
                  {thirty.rankbox.note}
                </p>
              </div>
            )}
          </div>
        </div>
      </Band>
      <Band inner="px-6 py-4 text-center">
        <p className="mx-auto max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {competitor.name} list prices from their public pricing page on {checked}, compared on the
          plan closest in scope to Rankbox&rsquo;s; annual billing and promotions may lower them.
          Check their pricing page before deciding.
          {competitor.pricing.ladderNote && ` ${competitor.pricing.ladderNote}`}
        </p>
      </Band>
    </section>
  );
}

/* ---------- When Byword is the better buy ---------- */

/* Set before the feature rows on purpose: on this comparison volume decides
   most shortlists, so a reader who needs Byword's scale should find out
   here, not at the bottom. */
export function BetterWhen({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="better-when-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-[calc(var(--top-chrome)+2.5rem)]">
              <Pill icon={Scale} className="w-fit">
                When {competitor.name} wins
              </Pill>
              <h2
                id="better-when-title"
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
              >
                When {competitor.name} is <Accent>the better choice</Accent>
              </h2>
              <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
                If one of these describes you, choose {competitor.name}.
              </p>
              <a
                href={`https://${competitor.domain}`}
                target="_blank"
                rel="noopener nofollow"
                className={cn(GHOST_BUTTON, "mt-6")}
              >
                Visit {competitor.domain}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </Reveal>
          <ol className={cn("divide-y", "divide-ink/[0.07]")}>
            {competitor.betterWhen.map((w, i) => (
              <li key={w.title}>
                <Reveal delay={i * 0.05} className="flex gap-5 px-6 py-8 sm:px-10 lg:px-12">
                  <span className="font-display text-[2rem] font-medium leading-none tracking-[-0.04em] text-ink/15 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[1.08rem] font-semibold tracking-tight text-ink">
                      {w.title}
                    </h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">
                      {w.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The matrix ---------- */

const LEGEND: CellState[] = ["yes", "partial", "no"];

/* One table, two shapes: a three-column hairline table on desktop; on a
   phone each row becomes its label over the two cells side by side, with
   the product header pinned under the navbar. Explicit roles keep the table
   semantics when the phone layout changes the display types. */
export function Matrix({ competitor }: { competitor: Competitor }) {
  const rowCount = competitor.matrix.reduce((n, g) => n + g.rows.length, 0);
  const checked = formatCheckedOn(competitor.pricing.checkedOn);
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Rows3}
        eyebrow="Side by side"
        title={
          <span id="compare-title">
            Rankbox vs {competitor.name}, <Accent>in {rowCount} rows</Accent>
          </span>
        }
        subtitle={`Grouped the way the work runs, from deciding what to write to the plan you pay for. ${competitor.name}'s cells come from its own pages; Rankbox's describe what ships today.`}
      >
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LEGEND.map((s) => (
            <li key={s} className="flex items-center gap-2 text-[0.78rem] text-muted-foreground">
              <span aria-hidden>
                <StateMark state={s} rankbox />
              </span>
              {STATE_LABEL[s]}
            </li>
          ))}
        </ul>
      </SectionHead>

      <Band>
        <table role="table" className="block w-full border-collapse text-left lg:table">
          <caption className="sr-only">
            Rankbox and {competitor.name} compared in {rowCount} rows, checked {checked}
          </caption>
          <thead
            role="rowgroup"
            className="sticky top-[var(--top-chrome)] z-20 block border-b border-ink/[0.07] bg-white/95 backdrop-blur-md lg:table-header-group"
          >
            <tr role="row" className="grid grid-cols-2 lg:table-row">
              <th
                role="columnheader"
                scope="col"
                className="sr-only px-6 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:not-sr-only lg:table-cell lg:w-[30%] lg:px-8"
              >
                Capability
              </th>
              <th
                role="columnheader"
                scope="col"
                className={cn(
                  "block px-4 py-3 lg:table-cell lg:border-l lg:px-6 lg:py-4",
                  LINE,
                  RANKBOX_TINT,
                )}
              >
                <span className="flex items-center gap-2.5 text-[0.88rem] font-semibold text-cta">
                  <RankboxMark className="h-7 w-7" />
                  Rankbox
                </span>
              </th>
              <th
                role="columnheader"
                scope="col"
                className={cn("block border-l px-4 py-3 lg:table-cell lg:px-6 lg:py-4", LINE)}
              >
                <span className="flex items-center gap-2.5 text-[0.88rem] font-semibold text-ink">
                  <CompetitorMark competitor={competitor} className="h-7 w-7" />
                  {competitor.name}
                </span>
              </th>
            </tr>
          </thead>
          {competitor.matrix.map((g) => {
            const Icon = g.icon;
            return (
              <tbody key={g.group} role="rowgroup" className="block lg:table-row-group">
                <tr role="row" className="block lg:table-row">
                  <th
                    role="columnheader"
                    scope="colgroup"
                    colSpan={3}
                    className={cn("block border-t px-5 py-2.5 lg:table-cell lg:px-8", LINE, PANEL)}
                  >
                    <span className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink">
                      <Icon className="h-3.5 w-3.5 text-brand-blue" aria-hidden />
                      {g.group}
                    </span>
                  </th>
                </tr>
                {g.rows.map((r) => (
                  <tr
                    key={r.label}
                    role="row"
                    className={cn("grid grid-cols-2 border-t lg:table-row", LINE)}
                  >
                    <th
                      role="rowheader"
                      scope="row"
                      className="col-span-2 block px-5 pb-1 pt-4 align-top font-normal lg:table-cell lg:px-8 lg:py-5"
                    >
                      <span className="block text-[0.92rem] font-semibold text-ink">{r.label}</span>
                      <span className="mt-1 block text-[0.78rem] leading-snug text-muted-foreground">
                        {r.detail}
                      </span>
                    </th>
                    <td
                      role="cell"
                      className={cn(
                        "block px-4 pb-4 pt-3 align-top lg:table-cell lg:border-l lg:px-6 lg:py-5",
                        LINE,
                        RANKBOX_TINT,
                      )}
                    >
                      <MatrixCell state={r.rankbox.state} note={r.rankbox.note} rankbox />
                    </td>
                    <td
                      role="cell"
                      className={cn(
                        "block border-l px-4 pb-4 pt-3 align-top lg:table-cell lg:px-6 lg:py-5",
                        LINE,
                      )}
                    >
                      <MatrixCell state={r.them.state} note={r.them.note} />
                    </td>
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      </Band>
      <Band inner="px-6 py-4 text-center">
        <p className="mx-auto max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Compiled from {competitor.name}&rsquo;s public documentation and pricing pages, last
          reviewed {checked}. Products change; check theirs before you decide, and{" "}
          <a
            href="#sources"
            className="underline decoration-ink/20 underline-offset-2 hover:text-ink"
          >
            tell us if a row is wrong
          </a>
          .
        </p>
      </Band>
    </section>
  );
}

function MatrixCell({
  state,
  note,
  rankbox = false,
}: {
  state: CellState;
  note: string;
  rankbox?: boolean;
}) {
  return (
    <span className="flex gap-2.5">
      <StateMark state={state} rankbox={rankbox} className="mt-px" />
      <span
        className={cn(
          "text-[0.82rem] leading-snug",
          state === "no" ? "text-muted-foreground" : "text-ink/85",
        )}
      >
        {note}
      </span>
    </span>
  );
}

/* ---------- Where they part ways ---------- */

export function Battlegrounds({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="battlegrounds-title">
      <Spacer />
      <SectionHead
        icon={Swords}
        eyebrow="Where it's decided"
        title={
          <span id="battlegrounds-title">
            <AccentTitle
              text={
                competitor.battlegroundsTitle ??
                `Three things Rankbox does that ${competitor.name} doesn't set out to`
              }
            />
          </span>
        }
        subtitle={competitor.battlegroundsIntro}
      />
      {competitor.battlegrounds.map((b, i) => {
        const feature = getFeature(b.featureSlug);
        const Icon = b.icon;
        const flip = i % 2 === 1;
        return (
          <Band key={b.title}>
            <article className="grid lg:grid-cols-2">
              <Reveal
                className={cn(
                  "border-b p-6 sm:p-10 lg:border-b-0 lg:p-12",
                  flip ? "lg:order-2" : "lg:border-r",
                  LINE,
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta-soft text-cta">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-ink">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(competitor.battlegrounds.length).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.7rem]">
                  {b.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {b.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[0.9rem] leading-snug text-ink">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                {feature && (
                  <Link
                    to="/features/$slug"
                    params={{ slug: feature.slug }}
                    className={cn(GHOST_BUTTON, "group mt-7")}
                  >
                    How {feature.name} works
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </Reveal>
              <div
                className={cn(
                  "flex items-center justify-center px-5 py-10 sm:px-10 sm:py-14",
                  flip && "lg:order-1 lg:border-r",
                  LINE,
                  PANEL,
                )}
              >
                <Reveal delay={0.08} y={24} className="flex w-full justify-center">
                  <BattlegroundSample featureSlug={b.featureSlug} />
                </Reveal>
              </div>
            </article>
          </Band>
        );
      })}
    </section>
  );
}

/* ---------- Switching ---------- */

export function Switching({ competitor }: { competitor: Competitor }) {
  const m = competitor.migration;
  return (
    <section aria-labelledby="switching-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={ArrowRightLeft} className="w-fit">
              Switching
            </Pill>
            <h2
              id="switching-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
            >
              <AccentTitle text={m.title} />
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
              {m.body}
            </p>
          </Reveal>
          <ol className="px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            {m.steps.map((s, i) => {
              const last = i === m.steps.length - 1;
              return (
                <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
                  {!last && (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-[1.1rem] top-10 w-px bg-[linear-gradient(to_bottom,var(--color-cta)_50%,transparent_50%)] bg-[length:1px_8px] opacity-40"
                    />
                  )}
                  <Reveal delay={i * 0.07} className="flex gap-5">
                    <span
                      className={cn(
                        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[0.85rem] font-semibold tabular-nums",
                        i === 0 ? "bg-cta text-white" : "border border-cta/25 bg-cta-soft text-cta",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-[1.02rem] font-semibold tracking-tight text-ink">
                        {s.title}
                      </h3>
                      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Answers are force-mounted, so every one is in the server HTML the route's
   FAQPage schema is written from. */
export function BywordFAQ({ competitor }: { competitor: Competitor }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2
              id="faq-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
            >
              Rankbox vs {competitor.name}, <Accent>answered</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              The questions people ask before switching from {competitor.name}.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {competitor.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-sm leading-relaxed text-muted-foreground"
                  >
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Sources ---------- */

/* The paper trail: the competitor's own pages every fact came from, the date
   they were read, and where to report a stale row. */
export function Sources({ competitor }: { competitor: Competitor }) {
  const checked = formatCheckedOn(competitor.pricing.checkedOn);
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal
            className={cn(
              "min-w-0 border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={FileSearch} className="w-fit">
              Sources
            </Pill>
            <h2
              id="sources-title"
              className="mt-5 font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            >
              How this comparison <Accent>was checked</Accent>
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Every {competitor.name} fact on this page comes from {competitor.name}&rsquo;s own
              public pages, read on {checked}. Anything that could not be confirmed there is left
              out. Rankbox facts describe what ships today, not what is planned.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Spotted something out of date?{" "}
              <a
                href={`mailto:${LEGAL_CONTACT}?subject=${encodeURIComponent(`Correction: Rankbox vs ${competitor.name}`)}`}
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
              >
                Email {LEGAL_CONTACT}
              </a>{" "}
              and the row gets fixed.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="min-w-0">
            <ol className="divide-y divide-ink/[0.07]">
              {competitor.sources.map((src, i) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener nofollow"
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-10 lg:px-12"
                  >
                    <span className="w-5 shrink-0 text-[0.72rem] font-medium tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.92rem] font-medium text-ink">{src.label}</span>
                      <span className="block truncate text-[0.75rem] text-muted-foreground">
                        {displayUrl(src.url)}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Other comparisons ---------- */

function isProduct(slug: string): slug is ProductSlug {
  return slug in PRODUCTS;
}

export function OtherComparisons({ competitor }: { competitor: Competitor }) {
  const others = COMPETITORS.filter((c) => c.slug !== competitor.slug);
  const headToHeads = isProduct(competitor.slug) ? matchupsFor(competitor.slug) : [];
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-10 sm:px-10 lg:px-12">
        <div>
          <Pill icon={Layers}>More comparisons</Pill>
          <h2
            id="others-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Comparing <Accent>something else?</Accent>
          </h2>
        </div>
        <Link to="/alternatives" className={GHOST_BUTTON}>
          Every alternative
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {others.map((c) => (
            <li key={c.slug} className={CELL}>
              <Link
                to="/alternatives/$slug"
                params={{ slug: c.slug }}
                className="group flex h-full items-center gap-3.5 p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-6"
              >
                <CompetitorMark competitor={c} className="h-9 w-9" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9rem] font-semibold text-ink">
                    Rankbox vs {c.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.75rem] text-muted-foreground">
                    {c.category}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                />
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
      {headToHeads.length > 0 && (
        <Band>
          <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-10 lg:px-12">
            <Kicker>{competitor.name} head to head</Kicker>
            <ul className="flex flex-wrap gap-2.5">
              {headToHeads.map((m) => (
                <li key={m.slug}>
                  <Link
                    to="/compare/$slug"
                    params={{ slug: m.slug }}
                    className={cn(GHOST_BUTTON, "group py-1.5 pl-1.5")}
                  >
                    <span className="flex -space-x-1.5">
                      <ProductMark product={PRODUCTS[m.a]} className="h-5 w-5 ring-2 ring-white" />
                      <ProductMark product={PRODUCTS[m.b]} className="h-5 w-5 ring-2 ring-white" />
                    </span>
                    {matchupTitle(m)}
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-brand-blue" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Band>
      )}
    </section>
  );
}

/* ---------- Closing CTA ---------- */

/* The blue band, with the month strip's motif at its foot: thirty days, one
   square each. */
export function ClosingCTA({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div className="relative px-5 pb-12 pt-16 text-center sm:px-8 sm:pb-14 sm:pt-20">
          <Reveal>
            <h2
              id="cta-title"
              className="mx-auto max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              {competitor.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {competitor.ctaBody}
            </p>
            <div className="mx-auto mt-8 flex max-w-xl justify-center">
              <UrlForm url={url} onChange={setUrl} />
            </div>
            <p className="mt-3.5 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>

          <div aria-hidden className="mx-auto mt-12 max-w-3xl">
            <div className="grid grid-cols-15 gap-1 sm:grid-cols-30 sm:gap-1.5">
              {Array.from({ length: PLAN.articlesPerMonth }, (_, i) => (
                <motion.span
                  key={i}
                  className="aspect-square rounded-[4px] bg-white"
                  initial={reduce ? false : { opacity: 0.18 }}
                  whileInView={{ opacity: 0.9 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.045 }}
                  style={reduce ? { opacity: 0.9 } : undefined}
                />
              ))}
            </div>
            <p className="mt-3 flex justify-between text-[0.72rem] font-medium text-white">
              <span>Day 1</span>
              <span>
                {PLAN.articlesPerMonth} articles · {formatUsd(PLAN.monthly)} a month
              </span>
              <span>Day {PLAN.articlesPerMonth}</span>
            </p>
          </div>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
