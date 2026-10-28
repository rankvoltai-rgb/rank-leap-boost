/**
 * The sections of /use-cases/ecommerce, in the landing page's frame: hairline
 * rails, a hairline over every band, blank bands between sections, white
 * throughout. All copy comes from the `ecommerce` entry in data/personas.ts;
 * these only decide how it's set. The labels written here (pills, captions)
 * are structural and make no product claim of their own.
 */
import { useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CalendarClock,
  Check,
  ChevronRight,
  HelpCircle,
  Lock,
  Map as MapIcon,
  Plus,
  Receipt,
  Repeat,
  ShieldCheck,
  Store,
  Users,
  X,
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
import { TRIAL_CTA } from "@/data/pricing";
import { IntegrationGlyph } from "@/components/integrations/visuals";
import { getFeature } from "@/data/features";
import { getIntegration } from "@/data/integrations";
import { PERSONAS, PERSONA_GROUPS, withArticle, type Persona } from "@/data/personas";
import { StorefrontScene } from "./storefront-scene";
import { QuestionPeek, STAGE_TINTS, StackReceipt, StepPicture, TopicTracker } from "./pictures";

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

const H3 = "text-[1.02rem] font-semibold tracking-tight text-ink";

/* ---------- Hero ---------- */

/* Split, unlike the landing's centred lockup: the promise on the left, and on
   the right the store itself, on a soft blue panel inset from the rail by a
   hairline of white, the way the landing's feature rows hold their screens. */
export function EcommerceHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="persona-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1fr_1.04fr]">
          <div className="flex flex-col justify-center px-5 pb-10 pt-7 sm:px-10 sm:pb-14 lg:py-14 lg:pl-12 lg:pr-6">
            <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-muted-foreground">
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

            <div className="mt-8 motion-safe:animate-hero-rise sm:mt-10" style={rise(0.05)}>
              <Pill icon={Icon}>{persona.eyebrow}</Pill>
            </div>

            <h1
              id="persona-title"
              className="mt-5 font-display text-[2.35rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.4rem] lg:text-[3.3rem] xl:text-[3.45rem]"
              style={rise(0.12)}
            >
              <span className="block">{persona.headline.lead}</span>{" "}
              <span className="block font-bold text-brand-blue">{persona.headline.accent}</span>
            </h1>

            <p
              className="mt-5 max-w-[34rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
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

          <div
            className="px-3 pb-3 motion-safe:animate-hero-rise lg:py-3 lg:pl-0 lg:pr-3"
            style={rise(0.4)}
          >
            <div className="relative h-[31rem] overflow-hidden bg-[#eaf2fe] sm:h-[37rem] lg:h-full lg:min-h-[38rem]">
              {/* A faint dot grid, faded toward the edges, so the panel reads
                  as a surface rather than a flat fill. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(22,111,229,0.16)_1px,transparent_1.3px)] bg-[size:18px_18px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_30%,transparent_100%)]"
              />
              <div className="relative mx-auto h-full max-w-[36rem]">
                <StorefrontScene />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The facts band. Top hairline only: the band under it draws the next. */}
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.48)}>
        <dl
          aria-label={`Rankbox for ${persona.nameLower} at a glance`}
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-2 gap-px border-x lg:grid-cols-4",
            LINE,
            LINE_FILL,
          )}
        >
          {persona.specs.map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-white px-5 py-6 sm:px-8 sm:py-7">
              <dt className="mt-1.5 max-w-[15rem] text-[0.8rem] leading-snug text-muted-foreground">
                {s.label}
              </dt>
              <dd className="font-display text-[1.4rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.55rem]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- The short version ---------- */

/* The quotable paragraph, set large on its own band: the tagline as its
   lead-in, the answer an engine can lift whole beside it. */
export function EcommerceShortAnswer({ persona }: { persona: Persona }) {
  return (
    <section aria-label="Rankbox for online stores, in short">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12",
              LINE,
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta text-white">
              <Mark className="h-4 w-4" />
            </span>
            <p className="mt-5 max-w-xs font-display text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-ink">
              {persona.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.06} className="px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
            <p className="text-[1.05rem] leading-[1.75] text-ink/80 sm:text-[1.12rem]">
              {persona.shortAnswer}
            </p>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The sample topic map ---------- */

export function EcommerceTopics({ persona }: { persona: Persona }) {
  const topics = persona.topics;
  if (!topics) return null;
  return (
    <section id="topics" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={MapIcon}
        eyebrow="The questions around a product"
        title={accented(topics.title, 4)}
        subtitle={topics.intro}
      />
      <Band inner={PANEL}>
        <div className="px-3 py-8 sm:px-8 sm:py-12 lg:px-10">
          <Reveal y={24}>
            <TopicTracker topics={topics} />
          </Reveal>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-center text-[0.8rem] leading-relaxed text-muted-foreground">
            {topics.note}
          </p>
        </div>
      </Band>

      {/* Where the guides land: a label cell, then one cell per platform. */}
      <Band>
        <div
          className={cn("grid gap-px sm:grid-cols-3 lg:grid-cols-[1.25fr_1fr_1fr_1fr]", LINE_FILL)}
        >
          <div className="flex flex-col justify-center bg-white px-6 py-7 sm:col-span-3 sm:px-8 lg:col-span-1">
            <h3 className="font-display text-[1.25rem] font-medium leading-snug tracking-[-0.02em] text-ink">
              {topics.platformsTitle}
            </h3>
          </div>
          {topics.platforms.map(({ slug, why }) => {
            const integration = getIntegration(slug);
            if (!integration) return null;
            return (
              <Link
                key={slug}
                to="/integrations/$slug"
                params={{ slug }}
                className="group flex h-full flex-col bg-white px-6 py-7 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-7"
              >
                <span className="flex items-center justify-between">
                  <IntegrationGlyph integration={integration} className="h-9 w-9" />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                </span>
                <span className="mt-4 text-[0.95rem] font-semibold text-ink">
                  {integration.name}
                </span>
                <span className="mt-1 text-[0.85rem] leading-relaxed text-muted-foreground">
                  {why}
                </span>
              </Link>
            );
          })}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Where Rankbox stops ---------- */

/* The ownership split, drawn as a boundary: what Rankbox runs on the white
   side, what stays the owner's on the grey side, and a joint on the line
   between them. */
export function EcommerceBoundary({ persona }: { persona: Persona }) {
  const { handoff } = persona;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={ShieldCheck}
        eyebrow="Who owns what"
        title={
          <>
            Where Rankbox stops <Accent>and your store starts</Accent>
          </>
        }
      />
      <Band>
        <div className="relative grid lg:grid-cols-2">
          <Side
            title={handoff.runsTitle}
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta text-white">
                <Mark className="h-3.5 w-3.5" />
              </span>
            }
            lines={handoff.runs}
            mark={
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            }
          />
          <Side
            title={handoff.keepsTitle}
            className={cn("border-t lg:border-l lg:border-t-0", LINE, PANEL)}
            icon={
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                <Store className="h-3.5 w-3.5" />
              </span>
            }
            lines={handoff.keeps}
            mark={<Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
          />
          {/* The joint where the line between the two sides meets the band's
              top hairline. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-ink/[0.08] bg-white px-2.5 py-1 text-[0.7rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.06)] lg:flex"
          >
            <ShieldCheck className="h-3 w-3 text-cta" />
            Blog only
          </span>
        </div>
      </Band>
    </section>
  );
}

function Side({
  title,
  icon,
  lines,
  mark,
  className,
}: {
  title: string;
  icon: ReactNode;
  lines: { label: string; detail: string }[];
  mark: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-8 sm:px-10 lg:px-12 lg:py-10", className)}>
      <Reveal>
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-display text-[1.3rem] font-medium tracking-[-0.02em] text-ink">
            {title}
          </h3>
        </div>
        <ul className={cn("mt-6 divide-y border-t", LINE, "divide-ink/[0.07]")}>
          {lines.map((l) => (
            <li key={l.label} className="flex gap-3 py-4">
              {mark}
              <span>
                <span className="block text-[0.92rem] font-semibold text-ink">{l.label}</span>
                <span className="mt-0.5 block text-[0.86rem] leading-relaxed text-muted-foreground">
                  {l.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

/* ---------- Why the blog stalled ---------- */

/* Each stall and what changes it, side by side on one row, so the pair reads
   as a single line item rather than two lists to match up. */
export function EcommercePains({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      {/* Title left, the reason right: the landing's FAQ head, turned on
          its side, so this band doesn't read as one more centred header. */}
      <Band>
        <div className="grid lg:grid-cols-2">
          <Reveal className="px-6 pb-3 pt-10 sm:px-10 sm:pt-12 lg:py-14 lg:pl-12">
            <Pill icon={X}>Where it stalls</Pill>
            <h2 className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
              {accented(persona.painsTitle, 2)}
            </h2>
          </Reveal>
          <Reveal
            delay={0.06}
            className="flex items-end px-6 pb-10 sm:px-10 sm:pb-12 lg:py-14 lg:pr-12"
          >
            <p className="max-w-md text-[1rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
              {persona.painsIntro}
            </p>
          </Reveal>
        </div>
      </Band>
      <Band>
        <div
          aria-hidden
          className={cn(
            "hidden grid-cols-[4.5rem_1fr_1fr] border-b text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:grid",
            LINE,
          )}
        >
          <span />
          <span className={cn("border-l px-6 py-3", LINE)}>The store blog today</span>
          <span className={cn("border-l px-6 py-3 text-cta", LINE)}>With Rankbox</span>
        </div>
        <ol className="divide-y divide-ink/[0.07]">
          {persona.pains.map((p, i) => (
            <li key={p.pain} className="grid sm:grid-cols-[4.5rem_1fr_1fr]">
              <span className="flex items-start px-6 pt-6 text-[0.75rem] font-medium tabular-nums text-muted-foreground sm:justify-center sm:px-0 sm:py-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Reveal
                className={cn(
                  "flex gap-3 px-6 pb-3 pt-2 sm:border-l sm:py-6",
                  LINE,
                  "sm:bg-[color-mix(in_oklab,var(--surface)_55%,white)]",
                )}
              >
                <X aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]/55" />
                <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{p.pain}</p>
              </Reveal>
              <Reveal
                delay={0.06}
                className={cn("flex gap-3 px-6 pb-6 pt-1 sm:border-l sm:py-6", LINE)}
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <p className="text-[0.95rem] leading-relaxed text-ink">{p.fix}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- From store URL to first guide ---------- */

export function EcommerceWorkflow({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={CalendarClock}
        eyebrow="One setup session"
        title={accented(persona.workflowTitle, 2)}
        subtitle={persona.workflowIntro}
      />
      <Band>
        <ol className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-4", LINE_FILL)}>
          {persona.steps.map((s, i) => {
            const repeats = /^every\b/i.test(s.when);
            return (
              <li key={s.title} className="bg-white">
                <Reveal delay={(i % 4) * 0.05} className="flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[0.72rem] font-semibold",
                        repeats
                          ? "border border-ink/[0.08] bg-white text-ink"
                          : "bg-cta-soft text-cta",
                      )}
                    >
                      {repeats && <Repeat className="h-3 w-3 text-cta" />}
                      {s.when}
                    </span>
                    <span className="text-[0.72rem] font-medium tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className={cn(H3, "mt-5")}>{s.title}</h3>
                  <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                  <div
                    aria-hidden
                    className={cn(
                      "mt-6 flex flex-1 flex-col justify-center rounded-xl border border-ink/[0.06] p-3",
                      PANEL,
                    )}
                  >
                    <StepPicture index={i} topics={persona.topics} />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Band>
      <Band inner="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <a href="/auth" className={SOLID_BUTTON}>
          {TRIAL_CTA}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
      </Band>
    </section>
  );
}

/* ---------- The parts a store leans on ---------- */

export function EcommercePicks({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Boxes}
        eyebrow="Picked for a shop"
        title={accented(persona.picksTitle, 3)}
        subtitle={persona.picksIntro}
      />
      <Band>
        <ul className={cn("grid gap-px sm:grid-cols-2", LINE_FILL)}>
          {persona.picks.map((pick, i) => {
            const f = getFeature(pick.featureSlug);
            if (!f) return null;
            const Icon = f.icon;
            const tint = STAGE_TINTS[i % STAGE_TINTS.length];
            return (
              <li key={pick.featureSlug} className="bg-white">
                <Reveal delay={(i % 2) * 0.06} className="h-full">
                  <Link
                    to="/features/$slug"
                    params={{ slug: f.slug }}
                    className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{ background: tint.tile, color: tint.ink }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className={H3}>{f.name}</h3>
                          <p className="text-[0.8rem] text-muted-foreground">{f.tagline}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    </div>
                    <p
                      className="mt-5 rounded-xl px-4 py-3.5 text-[0.92rem] leading-relaxed text-ink/85"
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
          See the whole engine
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
    </section>
  );
}

/* ---------- What the store stops paying for ---------- */

export function EcommerceStack({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      {/* No header band of its own: the title sits beside the slip it
          describes, on the same grey panel. */}
      <Band inner={PANEL}>
        <div className="grid lg:grid-cols-2">
          <Reveal
            className={cn(
              "order-2 flex items-center border-t px-5 py-10 sm:px-10 sm:py-14 lg:order-1 lg:border-r lg:border-t-0",
              LINE,
            )}
          >
            <StackReceipt items={persona.stack} />
          </Reveal>
          <Reveal
            delay={0.08}
            className="order-1 flex h-full flex-col justify-center px-6 py-12 sm:px-10 lg:order-2 lg:px-12"
          >
            <Pill icon={Receipt} className="w-fit">
              One line on the bill
            </Pill>
            <h2 className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]">
              {accented(persona.stackTitle, 3)}
            </h2>
            <p className="mt-4 text-[1rem] leading-relaxed text-muted-foreground">
              {persona.stackIntro}
            </p>
            <p
              className={cn("mt-6 border-t pt-6 text-[0.95rem] leading-relaxed text-ink/80", LINE)}
            >
              {persona.stackNote}
            </p>
            <a href="#pricing" className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
              See what&rsquo;s in the plan
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function EcommerceFAQ({ persona }: { persona: Persona }) {
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
              FAQ
            </Pill>
            <h2 className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
              Before you hand over <Accent>the blog</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              What&rsquo;s worth knowing before you run Rankbox as {withArticle(persona.role)}.
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

/* A title cell and the five other pages, six cells in all, so the grid
   closes evenly at three, two, or one column. */
export function EcommerceOtherSeats({ persona }: { persona: Persona }) {
  const others = PERSONAS.filter((p) => p.slug !== persona.slug);
  const groupLabel = (id: string) => PERSONA_GROUPS.find((g) => g.id === id)?.label ?? "";
  return (
    <section aria-labelledby="seats-title">
      <Spacer />
      <Band>
        <ul className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-3", LINE_FILL)}>
          <li className="flex flex-col justify-center bg-[color-mix(in_oklab,var(--cta)_4%,white)] p-6 sm:p-8">
            <Pill icon={Users} className="w-fit">
              Other seats
            </Pill>
            <h2
              id="seats-title"
              className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink"
            >
              Not only <Accent>for stores</Accent>
            </h2>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
              The same engine, written for how other teams work.
            </p>
          </li>
          {others.map((p) => {
            const Icon = p.icon;
            return (
              <li key={p.slug} className="bg-white">
                <Link
                  to="/use-cases/$slug"
                  params={{ slug: p.slug }}
                  className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:p-8"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue">
                      <Icon className="h-4 w-4" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                  </span>
                  <span className="mt-5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {groupLabel(p.group)}
                  </span>
                  <span className="mt-1 text-[0.98rem] font-semibold text-ink">{p.name}</span>
                  <span className="mt-1 text-[0.85rem] leading-relaxed text-muted-foreground">
                    {p.tagline}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* The landing's closing band, for a shop: blue inside the rails, the white
   mark dithered behind, the store URL field on a white card (so its blue
   button keeps its contrast), and the first stage of the sample map rising
   from the band's foot. The band is --cta so white body text passes AA. */
export function EcommerceCTA({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;
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
            <div className="mx-auto mt-8 max-w-[34rem] rounded-xl bg-white p-2 shadow-[0_1px_2px_rgba(4,24,72,0.2),0_16px_40px_-16px_rgba(4,24,72,0.55)]">
              <UrlForm url={url} onChange={setUrl} variant="split" />
            </div>
            <p className="mt-3.5 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>

          {persona.topics && (
            <Reveal
              delay={0.12}
              y={40}
              className="mx-auto mt-12 h-[10.5rem] max-w-md overflow-hidden sm:mt-14 sm:h-[11.5rem]"
            >
              <div aria-hidden>
                <QuestionPeek topics={persona.topics} />
              </div>
            </Reveal>
          )}
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
