/**
 * The Copilot guide's sections around the article text: the hero, the spec
 * band, the essentials, the setup run, sources, FAQ, further reading and the
 * offers. All in the landing page's frame.
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
  MessageSquareQuote,
  Plus,
  Workflow,
} from "lucide-react";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { Md } from "@/components/ai-seo/kit";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
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
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import type { Engine } from "@/data/ai-seo/engines";
import type { ChecklistItem, EngineGuide, Faq, Source } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { GroundingLoop } from "./GroundingLoop";
import { PROSE } from "./blocks";

/* ---------- hero ---------- */

export function CopilotHero({
  engine,
  guide,
  readingMinutes,
}: {
  engine: Engine;
  guide: EngineGuide;
  readingMinutes: number;
}) {
  return (
    <section id="top" aria-labelledby="guide-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="px-5 pb-10 pt-6 motion-safe:animate-hero-rise sm:px-10 lg:py-12 lg:pl-12 lg:pr-10">
            <EngineRail active={guide.slug} />
            <nav aria-label="Breadcrumb" className="mt-7">
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-muted-foreground">
                <li>
                  <Link to="/" className="py-1 transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
                <li>
                  <Link to="/ai-seo" className="py-1 transition-colors hover:text-ink">
                    AI SEO guides
                  </Link>
                </li>
                <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
                <li aria-current="page" className="font-medium text-cta">
                  {engine.shortName}
                </li>
              </ol>
            </nav>
            <h1
              id="guide-title"
              className="mt-4 text-balance font-display text-[2.15rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink sm:text-[2.8rem] lg:text-[3.05rem]"
            >
              {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
            </h1>
            <p className="mt-5 max-w-[40rem] text-[1.04rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">
              {guide.subhead}
            </p>
            <ul className="mt-7 flex flex-col gap-1.5 text-[0.8rem] text-ink/60 sm:flex-row sm:items-center sm:gap-0">
              <li className="sm:pr-3">
                Updated{" "}
                <time dateTime={engine.updated} className="font-medium text-ink">
                  {formatDate(engine.updated)}
                </time>
              </li>
              <li className={cn("sm:border-l sm:px-3", LINE)}>{readingMinutes} min read</li>
              <li className={cn("sm:border-l sm:pl-3", LINE)}>
                <a
                  href="#sources"
                  className="font-medium text-cta underline-offset-4 hover:underline"
                >
                  {guide.sources.length} sources, most of them Microsoft&rsquo;s
                </a>
              </li>
            </ul>
          </div>

          <aside
            aria-labelledby="short-answer-title"
            className={cn(
              "flex flex-col justify-center border-t px-5 py-8 motion-safe:animate-hero-rise sm:px-10 lg:border-l lg:border-t-0 lg:px-10",
              LINE,
              PANEL,
            )}
            style={{ "--rise-delay": "0.08s" } as CSSProperties}
          >
            <Pill icon={MessageSquareQuote} className="w-fit">
              <span id="short-answer-title">The short answer</span>
            </Pill>
            <p className="mt-4 text-[1rem] leading-[1.7] text-ink sm:text-[1.04rem]">
              <Md text={guide.shortAnswer} />
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="#checklist" className={GHOST_BUTTON}>
                <ListChecks aria-hidden className="h-3.5 w-3.5 text-cta" />
                The setup, in order
              </a>
              <a href="#faq" className={GHOST_BUTTON}>
                <HelpCircle aria-hidden className="h-3.5 w-3.5 text-cta" />
                Questions
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* The page's one picture: how a Copilot citation is made. */}
      <Band>
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-8 lg:px-7",
            LINE,
          )}
        >
          <Pill icon={Workflow}>How a Copilot citation is made</Pill>
          <p className="text-[0.8rem] text-ink/55">Prompt, query, index, answer, report</p>
        </div>
        <GroundingLoop preview={guide.preview} />
      </Band>
    </section>
  );
}

/* ---------- spec band ---------- */

