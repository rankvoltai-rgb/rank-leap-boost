/**
 * The sections of /features/citation-tracking, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections,
 * white throughout. Every word of feature copy comes from the feature's entry
 * in data/features.ts; these only decide how it's set. The labels written
 * here are structural and claim nothing the copy doesn't.
 */
import { Fragment, useState, type CSSProperties, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Gauge,
  HelpCircle,
  Plus,
  Repeat,
  Route,
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
import { CitationTracker } from "./tracker";
import { RadarEngines, RadarRings } from "./radar";
import { Pin } from "./parts";
import { useStill } from "./use-still";
import {
  ArticlesScreen,
  CheckPicture,
  CitationLog,
  CoverageScreen,
  DoubleDownPicture,
  PromptsPicture,
  TrendScreen,
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

/* The landing's centred lockup, set inside a scope: dotted rings, a slow beam,
   and the four tracked engines out on the rings. The accent line carries a
   citation marker, the way an AI answer marks its source. */
export function TrackingHero({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");
  const reduce = useStill();
  const Icon = feature.icon;

  return (
    <section id="top" aria-labelledby="feature-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_72%_78%_at_50%_56%,#000_42%,transparent_100%)]"
        >
          <RadarRings className="left-1/2 top-[56%]" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden motion-safe:animate-hero-rise lg:block"
          style={rise(0.5)}
        >
          <RadarEngines className="left-1/2 top-[56%]" />
        </div>

        <div className="relative flex flex-col items-center px-5 pb-16 pt-7 text-center sm:px-8 sm:pb-20 sm:pt-9 lg:pb-24">
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
            <Pill icon={Icon}>{feature.eyebrow}</Pill>
          </div>

          <h1
            id="feature-title"
            className="mt-6 font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.5rem] lg:text-[4.15rem]"
            style={rise(0.12)}
          >
            <span className="block">{feature.headline.lead}</span>{" "}
            <span className="inline-flex items-start whitespace-nowrap">
              <motion.span
                key={reduce ? "still" : "moving"}
                className="rounded-[0.08em] bg-no-repeat px-[0.04em] font-bold text-brand-blue"
                style={{
                  backgroundImage:
                    "linear-gradient(transparent 64%, color-mix(in oklab, var(--cta) 13%, white) 64%, color-mix(in oklab, var(--cta) 13%, white) 92%, transparent 92%)",
                }}
                initial={reduce ? false : { backgroundSize: "0% 100%" }}
                animate={{ backgroundSize: "100% 100%" }}
                transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {feature.headline.accent}
              </motion.span>
              <span
                aria-hidden
                className="ml-[0.1em] mt-[0.5em] inline-flex h-[1.55em] min-w-[1.55em] items-center justify-center rounded-[0.4em] bg-cta-soft px-[0.3em] font-sans text-[0.22em] font-semibold leading-none tracking-normal text-cta shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cta)_20%,transparent)]"
              >
                1
              </span>
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

/* ---------- The tracker, running ---------- */

/* The tracker on a fine dot grid, then the feature's facts as its legend:
   each fact carries the number pinned to the part of the tracker it
   describes. */
export function TrackingShowcase({ feature }: { feature: Feature }) {
  return (
    <section aria-label={`${feature.name}, running`}>
      <Band inner="overflow-hidden">
        <div className="relative bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_85%_75%_at_50%_45%,#000_35%,transparent_100%)]"
            style={{
              backgroundImage:
                "radial-gradient(color-mix(in oklab, var(--cta) 22%, transparent) 1px, transparent 1.2px)",
              backgroundSize: "18px 18px",
            }}
          />
          {/* Rises with the hero rather than on scroll: it starts in the
              first screen, so it never sits there blank. */}
          <div
            className="relative mx-auto max-w-[66rem] motion-safe:animate-hero-rise"
            style={rise(0.5)}
          >
            <CitationTracker />
          </div>
        </div>
      </Band>

      <Band>
        <dl
          aria-label={`${feature.name} at a glance`}
          className={cn("grid grid-cols-2 gap-px md:grid-cols-4", LINE_FILL)}
        >
          {feature.specs.map((s, i) => (
            <div key={s.label} className="flex gap-3 bg-white px-5 py-6 sm:px-7 sm:py-7">
              <Pin n={i + 1} className="mt-1.5" />
              <div className="flex min-w-0 flex-col-reverse justify-end">
                <dt className="mt-1 text-balance text-[0.8rem] leading-snug text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="font-display text-[1.2rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.5rem]">
                  {s.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

/* ---------- The blind spot ---------- */

/* Each "before" faces its "after" across one hairline, so the page reads as
   a list of fixes rather than two lists to compare. */
export function TrackingBlindSpot({ feature }: { feature: Feature }) {
  const { problem } = feature;
  if (!problem) return null;
  const rows = problem.before.map((before, i) => ({ before, after: problem.after[i] }));

  return (
    <section>
      <Spacer />
      <SectionHead
        icon={EyeOff}
        eyebrow="The blind spot"
        title={accented(problem.title, 4)}
        subtitle={problem.body}
      />
      <Band>
        <div className={cn("grid grid-cols-1 gap-px lg:grid-cols-2", LINE_FILL)}>
          <div className="hidden items-center gap-2.5 bg-white px-8 py-4 lg:flex">
            <EyeOff className="h-4 w-4 text-muted-foreground" />
            <span className="text-[0.85rem] font-medium text-muted-foreground">
              Without tracking
            </span>
          </div>
          <div className="hidden items-center gap-2.5 bg-[color-mix(in_oklab,var(--cta)_4%,white)] px-8 py-4 lg:flex lg:pl-12">
            <Eye className="h-4 w-4 text-cta" />
            <span className="text-[0.85rem] font-semibold text-ink">With {feature.name}</span>
          </div>

          {rows.map((row, i) => (
            <Fragment key={row.before}>
              <div className="bg-white">
                <Reveal
                  delay={i * 0.05}
                  className="flex h-full items-start gap-3.5 px-5 py-5 sm:px-8 sm:py-6"
                >
                  <span className="mt-0.5 w-5 shrink-0 text-[0.72rem] font-medium text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fdedf1] text-[#e11d48]">
                    <X className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <p className="text-[0.95rem] leading-snug text-muted-foreground">
                    <span className="sr-only">Without tracking: </span>
                    {row.before}
                  </p>
                </Reveal>
              </div>
              <div className="relative bg-[color-mix(in_oklab,var(--cta)_4%,white)]">
                {/* The joint where a row turns from before to after. */}
                <span
                  aria-hidden
                  className="absolute -left-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
                >
                  <ArrowRight className="h-3 w-3" />
                </span>
                <Reveal
                  delay={i * 0.05 + 0.08}
                  className="flex h-full items-start gap-3.5 px-5 py-5 pl-[3.35rem] sm:px-8 sm:py-6 sm:pl-[4.35rem] lg:pl-12"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <p className="text-[0.95rem] font-medium leading-snug text-ink">
                    <span className="sr-only">With {feature.name}: </span>
                    {row.after}
                  </p>
                </Reveal>
              </div>
            </Fragment>
          ))}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Steps ---------- */

const STEP_PICTURES = [PromptsPicture, CheckPicture, DoubleDownPicture];

/* Three cells on one track: the line through the step numbers fills from the
   first to the last as the band comes into view. */
export function TrackingSteps({ feature }: { feature: Feature }) {
  const reduce = useStill();
  const last = feature.steps.length - 1;
  return (
    <section>
      <Spacer />
      <SectionHead icon={Route} eyebrow="Step by step" title={accented(feature.stepsTitle, 2)} />
      <Band>
        <ol className={cn("grid grid-cols-1 gap-px lg:grid-cols-3", LINE_FILL)}>
          {feature.steps.map((s, i) => {
            const Picture = STEP_PICTURES[i];
            return (
              <li key={s.title} className="min-w-0 bg-white">
                <Reveal delay={i * 0.08} className="relative flex h-full flex-col p-6 sm:p-8">
                  {/* The track: in from the left edge, out to the right. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-[3.125rem] hidden h-px lg:block"
                  >
                    {i > 0 && (
                      <span className="absolute left-0 top-0 h-px w-8 bg-ink/[0.08]">
                        <motion.span
                          className="absolute inset-0 origin-left bg-cta"
                          initial={reduce ? false : { scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.25, delay: 0.35 + i * 0.55, ease: "linear" }}
                        />
                      </span>
                    )}
                    {i < last && (
                      <span className="absolute left-[3.125rem] right-0 top-0 h-px bg-ink/[0.08]">
                        <motion.span
                          className="absolute inset-0 origin-left bg-cta"
                          initial={reduce ? false : { scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.45, delay: 0.1 + i * 0.55, ease: "linear" }}
                        />
                      </span>
                    )}
                  </span>
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cta/25 bg-white text-[0.85rem] font-semibold text-cta shadow-[0_0_0_4px_white,0_0_0_5px_color-mix(in_oklab,var(--cta)_10%,transparent)] tabular-nums">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  {Picture && (
                    <div
                      aria-hidden
                      className={cn("mt-6 flex-1 rounded-xl border border-ink/[0.06] p-3.5", PANEL)}
                    >
                      <Picture />
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

/* ---------- What you see ---------- */

/* Each benefit's tint, from the landing's feature rows. */
const TINTS = [
  { icon: Gauge, panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
  { icon: FileText, panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
  { icon: BarChart3, panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
] as const;

function BenefitText({
  i,
  title,
  body,
  className,
}: {
  i: number;
  title: string;
  body: string;
  className?: string;
}) {
  const tint = TINTS[i % TINTS.length];
  const Icon = tint.icon;
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: tint.tile, color: tint.ink }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[0.75rem] font-medium text-muted-foreground tabular-nums">
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-5 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.7rem]">
        {title}
      </h3>
      <p className="mt-2.5 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

/* Two benefits side by side, the third across the full width, where its
   chart has room to read. */
export function TrackingBenefits({ feature }: { feature: Feature }) {
  const [coverage, works, impact] = feature.benefits;
  const screens: ComponentType[] = [CoverageScreen, ArticlesScreen];
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={BarChart3}
        eyebrow="In one view"
        title={accented(feature.benefitsTitle, 1)}
        subtitle={feature.benefitsIntro}
      />
      <Band>
        <div className={cn("grid grid-cols-1 gap-px lg:grid-cols-2", LINE_FILL)}>
          {[coverage, works].map((b, i) => {
            if (!b) return null;
            const Screen = screens[i];
            return (
              <div key={b.title} className="group bg-white">
                <Reveal delay={i * 0.06} className="flex h-full flex-col">
                  <BenefitText
                    i={i}
                    title={b.title}
                    body={b.body}
                    className="px-6 pb-8 pt-9 sm:px-10"
                  />
                  <div className="mt-auto px-3 pb-3">
                    <div
                      aria-hidden
                      className="relative h-[16.5rem] overflow-hidden sm:h-[17.5rem]"
                      style={{ background: TINTS[i].panel }}
                    >
                      <Screen />
                    </div>
                  </div>
                </Reveal>
              </div>
            );
          })}
          {impact && (
            <div className="bg-white lg:col-span-2">
              <Reveal className="grid lg:grid-cols-[0.8fr_1.2fr]">
                <BenefitText
                  i={2}
                  title={impact.title}
                  body={impact.body}
                  className="flex flex-col justify-center px-6 pb-8 pt-9 sm:px-10 lg:py-12 lg:pl-14"
                />
                <div className="px-3 pb-3 lg:py-3 lg:pl-0">
                  <div
                    aria-hidden
                    className="flex h-full items-center px-4 py-8 sm:px-10 sm:py-10"
                    style={{ background: TINTS[2].panel }}
                  >
                    <div className="mx-auto w-full max-w-[34rem]">
                      <TrendScreen />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          )}
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

/* ---------- The loop ---------- */

const LOOP = ["answer-space-research", "citation-ready-writer", "citation-tracking"] as const;

function LoopCard({ slug, current }: { slug: string; current: boolean }) {
  const f = getFeature(slug);
  if (!f) return null;
  const Icon = f.icon;
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            current
              ? "bg-cta text-white"
              : "border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        {current ? (
          <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-cta">
            You&rsquo;re here
          </span>
        ) : (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
        )}
      </div>
      <p className="mt-5 text-[0.98rem] font-semibold text-ink">{f.name}</p>
      <p className="mt-1 text-[0.84rem] leading-relaxed text-muted-foreground">{f.tagline}</p>
    </>
  );
  const shell =
    "relative z-10 flex h-full flex-col rounded-xl border bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.2)]";
  if (current) {
    return (
      <div
        aria-current="page"
        className={cn(
          shell,
          "border-cta/30 shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_8%,transparent),0_12px_32px_-18px_rgba(16,24,40,0.22)]",
        )}
      >
        {body}
      </div>
    );
  }
  return (
    <Link
      to="/features/$slug"
      params={{ slug }}
      className={cn(
        shell,
        "group border-ink/[0.07] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
      )}
    >
      {body}
    </Link>
  );
}

/* Research feeds the writer, the writer feeds tracking, and tracking runs
   back to the writer: the loop the feature's copy describes. */
export function TrackingLoop({ feature }: { feature: Feature }) {
  const reduce = useStill();
  const back = feature.steps[feature.steps.length - 1]?.title;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Repeat}
        eyebrow="Closes the loop"
        title={
          <>
            Research, write, <Accent>track, repeat</Accent>
          </>
        }
        subtitle={feature.connects}
      />
      <Band inner={PANEL}>
        <div className="px-5 pb-10 pt-10 sm:px-10 lg:px-14 lg:pb-12 lg:pt-14">
          <ol className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-14">
            {LOOP.map((slug, i) => (
              <li key={slug} className="relative">
                <Reveal delay={i * 0.08} className="lg:h-full">
                  <LoopCard slug={slug} current={slug === feature.slug} />
                </Reveal>
                {i < LOOP.length - 1 && (
                  <>
                    <span
                      aria-hidden
                      className="absolute -right-[2.6rem] top-1/2 z-20 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span aria-hidden className="flex justify-center pt-3 text-cta lg:hidden">
                      <ArrowDown className="h-4 w-4" />
                    </span>
                  </>
                )}
              </li>
            ))}
          </ol>

          {/* The way back: from tracking to the writer, under the cards. */}
          {back && (
            <div aria-hidden className="relative mt-0 hidden h-16 lg:block">
              <div className="absolute left-[50%] right-[16.667%] top-0 h-10 rounded-b-2xl border-x border-b border-dashed border-cta/40">
                {!reduce && (
                  <motion.span
                    className="absolute -bottom-[4px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-cta shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_18%,transparent)]"
                    initial={{ left: "100%", opacity: 0 }}
                    whileInView={{ left: ["100%", "0%"], opacity: [0, 1, 1, 0] }}
                    viewport={{ amount: 0.6 }}
                    transition={{
                      duration: 3.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 1.2,
                    }}
                  />
                )}
                <span className="absolute -left-[6px] -top-[7px] text-cta">
                  <svg viewBox="0 0 11 9" className="h-[9px] w-[11px]" fill="currentColor">
                    <path d="M5.5 0 11 9H0z" />
                  </svg>
                </span>
              </div>
              <span className="absolute left-[66.667%] top-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-md border border-cta/25 bg-white px-2 py-1 text-[0.72rem] font-semibold text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                <Repeat className="h-3 w-3" />
                {back}
              </span>
            </div>
          )}
          {back && (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.8rem] font-medium text-cta lg:hidden">
              <Repeat className="h-3.5 w-3.5" />
              {back}
              <ArrowRight className="h-3 w-3" />
              {getFeature(LOOP[1])?.name}
            </p>
          )}
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

/* Centred, one column of numbered questions under its own head. The answers
   stay in the server HTML (forceMount) for the FAQ schema the head emits. */
export function TrackingFAQ({ feature }: { feature: Feature }) {
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
      >
        <a href="/#faq" className={cn(GHOST_BUTTON, "group/btn mt-6")}>
          Read the full FAQ
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </a>
      </SectionHead>
      <Band inner="px-5 py-4 sm:px-8 sm:py-6">
        <Reveal className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
            {feature.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center gap-4 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2 sm:gap-5">
                    <span className="w-6 shrink-0 text-[0.75rem] font-medium text-muted-foreground tabular-nums">
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
                  className="max-w-2xl pb-5 pl-10 pr-10 text-sm leading-relaxed text-muted-foreground sm:pl-11"
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

/* Blue inside the rails (--cta, so the white body text passes AA), the
   scope's rings in white, the copy on the left and the log of citing answers
   rising from the band's foot on the right. */
export function TrackingCTA({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_90%_at_70%_60%,#000_30%,transparent_100%)]"
        >
          <RadarRings tone="white" className="left-[72%] top-[62%]" />
        </div>

        <div className="relative grid items-end lg:grid-cols-[1fr_1.05fr]">
          <Reveal className="px-6 pb-12 pt-16 text-center sm:px-10 lg:pb-20 lg:pl-14 lg:pr-6 lg:pt-20 lg:text-left">
            <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-blue shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] lg:mx-0">
              <Icon className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <h2
              id="cta-title"
              className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
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

          {/* The log rises from the band's foot and is cut off by it. */}
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto h-[15rem] w-full max-w-[30rem] overflow-hidden px-5 sm:h-[16rem] lg:ml-0 lg:mr-14 lg:mt-20 lg:h-[18rem] lg:w-auto lg:max-w-none lg:px-0"
          >
            <div
              aria-hidden
              className="rounded-t-xl shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]"
            >
              <CitationLog />
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
