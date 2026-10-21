/**
 * The body of /use-cases/saas, in the landing page's frame. Each section is
 * set in a form a product team already reads every day: the pains as a diff,
 * the ownership split as swimlanes, the week as a release log, the stack as
 * budget lines. All copy is the persona's entry in data/personas.ts.
 */
import type { ComponentType, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Compass,
  GitCompareArrows,
  HelpCircle,
  Link2,
  ListChecks,
  PenLine,
  Plus,
  Receipt,
  Scale,
  Search,
  Send,
  ShieldCheck,
  SquarePen,
  Tag,
  Users,
  Waypoints,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
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
import { IntegrationGlyph } from "@/components/integrations/visuals";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { getFeature } from "@/data/features";
import { getIntegration } from "@/data/integrations";
import { PERSONAS, PERSONA_GROUPS, withArticle, type Persona } from "@/data/personas";
import { PLAN, formatUsd } from "@/data/pricing";
import { cn } from "@/lib/utils";
import {
  ApprovePicture,
  ConnectPicture,
  DraftPicture,
  FeedPeek,
  RedditScreen,
  ReleasePicture,
  ResearchScreen,
  ScoreScreen,
  WriterScreen,
} from "./pictures";
import { Accented } from "./parts";

type Icon = ComponentType<{ className?: string }>;

/* ---------- Pains, as a diff ---------- */

/* Today on the left, with Rankbox on the right, one changed line per band,
   the way a code review shows a change. */
export function SaasPains({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={GitCompareArrows}
        eyebrow="Content vs the roadmap"
        title={<Accented text={persona.painsTitle} words={3} />}
        subtitle={persona.painsIntro}
      />

      {/* Column labels, once, on wide screens. Narrow screens label each cell. */}
      <Band inner="hidden lg:block">
        <div className="grid grid-cols-2 text-[0.75rem] font-medium text-muted-foreground">
          <p className={cn("flex items-center gap-2 border-r px-12 py-3", LINE)}>
            <span className="font-mono text-[#e11d48]">−</span> Today
          </p>
          <p className="flex items-center gap-2 px-12 py-3">
            <span className="font-mono text-cta">+</span> With Rankbox
          </p>
        </div>
      </Band>

      {persona.pains.map((p, i) => (
        <Band key={p.pain}>
          <Reveal className="relative grid lg:grid-cols-2">
            <div
              className={cn(
                "flex gap-4 border-b px-6 py-7 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-9",
                LINE,
              )}
            >
              <span className="w-5 shrink-0 pt-0.5 font-mono text-[0.75rem] tabular-nums text-muted-foreground/70">
                {i + 1}
              </span>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-[0.72rem] font-medium text-muted-foreground lg:hidden">
                  <span className="font-mono text-[#e11d48]">−</span> Today
                </p>
                <p className="flex gap-3 text-[1.02rem] font-medium leading-snug text-ink/75">
                  <span
                    aria-hidden
                    className="hidden h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#fdedf1] font-mono text-[0.8rem] text-[#e11d48] lg:flex"
                  >
                    −
                  </span>
                  {p.pain}
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-[color-mix(in_oklab,var(--cta)_4%,white)] px-6 py-7 sm:px-10 lg:px-12 lg:py-9">
              <span className="w-5 shrink-0 pt-0.5 font-mono text-[0.75rem] tabular-nums text-cta/60">
                {i + 1}
              </span>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-[0.72rem] font-medium text-muted-foreground lg:hidden">
                  <span className="font-mono text-cta">+</span> With Rankbox
                </p>
                <p className="flex gap-3 text-[0.98rem] leading-relaxed text-ink">
                  <span
                    aria-hidden
                    className="hidden h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft font-mono text-[0.8rem] text-cta lg:flex"
                  >
                    +
                  </span>
                  {p.fix}
                </p>
              </div>
            </div>
            {/* A joint on the hairline between the two sides. */}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 z-10 hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
            >
              <ArrowRight className="h-3 w-3" />
            </span>
          </Reveal>
        </Band>
      ))}
    </section>
  );
}

/* ---------- Ownership, as swimlanes ---------- */

const RUN_ICONS: Icon[] = [Search, PenLine, Send, Link2];
const KEEP_ICONS: Icon[] = [Compass, ShieldCheck, Scale, SquarePen];

function Lane({
  title,
  lead,
  items,
  icons,
  auto,
}: {
  title: string;
  lead: ReactNode;
  items: { label: string; detail: string }[];
  icons: Icon[];
  /** Rankbox's lane: tinted, numbered, joined left to right. */
  auto: boolean;
}) {
  return (
    <div className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-[13rem_repeat(4,1fr)]", LINE_FILL)}>
      <div className="flex items-center gap-3 bg-white px-6 py-5 sm:col-span-2 sm:px-8 lg:col-span-1 lg:flex-col lg:items-start lg:justify-center lg:px-7">
        {lead}
        <h3 className="text-[1.02rem] font-semibold tracking-tight text-ink">{title}</h3>
      </div>
      {items.map((item, i) => {
        const ItemIcon = icons[i % icons.length];
        const last = i === items.length - 1;
        return (
          <div
            key={item.label}
            className={cn(
              "relative",
              auto ? "bg-[color-mix(in_oklab,var(--cta)_4%,white)]" : "bg-white",
            )}
          >
            <Reveal delay={i * 0.05} className="flex h-full flex-col px-6 py-6 sm:px-7">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    auto
                      ? "bg-cta text-white"
                      : "border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
                  )}
                >
                  <ItemIcon className="h-3.5 w-3.5" />
                </span>
                <span
                  className={cn(
                    "text-[0.68rem] font-medium tabular-nums",
                    auto ? "text-cta" : "text-muted-foreground",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-4 text-[0.95rem] font-semibold tracking-tight text-ink">
                {item.label}
              </p>
              <p className="mt-1 text-[0.84rem] leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </Reveal>
            {auto && !last && (
              <span
                aria-hidden
                className="absolute -right-3 top-[1.85rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
              >
                <ArrowRight className="h-3 w-3" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SaasOwnership({ persona }: { persona: Persona }) {
  const { handoff } = persona;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Waypoints}
        eyebrow="Ownership"
        title={
          <>
            What runs itself, <Accent>what stays yours</Accent>
          </>
        }
      />
      <Band>
        <Lane
          title={handoff.runsTitle}
          lead={
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white">
              <Mark className="h-[1.1rem] w-[1.1rem]" />
            </span>
          }
          items={handoff.runs}
          icons={RUN_ICONS}
          auto
        />
      </Band>
      <Band>
        <Lane
          title={handoff.keepsTitle}
          lead={
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink/[0.08] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
              <Users className="h-4 w-4" />
            </span>
          }
          items={handoff.keeps}
          icons={KEEP_ICONS}
          auto={false}
        />
      </Band>
    </section>
  );
}

/* ---------- The week, as a release log ---------- */

/* One picture per step of the week, in the persona's order. */
const WEEK_PICTURES: Icon[] = [ConnectPicture, ApprovePicture, DraftPicture, ReleasePicture];

export function SaasWeek({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={ListChecks}
        eyebrow="Rollout log"
        title={<Accented text={persona.workflowTitle} words={2} />}
        subtitle={persona.workflowIntro}
      />
      <ol>
        {persona.steps.map((s, i) => {
          const Picture = WEEK_PICTURES[i];
          const first = i === 0;
          const last = i === persona.steps.length - 1;
          return (
            <li key={s.title}>
              <Band>
                <div className="grid lg:grid-cols-[11rem_1fr_1.1fr]">
                  {/* The log's rail: a line through every entry, a dot on each. */}
                  <div className={cn("relative hidden border-r lg:block", LINE)}>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-10 w-px bg-cta/25",
                        first ? "top-1/2" : "top-0",
                        last ? "bottom-1/2" : "bottom-0",
                      )}
                    />
                    <span
                      aria-hidden
                      className="absolute left-10 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cta bg-white"
                    />
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 font-mono text-[0.68rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                      {s.when}
                    </span>
                  </div>
                  <Reveal className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-10 lg:py-10">
                    <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 font-mono text-[0.68rem] font-medium text-ink lg:hidden">
                      <Tag className="h-3 w-3 text-cta" />
                      {s.when}
                    </span>
                    <h3 className="font-display text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.5rem]">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </Reveal>
                  <div className="px-3 pb-3 lg:py-3 lg:pl-0 lg:pr-3">
                    <div
                      aria-hidden
                      className={cn("flex h-full items-center px-4 py-6 sm:px-10 lg:px-8", PANEL)}
                    >
                      {Picture && (
                        <div className="mx-auto w-full max-w-[24rem]">
                          <Picture />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Band>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------- Picks ---------- */

/* Each pick's tint, from the landing's feature rows. */
const PICK_TINTS: Record<string, { panel: string; tile: string; ink: string }> = {
  "answer-space-research": { panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
  "citation-ready-writer": { panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
  "seo-geo-score": { panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
  "reddit-presence": { panel: "#fdefe7", tile: "#fbdccb", ink: "#ea580c" },
};
const FALLBACK_TINT = { panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" };

/* A sample screen for each pick, by feature slug. */
const PICK_SCREENS: Record<string, Icon> = {
  "answer-space-research": ResearchScreen,
  "citation-ready-writer": WriterScreen,
  "seo-geo-score": ScoreScreen,
  "reddit-presence": RedditScreen,
};

export function SaasPicks({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Boxes}
        eyebrow="Most-used parts"
        title={<Accented text={persona.picksTitle} words={3} />}
        subtitle={persona.picksIntro}
      />
      <Band>
        <ul className={cn("grid gap-px lg:grid-cols-2", LINE_FILL)}>
          {persona.picks.map((pick, i) => {
            const f = getFeature(pick.featureSlug);
            if (!f) return null;
            const FeatureIcon = f.icon;
            const tint = PICK_TINTS[f.slug] ?? FALLBACK_TINT;
            const Screen = PICK_SCREENS[f.slug];
            return (
              <li key={f.slug} className="bg-white">
                <Reveal delay={(i % 2) * 0.06} className="h-full">
                  <Link
                    to="/features/$slug"
                    params={{ slug: f.slug }}
                    className="group flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
                  >
                    <div className="px-3 pt-3">
                      <div
                        aria-hidden
                        className="relative h-[13.5rem] overflow-hidden sm:h-[14.5rem]"
                        style={{ background: tint.panel }}
                      >
                        {Screen && (
                          <div className="absolute inset-x-5 top-7 mx-auto max-w-[24rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-10 sm:top-8">
                            <Screen />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col px-6 pb-8 pt-6 sm:px-9">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-3">
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-lg"
                            style={{ background: tint.tile, color: tint.ink }}
                          >
                            <FeatureIcon className="h-4 w-4" />
                          </span>
                          <h3 className="text-[1.1rem] font-semibold tracking-tight text-ink">
                            {f.name}
                          </h3>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                      </div>
                      <p className="mt-2 text-[0.84rem] text-muted-foreground">{f.tagline}</p>
                      <p className="mt-4 border-t border-ink/[0.07] pt-4 text-[0.95rem] leading-relaxed text-ink/80">
                        {pick.why}
                      </p>
                    </div>
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

/* ---------- Stack, as budget lines ---------- */

export function SaasStack({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Receipt}
        eyebrow="Budget lines"
        title={<Accented text={persona.stackTitle} words={2} />}
        subtitle={persona.stackIntro}
      />
      <Band>
        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          <ul className={cn("divide-y divide-ink/[0.07] border-b lg:border-b-0 lg:border-r", LINE)}>
            {persona.stack.map((item, i) => (
              <li key={item.label}>
                <Reveal
                  delay={i * 0.04}
                  className="flex items-start gap-4 px-6 py-5 sm:px-10 lg:px-12"
                >
                  <span className="w-5 shrink-0 pt-0.5 font-mono text-[0.75rem] tabular-nums text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.98rem] font-semibold tracking-tight text-ink">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[0.86rem] leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft text-cta"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="bg-[color-mix(in_oklab,var(--cta)_5%,white)]">
            <Reveal
              delay={0.08}
              className="flex h-full flex-col justify-center px-6 py-10 sm:px-10 lg:px-12"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue text-white shadow-[0_1px_2px_rgba(16,24,40,0.1)]">
                <Mark className="h-5 w-5" />
              </span>
              <p className="mt-5 text-[0.8rem] font-medium text-muted-foreground">
                Rankbox {PLAN.name}
              </p>
              <p className="mt-1 font-display text-[2.4rem] font-medium leading-none tracking-[-0.03em] text-ink">
                {formatUsd(PLAN.monthly)}
                <span className="text-[1rem] font-normal tracking-normal text-muted-foreground">
                  /month
                </span>
              </p>
              <p className="mt-4 text-[0.92rem] leading-relaxed text-ink/80">{persona.stackNote}</p>
              <a href="#pricing" className={cn(GHOST_BUTTON, "group/btn mt-7 w-fit")}>
                What the plan includes
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The other use cases ---------- */

export function SaasOtherUseCases({ persona }: { persona: Persona }) {
  const others = PERSONAS.filter((p) => p.slug !== persona.slug);
  const groupLabel = (p: Persona) => PERSONA_GROUPS.find((g) => g.id === p.group)?.label ?? "";
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band>
        <ul className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-3", LINE_FILL)}>
          <li className="flex flex-col justify-center bg-white px-6 py-8 sm:px-8">
            <Pill icon={Users} className="w-fit">
              Other use cases
            </Pill>
            <h2
              id="others-title"
              className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.85rem]"
            >
              Not {withArticle(persona.role)}?
            </h2>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
              Each page is written to a different seat or business.
            </p>
          </li>
          {others.map((p, i) => {
            const PersonaIcon = p.icon;
            return (
              <li key={p.slug} className="bg-white">
                <Reveal delay={(i % 3) * 0.05} className="h-full">
                  <Link
                    to="/use-cases/$slug"
                    params={{ slug: p.slug }}
                    className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-7"
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue">
                        <PersonaIcon className="h-4 w-4" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </span>
                    <span className="mt-5 text-[0.68rem] font-medium text-muted-foreground">
                      {groupLabel(p)}
                    </span>
                    <span className="mt-0.5 text-[0.98rem] font-semibold tracking-tight text-ink">
                      {p.name}
                    </span>
                    <span className="mt-1 text-[0.84rem] leading-relaxed text-muted-foreground">
                      {p.tagline}
                    </span>
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

/* ---------- FAQ ---------- */

const DEV_LINKS = ["api", "mcp"] as const;

export function SaasFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <Reveal
            className={cn(
              "flex flex-col border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2 className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
              Questions from {persona.nameLower}
            </h2>

            {/* For the engineer reading over a marketer's shoulder. */}
            <div className="mt-8 overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <p className="border-b border-ink/[0.07] px-4 py-2.5 text-[0.75rem] font-medium text-muted-foreground">
                Building on your own stack
              </p>
              <ul className="divide-y divide-ink/[0.07]">
                {DEV_LINKS.map((slug) => {
                  const integration = getIntegration(slug);
                  if (!integration) return null;
                  return (
                    <li key={slug}>
                      <Link
                        to="/integrations/$slug"
                        params={{ slug }}
                        className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
                      >
                        <IntegrationGlyph integration={integration} className="h-7 w-7" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.86rem] font-semibold text-ink">
                            {integration.name}
                          </span>
                          <span className="mt-0.5 block text-[0.76rem] leading-snug text-muted-foreground">
                            {integration.tagline}
                          </span>
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
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
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* The persona's closing line ends on "N days free, no card to start." The
   trial goes through Stripe Checkout and takes a card, so that sentence is
   left off here and TRIAL_NOTE under the button states the trial instead. */
const NO_CARD_TAIL = /\s*\d+\s+days? free, no card to start\.?\s*$/i;

export function SaasCTA({ persona }: { persona: Persona }) {
  const body = persona.ctaBody.replace(NO_CARD_TAIL, "");
  const titles = (persona.topics?.clusters ?? []).slice(0, 3).map((c) => c.questions[0]);
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
              {body}
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

          {/* The feed a custom build pulls, rising from the band's foot. */}
          {titles.length > 0 && (
            <Reveal
              delay={0.12}
              y={40}
              className="mx-auto mt-12 h-[10.5rem] max-w-xl overflow-hidden sm:mt-14 sm:h-[11rem]"
            >
              <div aria-hidden>
                <FeedPeek titles={titles} />
              </div>
            </Reveal>
          )}
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
