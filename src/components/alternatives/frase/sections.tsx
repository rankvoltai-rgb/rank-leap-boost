/**
 * The remaining sections of /alternatives/frase, in the landing page's frame.
 * Every visitor-facing sentence is read from the competitor entry (or from
 * Rankbox's shared cells); these components only decide how it is set.
 */
import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BookCheck,
  Check,
  Globe,
  HelpCircle,
  Plus,
  Quote,
  Rows3,
  Scale,
  Split,
  Waypoints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
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
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import {
  COMPETITORS,
  KIND_LABEL,
  RANKBOX_SNAPSHOT,
  formatCheckedOn,
  formatCheckedOnShort,
  type Cell,
  type Competitor,
  type CompetitorKind,
  type Fact,
  type MatrixRow,
} from "@/data/alternatives";
import { PLAN, formatUsd } from "@/data/pricing";
import { getFeature } from "@/data/features";
import { COMPANY } from "@/data/company";
import { PRODUCTS, type ProductSlug } from "@/data/compare/products";
import { getCategory, matchupTitle, matchupsFor } from "@/data/compare/matchups";
import { ProductMark } from "@/components/compare/kit";
import { CompetitorMark, RankboxMark, VsLockup } from "../kit";
import { OFF_PATH, ON_PATH, ROW_FOR_FEATURE, VIEW, findRow } from "./model";
import { ArticlesSample, BacklinkSample, RedditSample } from "./samples";
import { CARD, displayUrl, withAccent } from "./helpers";
import { StateLegend, StateMark, TextBar } from "./ui";

/* ---------- The short answer, beside the facts at a glance ---------- */

type GlanceCell = string | Fact;

function glanceRows(c: Competitor): { label: string; rankbox: GlanceCell; them: GlanceCell }[] {
  return [
    { label: "Best for", rankbox: RANKBOX_SNAPSHOT.bestFor, them: c.snapshot.bestFor },
    {
      label: "Price",
      rankbox: `${formatUsd(PLAN.monthly)}/mo`,
      them: `${formatUsd(c.pricing.monthly)}/mo · ${c.pricing.plan}`,
    },
    {
      label: "Articles",
      rankbox: `${PLAN.articlesPerMonth} a month`,
      them: c.pricing.articles ? `${c.pricing.articles} a month` : "Not sold per article",
    },
    { label: "Publishing", rankbox: RANKBOX_SNAPSHOT.publishing, them: c.snapshot.publishing },
    { label: "Backlinks", rankbox: RANKBOX_SNAPSHOT.backlinks, them: c.snapshot.backlinks },
    {
      label: "AI visibility",
      rankbox: RANKBOX_SNAPSHOT.aiVisibility,
      them: c.snapshot.aiVisibility,
    },
    { label: "Keyword data", rankbox: RANKBOX_SNAPSHOT.keywordData, them: c.snapshot.keywordData },
  ];
}

function GlanceValue({ value, strong }: { value: GlanceCell; strong?: boolean }) {
  if (typeof value === "string") {
    return <span className={cn(strong ? "font-medium text-ink" : "text-ink/80")}>{value}</span>;
  }
  return (
    <span className="flex items-start gap-2">
      <StateMark state={value.state} className="mt-px h-4 w-4 [&_svg]:h-2.5 [&_svg]:w-2.5" />
      <span className={cn(strong ? "font-medium text-ink" : "text-ink/80")}>{value.short}</span>
    </span>
  );
}

