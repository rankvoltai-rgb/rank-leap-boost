/**
 * The sections of /use-cases/web-design-studios, in the landing page's
 * frame: hairline rails, a hairline over every band, blank bands between
 * sections, white throughout, blue for whatever acts.
 *
 * Written to a studio owner whose revenue ends at launch. It opens on their
 * client roster (builds turning into retainers), states the answer and the
 * limits side by side, then goes in the order a studio would scope the work:
 * why it stops at launch, what a client's blog would hold, who does what in
 * the retainer, where it sits in a project, the features it leans on, the
 * cost side, the white-label pages, the questions, and the close. Every word
 * comes from the persona's data file.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  Check,
  FileSignature,
  Flag,
  HelpCircle,
  Info,
  Layers,
  Minus,
  Network,
  PenLine,
  Plus,
  Quote,
  Receipt,
  Sparkles,
  Tags,
  TrendingDown,
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
import { getFeature } from "@/data/features";
import { getIntegration } from "@/data/integrations";
import { PLAN, STUDIO, TRIAL_NOTE, formatUsd } from "@/data/pricing";
import type { Persona } from "@/data/personas";
import { studiosPage } from "@/data/persona-pages/web-design-studios";
import { RosterScene } from "./roster-scene";
import { SitemapWindow } from "./sitemap";
import { AccentLast, PlatformMark, SampleTag, StudioLink } from "./parts";

const P = studiosPage;

/* ---------- Hero ---------- */

