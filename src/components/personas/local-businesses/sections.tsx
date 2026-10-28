/**
 * The sections of /use-cases/local-businesses, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections,
 * white throughout. All copy comes from the persona's entry in
 * data/personas.ts; these only decide how it's set.
 *
 * The page is written to an owner with no time: it opens on their working
 * day, shows what would get written for a shop like theirs, then answers the
 * owner's questions in the order they come up: why the site went quiet, how
 * much of my time, what's still mine, what I'm not paying for.
 */
import { useState, type ComponentType, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronRight,
  Coffee,
  FileText,
  HelpCircle,
  LayoutTemplate,
  Link2,
  MapPin,
  MessageCircleQuestion,
  Moon,
  PenLine,
  Plus,
  Receipt,
  Search,
  Send,
  Sparkles,
  SplitSquareHorizontal,
  Timer,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
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
import { IntegrationGlyph } from "@/components/integrations/visuals";
import { getFeature } from "@/data/features";
import { getIntegration } from "@/data/integrations";
import { PLAN, TRIAL_CTA, formatUsd } from "@/data/pricing";
import { PERSONA_GROUPS, personasIn, withArticle, type Persona } from "@/data/personas";
import { DayScene } from "./day-scene";
import {
  ConnectSitePicture,
  PasteSitePicture,
  PickTopicsPicture,
  PostPeek,
  QuietBlog,
  ReadOrNotPicture,
  TopicMapWindow,
} from "./pictures";

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

/* ---------- Sample questions, shared by the hero and the closing band ---------- */

/** The day's questions for the hero, one per day, off the sample topic map. */
function dayQuestions(persona: Persona): string[] {
  const clusters = persona.topics?.clusters ?? [];
  const howTo = clusters.find((c) => /how/i.test(c.intent)) ?? clusters[0];
  const firsts = clusters.filter((c) => c !== howTo).map((c) => c.questions[0]);
  return [...(howTo ? [howTo.questions[0]] : []), ...firsts].filter(Boolean);
}

/* ---------- Hero ---------- */

const SPEC_ICONS: Icon[] = [LayoutTemplate, Timer, FileText, CalendarCheck];

/* Split rather than centred: the owner's day is the picture, so it takes
   the right half, on a panel that warms from dawn into daylight. */
export function LocalHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="local-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.04fr_1fr]">
          <div className="flex flex-col px-5 pb-12 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-16 lg:pl-12 lg:pr-6 lg:pt-9 xl:pl-14">
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

            <div className="mt-10 flex flex-1 flex-col justify-center sm:mt-12 lg:mt-14">
              <div className="motion-safe:animate-hero-rise" style={rise(0.05)}>
                <Pill icon={Icon}>{persona.eyebrow}</Pill>
              </div>

              <h1
                id="local-title"
                className="mt-6 font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.4rem] lg:text-[3.15rem] xl:text-[3.55rem]"
                style={rise(0.12)}
              >
                <span className="block">{persona.headline.lead}</span>{" "}
                <span className="mt-[0.04em] inline-flex items-center gap-[0.22em] whitespace-nowrap">
                  <span
                    aria-hidden
                    className="inline-flex h-[0.84em] w-[0.84em] shrink-0 items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                  >
                    <Icon className="h-[48%] w-[48%] text-brand-blue" strokeWidth={2.4} />
                  </span>
                  <span className="font-bold text-brand-blue">{persona.headline.accent}</span>
                </span>
              </h1>

              <p
                className="mt-6 max-w-[34rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
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
          </div>

          {/* Flush to the right rail, with a hairline of white around it. */}
          <div
            className="px-3 pb-3 motion-safe:animate-hero-rise lg:py-3 lg:pl-0 lg:pr-3"
            style={rise(0.28)}
          >
            <DayScene questions={dayQuestions(persona)} />
          </div>
        </div>
      </div>

      {/* The facts band. Top hairline only: the band under it draws the next. */}
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.42)}>
        <dl
          aria-label={`Rankbox for ${persona.nameLower} at a glance`}
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-1 gap-px border-x min-[480px]:grid-cols-2 lg:grid-cols-4",
            LINE,
            LINE_FILL,
          )}
        >
          {persona.specs.map((s, i) => {
            const SpecIcon = SPEC_ICONS[i % SPEC_ICONS.length];
            return (
              <div
                key={s.label}
                className="flex items-start gap-3.5 bg-white px-5 py-5 sm:px-7 sm:py-6"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-cta">
                  <SpecIcon className="h-4 w-4" />
                </span>
                <div className="flex min-w-0 flex-col-reverse">
                  <dt className="mt-1 text-[0.8rem] leading-snug text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="font-display text-[1.3rem] font-medium leading-none tracking-[-0.02em] text-ink">
                    {s.value}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

/* ---------- The short answer ---------- */

/* The quotable paragraph, set as the page's thesis: what an answer engine
   would lift, and what a busy owner can read in one go. */
export function LocalShortAnswer({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="short-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Coffee} className="w-fit">
              In one paragraph
            </Pill>
            <h2
              id="short-title"
              className="mt-5 font-display text-[1.75rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            >
              What Rankbox is, <Accent>for {withArticle(persona.role)}</Accent>
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <p className="border-l-2 border-cta/70 pl-5 text-[1.05rem] leading-[1.75] text-ink/85 sm:text-[1.14rem]">
              {persona.shortAnswer}
            </p>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The sample topic map ---------- */

export function LocalTopics({ persona }: { persona: Persona }) {
  const topics = persona.topics;
  if (!topics) return null;
  return (
    <section id="topics" aria-label={topics.title} className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={MessageCircleQuestion}
        eyebrow="Questions from the counter"
        title={accented(topics.title, 3)}
        subtitle={topics.intro}
      />
      <Band inner={PANEL}>
        <div className="px-3 py-10 sm:px-8 sm:py-14 lg:px-12">
          <Reveal y={24}>
            <TopicMapWindow topics={topics} />
          </Reveal>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-center text-[0.8rem] leading-relaxed text-muted-foreground">
            {topics.note}
          </p>
        </div>
      </Band>
      <Band>
        <div
          className={cn("grid gap-px sm:grid-cols-3 lg:grid-cols-[13rem_1fr_1fr_1fr]", LINE_FILL)}
        >
          <div className="flex items-center bg-white px-6 py-6 sm:col-span-3 lg:col-span-1 lg:px-8">
            <h3 className="text-[1rem] font-semibold leading-snug tracking-tight text-ink">
              {topics.platformsTitle}
            </h3>
          </div>
          {topics.platforms.map(({ slug, why }) => {
            const integration = getIntegration(slug);
            if (!integration) return null;
            return (
              <div key={slug} className="bg-white">
                <Link
                  to="/integrations/$slug"
                  params={{ slug }}
                  className="group flex h-full items-start gap-3.5 p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)]"
                >
                  <IntegrationGlyph integration={integration} className="h-9 w-9" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2 text-[0.95rem] font-semibold text-ink">
                      {integration.name}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </span>
                    <span className="mt-1 block text-[0.85rem] leading-snug text-muted-foreground">
                      {why}
                    </span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Why the website went quiet ---------- */

export function LocalPains({ persona }: { persona: Persona }) {
  const clusters = persona.topics?.clusters ?? [];
  const titles = [1, 0, 3]
    .map((i) => clusters[i]?.questions[1])
    .filter((t): t is string => Boolean(t));

  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Moon}
        eyebrow="Since launch week"
        title={accented(persona.painsTitle, 2)}
        subtitle={persona.painsIntro}
      />
      <Band>
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className={cn("border-b p-3 lg:border-b-0 lg:border-r", LINE)}>
            <div className={cn("flex h-full items-center px-4 py-10 sm:px-10 sm:py-12", PANEL)}>
              <QuietBlog titles={titles} />
            </div>
          </div>
          <ol className="divide-y divide-ink/[0.07]">
            {persona.pains.map((p, i) => (
              <li key={p.pain}>
                <Reveal delay={i * 0.05} className="px-6 py-6 sm:px-10 sm:py-7">
                  <p className="flex gap-3 text-[0.92rem] leading-snug text-muted-foreground">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]/55" />
                    {p.pain}
                  </p>
                  <p className="mt-3 flex gap-3 text-[0.98rem] leading-snug text-ink">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {p.fix}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- What it asks of you ---------- */

/* A time ruler across the top: minute one, minute ten, day one, any time.
   The ticks run on from cell to cell, so the four steps read as one clock. */
export function LocalWorkflow({ persona }: { persona: Persona }) {
  const clusters = persona.topics?.clusters ?? [];
  const yes = clusters[0]?.questions[0] ?? "";
  const no = clusters[1]?.questions[2] ?? "";
  const pictures = [
    <PasteSitePicture key="paste" />,
    yes && no ? <PickTopicsPicture key="pick" yes={yes} no={no} /> : null,
    <ConnectSitePicture key="connect" />,
    <ReadOrNotPicture key="read" />,
  ];

  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Timer}
        eyebrow="Your time, counted"
        title={accented(persona.workflowTitle, 2)}
        subtitle={persona.workflowIntro}
      />
      <Band>
        <ol className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-4", LINE_FILL)}>
          {persona.steps.map((s, i) => (
            <li key={s.title} className="flex flex-col bg-white">
              <div
                className={cn(
                  "relative flex h-12 items-center gap-2.5 border-b px-6 sm:px-7",
                  LINE,
                )}
              >
                <span className="h-2 w-2 rounded-full bg-cta shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_14%,transparent)]" />
                <span className="text-[0.78rem] font-semibold tabular-nums text-cta">{s.when}</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1.5 bg-[repeating-linear-gradient(to_right,rgba(16,24,40,0.14)_0_1px,transparent_1px_10px)]"
                />
              </div>
              <Reveal delay={i * 0.06} className="flex flex-1 flex-col p-6 sm:p-7">
                <span className="text-[0.7rem] font-medium tabular-nums text-muted-foreground">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 text-[1.05rem] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                {pictures[i] && <div className="mt-auto pt-6">{pictures[i]}</div>}
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
      <Band inner="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <a href="/auth" className={SOLID_BUTTON}>
          Start with your website
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
      </Band>
    </section>
  );
}

/* ---------- What runs, and what stays yours ---------- */

const RUN_ICONS: Icon[] = [Search, PenLine, Send, Link2];
const KEEP_ICONS: Icon[] = [MapPin, Users, BadgeCheck, Coffee];

function LaneHead({ ours, title }: { ours: boolean; title: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-6 py-5 sm:px-8",
        ours ? "bg-[color-mix(in_oklab,var(--cta)_5%,white)]" : "bg-white",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          ours ? "bg-cta text-white" : "border border-ink/[0.08] bg-white text-ink/70",
        )}
      >
        {ours ? <Mark className="h-4 w-4" /> : <Users className="h-4 w-4" />}
      </span>
      <h3
        className={cn(
          "text-[1.05rem] font-semibold tracking-tight",
          ours ? "text-cta" : "text-ink",
        )}
      >
        {title}
      </h3>
      <span
        aria-hidden
        className={cn("ml-auto h-1.5 w-1.5 rounded-full", ours ? "bg-cta" : "bg-ink/35")}
      />
    </div>
  );
}

function LaneRow({
  icon: RowIcon,
  label,
  detail,
  ours,
  delay,
}: {
  icon: Icon;
  label: string;
  detail: string;
  ours: boolean;
  delay: number;
}) {
  return (
    <div className="bg-white">
      <Reveal delay={delay} className="flex h-full gap-4 px-6 py-5 sm:px-8 sm:py-6">
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            ours ? "bg-cta-soft text-cta" : "bg-ink/[0.04] text-ink/60",
          )}
        >
          <RowIcon className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[0.95rem] font-semibold text-ink">{label}</span>
          <span className="mt-1 block text-[0.88rem] leading-relaxed text-muted-foreground">
            {detail}
          </span>
        </span>
      </Reveal>
    </div>
  );
}

export function LocalHandoff({ persona }: { persona: Persona }) {
  const { handoff } = persona;
  const rows = Math.max(handoff.runs.length, handoff.keeps.length) + 1;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={SplitSquareHorizontal}
        eyebrow="Who does what"
        title={
          <>
            What it handles, <Accent>what stays yours</Accent>
          </>
        }
      />
      <Band>
        {/* Two lanes, as in the day above: Rankbox's in blue, yours in grey.
            Column-first on wide screens so each row pairs with its opposite. */}
        <div
          className={cn(
            "grid gap-px lg:grid-flow-col lg:grid-cols-2 lg:[grid-template-rows:repeat(var(--rows),auto)]",
            LINE_FILL,
          )}
          style={{ "--rows": rows } as CSSProperties}
        >
          <LaneHead ours title={handoff.runsTitle} />
          {handoff.runs.map((l, i) => (
            <LaneRow
              key={l.label}
              ours
              icon={RUN_ICONS[i % RUN_ICONS.length]}
              label={l.label}
              detail={l.detail}
              delay={i * 0.04}
            />
          ))}
          <LaneHead ours={false} title={handoff.keepsTitle} />
          {handoff.keeps.map((l, i) => (
            <LaneRow
              key={l.label}
              ours={false}
              icon={KEEP_ICONS[i % KEEP_ICONS.length]}
              label={l.label}
              detail={l.detail}
              delay={0.08 + i * 0.04}
            />
          ))}
        </div>
      </Band>
    </section>
  );
}

/* ---------- What you don't have to hire ---------- */

/* A till receipt, because that's the paper a shop owner reads: the usual
   ways to get a blog, crossed off with no price beside them, and the one
   line that's left. */
export function LocalStack({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Receipt}
        eyebrow="Off the payroll"
        title={accented(persona.stackTitle, 3)}
        subtitle={persona.stackIntro}
      />
      <Band inner={PANEL}>
        <div className="px-4 py-12 sm:py-16">
          <Reveal className="mx-auto max-w-[31rem] [filter:drop-shadow(0_1px_1px_rgba(16,24,40,0.06))_drop-shadow(0_20px_28px_rgba(16,24,40,0.1))]">
            <div className="rounded-t-xl bg-white px-6 pb-6 pt-7 sm:px-8">
              <p className="text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Getting a blog written
              </p>
              <ul className="mt-5 divide-y divide-dashed divide-ink/[0.12] border-y border-dashed border-ink/[0.12]">
                {persona.stack.map((s) => (
                  <li key={s.label} className="flex items-start justify-between gap-4 py-3.5">
                    <span className="min-w-0">
                      <span className="block text-[0.92rem] font-medium text-ink/70 line-through decoration-ink/35 decoration-1">
                        {s.label}
                      </span>
                      <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted-foreground">
                        {s.detail}
                      </span>
                    </span>
                    <span className="mt-0.5 shrink-0 rounded-md bg-ink/[0.04] px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                      Not needed
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-4 pt-5">
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta text-white">
                    <Mark className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[0.95rem] font-semibold text-ink">
                      Rankbox {PLAN.name}
                    </span>
                    <span className="block text-[0.78rem] text-muted-foreground">
                      {PLAN.articlesPerMonth} articles a month
                    </span>
                  </span>
                </span>
                <span className="font-display text-[1.4rem] font-medium tracking-[-0.02em] text-ink tabular-nums">
                  {formatUsd(PLAN.monthly)}
                  <span className="text-[0.8rem] font-normal tracking-normal text-muted-foreground">
                    /mo
                  </span>
                </span>
              </div>
              <p className="mt-5 border-t border-dashed border-ink/[0.12] pt-4 text-center text-[0.8rem] leading-relaxed text-muted-foreground">
                {persona.stackNote}
              </p>
            </div>
            {/* The torn edge. */}
            <svg aria-hidden className="block h-2.5 w-full" preserveAspectRatio="none">
              <defs>
                <pattern id="lb-receipt-edge" width="14" height="10" patternUnits="userSpaceOnUse">
                  <path d="M0 0 L7 10 L14 0 Z" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="10" fill="url(#lb-receipt-edge)" />
            </svg>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The parts that matter ---------- */

const PICK_TINTS = [
  { tile: "#dbe8fd", ink: "#1877f2" },
  { tile: "#e3ddfb", ink: "#7c3aed" },
  { tile: "#d6efdf", ink: "#16a34a" },
  { tile: "#fbe7c4", ink: "#d97706" },
] as const;

export function LocalPicks({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Sparkles}
        eyebrow="Four that carry the load"
        title={accented(persona.picksTitle, 3)}
        subtitle={persona.picksIntro}
      />
      <Band>
        <ul className={cn("grid gap-px sm:grid-cols-2", LINE_FILL)}>
          {persona.picks.map((p, i) => {
            const f = getFeature(p.featureSlug);
            if (!f) return null;
            const FeatureIcon = f.icon;
            const tint = PICK_TINTS[i % PICK_TINTS.length];
            return (
              <li key={p.featureSlug} className="bg-white">
                <Reveal delay={(i % 2) * 0.06} className="h-full">
                  <Link
                    to="/features/$slug"
                    params={{ slug: p.featureSlug }}
                    className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:p-8"
                  >
                    <span className="flex items-center justify-between">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ background: tint.tile, color: tint.ink }}
                      >
                        <FeatureIcon className="h-4 w-4" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </span>
                    <span className="mt-5 font-display text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-ink">
                      {f.name}
                    </span>
                    <span className="mt-2 max-w-md text-[0.92rem] leading-relaxed text-muted-foreground">
                      {p.why}
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

/* ---------- The other use cases ---------- */

/* Both groups, this page marked rather than dropped, each row led by its
   group so the grid has no empty cell at any width. */
export function LocalOtherPages({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="flex flex-col gap-5 px-6 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-10 lg:px-12">
        <div>
          <Pill icon={Users}>Other use cases</Pill>
          <h2
            id="others-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Not {withArticle(persona.role)}? <Accent>Find your page</Accent>
          </h2>
        </div>
        <Link to="/use-cases" className={cn(GHOST_BUTTON, "group/btn w-fit shrink-0")}>
          All use cases
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <div
          className={cn("grid gap-px sm:grid-cols-3 lg:grid-cols-[11rem_1fr_1fr_1fr]", LINE_FILL)}
        >
          {PERSONA_GROUPS.flatMap((g) => [
            <div
              key={g.id}
              className="flex flex-col justify-center bg-white px-6 py-5 sm:col-span-3 lg:col-span-1 lg:px-8"
            >
              <p className="text-[0.85rem] font-semibold text-ink">{g.label}</p>
              <p className="mt-0.5 text-[0.75rem] leading-snug text-muted-foreground">{g.blurb}</p>
            </div>,
            ...personasIn(g.id).map((p) => {
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
                    <span className="flex items-center gap-2 text-[0.92rem] font-semibold text-ink">
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
              return (
                <div key={p.slug} className="bg-white">
                  {current ? (
                    <div
                      aria-current="page"
                      className="flex h-full items-start gap-3.5 bg-[color-mix(in_oklab,var(--cta)_5%,white)] p-5 sm:p-6"
                    >
                      {body}
                    </div>
                  ) : (
                    <Link
                      to="/use-cases/$slug"
                      params={{ slug: p.slug }}
                      className="group flex h-full items-start gap-3.5 p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:p-6"
                    >
                      {body}
                    </Link>
                  )}
                </div>
              );
            }),
          ])}
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function LocalFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" className="scroll-mt-16">
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
              Before you start
            </Pill>
            <h2 className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
              Questions {persona.nameLower} <Accent>ask first</Accent>
            </h2>
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

/* The landing's closing band: --cta blue inside the rails (so white body
   text passes AA), the white mark dithered behind, one button, and the day's
   post rising from the band's foot as its own page on your site. */
export function LocalCTA({ persona }: { persona: Persona }) {
  const Icon = persona.icon;
  const title = dayQuestions(persona)[0];
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

          {title && (
            <Reveal
              delay={0.12}
              y={40}
              className="mx-auto mt-12 h-[11.5rem] max-w-xl overflow-hidden sm:mt-14 sm:h-[13rem]"
            >
              <PostPeek title={title} />
            </Reveal>
          )}
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
