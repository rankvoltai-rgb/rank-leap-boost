/**
 * Sections of the /pricing page, top to bottom, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections.
 *
 * The page's job is to make the price feel small (per-article reframe, the
 * visitor's own freelance rate as the anchor), make starting feel safe (trial
 * timeline, one-click cancel), and keep a CTA within reach at every scroll
 * depth (the plans, the closing band, the sticky bar on phones). The plans
 * themselves are the landing's own cards (PlanCards), so the two pages can
 * never disagree.
 *
 * All numbers come from src/data/pricing.ts.
 */
import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Calculator,
  Check,
  FileCheck,
  HelpCircle,
  Layers,
  Lock,
  Mail,
  Minus,
  MousePointerClick,
  Plus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { PlanCards } from "@/components/landing/PricingBand";
import { Mark } from "@/components/brand/Mark";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  LINE_FILL,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
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

/* Id of the plans band, watched by the sticky mobile bar. */
const PLAN_ID = "pricing";
/* Id of the closing band, where the sticky bar steps aside. */
const FINAL_CTA_ID = "get-started";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/* ---------- Hero ---------- */

/* The landing hero's frame: the promise centred over the dithered mark, and
   the billing facts in a hairline band that closes it. */
export function PricingHero() {
  return (
    <section id="top" aria-labelledby="pricing-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.36] [mask-image:radial-gradient(ellipse_66%_82%_at_50%_50%,#000_50%,transparent_100%)]"
        >
          <MarkDither />
        </div>
        <div className="relative flex flex-col items-center px-5 pb-14 pt-14 text-center sm:px-8 sm:pb-16 sm:pt-16">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Tag}>{TRIAL_DAYS}-day free trial · Cancel anytime</Pill>
          </div>
          <h1
            id="pricing-title"
            className="mt-6 max-w-4xl text-balance font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.3rem] lg:text-[3.9rem]"
            style={rise(0.08)}
          >
            One plan. <Accent>Your entire AI search team.</Accent>
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
            style={rise(0.16)}
          >
            Research, writing, publishing, backlinks, and citation tracking — working every day, for
            less than you'd pay for a single freelance article.
          </p>
        </div>
      </div>
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.24)}>
        <ul
          aria-label="Billing"
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-2 gap-px border-x md:grid-cols-4",
            LINE,
            LINE_FILL,
          )}
        >
          {[
            { icon: Check, text: "Billed monthly" },
            { icon: Check, text: "No contract, no setup fee" },
            { icon: MousePointerClick, text: "Cancel in one click" },
            { icon: Lock, text: "Secured by Stripe" },
          ].map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center justify-center gap-2 bg-white px-3 py-4 text-center text-[0.82rem] text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-cta" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- The plans ---------- */

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

/* The landing's plan cards, then the three promises that make starting
   safe, ruled off in a row of their own. */
export function PricingPlans() {
  return (
    <section id={PLAN_ID} aria-label="Plans" className="scroll-mt-16">
      <Band inner={cn("px-5 py-14 sm:px-8 sm:py-16", PANEL)}>
        <PlanCards />
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className={CELL}>
              <Reveal delay={i * 0.05} className="flex h-full items-start gap-3.5 p-6 sm:p-7">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-cta">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[0.95rem] font-medium text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Trial timeline ---------- */

const STEPS: { when: string; title: string; body: string; icon: LucideIcon }[] = [
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

export function TrialTimeline() {
  return (
    <section aria-labelledby="trial-title">
      <Spacer />
      <SectionHead
        icon={CalendarCheck}
        eyebrow="Zero-risk trial"
        title={
          <span id="trial-title">
            Try the whole engine for {TRIAL_DAYS} days, <Accent>free</Accent>
          </span>
        }
        subtitle="See real articles on your real site before you pay a cent. Here's exactly how it goes."
      />
      <Band>
        <ol className="grid lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const first = i === 0;
            const last = i === STEPS.length - 1;
            return (
              <li
                key={s.when}
                className={cn(
                  "relative border-b lg:border-b-0",
                  !last && "lg:border-r",
                  last && "border-b-0",
                  LINE,
                )}
              >
                <Reveal delay={i * 0.06} className="flex h-full flex-col p-6 sm:p-8">
                  {/* The day, on a track that runs through every step. */}
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        first || last ? "bg-cta text-white" : "bg-cta-soft text-cta",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-ink">
                      {s.when}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[1.02rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </Reveal>
                {/* A joint on the hairline between two days. */}
                {!last && (
                  <span
                    aria-hidden
                    className="absolute -right-3 top-[2.45rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Band>
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
    <div className="grid lg:grid-cols-2">
      <div className="p-6 sm:p-10">
        <p id="rate-label" className="text-[0.95rem] font-medium text-ink">
          What does a writer charge you per article?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag to your rate for a researched, 2,000+ word piece.
        </p>
        <p className="mt-6 font-display text-[3rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
          {formatUsd(rate)}
          <span className="ml-1.5 font-sans text-base font-normal tracking-normal text-muted-foreground">
            / article
          </span>
        </p>
        <SliderPrimitive.Root
          value={[rate]}
          min={RATE_MIN}
          max={RATE_MAX}
          step={25}
          onValueChange={([v]) => setRate(v)}
          className="relative mt-8 flex h-6 w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-ink/[0.07]">
            <SliderPrimitive.Range className="absolute h-full rounded-full bg-cta" />
          </SliderPrimitive.Track>
          {/* role="slider" lives on the thumb, so the label goes here too. */}
          <SliderPrimitive.Thumb
            aria-labelledby="rate-label"
            aria-valuetext={`${formatUsd(rate)} per article`}
            className="block h-5 w-5 cursor-grab rounded-full border-2 border-cta bg-white shadow-[0_1px_3px_rgba(16,24,40,0.2)] transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 active:cursor-grabbing"
          />
        </SliderPrimitive.Root>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>{formatUsd(RATE_MIN)} · budget freelancer</span>
          <span>{formatUsd(RATE_MAX)} · specialist</span>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col justify-center border-t p-6 sm:p-10 lg:border-l lg:border-t-0",
          LINE,
          PANEL,
        )}
        aria-live="polite"
      >
        <div>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              Hiring out {PLAN.articlesPerMonth} articles
            </span>
            <span className="font-medium text-ink tabular-nums">{formatUsd(hireOut)}/mo</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
            <div className="h-full w-full rounded-full bg-ink/25" />
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              Rankbox — {PLAN.articlesPerMonth} articles <em className="not-italic">and</em>{" "}
              everything else
            </span>
            <span className="font-medium text-cta tabular-nums">{formatUsd(ours)}/mo</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
            <div
              className="h-full rounded-full bg-cta transition-[width] duration-300 ease-out"
              style={{ width: `${oursWidth}%` }}
            />
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
          <p className="text-sm text-muted-foreground">You'd keep</p>
          <p className="mt-1 font-display text-[2.4rem] font-medium leading-none tracking-[-0.035em] text-ink tabular-nums">
            {formatUsd(saving)}
            <span className="ml-1.5 whitespace-nowrap font-sans text-base font-normal tracking-normal text-cta">
              every month
            </span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
          "inline-flex h-5 w-5 items-center justify-center rounded-full",
          highlight ? "bg-cta text-white" : "bg-ink/[0.06] text-ink/70",
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center text-muted-foreground/50">
        <Minus className="h-4 w-4" />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  return (
    <span className={cn("text-sm", highlight ? "font-medium text-ink" : "text-muted-foreground")}>
      {value}
    </span>
  );
}

/* The alternatives as a hairline table. Rankbox's column carries the soft
   blue key from top to bottom; the rest stay white. */
function ComparisonTable() {
  return (
    // Scrolls inside its own box on narrow screens; the row labels stay
    // pinned. `relative` keeps the cells' sr-only labels inside the clip.
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <caption className="sr-only">Rankbox compared with the alternatives</caption>
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 z-10 w-[26%] bg-white px-6 py-5">
              <span className="sr-only">Feature</span>
            </th>
            {ALTERNATIVES.map((name, i) => (
              <th
                key={name}
                scope="col"
                className={cn(
                  "border-l px-5 py-5 text-sm font-medium",
                  LINE,
                  i === 0 ? "bg-[color-mix(in_oklab,var(--cta)_6%,white)] text-cta" : "text-ink",
                )}
              >
                <span className="flex items-center gap-2">
                  {i === 0 && <Mark className="h-4 w-4 text-brand-blue" />}
                  {name}
                </span>
                {i === 0 && (
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    Everything included
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map((row) => (
            <tr key={row.label} className={cn("border-t", LINE)}>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-6 py-4 text-sm font-normal text-ink"
              >
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td
                  key={i}
                  className={cn(
                    "border-l px-5 py-4 align-middle",
                    LINE,
                    i === 0 && "bg-[color-mix(in_oklab,var(--cta)_4%,white)]",
                  )}
                >
                  <CellValue value={cell} highlight={i === 0} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TheMath() {
  return (
    <section aria-labelledby="math-title">
      <Spacer />
      <SectionHead
        icon={Calculator}
        eyebrow="Do the math"
        title={
          <span id="math-title">
            What {PLAN.articlesPerMonth} great articles a month <Accent>really cost</Accent>
          </span>
        }
        subtitle="Price it at your own rate. Then see everything else that comes with Rankbox, and what it would take to get it anywhere else."
      />
      <Band>
        <Reveal>
          <CostCalculator />
        </Reveal>
      </Band>
      <Band>
        <ComparisonTable />
      </Band>
      <Band inner="px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Agency and freelance figures are typical market ranges, not quotes. Freelance cost assumes{" "}
          {PLAN.articlesPerMonth} articles at $150 or more each.
        </p>
      </Band>
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
    <section aria-labelledby="included-title">
      <Spacer />
      <SectionHead
        icon={Layers}
        eyebrow="Everything included"
        title={
          <span id="included-title">
            Every feature, <Accent>in the one plan</Accent>
          </span>
        }
        subtitle="No tiers to compare and no add-ons to unlock. The full engine, from the first question researched to the last citation tracked."
      />
      <Band>
        {/* Two-up name tiles on phones, so eight features don't become a
            1,600px column; taglines and links return from sm up. */}
        <CellGrid className="grid-cols-2 lg:grid-cols-4">
          {ORDERED.map((f, i) => {
            const Icon = f.icon;
            return (
              <li key={f.slug} className={CELL}>
                <Reveal delay={(i % 4) * 0.05} className="h-full">
                  <Link
                    to="/features/$slug"
                    params={{ slug: f.slug }}
                    className="group flex h-full flex-col p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/[0.045] text-ink/75 transition-colors group-hover:bg-cta-soft group-hover:text-cta">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-cta">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Included</span>
                      </span>
                    </div>
                    <h3 className="mt-4 text-[0.92rem] font-semibold tracking-tight text-ink">
                      {f.name}
                    </h3>
                    <p className="mt-1 hidden flex-1 text-[0.82rem] leading-relaxed text-muted-foreground sm:block">
                      {f.tagline}
                    </p>
                    <span className="mt-4 hidden items-center gap-1 text-xs font-medium text-ink/70 transition-colors group-hover:text-cta sm:inline-flex">
                      How it works
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </CellGrid>
      </Band>
      <Band
        inner={cn(
          "flex flex-col items-center gap-3 px-6 py-5 sm:flex-row sm:justify-center sm:gap-4",
          PANEL,
        )}
      >
        <p className="shrink-0 text-sm font-medium text-ink">Also included:</p>
        <ul className="flex flex-wrap justify-center gap-2">
          {EXTRAS.map((x) => (
            <li
              key={x}
              className="inline-flex items-center gap-1.5 rounded-md border border-ink/[0.08] bg-white px-2.5 py-1 text-xs font-medium text-ink"
            >
              <Check className="h-3 w-3 text-cta" strokeWidth={3} />
              {x}
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* The landing's FAQ: the title on the left, the questions down the right. */
export function PricingFAQ() {
  return (
    <section id="faq" className="scroll-mt-16">
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
              Billing FAQ
            </Pill>
            <h2 className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
              Straight answers <Accent>about paying</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              No fine print. If something here isn't clear, ask us and a real person will answer.
            </p>
            <a href={`mailto:${LEGAL_CONTACT}`} className={cn(GHOST_BUTTON, "mt-6 w-fit")}>
              <Mail className="h-3.5 w-3.5" /> Email us
            </a>
            <p className="mt-5 text-sm text-muted-foreground">
              Read the full{" "}
              <Link
                to="/legal/refunds"
                className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
              >
                refund & cancellation policy
              </Link>
              .
            </p>
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="divide-y divide-ink/[0.07]"
            >
              {PRICING_FAQS.map((f, i) => (
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

/* ---------- Closing band ---------- */

/* The landing's closing band, with the first invoice rising from its foot:
   what today costs, and what day seven does. */
function FirstInvoice() {
  return (
    <div
      aria-hidden
      className="rounded-t-xl border border-b-0 border-white/20 bg-white p-5 text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[0.82rem] font-semibold text-ink">
          <Mark className="h-4 w-4 text-brand-blue" />
          Rankbox {PLAN.name}
        </span>
        <span className="rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Your first {TRIAL_DAYS} days
        </span>
      </div>
      <div className={cn("mt-4 divide-y rounded-lg border", LINE, "divide-ink/[0.07]")}>
        <div className="flex items-center justify-between px-3.5 py-2.5 text-[0.82rem]">
          <span className="text-muted-foreground">Today · free trial starts</span>
          <span className="font-medium text-ink tabular-nums">{formatUsd(0)}</span>
        </div>
        <div className="flex items-center justify-between px-3.5 py-2.5 text-[0.82rem]">
          <span className="text-muted-foreground">
            {PLAN.articlesPerMonth} articles · {PLAN.backlinkCreditsPerMonth} backlink credits
          </span>
          <span className="text-muted-foreground">Included</span>
        </div>
        <div className="flex items-center justify-between bg-cta-soft/60 px-3.5 py-2.5 text-[0.82rem]">
          <span className="font-medium text-ink">Day {TRIAL_DAYS} · if you stay</span>
          <span className="font-semibold text-cta tabular-nums">{afterTrialCopy()}</span>
        </div>
      </div>
    </div>
  );
}

export function PricingFinalCTA() {
  const [url, setUrl] = useState("");
  return (
    <section id={FINAL_CTA_ID} aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <div className="relative px-5 pt-16 text-center sm:px-8 sm:pt-20">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
            <h2
              id="cta-title"
              className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              Be the answer AI recommends — starting this week
            </h2>
            <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              Drop in your URL. In a few minutes you'll have a researched content plan, free, with
              no card needed.
            </p>
            <div className="mt-8 flex w-full justify-center">
              <UrlForm url={url} onChange={setUrl} />
            </div>
            <p className="mt-4 text-[0.82rem] text-white">
              {TRIAL_DAYS} days free, then {afterTrialCopy()} · Cancel anytime
            </p>
          </Reveal>
          {/* The invoice rises from the band's foot and is cut off by it. */}
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[10.5rem] max-w-md overflow-hidden sm:mt-14"
          >
            <FirstInvoice />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}

/* ---------- Sticky mobile CTA ---------- */

/**
 * On phones the plans scroll away after a screen or two. This bar keeps the
 * price and the CTA within thumb reach from there until the closing band,
 * where it steps aside so the page never shows two at once.
 */
export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const plan = document.getElementById(PLAN_ID);
    const end = document.getElementById(FINAL_CTA_ID);
    if (!plan || !end) return;
    // Read positions on scroll rather than observing crossings: a jump (an
    // anchor link, a fling from the footer) can skip right over the closing
    // band without it ever intersecting, which left an observer-driven bar
    // hidden.
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
        "fixed inset-x-0 bottom-0 z-40 border-t border-ink/[0.08] bg-white/95 px-4 pt-3 shadow-[0_-8px_24px_-12px_rgba(16,24,40,0.18)] backdrop-blur transition-transform duration-300 ease-out lg:hidden",
        "pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-ink tabular-nums">
            {formatUsd(price.perMonth)}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {TRIAL_DAYS} days free · Cancel anytime
          </p>
        </div>
        <a
          href="/auth"
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-cta px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)]"
        >
          Start free trial <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