export function StudiosHero({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="hero-title">
      <Band inner="px-5 pb-10 pt-7 text-center sm:px-8 sm:pb-12 sm:pt-9">
        <nav aria-label="Breadcrumb" className="flex justify-center">
          <ol className="flex flex-wrap items-center justify-center gap-1.5 text-[0.8rem] text-muted-foreground">
            <li>
              <Link to="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to="/use-cases" className="transition-colors hover:text-ink">
                Use cases
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {persona.name}
            </li>
          </ol>
        </nav>

        <div className="mt-7">
          <Pill icon={persona.icon}>{persona.eyebrow}</Pill>
        </div>
        <h1
          id="hero-title"
          className="mx-auto mt-5 max-w-4xl font-display text-[2.7rem] font-medium leading-[1.02] tracking-[-0.045em] text-ink sm:text-[4rem] lg:text-[4.5rem]"
        >
          <span className="block">{persona.headline.lead}</span>
          <span className="block font-bold text-brand-blue">{persona.headline.accent}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">
          {persona.subhead}
        </p>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 min-[420px]:flex-row min-[420px]:items-center">
          <StudioLink />
          <Link
            to="/white-label"
            className={cn(GHOST_BUTTON, "group/btn h-11 justify-center px-4 text-[0.9rem]")}
          >
            {P.cta.secondary}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
        <p className="mt-4 text-[0.8rem] text-muted-foreground">{P.cta.trialNote}</p>
        <p className="mx-auto mt-1 max-w-xl text-balance text-[0.8rem] text-muted-foreground">
          {P.cta.trialExtra}
        </p>
      </Band>

      <Band inner={cn(PANEL, "px-3 pb-8 pt-9 sm:px-8 sm:pb-10 sm:pt-10")}>
        <RosterScene />
      </Band>

      <Band>
        <CellGrid className="grid-cols-2 lg:grid-cols-4">
          {persona.specs.map((s, i) => (
            <li key={s.label} className={cn(CELL, "px-5 py-6 sm:px-7 sm:py-7")}>
              <span className="font-mono text-[0.62rem] text-muted-foreground">0{i + 1}</span>
              <p className="mt-2 font-display text-[1.45rem] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[1.75rem]">
                {s.value}
              </p>
              <p className="mt-2 text-[0.8rem] leading-snug text-muted-foreground">{s.label}</p>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- In short, beside what it doesn't do ---------- */

export function StudiosInShort({ persona }: { persona: Persona }) {
  const S = P.inShort;
  return (
    <section aria-labelledby="limits-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Quote}>{S.label}</Pill>
            <p className="mt-5 text-pretty text-[1.08rem] leading-[1.65] text-ink sm:text-[1.22rem]">
              {persona.shortAnswer}
            </p>
          </div>
          <div className={cn(PANEL, "px-6 py-10 sm:px-10 lg:px-9 lg:py-14")}>
            <h2 id="limits-title" className="text-[0.95rem] font-semibold text-ink">
              {S.limitsTitle}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {S.limits.map((l) => (
                <li
                  key={l}
                  className="flex items-start gap-2.5 text-[0.88rem] leading-snug text-ink/80"
                >
                  <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-ink/[0.06] text-ink/60">
                    <X className="h-2.5 w-2.5" strokeWidth={2.6} />
                  </span>
                  {l}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.8rem] leading-relaxed text-muted-foreground">
              {S.limitsNote}
            </p>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Why the work stops at launch ---------- */

export function StudiosPains({ persona }: { persona: Persona }) {
  const V = P.survey;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={TrendingDown}
        eyebrow={P.sections.pains}
        title={<AccentLast text={persona.painsTitle} words={2} />}
        subtitle={persona.painsIntro}
      />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <figure
            className={cn(
              PANEL,
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12",
              LINE,
            )}
          >
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {V.kicker}
            </p>
            <p className="mt-4 font-display text-[3.6rem] font-medium leading-none tracking-[-0.05em] text-brand-blue sm:text-[4.4rem]">
              {V.value}
            </p>
            <blockquote className="mt-4 text-[1.02rem] leading-snug text-ink">{V.claim}</blockquote>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">{V.contrast}</p>
            <p className="mt-5 border-l-2 border-ink/[0.1] pl-3 text-[0.8rem] leading-relaxed text-muted-foreground">
              {V.caveat}
            </p>
            <figcaption className="mt-6">
              <a
                href={V.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-start gap-1.5 text-[0.8rem] font-medium text-ink transition-colors hover:text-brand-blue"
              >
                <span>
                  {V.source}
                  <span className="block font-normal text-muted-foreground">{V.sourceDetail}</span>
                </span>
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </figcaption>
          </figure>

          <ol>
            {persona.pains.map((x, i) => (
              <li
                key={x.pain}
                className={cn(
                  "grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-b px-6 py-7 last:border-b-0 sm:px-10 lg:px-10",
                  LINE,
                )}
              >
                <span className="pt-0.5 font-mono text-[0.72rem] text-muted-foreground">
                  0{i + 1}
                </span>
                <div>
                  <p className="text-[1.02rem] font-medium leading-snug text-ink">{x.pain}</p>
                  <p className="mt-2.5 flex gap-2 text-[0.9rem] leading-relaxed text-muted-foreground">
                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-blue" />
                    <span>{x.fix}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- A client's blog, as a sitemap ---------- */

export function StudiosTopics({ persona }: { persona: Persona }) {
  const topics = persona.topics;
  if (!topics) return null;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Network}
        eyebrow={P.sections.topics}
        title={<AccentLast text={topics.title} words={3} />}
        subtitle={topics.intro}
      />
      <Band inner={cn(PANEL, "px-3 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-12")}>
        <div className="mx-auto max-w-5xl">
          <SitemapWindow topics={topics} />
          <p className="mx-auto mt-4 max-w-2xl text-balance text-center text-[0.78rem] leading-relaxed text-muted-foreground">
            {topics.note}
          </p>
        </div>
      </Band>
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.7fr)_minmax(0,2.3fr)]">
          <div
            className={cn(
              "flex flex-col justify-center border-b px-6 py-7 sm:px-10 lg:border-b-0 lg:border-r lg:px-8",
              LINE,
            )}
          >
            <Pill icon={Layers} className="w-fit">
              {P.sections.platforms}
            </Pill>
            <h3 className="mt-3 font-display text-[1.3rem] font-medium tracking-[-0.02em] text-ink">
              {topics.platformsTitle}
            </h3>
          </div>
          <CellGrid className="grid-cols-[minmax(0,1fr)] md:grid-cols-3">
            {topics.platforms.map((pl) => {
              const integ = getIntegration(pl.slug);
              if (!integ) return null;
              return (
                <li key={pl.slug} className={CELL}>
                  <Link
                    to="/integrations/$slug"
                    params={{ slug: pl.slug }}
                    className="group flex h-full flex-col px-6 py-6 transition-colors hover:bg-cta-soft/50 sm:px-7"
                  >
                    <span className="flex items-center gap-2.5">
                      {integ.platform && <PlatformMark id={integ.platform} className="h-6 w-6" />}
                      <span className="text-[0.92rem] font-semibold text-ink">{integ.name}</span>
                      <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-muted-foreground transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </span>
                    <span className="mt-3 text-[0.84rem] leading-relaxed text-muted-foreground">
                      {pl.why}
                    </span>
                  </Link>
                </li>
              );
            })}
          </CellGrid>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The retainer's scope of work ---------- */

export function StudiosScope({ persona }: { persona: Persona }) {
  const S = P.scope;
  const H = persona.handoff;
  const columns = [
    { title: H.runsTitle, lines: H.runs, ours: true },
    { title: H.keepsTitle, lines: H.keeps, ours: false },
  ];
  return (
    <section aria-labelledby="scope-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={FileSignature} className="w-fit">
              {S.kicker}
            </Pill>
            <h2
              id="scope-title"
              className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              {S.heading} <Accent>{S.accent}</Accent>
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">{S.intro}</p>
            <Link to="/white-label" className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
              {S.link}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </div>

          <div className={cn(PANEL, "px-3 py-8 sm:px-8 sm:py-10 lg:px-10")}>
            <article className="rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-30px_rgba(16,24,40,0.3)]">
              <header className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/[0.07] px-5 py-4 sm:px-7">
                <div>
                  <p className="text-[0.66rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    {S.docKicker}
                  </p>
                  <p className="mt-1 font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                    {S.docTitle}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground">
                  {S.docLabel}
                  <SampleTag />
                </div>
              </header>
              <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2">
                {columns.map((col, ci) => (
                  <div
                    key={col.title}
                    className={cn(
                      "px-5 py-5 sm:px-7 sm:py-6",
                      ci === 0 && cn("border-b md:border-b-0 md:border-r", LINE),
                    )}
                  >
                    <h3 className="flex items-center gap-2 text-[0.82rem] font-semibold text-ink">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-md",
                          col.ours ? "bg-cta text-white" : "bg-ink text-white",
                        )}
                      >
                        {col.ours ? (
                          <Sparkles className="h-3 w-3" />
                        ) : (
                          <PenLine className="h-3 w-3" />
                        )}
                      </span>
                      {col.title}
                    </h3>
                    <ol className="mt-4 space-y-4">
                      {col.lines.map((l, i) => (
                        <li key={l.label} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2">
                          <span className="pt-0.5 font-mono text-[0.66rem] text-muted-foreground">
                            {ci + 1}.{i + 1}
                          </span>
                          <div>
                            <p className="flex items-center gap-1.5 text-[0.88rem] font-semibold text-ink">
                              {col.ours && (
                                <Check className="h-3.5 w-3.5 text-brand-blue" strokeWidth={2.6} />
                              )}
                              {l.label}
                            </p>
                            <p className="mt-1 text-[0.82rem] leading-relaxed text-muted-foreground">
                              {l.detail}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Where it fits in a project ---------- */

/* A four-part strip over each step, in the hero's lane language: proposal,
   build, launch, retainer. The step's own part is lit. */
function PhaseStrip({ at }: { at: number }) {
  const part = (i: number) =>
    cn("h-full rounded-[4px] transition-opacity", i !== at && "opacity-35");
  return (
    <div aria-hidden className="grid h-6 grid-cols-4 gap-1">
      <span className={cn(part(0), "border border-dashed border-ink/25")} />
      <span
        className={cn(
          part(1),
          "bg-ink/[0.05] bg-[repeating-linear-gradient(135deg,rgba(16,24,40,0.14)_0_1.5px,transparent_1.5px_5px)]",
        )}
      />
      <span className={cn(part(2), "flex items-center justify-center bg-ink text-white")}>
        <Flag className="h-3 w-3" strokeWidth={2.4} />
      </span>
      <span
        className={cn(part(3), "flex items-end gap-[2px] overflow-hidden bg-cta-soft px-[3px]")}
      >
        {[0.6, 0.9, 0.7, 1, 0.8].map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-[2px] bg-cta"
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </span>
    </div>
  );
}

export function StudiosWorkflow({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={CalendarRange}
        eyebrow={P.sections.workflow}
        title={<AccentLast text={persona.workflowTitle} words={2} />}
        subtitle={persona.workflowIntro}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-4">
          {persona.steps.map((s, i) => (
            <li key={s.title} className={cn(CELL, "px-6 py-8 sm:px-7")}>
              <PhaseStrip at={i} />
              <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-brand-blue">
                {s.when}
              </p>
              <h3 className="mt-2 font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- The features a retainer runs on ---------- */

export function StudiosPicks({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Tags}
        eyebrow={P.sections.picks}
        title={<AccentLast text={persona.picksTitle} words={3} />}
        subtitle={persona.picksIntro}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2">
          {persona.picks.map((pick) => {
            const f = getFeature(pick.featureSlug);
            if (!f) return null;
            const Icon = f.icon;
            return (
              <li key={pick.featureSlug} className={CELL}>
                <Link
                  to="/features/$slug"
                  params={{ slug: pick.featureSlug }}
                  className="group flex h-full gap-4 px-6 py-7 transition-colors hover:bg-cta-soft/50 sm:px-9 sm:py-8"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors group-hover:border-cta/30">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[1rem] font-semibold text-ink">
                      {f.name}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </span>
                    <span className="mt-1.5 block text-[0.88rem] leading-relaxed text-muted-foreground">
                      {pick.why}
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

/* ---------- The cost side: what it replaces, and the price ---------- */

const MAX_SITES = 25;

function PriceBlock() {
  const R = P.price;
  const [n, setN] = useState(3);
  const total = PLAN.monthly + n * STUDIO.monthlyPerSite;
  const step = (d: number) => setN((v) => Math.min(MAX_SITES, Math.max(0, v + d)));
  const stepBtn =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink transition-colors hover:border-cta/40 hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 disabled:opacity-40 disabled:hover:border-ink/[0.1] disabled:hover:text-ink";

  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-30px_rgba(16,24,40,0.3)] sm:p-7">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {R.kicker}
      </p>
      <h3 className="mt-1.5 font-display text-[1.5rem] font-medium tracking-[-0.025em] text-ink">
        {R.title}
      </h3>
      <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">{R.intro}</p>

      <dl className={cn("mt-5 divide-y border-y", LINE, "divide-ink/[0.07]")}>
        {[
          { label: R.planLabel, detail: R.planDetail, value: PLAN.monthly },
          { label: R.siteLabel, detail: R.siteDetail, value: STUDIO.monthlyPerSite },
        ].map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 py-3.5">
            <div>
              <dt className="text-[0.88rem] font-semibold text-ink">{row.label}</dt>
              <dd className="mt-0.5 text-[0.78rem] leading-snug text-muted-foreground">
                {row.detail}
              </dd>
            </div>
            <dd className="shrink-0 text-[0.95rem] font-semibold tabular-nums text-ink">
              {formatUsd(row.value)}
              <span className="text-[0.75rem] font-normal text-muted-foreground">{R.perMonth}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center justify-between gap-4">
        <span id="sites-label" className="text-[0.88rem] font-medium text-ink">
          {R.stepperLabel}
        </span>
        <div role="group" aria-labelledby="sites-label" className="flex items-center gap-2">
          <button
            type="button"
            className={stepBtn}
            onClick={() => step(-1)}
            disabled={n <= 0}
            aria-label={R.fewer}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-[1rem] font-semibold tabular-nums text-ink">
            {n}
          </span>
          <button
            type="button"
            className={stepBtn}
            onClick={() => step(1)}
            disabled={n >= MAX_SITES}
            aria-label={R.more}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-cta-soft px-4 py-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-[0.82rem] font-medium text-cta">{R.totalLabel}</span>
          <span
            aria-live="polite"
            className="font-display text-[1.6rem] font-medium tabular-nums tracking-[-0.02em] text-cta"
          >
            {formatUsd(total)}
            <span className="text-[0.85rem]">{R.perMonth}</span>
          </span>
        </div>
        <p className="mt-0.5 text-right text-[0.7rem] tabular-nums text-cta/80">
          {formatUsd(PLAN.monthly)} + {n} × {formatUsd(STUDIO.monthlyPerSite)}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 px-1 text-[0.84rem]">
        <span className="text-muted-foreground">{R.clientLabel}</span>
        <span className="font-semibold text-ink">{R.clientValue}</span>
      </div>

      <StudioLink className="mt-5 w-full" />
      <p className="mt-2.5 text-center text-[0.76rem] text-muted-foreground">{TRIAL_NOTE}</p>

      <ul className="mt-5 space-y-2 border-t border-ink/[0.07] pt-4">
        {R.notes.map((note) => (
          <li
            key={note}
            className="flex gap-2 text-[0.78rem] leading-relaxed text-muted-foreground"
          >
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/40" />
            {note}
          </li>
        ))}
      </ul>
      <Link to="/white-label/pricing" className={cn(GHOST_BUTTON, "group/btn mt-5")}>
        {R.marginLink}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
      </Link>
    </div>
  );
}

export function StudiosCost({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="cost-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Receipt}>{P.sections.stack}</Pill>
            <h2
              id="cost-title"
              className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              <AccentLast text={persona.stackTitle} words={2} />
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">
              {persona.stackIntro}
            </p>
            <ul className={cn("mt-7 divide-y border-y", LINE, "divide-ink/[0.07]")}>
              {persona.stack.map((item) => (
                <li key={item.label} className="flex items-start gap-3 py-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
                    <Check className="h-3 w-3" strokeWidth={2.6} />
                  </span>
                  <span>
                    <span className="block text-[0.92rem] font-medium text-ink">{item.label}</span>
                    <span className="mt-0.5 block text-[0.82rem] leading-snug text-muted-foreground">
                      {item.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex gap-2.5 rounded-lg border border-ink/[0.08] bg-white px-4 py-3 text-[0.82rem] leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />
              {persona.stackNote}
            </p>
          </div>
          <div className={cn(PANEL, "px-3 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-14")}>
            <PriceBlock />
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The white-label pages ---------- */

export function StudiosWhiteLabel() {
  const W = P.whiteLabel;
  return (
    <section aria-labelledby="white-label-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12",
              LINE,
            )}
          >
            <Pill icon={Layers} className="w-fit">
              {W.kicker}
            </Pill>
            <h2
              id="white-label-title"
              className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]"
            >
              <AccentLast text={W.title} words={3} />
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">{W.intro}</p>
          </div>
          <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2">
            {W.links.map((l) => (
              <li key={l.href} className={CELL}>
                <Link
                  to={l.href}
                  className="group flex h-full flex-col px-6 py-6 transition-colors hover:bg-cta-soft/50 sm:px-8 sm:py-7"
                >
                  <span className="flex items-center justify-between gap-3 text-[0.95rem] font-semibold text-ink">
                    {l.title}
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                  </span>
                  <span className="mt-2 text-[0.84rem] leading-relaxed text-muted-foreground">
                    {l.body}
                  </span>
                  <span className="mt-3 font-mono text-[0.66rem] text-muted-foreground">
                    {l.href}
                  </span>
                </Link>
              </li>
            ))}
          </CellGrid>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Questions ---------- */

export function StudiosFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-24">
              <Pill icon={HelpCircle}>{P.sections.faq}</Pill>
              <h2
                id="faq-title"
                className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
              >
                {P.faqTitle} <Accent>{P.faqAccent}</Accent>
              </h2>
              <a href={P.faqHref} className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
                {P.faqLink}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </a>
            </div>
          </div>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            {persona.faqs.map((f, i) => (
              <details
                key={f.q}
                open={i === 0}
                className={cn("group border-b last:border-b-0", LINE)}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[background-color,color,border-color] duration-300 group-open:border-brand-blue group-open:bg-brand-blue group-open:text-white motion-reduce:transition-none">
                    <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-5 pr-10 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* The bars of a retainer, rising from the band's foot: the hero's lane,
   drawn once more in white. */
const FOOT_BARS = Array.from({ length: 36 }, (_, i) => 0.35 + ((i * 37) % 60) / 100);

export function StudiosCTA({ persona }: { persona: Persona }) {
  const Icon = persona.icon;
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div className="relative px-5 pb-24 pt-16 text-center sm:px-8 sm:pb-28 sm:pt-20">
          <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-blue shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)]">
            <Icon className="h-5 w-5" strokeWidth={2.2} />
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
          <StudioLink tone="white" className="mt-8" />
          <p className="mt-3 text-[0.82rem] text-white">{P.cta.trialNote}</p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 flex h-16 items-end gap-[3px] px-4 opacity-25 sm:h-20 sm:gap-1 sm:px-8"
        >
          {FOOT_BARS.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-[3px] bg-white"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
