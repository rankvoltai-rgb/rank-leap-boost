/**
 * /features/auto-publishing's own sections, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections.
 * All copy is the feature's entry in data/features.ts (which takes its
 * status-dependent clauses from data/auto-publishing.ts); these decide only
 * how it's set.
 */
import { useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  HelpCircle,
  ListChecks,
  Plus,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import {
  Accent,
  Band,
  GHOST_BUTTON,
  LINE,
  LINE_FILL,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { TRIAL_CTA } from "@/data/pricing";
import { getFeature, type Feature } from "@/data/features";
import { Handoff, HandoffLegend } from "./handoff";
import {
  CallsSketch,
  ChecksCard,
  EditsLedger,
  PaceCard,
  PipelineSketch,
  ReportedPeek,
  WeekSketch,
} from "./pictures";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** A title with its last `words` words set in the blue accent. */
function accented(text: string, words: number) {
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

/* The copy set left, and beside it the feature's four facts as a spec sheet
   ruled off by the rails' own hairlines. The dithered mark sits behind the
   sheet's edge, as it sits behind the landing's headline. */
export function PublishingHero({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");
  const Icon = feature.icon;

  return (
    <section id="top" aria-labelledby="feature-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <div className="relative px-5 pb-14 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-20 lg:pl-14 lg:pr-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -right-[38%] hidden w-[78%] opacity-[0.34] [mask-image:radial-gradient(ellipse_62%_70%_at_50%_50%,#000_35%,transparent_100%)] sm:block"
            >
              <MarkDither />
            </div>

            <nav
              aria-label="Breadcrumb"
              className="relative motion-safe:animate-hero-rise"
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

            <div
              className="relative mt-10 motion-safe:animate-hero-rise sm:mt-14"
              style={rise(0.05)}
            >
              <Pill icon={Icon}>{feature.eyebrow}</Pill>
            </div>

            <h1
              id="feature-title"
              className="relative mt-6 font-display text-[2.3rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.4rem] lg:text-[3.85rem]"
              style={rise(0.12)}
            >
              <span className="block">{feature.headline.lead}</span>{" "}
              <span className="block font-bold text-brand-blue">{feature.headline.accent}</span>
            </h1>

            <p
              className="relative mt-6 max-w-[34rem] text-pretty text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
              style={rise(0.22)}
            >
              {feature.subhead}
            </p>

            <div
              className="relative mt-9 w-full max-w-[34rem] motion-safe:animate-hero-rise"
              style={rise(0.32)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          {/* The spec sheet. A 2 × 2 grid under the copy on a phone, a ruled
              column beside it on a wide screen. */}
          <aside
            aria-label={`${feature.name} at a glance`}
            className={cn(
              "relative border-t motion-safe:animate-hero-rise lg:border-l lg:border-t-0",
              LINE,
              PANEL,
            )}
            style={rise(0.4)}
          >
            <dl className={cn("grid h-full grid-cols-2 gap-px lg:grid-cols-1", LINE_FILL)}>
              {feature.specs.map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-col-reverse justify-center bg-white px-5 py-6 sm:px-8 lg:px-10 lg:py-0"
                >
                  <dt className="mt-1.5 max-w-[16rem] text-pretty text-[0.8rem] leading-snug text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="flex items-baseline gap-3 font-display text-[1.5rem] font-medium leading-none tracking-[-0.025em] text-ink sm:text-[1.9rem]">
                    <span
                      aria-hidden
                      className="hidden text-[0.7rem] font-medium tabular-nums tracking-normal text-cta lg:inline"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------- The handoff ---------- */

/* The feature running, on a blueprint field rather than a painting: the
   queue, the API between, and the site, with the real status line under. */
export function PublishingShowcase({ feature }: { feature: Feature }) {
  return (
    <section aria-label={`${feature.name}, running`}>
      <Band inner="overflow-hidden">
        <div className="relative bg-[linear-gradient(180deg,#f2f7ff_0%,#e7f0fe_100%)] px-4 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14 lg:px-12 lg:pt-16">
          {/* Blueprint dots, fading toward the rails. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--cta)_28%,transparent)_1px,transparent_1.2px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_80%_75%_at_50%_45%,#000_35%,transparent_100%)]"
          />
          <Reveal y={24} className="relative mx-auto max-w-[66rem]">
            <Handoff />
          </Reveal>
          <div className="relative mt-8 sm:mt-10">
            <HandoffLegend />
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Your site, your rules ---------- */

const RULE_TINTS = [
  { panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
  { panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
  { panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
] as const;
const RULE_PICTURES = [EditsLedger, ChecksCard, PaceCard];

function RuleNumber({ i }: { i: number }) {
  const t = RULE_TINTS[i];
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[0.78rem] font-semibold tabular-nums"
      style={{ background: t.tile, color: t.ink }}
    >
      {String(i + 1).padStart(2, "0")}
    </span>
  );
}

/* The rule that answers the biggest worry gets a row of its own; the other
   two share the row beneath, picture over text. */
export function PublishingRules({ feature }: { feature: Feature }) {
  const [first, ...rest] = feature.benefits;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={ShieldCheck}
        eyebrow="Rules it follows"
        title={accented(feature.benefitsTitle, 2)}
        subtitle={feature.benefitsIntro}
      />

      {first && (
        <Band>
          <div className="group grid lg:grid-cols-[0.85fr_1fr]">
            <Reveal className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-14 lg:pl-14 lg:pr-10">
              <RuleNumber i={0} />
              <h3 className="mt-5 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.85rem]">
                {first.title}
              </h3>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                {first.body}
              </p>
            </Reveal>
            <div className="px-3 pb-3 lg:py-3 lg:pl-0 lg:pr-3">
              <div
                aria-hidden
                className="relative h-[19rem] overflow-hidden sm:h-[20rem]"
                style={{ background: RULE_TINTS[0].panel }}
              >
                <div className="absolute inset-x-4 top-7 mx-auto max-w-[29rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-10 sm:top-9">
                  <EditsLedger />
                </div>
              </div>
            </div>
          </div>
        </Band>
      )}

      {rest.length > 0 && (
        <Band>
          <div className={cn("grid gap-px", rest.length > 1 && "lg:grid-cols-2", LINE_FILL)}>
            {rest.map((b, k) => {
              const i = k + 1;
              const Picture = RULE_PICTURES[i];
              return (
                <div key={b.title} className="group bg-white">
                  <Reveal delay={k * 0.06} className="flex h-full flex-col">
                    <div className="px-3 pt-3">
                      <div
                        aria-hidden
                        className="relative h-[16rem] overflow-hidden sm:h-[17rem]"
                        style={{ background: RULE_TINTS[i % RULE_TINTS.length].panel }}
                      >
                        {Picture && (
                          <div className="absolute inset-x-4 top-7 mx-auto max-w-[24rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-8">
                            <Picture />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-6 pb-10 pt-7 sm:px-10 lg:px-11">
                      <RuleNumber i={i % RULE_TINTS.length} />
                      <h3 className="mt-4 font-display text-[1.4rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.6rem]">
                        {b.title}
                      </h3>
                      <p className="mt-2.5 max-w-md text-[0.93rem] leading-relaxed text-muted-foreground">
                        {b.body}
                      </p>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </Band>
      )}
    </section>
  );
}

/* ---------- From pace to page ---------- */

const STEP_SKETCHES = [WeekSketch, PipelineSketch, CallsSketch];

/* Three stations on one line: the track runs through each step's number, so
   the row reads as the path an article takes. */
export function PublishingSteps({ feature }: { feature: Feature }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={ListChecks}
        eyebrow="From pace to page"
        title={accented(feature.stepsTitle, 3)}
      />
      <Band>
        <ol className="relative grid lg:grid-cols-3">
          {/* The track, behind the numbers on a wide screen. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[3.25rem] hidden border-t border-dashed border-cta/30 lg:block"
          />
          {feature.steps.map((s, i) => {
            const Sketch = STEP_SKETCHES[i];
            return (
              <li
                key={s.title}
                className={cn("relative", i > 0 && "border-t lg:border-l lg:border-t-0", LINE)}
              >
                <Reveal
                  delay={i * 0.07}
                  className="flex h-full flex-col px-6 py-9 sm:px-10 lg:px-9 lg:text-center"
                >
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cta/25 bg-white text-[0.85rem] font-semibold tabular-nums text-cta shadow-[0_0_0_5px_white] lg:mx-auto">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground lg:mx-auto lg:max-w-[18rem]">
                    {s.body}
                  </p>
                  {Sketch && (
                    <div
                      aria-hidden
                      className={cn(
                        "mt-6 flex min-h-[6.75rem] flex-col justify-center rounded-xl border border-ink/[0.06] p-3.5 text-left lg:mt-auto",
                        PANEL,
                      )}
                    >
                      <Sketch />
                    </div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
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

/* ---------- Where it sits ---------- */

/* The features this step's own copy names: what feeds it, and what uses what
   it produces. */
const UPSTREAM = ["citation-ready-writer", "seo-geo-score"] as const;
const DOWNSTREAM = ["authority-backlinks"] as const;

function EngineLink({ slug }: { slug: string }) {
  const f = getFeature(slug);
  if (!f) return null;
  const Icon = f.icon;
  return (
    <Link
      to="/features/$slug"
      params={{ slug }}
      className="group flex items-start gap-3.5 bg-white px-6 py-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-7"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-[0.92rem] font-semibold text-ink">{f.name}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
        </span>
        <span className="mt-1 block text-[0.8rem] leading-relaxed text-muted-foreground">
          {f.tagline}
        </span>
      </span>
    </Link>
  );
}

/* One column of the loop. Every column after the first carries the joint on
   the hairline before it: above it on a phone, beside it on a wide screen. */
function Column({
  label,
  joint = false,
  className,
  children,
}: {
  label: string;
  joint?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative flex min-w-0 flex-col bg-white", className)}>
      {joint && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:-left-3 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2"
        >
          <ArrowDown className="h-3 w-3 lg:-rotate-90" />
        </span>
      )}
      <p className="px-6 pb-3 pt-6 text-[0.72rem] font-medium text-muted-foreground sm:px-7">
        {label}
      </p>
      <div className={cn("flex flex-1 flex-col divide-y border-t", LINE, "divide-ink/[0.07]")}>
        {children}
      </div>
    </div>
  );
}

export function PublishingEngine({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Waypoints}
        eyebrow="Where it sits"
        title={
          <>
            The last step <Accent>in the loop</Accent>
          </>
        }
        subtitle={feature.connects}
      />
      <Band>
        <div className={cn("grid gap-px lg:grid-cols-3", LINE_FILL)}>
          <Column label="Feeds it">
            {UPSTREAM.map((slug) => (
              <EngineLink key={slug} slug={slug} />
            ))}
          </Column>
          <Column label="This step" joint className="bg-[color-mix(in_oklab,var(--cta)_5%,white)]">
            <div aria-current="page" className="flex flex-1 flex-col justify-center p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-cta">
                  This page
                </span>
              </div>
              <p className="mt-4 text-[1.05rem] font-semibold text-ink">{feature.name}</p>
              <p className="mt-1 text-[0.82rem] leading-relaxed text-muted-foreground">
                {feature.tagline}
              </p>
            </div>
          </Column>
          <Column label="Uses what it publishes" joint>
            {DOWNSTREAM.map((slug) => (
              <EngineLink key={slug} slug={slug} />
            ))}
          </Column>
        </div>
      </Band>
      <Band inner="flex justify-center px-5 py-6">
        <Link to="/features" className={cn(GHOST_BUTTON, "group/btn")}>
          Explore all features
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* The questions in one centred column under their own head, every answer in
   the server HTML. */
export function PublishingFAQ({ feature }: { feature: Feature }) {
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <>
            Questions about <Accent>auto-publishing</Accent>
          </>
        }
      />
      <Band inner="px-5 py-4 sm:px-10 sm:py-6">
        <Reveal className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
            {feature.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                    <span className="flex items-baseline gap-4">
                      <span className="w-5 shrink-0 text-[0.75rem] font-medium tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {f.q}
                    </span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent
                  forceMount
                  className="max-w-2xl pb-5 pl-9 pr-10 text-sm leading-relaxed text-muted-foreground"
                >
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* The landing's closing band: --cta blue inside the rails (so white body text
   passes AA), the white mark dithered behind, one button, and the list of
   reported live URLs rising from the band's foot. */
export function PublishingCTA({ feature }: { feature: Feature }) {
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>

        <div className="relative px-5 pt-16 text-center sm:px-8 sm:pt-20">
          <Reveal>
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
              {TRIAL_CTA}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>

          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[11rem] max-w-xl overflow-hidden sm:mt-14 sm:h-[12rem]"
          >
            <div aria-hidden>
              <ReportedPeek />
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
