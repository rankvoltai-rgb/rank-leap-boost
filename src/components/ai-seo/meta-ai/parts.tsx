/**
 * The bands of /ai-seo/meta-ai around the reading column: the hero with the
 * surface stage, the short answer set as a received message beside the spec
 * sheet, the FAQ as a question-and-answer thread, the sources split into
 * Meta's own pages and everyone else's, the other guides, and the offer.
 */
import type { CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, ChevronRight, HelpCircle, Plus } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  PANEL,
  Pill,
  Spacer,
} from "@/components/landing/frame";
import { MarkDither } from "@/components/landing/hero-dither";
import { Mark } from "@/components/brand/Mark";
import { ShareButtons } from "@/components/blog/ArticleChrome";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { EngineMark, Md } from "@/components/ai-seo/kit";
import { ENGINES, type Engine } from "@/data/ai-seo/engines";
import type { EngineGuide, Faq, Source } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { LABELS, OFFER } from "./copy";
import { SurfaceStage } from "./SurfaceStage";

/* ---------- hero ---------- */

export function Hero({
  guide,
  engine,
  minutes,
  url,
}: {
  guide: EngineGuide;
  engine: Engine;
  minutes: number;
  url: string;
}) {
  return (
    <header id="top" className="relative scroll-mt-16 bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className={cn("border-b px-5 py-3 sm:px-10 lg:px-12", LINE)}>
          <EngineRail active={guide.slug} />
        </div>
        <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
          <div className="flex flex-col px-5 pb-10 pt-8 motion-safe:animate-hero-rise sm:px-10 lg:py-14 lg:pl-12 lg:pr-10">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
                <li>
                  <Link to="/ai-seo" className="py-2 transition-colors hover:text-ink">
                    AI SEO guides
                  </Link>
                </li>
                <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
                <li className="font-medium text-cta">{engine.name}</li>
              </ol>
            </nav>
            <h1 className="mt-5 text-balance font-display text-[2.05rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.7rem] lg:text-[2.85rem]">
              {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
            </h1>
            <p className="mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">
              {guide.subhead}
            </p>
            <div className="mt-8">
              <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cta">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white ring-1 ring-ink/[0.08]">
                  <Mark className="h-3.5 w-3.5 text-brand-blue" />
                </span>
                {LABELS.shortAnswer}
              </p>
              <p className="mt-3 rounded-2xl rounded-tl-md border border-ink/[0.07] bg-[color-mix(in_oklab,var(--cta-soft)_70%,white)] px-5 py-4 text-[1rem] leading-[1.7] text-ink sm:text-[1.05rem]">
                <Md text={guide.shortAnswer} />
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 lg:mt-auto lg:pt-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  <Mark className="h-5 w-5 text-brand-blue" />
                </span>
                <div className="text-sm leading-tight">
                  <Link
                    to="/about"
                    className="font-semibold text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    Rankbox Team
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Updated {formatDate(engine.updated)} · {minutes} min read
                  </p>
                </div>
              </div>
              <ShareButtons url={url} title={`${guide.headline.lead} ${guide.headline.accent}`} />
            </div>
          </div>
          <div
            className={cn(
              "border-t px-4 py-6 motion-safe:animate-hero-rise sm:px-8 sm:py-8 lg:border-l lg:border-t-0",
              LINE,
              PANEL,
            )}
            style={{ "--rise-delay": "0.08s" } as CSSProperties}
          >
            <SurfaceStage preview={guide.preview} className="lg:sticky lg:top-24" />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- spec band ---------- */

export function FactBand({ facts }: { facts: EngineGuide["facts"] }) {
  return (
    <Band>
      <CellGrid className="grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <li key={f.label} className={cn(CELL, "px-4 py-4 sm:px-8 lg:py-6")}>
            <p className="text-[0.72rem] leading-snug text-muted-foreground sm:text-[0.76rem]">
              {f.label}
            </p>
            <p
              className={cn(
                "mt-1.5 font-medium text-ink",
                f.mono
                  ? "font-mono text-[0.86rem] leading-[1.6rem] text-cta sm:text-[1.02rem] sm:leading-[1.9rem]"
                  : "font-display text-[1.2rem] leading-tight tracking-[-0.02em] sm:text-[1.5rem]",
              )}
            >
              {f.value}
            </p>
          </li>
        ))}
      </CellGrid>
    </Band>
  );
}

