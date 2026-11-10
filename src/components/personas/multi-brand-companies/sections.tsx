/**
 * The sections of /use-cases/multi-brand-companies, in the landing page's
 * frame. Every line of copy comes from the page's data file (the `persona`
 * prop, and `multiBrand` beside it); these decide how it's set and add short
 * structural labels.
 *
 * The order follows a portfolio operator's questions: what it is, where a
 * portfolio's content breaks, how different each brand's questions are, who
 * does what, the rules that keep brands apart, how a portfolio moves over,
 * the parts it leans on, what it costs per brand, and what's still open.
 */
import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlignLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  GitFork,
  Handshake,
  HelpCircle,
  KeyRound,
  Link2Off,
  Map as MapIcon,
  MessageCircleQuestion,
  MessagesSquare,
  Minus,
  Plus,
  Receipt,
  Route,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accent,
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
import { Mark } from "@/components/brand/Mark";
import { IntegrationGlyph } from "@/components/integrations/visuals";
import { getFeature } from "@/data/features";
import { getIntegration } from "@/data/integrations";
import { PLAN, STUDIO, TRIAL_NOTE, formatUsd } from "@/data/pricing";
import type { HandoffLine, Persona } from "@/data/personas";
import { multiBrand } from "@/data/persona-pages/multi-brand-companies";
import { PainPicture, StepPicture } from "./pictures";
import { BRANDS, H2, LOOKS } from "./looks";
import { Accented, BrandMark, SampleTag, StudioLink } from "./ui";

/* ---------- In short ---------- */

