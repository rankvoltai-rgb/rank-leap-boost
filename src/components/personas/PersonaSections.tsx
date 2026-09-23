/**
 * Use-case pages are sub-landing pages aimed at a seat rather than a feature:
 * the landing's design language (blue pixel hero, URL capture, bordered cards,
 * alternating surfaces, dark closing CTA) with a body that answers "is this
 * built for someone in my job?"
 *
 * The hero's right half is a scene of its own on every page (hero-scenes.tsx),
 * so no two heroes look alike. Three sections here exist only on these pages,
 * because they answer the objections a persona page actually has to clear:
 *
 *   PersonaHandoff — what runs itself, and what never stops being the reader's.
 *   PersonaStack   — the line items this consolidates, with a price only on ours.
 *   PersonaTopics  — business pages: what it would write for a shop like yours,
 *                    and the integrations it would land through.
 *
 * The body sections take `tint`, and the route alternates it, so the page's
 * rhythm holds whether or not a page carries topics or proof.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowDown,
  Check,
  ChevronRight,
  MessageCircleQuestion,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Reveal,
  Eyebrow,
  Avatar,
  Stars,
  StatCard,
  PrimaryButton,
} from "@/components/landing/shared";
import { PixelField, CARD_PIXELS, UrlForm, TrustRow } from "@/components/landing/Hero";
import { TESTIMONIALS } from "@/components/landing/Testimonials";
import { Chip, Letter, ProductWindow, type Tone } from "@/components/features/showcase/kit";
import { IntegrationGlyph } from "@/components/integrations/visuals";
import { PersonaScene } from "./hero-scenes";
import { cn } from "@/lib/utils";
import { getFeature } from "@/data/features";
import { getIntegration } from "@/data/integrations";
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";
import { PERSONA_GROUPS, personasIn, withArticle, type Persona } from "@/data/personas";

/* ---------- shared bits ---------- */

/** A body section's background. Tinted bands carry the border between them. */
function band(tint: boolean) {
  return tint ? "border-t border-border bg-surface/40" : undefined;
}

interface BodyProps {
  persona: Persona;
  tint?: boolean;
}

function Heading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {intro && <p className="mt-4 text-balance text-lg text-muted-foreground">{intro}</p>}
    </Reveal>
  );
}

/* The persona's icon on a white tile, sized in em so it sits inside the H1 the
   way the feature pages' lockup does. Decorative: the H1 carries the meaning. */
function IconTile({ persona, className }: { persona: Persona; className?: string }) {
  const Icon = persona.icon;
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex h-[1em] w-[1em] shrink-0 -translate-y-[0.08em] items-center justify-center rounded-[0.24em] bg-white align-middle shadow-elevation ring-1 ring-border",
        className,
      )}
    >
      <Icon className="h-[50%] w-[50%] text-brand-blue" strokeWidth={2.4} />
    </span>
  );
}

/* ---------- 1. Hero ---------- */

export function PersonaHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;
  const [firstAccent, ...restAccent] = persona.headline.accent.split(" ");

  return (
    <section
      id="top"
      aria-labelledby="persona-title"
      className="relative flex min-h-[calc(100svh-var(--top-chrome))] items-center overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-12 lg:py-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          {/* LEFT — the promise */}
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6 flex justify-center lg:justify-start">
                <ol className="flex items-center gap-1.5 text-xs font-medium text-white/65">
                  <li>
                    <Link to="/" className="transition-colors hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li>
                    <Link to="/use-cases" className="transition-colors hover:text-white">
                      Use cases
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li aria-current="page" className="text-white">
                    {persona.name}
                  </li>
                </ol>
              </nav>
            </Reveal>

            <Reveal delay={0.05}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Icon className="h-3.5 w-3.5" />
                {persona.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.12}>
              <h1
                id="persona-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight text-white sm:text-[3.25rem] xl:text-[3.6rem]"
              >
                <span className="lg:block">{persona.headline.lead}</span>{" "}
                <span className="whitespace-nowrap">
                  <IconTile persona={persona} className="mr-[0.22em]" />
                  {firstAccent}
                </span>
                {restAccent.length > 0 && ` ${restAccent.join(" ")}`}
              </h1>
            </Reveal>

            <Reveal delay={0.19}>
              <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                {persona.subhead}
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                <UrlForm url={url} onChange={setUrl} />
                <p className="text-sm text-white/70">
                  No credit card required · Free {TRIAL_DAYS}-day trial
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.32} className="mt-9 flex justify-center lg:justify-start">
              <TrustRow />
            </Reveal>
          </div>

          {/* RIGHT — this page's own scene, played on the reader's surface */}
          <Reveal delay={0.34} y={28} className="mx-auto w-full min-w-0 max-w-lg lg:mx-0">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-12">
                <PixelField pixels={CARD_PIXELS} seed={7} />
              </div>
              <div className="relative">
                <PersonaScene persona={persona} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. At a glance ---------- */