/* ---------- reading column pieces ---------- */

export function SectionHeading({
  id,
  index,
  children,
  className,
}: {
  id: string;
  index?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "mt-16 flex scroll-mt-28 items-start gap-3 font-display text-[1.6rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[1.95rem]",
        className,
      )}
    >
      {index !== undefined && (
        <span
          aria-hidden
          className="mt-[0.3rem] flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-cta-soft px-1.5 font-mono text-[0.72rem] font-semibold tracking-normal text-cta sm:mt-[0.45rem]"
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
      <span>{children}</span>
    </h2>
  );
}

export function Takeaways({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="takeaways">
      <SectionHeading id="takeaways" className="mt-0">
        {LABELS.takeaways}
      </SectionHeading>
      <ol className={cn("mt-6 overflow-hidden rounded-xl border bg-white", LINE)}>
        {items.map((t, i) => (
          <li key={t} className={cn("flex gap-4 px-4 py-4 sm:px-5", i > 0 && "border-t", LINE)}>
            <span className="mt-0.5 font-display text-[1.25rem] font-medium leading-none text-brand-blue">
              {i + 1}
            </span>
            <p className="text-[1rem] leading-relaxed text-ink/80">
              <Md text={t} />
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RailOffer() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
      <p className="font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        {OFFER.railTitle}
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">{OFFER.railBody}</p>
      <a
        href="/auth"
        className="group mt-4 flex h-9 items-center justify-center gap-2 rounded-lg bg-cta px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover"
      >
        {OFFER.button}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
      <p className="mt-2 text-center text-[0.68rem] text-muted-foreground">{TRIAL_NOTE}</p>
    </div>
  );
}

export function FurtherReading({ items }: { items: EngineGuide["furtherReading"] }) {
  return (
    <nav aria-labelledby="further-reading" className="mt-14">
      <h2
        id="further-reading"
        className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
      >
        {LABELS.furtherReading}
      </h2>
      <ul className={cn("mt-3 overflow-hidden rounded-xl border bg-white", LINE)}>
        {items.map((r, i) => (
          <li key={r.href} className={cn(i > 0 && "border-t", LINE)}>
            <Link
              to={r.href}
              className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-ink/[0.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-5"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink transition-colors group-hover:text-cta">
                  {r.title}
                </span>
                <span className="mt-0.5 block text-[0.88rem] leading-relaxed text-ink/65">
                  {r.description}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="mt-1 h-4 w-4 shrink-0 text-ink/30 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-cta"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- FAQ, as a thread ---------- */

export function FaqThread({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className={cn("border-b lg:border-b-0 lg:border-r", LINE)}>
            <div className="flex flex-col px-6 py-10 sm:px-10 lg:sticky lg:top-20 lg:px-12 lg:py-14">
              <Pill icon={HelpCircle} className="w-fit">
                {LABELS.faqEyebrow}
              </Pill>
              <h2
                id="faq-title"
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
              >
                {LABELS.faqTitle}
              </h2>
              <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
                {LABELS.faqIntro}
              </p>
            </div>
          </div>

          <div className="px-4 py-6 sm:px-10 lg:px-12 lg:py-10">
            <Accordion type="multiple" defaultValue={["faq-0"]} className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex justify-end">
                    <AccordionPrimitive.Trigger className="group flex max-w-[92%] cursor-pointer items-center gap-3 rounded-2xl rounded-br-md bg-cta-soft px-4 py-3 text-left text-[0.95rem] font-medium leading-snug text-ink transition-colors hover:bg-[color-mix(in_oklab,var(--brand-blue)_14%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 data-[state=open]:bg-cta data-[state=open]:text-white">
                      {f.q}
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/70 text-cta transition-transform duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-white/20 group-data-[state=open]:text-white">
                        <Plus className="h-3 w-3" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent forceMount className="pb-1 pt-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-ink/[0.08]">
                        <Mark className="h-3.5 w-3.5 text-brand-blue" />
                      </span>
                      <p className="max-w-[92%] rounded-2xl rounded-tl-md border border-ink/[0.07] bg-white px-4 py-3 text-[0.93rem] leading-relaxed text-ink/75">
                        <Md text={f.a} />
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- sources ---------- */

function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

const isMeta = (s: Source) => /\b(Meta|WhatsApp)\b/.test(s.publisher);

function SourceCells({ sources }: { sources: Source[] }) {
  return (
    <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
      {sources.map((s) => (
        <li key={s.href} className={CELL}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col gap-1.5 px-5 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-6"
          >
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {s.publisher}
            </span>
            <span className="text-[0.92rem] font-medium leading-snug text-ink transition-colors group-hover:text-cta">
              {s.title}
            </span>
            <span className="mt-auto flex items-center gap-1 pt-1 font-mono text-[0.68rem] text-ink/40">
              <span className="truncate">{hostOf(s.href)}</span>
              <ArrowUpRight aria-hidden className="h-3 w-3 shrink-0" />
            </span>
          </a>
        </li>
      ))}
    </CellGrid>
  );
}

export function SourcesBand({ sources, checked }: { sources: Source[]; checked: string }) {
  const own = sources.filter(isMeta);
  const others = sources.filter((s) => !isMeta(s));
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-24">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <div>
          <Pill icon={BookOpen}>{LABELS.sourcesEyebrow}</Pill>
          <h2
            id="sources-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            {LABELS.sourcesTitle}
          </h2>
        </div>
        <p className="text-[0.82rem] text-muted-foreground">
          {LABELS.verified} {formatDate(checked)} · {sources.length} sources
        </p>
      </Band>
      {[
        { label: LABELS.sourcesFromMeta, list: own },
        { label: LABELS.sourcesElsewhere, list: others },
      ].map((g) => (
        <div key={g.label}>
          <Band inner={cn("px-6 py-3 sm:px-10 lg:px-12", PANEL)}>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink/60">
              {g.label} <span className="ml-1 font-medium text-ink/35">{g.list.length}</span>
            </h3>
          </Band>
          <Band>
            <SourceCells sources={g.list} />
          </Band>
        </div>
      ))}
    </section>
  );
}

/* ---------- the other guides ---------- */

export function OtherGuides({ current }: { current: Engine }) {
  const others = ENGINES.filter((e) => e.slug !== current.slug);
  return (
    <section aria-labelledby="other-guides-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <h2
          id="other-guides-title"
          className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          {LABELS.otherGuides}
        </h2>
        <Link to="/ai-seo" className={cn(GHOST_BUTTON, "group/btn shrink-0")}>
          {LABELS.otherGuidesLink}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {others.map((e) => (
            <li key={e.slug} className={CELL}>
              <Link
                to="/ai-seo/$engine"
                params={{ engine: e.slug }}
                className="group flex h-full flex-col gap-3 px-4 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  <EngineMark mark={e.mark} className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[0.9rem] font-semibold text-ink transition-colors group-hover:text-cta">
                    {e.shortName}
                  </span>
                  <span className="mt-0.5 block text-[0.75rem] leading-snug text-muted-foreground">
                    {e.tagline}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- closing offer ---------- */

export function ClosingBand() {
  return (
    <section aria-labelledby="meta-closing-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-[0_1px_2px_rgba(4,24,72,0.2)]">
            <Mark className="h-5 w-5 text-brand-blue" />
          </span>
          <h2
            id="meta-closing-title"
            className="mt-6 text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            {OFFER.closingTitle}
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white/85 sm:text-[1.05rem]">
            {OFFER.closingBody}
          </p>
          <a
            href="/auth"
            className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            {OFFER.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <p className="mt-3 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
