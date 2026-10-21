/**
 * The sections of /use-cases/seo-agencies, in the landing page's frame:
 * hairline rails, a hairline over every band, blank bands between sections,
 * white throughout. Every line of copy is the persona's entry in
 * data/personas.ts, read from the `persona` prop; these only decide how it
 * is set, and add the short structural labels (pills, captions) around it.
 *
 * The order follows an agency's questions rather than the old template's:
 * what it does per client and who keeps what, the calls it answers, how an
 * account is onboarded, the parts that make account twenty look like account
 * one, and what it takes off the delivery cost.
 */
import { useState, type CSSProperties, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronRight,
  FileText,
  Handshake,
  HelpCircle,
  Layers,
  Mic,
  PhoneCall,
  Plus,
  Receipt,
  Route,
  UsersRound,
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
import { PERSONA_GROUPS, personasIn, type HandoffLine, type Persona } from "@/data/personas";
import { ClientDeck } from "./client-deck";
import { TINTS, type Tint } from "./clients";
import {
  CostSheet,
  KickoffPicture,
  MapPicture,
  NewAccountPeek,
  ReportPicture,
  RoutePicture,
} from "./pictures";

/* One picture per onboarding step, in the order of persona.steps. */
const STEP_PICTURES = [KickoffPicture, MapPicture, RoutePicture, ReportPicture];

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

const H2 =
  "font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]";

/* ---------- Hero ---------- */

/* The one split hero on the site's agency page: the promise on the left, the
   client book on the right, on a soft blue panel ruled like a planning
   board. The four facts close the frame underneath. */
const SPEC_ICONS = [Layers, UsersRound, FileText, Mic];

export function AgencyHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="persona-title" className="relative bg-white">
      <div className={cn("mx-auto grid max-w-6xl border-x lg:grid-cols-2", LINE)}>
        <div className="flex min-w-0 flex-col justify-center px-5 pb-12 pt-7 sm:px-8 sm:pb-14 lg:py-14 lg:pl-12 lg:pr-6 xl:pl-14">
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

          <div className="mt-9 motion-safe:animate-hero-rise lg:mt-12" style={rise(0.05)}>
            <Pill icon={Icon}>{persona.eyebrow}</Pill>
          </div>

          <h1
            id="persona-title"
            className="mt-5 font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.55rem] sm:text-[3.3rem] lg:text-[3.1rem] xl:text-[3.55rem]"
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
            className="mt-5 max-w-[34rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
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
          className="min-w-0 px-3 pb-3 motion-safe:animate-hero-rise lg:py-3 lg:pl-0 lg:pr-3"
          style={rise(0.38)}
        >
          <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#eef4fe] px-4 py-8 sm:px-10 sm:py-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(24,119,242,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,119,242,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_30%,transparent_100%)]"
            />
            <ClientDeck className="relative max-w-[27rem]" />
          </div>
        </div>
      </div>

      {/* The facts band. Top hairline only: the spacer under it draws the
          line beneath. */}
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.46)}>
        <dl
          aria-label={`Rankbox for ${persona.name} at a glance`}
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-2 gap-px border-x lg:grid-cols-4",
            LINE,
            LINE_FILL,
          )}
        >
          {persona.specs.map((s, i) => {
            const SpecIcon = SPEC_ICONS[i % SPEC_ICONS.length];
            return (
              <div
                key={s.label}
                className="flex flex-col-reverse justify-end bg-white px-5 py-6 sm:px-7 sm:py-7"
              >
                <dt className="mt-1.5 text-balance text-[0.8rem] leading-snug text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="flex items-center gap-2.5 font-display text-[1.35rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.55rem]">
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-brand-blue"
                  >
                    <SpecIcon className="h-3.5 w-3.5" />
                  </span>
                  {s.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

/* ---------- Per client, and who keeps what ---------- */

function HandoffColumn({
  ours,
  title,
  lines,
  icon: Icon,
}: {
  ours: boolean;
  title: string;
  lines: HandoffLine[];
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className={ours ? "bg-white" : "bg-[color-mix(in_oklab,var(--cta)_4%,white)]"}>
      <Reveal delay={ours ? 0 : 0.06} className="h-full px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              ours
                ? "bg-cta text-white"
                : "border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-[1.15rem] font-medium tracking-tight text-ink">{title}</h3>
        </div>
        <ol className={cn("mt-6 divide-y border-t", LINE, "divide-ink/[0.07]")}>
          {lines.map((l, i) => (
            <li key={l.label} className="grid grid-cols-[2.25rem_1fr] py-4">
              <span
                className={cn(
                  "pt-0.5 text-[0.75rem] font-medium tabular-nums",
                  ours ? "text-muted-foreground" : "text-cta",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-[0.95rem] font-semibold text-ink">{l.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{l.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}

function RankboxGlyph({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex", className)}>
      <Mark className="h-full w-full text-white" />
    </span>
  );
}

export function AgencyBrief({ persona }: { persona: Persona }) {
  const { handoff } = persona;
  return (
    <section aria-labelledby="brief-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Handshake} className="w-fit">
              Division of labor
            </Pill>
            <h2 id="brief-title" className={cn("mt-5", H2)}>
              The engine runs it.{" "}
              <span className="block">
                <Accent>You run the account.</Accent>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="flex items-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <p className="text-[1.05rem] leading-relaxed text-ink/80 sm:text-[1.15rem]">
              {persona.shortAnswer}
            </p>
          </Reveal>
        </div>
      </Band>
      <Band>
        <div className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          <HandoffColumn ours title={handoff.runsTitle} lines={handoff.runs} icon={RankboxGlyph} />
          <HandoffColumn
            ours={false}
            title={handoff.keepsTitle}
            lines={handoff.keeps}
            icon={persona.icon}
          />
        </div>
      </Band>
    </section>
  );
}

/* ---------- The calls ---------- */

export function AgencyCalls({ persona }: { persona: Persona }) {
  return (
    <section aria-label={persona.painsTitle}>
      <Spacer />
      <SectionHead
        icon={PhoneCall}
        eyebrow="On the client call"
        title={accented(persona.painsTitle, 2)}
        subtitle={persona.painsIntro}
      />
      <Band>
        <ul className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          {persona.pains.map((p, i) => (
            <li key={p.pain} className="bg-white">
              <Reveal delay={(i % 2) * 0.06} className="flex h-full flex-col p-6 sm:p-8 lg:p-10">
                <span className="text-[0.72rem] font-medium tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 max-w-md font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.45rem]">
                  {p.pain}
                </h3>
                <div className="mt-auto pt-6">
                  <div className="flex gap-3 rounded-xl border border-cta/15 bg-[color-mix(in_oklab,var(--cta)_5%,white)] p-4">
                    <span
                      aria-hidden
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta text-white"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                    </span>
                    <p className="text-[0.9rem] leading-relaxed text-ink/80">
                      <span className="font-semibold text-ink">What changes: </span>
                      {p.fix}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}

/* ---------- Onboarding ---------- */

export function AgencyOnboarding({ persona }: { persona: Persona }) {
  return (
    <section aria-label={persona.workflowTitle}>
      <Spacer />
      <SectionHead
        icon={Route}
        eyebrow="Account setup"
        title={accented(persona.workflowTitle, 2)}
        subtitle={persona.workflowIntro}
      />
      <Band>
        <ol className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-4", LINE_FILL)}>
          {persona.steps.map((s, i) => {
            const Picture = STEP_PICTURES[i];
            return (
              <li key={s.title} className="bg-white">
                <Reveal delay={i * 0.06} className="flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-cta shadow-[0_0_0_4px_var(--cta-soft)]" />
                    <span className="text-[0.75rem] font-semibold text-cta">{s.when}</span>
                    <span aria-hidden className="h-px flex-1 bg-ink/[0.08]" />
                    <span className="text-[0.7rem] font-medium tabular-nums text-muted-foreground">
                      {i + 1}/{persona.steps.length}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  {Picture && (
                    <div
                      aria-hidden
                      className={cn(
                        "mt-6 flex flex-1 flex-col justify-end rounded-xl border border-ink/[0.06] p-3",
                        PANEL,
                      )}
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
      <Band inner="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <a href="/auth" className={SOLID_BUTTON}>
          Onboard your first client
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
      </Band>
    </section>
  );
}

/* ---------- The parts that repeat ---------- */

const PICK_TINTS: Tint[] = ["blue", "violet", "rose", "green"];

export function AgencyPicks({ persona }: { persona: Persona }) {
  return (
    <section aria-label={persona.picksTitle}>
      <Spacer />
      <SectionHead
        icon={Boxes}
        eyebrow="Account one to account twenty"
        title={accented(persona.picksTitle, 2)}
        subtitle={persona.picksIntro}
      />
      <Band>
        <ul className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-4", LINE_FILL)}>
          {persona.picks.map((pick, i) => {
            const f = getFeature(pick.featureSlug);
            if (!f) return null;
            const FIcon = f.icon;
            const tint = TINTS[PICK_TINTS[i % PICK_TINTS.length]];
            return (
              <li key={pick.featureSlug} className="bg-white">
                <Reveal delay={(i % 4) * 0.05} className="h-full">
                  <Link
                    to="/features/$slug"
                    params={{ slug: f.slug }}
                    className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        aria-hidden
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ background: tint.tile, color: tint.ink }}
                      >
                        <FIcon className="h-4 w-4" />
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                      />
                    </div>
                    <h3 className="mt-5 text-[1rem] font-semibold tracking-tight text-ink">
                      {f.name}
                    </h3>
                    <p className="mt-1 text-[0.82rem] leading-relaxed text-muted-foreground">
                      {f.tagline}
                    </p>
                    <p
                      className={cn(
                        "mt-5 border-t pt-4 text-[0.88rem] leading-relaxed text-ink/80",
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

/* ---------- Delivery cost ---------- */

export function AgencyCost({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="cost-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <Pill icon={Receipt} className="w-fit">
              The retainer, itemized
            </Pill>
            <h2 id="cost-title" className={cn("mt-5", H2)}>
              {accented(persona.stackTitle, 2)}
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
              {persona.stackIntro}
            </p>
            <p
              className={cn(
                "mt-6 max-w-md border-l-2 border-cta pl-4 text-[0.92rem] leading-relaxed text-ink/80",
              )}
            >
              {persona.stackNote}
            </p>
            <a href="#pricing" className={cn(GHOST_BUTTON, "group/btn mt-7 w-fit")}>
              See the plans
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </a>
          </Reveal>
          <div
            className={cn(
              "flex items-center justify-center border-t px-4 py-10 sm:px-10 sm:py-14 lg:border-l lg:border-t-0",
              LINE,
              PANEL,
            )}
          >
            <Reveal delay={0.08} className="flex w-full justify-center">
              <CostSheet stack={persona.stack} />
            </Reveal>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function AgencyFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className={cn("border-b lg:border-b-0 lg:border-r", LINE)}>
            <Reveal className="px-6 py-10 sm:px-10 lg:sticky lg:top-24 lg:px-12 lg:py-14">
              <Pill icon={HelpCircle} className="w-fit">
                FAQ
              </Pill>
              <h2 id="faq-title" className={cn("mt-5", H2)}>
                Before it goes <Accent>on the retainer</Accent>
              </h2>
              <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
                What {persona.nameLower} ask before running client accounts through Rankbox.
              </p>
              <a href="/#faq" className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
                Read the full FAQ
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </a>
            </Reveal>
          </div>

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

/* ---------- The other use cases ---------- */

/* Most of an agency's clients sit in one of the other five seats, so the
   links read as "how it looks from their side". Hairline cells that each
   draw their own right and bottom edge, clipped by the rails, so no empty
   cell ever shows the grey fill. */
export function AgencyOtherSeats({ persona }: { persona: Persona }) {
  const others = PERSONA_GROUPS.flatMap((g) =>
    personasIn(g.id)
      .filter((p) => p.slug !== persona.slug)
      .map((p) => ({ p, group: g.label })),
  );
  return (
    <section aria-labelledby="seats-title">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <Pill icon={UsersRound}>Other use cases</Pill>
        <h2
          id="seats-title"
          className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          The same engine, <Accent>from your clients&rsquo; side</Accent>
        </h2>
        <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
          Your clients sit in seats like these. Each page is written to that reader, if you want to
          see Rankbox the way they will.
        </p>
      </Band>
      <Band>
        <div className="overflow-hidden">
          <ul className="-mb-px -mr-px grid lg:grid-cols-5">
            {others.map(({ p, group }) => {
              const PIcon = p.icon;
              return (
                <li key={p.slug} className={cn("border-b border-r", LINE)}>
                  <Link
                    to="/use-cases/$slug"
                    params={{ slug: p.slug }}
                    className="group flex h-full items-start gap-4 p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-10 lg:flex-col lg:gap-0 lg:p-6"
                  >
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue"
                    >
                      <PIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 lg:mt-5">
                      <span className="block text-[0.68rem] font-medium text-muted-foreground">
                        {group}
                      </span>
                      <span className="mt-0.5 block text-[0.95rem] font-semibold tracking-tight text-ink">
                        {p.name}
                      </span>
                      <span className="mt-1 block text-[0.82rem] leading-relaxed text-muted-foreground">
                        {p.tagline}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue lg:hidden"
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

/* ---------- Closing ---------- */

/* Blue inside the rails (--cta, so white body text passes AA), the white
   mark dithered behind, the URL field on a white card, and the next client
   account rising from the band's foot on the right. */
export function AgencyCTA({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_90%_at_30%_50%,#000_35%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>

        <div className="relative grid items-end lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="px-6 pb-12 pt-14 sm:px-10 sm:pt-16 lg:py-16 lg:pl-12 lg:pr-6">
            <h2
              id="cta-title"
              className="max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              {persona.ctaTitle}
            </h2>
            <p className="mt-4 max-w-lg text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {persona.ctaBody}
            </p>
            <div className="mt-8 max-w-[34rem] rounded-xl bg-white p-2 shadow-[0_1px_2px_rgba(4,24,72,0.2),0_16px_40px_-16px_rgba(4,24,72,0.55)]">
              <UrlForm url={url} onChange={setUrl} variant="split" />
            </div>
            <p className="mt-3.5 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>

          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto h-[15rem] w-full max-w-md overflow-hidden px-6 sm:h-[15.5rem] sm:px-0 lg:mr-12 lg:mt-14 lg:h-[16rem]"
          >
            <div aria-hidden>
              <NewAccountPeek />
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