export function PersonaSpecs({ persona }: { persona: Persona }) {
  return (
    <section
      aria-label={`Rankbox for ${persona.name} at a glance`}
      className="border-b border-border bg-card"
    >
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 md:grid-cols-4 md:py-12">
        {persona.specs.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.05}
            className={cn(
              "flex flex-col-reverse px-3 text-center md:px-6",
              i % 2 === 1 && "border-l border-border",
              i > 0 && "md:border-l md:border-border",
            )}
          >
            <dt className="mt-1.5 text-balance text-sm leading-snug text-muted-foreground">
              {s.label}
            </dt>
            <dd className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
              {s.value}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/* ---------- 3. Pain ledger ---------- */

/* A ledger rather than a before/after two-up: the reader's line sits on the
   left in their own words, ours answers it on the right, and the pairing is
   what does the work. */
export function PersonaPains({ persona, tint = false }: BodyProps) {
  return (
    <section aria-labelledby="pains-title" className={cn("py-24 sm:py-32", band(tint))}>
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="pains-title"
          eyebrow="Sound familiar?"
          title={persona.painsTitle}
          intro={persona.painsIntro}
        />

        <div className="mx-auto mt-14 max-w-4xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {persona.pains.map((p, i) => (
            <Reveal key={p.pain} delay={i * 0.05}>
              <div className="grid items-center gap-4 p-6 sm:p-7 md:grid-cols-[1fr_auto_1fr] md:gap-6">
                <div className="flex gap-3.5">
                  <span className="mt-0.5 text-xs font-semibold tabular-nums text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-[1.05rem] font-semibold leading-snug text-ink">
                    {p.pain}
                  </p>
                </div>

                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground md:mx-auto"
                >
                  <ArrowRight className="hidden h-3.5 w-3.5 md:block" />
                  <ArrowDown className="h-3.5 w-3.5 md:hidden" />
                </span>

                <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{p.fix}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 3a. Who does what ---------- */

/**
 * The ownership split. Nothing else on the site says out loud what stays the
 * customer's job, and on a page that exists to make someone picture their own
 * week, that is the most persuasive thing we have — it is the difference
 * between "this replaces you" and "this replaces the part of the job you
 * resent". It follows the pains, as the answer to them; the hero plays the
 * same split as a scene.
 */
export function PersonaHandoff({ persona, tint = false }: BodyProps) {
  const { handoff } = persona;
  return (
    <section aria-labelledby="handoff-title" className={cn("py-24 sm:py-32", band(tint))}>
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="handoff-title"
          eyebrow="Who does what"
          title="What you hand over, and what stays yours"
          intro="Auto-publish is a switch. Leave it off and nothing goes live without you."
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-elevation sm:p-7">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue text-white">
                  <Sparkles className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-ink">
                  {handoff.runsTitle}
                </h3>
              </div>
              <ul className="mt-6 space-y-5">
                {handoff.runs.map((l) => (
                  <li key={l.label} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{l.label}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {l.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="h-full">
            <div className="h-full rounded-2xl border border-border bg-surface/60 p-6 sm:p-7">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-ink">
                  <UserRound className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-ink">
                  {handoff.keepsTitle}
                </h3>
              </div>
              <ul className="mt-6 space-y-5">
                {handoff.keeps.map((l) => (
                  <li key={l.label} className="flex gap-3">
                    <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-volt ring-4 ring-volt/15" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{l.label}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {l.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3b. Sample topic map (business pages) ---------- */

/* By position, not by label: the four clusters always run buy → compare →
   use → fix, and a page can word its intents however suits the trade. */
const CLUSTER_TONES: Tone[] = ["success", "volt", "muted", "warning"];

/**
 * The page's proof that it understands this kind of business: a sample
 * answer-space map for a fictional shop in the trade, then the integrations
 * those articles would land through. Nothing on it is a number — the
 * research surface has volumes, but a volume beside a fictional question is
 * invented data.
 */
export function PersonaTopics({ persona, tint = false }: BodyProps) {
  const topics = persona.topics;
  if (!topics) return null;
  const count = topics.clusters.reduce((n, c) => n + c.questions.length, 0);

  return (
    <section
      id="topics"
      aria-labelledby="topics-title"
      className={cn("py-24 sm:py-32", band(tint))}
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="topics-title"
          eyebrow="Sample topic map"
          title={topics.title}
          intro={topics.intro}
        />

        <Reveal delay={0.06} y={24} className="mt-14">
          <ProductWindow title="Answer-space research" icon={Search}>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Letter domain={topics.domain} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{topics.brand}</p>
                  <p className="truncate font-mono text-[0.7rem] text-muted-foreground">
                    {topics.domain}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {count} questions · {topics.clusters.length} stages · awaiting approval
              </p>
            </div>

            <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
              {topics.clusters.map((c, i) => (
                <div key={c.stage} className="flex flex-col bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-ink">{c.stage}</h3>
                    <Chip tone={CLUSTER_TONES[i % CLUSTER_TONES.length]}>{c.intent}</Chip>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {c.questions.map((q) => (
                      <li
                        key={q}
                        className="flex gap-2.5 rounded-lg border border-border bg-surface/60 px-3 py-2.5 text-[0.8rem] leading-snug text-ink"
                      >
                        <MessageCircleQuestion
                          aria-hidden
                          className="mt-px h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ProductWindow>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-center text-xs leading-relaxed text-muted-foreground">
            {topics.note}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16">
          <p className="text-center text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {topics.platformsTitle}
          </p>
          <div className="mx-auto mt-5 grid max-w-5xl gap-4 sm:grid-cols-3">
            {topics.platforms.map(({ slug, why }) => {
              const integration = getIntegration(slug);
              if (!integration) return null;
              return (
                <Link
                  key={slug}
                  to="/integrations/$slug"
                  params={{ slug }}
                  className="group flex h-full items-start gap-3.5 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-elevation-lg"
                >
                  <IntegrationGlyph integration={integration} className="h-10 w-10" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 font-semibold text-ink">
                      {integration.name}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-ink" />
                    </p>
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">{why}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 4. Workflow rail ---------- */

/* Vertical, with the timeline label on the rail: these steps are a narrative
   about someone's week, and a week reads down the page, not across it. */
export function PersonaWorkflow({ persona, tint = true }: BodyProps) {
  return (
    <section aria-labelledby="workflow-title" className={cn("py-24 sm:py-32", band(tint))}>
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="workflow-title"
          eyebrow="How it works"
          title={persona.workflowTitle}
          intro={persona.workflowIntro}
        />

        <ol className="relative mx-auto mt-14 max-w-3xl">
          {persona.steps.map((s, i) => (
            <li key={s.title} className="relative pb-6 last:pb-0">
              {/* One segment per gap rather than one rail behind the whole list:
                  a single rail has to guess where the last node's centre is and
                  leaves a tail hanging under it. */}
              {i < persona.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-5 top-10 w-px bg-[linear-gradient(to_bottom,var(--border)_55%,transparent_55%)] bg-[length:1px_12px] sm:left-6 sm:top-12"
                />
              )}
              <Reveal delay={i * 0.06} className="flex gap-5 sm:gap-6">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white shadow-sm sm:h-12 sm:w-12 sm:text-base">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 rounded-2xl border border-border bg-card p-5 shadow-elevation sm:p-6">
                  <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-volt">
                    {s.when}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1} className="mt-12 flex flex-col items-center gap-3">
          <PrimaryButton>
            Start your free trial <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
          <p className="text-xs text-muted-foreground">
            No credit card required · Free {TRIAL_DAYS}-day trial
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 5. The stack it consolidates ---------- */

/* Deliberately priceless on the left. Putting invented market rates next to
   another company's job title is how a page like this stops being credible;
   the only number here is our own. */
export function PersonaStack({ persona, tint = false }: BodyProps) {
  return (
    <section aria-labelledby="stack-title" className={cn("py-24 sm:py-32", band(tint))}>
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="stack-title"
          eyebrow="One subscription"
          title={persona.stackTitle}
          intro={persona.stackIntro}
        />

        <div className="mx-auto mt-14 grid max-w-5xl items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          {/* min-w-0: without it the grid item is sized by its content and the
              truncating labels below push the page wider than the viewport. */}
          <Reveal className="min-w-0">
            <ul className="space-y-2.5">
              {persona.stack.map((s) => (
                <li
                  key={s.label}
                  className="min-w-0 rounded-xl border border-border bg-card px-4 py-3.5"
                >
                  <p className="text-sm font-semibold text-muted-foreground line-through decoration-flame/60 decoration-2">
                    {s.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground/75">{s.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="flex justify-center">
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-ink shadow-elevation"
            >
              <ArrowDown className="h-4 w-4 lg:hidden" />
              <ArrowRight className="hidden h-4 w-4 lg:block" />
            </span>
          </Reveal>

          <Reveal delay={0.12} className="min-w-0">
            <div className="relative overflow-hidden rounded-2xl bg-brand-blue p-7 text-white shadow-elevation-lg sm:p-8">
              <PixelField seed={4} />
              <div className="relative">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/60">
                  Everything above, as one plan
                </p>
                <p className="mt-3 font-display text-4xl font-bold tracking-tight">
                  {formatUsd(PLAN.monthly)}
                  <span className="ml-1 text-base font-semibold text-white/70">/month</span>
                </p>
                <ul className="mt-6 space-y-2.5 border-t border-white/20 pt-6">
                  {[
                    `${PLAN.articlesPerMonth} published articles a month`,
                    `${PLAN.backlinkCreditsPerMonth} backlink credits a month`,
                    "Research, scoring, publishing, and citation tracking",
                    "Unlimited team members and unlimited rewrites",
                  ].map((l) => (
                    <li key={l} className="flex gap-2.5 text-sm leading-snug text-white/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} aria-hidden />
                      {l}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/pricing"
                  className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-white"
                >
                  See what&rsquo;s in the plan
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-10 max-w-2xl text-balance text-center text-sm leading-relaxed text-muted-foreground">
            {persona.stackNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 6. The features that carry this seat ---------- */

export function PersonaPicks({ persona, tint = true }: BodyProps) {
  return (
    <section aria-labelledby="picks-title" className={cn("py-24 sm:py-32", band(tint))}>
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="picks-title"
          eyebrow="Built for the job"
          title={persona.picksTitle}
          intro={persona.picksIntro}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:gap-6">
          {persona.picks.map((pick, i) => {
            const f = getFeature(pick.featureSlug);
            if (!f) return null;
            const Icon = f.icon;
            return (
              <Reveal key={pick.featureSlug} delay={(i % 2) * 0.06}>
                <Link
                  to="/features/$slug"
                  params={{ slug: f.slug }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-background transition-colors group-hover:bg-brand-blue">
                      <Icon className="h-4 w-4" />
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-ink" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{f.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.tagline}</p>
                  <p className="mt-4 border-t border-border pt-4 text-[0.95rem] leading-relaxed text-ink/80">
                    <span className="font-semibold text-ink">
                      Why it matters to {persona.nameLower}:{" "}
                    </span>
                    {pick.why}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-10 text-center">
          <Link
            to="/features"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
          >
            See the whole engine <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 7. Proof ---------- */

export function PersonaProof({ persona, tint = false }: BodyProps) {
  const picks = persona.proof
    .map((name) => TESTIMONIALS.find((t) => t.n === name))
    .filter((t): t is (typeof TESTIMONIALS)[number] => Boolean(t));
  const [lead, ...rest] = picks;

  return (
    <section id="proof" aria-labelledby="proof-title" className={cn("py-24 sm:py-32", band(tint))}>
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="proof-title"
          eyebrow="In the same seat"
          title={persona.proofTitle}
          intro="Teams across SaaS, e-commerce, and services use Rankbox to grow search traffic and get their brand cited by AI."
        />

        {lead && (
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <figure className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-brand-blue p-8 text-white sm:p-10">
                <PixelField seed={3} />
                <div className="relative">
                  <Stars />
                  <blockquote className="mt-6 text-balance font-display text-2xl font-semibold leading-snug tracking-tight sm:text-[2rem] sm:leading-[1.25]">
                    &ldquo;{lead.q}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="relative mt-10 flex items-center gap-3">
                  <Avatar name={lead.n} src={lead.a} className="h-11 w-11 ring-white/30" />
                  <div>
                    <p className="text-sm font-semibold">{lead.n}</p>
                    <p className="text-xs text-white/70">
                      {lead.r} · {lead.c}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>

            <div className="flex flex-col gap-6">
              {rest.map((t, i) => (
                <Reveal key={t.n} delay={0.06 * (i + 1)} className="flex-1">
                  <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elevation-lg">
                    <Stars className="mb-3" />
                    <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-ink">
                      &ldquo;{t.q}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                      <Avatar name={t.n} src={t.a} className="h-10 w-10" />
                      <div>
                        <p className="text-sm font-semibold text-ink">{t.n}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.r} · {t.c}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard value="400+" label="Active founders" />
            <StatCard value="4.8/5" label="Average rating" />
            <StatCard value="60K+" label="Articles published" />
            <StatCard value="Daily" label="Auto-published content" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 8. The other seats ---------- */

/* Every page, in its group, with this one marked rather than dropped: the
   reader sees the whole map and where they're standing on it, and two groups
   of three keep the grid even however many pages each group grows to. */
export function OtherPersonas({ persona }: { persona: Persona }) {
  return (
    /* bg-card, not the usual surface tint: on the page this band follows the
       pricing block, which the route usually wraps in surface/40. */
    <section
      aria-labelledby="others-title"
      className="border-t border-border bg-card py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Not quite your seat?</Eyebrow>
          <h2
            id="others-title"
            className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            The same engine, written for how you work
          </h2>
        </Reveal>

        <div className="mt-12 space-y-10">
          {PERSONA_GROUPS.map((g) => (
            <div key={g.id}>
              <Reveal className="mb-4 flex items-baseline gap-3">
                <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink">
                  {g.label}
                </h3>
                <p className="text-xs text-muted-foreground">{g.blurb}</p>
              </Reveal>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {personasIn(g.id).map((p, i) => (
                  <li key={p.slug}>
                    <Reveal delay={i * 0.05} className="h-full">
                      <SeatCard persona={p} current={p.slug === persona.slug} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeatCard({ persona, current }: { persona: Persona; current: boolean }) {
  const Icon = persona.icon;
  const body = (
    <>
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          current ? "bg-brand-blue text-white" : "bg-ink text-background group-hover:bg-brand-blue",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-ink">
          {persona.name}
          {current && (
            <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 font-sans text-[0.6rem] font-bold uppercase tracking-[0.1em] text-brand-blue">
              You&rsquo;re here
            </span>
          )}
        </p>
        <p className="mt-1 text-sm leading-snug text-muted-foreground">{persona.tagline}</p>
      </div>
      {!current && (
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-ink" />
      )}
    </>
  );

  if (current) {
    return (
      <div
        aria-current="page"
        className="flex h-full items-start gap-4 rounded-2xl border border-brand-blue/35 bg-brand-blue/[0.04] p-5 ring-1 ring-brand-blue/15"
      >
        {body}
      </div>
    );
  }
  return (
    <Link
      to="/use-cases/$slug"
      params={{ slug: persona.slug }}
      className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:shadow-elevation-lg"
    >
      {body}
    </Link>
  );
}

/* ---------- 9. FAQ ---------- */

export function PersonaFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <Heading
          id="faq-title"
          eyebrow="FAQ"
          title={`Questions ${persona.nameLower} ask first`}
          intro={`The things worth knowing before you run Rankbox as ${withArticle(persona.role)}.`}
        />
        <Reveal delay={0.08} className="mt-14">
          <Accordion
            type="single"
            collapsible
            className="divide-y divide-border rounded-2xl border border-border bg-card px-5"
          >
            {persona.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Questions about pricing or setup?{" "}
          <a
            href="/#faq"
            className="font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
          >
            Read the full FAQ
          </a>
        </p>
      </div>
    </section>
  );
}

/* ---------- 10. Closing CTA ---------- */

export function PersonaCTA({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;
  return (
    <section aria-labelledby="cta-title" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-gridlines opacity-[0.07]" />
            <div className="relative">
              <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-blue shadow-elevation">
                <Icon className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <h2
                id="cta-title"
                className="font-display mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-background sm:text-4xl"
              >
                {persona.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-background/70">
                {persona.ctaBody}
              </p>
              <div className="mt-8 flex justify-center">
                <UrlForm url={url} onChange={setUrl} />
              </div>
              <p className="mt-3 text-sm text-background/60">
                No credit card required · Free {TRIAL_DAYS}-day trial · Cancel anytime
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
