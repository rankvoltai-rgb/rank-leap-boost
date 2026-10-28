/**
 * The sections of /use-cases/solo-founders, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections,
 * white throughout. Every visitor-facing line comes from the page's entry in
 * data/personas.ts; these only decide how it's set.
 *
 * The page reads in the order a founder decides in: the editor they never
 * leave, what Rankbox takes off them and what stays theirs, the one-paragraph
 * answer, why their last blog stalled, the first week, the stack it replaces,
 * the four features that carry a team of one, then price and questions.
 */
import { useState, type ComponentType, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleUser,
  HelpCircle,
  History,
  Pilcrow,
  Plus,
  Puzzle,
  Receipt,
  Timer,
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
  Spacer,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { getFeature } from "@/data/features";
import { PERSONAS, PERSONA_GROUPS, type Persona } from "@/data/personas";
import { PLAN, TRIAL_CTA, formatUsd } from "@/data/pricing";
import { FounderEditorScene } from "./editor-scene";

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

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]";

/* ---------- Hero ---------- */

/** The editor's caret, blinking after the headline's last word. */
function Caret() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="ml-[0.07em] inline-block h-[0.78em] w-[0.07em] translate-y-[0.1em] rounded-[1px] bg-cta"
      animate={reduce ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
      transition={reduce ? { duration: 0 } : { duration: 1.1, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* A soft-blue desk with a faint dot grid: where the editor sits. */
const DESK =
  "bg-[radial-gradient(circle,rgba(22,111,229,0.16)_1px,transparent_1.3px),linear-gradient(180deg,color-mix(in_oklab,var(--cta)_7%,white),color-mix(in_oklab,var(--cta)_3%,white))] [background-size:20px_20px,100%_100%]";

export function FounderHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="persona-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="flex flex-col items-center px-4 pb-14 pt-7 text-center sm:px-8 sm:pb-16 sm:pt-9">
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

          <div className="mt-9 motion-safe:animate-hero-rise sm:mt-11" style={rise(0.05)}>
            <Pill icon={Icon}>{persona.eyebrow}</Pill>
          </div>

          {/* Two fixed lines: the accent never wraps, and its size follows the
              viewport on phones so the long second line still fits. */}
          <h1
            id="persona-title"
            className="mt-6 font-display text-[min(9.1vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.4rem] lg:text-[4.15rem]"
            style={rise(0.12)}
          >
            <span className="block">{persona.headline.lead}</span>{" "}
            <span className="mt-[0.04em] block whitespace-nowrap font-bold text-brand-blue">
              {persona.headline.accent}
              <Caret />
            </span>
          </h1>

          <p
            className="mt-6 max-w-[42rem] text-balance text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.13rem]"
            style={rise(0.22)}
          >
            {persona.subhead}
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

/* ---------- The editor, and the split it shows ---------- */

/** A settings switch, on: the line runs itself. */
function SwitchOn() {
  return (
    <span
      aria-hidden
      className="relative mt-0.5 inline-flex h-4 w-7 shrink-0 items-center rounded-full bg-cta"
    >
      <span className="absolute h-3 w-3 translate-x-3.5 rounded-full bg-white shadow-sm" />
    </span>
  );
}

export function FounderDesk({ persona }: { persona: Persona }) {
  const { handoff } = persona;
  return (
    <section aria-labelledby="split-title">
      <Band inner={cn("overflow-hidden", DESK)}>
        <div
          className="px-3 py-8 motion-safe:animate-hero-rise sm:px-10 sm:py-12 lg:px-14 lg:py-14"
          style={rise(0.42)}
        >
          <div className="mx-auto max-w-[62rem]">
            <FounderEditorScene />
          </div>
        </div>
      </Band>

      {/* The scene, read out: the editor is yours, the corner is Rankbox's. */}
      <Band>
        <h2 id="split-title" className="sr-only">
          {handoff.keepsTitle}, and what {handoff.runsTitle.toLowerCase()}
        </h2>
        <div className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          <div className="bg-white">
            <Reveal className="h-full px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  <CircleUser className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                    {handoff.keepsTitle}
                  </h3>
                  <p className="text-[0.75rem] text-muted-foreground">In your window</p>
                </div>
              </div>
              <ul className={cn("mt-5 divide-y border-t divide-ink/[0.07]", LINE)}>
                {handoff.keeps.map((l) => (
                  <li key={l.label} className="py-3.5">
                    <p className="text-[0.92rem] font-semibold text-ink">{l.label}</p>
                    <p className="mt-0.5 text-[0.86rem] leading-relaxed text-muted-foreground">
                      {l.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="bg-white">
            <Reveal
              delay={0.06}
              className="h-full bg-[color-mix(in_oklab,var(--cta)_4%,white)] px-6 py-8 sm:px-10 sm:py-10 lg:px-12"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-brand-blue"
                >
                  <Mark className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                    {handoff.runsTitle}
                  </h3>
                  <p className="text-[0.75rem] text-muted-foreground">
                    In the corner of your screen
                  </p>
                </div>
              </div>
              <ul className={cn("mt-5 divide-y border-t divide-cta/[0.12] border-cta/[0.12]")}>
                {handoff.runs.map((l) => (
                  <li key={l.label} className="flex gap-3 py-3.5">
                    <SwitchOn />
                    <div>
                      <p className="text-[0.92rem] font-semibold text-ink">{l.label}</p>
                      <p className="mt-0.5 text-[0.86rem] leading-relaxed text-muted-foreground">
                        {l.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The short version ---------- */

export function FounderShortVersion({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="short-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[1.55fr_1fr]">
          <Reveal className="px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <Pill icon={Pilcrow}>The short version</Pill>
            <h2 id="short-title" className="sr-only">
              Rankbox for {persona.nameLower}, in one paragraph
            </h2>
            <p className="mt-6 max-w-[40rem] font-display text-[1.14rem] font-medium leading-[1.55] tracking-[-0.012em] text-ink sm:text-[1.3rem]">
              {persona.shortAnswer}
            </p>
          </Reveal>
          <Reveal delay={0.06} className={cn("border-t lg:border-l lg:border-t-0", LINE, PANEL)}>
            <dl
              aria-label={`Rankbox for ${persona.nameLower} at a glance`}
              className="flex h-full flex-col justify-center divide-y divide-ink/[0.07] px-6 py-4 sm:px-10 lg:px-10"
            >
              {persona.specs.map((s) => (
                <div key={s.label} className="flex flex-col-reverse py-4 sm:py-5">
                  <dt className="mt-1 text-[0.85rem] leading-snug text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="font-display text-[1.4rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.6rem]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Why the blog died ---------- */

export function FounderPostMortem({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={History}
        eyebrow="A blog post-mortem"
        title={accented(persona.painsTitle, 2)}
        subtitle={persona.painsIntro}
      />
      <Band>
        <ol className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          {persona.pains.map((p, i) => (
            <li key={p.pain} className="bg-white">
              <Reveal delay={(i % 2) * 0.06} className="flex h-full flex-col">
                <div className="flex-1 px-6 pb-7 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
                  <p className="font-mono text-[0.68rem] tabular-nums text-muted-foreground">
                    Cause {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.4rem]">
                    {p.pain}
                  </h3>
                </div>
                {/* What changes, on the soft blue the page uses for Rankbox. */}
                <div className="flex gap-3 border-t border-cta/[0.12] bg-[color-mix(in_oklab,var(--cta)_4%,white)] px-6 py-5 sm:px-8 lg:px-10">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <p className="text-[0.92rem] leading-relaxed text-ink/85">{p.fix}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- The first week ---------- */

export function FounderFirstWeek({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Timer}
        eyebrow="Week one"
        title={accented(persona.workflowTitle, 3)}
        subtitle={persona.workflowIntro}
      />
      <Band>
        <ol className="grid px-6 py-10 sm:px-10 lg:grid-cols-4 lg:px-12 lg:py-14">
          {persona.steps.map((s, i) => {
            // The intro says it: you're involved twice, at the first two steps.
            const yours = i < 2;
            const last = i === persona.steps.length - 1;
            return (
              <li key={s.title} className="relative flex gap-4 lg:flex-col lg:gap-0">
                <div aria-hidden className="flex flex-col items-center lg:flex-row">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      yours
                        ? "bg-cta text-white shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)]"
                        : "border border-ink/[0.1] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
                    )}
                  >
                    {yours ? <CircleUser className="h-4 w-4" /> : <Mark className="h-4 w-4" />}
                  </span>
                  {!last && (
                    <span
                      className={cn(
                        "w-px flex-1 lg:h-px lg:w-auto",
                        i === 0 ? "bg-cta/40" : "bg-ink/[0.1]",
                      )}
                    />
                  )}
                </div>
                <Reveal
                  delay={i * 0.06}
                  className={cn("min-w-0 pb-9 lg:pb-0 lg:pr-8 lg:pt-6", last && "pb-0")}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={cn(
                        "font-mono text-[0.72rem] font-medium",
                        yours ? "text-cta" : "text-muted-foreground",
                      )}
                    >
                      {s.when}
                    </p>
                    {yours && (
                      <span className="rounded-md bg-cta-soft px-1.5 py-px text-[0.62rem] font-semibold text-cta">
                        Your part
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Band>
      <Band inner="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <a href="/auth" className={SOLID_BUTTON}>
          Paste your URL
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
      </Band>
    </section>
  );
}

/* ---------- The stack it replaces ---------- */

export function FounderStack({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Receipt}
        eyebrow="The one-person stack"
        title={accented(persona.stackTitle, 3)}
        subtitle={persona.stackIntro}
      />
      <Band inner={PANEL}>
        <div className="px-4 py-12 sm:px-8 sm:py-16">
          <Reveal className="mx-auto max-w-[34rem]">
            <div className={cn("rounded-xl border border-ink/[0.08] bg-white", CARD_SHADOW)}>
              <div className={cn("flex items-center justify-between border-b px-5 py-3.5", LINE)}>
                <p className="text-[0.85rem] font-semibold text-ink">Your content stack</p>
                <p className="text-[0.72rem] text-muted-foreground">
                  {persona.stack.length} line items
                </p>
              </div>
              <ul className="divide-y divide-ink/[0.06] px-5">
                {persona.stack.map((item) => (
                  <li key={item.label} className="flex items-start justify-between gap-4 py-3.5">
                    <div className="min-w-0">
                      <p className="text-[0.92rem] font-medium text-ink/60 line-through decoration-ink/35 decoration-[1.5px]">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[0.8rem] leading-snug text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    <span className="mt-0.5 flex shrink-0 items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.66rem] font-semibold text-cta">
                      <Check className="h-3 w-3" strokeWidth={3} />
                      Off the list
                    </span>
                  </li>
                ))}
              </ul>
              {/* The only price on the page is our own. */}
              <div className="flex items-center justify-between gap-4 rounded-b-xl border-t border-dashed border-cta/30 bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-5 py-4">
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-brand-blue ring-1 ring-cta/15"
                  >
                    <Mark className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[0.92rem] font-semibold text-ink">{PLAN.name}</span>
                    <span className="block text-[0.72rem] text-muted-foreground">
                      {PLAN.sites} site · {PLAN.articlesPerMonth} articles a month
                    </span>
                  </span>
                </span>
                <span className="text-right">
                  <span className="font-display text-[1.35rem] font-medium tracking-[-0.02em] text-ink tabular-nums">
                    {formatUsd(PLAN.monthly)}
                  </span>
                  <span className="text-[0.75rem] text-muted-foreground">/month</span>
                </span>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-[32rem] text-balance text-center text-[0.86rem] leading-relaxed text-muted-foreground">
              {persona.stackNote}
            </p>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The four features ---------- */

/* Each feature's tint, as the landing gives its feature rows. */
const PICK_TINT: Record<string, { tile: string; ink: string }> = {
  "auto-publishing": { tile: "#dbe8fd", ink: "#1877f2" },
  "answer-space-research": { tile: "#e3ddfb", ink: "#7c3aed" },
  "authority-backlinks": { tile: "#fbe7c4", ink: "#b45309" },
  "citation-tracking": { tile: "#fbd9e2", ink: "#e11d48" },
};
const FALLBACK_TINT = { tile: "#d6efdf", ink: "#16a34a" };

export function FounderPicks({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Puzzle}
        eyebrow="Four parts, no handoffs"
        title={accented(persona.picksTitle, 4)}
        subtitle={persona.picksIntro}
      />
      <Band>
        <ul className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          {persona.picks.map((pick, i) => {
            const f = getFeature(pick.featureSlug);
            if (!f) return null;
            const FeatureIcon = f.icon as Icon;
            const tint = PICK_TINT[f.slug] ?? FALLBACK_TINT;
            return (
              <li key={pick.featureSlug} className="bg-white">
                <Reveal delay={(i % 2) * 0.06} className="h-full">
                  <Link
                    to="/features/$slug"
                    params={{ slug: f.slug }}
                    className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:p-8 lg:p-10"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ background: tint.tile, color: tint.ink }}
                      >
                        <FeatureIcon className="h-4 w-4" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </div>
                    <h3 className="mt-5 font-display text-[1.35rem] font-medium tracking-[-0.02em] text-ink">
                      {f.name}
                    </h3>
                    <p className="mt-1 text-[0.86rem] text-muted-foreground">{f.tagline}</p>
                    <p
                      className={cn(
                        "mt-5 border-t pt-5 text-[0.95rem] leading-relaxed text-ink/80",
                        LINE,
                      )}
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

/* ---------- FAQ ---------- */

export function FounderFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
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
              FAQ
            </Pill>
            <h2
              id="faq-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
            >
              What founders{" "}
              <span className="whitespace-nowrap">
                <Accent>ask first</Accent>
              </span>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              Time, voice, new domains, and what it costs, answered for a team of one.
            </p>
            <a href="/#faq" className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
              Read the full FAQ
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </a>
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {persona.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      <span className="flex gap-3">
                        <span className="mt-[0.2rem] font-mono text-[0.7rem] tabular-nums text-muted-foreground">
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
                    className="max-w-2xl pb-5 pl-[1.85rem] pr-10 text-sm leading-relaxed text-muted-foreground"
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

/* ---------- The other five use cases ---------- */

export function FounderOtherSeats({ persona }: { persona: Persona }) {
  const others = PERSONAS.filter((p) => p.slug !== persona.slug);
  const groupLabel = (p: Persona) => PERSONA_GROUPS.find((g) => g.id === p.group)?.label;
  return (
    <section aria-labelledby="seats-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[1.3fr_5fr]">
          <div
            className={cn(
              "flex flex-col justify-center border-b px-6 py-7 sm:px-8 lg:border-b-0 lg:border-r",
              LINE,
            )}
          >
            <h2 id="seats-title" className="text-[1.05rem] font-semibold tracking-tight text-ink">
              Not a team of one?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              The same engine, written up for five other seats and businesses.
            </p>
          </div>
          <ul className="grid lg:grid-cols-5">
            {others.map((p) => {
              const PersonaIcon = p.icon as Icon;
              return (
                <li
                  key={p.slug}
                  className={cn(
                    "border-b last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0",
                    LINE,
                  )}
                >
                  <Link
                    to="/use-cases/$slug"
                    params={{ slug: p.slug }}
                    className="group flex h-full items-center gap-3.5 px-6 py-4 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-8 lg:flex-col lg:items-start lg:gap-0 lg:px-5 lg:py-7"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue">
                      <PersonaIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 lg:mt-4">
                      <span className="block text-[0.62rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        {groupLabel(p)}
                      </span>
                      <span className="mt-0.5 block text-[0.92rem] font-semibold text-ink transition-colors group-hover:text-brand-blue">
                        {p.name}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue lg:hidden" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* Sample posts for the closing card, the same developer-tool blog the editor
   scene publishes to. */
const BLOG_INDEX: [string, string][] = [
  ["How to price a developer tool", "Today · 9:00 AM"],
  ["Webhooks vs polling: which to use?", "Yesterday · 9:00 AM"],
  ["Usage-based pricing, explained", "Monday · 9:00 AM"],
  ["Free tier or free trial?", "Sunday · 9:00 AM"],
];

/* The landing's closing band, on --cta so the white body text passes AA, with
   the founder's blog rising from the band's foot, still publishing: the page
   closes on the same blog it opened with. */
export function FounderCTA({ persona }: { persona: Persona }) {
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
              {persona.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {persona.ctaBody}
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

          {/* The blog, running itself, rises from the band's foot and is cut
              off by it. */}
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[12rem] max-w-lg overflow-hidden text-left sm:mt-14 sm:h-[13rem]"
          >
            <div
              aria-hidden
              className="rounded-t-xl bg-white shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]"
            >
              <div
                className={cn("flex items-center justify-between gap-3 border-b px-5 py-3.5", LINE)}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
                    <Mark className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-mono text-[0.74rem] text-ink">yoursite.com/blog</span>
                </span>
                <span className="rounded-md border border-ink/[0.08] px-1.5 py-px text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Sample
                </span>
              </div>
              <ul className="divide-y divide-ink/[0.06] px-5">
                {BLOG_INDEX.map(([title, when]) => (
                  <li key={title} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.84rem] font-semibold text-ink">
                        {title}
                      </span>
                      <span className="block text-[0.7rem] text-muted-foreground">{when}</span>
                    </span>
                    <span className="shrink-0 rounded-md bg-cta px-1.5 py-px text-[0.6rem] font-semibold text-white">
                      Published
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