export function FactBand({ guide }: { guide: EngineGuide }) {
  return (
    <Band>
      <CellGrid className="grid-cols-2 lg:grid-cols-4">
        {guide.facts.map((f) => (
          <li key={f.label} className={cn(CELL, "px-5 py-5 sm:px-7 sm:py-6")}>
            <p className="text-[0.78rem] leading-snug text-ink/55">{f.label}</p>
            <p
              className={cn(
                "mt-2 text-ink",
                f.mono
                  ? "font-mono text-[1.05rem] font-medium sm:text-[1.2rem]"
                  : "font-display text-[1.15rem] font-medium tracking-[-0.02em] sm:text-[1.35rem]",
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

/* ---------- article headings ---------- */

export function GuideH2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 text-balance font-display text-[1.6rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[1.95rem]"
    >
      {children}
    </h2>
  );
}

/* ---------- the essentials ---------- */

export function Essentials({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="takeaways" className={cn("rounded-xl border", LINE)}>
      <div className={cn("border-b px-5 py-4 sm:px-6", LINE, PANEL)}>
        <h2
          id="takeaways"
          className="scroll-mt-28 font-display text-[1.15rem] font-medium tracking-[-0.02em] text-ink"
        >
          What to know before you start
        </h2>
      </div>
      <ul className="divide-y divide-ink/[0.07]">
        {items.map((t) => (
          <li key={t} className="flex gap-3 px-5 py-3.5 sm:px-6">
            <span aria-hidden className="mt-[0.62rem] h-1.5 w-3 shrink-0 rounded-full bg-cta" />
            <span className="text-[0.98rem] leading-relaxed text-ink/85">
              <Md text={t} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- the setup, in order ---------- */

const IMPACT: Record<ChecklistItem["impact"], { label: string; className: string }> = {
  high: { label: "High impact", className: "bg-cta text-white" },
  medium: { label: "Medium", className: "bg-cta-soft text-cta" },
  low: { label: "Low", className: "bg-ink/[0.05] text-ink/60" },
};

const STORE = "rankbox.ai-seo.copilot.checklist";

export function SetupRun({ items }: { items: ChecklistItem[] }) {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORE) ?? "[]");
      if (Array.isArray(saved)) setDone(saved.filter((s) => typeof s === "string"));
    } catch {
      /* storage unavailable: start empty */
    }
  }, []);
  const toggle = (id: string) => {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id];
      try {
        window.localStorage.setItem(STORE, JSON.stringify(next));
      } catch {
        /* storage unavailable: progress lasts for this visit only */
      }
      return next;
    });
  };
  const count = items.filter((i) => done.includes(i.id)).length;

  return (
    <div className={cn("mt-8 overflow-hidden rounded-xl border", LINE)}>
      <div
        className={cn("flex items-center justify-between gap-4 border-b px-5 py-3", LINE, PANEL)}
      >
        <p className="text-[0.82rem] text-ink/70" aria-live="polite">
          <span className="font-medium text-ink">{count}</span> of {items.length} done
        </p>
        <div aria-hidden className="h-1.5 w-32 overflow-hidden rounded-full bg-ink/[0.07]">
          <div
            className="h-full rounded-full bg-cta transition-[width] duration-300"
            style={{ width: `${(count / items.length) * 100}%` }}
          />
        </div>
      </div>
      <ol>
        {items.map((item, i) => {
          const checked = done.includes(item.id);
          const impact = IMPACT[item.impact];
          return (
            <li
              key={item.id}
              id={`step-${item.id}`}
              className={cn("border-b last:border-b-0", LINE)}
            >
              <label className="flex cursor-pointer gap-3.5 px-5 py-4 transition-colors hover:bg-ink/[0.015]">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(item.id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border font-mono text-[0.66rem] font-medium transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-cta/40",
                    checked ? "border-cta bg-cta text-white" : "border-ink/15 bg-white text-ink/50",
                  )}
                >
                  {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span
                      className={cn(
                        "font-medium leading-snug transition-colors",
                        checked ? "text-ink/45 line-through decoration-ink/25" : "text-ink",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[0.68rem] font-medium",
                        impact.className,
                      )}
                    >
                      {impact.label}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.92rem] leading-relaxed text-ink/70">
                    <Md text={item.detail} />
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- sources ---------- */

const MICROSOFT_HOSTS = /(^|\.)(bing\.com|microsoft\.com)$/;

function host(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function SourceGroup({ title, sources }: { title: string; sources: Source[] }) {
  return (
    <div>
      <h3 className="text-[0.95rem] font-medium text-ink">
        {title} <span className="font-normal text-ink/45">({sources.length})</span>
      </h3>
      <ol className={cn("mt-3 overflow-hidden rounded-xl border", LINE)}>
        {sources.map((s) => (
          <li key={s.href} className={cn("border-b last:border-b-0", LINE)}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-4 px-4 py-3 transition-colors hover:bg-cta-soft/60"
            >
              <span className="min-w-0">
                <span className="block text-[0.9rem] leading-snug text-ink group-hover:text-cta">
                  {s.title}
                </span>
                <span className="mt-0.5 block text-[0.76rem] text-ink/50">
                  {s.publisher} <span className="text-ink/30">/</span> {host(s.href)}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/30 group-hover:text-cta"
              />
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SourceList({ sources }: { sources: Source[] }) {
  const microsoft = sources.filter((s) => MICROSOFT_HOSTS.test(host(s.href)));
  const others = sources.filter((s) => !MICROSOFT_HOSTS.test(host(s.href)));
  return (
    <section aria-labelledby="sources" className="mt-20">
      <GuideH2 id="sources">Sources</GuideH2>
      <p className={cn("mt-4", PROSE)}>
        Every claim above links to one of these. Microsoft&rsquo;s own pages come first; studies and
        reporting are marked as observed in the text.
      </p>
      <div className="mt-8 space-y-8">
        <SourceGroup title="Microsoft and Bing" sources={microsoft} />
        <SourceGroup title="Independent studies, protocols and reporting" sources={others} />
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function FaqBand({ faqs }: { faqs: Faq[] }) {
  return (
    <section aria-labelledby="faq" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "flex flex-col justify-start border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2
              id="faq"
              className="mt-5 scroll-mt-28 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              Copilot and your site, <Accent>briefly</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              The questions site owners ask most, answered from Microsoft&rsquo;s documentation.
              Sources are listed with the guide above.
            </p>
          </div>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="multiple" className="divide-y divide-ink/[0.07]">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                        <Plus aria-hidden className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-[0.94rem] leading-relaxed text-ink/75"
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

/* ---------- further reading ---------- */

export function FurtherReading({ guide }: { guide: EngineGuide }) {
  return (
    <section aria-labelledby="further-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <div>
          <Pill icon={BookOpen}>Go deeper</Pill>
          <h2
            id="further-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Tools and guides for the Bing side of AI search
          </h2>
        </div>
        <Link to="/ai-seo" className={cn(GHOST_BUTTON, "group/btn shrink-0")}>
          All AI SEO guides
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {guide.furtherReading.map((r) => (
            <li key={r.href} className={CELL}>
              <Link
                to={r.href}
                className="group flex h-full flex-col px-6 py-6 transition-colors hover:bg-cta-soft/50 sm:px-7"
              >
                <span className="font-medium text-ink group-hover:text-cta">{r.title}</span>
                <span className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-ink/65">
                  {r.description}
                </span>
                <ArrowRight
                  aria-hidden
                  className="mt-4 h-4 w-4 text-cta transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- offers ---------- */

/* What Rankbox does, said plainly. It doesn't monitor Copilot, so neither
   offer claims to. */
const OFFER =
  "Rankbox finds the questions your buyers ask AI, writes source-backed, answer-first articles, scores each one before it ships and publishes on your schedule.";

export function RailOffer() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)] [@media(max-height:979px)]:hidden">
      <p className="font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        Publish pages Bing can ground on
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
        Answer-first, source-backed articles, researched, written and published on your schedule.
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
    <section aria-labelledby="copilot-cta-title">
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
            id="copilot-cta-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Give Copilot pages worth quoting
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            {OFFER}
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
