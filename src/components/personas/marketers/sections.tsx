/**
 * The sections of /use-cases/marketers, in the landing page's frame: hairline
 * rails, a hairline over every band, blank bands between sections, white
 * throughout. Every word a visitor reads comes from the `marketers` entry in
 * data/personas.ts; these only decide how it's set. The labels written here
 * (pills, column heads, captions) are structural and make no product claim.
 *
 * The page is built around the calendar a marketer already plans in: the
 * hero fills one, the body splits the work at the approve button, then walks
 * the week, the features, and the budget line straight into the price.
 */
import { useState, type ComponentType, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Compass,
  FileText,
  Gauge,
  HelpCircle,
  LayoutGrid,
  ListChecks,
  PenLine,
  Plus,
  Presentation,
  Receipt,
  Repeat,
  Search,
  Send,
  Split,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Mark } from "@/components/brand/Mark";
import {
  Accent,
  Band,
  GHOST_BUTTON,
  LINE,
  LINE_FILL,
  PANEL,
  Pill,
  SectionHead,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { getFeature } from "@/data/features";
import { PLAN, STUDIO, formatUsd } from "@/data/pricing";
import { PERSONAS, PERSONA_GROUPS, type Persona } from "@/data/personas";
import { CalendarFull, CalendarScene } from "./calendar-scene";
import { StepPicture } from "./pictures";

type Icon = ComponentType<{ className?: string }>;

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

/* The landing's feature-row tints, one per card where a set needs telling apart. */
const TINTS = [
  { panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
  { panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
  { panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
  { panel: "#fdedf1", tile: "#fbd9e2", ink: "#e11d48" },
] as const;

/* ---------- Hero ---------- */

/* Split, unlike the landing's centred lockup: the copy on the left, and the
   calendar it promises on a soft blue panel flush to the right rail. The
   facts band closes the frame under both. */
export function MarketersHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="persona-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center px-5 pb-12 pt-7 sm:px-10 sm:pb-14 lg:py-14 lg:pl-12 lg:pr-6">
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
                  <Link to="/use-cases" className="py-2 transition-colors hover:text-ink">
                    Use cases
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li aria-current="page" className="font-medium text-ink">
                  {persona.name}
                </li>
              </ol>
            </nav>

            <div className="mt-9 motion-safe:animate-hero-rise lg:mt-10" style={rise(0.05)}>
              <Pill icon={Icon}>{persona.eyebrow}</Pill>
            </div>

            <h1
              id="persona-title"
              className="mt-5 font-display text-[2.15rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.5rem] lg:text-[2.85rem] xl:text-[3.15rem]"
              style={rise(0.12)}
            >
              <span className="block">{persona.headline.lead}</span>{" "}
              <span className="mt-[0.06em] inline-flex items-center gap-[0.2em] whitespace-nowrap">
                <span
                  aria-hidden
                  className="inline-flex h-[0.8em] w-[0.8em] shrink-0 items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                >
                  <Icon className="h-[48%] w-[48%] text-brand-blue" strokeWidth={2.4} />
                </span>
                <span className="font-bold text-brand-blue">{persona.headline.accent}</span>
              </span>
            </h1>

            <p
              className="mt-5 max-w-[34rem] text-[1rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.22)}
            >
              {persona.subhead}
            </p>

            <div
              className="mt-8 w-full max-w-[34rem] motion-safe:animate-hero-rise"
              style={rise(0.32)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          {/* Flush to the right rail, with a hairline of white around it. */}
          <div
            className="px-3 pb-3 motion-safe:animate-hero-rise lg:py-3 lg:pl-0 lg:pr-3"
            style={rise(0.3)}
          >
            <div className="relative flex h-full items-center overflow-hidden bg-[#eaf2fe] px-3 py-8 sm:px-10 sm:py-12 lg:px-6">
              {/* Planner paper: a faint dot grid behind the window. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(24,119,242,0.16)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)]"
              />
              <CalendarScene className="mx-auto w-full max-w-[36rem]" />
            </div>
          </div>
        </div>
      </div>

      {/* The facts band. Top hairline only: the spacer under it draws the next. */}
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.42)}>
        <dl
          aria-label={`Rankbox for ${persona.nameLower} at a glance`}
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-2 gap-px border-x md:grid-cols-4",
            LINE,
            LINE_FILL,
          )}
        >
          {persona.specs.map((s) => (
            <div
              key={s.label}
              className="flex flex-col-reverse justify-center bg-white px-5 py-6 sm:px-7 sm:py-7"
            >
              <dt className="mt-1.5 text-balance text-[0.8rem] leading-snug text-muted-foreground">
                {s.label}
              </dt>
              <dd className="font-display text-[1.4rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.6rem]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- In one paragraph ---------- */

/* The quotable answer, set where a reader (or an answer engine) meets it
   first: the page's tagline as the heading, the short answer beside it. */
export function MarketersInShort({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="in-short-title">
      <Band>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:py-14 lg:pl-12",
              LINE,
            )}
          >
            <Pill icon={persona.icon} className="w-fit">
              Rankbox for {persona.nameLower}
            </Pill>
            <h2
              id="in-short-title"
              className="mt-5 text-balance font-display text-[1.75rem] font-medium leading-[1.14] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            >
              {persona.tagline}
            </h2>
          </Reveal>
          <Reveal
            delay={0.06}
            className="flex items-center px-6 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-14"
          >
            <p className="border-l-2 border-cta/40 pl-5 text-[1.02rem] leading-[1.7] text-ink/80 sm:text-[1.08rem]">
              {persona.shortAnswer}
            </p>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Who owns what ---------- */

const RUN_ICONS: Icon[] = [Search, FileText, Gauge, Send];
const KEEP_ICONS: Icon[] = [Compass, ListChecks, PenLine, Presentation];

/* The work, split at the approve button: what runs itself on a soft blue
   panel, what stays the reader's on plain white, and the approval as the
   joint between them. */
export function MarketersHandoff({ persona }: { persona: Persona }) {
  const { handoff } = persona;
  return (
    <section aria-labelledby="handoff-title">
      <SectionHead
        id="handoff"
        icon={Split}
        eyebrow="Who owns what"
        title={
          <span id="handoff-title">
            Where Rankbox stops and <Accent>you take over</Accent>
          </span>
        }
        subtitle={`${handoff.runs.length} jobs run on their own. ${handoff.keeps.length} stay with you.`}
      />
      <Band>
        <div className="relative grid lg:grid-cols-2">
          <div className="bg-[#eaf2fe] px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta text-white shadow-[0_1px_2px_rgba(16,24,40,0.12)]">
                  <Mark className="h-[18px] w-[18px]" />
                </span>
                <h3 className="text-[1.15rem] font-semibold tracking-tight text-ink">
                  {handoff.runsTitle}
                </h3>
              </div>
            </Reveal>
            <ul className="mt-6 space-y-2.5">
              {handoff.runs.map((r, i) => {
                const RunIcon = RUN_ICONS[i % RUN_ICONS.length];
                return (
                  <li key={r.label}>
                    <Reveal delay={0.04 * i}>
                      <div className="flex gap-3.5 rounded-xl border border-ink/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_10px_24px_-18px_rgba(16,24,40,0.2)]">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
                          <RunIcon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[0.95rem] font-semibold text-ink">{r.label}</p>
                          <p className="mt-0.5 text-[0.86rem] leading-relaxed text-muted-foreground">
                            {r.detail}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The joint: on wide screens it sits on the seam between halves;
              stacked, it rides the hairline between the two lists. */}
          <div
            aria-hidden
            className={cn(
              "relative flex justify-center border-t lg:absolute lg:left-1/2 lg:top-0 lg:z-10 lg:-translate-x-1/2 lg:border-t-0",
              LINE,
            )}
          >
            <span className="-my-[15px] inline-flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/[0.08] bg-white px-3 text-[0.75rem] font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.06),0_8px_20px_-12px_rgba(16,24,40,0.3)] lg:my-0 lg:-translate-y-1/2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cta text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              Your approval
            </span>
          </div>

          <div className={cn("px-5 py-8 sm:px-10 sm:py-10 lg:border-l lg:px-12 lg:py-12", LINE)}>
            <Reveal delay={0.06}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  <UserRound className="h-[18px] w-[18px]" />
                </span>
                <h3 className="text-[1.15rem] font-semibold tracking-tight text-ink">
                  {handoff.keepsTitle}
                </h3>
              </div>
            </Reveal>
            <ul className={cn("mt-6 divide-y border-y", LINE, "divide-ink/[0.07]")}>
              {handoff.keeps.map((k, i) => {
                const KeepIcon = KEEP_ICONS[i % KEEP_ICONS.length];
                return (
                  <li key={k.label}>
                    <Reveal delay={0.06 + 0.04 * i} className="flex gap-3.5 px-1 py-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70">
                        <KeepIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.95rem] font-semibold text-ink">{k.label}</p>
                        <p className="mt-0.5 text-[0.86rem] leading-relaxed text-muted-foreground">
                          {k.detail}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The week you're having ---------- */

/* A ledger, not a card grid: what the week looks like on the left, what
   changes on the right, one ruled row each. */
export function MarketersPains({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="pains-title">
      <SectionHead
        icon={CalendarDays}
        eyebrow="Monday to Friday"
        title={<span id="pains-title">{accented(persona.painsTitle, 2)}</span>}
        subtitle={persona.painsIntro}
      />
      <Band inner={PANEL}>
        <div
          aria-hidden
          className={cn(
            "hidden grid-cols-[4.5rem_1fr_1fr] border-b text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:grid",
            LINE,
          )}
        >
          <span />
          <span className="px-6 py-3.5 lg:px-8">On your plate</span>
          <span className={cn("border-l px-6 py-3.5 lg:px-8", LINE)}>What changes</span>
        </div>
        <ol>
          {persona.pains.map((p, i) => (
            <li
              key={p.pain}
              className={cn(
                "grid bg-white md:grid-cols-[4.5rem_1fr_1fr]",
                i > 0 && "border-t",
                LINE,
              )}
            >
              <Reveal
                delay={0.03 * i}
                className={cn(
                  "flex items-start px-6 pt-7 md:justify-center md:border-r md:px-0 md:py-8",
                  LINE,
                )}
              >
                <span className="text-[0.75rem] font-semibold tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
              <Reveal delay={0.03 * i} className="px-6 pb-3 pt-2 md:py-8 lg:px-8">
                <h3 className="text-balance font-display text-[1.2rem] font-medium leading-snug tracking-[-0.015em] text-ink sm:text-[1.3rem]">
                  {p.pain}
                </h3>
              </Reveal>
              <Reveal
                delay={0.03 * i + 0.05}
                className={cn("flex gap-3 px-6 pb-7 md:border-l md:py-8 lg:px-8", LINE)}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                  <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <p className="text-[0.92rem] leading-relaxed text-ink/75">{p.fix}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- How it lands in your week ---------- */

/* A timeline across the top: each step's "when" sits on one rail, so the
   two Day 1 steps, the daily one, and the weekly one read as a cadence. */
export function MarketersWeek({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="week-title">
      <SectionHead
        icon={Repeat}
        eyebrow="The cadence"
        title={<span id="week-title">{accented(persona.workflowTitle, 3)}</span>}
        subtitle={persona.workflowIntro}
      />
      <Band>
        <ol className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-4", LINE_FILL)}>
          {persona.steps.map((s, i) => {
            const recurring = /^every/i.test(s.when);
            return (
              <li key={s.title} className="bg-white">
                <Reveal delay={i * 0.06} className="flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "inline-flex h-7 items-center rounded-md px-2.5 text-[0.75rem] font-semibold",
                        recurring ? "bg-cta text-white" : "bg-cta-soft text-cta",
                      )}
                    >
                      {s.when}
                    </span>
                    <span
                      aria-hidden
                      className="h-px flex-1 bg-[repeating-linear-gradient(90deg,rgba(16,24,40,0.14)_0_4px,transparent_4px_8px)]"
                    />
                    <span className="text-[0.72rem] font-medium tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  <div
                    aria-hidden
                    className={cn(
                      "mt-6 flex flex-1 flex-col justify-center rounded-xl border border-ink/[0.06] p-3",
                      PANEL,
                    )}
                  >
                    <StepPicture index={i} />
                  </div>
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

/* ---------- The features this seat leans on ---------- */

export function MarketersPicks({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="picks-title">
      <SectionHead
        icon={LayoutGrid}
        eyebrow="Most used here"
        title={<span id="picks-title">{accented(persona.picksTitle, 3)}</span>}
        subtitle={persona.picksIntro}
      />
      <Band>
        <ul className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          {persona.picks.map((pick, i) => {
            const f = getFeature(pick.featureSlug);
            if (!f) return null;
            const FeatureIcon = f.icon;
            const tint = TINTS[i % TINTS.length];
            return (
              <li key={pick.featureSlug} className="bg-white">
                <Reveal delay={(i % 2) * 0.06} className="h-full">
                  <Link
                    to="/features/$slug"
                    params={{ slug: f.slug }}
                    className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ background: tint.tile, color: tint.ink }}
                      >
                        <FeatureIcon className="h-[18px] w-[18px]" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </div>
                    <h3 className="mt-5 font-display text-[1.3rem] font-medium tracking-[-0.02em] text-ink">
                      {f.name}
                    </h3>
                    <p className="mt-1 text-[0.88rem] text-muted-foreground">{f.tagline}</p>
                    <p
                      className="mt-5 rounded-lg px-4 py-3 text-[0.9rem] leading-relaxed text-ink/80"
                      style={{ background: tint.panel }}
                    >
                      {pick.why}
                    </p>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
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

/* ---------- The budget line ---------- */

/* What the plan sits in place of, as rows on a budget sheet, and the one
   line that replaces them. It runs straight into the pricing band. */
export function MarketersBudget({ persona }: { persona: Persona }) {
  const planLines = [
    `${PLAN.articlesPerMonth} published articles a month`,
    `${PLAN.sites} site, research to publishing`,
    ...(STUDIO.live
      ? [`Extra sites ${formatUsd(STUDIO.monthlyPerSite)}/month each, with ${STUDIO.name}`]
      : []),
  ];
  return (
    <section aria-labelledby="budget-title">
      <SectionHead
        icon={Wallet}
        eyebrow="The budget line"
        title={<span id="budget-title">{accented(persona.stackTitle, 4)}</span>}
        subtitle={persona.stackIntro}
      />
      <Band>
        <div className="grid lg:grid-cols-[1.25fr_1fr]">
          <div className="px-5 py-8 sm:px-10 sm:py-10 lg:py-12 lg:pl-12">
            <Reveal>
              <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                <Receipt className="h-3.5 w-3.5" />
                The usual line items
              </p>
            </Reveal>
            <ol className={cn("mt-4 divide-y border-y", LINE, "divide-ink/[0.07]")}>
              {persona.stack.map((s, i) => (
                <li key={s.label}>
                  <Reveal delay={0.04 * i} className="flex items-baseline gap-4 py-4">
                    <span className="w-6 shrink-0 text-[0.75rem] font-semibold tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.98rem] font-semibold text-ink">{s.label}</span>
                      <span className="mt-0.5 block text-[0.86rem] leading-relaxed text-muted-foreground">
                        {s.detail}
                      </span>
                    </span>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          <div
            className={cn(
              "flex items-center border-t px-5 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-10",
              LINE,
              PANEL,
            )}
          >
            <Reveal delay={0.08} className="mx-auto w-full max-w-[26rem]">
              <div className="rounded-xl border border-cta/25 bg-white p-6 shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_7%,transparent),0_12px_32px_-18px_rgba(16,24,40,0.22)] sm:p-7">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta text-white">
                    <Mark className="h-4 w-4" />
                  </span>
                  <p className="text-[0.95rem] font-semibold text-ink">One Rankbox plan</p>
                </div>
                <p className="mt-5 flex items-baseline gap-1 text-ink">
                  <span className="font-display text-[2.4rem] font-medium leading-none tracking-[-0.03em]">
                    {formatUsd(PLAN.monthly)}
                  </span>
                  <span className="text-[0.9rem] text-muted-foreground">/month</span>
                </p>
                <ul className={cn("mt-5 space-y-2.5 border-t pt-5", LINE)}>
                  {planLines.map((l) => (
                    <li key={l} className="flex gap-2.5 text-[0.88rem] leading-snug text-ink/80">
                      <Check
                        aria-hidden
                        className="mt-0.5 h-4 w-4 shrink-0 text-cta"
                        strokeWidth={2.5}
                      />
                      {l}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[0.82rem] leading-relaxed text-muted-foreground">
                  {persona.stackNote}
                </p>
                <a href="#pricing" className={cn(GHOST_BUTTON, "group/btn mt-5")}>
                  See the full plan
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* One centred column of numbered questions, answers in the server HTML. */
export function MarketersFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <span id="faq-title">
            What {persona.nameLower} <Accent>ask first</Accent>
          </span>
        }
      />
      <Band inner="px-5 py-4 sm:px-10 sm:py-6">
        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-3xl divide-y divide-ink/[0.07]"
        >
          {persona.faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center gap-4 py-5 text-left text-[1rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2 sm:gap-5">
                  <span className="w-6 shrink-0 text-[0.75rem] font-semibold tabular-nums text-muted-foreground group-data-[state=open]:text-cta">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{f.q}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-cta group-data-[state=open]:bg-cta group-data-[state=open]:text-white">
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
      </Band>
      <Band inner="flex justify-center px-5 py-6">
        <a href="/#faq" className={cn(GHOST_BUTTON, "group/btn")}>
          Read the full FAQ
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </a>
      </Band>
    </section>
  );
}

/* ---------- Other seats ---------- */

/* The other five use cases as one hairline grid: a heading cell, then a cell
   per page, so six cells fill two rows of three without a gap. */
export function MarketersOtherSeats({ persona }: { persona: Persona }) {
  const others = PERSONAS.filter((p) => p.slug !== persona.slug);
  const groupLabel = (id: Persona["group"]) => PERSONA_GROUPS.find((g) => g.id === id)?.label;
  return (
    <section aria-labelledby="seats-title">
      <Band>
        <ul className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-3", LINE_FILL)}>
          <li className="bg-white">
            <Reveal className="flex h-full flex-col justify-center p-6 sm:p-8">
              <Pill icon={Users} className="w-fit">
                Other seats
              </Pill>
              <h2
                id="seats-title"
                className="mt-4 text-balance font-display text-[1.5rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.7rem]"
              >
                Not a {persona.role}? <Accent>Pick your seat</Accent>
              </h2>
            </Reveal>
          </li>
          {others.map((p, i) => {
            const SeatIcon = p.icon;
            return (
              <li key={p.slug} className="bg-white">
                <Reveal delay={0.04 * ((i + 1) % 3)} className="h-full">
                  <Link
                    to="/use-cases/$slug"
                    params={{ slug: p.slug }}
                    className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-8"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue">
                        <SeatIcon className="h-4 w-4" />
                      </span>
                      <span className="text-[0.7rem] font-medium text-muted-foreground">
                        {groupLabel(p.group)}
                      </span>
                    </div>
                    <p className="mt-5 flex items-center gap-1.5 text-[1rem] font-semibold text-ink">
                      {p.name}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </p>
                    <p className="mt-1 text-[0.86rem] leading-relaxed text-muted-foreground">
                      {p.tagline}
                    </p>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* Blue inside the rails (--cta, so white body text passes AA), the white
   mark dithered behind, one button, and the calendar from the hero rising
   from the band's foot with every slot taken. */
export function MarketersCTA({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="cta-title">
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
              {persona.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {persona.ctaBody}
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

          {/* The full calendar rises from the band's foot and is cut off by it. */}
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[12rem] max-w-2xl overflow-hidden text-left sm:mt-14 sm:h-[14rem]"
          >
            <div aria-hidden>
              <CalendarFull className="h-[20rem] rounded-b-none shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]" />
            </div>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}
