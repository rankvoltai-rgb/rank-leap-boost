/**
 * Comparison pages are sub-landing pages, built in the landing's language:
 * blue pixel hero with URL capture, a spec band, alternating surfaces,
 * bordered cards, and the dark closing CTA. What changes is the argument —
 * each section answers one question a buyer comparing two tools actually has.
 *
 * The order is deliberate and is the order the objections arrive in:
 * what's the difference → prove it row by row → what does it cost → show me
 * the three things that matter → when should I not pick you → how hard is
 * switching → who else did → what about X.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Quote as QuoteIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { PixelField, CARD_PIXELS, UrlForm } from "@/components/landing/Hero";
import { SHOWCASES } from "@/components/features/showcase";
import { LEGAL_CONTACT } from "@/components/legal/legal-ui";
import { getFeature } from "@/data/features";
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";
import { cn } from "@/lib/utils";
import {
  COMPETITORS,
  KIND_LABEL,
  RANKBOX_COST,
  RANKBOX_SNAPSHOT,
  competitorH1,
  costPerArticle,
  formatCheckedOn,
  formatCheckedOnShort,
  type Competitor,
  type Fact,
  type PricePlan,
} from "@/data/alternatives";
import { CompetitorMark, FactDot, RankboxMark, VsLockup } from "./kit";

/* ---------- shared ---------- */

function Heading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {intro && <p className="mt-4 text-balance text-lg text-muted-foreground">{intro}</p>}
    </Reveal>
  );
}

/**
 * What the trial actually asks for. Building a plan needs no card; the trial
 * itself does, so "no credit card required" beside "free trial" would promise
 * something checkout then contradicts.
 */
const TRIAL_LINE = `Build your content plan free, no card · ${TRIAL_DAYS}-day trial · Cancel anytime`;

type GlanceCell = string | Fact;

/** The hero card's rows, from the same snapshot the hub table reads. */
function glanceRows(c: Competitor): { label: string; rankbox: GlanceCell; them: GlanceCell }[] {
  const theirArticles = c.pricing.articles;
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
      them: theirArticles ? `${theirArticles} a month` : "Not sold per article",
    },
    { label: "Publishing", rankbox: RANKBOX_SNAPSHOT.publishing, them: c.snapshot.publishing },
    { label: "Backlinks", rankbox: RANKBOX_SNAPSHOT.backlinks, them: c.snapshot.backlinks },
    {
      label: "AI visibility",
      rankbox: RANKBOX_SNAPSHOT.aiVisibility,
      them: c.snapshot.aiVisibility,
    },
  ];
}

/* ---------- 1. Hero ---------- */

/* The hero's right-hand panel: the facts that decide most shortlists, side by
   side. Facts rather than scores on purpose: a 0–100 bar is an opinion dressed
   as a measurement, while "$99 a month, 30 articles" can be checked against
   their pricing page, which is what makes the rest of the page believable. */
