/**
 * The sections of /use-cases/new-websites, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections,
 * white throughout. The words come from data/persona-pages/new-websites.ts;
 * these decide only how they're set.
 *
 * Ordered for someone about to launch, in the order their worries come up:
 * what a site like mine starts with, what the first month looks like (and
 * which clock is whose), who does what, how anyone finds a site nobody has
 * linked to yet, the launch-day checks Rankbox doesn't run, the features
 * that matter, what it replaces and what it costs, then the questions.
 */
import type { ComponentType, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CircleSlash,
  Flag,
  HelpCircle,
  Hourglass,
  Link2,
  ListChecks,
  MessageSquare,
  Minus,
  PenLine,
  Plus,
  Receipt,
  Route,
  Sparkles,
  Sprout,
  UserRound,
  Wrench,
} from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { MarkDither } from "@/components/landing/hero-dither";
import { RedditMark } from "@/components/landing/ai-logos";
import {
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { TOOL_ICONS } from "@/components/tools/icons";
import { getFeature } from "@/data/features";
import { getTool } from "@/data/tools";
import { TRIAL_CTA, TRIAL_NOTE } from "@/data/pricing";
import { personasIn, type Persona } from "@/data/personas";
import { NEW_SITES } from "@/data/persona-pages/new-websites";
import { cn } from "@/lib/utils";
import { Accented, SampleTag, SiteTile, SourceLink, StatusTag } from "./parts";
import { HATCH, SOLID_BUTTON, TITLE } from "./tokens";

type Icon = ComponentType<{ className?: string }>;

const [RECRAWL_SOURCE, AI_FEATURES_SOURCE, PROFOUND_SOURCE] = NEW_SITES.sources;

/* ---------- What a brand-new site starts with ---------- */

const PAIN_ICONS: Icon[] = [BarChart3, BookOpen, PenLine, Link2];

/* Four cells, each a starting condition with what changes under it. The
   condition is set large, as the thing the reader recognises; the change
   sits under a dashed rule, smaller, because it's the answer, not the hook. */
export function NewSitesPains({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="pains-title">
      <Spacer />
      <SectionHead
        id="pains-title"
        icon={Sprout}
        eyebrow={NEW_SITES.painsEyebrow}
        title={<Accented text={persona.painsTitle} words={2} />}
        subtitle={persona.painsIntro}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] md:grid-cols-2">
          {persona.pains.map((p, i) => {
            const PIcon = PAIN_ICONS[i % PAIN_ICONS.length];
            return (
              <li key={p.pain} className={cn(CELL, "flex flex-col px-6 py-8 sm:px-10 sm:py-10")}>
                <Reveal delay={i * 0.05} className="flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                      <PIcon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="mt-5 max-w-md text-balance font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.45rem]">
                    {p.pain}
                  </p>
                  <div className="mt-6 flex gap-3 border-t border-dashed border-ink/[0.12] pt-5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <p className="max-w-md text-[0.92rem] leading-relaxed text-muted-foreground">
                      {p.fix}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- From the domain to month two: the two clocks ---------- */

/* Four stations on one rail, launch day flagged. Under them, Google's clock
   runs as a band of its own: blank before launch, hatched from launch day
   on, with Google's own words and the page they come from. On a phone the
   stations stack and the clock follows as one card. */
export function NewSitesRunway({ persona }: { persona: Persona }) {
  const { clocks } = NEW_SITES;
  return (
    <section aria-labelledby="runway-title">
      <Spacer />
      <SectionHead
        id="runway-title"
        icon={Route}
        eyebrow={clocks.eyebrow}
        title={<Accented text={persona.workflowTitle} words={2} />}
        subtitle={persona.workflowIntro}
      />
      <Band>
        <div className="flex items-center justify-between gap-4 px-6 pt-6 sm:px-10 lg:px-12">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-blue">
            {clocks.ours}
          </p>
          <p className="text-[0.75rem] text-muted-foreground">{clocks.oursNote}</p>
        </div>
        <ol className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-4">
          {persona.steps.map((s, i) => {
            const launch = i === 2;
            return (
              <li
                key={s.title}
                className={cn(
                  "relative px-6 pb-8 pt-7 sm:px-10 lg:px-8 lg:pb-10 xl:px-9",
                  i > 0 && "border-t lg:border-l lg:border-t-0",
                  LINE,
                  launch && "bg-[color-mix(in_oklab,var(--cta)_5%,white)]",
                )}
              >
                {/* The rail and its station: above the label on the wide
                    rail, beside it when the stations stack. */}
                <div className="flex items-center gap-3 lg:block">
                  <div aria-hidden className="relative flex h-6 items-center lg:mb-5">
                    <span className="absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-ink/[0.1] lg:-left-8 lg:-right-8 lg:block xl:-left-9 xl:-right-9" />
                    {launch ? (
                      <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-cta text-white shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_14%,transparent)]">
                        <Flag className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="relative mx-[0.4375rem] h-2.5 w-2.5 rounded-full border-2 border-cta bg-white lg:mx-0" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-[0.72rem] font-semibold uppercase tracking-[0.12em]",
                      launch ? "text-cta" : "text-muted-foreground",
                    )}
                  >
                    {s.when}
                  </p>
                </div>
                <h3 className="mt-2 font-display text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </li>
            );
          })}
        </ol>
      </Band>

      {/* Google's clock. */}
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-4">
          <div
            className={cn(
              "flex flex-col justify-center gap-1.5 border-b px-6 py-6 sm:px-10 lg:col-span-2 lg:border-b-0 lg:border-r lg:px-8 xl:px-9",
              LINE,
            )}
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink/70">
              {clocks.google}
            </p>
            <p className="text-[0.85rem] text-muted-foreground">{clocks.googleBefore}</p>
          </div>
          <div className={cn("relative lg:col-span-2", HATCH)}>
            <div className="flex h-full flex-col justify-center gap-2 bg-gradient-to-r from-white/95 via-white/85 to-white/40 px-6 py-7 sm:px-10 lg:px-8 xl:px-9">
              <p className="flex items-start gap-2.5 font-display text-[1.08rem] font-medium leading-snug tracking-[-0.01em] text-ink">
                <Hourglass className="mt-1 h-4 w-4 shrink-0 text-ink/50" />
                <span>&ldquo;{clocks.googleAfter}&rdquo;</span>
              </p>
              <p className="pl-[1.6rem] text-[0.78rem] text-muted-foreground">
                <SourceLink href={RECRAWL_SOURCE.url}>{clocks.googleSource}</SourceLink>
              </p>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Who does what ---------- */

/* Three columns rather than two: what Rankbox runs, what stays yours, and
   a hatched third for what nobody can hurry, with the plain list of what
   Rankbox doesn't do at its foot. */
export function NewSitesHandoff({ persona }: { persona: Persona }) {
  const { limits } = NEW_SITES;
  return (
    <section aria-labelledby="handoff-title">
      <Spacer />
      <SectionHead
        id="handoff-title"
        icon={ListChecks}
        eyebrow={NEW_SITES.handoffEyebrow}
        title={<Accented text={NEW_SITES.handoffTitle} words={2} />}
        subtitle={NEW_SITES.handoffIntro}
      />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1fr_1fr_0.92fr]">
          <HandoffColumn
            icon={<Mark className="h-4 w-4 text-white" />}
            tone="ours"
            title={persona.handoff.runsTitle}
            lines={persona.handoff.runs}
          />
          <HandoffColumn
            icon={<UserRound className="h-4 w-4" />}
            tone="yours"
            title={persona.handoff.keepsTitle}
            lines={persona.handoff.keeps}
            className={cn("border-t lg:border-l lg:border-t-0", LINE)}
          />
          <div className={cn("relative border-t lg:border-l lg:border-t-0", LINE, HATCH)}>
            <div className="h-full bg-white/80 px-6 py-9 sm:px-10 lg:px-8 lg:py-10">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink/60">
                  <Hourglass className="h-4 w-4" />
                </span>
                <h3 className="font-display text-[1.15rem] font-medium tracking-[-0.015em] text-ink">
                  {limits.title}
                </h3>
              </div>
              <p className="mt-4 text-[0.88rem] leading-relaxed text-muted-foreground">
                {limits.intro}
              </p>
              <ul className="mt-5 space-y-2.5">
                {limits.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.9rem] text-ink/85">
                    <Hourglass className="mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-ink/40" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink/60">
                {limits.wontTitle}
              </p>
              <ul className="mt-3 space-y-2">
                {limits.wont.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.86rem] text-muted-foreground">
                    <CircleSlash className="mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-ink/35" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

function HandoffColumn({
  icon,
  tone,
  title,
  lines,
  className,
}: {
  icon: ReactNode;
  tone: "ours" | "yours";
  title: string;
  lines: { label: string; detail: string }[];
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-9 sm:px-10 lg:px-8 lg:py-10 xl:px-10", className)}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            tone === "ours"
              ? "bg-cta"
              : "border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
          )}
        >
          {icon}
        </span>
        <h3 className="font-display text-[1.15rem] font-medium tracking-[-0.015em] text-ink">
          {title}
        </h3>
      </div>
      <ul className="mt-6 divide-y divide-ink/[0.07]">
        {lines.map((l) => (
          <li key={l.label} className="py-4 first:pt-0 last:pb-0">
            <p className="flex items-center gap-2 text-[0.95rem] font-semibold text-ink">
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  tone === "ours" ? "bg-cta" : "bg-ink/40",
                )}
              />
              {l.label}
            </p>
            <p className="mt-1.5 pl-3.5 text-[0.88rem] leading-relaxed text-muted-foreground">
              {l.detail}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Off your own domain ---------- */

/* The two allowances, side by side, each with a small sample of what it
   looks like in the dashboard: an exchange target waiting for a topical
   match (the honest cold start), and a disclosed reply draft the owner
   posts. Vendor evidence sits under both, labelled as vendor evidence. */
export function NewSitesOffsite() {
  const { offsite } = NEW_SITES;
  const { exchange, reddit } = offsite;
  return (
    <section aria-labelledby="offsite-title">
      <Spacer />
      <SectionHead
        id="offsite-title"
        icon={Sparkles}
        eyebrow={offsite.eyebrow}
        title={<Accented text={offsite.title} words={3} />}
        subtitle={offsite.intro}
      />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
          <OffsiteCard
            icon={<Link2 className="h-4 w-4" />}
            name={exchange.name}
            allowance={exchange.allowance}
            status={offsite.status}
            body={exchange.body}
            href={exchange.href}
            cta={exchange.cta}
          >
            <div className="flex items-center gap-2.5 border-b border-ink/[0.07] px-4 py-2.5">
              <Link2 className="h-3.5 w-3.5 text-brand-blue" />
              <p className="text-[0.72rem] font-semibold text-ink">Link targets</p>
              <SampleTag className="ml-auto" />
            </div>
            <div className="space-y-2.5 px-4 py-3.5">
              <p className="truncate font-mono text-[0.7rem] text-ink/80">
                {exchange.sampleTarget}
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d97706]/50 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d97706]" />
                </span>
                <p className="text-[0.72rem] text-muted-foreground">{exchange.sampleState}</p>
              </div>
            </div>
          </OffsiteCard>

          <OffsiteCard
            icon={<MessageSquare className="h-4 w-4" />}
            name={reddit.name}
            allowance={reddit.allowance}
            status={offsite.status}
            body={reddit.body}
            href={reddit.href}
            cta={reddit.cta}
            className={cn("border-t lg:border-l lg:border-t-0", LINE)}
          >
            <div className="flex items-center gap-2.5 border-b border-ink/[0.07] px-4 py-2.5">
              <RedditMark className="h-3.5 w-3.5" />
              <p className="min-w-0 truncate text-[0.72rem] font-semibold text-ink">
                {reddit.sampleThread}
              </p>
              <SampleTag className="ml-auto" />
            </div>
            <div className="px-4 py-3.5">
              <p className="text-[0.74rem] leading-relaxed text-ink/80">{reddit.sampleReply}</p>
              <p className="mt-2 text-[0.7rem] italic text-muted-foreground">
                {reddit.sampleDisclosure}
              </p>
              <div className="mt-3 flex items-center gap-2 border-t border-dashed border-ink/[0.1] pt-2.5">
                <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
                  Draft
                </span>
                <span className="text-[0.66rem] text-muted-foreground">You post it yourself</span>
              </div>
            </div>
          </OffsiteCard>
        </div>
      </Band>
      <Band inner="px-6 py-5 sm:px-10 lg:px-12">
        <p className="max-w-4xl text-[0.82rem] leading-relaxed text-muted-foreground">
          {offsite.evidence}{" "}
          <SourceLink href={PROFOUND_SOURCE.url}>{offsite.evidenceSource}</SourceLink>
        </p>
      </Band>
    </section>
  );
}

function OffsiteCard({
  icon,
  name,
  allowance,
  status,
  body,
  href,
  cta,
  className,
  children,
}: {
  icon: ReactNode;
  name: string;
  allowance: string;
  status: string;
  body: string;
  href: string;
  cta: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col px-6 py-9 sm:px-10 lg:px-12 lg:py-11", className)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
          {icon}
        </span>
        <h3 className="font-display text-[1.2rem] font-medium tracking-[-0.015em] text-ink">
          {name}
        </h3>
        <StatusTag>{status}</StatusTag>
      </div>
      <p className="mt-4 font-display text-[1.6rem] font-medium leading-none tracking-[-0.02em] text-ink">
        {allowance}
      </p>
      <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-muted-foreground">{body}</p>
      <div
        className={cn(
          "mt-7 overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_32px_-20px_rgba(16,24,40,0.2)]",
        )}
      >
        {children}
      </div>
      <a href={href} className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
      </a>
    </div>
  );
}

/* ---------- Free launch-day checks ---------- */

export function NewSitesKit() {
  const { kit } = NEW_SITES;
  const tools = kit.tools.flatMap((t) => {
    const tool = getTool(t.slug);
    return tool ? [{ tool, why: t.why }] : [];
  });
  return (
    <section aria-labelledby="kit-title">
      <Spacer />
      <Band inner="flex flex-col gap-6 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <div className="max-w-2xl">
          <Pill icon={Wrench}>{kit.eyebrow}</Pill>
          <h2 id="kit-title" className={cn(TITLE, "mt-5 text-balance")}>
            <Accented text={kit.title} words={3} />
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">{kit.intro}</p>
        </div>
        <Link to="/tools" className={cn(GHOST_BUTTON, "group/btn w-fit shrink-0")}>
          {kit.cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ tool, why }, i) => {
            const TIcon = TOOL_ICONS[tool.icon];
            return (
              <li key={tool.slug} className={CELL}>
                <Link
                  to="/tools/$slug"
                  params={{ slug: tool.slug }}
                  className="group flex h-full gap-4 px-6 py-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-8 sm:py-7"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue">
                    <TIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-[0.95rem] font-semibold text-ink">{tool.name}</span>
                      <span className="mt-0.5 font-mono text-[0.66rem] tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[0.86rem] leading-relaxed text-muted-foreground">
                      {why}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[0.78rem] font-medium text-brand-blue opacity-80 transition-opacity group-hover:opacity-100">
                      Open the tool
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- The four features ---------- */

export function NewSitesPicks({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="picks-title">
      <Spacer />
      <SectionHead
        id="picks-title"
        icon={Sparkles}
        eyebrow={NEW_SITES.picksEyebrow}
        title={<Accented text={persona.picksTitle} words={3} />}
        subtitle={persona.picksIntro}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-4">
          {persona.picks.map((pick) => {
            const f = getFeature(pick.featureSlug);
            if (!f) return null;
            const FIcon = f.icon;
            return (
              <li key={pick.featureSlug} className={CELL}>
                <Link
                  to="/features/$slug"
                  params={{ slug: f.slug }}
                  className="group flex h-full flex-col px-6 py-8 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-7"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
                    <FIcon className="h-4 w-4" />
                  </span>
                  <span className="mt-5 text-[1rem] font-semibold text-ink">{f.name}</span>
                  <span className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-muted-foreground">
                    {pick.why}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1 text-[0.8rem] font-medium text-brand-blue">
                    Read more<span className="sr-only"> about {f.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- What it replaces, and the price ---------- */

export function NewSitesStackPrice({ persona }: { persona: Persona }) {
  const { price } = NEW_SITES;
  return (
    <section aria-labelledby="stack-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.15fr_1fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Receipt}>{NEW_SITES.stackEyebrow}</Pill>
            <h2 id="stack-title" className={cn(TITLE, "mt-5 max-w-xl text-balance")}>
              <Accented text={persona.stackTitle} words={2} />
            </h2>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
              {persona.stackIntro}
            </p>
            <ul className="mt-8 divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
              {persona.stack.map((s) => (
                <li key={s.label} className="flex items-start gap-3.5 py-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-ink/[0.1] bg-white text-ink/45">
                    <Minus className="h-3 w-3" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] font-medium text-ink">{s.label}</span>
                    <span className="mt-0.5 block text-[0.84rem] text-muted-foreground">
                      {s.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-[0.86rem] leading-relaxed text-muted-foreground">
              {persona.stackNote}
            </p>
          </div>

          {/* The price, from data/pricing.ts. */}
          <div
            className={cn(
              "flex flex-col justify-center px-4 py-8 sm:px-10 lg:px-10 lg:py-14",
              PANEL,
            )}
          >
            <div className="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.28)] sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {price.eyebrow}
                </p>
                <span className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.7rem] font-semibold text-cta">
                  {price.title}
                </span>
              </div>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-[3rem] font-medium leading-none tracking-[-0.04em] text-ink">
                  {price.amount}
                </span>
                <span className="text-[0.9rem] text-muted-foreground">{price.per}</span>
              </p>
              <ul className="mt-6 space-y-2.5">
                {price.includes.map((line) => (
                  <li key={line} className="flex gap-2.5 text-[0.88rem] leading-snug text-ink/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" strokeWidth={2.4} />
                    {line}
                  </li>
                ))}
              </ul>
              <a href="/auth" className={cn(SOLID_BUTTON, "mt-7 w-full")}>
                {TRIAL_CTA}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p className="mt-3 text-center text-[0.78rem] text-muted-foreground">{TRIAL_NOTE}</p>
              <p className="mt-1 text-center text-[0.78rem] text-muted-foreground">{price.trial}</p>
              <div className="mt-6 border-t border-dashed border-ink/[0.1] pt-5">
                <p className="text-[0.82rem] leading-relaxed text-muted-foreground">
                  {price.studio}
                </p>
                <Link
                  to="/pricing"
                  className="mt-2.5 inline-flex items-center gap-1 text-[0.82rem] font-medium text-brand-blue hover:underline"
                >
                  {price.pricingCta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Every answer is in the server HTML (forceMount), so the FAQPage JSON-LD the
   route emits matches what's on the page. */
export function NewSitesFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "flex flex-col border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2 id="faq-title" className={cn(TITLE, "mt-5 text-balance")}>
              <Accented text={NEW_SITES.faqTitle} words={2} />
            </h2>
            <div className="mt-8 lg:mt-auto lg:pt-10">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {NEW_SITES.sourcesTitle}
              </p>
              <ul className="mt-3 space-y-2.5">
                {NEW_SITES.sources.map((s) => (
                  <li key={s.url} className="text-[0.8rem] leading-snug text-muted-foreground">
                    <SourceLink href={s.url}>{s.title}</SourceLink>
                    <span className="block">
                      {s.publisher}, {s.date}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {persona.faqs.map((f, i) => (
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
            <div className="flex flex-wrap gap-2 border-t border-ink/[0.07] py-5">
              {NEW_SITES.reading.map((r) => (
                <a key={r.href} href={r.href} className={cn(GHOST_BUTTON, "group/btn")}>
                  {r.label}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-[color,transform] group-hover/btn:translate-x-0.5 group-hover/btn:text-brand-blue" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The other situations ---------- */

export function NewSitesOthers({ persona }: { persona: Persona }) {
  const { others } = NEW_SITES;
  const pages = personasIn(persona.group);
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[15rem_1fr_1fr_1fr]">
          <div
            className={cn(
              "flex flex-col justify-between gap-5 border-b px-6 py-7 sm:px-10 lg:border-b-0 lg:border-r lg:px-8",
              LINE,
            )}
          >
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {others.eyebrow}
              </p>
              <h2
                id="others-title"
                className="mt-2 font-display text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-ink"
              >
                {others.title}
              </h2>
            </div>
            <Link to="/use-cases" className={cn(GHOST_BUTTON, "group/btn w-fit")}>
              {others.cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
          {pages.map((p, i) => {
            const PIcon = p.icon;
            const current = p.slug === persona.slug;
            const body = (
              <>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    current
                      ? "bg-cta text-white"
                      : "border border-ink/[0.08] bg-white text-ink/70 transition-colors group-hover:text-brand-blue",
                  )}
                >
                  <PIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-[0.92rem] font-semibold text-ink">
                    {p.name}
                    {current && (
                      <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
                        You&rsquo;re here
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[0.8rem] leading-snug text-muted-foreground">
                    {p.tagline}
                  </span>
                </span>
              </>
            );
            const edge = cn(i > 0 && "border-t lg:border-l lg:border-t-0", LINE);
            return current ? (
              <div
                key={p.slug}
                aria-current="page"
                className={cn(
                  "flex items-start gap-3.5 bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-6 py-6 sm:px-10 lg:px-7",
                  edge,
                )}
              >
                {body}
              </div>
            ) : (
              <Link
                key={p.slug}
                to="/use-cases/$slug"
                params={{ slug: p.slug }}
                className={cn(
                  "group flex items-start gap-3.5 px-6 py-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-10 lg:px-7",
                  edge,
                )}
              >
                {body}
              </Link>
            );
          })}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* The landing's closing band: --cta blue inside the rails, the white mark
   dithered behind, one white button, and the launch flag the page has been
   counting down to, with the sample site's first answers lined up under it. */
export function NewSitesCTA({ persona }: { persona: Persona }) {
  const Icon = persona.icon;
  const firsts = NEW_SITES.sample.answers.filter((a) => a.phase === "pre").slice(0, 3);
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
        <div className="relative px-5 pb-0 pt-16 text-center sm:px-8 sm:pt-20">
          <Reveal>
            <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-blue shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)]">
              <Icon className="h-5 w-5" strokeWidth={2.4} />
            </span>
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

          {/* The launch-day card, rising from the band's foot. */}
          <Reveal delay={0.12} y={40} className="mx-auto mt-12 max-w-lg sm:mt-14">
            <div
              aria-hidden
              className="rounded-t-xl border border-b-0 border-white/25 bg-white px-5 pb-6 pt-4 text-left shadow-[0_-12px_40px_-16px_rgba(4,24,72,0.45)]"
            >
              <div className="flex items-center gap-3 border-b border-ink/[0.07] pb-3">
                <SiteTile letter={NEW_SITES.sample.brand[0]} className="h-6 w-6 text-[0.68rem]" />
                <p className="min-w-0 flex-1 truncate text-[0.8rem] font-semibold text-ink">
                  {NEW_SITES.sample.domain}/guides/
                </p>
                <span className="inline-flex items-center gap-1 rounded-md bg-cta px-1.5 py-0.5 text-[0.62rem] font-semibold text-white">
                  <Flag className="h-3 w-3" />
                  Launch day
                </span>
              </div>
              <ul className="mt-2">
                {firsts.map((a) => (
                  <li key={a.slug} className="flex items-center gap-2.5 py-1.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    <span className="min-w-0 flex-1 truncate text-[0.78rem] text-ink/80">
                      {a.title}
                    </span>
                    <span className="shrink-0 text-[0.62rem] font-semibold text-success">Live</span>
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
