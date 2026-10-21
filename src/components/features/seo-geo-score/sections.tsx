/**
 * The sections of /features/seo-geo-score, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections,
 * white throughout. All copy is the feature's entry in data/features.ts; these
 * only decide how it's set. The pictures live in score-desk.tsx (the focal
 * one), pictures.tsx and gate.tsx.
 */
import { useState, type CSSProperties, type ComponentType, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Columns2,
  HelpCircle,
  ListChecks,
  Route,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import {
  Accent,
  Band,
  LINE,
  LINE_FILL,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import type { Feature, FeatureBenefit } from "@/data/features";
import { ScoreDesk } from "./score-desk";
import { GateLine } from "./gate";
import { DialArcs, DotGrid, DualDial } from "./parts";
import {
  ArticlesPeek,
  ContentPanel,
  DualLens,
  SpecGlyph,
  ScoreBands,
  SplitSearch,
} from "./pictures";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** A title with its closing `words` words in the blue accent. */
function withAccent(text: string, words: number) {
  const parts = text.split(" ");
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/* ---------- Hero ---------- */

/* Split, unlike the landing's centred hero: the promise and the form on the
   left over a faint dot grid, the four facts down the right as a ruled
   ledger, each with a small glyph of what it means. */
export function ScoreHero({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");

  return (
    <section id="top" aria-labelledby="feature-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.42fr_1fr]">
          <div className="relative overflow-hidden px-5 pb-14 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-20 lg:pl-14 lg:pr-12">
            <DotGrid className="opacity-80 [mask-image:radial-gradient(ellipse_75%_70%_at_18%_55%,#000_10%,transparent_72%)]" />

            <div className="relative">
              <nav
                aria-label="Breadcrumb"
                className="motion-safe:animate-hero-rise"
                style={rise(0)}
              >
                <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                  <li>
                    <Link to="/" className="py-2 transition-colors hover:text-ink">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li>
                    <Link to="/features" className="py-2 transition-colors hover:text-ink">
                      Features
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li aria-current="page" className="font-medium text-ink">
                    {feature.name}
                  </li>
                </ol>
              </nav>

              <div className="mt-10 motion-safe:animate-hero-rise sm:mt-14" style={rise(0.05)}>
                <Pill icon={feature.icon}>{feature.eyebrow}</Pill>
              </div>

              <h1
                id="feature-title"
                className="mt-6 font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.55rem] sm:text-[3.3rem] lg:text-[3.45rem] xl:text-[3.7rem]"
                style={rise(0.12)}
              >
                <span className="block">{feature.headline.lead}</span>{" "}
                <span className="mt-[0.06em] flex flex-wrap items-center gap-x-[0.22em]">
                  <span
                    aria-hidden
                    className="inline-flex h-[0.84em] w-[0.84em] shrink-0 items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                  >
                    <DualDial className="h-[56%] w-[56%] text-brand-blue" />
                  </span>
                  <span className="font-bold text-brand-blue">{feature.headline.accent}</span>
                </span>
              </h1>

              <p
                className="mt-6 max-w-[36rem] text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
                style={rise(0.22)}
              >
                {feature.subhead}
              </p>

              <div
                className="mt-9 w-full max-w-[35rem] motion-safe:animate-hero-rise"
                style={rise(0.32)}
              >
                <UrlForm url={url} onChange={setUrl} variant="split" />
                <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
              </div>
            </div>
          </div>

          <div
            className={cn("border-t motion-safe:animate-hero-rise lg:border-l lg:border-t-0", LINE)}
            style={rise(0.42)}
          >
            <dl
              aria-label={`${feature.name} at a glance`}
              className={cn("grid h-full grid-cols-2 gap-px lg:grid-cols-1", LINE_FILL)}
            >
              {feature.specs.map((s, i) => {
                return (
                  <div
                    key={s.label}
                    className="flex items-start justify-between gap-4 bg-white px-5 py-6 sm:items-center sm:px-8 lg:px-9"
                  >
                    <div className="flex min-w-0 flex-col-reverse">
                      <dt className="mt-1.5 text-balance text-[0.8rem] leading-snug text-muted-foreground">
                        {s.label}
                      </dt>
                      <dd className="font-display text-[1.35rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.55rem]">
                        {s.value}
                      </dd>
                    </div>
                    <span aria-hidden className="hidden shrink-0 sm:flex">
                      <SpecGlyph i={i} />
                    </span>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- The feature, running ---------- */

/* The draft on the proofing table: a dot-grid panel inside the rails, the
   page and its scorecard laid on it. No painting: this one is a desk. */
export function ScoreDeskBand({ feature }: { feature: Feature }) {
  return (
    <section aria-label={`${feature.name}, running`}>
      <Band inner={cn("overflow-hidden", PANEL)}>
        <div className="relative px-3 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:px-12 lg:pb-[4.5rem] lg:pt-16">
          <DotGrid />
          <ScoreDesk />
        </div>
      </Band>
    </section>
  );
}

/* ---------- Half the search box ---------- */

/* The problem as a search box split down the middle, then the before and
   after as a ledger: each old habit beside what replaces it. */
export function ScoreProblem({ feature }: { feature: Feature }) {
  const { problem } = feature;
  if (!problem) return null;
  const rows = problem.before.map((before, i) => [before, problem.after[i]] as const);
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Columns2}
        eyebrow="Search has two halves"
        title={withAccent(problem.title, 4)}
        subtitle={problem.body}
      >
        <Reveal delay={0.1}>
          <SplitSearch />
        </Reveal>
      </SectionHead>

      <Band>
        <div className={cn("grid gap-px", LINE_FILL)}>
          <div className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
            <div className="flex items-center gap-3 bg-white px-6 py-4 sm:px-10">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fdedf1] text-[#e11d48]">
                <X className="h-3.5 w-3.5" />
              </span>
              <span className="text-[0.85rem] font-semibold text-ink">
                Without a pre-publish score
              </span>
            </div>
            <div className="hidden items-center gap-3 bg-white px-6 py-4 sm:px-10 md:flex md:pl-14">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta text-white">
                <feature.icon className="h-3.5 w-3.5" />
              </span>
              <span className="text-[0.85rem] font-semibold text-ink">With {feature.name}</span>
            </div>
          </div>

          {rows.map(([before, after], i) => (
            <div key={before} className={cn("relative grid gap-px md:grid-cols-2", LINE_FILL)}>
              <div className="bg-white">
                <Reveal
                  delay={i * 0.04}
                  className="flex h-full items-start gap-3 px-6 py-5 sm:px-10 md:py-6"
                >
                  <span className="mt-0.5 w-5 shrink-0 text-[0.7rem] font-medium tabular-nums text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.95rem] leading-snug text-muted-foreground line-through decoration-ink/15 decoration-1">
                    {before}
                  </span>
                </Reveal>
              </div>
              <div className="bg-[color-mix(in_oklab,var(--cta)_3%,white)]">
                <Reveal
                  delay={i * 0.04 + 0.06}
                  className="flex h-full items-start gap-3 px-6 py-5 sm:px-10 md:py-6 md:pl-14"
                >
                  <span className="mt-0.5 flex h-[1.1rem] w-[1.1rem] shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span className="text-[0.95rem] font-medium leading-snug text-ink">{after}</span>
                </Reveal>
              </div>
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 z-10 hidden h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] md:flex"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Ready before it's live ---------- */

/* Each benefit's panel tint, from the landing's feature rows. */
const TINTS = {
  blue: { panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
  green: { panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
  violet: { panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
} as const;

function BenefitText({
  b,
  icon: Icon,
  tint,
  className,
}: {
  b: FeatureBenefit;
  icon: ComponentType<{ className?: string }>;
  tint: (typeof TINTS)[keyof typeof TINTS];
  className?: string;
}) {
  return (
    <div className={className}>
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ background: tint.tile, color: tint.ink }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-5 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.65rem]">
        {b.title}
      </h3>
      <p className="mt-2.5 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
        {b.body}
      </p>
    </div>
  );
}

function TintPanel({
  tint,
  className,
  children,
}: {
  tint: (typeof TINTS)[keyof typeof TINTS];
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="px-3 pb-3">
      <div
        aria-hidden
        className={cn("flex items-center justify-center p-5 sm:p-8", className)}
        style={{ background: tint.panel }}
      >
        <div className="w-full max-w-[30rem]">{children}</div>
      </div>
    </div>
  );
}

/* A bento, not a run of rows: the two lenses get the full width, the checks
   and the bar share the row beneath. */
export function ScoreBenefits({ feature }: { feature: Feature }) {
  const [dual, checks, trust] = feature.benefits;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={ShieldCheck}
        eyebrow="Checked before it ships"
        title={withAccent(feature.benefitsTitle, 3)}
        subtitle={feature.benefitsIntro}
      />
      <Band>
        <div className={cn("grid gap-px lg:grid-cols-2", LINE_FILL)}>
          {dual && (
            <div className="bg-white lg:col-span-2">
              <Reveal className="grid items-center lg:grid-cols-[0.78fr_1.22fr]">
                <BenefitText
                  b={dual}
                  icon={Columns2}
                  tint={TINTS.blue}
                  className="px-6 py-10 sm:px-10 lg:py-12 lg:pl-14"
                />
                <div className="lg:py-3 lg:pr-0">
                  <TintPanel tint={TINTS.blue} className="lg:min-h-[21rem] lg:p-10">
                    <DualLens />
                  </TintPanel>
                </div>
              </Reveal>
            </div>
          )}
          {checks && (
            <div className="bg-white">
              <Reveal className="flex h-full flex-col">
                <BenefitText
                  b={checks}
                  icon={ListChecks}
                  tint={TINTS.green}
                  className="px-6 pb-8 pt-10 sm:px-10 lg:pl-14"
                />
                <div className="mt-auto">
                  <TintPanel tint={TINTS.green} className="p-4 sm:h-[20rem] sm:p-6">
                    <ContentPanel />
                  </TintPanel>
                </div>
              </Reveal>
            </div>
          )}
          {trust && (
            <div className="bg-white">
              <Reveal delay={0.06} className="flex h-full flex-col">
                <BenefitText
                  b={trust}
                  icon={ShieldCheck}
                  tint={TINTS.violet}
                  className="px-6 pb-8 pt-10 sm:px-10"
                />
                <div className="mt-auto">
                  <TintPanel tint={TINTS.violet} className="p-4 sm:h-[20rem] sm:p-6">
                    <ScoreBands />
                  </TintPanel>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Write, score, publish ---------- */

/* The steps and the engine in one picture: the line from the writer, through
   this gate, to publishing. */
export function ScoreGate({ feature }: { feature: Feature }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Route}
        eyebrow="Between writing and publishing"
        title={withAccent(feature.stepsTitle, 1)}
        subtitle={feature.connects}
      />
      <Band inner={cn("overflow-hidden", PANEL)}>
        <div className="relative px-5 py-10 sm:px-10 sm:py-14 lg:px-12">
          <DotGrid className="opacity-70" />
          <div className="relative">
            <GateLine feature={feature} />
          </div>
        </div>
      </Band>
      <Band inner="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <a href="/auth" className={SOLID_BUTTON}>
          Start your free trial
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Numbered rows down the full width, the first one open: what SEO and GEO
   mean is the question most visitors arrive with. Answers are always in the
   server HTML (forceMount), matching the FAQPage schema in the head. */
export function ScoreFAQ({ feature }: { feature: Feature }) {
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <>
            SEO, GEO and <Accent>the score</Accent>
          </>
        }
      />
      <Band>
        <Reveal>
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="divide-y divide-ink/[0.07]"
          >
            {feature.faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="group/item grid grid-cols-[3.25rem_1fr] border-b-0 sm:grid-cols-[5.5rem_1fr]"
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex justify-center border-r pt-[1.45rem] text-[0.75rem] font-semibold tabular-nums text-muted-foreground/70 transition-colors duration-300 group-data-[state=open]/item:text-cta",
                    LINE,
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 px-5 sm:px-8 lg:px-12">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[1rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-180 group-data-[state=open]:border-cta-soft group-data-[state=open]:bg-cta-soft group-data-[state=open]:text-cta">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-6 pr-10 text-[0.92rem] leading-relaxed text-muted-foreground"
                  >
                    {f.a}
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* Blue inside the rails, with the hero's dial drawn large in white behind,
   one button, and the articles list rising from the band's foot with every
   score in its column. The band is --cta rather than brand blue so the white
   body text passes AA. */
export function ScoreCTA({ feature }: { feature: Feature }) {
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <DialArcs className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[60rem] text-white opacity-[0.13]" />

        <div className="relative px-5 pt-16 text-center sm:px-8 sm:pt-20">
          <Reveal>
            <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-blue shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)]">
              <DualDial className="h-6 w-6" />
            </span>
            <h2
              id="cta-title"
              className="mx-auto max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              {feature.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {feature.ctaBody}
            </p>
            <a
              href="/auth"
              className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>

          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[11.5rem] max-w-2xl overflow-hidden sm:mt-14 sm:h-[12.5rem]"
          >
            <ArticlesPeek />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
