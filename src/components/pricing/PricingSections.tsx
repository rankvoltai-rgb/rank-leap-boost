/**
 * Sections of the /pricing page, top to bottom.
 *
 * The page sells one plan, so it never asks the visitor to choose between
 * tiers. Its job is to make the one price feel small (per-article reframe, the
 * visitor's own freelance rate as the anchor), make starting feel safe (trial
 * timeline, one-click cancel), and keep a CTA within reach at every scroll
 * depth (plan card, final CTA, sticky mobile bar).
 *
 * All numbers come from src/data/pricing.ts.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  FileCheck,
  Lock,
  Mail,
  Minus,
  MousePointerClick,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Eyebrow, Avatar, Stars, StatCard } from "@/components/landing/shared";
import { PixelField, UrlForm } from "@/components/landing/Hero";
import { AI_MARKS } from "@/components/landing/ai-logos";
import { TESTIMONIALS } from "@/components/landing/Testimonials";
import { AVATARS } from "@/components/landing/avatars";
import { LEGAL_CONTACT } from "@/components/legal/legal-ui";
import { ENGINE_ORDER, getFeature, type Feature } from "@/data/features";
import {
  PLAN,
  PRICING_FAQS,
  TRIAL_DAYS,
  afterTrialCopy,
  formatUsd,
  priceFor,
} from "@/data/pricing";
import { cn } from "@/lib/utils";

/* Id of the plan card, watched by the sticky mobile bar. */
const PLAN_ID = "pricing";
/* Id of the closing CTA, where the sticky bar steps aside. */
const FINAL_CTA_ID = "get-started";

/* ---------- Hero ---------- */

