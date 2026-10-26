/**
 * The body of /alternatives/outrank, in the landing page's frame: hairline
 * rails, a hairline over every band, blank bands between sections, white
 * throughout, one blue band to close.
 *
 * The order follows how a buyer weighs two tools that run the same loop.
 * First the short answer and the facts that decide a shortlist; then what
 * really differs (the positioning, then three places where it changes what
 * lands on your site); then the whole price ladder, since Outrank sells more
 * volume than Rankbox does; then, straight after, when Outrank is the better
 * buy; then every row, how to switch, the questions, and the sources the
 * whole page was checked against.
 *
 * All copy shown about either product is read from the competitor entry,
 * data/pricing and the shared Rankbox cells. Pictures are in pictures.tsx
 * and month.tsx.
 */
import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowRightLeft,
  ArrowUpRight,
  Check,
  Columns2,
  FileSearch,
  GitCompareArrows,
  HelpCircle,
  Layers,
  ListChecks,
  Quote,
  Receipt,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { COMPANY } from "@/data/company";
import { getFeature } from "@/data/features";
import { PLAN, formatUsd } from "@/data/pricing";
import {
  COMPETITORS,
  RANKBOX_SNAPSHOT,
  formatCheckedOn,
  type CellState,
  type Competitor,
  type Fact,
  type PricePlan,
} from "@/data/alternatives";
import { CompetitorMark, RankboxMark, VsLockup } from "@/components/alternatives/kit";
import { CreditLedger, Destinations, RedditDraft, RunBoth, WordRuler } from "./pictures";
import { StateMark } from "./atoms";
import { OURS_TINT, STATE_LABEL, accentTail, cents, displayUrl, perArticle } from "./lib";

/* ---------- The short answer, and the facts at a glance ---------- */

type GlanceValue = string | Fact;

