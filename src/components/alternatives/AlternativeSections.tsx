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
import { Reveal, Eyebrow, Avatar, Stars, StatCard } from "@/components/landing/shared";
import { PixelField, CARD_PIXELS, UrlForm, TrustRow } from "@/components/landing/Hero";
import { ChatAnswerCard } from "@/components/landing/chat";
import { TESTIMONIALS } from "@/components/landing/Testimonials";
import { SHOWCASES } from "@/components/features/showcase";
import { getFeature } from "@/data/features";
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";
import { cn } from "@/lib/utils";
import {
  COMPETITORS,
  RANKBOX_COST,
  costPerArticle,
  formatCheckedOn,
  type Competitor,
} from "@/data/alternatives";
import { CompetitorMark, RankboxMark, ScoreBar, VsLockup } from "./kit";

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

/* ---------- 1. Hero ---------- */

/* The hero's right-hand panel: the whole argument as five bars. Deliberately
   not a clean sweep — the rows where they beat us are left visibly higher,
   because a comparison that wins every row reads as marketing and gets
   discounted wholesale. */
function Scorecard({ competitor }: { competitor: Competitor }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">Where each one is strong</p>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/80">
          Our read
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {competitor.scores.map((s, i) => {
          const weLead = s.rankbox >= s.them;
          return (
            <div key={s.label}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-xs font-medium text-white/85">{s.label}</p>
                <span
                  className={cn(
                    "shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.1em]",
                    weLead ? "text-white" : "text-white/55",
                  )}
                >
                  {weLead ? "Rankbox" : competitor.name}
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2">
                  <RankboxMark className="h-4 w-4" onDark />
                  <ScoreBar value={s.rankbox} tone="us" delay={i * 0.07} />
                </div>
                <div className="flex items-center gap-2">
                  <CompetitorMark
                    competitor={competitor}
                    onDark
                    className="h-4 w-4 text-[0.55rem]"
                  />
                  <ScoreBar value={s.them} tone="them" delay={i * 0.07 + 0.05} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 border-t border-white/15 pt-4 text-[0.7rem] leading-relaxed text-white/60">
        Our assessment of what each product is designed to do well — not a benchmark. The row-level
        detail is{" "}
        <a href="#compare" className="font-semibold text-white/85 underline underline-offset-2">
          further down the page
        </a>
        .
      </p>
    </div>
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
                className="font-display text-balance text-[2.15rem] font-bold leading-[1.07] tracking-tight text-white sm:text-[3rem] xl:text-[3.4rem]"
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
                <p className="text-sm text-white/70">
                  No credit card required · Free {TRIAL_DAYS}-day trial
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.32} className="mt-8 flex justify-center lg:justify-start">
              <TrustRow />
            </Reveal>
          </div>

          {/* RIGHT */}
          <Reveal delay={0.3} y={28} className="mx-auto w-full min-w-0 max-w-lg lg:mx-0">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-12">
                <PixelField pixels={CARD_PIXELS} seed={7} />
              </div>
              <div className="relative">
                <Scorecard competitor={competitor} />
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
                  <p className="text-xs text-muted-foreground">An engine, not an editor</p>
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
          title="The number that matters is per published article"
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
                {PLAN.articlesPerMonth} researched, scored, and published articles
              </p>
              <div className="relative mt-6 rounded-2xl bg-white/12 p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/60">
                  Per published article
                </p>
                <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                  {formatUsd(RANKBOX_COST.perArticle)}
                </p>
              </div>
              <ul className="relative mt-6 space-y-2.5 text-sm text-white/80">
                {[
                  "Research, writing, scoring, and publishing included",
                  `${PLAN.backlinkCreditsPerMonth} backlink credits a month`,
                  "Unlimited seats and unlimited rewrites",
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
                  Per published article
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

        <Reveal delay={0.12}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
            {competitor.name} list price taken from their public pricing page on{" "}
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
          title={`Three things Rankbox does that ${competitor.name} doesn't set out to`}
          intro="Not a longer list of features — the three that change what actually happens on your site."
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

/* ---------- 9. Proof ---------- */

export function AlternativeProof({ competitor }: { competitor: Competitor }) {
  const picks = competitor.proof
    .map((name) => TESTIMONIALS.find((t) => t.n === name))
    .filter((t): t is (typeof TESTIMONIALS)[number] => Boolean(t));
  const [lead, ...rest] = picks;

  return (
    <section id="proof" aria-labelledby="proof-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="proof-title"
          eyebrow="Founders who switched"
          title="What changed after the swap"
          intro="Teams across SaaS, e-commerce, and services run Rankbox instead of stitching a writer, an SEO tool, and a publishing workflow together."
        />

        {lead && (
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <figure className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-brand-blue p-8 text-white sm:p-10">
                <PixelField seed={3} />
                <div className="relative">
                  <Stars />
                  <blockquote className="mt-6 text-balance font-display text-2xl font-semibold leading-snug tracking-tight sm:text-[2rem] sm:leading-[1.25]">
                    &ldquo;{lead.q}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="relative mt-10 flex items-center gap-3">
                  <Avatar name={lead.n} src={lead.a} className="h-11 w-11 ring-white/30" />
                  <div>
                    <p className="text-sm font-semibold">{lead.n}</p>
                    <p className="text-xs text-white/70">
                      {lead.r} · {lead.c}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>

            <div className="flex flex-col gap-6">
              {rest.map((t, i) => (
                <Reveal key={t.n} delay={0.06 * (i + 1)} className="flex-1">
                  <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elevation-lg">
                    <Stars className="mb-3" />
                    <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-ink">
                      &ldquo;{t.q}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                      <Avatar name={t.n} src={t.a} className="h-10 w-10" />
                      <div>
                        <p className="text-sm font-semibold text-ink">{t.n}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.r} · {t.c}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard value="400+" label="Active founders" />
            <StatCard value="4.8/5" label="Average rating" />
            <StatCard value="60K+" label="Articles published" />
            <StatCard value="Daily" label="Auto-published content" />
          </div>
        </Reveal>
      </div>
    </section>
  );
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
              <p className="mt-3 text-sm text-background/60">
                No credit card required · Free {TRIAL_DAYS}-day trial · Cancel anytime
              </p>
              <div className="mx-auto mt-12 max-w-xl text-left [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
                <ChatAnswerCard
                  engine="Perplexity"
                  prompt={`What's a good ${competitor.name} alternative for a small team?`}
                  meta="Searched 28 sources · writing answer"
                  answer={
                    <>
                      For a lean team that wants articles published rather than drafted,{" "}
                      <span className="font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2">
                        Rankbox
                      </span>{" "}
                      handles research, writing, and publishing end to end.
                    </>
                  }
                  sources={["rankbox.xyz", "yardstick.team"]}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