export function MultiBrandInShort({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="short-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={AlignLeft}>In short</Pill>
            <h2
              id="short-title"
              className="mt-5 font-display text-[1.45rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.7rem]"
            >
              {multiBrand.inShortTitle}
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-ink/80 sm:text-[1.12rem]">
              {persona.shortAnswer}
            </p>
          </div>
          <dl
            aria-label={`Rankbox for ${persona.nameLower} at a glance`}
            className="divide-y divide-ink/[0.07]"
          >
            {persona.specs.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline gap-4 px-6 py-5 sm:px-10 lg:px-8 lg:py-6"
              >
                <dt className="order-2 min-w-0 text-[0.86rem] leading-snug text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="order-1 w-[5.75rem] shrink-0 font-display text-[1.4rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.55rem]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Where a portfolio's content breaks ---------- */

export function MultiBrandPains({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="pains-title">
      <Spacer />
      <SectionHead
        icon={GitFork}
        eyebrow="Where it breaks"
        title={
          <span id="pains-title">
            <Accented text={persona.painsTitle} words={2} />
          </span>
        }
        subtitle={persona.painsIntro}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-4">
          {persona.pains.map((p, i) => {
            return (
              <li key={p.pain} className={cn(CELL, "flex flex-col p-5 sm:p-6")}>
                <div
                  aria-hidden
                  className={cn(
                    "flex h-36 items-center justify-center rounded-xl border border-ink/[0.05] px-4",
                    PANEL,
                  )}
                >
                  <PainPicture index={i} />
                </div>
                <span className="mt-6 text-[0.72rem] font-medium tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-[1.16rem] font-medium leading-snug tracking-[-0.015em] text-ink">
                  {p.pain}
                </h3>
                <p className="mt-4 border-l-2 border-cta pl-3.5 text-[0.88rem] leading-relaxed text-ink/75">
                  {p.fix}
                </p>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- The sample portfolio map ---------- */

/* One row per brand, not one column per intent: what a portfolio needs to
   see is how little the brands' questions overlap. */
export function MultiBrandTopicMap({ persona }: { persona: Persona }) {
  const topics = persona.topics;
  if (!topics) return null;
  return (
    <section aria-labelledby="map-title">
      <Spacer />
      <SectionHead
        icon={MapIcon}
        eyebrow="Sample portfolio map"
        title={
          <span id="map-title">
            <Accented text={topics.title} words={3} />
          </span>
        }
        subtitle={topics.intro}
      />
      <Band inner={cn("px-3 py-8 sm:px-8 sm:py-12 lg:px-12", PANEL)}>
        <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-30px_rgba(16,24,40,0.3)]">
          <div className="flex items-center gap-3 border-b border-ink/[0.07] px-4 py-3 sm:px-6">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
              <Boxes aria-hidden className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.88rem] font-semibold text-ink">{topics.brand}</p>
              <p className="truncate font-mono text-[0.66rem] text-muted-foreground">
                {topics.domain} · {topics.clusters.length} sites
              </p>
            </div>
            <SampleTag />
          </div>
          <ol>
            {topics.clusters.map((c, i) => {
              const look = LOOKS[i % LOOKS.length];
              return (
                <li
                  key={c.stage}
                  className={cn(
                    "grid grid-cols-[minmax(0,1fr)] gap-3 px-4 py-4 sm:px-6 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:items-center lg:gap-6",
                    i > 0 && "border-t border-ink/[0.07]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <BrandMark index={i} className="h-9 w-9 rounded-xl" />
                    <div className="min-w-0">
                      <h3 className="truncate text-[0.92rem] font-semibold tracking-tight text-ink">
                        {c.stage}
                      </h3>
                      <p className="mt-1 flex min-w-0 items-center gap-2 text-[0.66rem]">
                        <span
                          className="shrink-0 whitespace-nowrap rounded-md px-1.5 py-px font-medium"
                          style={{ background: look.wash, color: look.ink }}
                        >
                          {c.intent}
                        </span>
                        {BRANDS[i] && (
                          <span className="truncate font-mono text-muted-foreground">
                            {BRANDS[i].domain}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 md:grid-cols-3">
                    {c.questions.map((q) => (
                      <li
                        key={q}
                        className="flex items-start gap-2 rounded-lg border border-ink/[0.07] bg-white px-3 py-2.5 text-[0.82rem] leading-snug text-ink"
                      >
                        <MessageCircleQuestion
                          aria-hidden
                          className="mt-0.5 h-3.5 w-3.5 shrink-0"
                          style={{ color: look.ink }}
                        />
                        {q}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-center text-[0.8rem] leading-relaxed text-muted-foreground">
          {topics.note}
        </p>
      </Band>
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div
            className={cn(
              "flex items-center border-b px-6 py-7 sm:px-10 lg:border-b-0 lg:border-r lg:px-12",
              LINE,
            )}
          >
            <h3 className="max-w-xs font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ink">
              {topics.platformsTitle}
            </h3>
          </div>
          <ul className="divide-y divide-ink/[0.07]">
            {topics.platforms.map(({ slug, why }) => {
              const integration = getIntegration(slug);
              if (!integration) return null;
              return (
                <li key={slug}>
                  <Link
                    to="/integrations/$slug"
                    params={{ slug }}
                    className="group flex items-start gap-4 px-6 py-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-10"
                  >
                    <IntegrationGlyph integration={integration} className="h-9 w-9" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.95rem] font-semibold text-ink">
                        {integration.name}
                      </span>
                      <span className="mt-1 block text-[0.86rem] leading-relaxed text-muted-foreground">
                        {why}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                    />
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

/* ---------- Who does what ---------- */

function Lane({
  title,
  lines,
  ours,
  icon,
}: {
  title: string;
  lines: HandoffLine[];
  ours: boolean;
  icon: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[14rem_minmax(0,1fr)]",
        !ours && "border-t",
        LINE,
        !ours && "bg-[color-mix(in_oklab,var(--cta)_3.5%,white)]",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 border-b px-6 py-5 sm:px-10 lg:flex-col lg:items-start lg:justify-center lg:border-b-0 lg:border-r lg:px-8",
          LINE,
        )}
      >
        {icon}
        <h3 className="text-[1.02rem] font-semibold leading-snug tracking-tight text-ink lg:mt-3">
          {title}
        </h3>
      </div>
      <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-4">
        {lines.map((l, i) => (
          <li key={l.label} className={cn(CELL, "px-6 py-6 sm:px-7")}>
            <span
              className={cn(
                "text-[0.7rem] font-medium tabular-nums",
                ours ? "text-muted-foreground" : "text-cta",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-[0.95rem] font-semibold text-ink">{l.label}</p>
            <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted-foreground">
              {l.detail}
            </p>
          </li>
        ))}
      </CellGrid>
    </div>
  );
}

export function MultiBrandHandoff({ persona }: { persona: Persona }) {
  const { handoff } = persona;
  const [first, ...rest] = multiBrand.handoffTitle.split(". ");
  const Icon = persona.icon;
  const { limits } = multiBrand;
  return (
    <section aria-labelledby="handoff-title">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <Pill icon={Handshake}>Who does what</Pill>
        <h2 id="handoff-title" className={cn("mt-5 max-w-3xl", H2)}>
          {first}.{" "}
          <span className="block">
            <Accent>{rest.join(". ")}</Accent>
          </span>
        </h2>
      </Band>
      <Band>
        <Lane
          ours
          title={handoff.runsTitle}
          lines={handoff.runs}
          icon={
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cta"
            >
              <Mark className="h-4 w-4 text-white" />
            </span>
          }
        />
        <Lane
          ours={false}
          title={handoff.keepsTitle}
          lines={handoff.keeps}
          icon={
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
            >
              <Icon className="h-4 w-4" />
            </span>
          }
        />
      </Band>
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[14rem_minmax(0,1fr)]">
          <div
            className={cn(
              "flex items-center border-b px-6 py-5 sm:px-10 lg:border-b-0 lg:border-r lg:px-8",
              LINE,
            )}
          >
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-ink">
              {limits.title}
            </p>
          </div>
          <div className="flex flex-col gap-4 px-6 py-5 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {limits.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-1.5 text-[0.86rem] text-muted-foreground"
                >
                  <X aria-hidden className="h-3.5 w-3.5 shrink-0 text-ink/35" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>
      <Band inner="px-6 py-4 text-center sm:px-10">
        <p className="text-[0.86rem] text-muted-foreground">
          {limits.elsewhere}{" "}
          {limits.links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && " · "}
              <a
                href={l.href}
                className="font-medium text-brand-blue underline-offset-4 hover:underline"
              >
                {l.label}
              </a>
            </span>
          ))}
        </p>
      </Band>
    </section>
  );
}

/* ---------- Rules that keep brands apart ---------- */

const RULE_ICONS = [Wallet, Link2Off, MessagesSquare, KeyRound];

/* The account as four rooms with walls between them, the Rankbox account
   holding them together in the middle. */
function Rooms() {
  return (
    <div
      aria-hidden
      className={cn("relative mt-9 rounded-2xl border border-ink/[0.06] p-3", PANEL)}
    >
      <div className="grid grid-cols-2 gap-3">
        {BRANDS.map((b, i) => (
          <div
            key={b.domain}
            className="rounded-xl border border-ink/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
          >
            <div className="flex items-center gap-2">
              <BrandMark index={i} className="h-7 w-7" />
              <span className="min-w-0 truncate text-[0.74rem] font-semibold text-ink">
                {b.name}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[0.62rem] text-muted-foreground">
              <span className="tabular-nums">{PLAN.articlesPerMonth}/mo</span>
              <KeyRound className="h-3 w-3" />
            </div>
          </div>
        ))}
      </div>
      <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cta shadow-[0_0_0_5px_white,0_10px_24px_-10px_rgba(22,111,229,0.7)]">
        <Mark className="h-5 w-5 text-white" />
      </span>
    </div>
  );
}

export function MultiBrandGuardrails() {
  const { guardrails } = multiBrand;
  return (
    <section aria-labelledby="rules-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={ShieldCheck}>{guardrails.eyebrow}</Pill>
            <h2 id="rules-title" className={cn("mt-5", H2)}>
              <Accented text={guardrails.title} words={2} />
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
              {guardrails.intro}
            </p>
            <Rooms />
          </div>
          <ol className="divide-y divide-ink/[0.07]">
            {guardrails.rules.map((r, i) => {
              const RIcon = RULE_ICONS[i % RULE_ICONS.length];
              return (
                <li key={r.title} className="flex gap-4 px-6 py-7 sm:px-10 lg:px-12 lg:py-9">
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-brand-blue"
                  >
                    <RIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[1.02rem] font-semibold tracking-tight text-ink">
                      {r.title}
                    </h3>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                      {r.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- From the first brand to the whole portfolio ---------- */

export function MultiBrandRollout({ persona }: { persona: Persona }) {
  const [active, setActive] = useState(0);
  const questions = persona.topics?.clusters[0]?.questions ?? [];
  return (
    <section aria-labelledby="rollout-title">
      <Spacer />
      <SectionHead
        icon={Route}
        eyebrow="Rollout"
        title={
          <span id="rollout-title">
            <Accented text={persona.workflowTitle} words={3} />
          </span>
        }
        subtitle={persona.workflowIntro}
      />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ol className={cn("divide-y divide-ink/[0.07] border-b lg:border-b-0 lg:border-r", LINE)}>
            {persona.steps.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className={cn(
                      "relative flex w-full gap-4 px-6 py-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-10 lg:px-12",
                      on ? "bg-[color-mix(in_oklab,var(--cta)_5%,white)]" : "hover:bg-ink/[0.015]",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-y-0 left-0 w-[3px] transition-colors duration-300",
                        on ? "bg-cta" : "bg-transparent",
                      )}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-semibold tabular-nums transition-colors duration-300",
                        on ? "bg-cta text-white" : "border border-ink/[0.12] text-ink/60",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.74rem] font-semibold text-cta">{s.when}</span>
                      <span className="mt-1 block text-[1.02rem] font-semibold tracking-tight text-ink">
                        {s.title}
                      </span>
                      <span className="mt-1.5 block text-[0.88rem] leading-relaxed text-muted-foreground">
                        {s.body}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {/* Every step's picture shares one cell, so the panel keeps its
              height when the step changes. */}
          <div
            aria-hidden
            className={cn("grid place-items-center px-4 py-10 sm:px-10 lg:py-12", PANEL)}
          >
            {persona.steps.map((s, i) => (
              <div
                key={s.title}
                className={cn(
                  "flex w-full justify-center transition-opacity duration-500 [grid-area:1/1] motion-reduce:transition-none",
                  i === active ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <StepPicture index={i} questions={questions} />
              </div>
            ))}
          </div>
        </div>
      </Band>
      <Band inner="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <StudioLink />
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
      </Band>
    </section>
  );
}

/* ---------- The parts a portfolio leans on ---------- */

export function MultiBrandPicks({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="picks-title">
      <Spacer />
      <SectionHead
        icon={Boxes}
        eyebrow="Features"
        title={
          <span id="picks-title">
            <Accented text={persona.picksTitle} words={2} />
          </span>
        }
        subtitle={persona.picksIntro}
      />
      <Band>
        <ul className="divide-y divide-ink/[0.07]">
          {persona.picks.map((pick) => {
            const f = getFeature(pick.featureSlug);
            if (!f) return null;
            const FIcon = f.icon;
            return (
              <li key={pick.featureSlug}>
                <Link
                  to="/features/$slug"
                  params={{ slug: f.slug }}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 px-6 py-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-10 lg:grid-cols-[auto_minmax(0,0.85fr)_minmax(0,1.15fr)_auto] lg:items-center lg:gap-x-8 lg:px-12"
                >
                  <span
                    aria-hidden
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-soft text-brand-blue"
                  >
                    <FIcon className="h-[1.1rem] w-[1.1rem]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[1rem] font-semibold tracking-tight text-ink">
                      {f.name}
                    </span>
                    <span className="mt-0.5 block text-[0.82rem] leading-relaxed text-muted-foreground">
                      {f.tagline}
                    </span>
                  </span>
                  <span className="col-span-3 col-start-1 row-start-2 text-[0.9rem] leading-relaxed text-ink/80 lg:col-span-1 lg:col-start-3 lg:row-start-1">
                    {pick.why}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="col-start-3 row-start-1 mt-1 h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue lg:col-start-4 lg:mt-0"
                  />
                </Link>
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

/* ---------- What it costs, per brand ---------- */

const MAX_BRANDS = 24;

function Calculator() {
  const { price } = multiBrand;
  const [n, setN] = useState<number>(BRANDS.length);
  const extra = n - 1;
  const total = PLAN.monthly + extra * STUDIO.monthlyPerSite;
  const shown = Math.min(n, 8);

  return (
    <div className="w-full max-w-[30rem] rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.3)] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p id="brand-count-label" className="text-[0.9rem] font-semibold text-ink">
          {price.counter}
        </p>
        <div
          role="group"
          aria-labelledby="brand-count-label"
          className="flex items-center rounded-lg border border-ink/[0.1]"
        >
          <button
            type="button"
            onClick={() => setN((v) => Math.max(1, v - 1))}
            disabled={n <= 1}
            aria-label="One brand fewer"
            className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-ink/[0.03] disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <output
            aria-live="polite"
            className="w-9 border-x border-ink/[0.1] text-center text-[0.95rem] font-semibold tabular-nums text-ink"
          >
            {n}
          </output>
          <button
            type="button"
            onClick={() => setN((v) => Math.min(MAX_BRANDS, v + 1))}
            disabled={n >= MAX_BRANDS}
            aria-label="One brand more"
            className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-ink/[0.03] disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div aria-hidden className="mt-4 flex flex-wrap items-center gap-1.5">
        {Array.from({ length: shown }, (_, i) => (
          <BrandMark key={i} index={i} className="h-7 w-7" />
        ))}
        {n > shown && (
          <span className="flex h-7 items-center rounded-lg bg-ink/[0.05] px-2 text-[0.7rem] font-semibold tabular-nums text-ink/70">
            +{n - shown}
          </span>
        )}
      </div>

      <dl className="mt-5 divide-y divide-ink/[0.07] border-y border-ink/[0.07] text-[0.88rem]">
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-muted-foreground">{price.first}</dt>
          <dd className="font-semibold tabular-nums text-ink">{formatUsd(PLAN.monthly)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-muted-foreground">
            {price.extra} × {extra}
          </dt>
          <dd className="font-semibold tabular-nums text-ink">
            {formatUsd(extra * STUDIO.monthlyPerSite)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="font-semibold text-ink">{price.total}</dt>
          <dd className="font-display text-[1.9rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">
            {formatUsd(total)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-muted-foreground">{price.allowance}</dt>
          <dd className="font-semibold tabular-nums text-ink">{n * PLAN.articlesPerMonth}</dd>
        </div>
      </dl>

      <StudioLink className="mt-5 w-full" />
      <p className="mt-3 text-center text-[0.78rem] text-muted-foreground">{TRIAL_NOTE}</p>
      <p className="mt-1 text-center text-[0.78rem] leading-relaxed text-muted-foreground">
        {price.note}
      </p>
    </div>
  );
}

export function MultiBrandBill({ persona }: { persona: Persona }) {
  const { price } = multiBrand;
  return (
    <section aria-labelledby="stack-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Receipt}>Bought once per brand</Pill>
            <h2 id="stack-title" className={cn("mt-5", H2)}>
              <Accented text={persona.stackTitle} words={3} />
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
              {persona.stackIntro}
            </p>
          </div>
          <div className="px-6 py-8 sm:px-10 lg:px-12 lg:py-14">
            <ul className="divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
              {persona.stack.map((s) => (
                <li key={s.label} className="flex items-start gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.95rem] font-semibold text-ink">{s.label}</p>
                    <p className="mt-0.5 text-[0.86rem] leading-relaxed text-muted-foreground">
                      {s.detail}
                    </p>
                  </div>
                  <span className="mt-0.5 shrink-0 rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.66rem] font-semibold tabular-nums text-ink/60">
                    × {BRANDS.length}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-l-2 border-cta pl-4 text-[0.92rem] leading-relaxed text-ink/80">
              {persona.stackNote}
            </p>
          </div>
        </div>
      </Band>
      <Band id="pricing" className="scroll-mt-16">
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Wallet}>{price.eyebrow}</Pill>
            <h2 className={cn("mt-5", H2)}>
              <Accented text={price.title} words={2} />
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
              {price.intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {price.links.map((l) => (
                <a key={l.href} href={l.href} className={cn(GHOST_BUTTON, "group/btn")}>
                  {l.label}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>
          <div className={cn("flex justify-center px-4 py-10 sm:px-10 lg:py-14", PANEL)}>
            <Calculator />
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Every answer open, in hairline cells: short answers, all in the server
   HTML, nothing to click before reading. */
export function MultiBrandFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <span id="faq-title">
            <Accented text={multiBrand.faqTitle} words={2} />
          </span>
        }
        subtitle={multiBrand.faqLead}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] md:grid-cols-2">
          {persona.faqs.map((f) => (
            <li key={f.q} className={cn(CELL, "px-6 py-7 sm:px-10 lg:px-12 lg:py-9")}>
              <h3 className="text-[1.02rem] font-semibold leading-snug tracking-tight text-ink">
                {f.q}
              </h3>
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</p>
            </li>
          ))}
        </CellGrid>
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

/* ---------- Closing ---------- */

export function MultiBrandClosing({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_80%_at_80%_50%,#000_20%,transparent_100%)]"
        />
        <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-12">
          <div>
            <h2
              id="cta-title"
              className="max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
            >
              {persona.ctaTitle}
            </h2>
            <p className="mt-4 max-w-lg text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {persona.ctaBody}
            </p>
            <StudioLink tone="white" className="mt-8" />
            <p className="mt-3.5 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </div>

          {/* The site list the portfolio ends up with. */}
          <div aria-hidden className="mx-auto w-full max-w-[21rem]">
            <div className="rounded-2xl bg-white p-2 shadow-[0_1px_2px_rgba(4,24,72,0.2),0_24px_50px_-20px_rgba(4,24,72,0.6)]">
              <p className="flex items-center justify-between px-2.5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Your sites <span className="tabular-nums">{BRANDS.length}</span>
              </p>
              {BRANDS.map((b, i) => (
                <div
                  key={b.domain}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                    i === 0 && "bg-cta-soft",
                  )}
                >
                  <BrandMark index={i} className="h-7 w-7" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.78rem] font-semibold text-ink">
                      {b.name}
                    </span>
                    <span className="block truncate text-[0.64rem] text-muted-foreground">
                      {b.domain}
                    </span>
                  </span>
                  <span className="text-[0.62rem] font-medium text-muted-foreground">
                    {i === 0 ? "Your plan" : STUDIO.name}
                  </span>
                </div>
              ))}
              <div className="mt-1 flex items-center gap-2.5 border-t border-ink/[0.07] px-2.5 pb-1.5 pt-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-ink/[0.2] text-muted-foreground">
                  <Plus className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 text-[0.76rem] text-ink">Add a site</span>
                <span className="text-[0.66rem] tabular-nums text-muted-foreground">
                  {formatUsd(STUDIO.monthlyPerSite)}/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
