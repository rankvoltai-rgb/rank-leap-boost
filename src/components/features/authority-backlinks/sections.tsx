/**
 * The sections of /features/authority-backlinks, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections,
 * white throughout. All copy comes from the feature's entry in
 * data/features.ts; these decide only how it's set, plus a few short
 * structural labels.
 */
import { Fragment, useState, type CSSProperties, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  Ban,
  Check,
  ChevronRight,
  Coins,
  Gauge,
  HelpCircle,
  Link2,
  Plus,
  Route,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Workflow,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
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
import { GraphPaper, LinkRelay } from "./relay";
import {
  AnswerPicture,
  CompoundPicture,
  CreditsPicture,
  LedgerPeek,
  NetworkField,
  StatusPicture,
  TargetsPicture,
  VerifiedPicture,
} from "./pictures";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** A title with its last `words` words set in the blue accent. */
function accented(text: string, words: number) {
  const parts = text.split(" ");
  if (parts.length <= words) return <Accent>{text}</Accent>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

const H2 =
  "font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]";

/* ---------- Hero ---------- */

/* Centred like the landing's hero, over a network of member sites kept to
   the edges, a few of its joins carrying a link one way. The accent is set
   as the link it promises: underlined, drawn in once the line has risen. */
export function BacklinksHero({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");
  const reduce = useReducedMotion();

  return (
    <section id="top" aria-labelledby="feature-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_78%_at_50%_48%,transparent_42%,#000_92%)]"
        >
          <NetworkField />
        </div>

        <div className="relative flex flex-col items-center px-5 pb-16 pt-7 text-center sm:px-8 sm:pb-20 sm:pt-9 lg:pb-[5.5rem]">
          <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
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

          <div className="mt-10 motion-safe:animate-hero-rise sm:mt-12" style={rise(0.05)}>
            <Pill icon={feature.icon}>{feature.eyebrow}</Pill>
          </div>

          <h1
            id="feature-title"
            className="mt-6 font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.5rem] lg:text-[4.15rem]"
            style={rise(0.12)}
          >
            <span className="block">{feature.headline.lead}</span>{" "}
            <span className="relative inline-block pb-[0.06em] font-bold text-brand-blue">
              {feature.headline.accent}
              <motion.span
                aria-hidden
                className="absolute inset-x-[0.03em] bottom-[0.02em] h-[0.065em] origin-left rounded-full bg-brand-blue/60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.85, ease: EASE }}
              />
            </span>
          </h1>

          <p
            className="mt-6 max-w-[41rem] text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.15rem]"
            style={rise(0.22)}
          >
            {feature.subhead}
          </p>

          <div
            className="mt-9 w-full max-w-[37rem] motion-safe:animate-hero-rise"
            style={rise(0.32)}
          >
            <UrlForm url={url} onChange={setUrl} variant="split" />
            <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- One link, start to finish ---------- */

const SPEC_ICONS = [Coins, ShieldCheck, Link2, Ban];

/* The exchange running, on graph paper, then the four facts in a hairline
   row beneath it, each with its own mark. */
export function BacklinksRelay({ feature }: { feature: Feature }) {
  return (
    <section aria-label={`${feature.name}: one link, start to finish`}>
      <Band inner="overflow-hidden">
        <GraphPaper className="px-4 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12 lg:px-14 lg:pb-12 lg:pt-14">
          <div className="mx-auto max-w-5xl">
            <Reveal y={28}>
              <LinkRelay />
            </Reveal>
            <p className="mt-6 text-center text-[0.78rem] text-muted-foreground">
              Sample, sped up. A real link waits for a relevant article in the network.
            </p>
          </div>
        </GraphPaper>
      </Band>
      <Band>
        <ul
          aria-label={`${feature.name} at a glance`}
          className={cn("grid grid-cols-2 gap-px lg:grid-cols-4", LINE_FILL)}
        >
          {feature.specs.map((s, i) => {
            const Icon = SPEC_ICONS[i % SPEC_ICONS.length];
            return (
              <li
                key={s.label}
                className="flex flex-col gap-3 bg-white px-5 py-6 sm:flex-row sm:items-start sm:gap-3.5 sm:px-7 sm:py-7"
              >
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="min-w-0">
                  <strong className="block font-display text-[1.4rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.5rem]">
                    {s.value}
                  </strong>
                  <span className="mt-1.5 block text-balance text-[0.8rem] leading-snug text-muted-foreground">
                    {s.label}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}

/* ---------- The authority gap ---------- */

/* Each old habit set beside what replaces it, row for row, so the page reads
   as a ledger of swaps rather than two lists to compare by eye. */
export function BacklinksProblem({ feature }: { feature: Feature }) {
  const { problem } = feature;
  if (!problem) return null;
  const n = Math.max(problem.before.length, problem.after.length);
  const rows = Array.from({ length: n }, (_, i) => [problem.before[i], problem.after[i]]);
  const tint = "bg-[color-mix(in_oklab,var(--cta)_4%,white)]";

  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Gauge}
        eyebrow="The authority gap"
        title={accented(problem.title, 2)}
        subtitle={problem.body}
      />
      <Band>
        <div
          className={cn(
            "grid grid-cols-1 gap-px md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)]",
            LINE_FILL,
          )}
        >
          <div className="hidden items-center gap-2.5 bg-white px-8 py-4 md:flex lg:px-12">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#fdedf1] text-[#e11d48]">
              <X className="h-3.5 w-3.5" />
            </span>
            <span className="text-[0.82rem] font-semibold text-ink">
              Link building, the usual way
            </span>
          </div>
          <div aria-hidden className="hidden bg-white md:block" />
          <div className={cn("hidden items-center gap-2.5 px-8 py-4 md:flex lg:px-12", tint)}>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta text-white">
              <Link2 className="h-3.5 w-3.5" />
            </span>
            <span className="text-[0.82rem] font-semibold text-ink">
              Through the Rankbox exchange
            </span>
          </div>

          {rows.map(([before, after], i) => (
            <Fragment key={i}>
              <div className="bg-white">
                {before && (
                  <Reveal delay={i * 0.04} className="flex gap-3 px-6 py-5 sm:px-8 lg:px-12">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]/60" />
                    <span className="text-[0.95rem] leading-snug text-muted-foreground">
                      {before}
                    </span>
                  </Reveal>
                )}
              </div>
              <div aria-hidden className="hidden items-center justify-center bg-white md:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <div className={tint}>
                {after && (
                  <Reveal delay={i * 0.04 + 0.06} className="flex gap-3 px-6 py-5 sm:px-8 lg:px-12">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="text-[0.95rem] font-medium leading-snug text-ink">
                      {after}
                    </span>
                  </Reveal>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Step by step ---------- */

const STEP_PICTURES = [TargetsPicture, CreditsPicture, StatusPicture];
const STEP_PANELS = ["#eaf2fe", "#e9f6ee", "#f1eefd"];

/* The title holds still on the left while the three steps pass on the
   right, each with the screen it happens on. */
export function BacklinksSteps({ feature }: { feature: Feature }) {
  return (
    <section>
      <Spacer />
      <Band>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-28">
              <Pill icon={Route}>The exchange, step by step</Pill>
              <h2 className={cn(H2, "mt-5 max-w-sm text-balance")}>
                {accented(feature.stepsTitle, 2)}
              </h2>
              <ol className="mt-8 hidden space-y-2 lg:block">
                {feature.steps.map((s, i) => (
                  <li
                    key={s.title}
                    className="flex items-center gap-3 text-[0.88rem] text-muted-foreground"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-[0.72rem] font-semibold tabular-nums text-ink">
                      {i + 1}
                    </span>
                    {s.title}
                  </li>
                ))}
              </ol>
              <div className="mt-8 hidden lg:block">
                <a href="/auth" className={SOLID_BUTTON}>
                  Start your free trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <p className="mt-3 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
              </div>
            </div>
          </div>

          <ol className="divide-y divide-ink/[0.07]">
            {feature.steps.map((s, i) => {
              const Picture = STEP_PICTURES[i];
              return (
                <li key={s.title} className="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
                  <Reveal>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-[0.85rem] font-semibold tabular-nums text-cta">
                        {i + 1}
                      </span>
                      <h3 className="text-[1.15rem] font-semibold tracking-tight text-ink">
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                    {Picture && (
                      <div
                        aria-hidden
                        className="mt-6 rounded-xl px-4 py-6 sm:px-8 sm:py-8"
                        style={{ background: STEP_PANELS[i % STEP_PANELS.length] }}
                      >
                        <div className="mx-auto max-w-[27rem]">
                          <Picture />
                        </div>
                      </div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Band>
      {/* On phones the trial button can't sit in the sticky column. */}
      <Band inner="flex flex-col items-center gap-3 px-5 py-10 text-center lg:hidden">
        <a href="/auth" className={SOLID_BUTTON}>
          Start your free trial
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
      </Band>
    </section>
  );
}

/* ---------- Link quality ---------- */

/* Each benefit's tint, from the landing's feature rows. Amber leads, the
   colour the landing gives Authority Backlinks. */
const BENEFIT_LOOK: {
  icon: ComponentType<{ className?: string }>;
  panel: string;
  tile: string;
  ink: string;
  Picture: ComponentType;
}[] = [
  {
    icon: ShieldCheck,
    panel: "#fdf4e4",
    tile: "#fbe7c4",
    ink: "#d97706",
    Picture: VerifiedPicture,
  },
  {
    icon: TrendingUp,
    panel: "#eaf2fe",
    tile: "#dbe8fd",
    ink: "#1877f2",
    Picture: CompoundPicture,
  },
  { icon: Sparkles, panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a", Picture: AnswerPicture },
];

/* A bento: the first benefit, the one every link has to pass, runs the full
   width with its picture beside it; the other two share the row below. With
   an even count every cell takes a half, so no grid cell is left empty. */
export function BacklinksBenefits({ feature }: { feature: Feature }) {
  const wideFirst = feature.benefits.length % 2 === 1;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={ShieldCheck}
        eyebrow="Link quality"
        title={accented(feature.benefitsTitle, 3)}
        subtitle={feature.benefitsIntro}
      />
      <Band>
        <div className={cn("grid grid-cols-1 gap-px lg:grid-cols-2", LINE_FILL)}>
          {feature.benefits.map((b, i) => {
            const look = BENEFIT_LOOK[i % BENEFIT_LOOK.length];
            const Icon = look.icon;
            const Picture = look.Picture;
            const wide = wideFirst && i === 0;
            return (
              <div key={b.title} className={cn("bg-white", wide && "lg:col-span-2")}>
                <Reveal
                  delay={wide ? 0 : (i % 2) * 0.06}
                  className={cn(
                    "flex h-full flex-col p-3",
                    wide && "lg:grid lg:grid-cols-[0.85fr_1fr] lg:gap-3",
                  )}
                >
                  <div
                    className={cn(
                      "px-3 pb-6 pt-5 sm:px-6 sm:pt-6",
                      wide && "lg:flex lg:flex-col lg:justify-center lg:px-11 lg:py-10",
                    )}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: look.tile, color: look.ink }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-4 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.7rem]">
                      {b.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                      {b.body}
                    </p>
                  </div>
                  <div
                    aria-hidden
                    className={cn(
                      "flex flex-1 items-center justify-center rounded-lg px-4 py-8 sm:px-8 sm:py-10",
                      wide && "lg:py-12",
                    )}
                    style={{ background: look.panel }}
                  >
                    <Picture />
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* A header band, then the questions down a numbered gutter. Answers are
   force-mounted, so they're in the server HTML the FAQ schema is built from. */
export function BacklinksFAQ({ feature }: { feature: Feature }) {
  return (
    <section id="faq" className="scroll-mt-16" aria-labelledby="faq-title">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Pill icon={HelpCircle}>FAQ</Pill>
            <h2 id="faq-title" className={cn(H2, "mt-5")}>
              Backlink questions, <Accent>answered</Accent>
            </h2>
          </div>
          <a href="/#faq" className={cn(GHOST_BUTTON, "group/btn w-fit")}>
            Read the full FAQ
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </a>
        </Reveal>
      </Band>
      <Band>
        <Accordion type="single" collapsible>
          {feature.faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className={cn("group/item border-b last:border-b-0", LINE)}
            >
              <div className="grid grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[4.5rem_minmax(0,1fr)]">
                <span
                  aria-hidden
                  className={cn(
                    "border-r pt-[1.35rem] text-center text-[0.75rem] font-medium tabular-nums text-muted-foreground transition-colors group-data-[state=open]/item:bg-cta-soft group-data-[state=open]/item:text-cta",
                    LINE,
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="px-5 sm:px-8 lg:px-10">
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
                    className="max-w-3xl pb-6 pr-10 text-[0.92rem] leading-relaxed text-muted-foreground"
                  >
                    {f.a}
                  </AccordionContent>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </Band>
    </section>
  );
}

/* ---------- Works with ---------- */

/** "First sentence. The rest." → ["First sentence", "The rest."] */
function splitLead(text: string): [string, string] {
  const at = text.indexOf(". ");
  if (at < 0) return ["", text];
  return [text.slice(0, at), text.slice(at + 2)];
}

/* The features this one's copy names, upstream and downstream. */
const CHAIN = ["auto-publishing", "authority-backlinks", "citation-tracking"] as const;

/* The connects copy as a short chain: the article Auto-Publishing puts live,
   the authority pointed at it here, the engines Citation Tracking watches. */
export function BacklinksConnects({ feature }: { feature: Feature }) {
  const [lead, rest] = splitLead(feature.connects);
  const chain = CHAIN.map((slug) => getFeature(slug)).filter((f): f is Feature => Boolean(f));

  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Workflow}
        eyebrow="Works with"
        title={lead ? accented(lead, 2) : feature.name}
        subtitle={rest}
      />
      <Band inner={cn(PANEL, "px-5 py-10 sm:px-10 sm:py-14")}>
        <ol className="mx-auto flex max-w-4xl flex-col items-stretch lg:flex-row lg:items-center">
          {chain.map((f, i) => {
            const Icon = f.icon;
            const here = f.slug === feature.slug;
            const last = i === chain.length - 1;
            const body = (
              <>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      here
                        ? "bg-cta text-white"
                        : "border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {here ? (
                    <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-cta">
                      You&rsquo;re here
                    </span>
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                  )}
                </div>
                <p className="mt-4 text-[0.95rem] font-semibold text-ink">{f.name}</p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
                  {f.tagline}
                </p>
              </>
            );
            return (
              <Fragment key={f.slug}>
                <li className="lg:flex-1">
                  <Reveal delay={i * 0.07} className="h-full">
                    {here ? (
                      <div
                        aria-current="page"
                        className="h-full rounded-xl border border-cta/30 bg-white p-5 shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_8%,transparent),0_12px_32px_-18px_rgba(16,24,40,0.22)]"
                      >
                        {body}
                      </div>
                    ) : (
                      <Link
                        to="/features/$slug"
                        params={{ slug: f.slug }}
                        className="group block h-full rounded-xl border border-ink/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/[0.14]"
                      >
                        {body}
                      </Link>
                    )}
                  </Reveal>
                </li>
                {!last && (
                  <li
                    aria-hidden
                    className="relative mx-auto h-8 w-px shrink-0 border-l border-dashed border-cta/40 lg:mx-0 lg:h-px lg:w-10 lg:border-l-0 lg:border-t"
                  />
                )}
              </Fragment>
            );
          })}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* Blue inside the rails (--cta, so the white body text passes AA), the
   promise on the left and the ledger rising from the band's foot on the
   right, over the focal picture's ruling in white. */
export function BacklinksCTA({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        {/* The focal picture's graph paper, ruled in white and gathered
            under the ledger, so the page closes on the ground it opened on. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_95%_70%_at_50%_100%,#000_20%,transparent_78%)] lg:[mask-image:radial-gradient(ellipse_62%_95%_at_76%_100%,#000_22%,transparent_80%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.13) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.13) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "-1px -1px",
          }}
        />

        <div className="relative grid grid-cols-1 items-end gap-12 px-5 pt-16 sm:px-10 sm:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:px-14">
          <Reveal className="text-center lg:self-center lg:pb-16 lg:text-left">
            <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-blue shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] lg:mx-0">
              <Icon className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <h2
              id="cta-title"
              className="mx-auto max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem] lg:mx-0"
            >
              {feature.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem] lg:mx-0">
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

          {/* The ledger rises from the band's foot and is cut off by it. */}
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto h-[12.5rem] w-full max-w-md overflow-hidden sm:h-[14rem] lg:mr-0 lg:h-[15.5rem] lg:max-w-[28rem]"
          >
            <div aria-hidden>
              <LedgerPeek />
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
