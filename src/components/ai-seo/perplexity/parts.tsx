/**
 * The bands of the Perplexity guide, top to bottom: the hero with the engine
 * rail and the citation map, the short answer, the spec band, the reading
 * column's pieces (takeaways, sections, checklist), the FAQ, the sources and
 * the closing offer. Words come from the guide's content file; the labels
 * here are structural.
 */
import { useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  ChevronRight,
  HelpCircle,
  ListChecks,
  Quote,
} from "lucide-react";
import { Accent, Band, CELL, CellGrid, LINE, Pill, Spacer } from "@/components/landing/frame";
import { MarkDither } from "@/components/landing/hero-dither";
import { UrlForm } from "@/components/landing/Hero";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { ShareButtons } from "@/components/blog/ArticleChrome";
import { Mark } from "@/components/brand/Mark";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { Md } from "@/components/ai-seo/kit";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import type { Engine } from "@/data/ai-seo/engines";
import type { ChecklistItem, EngineGuide, GuideSection, Source } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { CitationMap } from "./CitationMap";
import { GuideBlocks, NumberBadge } from "./GuideBlocks";

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

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
      {/* The way between guides, first thing on the page. */}
      <div className={cn("mx-auto max-w-6xl border-x border-b", LINE)}>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-10 lg:px-12">
          <EngineRail active={guide.slug} />
          <nav aria-label="Breadcrumb" className="hidden sm:block">
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
      </div>

      <div
        className={cn(
          "mx-auto grid max-w-6xl grid-cols-1 border-x lg:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)]",
          LINE,
        )}
      >
        <div className="flex flex-col justify-center px-5 pb-10 pt-9 motion-safe:animate-hero-rise sm:px-10 lg:py-12 lg:pl-12 lg:pr-10">
          <h1 className="text-balance font-display text-[2.1rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3rem]">
            {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.04rem] leading-relaxed text-muted-foreground sm:text-[1.12rem]">
            {guide.subhead}
          </p>
          <div className="relative mt-7 overflow-hidden rounded-xl border border-cta/20 bg-[color-mix(in_oklab,var(--cta)_4%,white)] py-5 pl-6 pr-5">
            <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-cta" />
            <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cta">
              <Quote aria-hidden className="h-3.5 w-3.5" />
              The short answer
            </p>
            <p className="mt-2.5 text-[1rem] font-medium leading-[1.65] text-ink sm:text-[1.05rem]">
              <Md text={guide.shortAnswer} />
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/[0.08] bg-white">
                <Mark className="h-[55%] w-[55%] text-brand-blue" />
              </span>
              <div className="text-sm leading-tight">
                <Link
                  to="/about"
                  className="font-semibold text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
                >
                  Rankbox Team
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  Updated {formatDate(engine.updated)} · {minutes} min read · {guide.sources.length}{" "}
                  sources
                </p>
              </div>
            </div>
            <ShareButtons url={url} title={guide.metaTitle} />
          </div>
        </div>

        <div
          className={cn(
            "border-t bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-3 motion-safe:animate-hero-rise sm:p-6 lg:flex lg:items-center lg:border-l lg:border-t-0 lg:p-8",
            LINE,
          )}
          style={rise(0.08)}
        >
          <figure className="mx-auto w-full max-w-[30rem]">
            <CitationMap preview={guide.preview} />
            <figcaption className="mt-3 px-1 text-center text-[0.76rem] leading-relaxed text-muted-foreground">
              Each claim ends in a source chip; its card pages through the numbered sources behind
              it.
            </figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}

/* ---------- spec band ---------- */

export function FactsBand({ guide }: { guide: EngineGuide }) {
  return (
    <>
      <Band>
        <CellGrid className="grid-cols-2 lg:grid-cols-4">
          {guide.facts.map((f) => (
            <li
              key={f.label}
              className={cn(CELL, "flex flex-col-reverse justify-end gap-2 px-5 py-6 sm:px-8")}
            >
              <p className="text-[0.78rem] leading-snug text-muted-foreground">{f.label}</p>
              <p
                className={cn(
                  "break-words text-ink",
                  f.mono
                    ? "font-mono text-[1rem] font-semibold sm:text-[1.15rem]"
                    : "font-display text-[1.75rem] font-medium leading-none tracking-[-0.03em] text-brand-blue sm:text-[2rem]",
                )}
              >
                {f.value}
              </p>
            </li>
          ))}
        </CellGrid>
      </Band>
    </>
  );
}

/* ---------- reading column ---------- */

