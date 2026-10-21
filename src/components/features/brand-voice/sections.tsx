/**
 * The sections of /features/brand-voice, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections,
 * white throughout. All copy comes from the feature's entry in
 * data/features.ts; these only decide how it's set.
 */
import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Globe,
  HelpCircle,
  Layers3,
  Mic,
  Package,
  Plus,
  Repeat,
  ScanText,
  SlidersHorizontal,
  Waypoints,
  Wrench,
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
import { getFeature, type Feature } from "@/data/features";
import { VoiceDesk, Waveform } from "./voice-desk";
import {
  ArticleStack,
  DescribeStep,
  GenerateStep,
  InstructionsScreen,
  ProductScreen,
  RefineStep,
  ScaleScreen,
} from "./screens";

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

const H2 =
  "font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]";

const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/* ---------- Hero ---------- */

/* One icon per fact in the spec column, in the order the facts are listed. */
const SPEC_ICONS: ComponentType<{ className?: string }>[] = [
  Repeat,
  SlidersHorizontal,
  Package,
  Globe,
];

/* The landing's lockup, set left, with the feature's facts standing down the
   right of the frame like the margin of a style sheet. */
export function BrandVoiceHero({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");
  const Icon = feature.icon;

  return (
    <section id="top" aria-labelledby="feature-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1fr_20rem]">
          <div className="relative flex flex-col items-start px-5 pb-14 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-20 lg:pl-14 lg:pr-12">
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

            <div className="mt-10 motion-safe:animate-hero-rise sm:mt-14" style={rise(0.05)}>
              <Pill icon={Icon}>{feature.eyebrow}</Pill>
            </div>

            <h1
              id="feature-title"
              className="mt-6 font-display text-[2.3rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.4rem] xl:text-[4rem]"
              style={rise(0.12)}
            >
              <span className="block">{feature.headline.lead}</span>{" "}
              <span className="mt-[0.04em] inline-flex items-center gap-[0.22em] whitespace-nowrap">
                <span
                  aria-hidden
                  className="inline-flex h-[0.84em] w-[0.84em] shrink-0 items-center justify-center rounded-[0.2em] bg-cta shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(16,24,40,0.12)]"
                >
                  <Icon className="h-[46%] w-[46%] text-white" strokeWidth={2.4} />
                </span>
                <span className="font-bold text-brand-blue">{feature.headline.accent}</span>
              </span>
            </h1>

            <p
              className="mt-6 max-w-[38rem] text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.15rem]"
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

          {/* The facts, down the right rail. Hairline cells: two by two on
              phones, one column beside the copy on desktop. */}
          <dl
            aria-label={`${feature.name} at a glance`}
            className={cn(
              "grid grid-cols-2 gap-px border-t motion-safe:animate-hero-rise lg:grid-cols-1 lg:border-l lg:border-t-0",
              LINE,
              LINE_FILL,
            )}
            style={rise(0.42)}
          >
            {feature.specs.map((s, i) => {
              const SpecIcon = SPEC_ICONS[i % SPEC_ICONS.length];
              return (
                <div
                  key={s.label}
                  className="flex flex-col justify-center bg-white px-4 py-6 sm:px-8"
                >
                  <dd className="order-1 flex flex-col items-start gap-2.5 min-[480px]:flex-row min-[480px]:items-center">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                    >
                      <SpecIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-display text-[1.15rem] font-medium leading-none tracking-[-0.02em] text-ink min-[400px]:text-[1.25rem] sm:text-[1.45rem]">
                      {s.value}
                    </span>
                  </dd>
                  <dt className="order-2 mt-2 text-[0.8rem] leading-snug text-muted-foreground">
                    {s.label}
                  </dt>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------- The feature, at work ---------- */

/* The voice desk on a pale blue drafting table, ruled off by the rails. */
export function BrandVoiceShowcase({ feature }: { feature: Feature }) {
  return (
    <section aria-label={`${feature.name}, at work`}>
      <Band inner="overflow-hidden">
        <VoiceDesk />
      </Band>
    </section>
  );
}

/* ---------- Generic vs. your voice ---------- */

/* The before and after, paired line by line: each habit of generic AI sits
   beside what the voice does instead, joined across the hairline. */
export function BrandVoiceProblem({ feature }: { feature: Feature }) {
  const { problem } = feature;
  if (!problem) return null;
  const rows = problem.before.map((b, i) => [b, problem.after[i]] as const);

  return (
    <section>
      <Spacer />
      <Band inner="px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <div>
            <Pill icon={ScanText}>Spot the difference</Pill>
            <h2 className={cn(H2, "mt-5 max-w-xl text-balance")}>{accented(problem.title, 3)}</h2>
          </div>
          <p className="max-w-md text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem] lg:pb-1.5">
            {problem.body}
          </p>
        </div>
      </Band>

      <Band>
        <div className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          {/* Column heads, desktop only: on phones each cell says which side it's on. */}
          <div className="hidden items-center gap-3 bg-white px-6 py-4 sm:px-10 md:flex lg:px-14">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fdedf1] text-[#e11d48]">
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="text-[0.85rem] font-semibold text-ink">Generic AI drafts</span>
          </div>
          <div className="hidden items-center gap-3 bg-[color-mix(in_oklab,var(--cta)_4%,white)] px-6 py-4 sm:px-10 md:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta text-white">
              <Mic className="h-3.5 w-3.5" />
            </span>
            <span className="text-[0.85rem] font-semibold text-ink">Drafts in your voice</span>
          </div>

          {rows.map(([before, after], i) => (
            <PairRow key={before} i={i} before={before} after={after} />
          ))}
        </div>
      </Band>
    </section>
  );
}

function PairRow({ i, before, after }: { i: number; before: string; after: string }) {
  const n = String(i + 1).padStart(2, "0");
  return (
    <>
      <div className="bg-white">
        <Reveal delay={0.04} className="flex h-full items-start gap-4 px-6 py-6 sm:px-10 lg:px-14">
          <span className="mt-0.5 w-5 shrink-0 text-[0.72rem] font-medium tabular-nums text-muted-foreground/70">
            {n}
          </span>
          <span className="min-w-0">
            <span className="mb-1 block text-[0.68rem] font-medium text-[#e11d48] md:hidden">
              Generic AI
            </span>
            <span className="flex items-start gap-2.5 text-[0.95rem] leading-snug text-muted-foreground">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]/60" />
              {before}
            </span>
          </span>
        </Reveal>
      </div>
      <div className="relative bg-[color-mix(in_oklab,var(--cta)_4%,white)]">
        {/* The joint on the hairline between the two. */}
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.06)] md:-left-3 md:top-1/2 md:-translate-y-1/2 md:translate-x-0"
        >
          <ArrowDown className="h-3 w-3 md:hidden" />
          <ArrowRight className="hidden h-3 w-3 md:block" />
        </span>
        <Reveal delay={0.1} className="flex h-full items-start px-6 py-6 sm:px-10">
          <span className="min-w-0">
            <span className="mb-1 block text-[0.68rem] font-medium text-cta md:hidden">
              In your voice
            </span>
            <span className="flex items-start gap-2.5 text-[0.95rem] font-medium leading-snug text-ink">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {after}
            </span>
          </span>
        </Reveal>
      </div>
    </>
  );
}

/* ---------- Setting it up ---------- */

const STEP_MS = 5200;
const STEP_SCREENS: ComponentType<{ active: boolean }>[] = [DescribeStep, GenerateStep, RefineStep];

/* The steps as a vertical stepper: the copy down the left, the screen for
   the step that's open on the right. It walks through on its own while it's
   on screen, and stops walking once you pick a step. */
export function BrandVoiceSteps({ feature }: { feature: Feature }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const playing = auto && inView && !reduce;
  const count = feature.steps.length;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % count), STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, count]);

  const Screen = STEP_SCREENS[active % STEP_SCREENS.length];

  return (
    <section>
      <Spacer />
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Pill icon={Wrench}>Setup</Pill>
            <h2 className={cn(H2, "mt-5")}>{accented(feature.stepsTitle, 2)}</h2>
          </div>
          <div className="flex flex-col items-start gap-2.5 lg:items-end">
            <a href="/auth" className={SOLID_BUTTON}>
              Set up your voice
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
          </div>
        </div>
      </Band>

      <Band>
        <div ref={ref} className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <ol className={cn("divide-y divide-ink/[0.07] border-b lg:border-b-0 lg:border-r", LINE)}>
            {feature.steps.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.title} className="relative">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setActive(i);
                      setAuto(false);
                    }}
                    className={cn(
                      "group relative flex w-full items-start gap-4 px-6 py-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-10 lg:py-7 lg:pl-14",
                      on
                        ? "bg-white"
                        : "bg-white hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)]",
                    )}
                  >
                    {/* How long until the next step: a bar filling down the rail. */}
                    <span aria-hidden className="absolute inset-y-0 left-0 w-[2px] bg-transparent">
                      {on && (
                        <motion.span
                          key={`${active}-${playing}`}
                          className="absolute inset-x-0 top-0 block bg-cta"
                          initial={{ height: playing ? "0%" : "100%" }}
                          animate={{ height: "100%" }}
                          transition={{ duration: playing ? STEP_MS / 1000 : 0, ease: "linear" }}
                        />
                      )}
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.85rem] font-semibold tabular-nums transition-colors duration-300",
                        on
                          ? "bg-cta text-white"
                          : "border border-ink/[0.08] bg-white text-muted-foreground group-hover:text-ink",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-[1.05rem] font-semibold tracking-tight transition-colors duration-300",
                          on ? "text-ink" : "text-ink/70",
                        )}
                      >
                        {s.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {s.body}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div
            aria-hidden
            className={cn(
              "relative flex min-h-[21rem] items-center justify-center overflow-hidden px-4 py-8 sm:min-h-[23rem] sm:px-10",
              PANEL,
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-60 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_30%,transparent_100%)]" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className="relative flex w-full justify-center"
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.2 } }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Screen active={inView} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- What you get ---------- */