function glanceRows(c: Competitor): { label: string; rankbox: GlanceValue; them: GlanceValue }[] {
  return [
    { label: "Best for", rankbox: RANKBOX_SNAPSHOT.bestFor, them: c.snapshot.bestFor },
    {
      label: "Price",
      rankbox: `${formatUsd(PLAN.monthly)}/mo`,
      them: `${formatUsd(c.pricing.monthly)}/mo · ${c.pricing.plan}`,
    },
    {
      label: "Articles included",
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
    {
      label: "Keyword data",
      rankbox: RANKBOX_SNAPSHOT.keywordData,
      them: c.snapshot.keywordData,
    },
  ];
}

function Glance({ value, ours }: { value: GlanceValue; ours: boolean }) {
  if (typeof value === "string") {
    return (
      <span className={cn("text-[0.85rem]", ours ? "font-medium text-ink" : "text-ink/80")}>
        {value}
      </span>
    );
  }
  return (
    <span className="flex items-start gap-2">
      <StateMark state={value.state} ours={ours} className="mt-px" />
      <span className={cn("text-[0.85rem] leading-snug", ours ? "text-ink" : "text-ink/80")}>
        {value.short}
      </span>
    </span>
  );
}

export function ShortAnswer({ competitor }: { competitor: Competitor }) {
  const verdicts = [
    { ours: true, name: "Rankbox", text: competitor.verdict.rankbox },
    { ours: false, name: competitor.name, text: competitor.verdict.them },
  ];
  return (
    <section aria-labelledby="short-answer-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Reveal
            className={cn(
              "border-b px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <h2 id="short-answer-title">
              <Pill icon={Quote}>The short answer</Pill>
            </h2>
            <p className="mt-6 text-[1.08rem] leading-[1.7] text-ink sm:text-[1.18rem]">
              {competitor.shortAnswer}
            </p>
          </Reveal>

          <div className="grid grid-rows-2">
            {verdicts.map((v, i) => (
              <Reveal
                key={v.name}
                delay={0.06 + i * 0.06}
                className={cn(
                  "flex gap-4 px-5 py-8 sm:px-10 lg:px-10",
                  i === 0 && cn("border-b", LINE, OURS_TINT),
                )}
              >
                {v.ours ? (
                  <RankboxMark className="h-10 w-10" />
                ) : (
                  <CompetitorMark competitor={competitor} className="h-10 w-10" />
                )}
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-[0.8rem] font-medium",
                      v.ours ? "text-cta" : "text-muted-foreground",
                    )}
                  >
                    {v.name}
                  </p>
                  <p className="mt-1.5 text-balance font-display text-[1.25rem] font-medium leading-snug tracking-[-0.02em] text-ink">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">
              Rankbox and {competitor.name} at a glance, checked{" "}
              {formatCheckedOn(competitor.pricing.checkedOn)}
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-[26%] px-5 py-4 align-bottom text-[0.78rem] font-medium text-muted-foreground sm:px-8"
                >
                  At a glance
                </th>
                <th scope="col" className={cn("border-l px-5 py-4", LINE, OURS_TINT)}>
                  <span className="flex items-center gap-2 text-[0.9rem] font-medium text-cta">
                    <RankboxMark className="h-6 w-6" />
                    Rankbox
                  </span>
                </th>
                <th scope="col" className={cn("border-l px-5 py-4", LINE)}>
                  <span className="flex items-center gap-2 text-[0.9rem] font-medium text-ink">
                    <CompetitorMark competitor={competitor} className="h-6 w-6 text-[0.55rem]" />
                    {competitor.name}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {glanceRows(competitor).map((r) => (
                <tr key={r.label} className={cn("border-t", LINE)}>
                  <th
                    scope="row"
                    className="px-5 py-3.5 text-[0.85rem] font-normal text-muted-foreground sm:px-8"
                  >
                    {r.label}
                  </th>
                  <td className={cn("border-l px-5 py-3.5 align-top", LINE, OURS_TINT)}>
                    <Glance value={r.rankbox} ours />
                  </td>
                  <td className={cn("border-l px-5 py-3.5 align-top", LINE)}>
                    <Glance value={r.them} ours={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>
      <Band inner="px-5 py-4 sm:px-8">
        <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
          {competitor.name} facts from their own pages; Rankbox facts are what ships today.{" "}
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
      </Band>
    </section>
  );
}

/* ---------- Positioning ---------- */

export function Positioning({ competitor }: { competitor: Competitor }) {
  const p = competitor.positioning;
  return (
    <section aria-labelledby="positioning-title">
      <Spacer />
      <SectionHead
        icon={Columns2}
        eyebrow="The real difference"
        title={<span id="positioning-title">{accentTail(p.title)}</span>}
        subtitle={p.body}
      />
      <Band>
        <div className="grid md:grid-cols-2">
          <div className={OURS_TINT}>
            <Reveal className="h-full px-5 py-9 sm:px-10 lg:px-12 lg:py-12">
              <div className="flex items-center gap-3">
                <RankboxMark className="h-10 w-10" />
                <div>
                  <h3 className="text-[1rem] font-semibold tracking-tight text-ink">
                    {p.rankboxTitle}
                  </h3>
                  <p className="text-[0.8rem] text-cta">
                    {p.rankboxTag ?? "An engine, not an editor"}
                  </p>
                </div>
              </div>
              <ul className="mt-7 space-y-3.5">
                {p.rankbox.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] leading-snug text-ink">
                    <span className="mt-0.5 flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full bg-cta text-white">
                      <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className={cn("border-t md:border-l md:border-t-0", LINE)}>
            <Reveal delay={0.08} className="h-full px-5 py-9 sm:px-10 lg:px-12 lg:py-12">
              <div className="flex items-center gap-3">
                <CompetitorMark competitor={competitor} className="h-10 w-10" />
                <div>
                  <h3 className="text-[1rem] font-semibold tracking-tight text-ink">
                    {p.themTitle}
                  </h3>
                  <p className="text-[0.8rem] text-muted-foreground">{competitor.category}</p>
                </div>
              </div>
              <ul className="mt-7 space-y-3.5">
                {p.them.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] leading-snug text-ink/80">
                    <span
                      aria-hidden
                      className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Where the two differ ---------- */

function DeepDivePicture({ slug, competitor }: { slug: string; competitor: Competitor }) {
  if (slug === "reddit-presence") return <RedditDraft />;
  if (slug === "authority-backlinks") return <CreditLedger competitor={competitor} />;
  if (slug === "citation-ready-writer") return <WordRuler competitor={competitor} />;
  return null;
}

const DRAWN = new Set(["reddit-presence", "authority-backlinks", "citation-ready-writer"]);

export function DeepDives({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="differ-title">
      <Spacer />
      <SectionHead
        icon={GitCompareArrows}
        eyebrow="Where it's decided"
        title={
          <span id="differ-title">
            {accentTail(
              competitor.battlegroundsTitle ??
                `Three things Rankbox does that ${competitor.name} doesn't set out to`,
            )}
          </span>
        }
        subtitle={
          competitor.battlegroundsIntro ??
          "Not a longer list of features: the three that change what actually happens on your site."
        }
      />
      {competitor.battlegrounds.map((b, i) => {
        const feature = getFeature(b.featureSlug);
        const Icon = b.icon;
        const flip = i % 2 === 1;
        const drawn = DRAWN.has(b.featureSlug);
        return (
          <Band key={b.title}>
            <article className={cn("grid", drawn && "lg:grid-cols-2")}>
              <Reveal
                className={cn(
                  "flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-12 lg:py-14",
                  flip && "lg:order-2",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[0.8rem] font-medium tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(competitor.battlegrounds.length).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.75rem]">
                  {b.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {b.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[0.9rem] leading-snug text-ink">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                        <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                {feature && (
                  <Link
                    to="/features/$slug"
                    params={{ slug: feature.slug }}
                    className={cn(GHOST_BUTTON, "mt-7 w-fit")}
                  >
                    How {feature.name} works
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </Reveal>
              {drawn && (
                <div
                  className={cn(
                    "flex items-center border-t px-4 py-10 sm:px-10 lg:border-t-0 lg:px-12 lg:py-14",
                    flip ? "lg:order-1 lg:border-r" : "lg:border-l",
                    LINE,
                    PANEL,
                  )}
                >
                  <Reveal delay={0.08} y={24} className="mx-auto w-full max-w-[26rem]">
                    <DeepDivePicture slug={b.featureSlug} competitor={competitor} />
                  </Reveal>
                </div>
              )}
            </article>
          </Band>
        );
      })}
    </section>
  );
}

/* ---------- The price ladder ---------- */

interface Rung {
  key: string;
  name: ReactNode;
  note?: string;
  monthly: number | null;
  articles: number | null;
  each: number | null;
  ours: boolean;
}

export function PriceLadder({ competitor }: { competitor: Competitor }) {
  const p = competitor.pricing;
  const rungs: Rung[] = [
    {
      key: "rankbox",
      name: `Rankbox ${PLAN.name}`,
      note: "The one plan",
      monthly: PLAN.monthly,
      articles: PLAN.articlesPerMonth,
      each: perArticle(PLAN.monthly, PLAN.articlesPerMonth),
      ours: true,
    },
    ...p.plans.map((pl: PricePlan) => ({
      key: pl.name,
      name: pl.name,
      note: pl.note,
      monthly: pl.monthly,
      articles: pl.articles,
      each: perArticle(pl.monthly, pl.articles),
      ours: false,
    })),
  ];
  const top = Math.max(...rungs.map((r) => r.each ?? 0));
  const pricingSource = competitor.sources.find((s) => /pricing/i.test(s.label));

  return (
    <section aria-labelledby="cost-title">
      <Spacer />
      <SectionHead
        icon={Receipt}
        eyebrow="What it costs"
        title={
          <span id="cost-title">
            Every {competitor.name} plan, <Accent>priced per article</Accent>
          </span>
        }
        subtitle={`A monthly price only means something next to what it produces. Here is every plan ${competitor.name} lists, beside Rankbox's one.`}
      />
      <Band>
        <div className="relative overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Rankbox and every {competitor.name} plan, per month and per article
            </caption>
            <thead>
              <tr className="text-[0.75rem] font-medium text-muted-foreground">
                <th scope="col" className="px-5 py-4 font-medium sm:px-8">
                  Plan
                </th>
                <th scope="col" className={cn("border-l px-4 py-4 text-right font-medium", LINE)}>
                  Monthly
                </th>
                <th
                  scope="col"
                  className={cn(
                    "hidden border-l px-4 py-4 text-right font-medium sm:table-cell",
                    LINE,
                  )}
                >
                  Articles
                </th>
                <th scope="col" className={cn("border-l px-4 py-4 font-medium sm:px-6", LINE)}>
                  Per article
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rungs.map((r) => (
                <tr key={r.key} className={cn("border-t", LINE, r.ours && OURS_TINT)}>
                  <th scope="row" className="px-5 py-4 font-normal sm:px-8">
                    <span className="flex items-center gap-2.5">
                      {r.ours ? (
                        <RankboxMark className="h-6 w-6" />
                      ) : (
                        <CompetitorMark
                          competitor={competitor}
                          className="h-6 w-6 text-[0.55rem]"
                        />
                      )}
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block text-[0.88rem]",
                            r.ours ? "font-semibold text-cta" : "font-medium text-ink",
                          )}
                        >
                          {r.name}
                        </span>
                        {r.note && (
                          <span className="block text-[0.75rem] text-muted-foreground">
                            {r.note}
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <td
                    className={cn(
                      "border-l px-4 py-4 text-right text-[0.88rem]",
                      LINE,
                      r.ours ? "font-semibold text-ink" : "text-ink",
                    )}
                  >
                    {r.monthly === null ? "Custom" : formatUsd(r.monthly)}
                  </td>
                  <td
                    className={cn(
                      "hidden border-l px-4 py-4 text-right text-[0.88rem] text-muted-foreground sm:table-cell",
                      LINE,
                    )}
                  >
                    {r.articles ?? "—"}
                  </td>
                  <td className={cn("border-l px-4 py-4 sm:px-6", LINE)}>
                    {r.each === null ? (
                      <span className="text-[0.85rem] text-muted-foreground">Not per article</span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className="hidden h-2 w-28 shrink-0 overflow-hidden rounded-full bg-ink/[0.05] min-[480px]:block sm:w-40 lg:w-56"
                        >
                          <span
                            className={cn(
                              "block h-full rounded-full",
                              r.ours ? "bg-cta" : "bg-ink/25",
                            )}
                            style={{ width: `${(r.each / top) * 100}%` }}
                          />
                        </span>
                        <span
                          className={cn(
                            "text-[0.88rem]",
                            r.ours ? "font-semibold text-cta" : "text-ink",
                          )}
                        >
                          {cents(r.each)}
                        </span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {p.ladderNote && (
          <p
            className={cn("border-t px-5 py-3 text-[0.78rem] text-muted-foreground sm:px-8", LINE)}
          >
            {p.ladderNote}
          </p>
        )}
      </Band>
      <Band>
        <div className="grid md:grid-cols-2">
          <div className={cn("border-b px-5 py-7 sm:px-8 md:border-b-0 md:border-r", LINE)}>
            <h3 className="text-[0.8rem] font-medium text-muted-foreground">
              What {competitor.name}&rsquo;s {p.plan} covers
            </h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">{p.covers}</p>
          </div>
          <div className="px-5 py-7 sm:px-8">
            <h3 className="text-[0.8rem] font-medium text-muted-foreground">Worth knowing</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">{p.caveat}</p>
          </div>
        </div>
      </Band>
      <Band inner="px-5 py-4 sm:px-8">
        <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
          {competitor.name} list prices taken from{" "}
          {pricingSource ? (
            <a
              href={pricingSource.url}
              target="_blank"
              rel="noopener nofollow"
              className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
            >
              their public pricing page
            </a>
          ) : (
            "their public pricing page"
          )}{" "}
          on {formatCheckedOn(p.checkedOn)}. Prices change, so check theirs before deciding.
        </p>
      </Band>
    </section>
  );
}

/* ---------- When they win ---------- */

export function BetterWhen({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="better-title">
      <Spacer />
      <SectionHead
        icon={Scale}
        eyebrow="The honest part"
        title={
          <span id="better-title">
            When {competitor.name} is <Accent>the better choice</Accent>
          </span>
        }
        subtitle={`We'd rather you picked the right tool than switched and left in a month. In these cases, ${competitor.name} is the better buy.`}
      />
      <Band>
        <CellGrid className="lg:grid-cols-3">
          {competitor.betterWhen.map((w, i) => (
            <li key={w.title} className={CELL}>
              <Reveal delay={i * 0.06} className="flex h-full flex-col px-5 py-8 sm:px-8 lg:py-10">
                <div className="flex items-center justify-between">
                  <CompetitorMark competitor={competitor} className="h-9 w-9" />
                  <span className="text-[0.8rem] font-medium tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-[1.05rem] font-semibold leading-snug tracking-tight text-ink">
                  {w.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{w.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
      <Band>
        <Destinations competitor={competitor} />
      </Band>
    </section>
  );
}

/* ---------- Every row ---------- */

const LEGEND: CellState[] = ["yes", "partial", "no"];

export function Matrix({ competitor }: { competitor: Competitor }) {
  const rowCount = competitor.matrix.reduce((n, g) => n + g.rows.length, 0);
  return (
    <section id="compare" aria-labelledby="matrix-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={ListChecks}
        eyebrow="Side by side"
        title={
          <span id="matrix-title">
            Rankbox vs {competitor.name}, <Accent>in {rowCount} rows</Accent>
          </span>
        }
        subtitle={`Every row is something a content programme needs. Where ${competitor.name} isn't built for one, the cell says what it is for instead.`}
      >
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LEGEND.map((s) => (
            <li key={s} className="flex items-center gap-2 text-[0.78rem] text-muted-foreground">
              <span aria-hidden>
                <StateMark state={s} ours />
              </span>
              {STATE_LABEL[s]}
            </li>
          ))}
        </ul>
      </SectionHead>

      <Band>
        {/* A real table on wide screens. On a phone each row becomes a block,
            label on top and the two cells side by side; the explicit roles
            keep it a table to screen readers when the display changes. */}
        <table role="table" className="w-full border-collapse text-left max-md:block">
          <caption className="sr-only">
            Rankbox and {competitor.name}, capability by capability
          </caption>
          <thead role="rowgroup" className="max-md:sr-only">
            <tr role="row">
              <th
                role="columnheader"
                scope="col"
                className="w-[34%] px-6 py-4 text-[0.78rem] font-medium text-muted-foreground lg:px-8"
              >
                Capability
              </th>
              <th
                role="columnheader"
                scope="col"
                className={cn("w-[33%] border-l px-5 py-4", LINE, OURS_TINT)}
              >
                <span className="flex items-center gap-2 text-[0.9rem] font-medium text-cta">
                  <RankboxMark className="h-6 w-6" />
                  Rankbox
                </span>
              </th>
              <th role="columnheader" scope="col" className={cn("border-l px-5 py-4", LINE)}>
                <span className="flex items-center gap-2 text-[0.9rem] font-medium text-ink">
                  <CompetitorMark competitor={competitor} className="h-6 w-6 text-[0.55rem]" />
                  {competitor.name}
                </span>
              </th>
            </tr>
          </thead>
          {competitor.matrix.map((g) => {
            const Icon = g.icon;
            return (
              <tbody key={g.group} role="rowgroup" className="max-md:block">
                <tr role="row" className={cn("border-t bg-ink/[0.02] max-md:block", LINE)}>
                  <th
                    role="rowheader"
                    scope="rowgroup"
                    colSpan={3}
                    className="px-5 py-2.5 max-md:block lg:px-8"
                  >
                    <span className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink">
                      <Icon aria-hidden className="h-3.5 w-3.5 text-brand-blue" />
                      {g.group}
                    </span>
                  </th>
                </tr>
                {g.rows.map((row) => (
                  <tr
                    key={row.label}
                    role="row"
                    className={cn("border-t max-md:grid max-md:grid-cols-2", LINE)}
                  >
                    <th
                      role="rowheader"
                      scope="row"
                      className="px-5 pb-2 pt-4 align-top font-normal max-md:col-span-2 md:px-6 md:py-4 lg:px-8"
                    >
                      <span className="block text-[0.9rem] font-medium text-ink">{row.label}</span>
                      <span className="mt-1 block text-[0.78rem] leading-snug text-muted-foreground">
                        {row.detail}
                      </span>
                    </th>
                    <td
                      role="cell"
                      className={cn(
                        "px-5 py-4 align-top max-md:block max-md:pl-5 max-md:pr-3 md:border-l",
                        LINE,
                        OURS_TINT,
                      )}
                    >
                      <span
                        aria-hidden
                        className="mb-2 flex items-center gap-1.5 text-[0.7rem] font-medium text-cta md:hidden"
                      >
                        <RankboxMark className="h-4 w-4" />
                        Rankbox
                      </span>
                      <span className="flex gap-2.5">
                        <StateMark state={row.rankbox.state} ours className="mt-px" />
                        <span className="text-[0.82rem] leading-snug text-ink">
                          {row.rankbox.note}
                        </span>
                      </span>
                    </td>
                    <td
                      role="cell"
                      className={cn(
                        "border-l px-5 py-4 align-top max-md:block max-md:pl-3 max-md:pr-5",
                        LINE,
                      )}
                    >
                      <span
                        aria-hidden
                        className="mb-2 flex items-center gap-1.5 text-[0.7rem] font-medium text-ink md:hidden"
                      >
                        <CompetitorMark
                          competitor={competitor}
                          className="h-4 w-4 text-[0.45rem]"
                        />
                        {competitor.name}
                      </span>
                      <span className="flex gap-2.5">
                        <StateMark state={row.them.state} className="mt-px" />
                        <span
                          className={cn(
                            "text-[0.82rem] leading-snug",
                            row.them.state === "no" ? "text-muted-foreground" : "text-ink/85",
                          )}
                        >
                          {row.them.note}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      </Band>
      <Band inner="px-5 py-4 sm:px-8">
        <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
          Compiled from {competitor.name}&rsquo;s public documentation and pricing pages, last
          reviewed {formatCheckedOn(competitor.pricing.checkedOn)}. Products change: check theirs
          before you decide, and tell us if we have a row wrong.
        </p>
      </Band>
    </section>
  );
}

/* ---------- Switching ---------- */

export function Switching({ competitor }: { competitor: Competitor }) {
  const m = competitor.migration;
  return (
    <section aria-labelledby="switch-title">
      <Spacer />
      <SectionHead
        icon={ArrowRightLeft}
        eyebrow="Switching"
        title={<span id="switch-title">{accentTail(m.title)}</span>}
        subtitle={m.body}
      />
      <Band inner={cn("px-4 py-10 sm:px-10 sm:py-12 lg:px-16", PANEL)}>
        <Reveal className="mx-auto max-w-4xl rounded-xl border border-ink/[0.07] bg-white px-4 py-8 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_44px_-24px_rgba(16,24,40,0.2)] sm:px-8 sm:py-10">
          <RunBoth competitor={competitor} />
        </Reveal>
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-3">
          {m.steps.map((s, i) => (
            <li key={s.title} className={CELL}>
              <Reveal delay={i * 0.06} className="h-full px-5 py-8 sm:px-8 lg:py-10">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-blue/40 bg-white text-[0.85rem] font-semibold text-brand-blue">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Every answer open, as a ruled sheet: these are the questions people bring
   to a comparison, and they read faster side by side than behind toggles.
   Plain text, so the FAQPage markup the route emits matches what is shown. */
export function Questions({ competitor }: { competitor: Competitor }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <span id="faq-title">
            Rankbox vs {competitor.name}, <Accent>answered</Accent>
          </span>
        }
        subtitle={`The questions people ask before switching from ${competitor.name}.`}
      />
      <Band>
        <CellGrid className="md:grid-cols-2">
          {competitor.faqs.map((f, i) => (
            <li key={f.q} className={CELL}>
              <Reveal delay={(i % 2) * 0.05} className="h-full px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
                <span className="text-[0.78rem] font-medium tabular-nums text-brand-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-[1.05rem] font-semibold leading-snug tracking-tight text-ink">
                  {f.q}
                </h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Sources ---------- */

export function Sources({ competitor }: { competitor: Competitor }) {
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal
            className={cn(
              "border-b px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={FileSearch}>Sources</Pill>
            <h2
              id="sources-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]"
            >
              How this comparison was <Accent>checked</Accent>
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Every {competitor.name} fact on this page comes from {competitor.name}&rsquo;s own
              public pages, read on {formatCheckedOn(competitor.pricing.checkedOn)}. Anything we
              could not confirm there is left out. Rankbox facts describe what ships today, not what
              is planned.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Spotted something out of date?{" "}
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Correction: Rankbox vs ${competitor.name}`)}`}
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
              >
                Email {COMPANY.email}
              </a>{" "}
              and we will fix the row.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="min-w-0 px-2 py-4 sm:px-6 lg:py-8">
            <ol className="divide-y divide-ink/[0.07]">
              {competitor.sources.map((src, i) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener nofollow"
                    className="group flex items-center gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
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

/* ---------- The other comparisons ---------- */

export function OtherComparisons({ competitor }: { competitor: Competitor }) {
  const others = COMPETITORS.filter((c) => c.slug !== competitor.slug);
  if (others.length === 0) return null;
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="flex flex-col gap-5 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-10 lg:px-12">
        <div>
          <Pill icon={Layers}>More comparisons</Pill>
          <h2
            id="others-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Comparing something <Accent>else?</Accent>
          </h2>
          <p className="mt-2 text-[0.95rem] text-muted-foreground">
            The same questions, asked of the other tools founders shortlist.
          </p>
        </div>
        <Link to="/alternatives" className={cn(GHOST_BUTTON, "w-fit shrink-0")}>
          All comparisons
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
                className="group flex h-full items-center gap-3.5 px-5 py-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-6"
              >
                <CompetitorMark competitor={c} className="h-10 w-10" />
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
    </section>
  );
}

/* ---------- Closing call to action ---------- */

/* A blue band like the landing's close. Thirty squares run along its foot,
   one per article in the month, the hero's calendar in white. */
export function ClosingBand({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div className="relative px-5 pb-20 pt-14 text-center sm:px-8 sm:pb-24 sm:pt-20">
          <Reveal>
            <VsLockup competitor={competitor} onDark size="sm" className="justify-center" />
            <h2
              id="cta-title"
              className="mx-auto mt-6 max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              {competitor.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {competitor.ctaBody}
            </p>
            <div className="mx-auto mt-8 flex max-w-xl justify-center">
              <UrlForm url={url} onChange={setUrl} />
            </div>
            <p className="mt-3.5 text-[0.85rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-[3px] px-4 pb-5 sm:gap-1.5"
        >
          {Array.from({ length: PLAN.articlesPerMonth }, (_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-[2px] bg-white sm:h-3 sm:w-3 sm:rounded-[3px]"
              style={{ opacity: 0.12 + (i / PLAN.articlesPerMonth) * 0.3 }}
            />
          ))}
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