export function Takeaways({ items }: { items: string[] }) {
  return (
    <section
      id="takeaways"
      aria-labelledby="takeaways-title"
      className="scroll-mt-28 rounded-xl border border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-5 sm:p-7"
    >
      <h2
        id="takeaways-title"
        className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink"
      >
        Key takeaways
      </h2>
      <ol className="mt-5 space-y-3.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3">
            <NumberBadge n={i + 1} className="mt-[0.15rem]" />
            <span className="text-[1rem] leading-relaxed text-ink/80">
              <Md text={t} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function GuideSectionView({ section, index }: { section: GuideSection; index: number }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28 pt-16">
      <div className="flex items-center gap-3">
        <NumberBadge n={String(index + 1).padStart(2, "0")} tone="ghost" />
        <span aria-hidden className="h-px flex-1 bg-ink/[0.07]" />
      </div>
      <h2
        id={`${section.id}-title`}
        className="mt-4 text-balance font-display text-[1.6rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[1.9rem]"
      >
        {section.title}
      </h2>
      <GuideBlocks blocks={section.blocks} />
    </section>
  );
}

const IMPACT: Record<ChecklistItem["impact"], string> = {
  high: "High impact",
  medium: "Medium impact",
  low: "Worth doing",
};

export function Checklist({ items }: { items: ChecklistItem[] }) {
  const [done, setDone] = useState<ReadonlySet<string>>(() => new Set());
  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const ordered = (["high", "medium", "low"] as const).flatMap((impact) =>
    items.filter((i) => i.impact === impact),
  );
  const number = new Map(ordered.map((item, i) => [item.id, i + 1]));
  const groups = (["high", "medium", "low"] as const)
    .map((impact) => ({ impact, items: ordered.filter((i) => i.impact === impact) }))
    .filter((g) => g.items.length > 0);
  return (
    <section id="checklist" aria-labelledby="checklist-title" className="scroll-mt-28 pt-16">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta text-white">
          <ListChecks aria-hidden className="h-3.5 w-3.5" />
        </span>
        <span aria-hidden className="h-px flex-1 bg-ink/[0.07]" />
        <span
          aria-live="polite"
          className="font-mono text-[0.72rem] tabular-nums text-muted-foreground"
        >
          {done.size}/{items.length} done
        </span>
      </div>
      <h2
        id="checklist-title"
        className="mt-4 font-display text-[1.6rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[1.9rem]"
      >
        {items.length} moves, highest impact first
      </h2>
      <div className="mt-6 space-y-6">
        {groups.map((g) => (
          <div key={g.impact}>
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {IMPACT[g.impact]}
            </p>
            <ul className="divide-y divide-ink/[0.07] overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
              {g.items.map((item) => {
                const on = done.has(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-pressed={on}
                      className="flex w-full gap-3.5 px-5 py-4 text-left transition-colors hover:bg-ink/[0.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                          on ? "border-cta bg-cta text-white" : "border-ink/[0.18] bg-white",
                        )}
                      >
                        {on && <Check className="h-3 w-3" strokeWidth={3.5} />}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block font-semibold leading-snug transition-colors",
                            on ? "text-ink/45 line-through decoration-ink/25" : "text-ink",
                          )}
                        >
                          <span className="mr-2 font-mono text-[0.75rem] font-medium text-muted-foreground">
                            {String(number.get(item.id)).padStart(2, "0")}
                          </span>
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[0.9rem] leading-relaxed text-ink/65">
                          <Md text={item.detail} />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- rail offer ---------- */

export function RailOffer() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-cta">
        <BookOpenCheck aria-hidden className="h-4 w-4" />
      </span>
      <p className="mt-4 font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        Publish passages worth citing
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
        Rankbox researches your buyers' questions and writes source-backed articles in
        self-contained, dated sections, on a schedule.
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

export function FaqBand({ guide }: { guide: EngineGuide }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2
              id="faq-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              What practitioners ask about <Accent>Perplexity</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              Short answers, each traced to the sources listed below.
            </p>
          </div>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="multiple"
              defaultValue={["faq-0"]}
              className="divide-y divide-ink/[0.07]"
            >
              {guide.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span
                        aria-hidden
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white font-mono text-[0.68rem] font-semibold text-ink/60 transition-[background-color,color,border-color] duration-300 group-hover:border-brand-blue/30 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white"
                      >
                        {i + 1}
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-[0.95rem] leading-relaxed text-muted-foreground"
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

function host(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

const isPerplexity = (s: Source) => /(^|\.)perplexity\.(ai|com)$/.test(host(s.href));

export function SourcesBand({ sources, checked }: { sources: Source[]; checked: string }) {
  const groups = [
    { label: "From Perplexity", items: sources.filter(isPerplexity) },
    { label: "Independent studies and reporting", items: sources.filter((s) => !isPerplexity(s)) },
  ];
  const number = new Map(groups.flatMap((g) => g.items).map((s, i) => [s.href, i + 1]));
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-10 sm:px-10 lg:px-12">
        <div>
          <Pill icon={Quote}>Sources</Pill>
          <h2
            id="sources-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Every claim, traced to a source
          </h2>
        </div>
        <p className="text-[0.85rem] text-muted-foreground">
          {sources.length} sources · checked {checked}
        </p>
      </Band>
      <Band>
        <CellGrid className="lg:grid-cols-2">
          {groups.map((g) => (
            <li key={g.label} className={cn(CELL, "px-6 py-7 sm:px-10 lg:px-12")}>
              <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {g.label}
              </h3>
              <ol className="mt-4 space-y-3">
                {g.items.map((s) => {
                  return (
                    <li key={s.href} className="flex gap-3">
                      <NumberBadge n={number.get(s.href) ?? 0} tone="ghost" className="mt-px w-7" />
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group min-w-0 text-[0.88rem] leading-snug"
                      >
                        <span className="font-medium text-ink decoration-ink/30 underline-offset-4 group-hover:underline">
                          {s.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[0.76rem] text-muted-foreground">
                          {s.publisher} · {host(s.href)}
                          <ArrowUpRight aria-hidden className="h-3 w-3" />
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- closing offer ---------- */

export function ClosingBand() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="perplexity-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2
            id="perplexity-cta-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Give Perplexity passages worth citing
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Rankbox researches the questions your buyers ask, writes source-backed articles with
            self-contained, dated sections, scores each one and publishes on your schedule.
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <UrlForm url={url} onChange={setUrl} />
            <p className="text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </div>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
