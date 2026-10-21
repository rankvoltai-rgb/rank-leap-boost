/**
 * The sections of /features/citation-ready-writer, in the landing page's
 * frame: hairline rails, a hairline over every band, blank bands between
 * sections, white throughout. All copy comes from the feature's entry in
 * data/features.ts; these only decide how it's set. The labels on the pills
 * and the two titles the data doesn't carry (the FAQ's and the hub's) are
 * this page's own.
 *
 * The page is written on ruled paper: the hero sits on it, the live draft
 * sits on a stack of drafts, the problem is set as an editor's redline, and
 * the closing band returns to the ruled lines in white.
 */
import { useState, type ComponentType, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Check,
  ChevronRight,
  FileCheck2,
  FileText,
  Globe,
  HelpCircle,
  Languages,
  ListOrdered,
  Plus,
  Quote,
  ShieldCheck,
  TextQuote,
  Waypoints,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { LiveDraft } from "./live-draft";
import {
  PickTopic,
  PublishedCard,
  QuotableScreen,
  ResearchAndDraft,
  ResearchScreen,
  ReviewAndPublish,
  RuledPaper,
  Struck,
  VoiceScreen,
} from "./visuals";

/** One screen per benefit, and one picture per step, in the data's order. */
const BENEFIT_SCREENS: ComponentType[] = [ResearchScreen, VoiceScreen, QuotableScreen];
const STEP_PICTURES: ComponentType[] = [PickTopic, ResearchAndDraft, ReviewAndPublish];

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

const H2 =
  "font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]";

/* ---------- Hero ---------- */

/* The landing hero, set as a page of writing: the headline flush left on
   ruled paper, ending on a citation marker, with the promise and the form
   on the line below. */
export function WriterHero({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");

  return (
    <section id="top" aria-labelledby="feature-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <RuledPaper className="[mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_72%,transparent),linear-gradient(to_right,#000_35%,transparent_92%)]" />

        <div className="relative px-5 pb-14 pt-7 sm:px-16 sm:pb-16 sm:pt-9 lg:px-[4.75rem] lg:pb-20">
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
            <Pill icon={feature.icon}>{feature.eyebrow}</Pill>
          </div>

          <h1
            id="feature-title"
            className="mt-6 font-display text-[2.35rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink min-[400px]:text-[2.6rem] sm:text-[3.6rem] lg:text-[4.5rem]"
          >
            <span className="block motion-safe:animate-hero-rise" style={rise(0.12)}>
              {feature.headline.lead}
            </span>{" "}
            <span className="block motion-safe:animate-hero-rise" style={rise(0.2)}>
              <span className="font-bold text-brand-blue">{feature.headline.accent}</span>
              {/* A citation marker, drawn from a data attribute so it is never
                  part of the heading's text. */}
              <span
                aria-hidden
                data-n="1"
                className="relative -top-[1.9em] ml-[0.35em] inline-flex h-[1.5em] min-w-[1.5em] items-center justify-center rounded-[0.4em] bg-cta px-[0.35em] align-baseline text-[0.26em] font-semibold leading-none tracking-normal text-white shadow-[0_0_0_0.35em_color-mix(in_oklab,var(--cta)_12%,transparent)] after:content-[attr(data-n)]"
              />
            </span>
          </h1>

          <div className="mt-8 grid gap-7 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:items-end lg:gap-16">
            <p
              className="max-w-[35rem] text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.15rem]"
              style={rise(0.28)}
            >
              {feature.subhead}
            </p>
            <div className="motion-safe:animate-hero-rise" style={rise(0.36)}>
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- The draft, being written ---------- */

const SPEC_ICONS = [FileText, Globe, Languages, ShieldCheck];

/* The live draft on a pale blue desk, sitting on a stack of earlier drafts,
   then the spec sheet ruled off beneath it. */
export function WriterShowcase({ feature }: { feature: Feature }) {
  return (
    <section aria-label={`${feature.name}, drafting a sample article`}>
      <Band inner="overflow-hidden">
        <div className="relative bg-[#eef4fe] px-3 pb-14 pt-10 sm:px-10 sm:pb-20 sm:pt-14 lg:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_35%,transparent_100%)]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent calc(2.5rem - 1px), rgba(24,119,242,0.09) calc(2.5rem - 1px), rgba(24,119,242,0.09) 2.5rem)",
            }}
          />
          <div className="relative mx-auto max-w-[68rem]">
            <div
              aria-hidden
              className="absolute inset-x-4 -bottom-2.5 top-4 rounded-xl bg-white/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-ink/[0.05] sm:inset-x-8 sm:-bottom-3.5"
            />
            <div
              aria-hidden
              className="absolute inset-x-9 -bottom-5 top-8 rounded-xl bg-white/55 ring-1 ring-ink/[0.04] sm:inset-x-16 sm:-bottom-7"
            />
            <Reveal y={36} className="relative">
              <LiveDraft />
            </Reveal>
          </div>
        </div>
      </Band>

      {/* The spec sheet. White sits on still wrappers so a fading cell never
          shows the hairline fill behind it. */}
      <Band>
        <ul
          aria-label={`${feature.name} at a glance`}
          className={cn("grid grid-cols-2 gap-px lg:grid-cols-4", LINE_FILL)}
        >
          {feature.specs.map((s, i) => {
            const Icon = SPEC_ICONS[i % SPEC_ICONS.length];
            return (
              <li key={s.label} className="bg-white">
                <Reveal delay={i * 0.05} className="flex h-full flex-col px-5 py-6 sm:px-8 sm:py-8">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-4 font-display text-[1.3rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.55rem]">
                    {s.value}
                  </p>
                  <p className="mt-2 max-w-[15rem] text-[0.8rem] leading-snug text-muted-foreground">
                    {s.label}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}

/* ---------- In every draft ---------- */

/* Each benefit's tint, from the landing's feature rows. */
const BENEFIT_STYLE = [
  { icon: Globe, panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
  { icon: AudioLines, panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
  { icon: Quote, panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
] as const;

/* A bento rather than rows: research and voice side by side, and the one the
   page is named for, structure, across the full width beneath them. */
export function WriterBenefits({ feature }: { feature: Feature }) {
  const n = feature.benefits.length;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={FileCheck2}
        eyebrow="In every draft"
        title={accented(feature.benefitsTitle, 2)}
        subtitle={feature.benefitsIntro}
      />
      <Band>
        <div className={cn("grid gap-px lg:grid-cols-2", LINE_FILL)}>
          {feature.benefits.map((b, i) => {
            const style = BENEFIT_STYLE[i % BENEFIT_STYLE.length];
            const Icon = style.icon;
            const Screen = BENEFIT_SCREENS[i];
            const wide = n % 2 === 1 && i === n - 1;
            return (
              <div key={b.title} className={cn("bg-white", wide && "lg:col-span-2")}>
                <Reveal
                  delay={wide ? 0 : (i % 2) * 0.06}
                  className={cn(
                    "group h-full",
                    wide ? "grid lg:grid-cols-[0.72fr_1.28fr]" : "flex flex-col",
                  )}
                >
                  <div
                    className={cn(
                      "px-6 pt-8 sm:px-10 sm:pt-10",
                      wide && "lg:flex lg:flex-col lg:justify-center lg:py-12 lg:pl-12 lg:pr-6",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ background: style.tile, color: style.ink }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[0.75rem] font-medium tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.7rem]">
                      {b.title}
                    </h3>
                    <p className="mt-2.5 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                      {b.body}
                    </p>
                  </div>
                  {/* Inset from the cell by a hairline of white, as on the landing. */}
                  <div className={cn("mt-8 p-3", wide && "lg:mt-0 lg:pl-0")}>
                    <div
                      aria-hidden
                      className={cn(
                        "relative overflow-hidden",
                        wide ? "h-[25rem] sm:h-[15.5rem]" : "h-[17rem] sm:h-[17.5rem]",
                      )}
                      style={{ background: style.panel }}
                    >
                      {Screen && <Screen />}
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

/* ---------- Generic vs citation-ready ---------- */

/* The problem as an editor's redline: each thing a generic AI draft gets
   wrong, struck out, beside what this writer puts in its place. */
export function WriterProblem({ feature }: { feature: Feature }) {
  const { problem } = feature;
  if (!problem) return null;
  const rows = Math.max(problem.before.length, problem.after.length);

  return (
    <section>
      <Spacer />
      <SectionHead
        icon={TextQuote}
        eyebrow="Generic vs. citation-ready"
        title={accented(problem.title, 2)}
        subtitle={problem.body}
      />
      <Band>
        <div className={cn("grid gap-px sm:grid-cols-2", LINE_FILL)}>
          {/* Column heads, on wider screens; phones label each cell instead. */}
          <div className="hidden items-center gap-3 bg-[#fdf7f9] px-6 py-4 sm:flex sm:px-10">
            <Struck className="h-6 w-6 [&>svg]:h-3 [&>svg]:w-3" />
            <p className="text-[0.9rem] font-semibold text-ink">A generic AI draft</p>
          </div>
          <div className="hidden items-center gap-3 bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-6 py-4 sm:flex sm:px-10">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cta text-white">
              <feature.icon className="h-3 w-3" />
            </span>
            <p className="text-[0.9rem] font-semibold text-ink">A citation-ready draft</p>
          </div>

          {Array.from({ length: rows }, (_, i) => {
            const before = problem.before[i];
            const after = problem.after[i];
            return [
              <div key={`b${i}`} className="bg-white">
                <Reveal delay={i * 0.04} className="flex h-full gap-3 px-6 py-5 sm:px-10 sm:py-6">
                  {before && (
                    <>
                      <Struck className="mt-0.5" />
                      <p className="text-[0.92rem] leading-snug text-muted-foreground">
                        <span className="mb-1 block text-[0.68rem] font-medium sm:hidden">
                          Generic AI
                        </span>
                        <del className="decoration-[#e11d48]/45 decoration-[1.5px]">{before}</del>
                      </p>
                    </>
                  )}
                </Reveal>
              </div>,
              <div key={`a${i}`} className="relative bg-white">
                {/* The joint on the hairline between the two. */}
                <span
                  aria-hidden
                  className="absolute left-6 top-0 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] sm:left-0 sm:top-1/2 sm:-translate-x-1/2"
                >
                  <ArrowRight className="hidden h-3 w-3 sm:block" />
                  <ArrowDown className="h-3 w-3 sm:hidden" />
                </span>
                <Reveal
                  delay={i * 0.04 + 0.04}
                  className="flex h-full gap-3 px-6 py-5 sm:px-10 sm:py-6"
                >
                  {after && (
                    <>
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      <p className="text-[0.92rem] font-medium leading-snug text-ink">
                        <span className="mb-1 block text-[0.68rem] font-medium text-cta sm:hidden">
                          Rankbox
                        </span>
                        <ins className="no-underline">{after}</ins>
                      </p>
                    </>
                  )}
                </Reveal>
              </div>,
            ];
          })}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Topic to draft ---------- */

/* The steps down a ruled column, the title and the call to action holding
   still beside them on wide screens. */
export function WriterSteps({ feature }: { feature: Feature }) {
  return (
    <section>
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Reveal className="lg:sticky lg:top-28">
              <Pill icon={ListOrdered} className="w-fit">
                Topic to draft
              </Pill>
              <h2 className={cn("mt-5 max-w-md text-balance", H2)}>
                {accented(feature.stepsTitle, 2)}
              </h2>
              <div className="mt-8">
                <a href="/auth" className={SOLID_BUTTON}>
                  Start your free trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <p className="mt-3 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
              </div>
            </Reveal>
          </div>

          <ol className="divide-y divide-ink/[0.07]">
            {feature.steps.map((s, i) => {
              const Picture = STEP_PICTURES[i];
              const last = i === feature.steps.length - 1;
              return (
                <li key={s.title} className="relative">
                  <Reveal
                    delay={i * 0.05}
                    className="grid gap-6 px-6 py-8 sm:grid-cols-[minmax(0,1fr)_17.5rem] sm:items-start sm:px-10 lg:px-12 lg:py-10"
                  >
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cta text-[0.85rem] font-semibold tabular-nums text-white">
                          {i + 1}
                        </span>
                        {!last && <span aria-hidden className="mt-2 w-px flex-1 bg-cta/20" />}
                      </div>
                      <div className="pb-1">
                        <h3 className="text-[1.1rem] font-semibold tracking-tight text-ink">
                          {s.title}
                        </h3>
                        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                          {s.body}
                        </p>
                      </div>
                    </div>
                    {Picture && (
                      <div
                        aria-hidden
                        className={cn("rounded-xl border border-ink/[0.06] p-3", PANEL)}
                      >
                        <Picture />
                      </div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Every answer open on the page, as a grid of short cards: the answers are
   brief, and nothing has to be clicked to read them. */
export function WriterFAQ({ feature }: { feature: Feature }) {
  const n = feature.faqs.length;
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <Band inner="flex flex-col items-start gap-6 px-6 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-10 lg:px-12 lg:py-12">
        <Reveal>
          <Pill icon={HelpCircle} className="w-fit">
            FAQ
          </Pill>
          <h2 className={cn("mt-5 max-w-xl", H2)}>
            Before your <Accent>first draft</Accent>
          </h2>
        </Reveal>
        <a href="/#faq" className={cn(GHOST_BUTTON, "group/btn shrink-0")}>
          Read the full FAQ
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </a>
      </Band>
      <Band>
        <div className={cn("grid gap-px md:grid-cols-2 lg:grid-cols-3", LINE_FILL)}>
          {feature.faqs.map((f, i) => {
            const last = i === n - 1;
            return (
              <div
                key={f.q}
                className={cn(
                  "bg-white",
                  last && n % 2 === 1 && "md:col-span-2 lg:col-span-1",
                  last && n % 3 === 1 && "lg:col-span-3",
                  last && n % 3 === 2 && "lg:col-span-2",
                )}
              >
                <Reveal delay={(i % 3) * 0.05} className="h-full px-6 py-7 sm:px-8 sm:py-8">
                  <span className="font-mono text-[0.68rem] font-semibold text-cta">
                    Q{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[1rem] font-semibold leading-snug tracking-tight text-ink">
                    {f.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Before and after the draft ---------- */

/* What feeds the writer, and what takes its drafts, each named in the
   feature's `connects` line. */
const INPUTS = [
  { slug: "answer-space-research", role: "Sends the topics" },
  { slug: "brand-voice", role: "Sets the voice" },
];
const OUTPUTS = [
  { slug: "seo-geo-score", role: "Checks each draft" },
  { slug: "auto-publishing", role: "Puts it live" },
];

const JOINT =
  "absolute z-10 flex h-6 w-6 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)]";

function HubNode({
  slug,
  role,
  className,
  joint,
}: {
  slug: string;
  role: string;
  className?: string;
  joint?: React.ReactNode;
}) {
  const f = getFeature(slug);
  if (!f) return null;
  const Icon = f.icon;
  return (
    <div className={cn("relative bg-white", className)}>
      {joint}
      <Reveal className="h-full">
        <Link
          to="/features/$slug"
          params={{ slug }}
          className="group flex h-full flex-col justify-center p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-8 sm:py-7"
        >
          <span className="text-[0.7rem] font-medium text-muted-foreground">{role}</span>
          <span className="mt-3 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-[0.95rem] font-semibold text-ink">{f.name}</span>
            <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
          </span>
          <span className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground">
            {f.tagline}
          </span>
        </Link>
      </Reveal>
    </div>
  );
}

export function WriterConnects({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Waypoints}
        eyebrow="Before and after the draft"
        title={
          <>
            Fed by research, <Accent>checked before it ships</Accent>
          </>
        }
        subtitle={feature.connects}
      />
      <Band>
        <div
          className={cn(
            "grid gap-px lg:grid-cols-[1fr_1.15fr_1fr] lg:grid-rows-[auto_auto]",
            LINE_FILL,
          )}
        >
          <HubNode
            {...INPUTS[0]}
            className="lg:col-start-1 lg:row-start-1"
            joint={
              <span
                aria-hidden
                className={cn(
                  JOINT,
                  "right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 lg:flex",
                )}
              >
                <ArrowRight className="h-3 w-3" />
              </span>
            }
          />
          <HubNode
            {...INPUTS[1]}
            className="lg:col-start-1 lg:row-start-2"
            joint={
              <>
                <span
                  aria-hidden
                  className={cn(
                    JOINT,
                    "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 lg:hidden",
                  )}
                >
                  <Plus className="h-3 w-3" />
                </span>
                <span
                  aria-hidden
                  className={cn(
                    JOINT,
                    "right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 lg:flex",
                  )}
                >
                  <ArrowRight className="h-3 w-3" />
                </span>
              </>
            }
          />

          {/* The writer, where both arrive. */}
          <div className="relative bg-white lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <span
              aria-hidden
              className={cn(JOINT, "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 lg:hidden")}
            >
              <ArrowDown className="h-3 w-3" />
            </span>
            <Reveal delay={0.06} className="h-full">
              <div
                aria-current="page"
                className="flex h-full flex-col items-center justify-center bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-6 py-10 text-center sm:px-10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cta text-white shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--cta)_80%,transparent)]">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span className="mt-4 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-cta">
                  You&rsquo;re here
                </span>
                <p className="mt-2 font-display text-[1.35rem] font-medium tracking-[-0.02em] text-ink">
                  {feature.name}
                </p>
                <p className="mt-1.5 max-w-xs text-[0.85rem] leading-relaxed text-muted-foreground">
                  {feature.tagline}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {feature.benefits.map((b) => (
                    <span
                      key={b.title}
                      className="rounded-md border border-ink/[0.08] bg-white px-2 py-1 text-[0.7rem] font-medium text-ink"
                    >
                      {b.title}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <HubNode
            {...OUTPUTS[0]}
            className="lg:col-start-3 lg:row-start-1"
            joint={
              <>
                <span
                  aria-hidden
                  className={cn(
                    JOINT,
                    "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 lg:hidden",
                  )}
                >
                  <ArrowDown className="h-3 w-3" />
                </span>
                <span
                  aria-hidden
                  className={cn(
                    JOINT,
                    "left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex",
                  )}
                >
                  <ArrowRight className="h-3 w-3" />
                </span>
              </>
            }
          />
          <HubNode
            {...OUTPUTS[1]}
            className="lg:col-start-3 lg:row-start-2"
            joint={
              <span
                aria-hidden
                className={cn(JOINT, "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2")}
              >
                <ArrowDown className="h-3 w-3" />
              </span>
            }
          />
        </div>
      </Band>
      <Band inner="flex justify-center px-5 py-6">
        <Link to="/features" className={cn(GHOST_BUTTON, "group/btn")}>
          See every feature
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* Blue inside the rails, back on the ruled lines in white. The promise sits
   on the left; the sample draft, published, rises from the band's foot on
   the right and is cut off by it. The band is --cta rather than brand blue
   so the white body text passes AA. */
export function WriterCTA({ feature }: { feature: Feature }) {
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <RuledPaper
          tone="white"
          className="[mask-image:radial-gradient(ellipse_85%_95%_at_25%_50%,#000_30%,transparent_100%)]"
        />
        <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <Reveal className="px-6 pb-12 pt-14 sm:px-16 sm:pt-16 lg:py-20 lg:pl-[4.75rem] lg:pr-6">
            <h2
              id="cta-title"
              className="max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              {feature.ctaTitle}
            </h2>
            <p className="mt-4 max-w-md text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
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
            className="mx-5 h-[12.5rem] overflow-hidden sm:mx-16 sm:h-[13.5rem] lg:ml-0 lg:mr-14 lg:mt-16 lg:h-[16rem]"
          >
            <PublishedCard />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