export function PricingHero() {
  return (
    <section
      id="top"
      aria-labelledby="pricing-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      {/* The bottom padding is the strip the plan card overlaps into. */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pb-40 pt-14 text-center sm:pb-44 sm:pt-16">
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {TRIAL_DAYS}-day free trial · Cancel anytime
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="pricing-title"
            className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
          >
            One plan. Your entire AI search team.
          </h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-white/80">
            Research, writing, publishing, backlinks, and citation tracking — working every day, for
            less than you'd pay for a single freelance article.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Plan card ---------- */

const PROOF_FACES = ["Owen Carter", "Priya Raman", "Aman Desai", "Elise Tanaka", "Marco Silva"];

const INCLUDED: { lead: string; rest: string }[] = [
  { lead: "Answer-space research", rest: "the questions your buyers ask AI" },
  { lead: "Your brand voice,", rest: "scored for SEO and GEO before it ships" },
  { lead: "Auto-published", rest: "to your site, with images and internal links" },
  { lead: "Citation tracking", rest: "across ChatGPT, Perplexity, Gemini and Google" },
  { lead: "Reddit presence,", rest: "helpful replies you approve" },
  { lead: "Unlimited", rest: "rewrites and team members" },
];

function Metric({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-1">
      <p className="font-display text-3xl font-bold tracking-tight text-ink tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug text-ink">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

export function PlanCard() {
  const price = priceFor();

  return (
    <section
      id={PLAN_ID}
      aria-label={`${PLAN.name} plan`}
      className="relative z-10 -mt-32 scroll-mt-24 px-5 sm:-mt-36"
    >
      <Reveal y={28} className="mx-auto max-w-5xl">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-4 lg:grid-cols-[1fr_1.08fr]">
          {/* LEFT — price and the one decision */}
          <div className="flex flex-col p-7 sm:p-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-semibold tracking-tight text-ink">{PLAN.name}</h2>
              <span className="rounded-full border border-volt/25 bg-volt/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-volt">
                Everything included
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              For founders who want AI search traffic on autopilot · {PLAN.sites} website
            </p>

            <div className="mt-7" aria-live="polite">
              <div className="flex flex-wrap items-end gap-x-2.5 gap-y-1">
                <span className="font-display text-6xl font-bold leading-none tracking-tight text-ink tabular-nums sm:text-7xl">
                  {formatUsd(price.perMonth)}
                </span>
                <span className="mb-1.5 text-base font-medium text-muted-foreground">/month</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Billed monthly · no contract, no setup fee
              </p>
              <p className="mt-4 inline-block rounded-lg bg-surface px-3 py-1.5 text-sm text-muted-foreground ring-1 ring-border">
                Works out to{" "}
                <span className="font-semibold text-ink tabular-nums">
                  {formatUsd(price.perArticle)}
                </span>{" "}
                per article, all-in
              </p>
            </div>

            {/* CTA sits right under the price so it clears the fold on a laptop. */}
            <a
              href="/auth"
              className="group mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 text-base font-semibold text-background shadow-2 transition-all hover:-translate-y-0.5 hover:shadow-3 focus-visible:outline-none focus-visible:ring-focus"
            >
              Start your {TRIAL_DAYS}-day free trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <ul className="mt-3.5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" /> No charge today
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" /> Cancel in one click
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Secured by Stripe
              </li>
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-volt/25 bg-volt/[0.06] p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-volt text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">
                  Your first {TRIAL_DAYS} days are free
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Nothing is charged today. After the trial it is {formatUsd(PLAN.monthly)} a month,
                  cancelable in one click.
                </p>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="flex items-center gap-3 border-t border-border pt-6">
                <div className="flex -space-x-2">
                  {PROOF_FACES.map((n, i) => (
                    <Avatar key={n} name={n} src={AVATARS[i]} className="h-9 w-9" />
                  ))}
                </div>
                <div>
                  <Stars />
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-ink">4.8/5</span> from 400+ founders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — what the price buys, quantified */}
          <div className="border-t border-border bg-surface/70 p-7 sm:p-10 lg:border-l lg:border-t-0">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Every month, on autopilot
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric
                value={String(PLAN.articlesPerMonth)}
                label="Articles written & published"
                sub="One a day · 2,000–3,500 words"
              />
              <Metric
                value={String(PLAN.backlinkCreditsPerMonth)}
                label="Authority backlink credits"
                sub="Verified, dofollow links"
              />
            </div>
            <ul className="mt-6 space-y-3">
              {INCLUDED.map((item) => (
                <li key={item.lead} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-ink">{item.lead}</span> {item.rest}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-7 border-t border-border pt-5">
              <p className="text-xs text-muted-foreground">Written to be the answer on</p>
              <ul className="mt-3 flex flex-wrap items-center gap-2">
                {AI_MARKS.map(({ name, Mark }) => (
                  <li
                    key={name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-1.5 pr-2.5 text-xs font-medium text-ink"
                  >
                    <Mark className="h-4 w-4" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Trial timeline ---------- */

const PROMISES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: `Nothing to pay for ${TRIAL_DAYS} days`,
    body: "Your card is only charged if you're still on the plan when the trial ends.",
  },
  {
    icon: MousePointerClick,
    title: "Cancel in one click",
    body: "Straight from your billing portal, anytime. No emails, no calls, no retention maze.",
  },
  {
    icon: FileCheck,
    title: "Keep what's published",
    body: "Every article stays live on your site. It's your content, whatever you decide.",
  },
];

export function TrialTimeline() {
  const steps: { when: string; title: string; body: string; icon: LucideIcon }[] = [
    {
      when: "Today",
      title: "Build your plan, free",
      body: "Add your site. We map the questions your buyers ask and draft your content plan. No card needed.",
      icon: Sparkles,
    },
    {
      when: "Day 1",
      title: "Start your free trial",
      body: "Switch on autopilot and your first article is researched, written, and scored. No charge today.",
      icon: Rocket,
    },
    {
      when: `Days 2–${TRIAL_DAYS - 1}`,
      title: "Watch it compound",
      body: "A fresh article every day, backlinks building, and AI citations tracked in your dashboard.",
      icon: TrendingUp,
    },
    {
      when: `Day ${TRIAL_DAYS}`,
      title: "Keep going, or don't",
      body: `Stay on for ${afterTrialCopy()}. Or cancel before then and pay nothing.`,
      icon: CalendarCheck,
    },
  ];

  return (
    <section aria-labelledby="trial-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Zero-risk trial</Eyebrow>
          <h2
            id="trial-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Try the whole engine for {TRIAL_DAYS} days, free
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            See real articles on your real site before you pay a cent. Here's exactly how it goes.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <ol className="relative mt-14 grid gap-8 lg:grid-cols-4 lg:gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const first = i === 0;
              const last = i === steps.length - 1;
              return (
                <li key={s.when} className="relative flex gap-4 lg:flex-col lg:gap-0">
                  {/* Connector to the next marker: down on mobile, across on
                      desktop, where it stops half a gap short of the next step. */}
                  {!last && (
                    <>
                      <span
                        aria-hidden
                        className="absolute -bottom-8 left-5 top-12 w-px bg-border lg:hidden"
                      />
                      <span
                        aria-hidden
                        className="absolute -right-3 left-[3.25rem] top-5 hidden h-px bg-border lg:block"
                      />
                    </>
                  )}
                  <span
                    className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-1",
                      first && "border-brand-blue bg-brand-blue text-white",
                      last && "border-ink bg-ink text-background",
                      !first && !last && "border-border bg-card text-ink",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="lg:mt-5 lg:pr-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-volt">
                      {s.when}
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {PROMISES.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="flex h-full items-start gap-3.5 rounded-2xl border border-border bg-card p-5 shadow-elevation">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/12 text-success">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- The math: calculator + alternatives ---------- */

const RATE_MIN = 50;
const RATE_MAX = 500;
const RATE_DEFAULT = 200;

function CostCalculator() {
  const [rate, setRate] = useState(RATE_DEFAULT);
  const hireOut = rate * PLAN.articlesPerMonth;
  const ours = PLAN.monthly;
  const saving = hireOut - ours;
  // Floor the bar so Rankbox's sliver stays visible against $15k.
  const oursWidth = Math.max((ours / hireOut) * 100, 2);

  return (
    <div className="grid gap-10 rounded-3xl border border-border bg-card p-6 shadow-2 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
      <div>
        <p id="rate-label" className="text-sm font-semibold text-ink">
          What does a writer charge you per article?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag to your rate for a researched, 2,000+ word piece.
        </p>
        <p className="font-display mt-6 text-5xl font-bold tracking-tight text-ink tabular-nums">
          {formatUsd(rate)}
          <span className="ml-1.5 text-base font-medium text-muted-foreground">/ article</span>
        </p>
        <SliderPrimitive.Root
          value={[rate]}
          min={RATE_MIN}
          max={RATE_MAX}
          step={25}
          onValueChange={([v]) => setRate(v)}
          className="relative mt-7 flex h-6 w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand-blue" />
          </SliderPrimitive.Track>
          {/* role="slider" lives on the thumb, so the label goes here too. */}
          <SliderPrimitive.Thumb
            aria-labelledby="rate-label"
            aria-valuetext={`${formatUsd(rate)} per article`}
            className="block h-6 w-6 cursor-grab rounded-full border-2 border-brand-blue bg-card shadow-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-focus active:cursor-grabbing"
          />
        </SliderPrimitive.Root>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>{formatUsd(RATE_MIN)} · budget freelancer</span>
          <span>{formatUsd(RATE_MAX)} · specialist</span>
        </div>
      </div>

      <div className="flex flex-col justify-center" aria-live="polite">
        <div>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              Hiring out {PLAN.articlesPerMonth} articles
            </span>
            <span className="font-semibold text-ink tabular-nums">{formatUsd(hireOut)}/mo</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full rounded-full bg-muted-foreground/45" />
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              Rankbox — {PLAN.articlesPerMonth} articles <em className="not-italic">and</em>{" "}
              everything else
            </span>
            <span className="font-semibold text-brand-blue tabular-nums">{formatUsd(ours)}/mo</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand-blue transition-[width] duration-300 ease-out"
              style={{ width: `${oursWidth}%` }}
            />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-success/25 bg-success/[0.07] p-5">
          <p className="text-sm text-muted-foreground">You'd keep</p>
          <p className="font-display mt-1 text-4xl font-bold tracking-tight text-success tabular-nums">
            {formatUsd(saving)}
            <span className="ml-1.5 text-base font-semibold">every month</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            That's {formatUsd(saving * 12)} a year — before counting the research, publishing,
            backlinks, and citation tracking a writer doesn't do.
          </p>
        </div>
      </div>
    </div>
  );
}

/* true = included, false = not offered, string = the specifics. */
type Cell = boolean | string;

const ALTERNATIVES = ["Rankbox", "SEO agency", "Freelance writers", "DIY with ChatGPT"] as const;

const COMPARISON: { label: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  {
    label: "Monthly cost",
    cells: [formatUsd(PLAN.monthly), "$3,000–$10,000", "$4,500+", "$20 + your time"],
  },
  {
    label: "Articles per month",
    cells: [
      `${PLAN.articlesPerMonth}, published for you`,
      "4–8, typically",
      "What you pay for",
      "What you find time for",
    ],
  },
  { label: "Research into what buyers ask AI", cells: [true, true, false, false] },
  { label: "Structured to get cited by AI", cells: [true, "Sometimes", "Rarely", false] },
  { label: "Published to your site automatically", cells: [true, false, false, false] },
  {
    label: "Authority backlinks",
    cells: [`${PLAN.backlinkCreditsPerMonth} credits / month`, "Extra fee", false, false],
  },
  { label: "AI citation tracking", cells: [true, "Sometimes", false, false] },
  {
    label: "Your time each week",
    cells: ["Minutes", "Calls & approvals", "Briefs & edits", "20+ hours"],
  },
  { label: "Commitment", cells: ["Cancel anytime", "3–12 month retainer", "Per project", "None"] },
];

function CellValue({ value, highlight }: { value: Cell; highlight: boolean }) {
  if (value === true) {
    return (
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full",
          highlight ? "bg-brand-blue text-white" : "bg-success/15 text-success",
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center text-muted-foreground/60">
        <Minus className="h-4 w-4" />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  return (
    <span className={cn("text-sm", highlight ? "font-semibold text-ink" : "text-muted-foreground")}>
      {value}
    </span>
  );
}

function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevation">
      {/* Scrolls inside its own box on narrow screens; the row labels stay pinned.
          `relative` makes this the containing block for the cells' absolutely
          positioned sr-only labels — without it they escape the clip and widen
          the whole page on mobile. */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">Rankbox compared with the alternatives</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-[26%] bg-card p-5">
                <span className="sr-only">Feature</span>
              </th>
              {ALTERNATIVES.map((name, i) => (
                <th
                  key={name}
                  scope="col"
                  className={cn(
                    "p-5 text-sm font-semibold",
                    i === 0 ? "bg-brand-blue text-white" : "text-ink",
                  )}
                >
                  {name}
                  {i === 0 && (
                    <span className="mt-0.5 block text-xs font-medium text-white/75">
                      Everything included
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card p-5 text-sm font-medium text-ink"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td key={i} className={cn("p-5 align-middle", i === 0 && "bg-brand-blue/[0.05]")}>
                    <CellValue value={cell} highlight={i === 0} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TheMath() {
  return (
    <section
      aria-labelledby="math-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Do the math</Eyebrow>
          <h2
            id="math-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            What {PLAN.articlesPerMonth} great articles a month really cost
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Price it at your own rate. Then see everything else that comes with Rankbox, and what
            it would take to get it anywhere else.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          <CostCalculator />
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <ComparisonTable />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Agency and freelance figures are typical market ranges, not quotes. Freelance cost
            assumes {PLAN.articlesPerMonth} articles at $150 or more each.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Everything included ---------- */

const ORDERED = ENGINE_ORDER.map((slug) => getFeature(slug)).filter((f): f is Feature =>
  Boolean(f),
);

const EXTRAS = [
  "Unlimited rewrites",
  "Unlimited team members",
  "100+ languages",
  "Auto images & internal links",
  "Optional approval before publishing",
  "REST API access",
];

export function IncludedFeatures() {
  return (
    <section aria-labelledby="included-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Everything included</Eyebrow>
          <h2
            id="included-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Every feature, in the one plan
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            No tiers to compare and no add-ons to unlock. The full engine, from the first question
            researched to the last citation tracked.
          </p>
        </Reveal>

        {/* Two-up name tiles on phones, so eight features don't become a
            1,600px column; taglines and links return from sm up. */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {ORDERED.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.slug} delay={(i % 4) * 0.05}>
                <Link
                  to="/features/$slug"
                  params={{ slug: f.slug }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg sm:p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-background transition-colors group-hover:bg-brand-blue">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-success">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      <span className="sr-only sm:not-sr-only">Included</span>
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-ink sm:mt-4 sm:text-[0.95rem]">
                    {f.name}
                  </h3>
                  <p className="mt-1.5 hidden flex-1 text-sm leading-relaxed text-muted-foreground sm:block">
                    {f.tagline}
                  </p>
                  <span className="mt-4 hidden items-center gap-1 text-xs font-semibold text-ink sm:inline-flex">
                    How it works
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface/50 p-5 sm:flex-row sm:justify-center">
            <p className="shrink-0 text-sm font-semibold text-ink">Also included:</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {EXTRAS.map((x) => (
                <li
                  key={x}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-ink"
                >
                  <Check className="h-3 w-3 text-success" strokeWidth={3} />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Proof ---------- */

/* The quotes that speak to cost and replacing people or tools. */
const PICKS = ["Marco Silva", "Daniel Okafor", "Hannah Whitfield"];
const QUOTES = PICKS.map((n) => TESTIMONIALS.find((t) => t.n === n)).filter(
  (t): t is (typeof TESTIMONIALS)[number] => Boolean(t),
);

export function PricingProof() {
  return (
    <section
      id="proof"
      aria-labelledby="proof-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Founders who did the math</Eyebrow>
          <h2
            id="proof-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Fewer invoices. More citations.
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Founders swap writers, SEO tools, and agency retainers for one engine that ships every
            day.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
          <StatCard value="400+" label="Founders on Rankbox" />
          <StatCard value="4.8/5" label="Average rating" />
          <StatCard value="60K+" label="Articles published" />
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {QUOTES.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.06}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation">
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
    </section>
  );
}

/* ---------- FAQ ---------- */

export function PricingFAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow className="mb-4">Billing FAQ</Eyebrow>
          <h2
            id="faq-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Straight answers about paying
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No fine print. If something here isn't clear, ask us and a real person will answer.
          </p>
          <a
            href={`mailto:${LEGAL_CONTACT}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-ink shadow-1 transition-all hover:-translate-y-0.5 hover:shadow-2"
          >
            <Mail className="h-4 w-4" /> Email us
          </a>
          <p className="mt-6 text-sm text-muted-foreground">
            Read the full{" "}
            <Link to="/legal/refunds" className="font-medium text-ink underline underline-offset-2">
              refund & cancellation policy
            </Link>
            .
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="divide-y divide-border rounded-2xl border border-border bg-card px-5"
          >
            {PRICING_FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="pr-6 text-sm leading-relaxed text-muted-foreground"
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

/* ---------- Final CTA ---------- */

export function PricingFinalCTA() {
  const [url, setUrl] = useState("");
  return (
    <section id={FINAL_CTA_ID} aria-labelledby="cta-title" className="px-5 pb-24 sm:pb-28">
      <Reveal className="mx-auto max-w-6xl">
        {/* Near-black, not blue: the brand-blue footer sits directly below. */}
        <div className="relative overflow-hidden rounded-3xl bg-hero-black px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <PixelField seed={4} />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <h2
              id="cta-title"
              className="font-display text-balance text-3xl font-bold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]"
            >
              Be the answer AI recommends — starting this week
            </h2>
            <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-white/80">
              Drop in your URL. In a few minutes you'll have a researched content plan, free, with
              no card needed.
            </p>
            <div className="mt-8 flex w-full justify-center">
              <UrlForm url={url} onChange={setUrl} />
            </div>
            <p className="mt-4 text-sm text-white/70">
              {TRIAL_DAYS} days free, then {afterTrialCopy()} · Cancel anytime
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Sticky mobile CTA ---------- */

/**
 * On phones the plan card scrolls away after one screen. This bar keeps the
 * price and the CTA within thumb reach from there until the closing CTA,
 * where it steps aside so the page never shows two at once.
 */
export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const plan = document.getElementById(PLAN_ID);
    const end = document.getElementById(FINAL_CTA_ID);
    if (!plan || !end) return;
    // Read positions on scroll rather than observing crossings: a jump (an
    // anchor link, a fling from the footer) can skip right over the final CTA
    // without it ever intersecting, which left an observer-driven bar hidden.
    let frame = 0;
    const update = () => {
      frame = 0;
      const pastPlan = plan.getBoundingClientRect().bottom < 0;
      const beforeEnd = end.getBoundingClientRect().top > window.innerHeight;
      setVisible(pastPlan && beforeEnd);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  const price = priceFor();

  return (
    <div
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 pt-3 shadow-4 backdrop-blur transition-transform duration-300 ease-out lg:hidden",
        "pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-bold text-ink tabular-nums">
            {formatUsd(price.perMonth)}
            <span className="text-sm font-medium text-muted-foreground">/month</span>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {TRIAL_DAYS} days free · Cancel anytime
          </p>
        </div>
        <a
          href="/auth"
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 text-sm font-semibold text-background shadow-2"
        >
          Start free trial <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