function AtAGlance({ competitor }: { competitor: Competitor }) {
  const rows = glanceRows(competitor);
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">At a glance</p>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/80">
          Checked {formatCheckedOnShort(competitor.pricing.checkedOn)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-b border-white/15 pb-3">
        <div className="flex items-center gap-2">
          <RankboxMark className="h-6 w-6" onDark />
          <span className="text-xs font-semibold text-white">Rankbox</span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <CompetitorMark competitor={competitor} onDark className="h-6 w-6 text-[0.6rem]" />
          <span className="truncate text-xs font-semibold text-white">{competitor.name}</span>
        </div>
      </div>

      <dl className="divide-y divide-white/10">
        {rows.map((r) => (
          <div key={r.label} className="py-3">
            <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/55">
              {r.label}
            </dt>
            <dd className="mt-1.5 grid grid-cols-2 gap-3 text-[0.8rem] leading-snug">
              <GlanceValue value={r.rankbox} emphasis />
              <GlanceValue value={r.them} />
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-2 border-t border-white/15 pt-4 text-[0.7rem] leading-relaxed text-white/60">
        {competitor.name} facts from their own pages; Rankbox facts are what ships today.{" "}
        <a href="#compare" className="font-semibold text-white/85 underline underline-offset-2">
          Every row
        </a>{" "}
        and{" "}
        <a href="#sources" className="font-semibold text-white/85 underline underline-offset-2">
          the sources
        </a>{" "}
        are below.
      </p>
    </div>
  );
}

function GlanceValue({ value, emphasis = false }: { value: GlanceCell; emphasis?: boolean }) {
  if (typeof value === "string") {
    return (
      <span className={cn("min-w-0", emphasis ? "font-semibold text-white" : "text-white/80")}>
        {value}
      </span>
    );
  }
  return (
    <span className="flex min-w-0 items-start gap-1.5">
      <FactDot state={value.state} onDark />
      <span className={cn("min-w-0", emphasis ? "font-medium text-white" : "text-white/80")}>
        {value.short}
      </span>
    </span>
  );
}

export function AlternativeHero({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section
      id="top"
      aria-labelledby="alt-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          {/* LEFT */}
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6 flex justify-center lg:justify-start">
                <ol className="flex items-center gap-1.5 text-xs font-medium text-white/65">
                  <li>
                    <Link to="/" className="transition-colors hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li>
                    <Link to="/alternatives" className="transition-colors hover:text-white">
                      Alternatives
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li aria-current="page" className="text-white">
                    {competitor.name}
                  </li>
                </ol>
              </nav>
            </Reveal>

            <Reveal delay={0.05} className="mb-6 flex justify-center lg:justify-start">
              <VsLockup competitor={competitor} onDark />
            </Reveal>

            <Reveal delay={0.09}>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                {competitor.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.13}>
              <h1
                id="alt-title"
                className={cn(
                  "font-display text-balance font-bold leading-[1.07] tracking-tight text-white",
                  // Long lockups step down a size so the H1 holds to three
                  // lines beside the fact card instead of four.
                  competitorH1(competitor).length > 44
                    ? "text-[2rem] sm:text-[2.6rem] xl:text-[2.9rem]"
                    : "text-[2.15rem] sm:text-[3rem] xl:text-[3.4rem]",
                )}
              >
                <span className="lg:block">{competitor.headline.lead}</span>{" "}
                {competitor.headline.accent}
              </h1>
            </Reveal>

            <Reveal delay={0.19}>
              <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                {competitor.subhead}
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                <UrlForm url={url} onChange={setUrl} />
                <p className="text-sm text-white/70">{TRIAL_LINE}</p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT */}
          <Reveal delay={0.3} y={28} className="mx-auto w-full min-w-0 max-w-lg lg:mx-0">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-12">
                <PixelField pixels={CARD_PIXELS} seed={7} />
              </div>
              <div className="relative">
                <AtAGlance competitor={competitor} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. The short answer ---------- */

/**
 * Written to be lifted. An answer engine summarising "is X a good alternative
 * to Y" will quote the first self-contained paragraph that names both
 * products and draws the distinction — so this block is exactly that, set
 * large, above the fold of the body, and marked up as the page's primary
 * answer. The two verdict lines below give the engine a clean either/or.
 */
export function ShortAnswer({ competitor }: { competitor: Competitor }) {
  return (
    <section
      aria-labelledby="short-answer-title"
      className="border-b border-border bg-card py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-surface p-7 sm:p-10">
            <QuoteIcon
              aria-hidden
              className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-volt/[0.07]"
              strokeWidth={1.5}
            />
            <h2
              id="short-answer-title"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-volt"
            >
              The short answer
            </h2>
            <p className="mt-4 text-balance text-[1.05rem] leading-relaxed text-ink sm:text-[1.15rem] sm:leading-[1.7]">
              {competitor.shortAnswer}
            </p>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Reveal delay={0.06}>
            <div className="flex h-full gap-3.5 rounded-2xl border border-volt/35 bg-card p-5 ring-1 ring-volt/15">
              <RankboxMark className="h-9 w-9" />
              <div>
                <p className="text-sm font-semibold text-ink">Rankbox</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {competitor.verdict.rankbox}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full gap-3.5 rounded-2xl border border-border bg-card p-5">
              <CompetitorMark competitor={competitor} className="h-9 w-9" />
              <div>
                <p className="text-sm font-semibold text-ink">{competitor.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {competitor.verdict.them}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. Spec band ---------- */

export function AlternativeSpecs({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-label="Rankbox at a glance" className="border-b border-border bg-card">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 md:grid-cols-4 md:py-12">
        {competitor.specs.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.05}
            className={cn(
              "flex flex-col-reverse px-3 text-center md:px-6",
              i % 2 === 1 && "border-l border-border",
              i > 0 && "md:border-l md:border-border",
            )}
          >
            <dt className="mt-1.5 text-balance text-sm leading-snug text-muted-foreground">
              {s.label}
            </dt>
            <dd className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
              {s.value}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/* ---------- 4. Positioning ---------- */

export function Positioning({ competitor }: { competitor: Competitor }) {
  const p = competitor.positioning;
  return (
    <section aria-labelledby="positioning-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="positioning-title"
          eyebrow="The real difference"
          title={p.title}
          intro={p.body}
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2 lg:gap-6">
          <Reveal>
            <div className="h-full rounded-2xl border border-volt/40 bg-card p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)] ring-1 ring-volt/20 sm:p-8">
              <div className="flex items-center gap-3">
                <RankboxMark className="h-10 w-10" />
                <div>
                  <p className="text-sm font-semibold text-ink">{p.rankboxTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.rankboxTag ?? "An engine, not an editor"}
                  </p>
                </div>
              </div>
              <ul className="mt-7 space-y-4">
                {p.rankbox.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] leading-snug text-ink">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <CompetitorMark competitor={competitor} className="h-10 w-10" />
                <div>
                  <p className="text-sm font-semibold text-ink">{p.themTitle}</p>
                  <p className="text-xs text-muted-foreground">{competitor.category}</p>
                </div>
              </div>
              <ul className="mt-7 space-y-4">
                {p.them.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.95rem] leading-snug text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-border"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. Cost ---------- */

/* The comparison that closes people, so it is shown as arithmetic rather than
   as a claim: their published price, ours, and what each buys. Where their
   plan isn't sold by the article we say so instead of inventing a divisor. */
export function CostComparison({ competitor }: { competitor: Competitor }) {
  const theirs = costPerArticle(competitor);
  const cheaperPerArticle = theirs !== null && RANKBOX_COST.perArticle < theirs;

  return (
    <section aria-labelledby="cost-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="cost-title"
          eyebrow="What it costs"
          title="The number that matters is cost per article"
          intro={`A monthly price only means something next to what it produces. Here is ${competitor.name}'s published plan beside ours.`}
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          {/* Rankbox */}
          <Reveal>
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-brand-blue p-7 text-white sm:p-8">
              <PixelField seed={11} />
              <div className="relative flex items-center gap-2.5">
                <RankboxMark className="h-9 w-9" onDark />
                <p className="text-sm font-semibold">Rankbox</p>
              </div>
              <div className="relative mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                  {formatUsd(PLAN.monthly)}
                </span>
                <span className="text-sm text-white/70">/month</span>
              </div>
              <p className="relative mt-1.5 text-sm text-white/75">
                {PLAN.articlesPerMonth} researched, written, and SEO-checked articles
              </p>
              <div className="relative mt-6 rounded-2xl bg-white/12 p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/60">
                  Per article
                </p>
                <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                  {formatUsd(RANKBOX_COST.perArticle)}
                </p>
              </div>
              <ul className="relative mt-6 space-y-2.5 text-sm text-white/80">
                {[
                  "Research, writing, and SEO checks included",
                  `${PLAN.backlinkCreditsPerMonth} backlink credits a month, on the paid plan`,
                  "Editor rewrites are not metered",
                  "No setup fee, no contract",
                ].map((l) => (
                  <li key={l} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Them */}
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 sm:p-8">
              <div className="flex items-center gap-2.5">
                <CompetitorMark competitor={competitor} className="h-9 w-9" />
                <p className="text-sm font-semibold text-ink">
                  {competitor.name}
                  <span className="ml-1.5 font-normal text-muted-foreground">
                    · {competitor.pricing.plan}
                  </span>
                </p>
              </div>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  {formatUsd(competitor.pricing.monthly)}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{competitor.pricing.covers}</p>
              <div className="mt-6 rounded-2xl border border-border bg-surface/60 p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Per article
                </p>
                <p className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
                  {theirs !== null ? formatUsd(theirs) : "Not sold that way"}
                </p>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {competitor.pricing.caveat}
              </p>
            </div>
          </Reveal>
        </div>

        <PlanLadder competitor={competitor} />

        <Reveal delay={0.12}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
            {competitor.name} list prices taken from their public pricing page on{" "}
            {formatCheckedOn(competitor.pricing.checkedOn)}, on the plan closest in scope to ours;
            annual billing and promotions may lower it.{" "}
            {cheaperPerArticle
              ? "Compare both pricing pages before deciding."
              : "Prices change — check theirs before deciding."}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Every plan they sell, not just the one we picked to compare. Picking the
 * plan is the easiest place for a comparison to cheat, so the whole ladder is
 * shown and the reader can find their own volume on it. Per-article cost is
 * only worked out where the plan is sold by the article; anything else says so
 * rather than inventing a divisor.
 */
function PlanLadder({ competitor }: { competitor: Competitor }) {
  const plans = competitor.pricing.plans;
  if (plans.length < 2) return null;
  const perArticle = (p: PricePlan) =>
    p.monthly !== null && p.articles ? Math.round((p.monthly / p.articles) * 100) / 100 : null;

  return (
    <Reveal delay={0.1}>
      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-ink">Every {competitor.name} plan</h3>
          <p className="text-xs text-muted-foreground">List prices, shown per month</p>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <th scope="col" className="px-5 py-3 font-semibold sm:px-6">
                Plan
              </th>
              <th scope="col" className="px-3 py-3 text-right font-semibold">
                Monthly
              </th>
              <th scope="col" className="hidden px-3 py-3 text-right font-semibold sm:table-cell">
                Articles
              </th>
              <th scope="col" className="px-5 py-3 text-right font-semibold sm:px-6">
                Per article
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border tabular-nums">
            <tr className="bg-brand-blue/[0.06]">
              <th scope="row" className="px-5 py-3 font-semibold text-ink sm:px-6">
                <span className="flex items-center gap-2">
                  <RankboxMark className="h-5 w-5" />
                  Rankbox {PLAN.name}
                </span>
              </th>
              <td className="px-3 py-3 text-right font-semibold text-ink">
                {formatUsd(PLAN.monthly)}
              </td>
              <td className="hidden px-3 py-3 text-right text-ink sm:table-cell">
                {PLAN.articlesPerMonth}
              </td>
              <td className="px-5 py-3 text-right font-semibold text-ink sm:px-6">
                {formatUsd(RANKBOX_COST.perArticle)}
              </td>
            </tr>
            {plans.map((p) => {
              const each = perArticle(p);
              return (
                <tr key={p.name}>
                  <th scope="row" className="px-5 py-3 font-medium text-ink sm:px-6">
                    <span className="flex items-center gap-2">
                      <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.5rem]" />
                      <span className="min-w-0">
                        {p.name}
                        {p.note && (
                          <span className="block text-xs font-normal text-muted-foreground">
                            {p.note}
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <td className="px-3 py-3 text-right text-ink">
                    {p.monthly === null ? "Custom" : formatUsd(p.monthly)}
                  </td>
                  <td className="hidden px-3 py-3 text-right text-muted-foreground sm:table-cell">
                    {p.articles ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground sm:px-6">
                    {each !== null ? formatUsd(each) : "Not per article"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {competitor.pricing.ladderNote && (
          <p className="border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
            {competitor.pricing.ladderNote}
          </p>
        )}
      </div>
    </Reveal>
  );
}

/* ---------- 6. Battlegrounds ---------- */

export function Battlegrounds({ competitor }: { competitor: Competitor }) {
  return (
    <section
      aria-labelledby="battlegrounds-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="battlegrounds-title"
          eyebrow="Where it's decided"
          title={
            competitor.battlegroundsTitle ??
            `Three things Rankbox does that ${competitor.name} doesn't set out to`
          }
          intro={
            competitor.battlegroundsIntro ??
            "Not a longer list of features — the three that change what actually happens on your site."
          }
        />

        <div className="mt-16 space-y-6">
          {competitor.battlegrounds.map((b, i) => {
            const feature = getFeature(b.featureSlug);
            const Showcase = SHOWCASES[b.featureSlug]?.Hero;
            const Icon = b.icon;
            const flip = i % 2 === 1;
            return (
              <Reveal key={b.title} delay={0.04}>
                <article className="grid gap-8 rounded-3xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10">
                  <div className={cn("min-w-0", flip && "lg:order-2")}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-volt">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                      {b.title}
                    </h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {b.body}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {b.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-sm leading-snug text-ink">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                    {feature && (
                      <Link
                        to="/features/$slug"
                        params={{ slug: feature.slug }}
                        className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
                      >
                        How {feature.name} works
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                  <div className={cn("min-w-0", flip && "lg:order-1")}>
                    {Showcase && <Showcase className="lg:min-h-[24rem]" />}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. When they win ---------- */

/**
 * The section most comparison pages leave out, and the reason the rest of the
 * page gets believed. Styled plainly on purpose: no brand blue, no ticks —
 * it should read as a note from us, not another sales panel.
 */
export function BetterWhen({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="better-when-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="better-when-title"
          eyebrow="The honest part"
          title={`When ${competitor.name} is the better choice`}
          intro={`We'd rather you picked the right tool than churned in a month. ${competitor.name} is genuinely the better buy in these cases.`}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {competitor.betterWhen.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-dashed border-border bg-background p-6">
                <CompetitorMark competitor={competitor} className="h-9 w-9" />
                <h3 className="mt-5 text-base font-semibold text-ink">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. Migration ---------- */

export function Migration({ competitor }: { competitor: Competitor }) {
  return (
    <section
      aria-labelledby="migration-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="migration-title"
          eyebrow="Switching"
          title={competitor.migration.title}
          intro={competitor.migration.body}
        />

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div
            aria-hidden
            className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-px bg-[linear-gradient(to_right,var(--border)_55%,transparent_55%)] bg-[length:12px_1px] md:block"
          />
          <ol className="grid gap-12 md:grid-cols-3 md:gap-6">
            {competitor.migration.steps.map((s, i) => (
              <li key={s.title} className="relative">
                <Reveal delay={i * 0.08} className="flex flex-col items-center text-center">
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-base font-semibold text-white shadow-sm ring-8 ring-surface">
                    {i + 1}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. Sources ---------- */

/**
 * Where the testimonials used to go. A comparison page earns trust by being
 * checkable, so the proof here is the paper trail: the competitor's own pages
 * every fact came from, the date they were read, and an address to report a
 * stale row. Answer engines weigh this too; the same links go out as
 * `citation` in the page schema.
 */
export function Sources({ competitor }: { competitor: Competitor }) {
  return (
    <section
      id="sources"
      aria-labelledby="sources-title"
      className="scroll-mt-[var(--top-chrome)] border-t border-border py-20 sm:py-24"
    >
      {/* minmax(0,…) tracks and min-w-0 items: a long source URL must truncate,
          not widen the grid past a phone's viewport. */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <Eyebrow className="mb-4">Sources</Eyebrow>
          <h2
            id="sources-title"
            className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            How this comparison was checked
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            Every {competitor.name} fact on this page comes from {competitor.name}&rsquo;s own
            public pages, read on {formatCheckedOn(competitor.pricing.checkedOn)}. Anything we could
            not confirm there is left out. Rankbox facts describe what ships today, not what is
            planned.
          </p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            Spotted something out of date?{" "}
            <a
              href={`mailto:${LEGAL_CONTACT}?subject=${encodeURIComponent(`Correction: Rankbox vs ${competitor.name}`)}`}
              className="font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
            >
              Email {LEGAL_CONTACT}
            </a>{" "}
            and we will fix the row.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="min-w-0">
          <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {competitor.sources.map((src, i) => (
              <li key={src.url}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface/60"
                >
                  <span className="w-5 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{src.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {displayUrl(src.url)}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </a>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

/** "https://www.outrank.so/pricing?x=1" → "outrank.so/pricing". */
function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

/* ---------- 10. FAQ ---------- */

export function AlternativeFAQ({ competitor }: { competitor: Competitor }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <Heading
          id="faq-title"
          eyebrow="FAQ"
          title={`Rankbox vs ${competitor.name}, answered`}
          intro={`The questions people ask before switching from ${competitor.name}.`}
        />
        <Reveal delay={0.08} className="mt-14">
          <Accordion
            type="single"
            collapsible
            className="divide-y divide-border rounded-2xl border border-border bg-card px-5"
          >
            {competitor.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 11. Other comparisons ---------- */

/* Internal linking between comparison pages: a visitor weighing one tool is
   almost always weighing two, and these are the highest-intent links on the
   page. */
export function OtherComparisons({ competitor }: { competitor: Competitor }) {
  const others = COMPETITORS.filter((c) => c.slug !== competitor.slug);
  if (others.length === 0) return null;
  return (
    <section
      aria-labelledby="others-title"
      className="border-t border-border bg-surface/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="others-title"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Comparing something else?
          </h2>
          <p className="mt-3 text-muted-foreground">
            The same questions, asked of the other tools founders shortlist.
          </p>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {others.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link
                to="/alternatives/$slug"
                params={{ slug: c.slug }}
                className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevation-lg"
              >
                <CompetitorMark competitor={c} className="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">Rankbox vs {c.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.category}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 12. Closing CTA ---------- */

export function AlternativeCTA({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="cta-title" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-gridlines opacity-[0.07]" />
            <div className="relative">
              <div className="mx-auto mb-6 flex justify-center">
                <VsLockup competitor={competitor} onDark size="sm" />
              </div>
              <h2
                id="cta-title"
                className="font-display mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-background sm:text-4xl"
              >
                {competitor.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-background/70">
                {competitor.ctaBody}
              </p>
              <div className="mt-8 flex justify-center">
                <UrlForm url={url} onChange={setUrl} />
              </div>
              <p className="mt-3 text-sm text-background/60">{TRIAL_LINE}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
