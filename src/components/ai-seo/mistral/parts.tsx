/**
 * The Mistral guide's own sections around the article text: the split hero
 * with the quotable answer, the spec band, the brief, the checklist, the
 * questions, the sources, the other guides and the closing band.
 */
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
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
  Quote,
  RotateCcw,
} from "lucide-react";
import { ShareButtons } from "@/components/blog/ArticleChrome";
import { EngineMark, Md } from "@/components/ai-seo/kit";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Reveal } from "@/components/landing/shared";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  PANEL,
  Pill,
  Spacer,
} from "@/components/landing/frame";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { ENGINES, type Engine } from "@/data/ai-seo/engines";
import type { ChecklistItem, EngineGuide, Faq, Source } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

const SITE = "https://rankbox.xyz";

/* ---------- hero ---------- */

export function GuideHero({
  guide,
  engine,
  minutes,
}: {
  guide: EngineGuide;
  engine: Engine;
  minutes: number;
}) {
  const url = `${SITE}/ai-seo/${guide.slug}`;
  return (
    <header id="top" className="relative scroll-mt-16 bg-white">
      {/* The way between guides, on a strip of its own across the frame. */}
      <div className={cn("mx-auto max-w-6xl border-x border-b px-5 py-3 sm:px-10 lg:px-12", LINE)}>
        <EngineRail active={guide.slug} />
      </div>
      <div
        className={cn(
          "relative mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)]",
          LINE,
        )}
      >
        <div className="flex min-w-0 flex-col justify-center px-5 pb-10 pt-7 motion-safe:animate-hero-rise sm:px-10 lg:py-12 lg:pl-12 lg:pr-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-muted-foreground">
              <li>
                <Link to="/ai-seo" className="py-2 transition-colors hover:text-ink">
                  AI SEO guides
                </Link>
              </li>
              <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
              <li className="font-medium text-cta">{engine.name}</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-balance font-display text-[2.05rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.7rem] lg:text-[3rem]">
            {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">
            {guide.subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                <EngineMark mark={engine.mark} className="h-5 w-5" />
              </span>
              <div className="text-sm leading-tight">
                <p className="font-semibold text-ink">Rankbox Team</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Updated {formatDate(engine.updated)} · {minutes} min read
                </p>
              </div>
            </div>
            <ShareButtons url={url} title={`${guide.headline.lead} ${guide.headline.accent}`} />
          </div>
        </div>

        {/* The quotable answer, in its own cell beside the title. */}
        <div
          className={cn(
            "border-t p-3 motion-safe:animate-hero-rise lg:border-l lg:border-t-0",
            LINE,
          )}
          style={{ "--rise-delay": "0.08s" } as CSSProperties}
        >
          <div className="flex h-full flex-col rounded-lg border border-cta/15 bg-cta-soft/45 p-6 sm:p-8">
            <Pill icon={Quote} className="w-fit">
              The short answer
            </Pill>
            <p className="mt-5 text-[1.02rem] leading-[1.75] text-ink sm:text-[1.06rem]">
              <Md text={guide.shortAnswer} />
            </p>
            <a
              href="#checklist"
              className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-[0.85rem] font-semibold text-cta transition-colors hover:text-cta-hover"
            >
              Skip to the checklist
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </a>
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
          <li key={f.label} className={cn(CELL, "px-5 py-5 sm:px-7 sm:py-6")}>
            <p className="text-[0.74rem] leading-snug text-muted-foreground">{f.label}</p>
            <p
              className={cn(
                "mt-2 break-words text-ink",
                f.mono
                  ? "font-mono text-[0.95rem] font-semibold sm:text-[1.05rem]"
                  : "font-display text-[1.2rem] font-medium tracking-[-0.02em] sm:text-[1.4rem]",
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

/* ---------- headings ---------- */

export function SectionHeading({
  id,
  n,
  children,
}: {
  id: string;
  n?: number;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="flex scroll-mt-28 items-baseline gap-3 font-display text-[1.6rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[1.95rem]"
    >
      {n !== undefined && (
        <span
          aria-hidden
          className="shrink-0 font-mono text-[0.85rem] font-semibold tracking-normal text-brand-blue"
        >
          {String(n).padStart(2, "0")}
        </span>
      )}
      <span>{children}</span>
    </h2>
  );
}

/* ---------- the brief ---------- */

export function Brief({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="takeaways">
      <SectionHeading id="takeaways">In brief</SectionHeading>
      <ol className={cn("mt-6 overflow-hidden rounded-xl border bg-white", LINE)}>
        {items.map((t, i) => (
          <li key={t} className={cn("flex gap-4 border-b px-5 py-4 last:border-b-0 sm:px-6", LINE)}>
            <span
              aria-hidden
              className="mt-[0.15rem] flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-cta-soft font-mono text-[0.7rem] font-semibold text-cta"
            >
              {i + 1}
            </span>
            <p className="min-w-0 text-[0.98rem] leading-relaxed text-ink/85">
              <Md text={t} />
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- checklist ---------- */

const IMPACT: Record<ChecklistItem["impact"], { label: string; className: string }> = {
  high: { label: "High impact", className: "bg-cta text-white" },
  medium: { label: "Medium", className: "bg-cta-soft text-cta" },
  low: { label: "Low", className: "border border-ink/[0.1] text-muted-foreground" },
};

export function Checklist({ slug, items }: { slug: string; items: ChecklistItem[] }) {
  const storageKey = `rankbox.ai-seo.checklist.${slug}`;
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const saved = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(saved)) setDone(saved.filter((id): id is string => typeof id === "string"));
    } catch {
      /* storage unavailable: start empty */
    }
  }, [storageKey]);

  const save = (next: string[]) => {
    setDone(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* storage unavailable: the ticks still work for this visit */
    }
  };
  const toggle = (id: string) =>
    save(done.includes(id) ? done.filter((d) => d !== id) : [...done, id]);
  const count = items.filter((i) => done.includes(i.id)).length;

  return (
    <section aria-labelledby="checklist" className="mt-16">
      <SectionHeading id="checklist">The Vibe checklist, in order</SectionHeading>
      <p className="mt-5 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.125rem]">
        Highest impact first. Ticks are saved in this browser only.
      </p>
      <div className={cn("mt-7 overflow-hidden rounded-xl border bg-white", LINE)}>
        <div className={cn("flex items-center gap-4 border-b px-5 py-3.5 sm:px-6", LINE, PANEL)}>
          <ListChecks aria-hidden className="h-4 w-4 text-cta" />
          <p className="flex-1 text-sm font-semibold text-ink">
            <span aria-live="polite">
              {count} of {items.length} done
            </span>
          </p>
          {/* One pixel per item, Mistral-mark style. */}
          <span aria-hidden className="hidden gap-1 sm:flex">
            {items.map((i) => (
              <span
                key={i.id}
                className={cn(
                  "h-2 w-2 rounded-[2px] transition-colors",
                  done.includes(i.id) ? "bg-cta" : "bg-ink/[0.1]",
                )}
              />
            ))}
          </span>
          {count > 0 && (
            <button
              type="button"
              onClick={() => save([])}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-ink"
            >
              <RotateCcw className="h-3 w-3" aria-hidden />
              Reset
            </button>
          )}
        </div>
        <ol>
          {items.map((item, i) => {
            const checked = done.includes(item.id);
            const impact = IMPACT[item.impact];
            return (
              <li key={item.id} className={cn("border-b last:border-b-0", LINE)}>
                <label className="flex cursor-pointer gap-4 px-5 py-4 transition-colors hover:bg-ink/[0.015] sm:px-6">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(item.id)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-cta/40 peer-focus-visible:ring-offset-2",
                      checked ? "border-cta bg-cta text-white" : "border-ink/[0.15] bg-white",
                    )}
                  >
                    {checked && <Check className="h-3 w-3" strokeWidth={3.5} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="font-mono text-[0.72rem] font-semibold text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-semibold leading-snug transition-colors",
                          checked
                            ? "text-muted-foreground line-through decoration-ink/30"
                            : "text-ink",
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "rounded-[5px] px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em]",
                          impact.className,
                        )}
                      >
                        {impact.label}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[0.92rem] leading-relaxed text-ink/70">
                      <Md text={item.detail} />
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------- questions ---------- */

export function QuestionsBand({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="flex flex-col lg:sticky lg:top-28">
              <Pill icon={HelpCircle} className="w-fit">
                {faqs.length} questions
              </Pill>
              <h2
                id="faq-title"
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
              >
                Vibe and Le Chat, <Accent>asked and answered</Accent>
              </h2>
            </div>
          </div>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="multiple"
              defaultValue={["q-0"]}
              className="divide-y divide-ink/[0.07]"
            >
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

/* ---------- tools for the checklist ---------- */

export function ToolShelf({ items }: { items: EngineGuide["furtherReading"] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="tool-shelf-title" className="mt-12">
      <h3
        id="tool-shelf-title"
        className="font-display text-[1.2rem] font-medium leading-snug tracking-[-0.02em] text-ink"
      >
        Free tools for the legwork
      </h3>
      <ul className={cn("mt-5 overflow-hidden rounded-xl border bg-white", LINE)}>
        {items.map((r) => (
          <li key={r.href} className={cn("border-b last:border-b-0", LINE)}>
            <Link
              to={r.href}
              className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-ink/[0.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-6"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug text-ink group-hover:text-cta">
                  {r.title}
                </span>
                <span className="mt-1 block text-[0.88rem] leading-relaxed text-muted-foreground">
                  {r.description}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
              />
            </Link>
          </li>
        ))}
      </ul>
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
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <div>
          <Pill icon={BookOpen}>Sources</Pill>
          <h2
            id="sources-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Where each claim comes from
          </h2>
        </div>
        <p className="max-w-sm text-[0.85rem] leading-relaxed text-muted-foreground">
          {sources.length} sources: Mistral&rsquo;s own docs and code first, then Brave, the studies
          and the analytics references.
        </p>
      </Band>
      <Band>
        <CellGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s, i) => (
            <li key={s.href} className={CELL}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col px-6 py-5 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <span className="flex items-center justify-between gap-3 text-[0.72rem] text-muted-foreground">
                  <span>
                    <span className="font-mono text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                    <span className="ml-2 font-medium">{s.publisher}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                  />
                </span>
                <span className="mt-1.5 text-[0.9rem] font-semibold leading-snug text-ink">
                  {s.title}
                </span>
                <span className="mt-auto truncate pt-2 font-mono text-[0.68rem] text-muted-foreground">
                  {hostOf(s.href)}
                </span>
              </a>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- the other guides ---------- */

export function OtherGuides({ current }: { current: string }) {
  const others = ENGINES.filter((e) => e.slug !== current);
  return (
    <section aria-labelledby="other-guides-title">
      <Spacer />
      <Band inner="flex items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <h2
          id="other-guides-title"
          className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          The other answer engines
        </h2>
        <Link
          to="/ai-seo"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.18]"
        >
          Compare all
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="grid-cols-2 lg:grid-cols-5">
          {others.map((e) => (
            <li key={e.slug} className={CELL}>
              <Link
                to="/ai-seo/$engine"
                params={{ engine: e.slug }}
                className="group flex h-full flex-col gap-3 p-5 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                    <EngineMark mark={e.mark} className="h-4 w-4" />
                  </span>
                  <span className="text-[0.9rem] font-semibold leading-tight text-ink group-hover:text-cta">
                    {e.shortName}
                  </span>
                </span>
                <span className="text-[0.78rem] leading-snug text-muted-foreground">
                  {e.tagline}
                </span>
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- offers ---------- */

/* Rankbox's part, said plainly: it researches and publishes. It doesn't
   monitor Vibe, so nothing here promises tracking. */
export function RailOffer() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
      <p className="font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        Publish pages an answer engine can quote
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
        Rankbox researches your buyers&rsquo; questions and publishes source-backed, answer-first
        articles on a schedule.
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

export function ClosingBand() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="closing-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2
            id="closing-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Write the pages Vibe can quote
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Rankbox finds the questions your buyers ask, writes source-backed articles with the
            answer up front, scores each one, and publishes on your schedule.
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
