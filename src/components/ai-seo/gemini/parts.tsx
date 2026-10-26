/**
 * The Gemini guide's own sections, around the reading column: the hero with
 * the engine rail and the grounding visual, the spec band, the short answer,
 * the run-sheet, the FAQ, the sources, the other guides and the closing band.
 */
import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  HelpCircle,
  ListChecks,
  Plus,
  Sparkles,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { ShareButtons } from "@/components/blog/ArticleChrome";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { EngineTile, Md } from "@/components/ai-seo/kit";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Reveal } from "@/components/landing/shared";
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
import { ENGINES, type Engine } from "@/data/ai-seo/engines";
import type { ChecklistItem, EngineGuide, Faq, Source } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { GroundingVisual } from "./GroundingVisual";

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/* ---------- hero ---------- */

export function GeminiHero({
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
      {/* The guides' shared rail gets a strip of its own, the full width of
          the frame, so all eleven engines sit on one line on desktop. */}
      <div
        className={cn(
          "relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 border-x border-b px-5 py-4 sm:px-10 lg:px-12",
          LINE,
        )}
      >
        <EngineRail active={guide.slug} />
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
            <li>
              <Link to="/ai-seo" className="py-2 transition-colors hover:text-ink">
                AI SEO guides
              </Link>
            </li>
            <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
            <li aria-current="page" className="font-medium text-cta">
              {engine.name}
            </li>
          </ol>
        </nav>
      </div>
      <div
        className={cn(
          "relative mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)]",
          LINE,
        )}
      >
        <div className="flex min-w-0 flex-col justify-center px-5 pb-10 pt-8 motion-safe:animate-hero-rise sm:px-10 lg:py-12 lg:pl-12 lg:pr-10">
          <h1 className="text-balance font-display text-[2.05rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.6rem] lg:text-[2.85rem]">
            {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
          </h1>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">
            {guide.subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[0.8rem] text-muted-foreground">
              <span className="font-medium text-ink">Rankbox Team</span>
              <span aria-hidden> · </span>
              Updated <time dateTime={engine.updated}>{formatDate(engine.updated)}</time>
              <span aria-hidden> · </span>
              {minutes} min read
            </p>
            <ShareButtons url={url} title={`${guide.headline.lead} ${guide.headline.accent}`} />
          </div>
        </div>
        <div
          className={cn(
            "flex min-w-0 items-center border-t p-4 motion-safe:animate-hero-rise sm:p-8 lg:border-l lg:border-t-0",
            LINE,
            PANEL,
          )}
          style={rise(0.08)}
        >
          <GroundingVisual preview={guide.preview} className="mx-auto max-w-[32rem]" />
        </div>
      </div>
    </header>
  );
}

/* ---------- spec band ---------- */

export function FactsBand({ facts }: { facts: EngineGuide["facts"] }) {
  return (
    <Band>
      <CellGrid className="grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <li key={f.label} className={cn(CELL, "px-5 py-5 sm:px-8 sm:py-6")}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {f.label}
            </p>
            <p
              className={cn(
                "mt-2 break-words text-ink",
                f.mono
                  ? "font-mono text-[1.02rem] font-semibold sm:text-[1.15rem]"
                  : "font-display text-[1.35rem] font-medium tracking-[-0.02em] sm:text-[1.6rem]",
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

/* ---------- short answer + takeaways ---------- */

export function ShortAnswer({ guide }: { guide: EngineGuide }) {
  return (
    <section id="takeaways" aria-labelledby="short-answer-title" className="scroll-mt-28">
      <div className="rounded-xl border border-cta/15 bg-cta-soft p-5 sm:p-7">
        <h2
          id="short-answer-title"
          className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cta"
        >
          <Sparkles aria-hidden className="h-3.5 w-3.5" />
          The short answer
        </h2>
        <p className="mt-3 text-[1.08rem] leading-[1.75] text-ink sm:text-[1.16rem]">
          <Md text={guide.shortAnswer} />
        </p>
      </div>
      <div className="mt-5 rounded-xl border border-ink/[0.08] bg-white">
        <h3 className="border-b border-ink/[0.07] px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:px-7">
          What to remember
        </h3>
        <ol className="divide-y divide-ink/[0.06]">
          {guide.takeaways.map((t, i) => (
            <li
              key={t}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 px-5 py-3.5 text-[0.96rem] leading-relaxed text-ink/80 sm:px-7"
            >
              <span className="mt-[0.1rem] font-mono text-[0.75rem] font-semibold text-cta">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <Md text={t} />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- run-sheet (the checklist) ---------- */

const IMPACT: Record<ChecklistItem["impact"], { label: string; className: string }> = {
  high: { label: "High impact", className: "bg-cta-soft text-cta" },
  medium: { label: "Medium", className: "bg-ink/[0.05] text-ink/60" },
  low: { label: "Low", className: "border border-dashed border-ink/20 text-ink/55" },
};

const STORE = "rankbox.ai-seo.gemini.run-sheet";

/* Ticks are a per-visitor convenience, so browser storage is fine; every read
   and write is guarded because storage can be missing or blocked. */
export function RunSheet({ items }: { items: ChecklistItem[] }) {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE);
      if (raw)
        setDone((JSON.parse(raw) as string[]).filter((id) => items.some((i) => i.id === id)));
    } catch {
      /* storage unavailable */
    }
  }, [items]);
  const toggle = (id: string) =>
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id];
      try {
        window.localStorage.setItem(STORE, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });

  return (
    <section aria-labelledby="checklist" className={cn("mt-16 border-t pt-12", LINE)}>
      <Pill icon={ListChecks}>In order</Pill>
      <h2
        id="checklist"
        className="mt-4 scroll-mt-28 font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2rem]"
      >
        The Gemini run-sheet
      </h2>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
          <div
            className="h-full rounded-full bg-cta transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${(done.length / items.length) * 100}%` }}
          />
        </div>
        <p aria-live="polite" className="shrink-0 font-mono text-[0.75rem] text-ink/60">
          {done.length}/{items.length}
        </p>
      </div>
      <ol className="mt-5 overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
        {items.map((c, i) => {
          const on = done.includes(c.id);
          const impact = IMPACT[c.impact];
          return (
            <li key={c.id} className="border-b border-ink/[0.07] last:border-b-0">
              <label className="flex cursor-pointer gap-3.5 px-4 py-4 transition-colors hover:bg-ink/[0.015] sm:px-5">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(c.id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-cta/40",
                    on ? "border-cta bg-cta text-white" : "border-ink/20 bg-white text-transparent",
                  )}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                    <span
                      className={cn(
                        "font-medium leading-snug transition-colors",
                        on ? "text-ink/45 line-through decoration-ink/25" : "text-ink",
                      )}
                    >
                      <span className="mr-2 font-mono text-[0.75rem] text-ink/35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {c.title}
                    </span>
                    <span
                      className={cn(
                        "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
                        impact.className,
                      )}
                    >
                      {impact.label}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.9rem] leading-relaxed text-ink/65">
                    <Md text={c.detail} />
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------- go deeper (the guide's own further reading) ---------- */

export function GoDeeper({ links }: { links: EngineGuide["furtherReading"] }) {
  if (links.length === 0) return null;
  return (
    <nav aria-label="Further reading" className="mt-12">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Go deeper
      </p>
      <ul className="mt-3 divide-y divide-ink/[0.07] rounded-xl border border-ink/[0.08] bg-white">
        {links.map((r) => (
          <li key={r.href}>
            <Link
              to={r.href}
              className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-ink/[0.015]"
            >
              <span className="min-w-0">
                <span className="block font-medium text-ink transition-colors group-hover:text-cta">
                  {r.title}
                </span>
                <span className="mt-0.5 block text-[0.88rem] leading-relaxed text-ink/60">
                  {r.description}
                </span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink/30 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-cta" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- rail offer ---------- */

export function RailOffer() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
      <p className="font-display text-[1.02rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        Write the pages answer engines quote
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
        Rankbox researches your buyers&rsquo; questions, writes source-backed articles, scores them
        and publishes on your schedule.
      </p>
      <a
        href="/auth"
        className="group mt-5 flex h-10 items-center justify-center gap-2 rounded-lg bg-cta px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover"
      >
        Start free trial
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
      <p className="mt-2.5 text-center text-[0.7rem] text-muted-foreground">{TRIAL_NOTE}</p>
    </div>
  );
}

/* ---------- FAQ ---------- */

export function FaqBand({ faqs }: { faqs: Faq[] }) {
  return (
    <section aria-labelledby="faq-title">
      <Spacer />
      <Band id="faq" className="scroll-mt-16">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-28">
              <Pill icon={HelpCircle} className="w-fit">
                FAQ
              </Pill>
              <h2
                id="faq-title"
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
              >
                Gemini questions, <Accent>answered short</Accent>
              </h2>
            </div>
          </div>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`q-${i}`} className="border-b-0">
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
                    className="max-w-2xl pb-5 pr-10 text-[0.94rem] leading-relaxed text-muted-foreground"
                  >
                    <Md text={f.a} />
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

export function SourcesBand({ sources }: { sources: Source[] }) {
  return (
    <section aria-labelledby="sources">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <div>
          <Pill icon={BookOpen}>Vendor docs first, then studies and reporting</Pill>
          <h2
            id="sources"
            className="mt-4 scroll-mt-28 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Sources
          </h2>
        </div>
        <p className="font-mono text-[0.75rem] text-ink/50">{sources.length} references</p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s, i) => (
            <li key={s.href} className={CELL}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full gap-3 px-6 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <span className="mt-0.5 w-6 shrink-0 font-mono text-[0.72rem] text-ink/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9rem] font-medium leading-snug text-ink transition-colors group-hover:text-cta">
                    {s.title}
                  </span>
                  <span className="mt-1 block truncate text-[0.76rem] text-ink/50">
                    {s.publisher} · {hostOf(s.href)}
                  </span>
                </span>
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/25 transition-colors group-hover:text-cta" />
              </a>
            </li>
          ))}
        </CellGrid>
      </Band>
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
          Same question, <Accent>other engines</Accent>
        </h2>
        <Link to="/ai-seo" className={cn(GHOST_BUTTON, "group/btn shrink-0")}>
          All AI SEO guides
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {others.map((e) => (
            <li key={e.slug} className={CELL}>
              <Link
                to="/ai-seo/$engine"
                params={{ engine: e.slug }}
                className="group flex h-full items-start gap-3 p-5 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <EngineTile engine={e} className="h-9 w-9 rounded-lg" />
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-medium text-ink transition-colors group-hover:text-cta">
                    {e.shortName}
                  </span>
                  <span className="mt-0.5 block text-[0.76rem] leading-snug text-ink/55">
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

/* ---------- closing band ---------- */

export function ClosingBand() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="gemini-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2
            id="gemini-cta-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Publish the pages Gemini can ground on
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Rankbox finds the questions your buyers ask, writes source-backed articles that answer
            them, scores each one and publishes on your schedule.
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <UrlForm url={url} onChange={setUrl} />
            <p className="text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </div>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
