/**
 * The sections of /use-cases, in the landing page's frame: hairline rails, a
 * hairline over every band, blank bands between sections, white throughout.
 *
 * The page is a directory, so the seats come straight after the hero: a
 * reader who knows where they sit clicks through, one who doesn't reads on to
 * how the pages are written and what the product is in one line. Every card
 * is built from the persona's own entry in data/personas.ts.
 */
import { useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  ChevronRight,
  Compass,
  LayoutGrid,
  NotebookPen,
  Quote,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import {
  Accent,
  Band,
  GHOST_BUTTON,
  LINE,
  LINE_FILL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { PERSONAS, PERSONA_GROUPS, personasIn, type Persona } from "@/data/personas";
import { PLAN, formatUsd } from "@/data/pricing";
import { SeatHub } from "./seat-hub";
import { HandoffPreview, OneEngineDiagram, QuoteDiagram, SeatsPeek, SplitDiagram } from "./visuals";
import { tintFor } from "./seats";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** The claim the index makes once, rather than on every card. */
const PILLARS = [
  {
    title: "The same engine, every time",
    body: "There is one product and one plan. These pages differ in what they emphasise, never in what you get.",
  },
  {
    title: "What stays your job, stated",
    body: "Every page names the work Rankbox does not do. Strategy, approvals, and the final edit never leave your desk.",
  },
  {
    title: "No promised numbers",
    body: "We quote what the product does — articles published, platforms supported, engines tracked — not traffic we can't guarantee.",
  },
];
const PILLAR_PICTURES = [OneEngineDiagram, SplitDiagram, QuoteDiagram];

const GROUP_ICONS = { role: Briefcase, business: Store } as const;

/* ---------- Hero ---------- */

/* Split, unlike the landing's centred hero: the copy on the left, and on the
   right the engine with its six seats, on a soft blue panel inset from the
   rails. */
export function UseCasesHero() {
  const [url, setUrl] = useState("");

  return (
    <section id="top" aria-labelledby="use-cases-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1fr_1.08fr]">
          <div className="flex flex-col px-5 pb-12 pt-7 sm:px-8 sm:pb-14 sm:pt-9 lg:pb-16 lg:pl-12 lg:pr-6">
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
                <li aria-current="page" className="font-medium text-ink">
                  Use cases
                </li>
              </ol>
            </nav>

            <div className="my-auto pt-10 sm:pt-12 lg:pt-14">
              <div className="motion-safe:animate-hero-rise" style={rise(0.05)}>
                <Pill icon={Compass}>One engine · {PERSONAS.length} very different weeks</Pill>
              </div>

              <h1
                id="use-cases-title"
                className="mt-6 font-display text-[2.6rem] font-medium leading-[1.04] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.5rem] lg:text-[4rem]"
                style={rise(0.12)}
              >
                <span className="block">Who Rankbox</span> <Accent>is for</Accent>
              </h1>

              <p
                className="mt-6 max-w-[34rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
                style={rise(0.22)}
              >
                A marketer with no writers, a founder with no team, an agency with a client book. A
                store, a software product, a shop on the high street. Same engine, very different
                weeks. Find yours by the seat you sit in or the business you run.
              </p>

              <div
                className="mt-8 w-full max-w-[34rem] motion-safe:animate-hero-rise"
                style={rise(0.32)}
              >
                <UrlForm url={url} onChange={setUrl} variant="split" />
                <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
              </div>
            </div>
          </div>

          {/* The hub, flush to the right rail with a hairline of white round it. */}
          <div
            className="px-3 pb-3 motion-safe:animate-hero-rise lg:py-3 lg:pl-0 lg:pr-3"
            style={rise(0.4)}
          >
            <div className="relative flex h-full items-center justify-center overflow-hidden bg-[color-mix(in_oklab,var(--cta)_6%,white)] px-2.5 py-10 sm:px-10 sm:py-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(22,111,229,0.13)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_30%,transparent_100%)]"
              />
              <SeatHub className="relative" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- The seats ---------- */

function SeatCard({ persona }: { persona: Persona }) {
  const Icon = persona.icon;
  const tint = tintFor(persona);
  return (
    <Link
      to="/use-cases/$slug"
      params={{ slug: persona.slug }}
      className="group grid h-full gap-6 p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-8 md:grid-cols-[1fr_1.1fr] md:gap-x-10 lg:flex lg:flex-col lg:gap-0 lg:p-7"
    >
      <div className="md:col-start-1 md:row-start-1">
        <div className="flex items-center justify-between">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: tint.tile, color: tint.ink }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
        </div>
        <h4 className="mt-5 font-display text-[1.3rem] font-medium leading-tight tracking-[-0.02em] text-ink">
          Rankbox for {persona.nameLower}
        </h4>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
          {persona.tagline}
        </p>
      </div>

      <HandoffPreview
        persona={persona}
        className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-start lg:mt-6 lg:self-stretch"
      />

      <span className="inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-cta md:col-start-1 md:row-start-2 md:self-end lg:mt-auto lg:self-start lg:pt-6">
        See the full page
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function SeatList() {
  return (
    <section aria-labelledby="list-title">
      <Spacer />
      <SectionHead
        icon={LayoutGrid}
        eyebrow="Pick your seat"
        title={
          <span id="list-title">
            Which of these is <Accent>your week?</Accent>
          </span>
        }
        subtitle="Each page runs the same four questions: what you hand over, what stays yours, how it lands in your week, and what it takes off the invoice. Business pages add what it would write for you, and where it would publish."
      />

      {PERSONA_GROUPS.map((g, gi) => {
        const GroupIcon = GROUP_ICONS[g.id];
        const seats = personasIn(g.id);
        return (
          <div key={g.id} role="group" aria-labelledby={`group-${g.id}`}>
            {/* The group's own header row, ruled off above its cards. */}
            <Band inner="flex flex-wrap items-center gap-x-3 gap-y-1 px-6 py-4 sm:px-8">
              <span className="text-[0.72rem] font-medium tabular-nums text-muted-foreground">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
                <GroupIcon className="h-3.5 w-3.5" />
              </span>
              <h3 id={`group-${g.id}`} className="text-[0.98rem] font-semibold text-ink">
                {g.label}
              </h3>
              <p className="text-[0.9rem] text-muted-foreground">{g.blurb}</p>
            </Band>
            <Band>
              <div className={cn("grid gap-px lg:grid-cols-3", LINE_FILL)}>
                {/* White on a still wrapper, so a card fading in never shows
                    the hairline fill behind it as a grey block. */}
                {seats.map((p, i) => (
                  <div key={p.slug} className="bg-white">
                    <Reveal delay={(i % 3) * 0.06} className="h-full">
                      <SeatCard persona={p} />
                    </Reveal>
                  </div>
                ))}
              </div>
            </Band>
          </div>
        );
      })}

      <Band inner="px-5 py-7 text-center">
        <p className="text-[0.9rem] text-muted-foreground">
          In a seat we haven&rsquo;t written up?{" "}
          <a
            href="/auth"
            className="font-semibold text-cta underline decoration-cta/30 underline-offset-4 transition-colors hover:decoration-cta"
          >
            Start a trial
          </a>{" "}
          — it&rsquo;s the same engine either way.
        </p>
      </Band>
    </section>
  );
}

/* ---------- How we write these ---------- */

export function Method() {
  return (
    <section aria-labelledby="method-title">
      <Spacer />
      <SectionHead
        icon={NotebookPen}
        eyebrow="How we write these"
        title={
          <span id="method-title">
            {PERSONAS.length} pages, one <Accent>honest product</Accent>
          </span>
        }
      />
      <Band>
        <ol className={cn("grid gap-px lg:grid-cols-3", LINE_FILL)}>
          {PILLARS.map((p, i) => {
            const Picture = PILLAR_PICTURES[i];
            return (
              <li key={p.title} className="bg-white">
                <Reveal delay={i * 0.06} className="flex h-full flex-col p-6 sm:p-8">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-[0.8rem] font-semibold tabular-nums text-cta">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  <div className="mt-7 flex flex-1 flex-col justify-end">
                    <div className="rounded-xl border border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-4">
                      <Picture />
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- In one line ---------- */

/* The answer for people who skim, set like the landing's FAQ: the title on
   the left, the line itself large on the right. */
export function OneLine() {
  return (
    <section aria-labelledby="summary-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Quote} className="w-fit">
              The short version
            </Pill>
            <h2
              id="summary-title"
              className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
            >
              What Rankbox is, <Accent>in one line</Accent>
            </h2>
            <Link to="/features" className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
              See how the engine works
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.06} className="flex items-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
            <p className="text-[1.12rem] leading-[1.65] tracking-[-0.01em] text-ink/85 sm:text-[1.3rem]">
              Rankbox is an AI search growth engine: it finds the questions your buyers ask ChatGPT,
              Perplexity, and Google, writes source-backed articles in your brand voice, scores them
              for search and for AI answers, publishes them to your site daily, and tracks which
              answers now cite you —{" "}
              <span className="font-semibold text-ink">
                {formatUsd(PLAN.monthly)} a month for {PLAN.articlesPerMonth} published articles on{" "}
                {PLAN.sites} site.
              </span>
            </p>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* The landing's closing band: blue inside the rails, the white mark dithered
   behind, one button, and a window rising from the band's foot. The band is
   --cta rather than brand blue so the white body text passes AA. */
export function UseCasesClosing() {
  return (
    <section aria-labelledby="closing-title">
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
              id="closing-title"
              className="mx-auto max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              Become the answer AI recommends
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              Put your growth on autopilot. Rankbox researches, writes, optimizes, and publishes
              daily articles engineered to get your brand cited by AI search and ranked on Google.
            </p>
            <a
              href="/auth"
              className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Start Growing on Autopilot
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>

          {/* The window rises from the band's foot and is cut off by it. */}
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[8.75rem] max-w-xl overflow-hidden sm:mt-14 sm:h-[9.5rem]"
          >
            <SeatsPeek />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