export function ShortAnswer({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section aria-labelledby="short-answer-title">
      <Band>
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <Reveal
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Quote}>Rankbox vs {c.name}</Pill>
            <h2
              id="short-answer-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
            >
              The <Accent>short answer</Accent>
            </h2>
            <p className="mt-6 text-[1.06rem] leading-[1.75] text-ink sm:text-[1.14rem]">
              {c.shortAnswer}
            </p>
          </Reveal>

          <Reveal delay={0.06} className={cn("px-4 py-8 sm:px-8 lg:px-10 lg:py-14", PANEL)}>
            <div className={cn(CARD, "overflow-hidden")}>
              <div
                className={cn(
                  "flex items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-5",
                  LINE,
                )}
              >
                <p className="text-[0.9rem] font-semibold text-ink">At a glance</p>
                <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.64rem] font-semibold text-cta">
                  Checked {formatCheckedOnShort(c.pricing.checkedOn)}
                </span>
              </div>
              <table className="w-full table-fixed text-left text-[0.8rem] leading-snug">
                <caption className="sr-only">Rankbox and {c.name} at a glance</caption>
                <colgroup>
                  <col className="w-[27%]" />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-3 sm:px-5">
                      <span className="sr-only">Fact</span>
                    </th>
                    <th
                      scope="col"
                      className="bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-3 py-3 text-[0.78rem] font-semibold text-ink"
                    >
                      <span className="flex items-center gap-2">
                        <RankboxMark className="h-5 w-5" />
                        Rankbox
                      </span>
                    </th>
                    <th scope="col" className="px-3 py-3 text-[0.78rem] font-semibold text-ink">
                      <span className="flex min-w-0 items-center gap-2">
                        <CompetitorMark competitor={c} className="h-5 w-5 text-[0.5rem]" />
                        <span className="truncate">{c.name}</span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {glanceRows(c).map((r) => (
                    <tr key={r.label} className={cn("border-t", LINE)}>
                      <th
                        scope="row"
                        className="px-4 py-3 align-top text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-5"
                      >
                        {r.label}
                      </th>
                      <td className="bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-3 py-3 align-top">
                        <GlanceValue value={r.rankbox} strong />
                      </td>
                      <td className="px-3 py-3 align-top">
                        <GlanceValue value={r.them} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p
                className={cn(
                  "border-t px-4 py-3 text-[0.72rem] leading-relaxed text-muted-foreground sm:px-5",
                  LINE,
                )}
              >
                {c.name} facts from their own pages; Rankbox facts are what ships today.{" "}
                <a
                  href="#compare"
                  className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                >
                  Every row
                </a>{" "}
                and{" "}
                <a
                  href="#sources"
                  className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                >
                  the sources
                </a>{" "}
                are below.
              </p>
            </div>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- When the competitor is the better buy ---------- */

export function BetterWhen({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section aria-labelledby="better-title">
      <SectionHead
        icon={Scale}
        eyebrow="The honest part"
        title={
          <span id="better-title">
            When {c.name} is <Accent>the better choice</Accent>
          </span>
        }
        subtitle={`The cases where ${c.name} is the better buy, from the same sourced facts as the rest of this page.`}
      />
      <Band>
        <CellGrid className="md:grid-cols-3">
          {c.betterWhen.map((w, i) => (
            <li key={w.title} className={cn(CELL, "p-6 sm:p-8")}>
              <Reveal delay={i * 0.06}>
                <div className="flex items-center justify-between">
                  <CompetitorMark competitor={c} className="h-9 w-9" />
                  <span className="text-[0.75rem] font-medium tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Choose {c.name} if
                </p>
                <h3 className="mt-1.5 text-[1.05rem] font-semibold leading-snug text-ink">
                  {w.title}
                </h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {w.body}
                </p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- The deep dives ---------- */

function RowPair({ row, competitor }: { row: MatrixRow; competitor: Competitor }) {
  const line = (mark: ReactNode, cell: Cell, tint?: boolean) => (
    <div
      className={cn("flex gap-3 px-4 py-3", tint && "bg-[color-mix(in_oklab,var(--cta)_4%,white)]")}
    >
      <span className="flex shrink-0 items-center gap-1.5">
        {mark}
        <StateMark state={cell.state} className="h-4 w-4 [&_svg]:h-2.5 [&_svg]:w-2.5" />
      </span>
      <p className="text-[0.82rem] leading-snug text-ink/80">{cell.note}</p>
    </div>
  );
  return (
    <div className={cn("mt-7 overflow-hidden rounded-xl border", LINE)}>
      <p
        className={cn(
          "border-b px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
          LINE,
        )}
      >
        In the comparison · {row.label}
      </p>
      {line(<RankboxMark className="h-5 w-5" />, row.rankbox, true)}
      <div className={cn("border-t", LINE)}>
        {line(
          <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.5rem]" />,
          row.them,
        )}
      </div>
    </div>
  );
}

function sampleFor(slug: string, competitor: Competitor): ReactNode {
  if (slug === "authority-backlinks") return <BacklinkSample />;
  if (slug === "reddit-presence") return <RedditSample />;
  if (slug === "citation-ready-writer") return <ArticlesSample competitor={competitor} />;
  return null;
}

export function Differences({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const title = c.battlegroundsTitle ?? `Where Rankbox and ${c.name} differ`;
  return (
    <section aria-labelledby="differ-title">
      <SectionHead
        icon={Split}
        eyebrow="Where Rankbox differs"
        title={<span id="differ-title">{withAccent(title, 2)}</span>}
        subtitle={c.battlegroundsIntro}
      />
      {c.battlegrounds.map((b, i) => {
        const feature = getFeature(b.featureSlug);
        const row = findRow(c, ROW_FOR_FEATURE[b.featureSlug]);
        const sample = sampleFor(b.featureSlug, c);
        const Icon = b.icon;
        const flip = i % 2 === 1;
        return (
          <Band key={b.title}>
            <div className="grid lg:grid-cols-2">
              <div
                className={cn(
                  "min-w-0 border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:px-12 lg:py-14",
                  flip ? "lg:order-2 lg:border-l" : "lg:border-r",
                  LINE,
                )}
              >
                <Reveal>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[0.75rem] font-medium tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(c.battlegrounds.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.75rem]">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-[0.96rem] leading-relaxed text-muted-foreground">
                    {b.body}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {b.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-[0.9rem] leading-snug text-ink">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {row && <RowPair row={row} competitor={c} />}
                  {feature && (
                    <Link
                      to="/features/$slug"
                      params={{ slug: feature.slug }}
                      className={cn(GHOST_BUTTON, "mt-7")}
                    >
                      How {feature.name} works
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </Reveal>
              </div>
              {sample && (
                <div
                  className={cn(
                    "flex min-w-0 items-center justify-center px-5 py-10 sm:px-10 lg:py-14",
                    PANEL,
                    flip && "lg:order-1",
                  )}
                >
                  <Reveal delay={0.08} y={24} className="flex w-full justify-center">
                    {sample}
                  </Reveal>
                </div>
              )}
            </div>
          </Band>
        );
      })}
    </section>
  );
}

/* ---------- Every row ---------- */

function CellText({ cell }: { cell: Cell }) {
  return (
    <div className="flex gap-2.5">
      <StateMark state={cell.state} className="mt-px" />
      <p
        className={cn(
          "text-[0.85rem] leading-snug",
          cell.state === "no" ? "text-muted-foreground" : "text-ink/80",
        )}
      >
        {cell.note}
      </p>
    </div>
  );
}

export function RowByRow({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-16">
      <SectionHead
        icon={Rows3}
        eyebrow="Row by row"
        title={
          <span id="compare-title">
            Rankbox and {c.name}, <Accent>row by row</Accent>
          </span>
        }
        subtitle={`Every capability compared, with what each one does. ${c.name} facts checked on ${formatCheckedOn(c.pricing.checkedOn)}; Rankbox facts are what ships today.`}
      />
      <Band inner="px-6 py-4 sm:px-8">
        <StateLegend
          className="justify-center"
          note={<span className="sm:hidden">· Swipe the table sideways</span>}
        />
      </Band>
      <Band>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">
              Rankbox compared with {c.name}, capability by capability
            </caption>
            <colgroup>
              <col className="w-[32%]" />
              <col className="w-[34%]" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-8"
                >
                  Capability
                </th>
                <th
                  scope="col"
                  className={cn(
                    "border-l bg-[color-mix(in_oklab,var(--cta)_6%,white)] px-5 py-4",
                    LINE,
                  )}
                >
                  <span className="flex items-center gap-2.5 text-[0.92rem] font-semibold text-cta">
                    <RankboxMark className="h-7 w-7" />
                    Rankbox
                  </span>
                </th>
                <th scope="col" className={cn("border-l px-5 py-4", LINE)}>
                  <span className="flex items-center gap-2.5 text-[0.92rem] font-semibold text-ink">
                    <CompetitorMark competitor={c} className="h-7 w-7" />
                    {c.name}
                  </span>
                </th>
              </tr>
            </thead>
            {c.matrix.map((g) => {
              const Icon = g.icon;
              return (
                <tbody key={g.group}>
                  <tr className={cn("border-t", LINE)}>
                    <th scope="colgroup" colSpan={3} className={cn("px-6 py-2.5 sm:px-8", PANEL)}>
                      <span className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink/70">
                        <Icon aria-hidden className="h-3.5 w-3.5 text-brand-blue" />
                        {g.group}
                      </span>
                    </th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.label} className={cn("border-t", LINE)}>
                      <th scope="row" className="px-6 py-4 align-top font-normal sm:px-8">
                        <span className="block text-[0.9rem] font-medium text-ink">{r.label}</span>
                        <span className="mt-1 block text-[0.78rem] leading-snug text-muted-foreground">
                          {r.detail}
                        </span>
                      </th>
                      <td
                        className={cn(
                          "border-l bg-[color-mix(in_oklab,var(--cta)_4%,white)] px-5 py-4 align-top",
                          LINE,
                        )}
                      >
                        <CellText cell={r.rankbox} />
                      </td>
                      <td className={cn("border-l px-5 py-4 align-top", LINE)}>
                        <CellText cell={r.them} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              );
            })}
          </table>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Running both ---------- */

/* A small picture per step: the URL going in, the plan being approved, the
   two products side by side. Shapes only, no invented copy. */
function StepPicture({ i, competitor }: { i: number; competitor: Competitor }) {
  if (i === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-3 py-2 text-[0.75rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        yoursite.com
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-md bg-cta text-white">
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    );
  }
  if (i === 1) {
    return (
      <div className="space-y-1.5">
        {[true, true, false].map((on, k) => (
          <div
            key={k}
            className="flex items-center gap-2.5 rounded-lg border border-ink/[0.07] bg-white px-3 py-2"
          >
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded",
                on ? "bg-cta text-white" : "border border-ink/20",
              )}
            >
              {on && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
            </span>
            <TextBar w={["80%", "64%", "72%"][k]} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 py-1">
      <RankboxMark className="h-9 w-9" />
      <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
      <CompetitorMark competitor={competitor} className="h-9 w-9" />
    </div>
  );
}

export function RunningBoth({ competitor }: { competitor: Competitor }) {
  const m = competitor.migration;
  return (
    <section aria-labelledby="both-title">
      <SectionHead
        icon={Waypoints}
        eyebrow="Switching"
        title={<span id="both-title">{withAccent(m.title, 2)}</span>}
        subtitle={m.body}
      />
      <Band>
        <div className="overflow-hidden">
          <ol className="-mb-px -mr-px grid md:grid-cols-3">
            {m.steps.map((s, i) => (
              <li key={s.title} className={cn(CELL, "relative p-6 sm:p-8")}>
                <Reveal delay={i * 0.07}>
                  <div aria-hidden className={cn("rounded-xl border p-3", LINE, PANEL)}>
                    <StepPicture i={i} competitor={competitor} />
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta-soft text-[0.8rem] font-semibold tabular-nums text-cta">
                      {i + 1}
                    </span>
                    <h3 className="text-[1rem] font-semibold text-ink">{s.title}</h3>
                  </div>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function FraseFAQ({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
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
              Rankbox vs {c.name}, <Accent>answered</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              The questions people ask before choosing between the two.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {c.faqs.map((f, i) => (
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

export function SourcesBand({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal
            className={cn(
              "min-w-0 border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={BookCheck}>Sources</Pill>
            <h2
              id="sources-title"
              className="mt-5 font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            >
              How this comparison <Accent>was checked</Accent>
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Every {c.name} fact on this page comes from {c.name}&rsquo;s own public pages, read on{" "}
              {formatCheckedOn(c.pricing.checkedOn)}. Anything we could not confirm there is left
              out. Rankbox facts describe what ships today, not what is planned.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Spotted something out of date?{" "}
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Correction: Rankbox vs ${c.name}`)}`}
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
              >
                Email {COMPANY.email}
              </a>{" "}
              and we will fix the row.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="min-w-0">
            <ol className="divide-y divide-ink/[0.07]">
              {c.sources.map((src, i) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener nofollow"
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_45%,white)] sm:px-10 lg:px-12"
                  >
                    <span className="w-5 shrink-0 text-[0.75rem] font-medium tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9rem] font-medium text-ink">{src.label}</span>
                      <span className="block truncate text-[0.75rem] text-muted-foreground">
                        {displayUrl(src.url)}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
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

const KIND_ORDER: CompetitorKind[] = ["autopilot", "writer", "optimizer", "visibility"];

const LINK_CELL =
  "group flex h-full flex-col gap-4 px-6 py-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-8";

function LinkArrow() {
  return (
    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
  );
}

/* One hairline grid: the same kind of tool first (the shortlist the visitor
   is most likely on), then the rest by kind, then the head-to-heads Frase
   appears in. Each cell names the kind it belongs to. */
export function KeepComparing({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const kinds = [c.kind, ...KIND_ORDER.filter((k) => k !== c.kind)];
  const others = kinds.flatMap((k) => COMPETITORS.filter((o) => o.slug !== c.slug && o.kind === k));
  const heads = c.slug in PRODUCTS ? matchupsFor(c.slug as ProductSlug) : [];

  return (
    <section aria-labelledby="others-title">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Pill icon={ArrowLeftRight}>Keep comparing</Pill>
            <h2
              id="others-title"
              className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
            >
              Comparing something <Accent>else?</Accent>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/alternatives" className={GHOST_BUTTON}>
              All alternatives
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/compare" className={GHOST_BUTTON}>
              Head-to-heads
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Band>

      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug} className={CELL}>
              <Link to="/alternatives/$slug" params={{ slug: o.slug }} className={LINK_CELL}>
                <span className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "text-[0.66rem] font-semibold uppercase tracking-[0.14em]",
                      o.kind === c.kind ? "text-cta" : "text-muted-foreground",
                    )}
                  >
                    {KIND_LABEL[o.kind]}
                  </span>
                  <LinkArrow />
                </span>
                <span className="flex items-center gap-3.5">
                  <CompetitorMark competitor={o} className="h-9 w-9" />
                  <span className="min-w-0">
                    <span className="block text-[0.92rem] font-semibold text-ink">
                      Rankbox vs {o.name}
                    </span>
                    <span className="block truncate text-[0.76rem] text-muted-foreground">
                      {o.category}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
          {heads.map((m) => (
            <li key={m.slug} className={CELL}>
              <Link to="/compare/$slug" params={{ slug: m.slug }} className={LINK_CELL}>
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Head-to-head · {getCategory(m.category).name}
                  </span>
                  <LinkArrow />
                </span>
                <span className="flex items-center gap-3.5">
                  <span className="flex shrink-0 -space-x-2">
                    <ProductMark product={PRODUCTS[m.a]} className="h-9 w-9 ring-2 ring-white" />
                    <ProductMark product={PRODUCTS[m.b]} className="h-9 w-9 ring-2 ring-white" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.92rem] font-semibold text-ink">
                      {matchupTitle(m)}
                    </span>
                    <span className="block truncate text-[0.76rem] text-muted-foreground">
                      Round by round
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Closing band ---------- */

export function ClosingBand({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        {/* The page's figure of eight returns in white, so it opens and closes on the same mark. */}
        <svg
          aria-hidden
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          fill="none"
          className="pointer-events-none absolute left-1/2 top-1/2 w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 sm:w-[110%]"
        >
          <path d={ON_PATH} className="stroke-white/15" strokeWidth={1.2} />
          <path d={OFF_PATH} className="stroke-white/15" strokeWidth={1.2} strokeDasharray="4 6" />
        </svg>
        <div className="relative px-5 py-16 text-center sm:px-8 sm:py-20">
          <Reveal>
            <div className="flex justify-center">
              <VsLockup competitor={c} onDark size="sm" />
            </div>
            <h2
              id="cta-title"
              className="mx-auto mt-6 max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
            >
              {c.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {c.ctaBody}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-9 max-w-[38rem]">
            <div className="rounded-xl bg-white p-3 text-left shadow-[0_24px_60px_-24px_rgba(4,24,72,0.55)] sm:p-4">
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3 text-center text-[0.8rem] text-muted-foreground sm:text-left">
                {TRIAL_NOTE}
              </p>
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