const BENEFIT_ART: {
  icon: ComponentType<{ className?: string }>;
  panel: string;
  tile: string;
  ink: string;
  Screen: ComponentType<{ tall?: boolean }>;
}[] = [
  {
    icon: SlidersHorizontal,
    panel: "#eaf2fe",
    tile: "#dbe8fd",
    ink: "#1877f2",
    Screen: InstructionsScreen,
  },
  { icon: Package, panel: "#fdf4e4", tile: "#fbe7c4", ink: "#d97706", Screen: ProductScreen },
  { icon: Layers3, panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed", Screen: ScaleScreen },
];

/* The benefits as a bento: the instructions, which everything else follows,
   stand tall on the left; product mentions and scale share the right. */
export function BrandVoiceBenefits({ feature }: { feature: Feature }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Mic}
        eyebrow="What you get"
        title={accented(feature.benefitsTitle, 3)}
        subtitle={feature.benefitsIntro}
      />
      <Band>
        <div className={cn("grid gap-px lg:grid-cols-2 lg:grid-rows-2", LINE_FILL)}>
          {feature.benefits.map((b, i) => {
            const art = BENEFIT_ART[i % BENEFIT_ART.length];
            const Icon = art.icon;
            const tall = i === 0;
            return (
              <div key={b.title} className={cn("bg-white", tall && "lg:row-span-2")}>
                <Reveal delay={(i % 2) * 0.06} className="group flex h-full flex-col p-3">
                  <div className="px-3 pb-6 pt-5 sm:px-7 sm:pt-7">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: art.tile, color: art.ink }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-5 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.6rem]">
                      {b.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                      {b.body}
                    </p>
                  </div>
                  <div
                    aria-hidden
                    className={cn(
                      "relative overflow-hidden",
                      tall ? "h-[21rem] lg:h-auto lg:flex-1" : "h-[15.5rem] sm:h-[16rem]",
                    )}
                    style={{ background: art.panel }}
                  >
                    <div
                      className={cn(
                        "absolute inset-x-4 top-6 mx-auto max-w-[27rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-8 sm:top-8",
                        tall && "lg:top-10",
                      )}
                    >
                      <art.Screen tall={tall} />
                    </div>
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

/* ---------- Where it sits ---------- */

/* The stretch of the engine Brand Voice works in, left to right: research
   hands a topic to the writer, the voice shapes the draft inside it, then
   the score checks it and publishing puts it live. */
const FLOW = ["answer-space-research", "citation-ready-writer", "seo-geo-score", "auto-publishing"];
const HOST = "citation-ready-writer";

export function BrandVoiceFit({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <section>
      <Spacer />
      <Band inner="px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <div>
            <Pill icon={Waypoints}>Where it fits</Pill>
            <h2 className={cn(H2, "mt-5 max-w-lg text-balance")}>
              Applied at the draft, <Accent>before every check</Accent>
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
              {feature.connects}
            </p>
            <Link to="/features" className={cn(GHOST_BUTTON, "group/btn mt-5 w-fit")}>
              Explore all features
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Band>

      <Band>
        <ol className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-4", LINE_FILL)}>
          {FLOW.map((slug, i) => {
            const f = getFeature(slug);
            if (!f) return null;
            const FIcon = f.icon;
            const host = slug === HOST;
            const step = String(i + 1).padStart(2, "0");
            return (
              <li
                key={slug}
                className={cn(
                  "relative",
                  host ? "bg-[color-mix(in_oklab,var(--cta)_4%,white)]" : "bg-white",
                )}
              >
                {i > 0 && (
                  <span
                    aria-hidden
                    className="absolute -left-3 top-[2.35rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
                <Reveal delay={i * 0.05} className="flex h-full flex-col">
                  <Link
                    to="/features/$slug"
                    params={{ slug }}
                    className="group flex flex-col p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-6"
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue">
                        <FIcon className="h-4 w-4" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </span>
                    <span className="mt-5 text-[0.68rem] font-medium tabular-nums text-muted-foreground">
                      {step}
                    </span>
                    <span className="mt-0.5 text-[0.92rem] font-semibold text-ink">{f.name}</span>
                    <span className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
                      {f.tagline}
                    </span>
                  </Link>
                  {host && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                      <div
                        aria-current="page"
                        className="rounded-xl border border-cta/25 bg-white p-3.5 shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_7%,transparent)]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-2 text-[0.85rem] font-semibold text-ink">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta text-white">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            {feature.name}
                          </span>
                          <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
                            This page
                          </span>
                        </div>
                        <p className="mt-2 text-[0.78rem] leading-relaxed text-muted-foreground">
                          {feature.tagline}
                        </p>
                      </div>
                    </div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Centred, one column, numbered; the first answer open. Every answer is in
   the server HTML (forceMount) so it matches the FAQ schema in the head. */
export function BrandVoiceFAQ({ feature }: { feature: Feature }) {
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <>
            {feature.name}, <Accent>answered</Accent>
          </>
        }
      />
      <Band>
        <Reveal className="mx-auto max-w-3xl px-6 pb-10 pt-4 sm:px-10 sm:pb-12 sm:pt-6">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="divide-y divide-ink/[0.07]"
          >
            {feature.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center gap-4 py-5 text-left text-[1rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2 sm:gap-5">
                    <span className="w-6 shrink-0 text-[0.75rem] font-medium tabular-nums text-muted-foreground/70 transition-colors group-data-[state=open]:text-cta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{f.q}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent
                  forceMount
                  className="pb-5 pl-10 pr-10 text-[0.92rem] leading-relaxed text-muted-foreground sm:pl-11"
                >
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-6 flex justify-center">
            <a href="/#faq" className={cn(GHOST_BUTTON, "group/btn")}>
              Read the full FAQ
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* Blue inside the rails, set left this time: the promise on one side and a
   stack of articles in the same voice rising from the band's foot on the
   other, over the waveform from the top of the page, now steady. The band is
   --cta rather than brand blue so the white body text passes AA. */
export function BrandVoiceCTA({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        {/* Kept to the stack's side on desktop, clear of the copy. */}
        <Waveform
          voiced
          tone="white"
          className="absolute inset-x-0 bottom-0 h-40 sm:h-52 lg:left-[46%]"
        />

        <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="px-6 pb-10 pt-14 sm:px-10 sm:pt-16 lg:py-20 lg:pl-14 lg:pr-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-blue shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)]">
              <Icon className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <h2
              id="cta-title"
              className="mt-6 max-w-lg text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
            >
              {feature.ctaTitle}
            </h2>
            <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
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
            className="flex flex-col justify-end px-6 sm:px-10 lg:pl-4 lg:pr-14 lg:pt-16"
          >
            <ArticleStack className="mx-auto h-[13rem] w-full max-w-md overflow-hidden sm:h-[14rem]" />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
