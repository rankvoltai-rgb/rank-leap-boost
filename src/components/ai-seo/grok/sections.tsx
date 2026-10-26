/**
 * The Grok guide's bands and article parts. Every visitor-facing sentence
 * comes from the guide's content file; what's written here is structure —
 * labels, counts and the Rankbox offer.
 */
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Globe,
  HelpCircle,
  ListChecks,
  Quote,
  Sparkles,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Band, CELL, CellGrid, LINE, Pill, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { EngineTile, Md } from "@/components/ai-seo/kit";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { ENGINES, type Engine } from "@/data/ai-seo/engines";
import type { ChecklistItem, EngineGuide, Faq, Source } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import { XGlyph } from "./SplitAnswer";

/* ---------- the short answer + spec band ---------- */

export function ShortAnswerBand({ guide }: { guide: EngineGuide }) {
  return (
    <section aria-labelledby="short-answer-title">
      <Band inner="grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div
          className={cn(
            "border-b px-5 py-6 sm:px-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-10",
            LINE,
          )}
        >
          <Pill icon={Quote}>
            <span id="short-answer-title">The short answer</span>
          </Pill>
        </div>
        <p className="px-5 py-7 font-display text-[1.15rem] font-normal leading-[1.6] tracking-[-0.01em] text-ink sm:px-10 sm:text-[1.3rem] lg:px-12 lg:py-10 [&_strong]:font-semibold [&_strong]:text-brand-blue">
          <Md text={guide.shortAnswer} />
        </p>
      </Band>
      <Band>
        <CellGrid className="grid-cols-2 lg:grid-cols-4">
          {guide.facts.map((f) => (
            <li key={f.label} className={cn(CELL, "px-5 py-6 sm:px-8")}>
              <dl className="flex flex-col-reverse">
                <dt className="mt-2 text-[0.8rem] leading-snug text-muted-foreground">{f.label}</dt>
                <dd
                  className={cn(
                    "text-ink",
                    f.mono
                      ? "font-mono text-[1.05rem] font-medium sm:text-[1.2rem]"
                      : "font-display text-[1.6rem] font-medium leading-none tracking-[-0.03em] sm:text-[1.9rem]",
                  )}
                >
                  {f.value}
                </dd>
              </dl>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- takeaways ---------- */

export function Takeaways({ items }: { items: string[] }) {
  return (
    <section id="takeaways" aria-labelledby="takeaways-title" className="mb-14 scroll-mt-28">
      <h2
        id="takeaways-title"
        className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
      >
        Key takeaways
      </h2>
      <ol className="mt-4 divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
        {items.map((t, i) => (
          <li key={t} className="flex gap-4 py-4">
            <span className="mt-0.5 font-mono text-[0.75rem] font-semibold text-cta">
              {String(i + 1).padStart(2, "0")}
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

/* ---------- section heading, tagged with the half it serves ---------- */

export type Half = "x" | "web" | "both" | "context";

const HALF: Record<Half, { label: string; icon: ReactNode; className: string }> = {
  x: {
    label: "X half",
    icon: <XGlyph className="h-2.5 w-2.5" />,
    className: "bg-ink/[0.05] text-ink/75",
  },
  web: {
    label: "Web half",
    icon: <Globe className="h-3 w-3" />,
    className: "bg-cta-soft text-cta",
  },
  both: {
    label: "Both halves",
    icon: (
      <>
        <XGlyph className="h-2.5 w-2.5" />
        <Globe className="h-3 w-3" />
      </>
    ),
    className: "bg-cta-soft text-cta",
  },
  context: {
    label: "Context",
    icon: <BookOpen className="h-3 w-3" />,
    className: "bg-ink/[0.05] text-ink/70",
  },
};

export function SectionHeading({
  id,
  index,
  half,
  children,
}: {
  id: string;
  index: number;
  half?: Half;
  children: string;
}) {
  const h = half ? HALF[half] : undefined;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.75rem] font-semibold text-ink/35">
          {String(index).padStart(2, "0")}
        </span>
        <span aria-hidden className="h-px w-6 bg-ink/[0.12]" />
        {h && (
          <span
            className={cn(
              "inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-[0.7rem] font-medium",
              h.className,
            )}
          >
            {h.icon}
            {h.label}
          </span>
        )}
      </div>
      <h2
        id={`${id}-title`}
        className="text-balance font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
      >
        {children}
      </h2>
    </div>
  );
}

/* ---------- checklist ---------- */

const IMPACT: Record<ChecklistItem["impact"], string> = {
  high: "High impact",
  medium: "Medium impact",
  low: "Worth doing",
};

export function Checklist({ slug, items }: { slug: string; items: ChecklistItem[] }) {
  const storageKey = `rankbox.ai-seo.checklist.${slug}`;
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setDone(JSON.parse(raw) as string[]);
    } catch {
      /* storage unavailable */
    }
  }, [storageKey]);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  };

  const count = items.filter((i) => done.includes(i.id)).length;
  const groups = (["high", "medium", "low"] as const)
    .map((impact) => ({ impact, items: items.filter((i) => i.impact === impact) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
          <div
            className="h-full rounded-full bg-cta transition-[width] duration-300"
            style={{ width: `${(count / items.length) * 100}%` }}
          />
        </div>
        <p className="shrink-0 text-[0.78rem] font-medium text-muted-foreground" aria-live="polite">
          {count} of {items.length} done · saved in this browser
        </p>
      </div>
      <div className="mt-6 space-y-6">
        {groups.map((g) => (
          <div key={g.impact}>
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {IMPACT[g.impact]}
            </p>
            <ul className="divide-y divide-ink/[0.06] overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
              {g.items.map((c) => {
                const on = done.includes(c.id);
                return (
                  <li key={c.id}>
                    <label className="flex cursor-pointer gap-3.5 px-4 py-3.5 transition-colors hover:bg-ink/[0.015]">
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
                          on ? "border-cta bg-cta text-white" : "border-ink/[0.18] bg-white",
                        )}
                      >
                        {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block font-medium leading-snug text-ink",
                            on && "text-ink/50 line-through decoration-ink/25",
                          )}
                        >
                          {c.title}
                        </span>
                        <span className="mt-1 block text-[0.88rem] leading-relaxed text-muted-foreground">
                          <Md text={c.detail} />
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- FAQ band ---------- */

export function FaqBand({ faqs, engineName }: { faqs: Faq[]; engineName: string }) {
  return (
    <section aria-labelledby="faq-title">
      <Spacer />
      <Band id="faq" className="scroll-mt-16">
        <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="flex flex-col lg:sticky lg:top-28">
              <Pill icon={HelpCircle} className="w-fit">
                FAQ
              </Pill>
              <h2
                id="faq-title"
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
              >
                {engineName} SEO, <span className="font-bold text-brand-blue">answered</span>
              </h2>
              <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
                The questions site owners ask about Grok, answered in a few sentences each.
              </p>
            </div>
          </div>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="multiple" className="divide-y divide-ink/[0.07]">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-[0.95rem] leading-none text-ink transition-[transform,background-color,color,border-color] duration-300 group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                        +
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-[0.92rem] leading-relaxed text-muted-foreground"
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

/* ---------- sources band ---------- */

function host(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function SourcesBand({ sources, checked }: { sources: Source[]; checked: string }) {
  return (
    <section aria-labelledby="sources-title">
      <Spacer />
      <Band
        id="sources"
        className="scroll-mt-16"
        inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12"
      >
        <div>
          <Pill icon={BookOpen}>Sources</Pill>
          <h2
            id="sources-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            {sources.length} sources behind this guide
          </h2>
        </div>
        <p className="max-w-xs text-[0.85rem] leading-relaxed text-muted-foreground">{checked}</p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s, i) => (
            <li key={s.href} className={CELL}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full gap-3 px-5 py-3 transition-colors hover:bg-ink/[0.015] sm:px-6 sm:py-4"
              >
                <span className="mt-0.5 font-mono text-[0.7rem] font-semibold text-ink/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    {s.publisher}
                  </span>
                  <span className="mt-1 block text-[0.88rem] font-medium leading-snug text-ink group-hover:text-cta">
                    {s.title}
                  </span>
                  <span className="mt-1 block truncate font-mono text-[0.7rem] text-muted-foreground">
                    {host(s.href)}
                  </span>
                </span>
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/30 transition-[color,transform] group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-cta" />
              </a>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- the other guides ---------- */

export function OtherGuidesBand({ current }: { current: Engine }) {
  const others = ENGINES.filter((e) => e.slug !== current.slug);
  return (
    <section aria-labelledby="other-guides-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <h2
          id="other-guides-title"
          className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          The same question, <span className="font-bold text-brand-blue">engine by engine</span>
        </h2>
        <Link
          to="/ai-seo"
          className="group inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-cta transition-colors hover:text-cta-hover"
        >
          Compare all engines
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
                className="group flex h-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-ink/[0.015] sm:items-start sm:px-5 sm:py-4"
              >
                <EngineTile engine={e} className="h-8 w-8 rounded-lg" />
                <span className="min-w-0">
                  <span className="block text-[0.88rem] font-semibold text-ink group-hover:text-cta">
                    {e.shortName}
                  </span>
                  <span className="mt-0.5 hidden text-[0.76rem] leading-snug text-muted-foreground sm:block">
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

/* ---------- the Rankbox offer: rail card and closing band ---------- */

const OFFER =
  "Rankbox researches the questions your buyers ask, writes source-backed articles, scores them and publishes on a schedule.";

export function RailNote() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cta-soft text-cta">
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <p className="mt-4 font-display text-[1.02rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        Pages worth citing, every week
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">{OFFER}</p>
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
    <section aria-labelledby="grok-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <span className="flex items-center gap-2 rounded-lg bg-white/10 px-2.5 py-1 text-[0.78rem] font-medium text-white ring-1 ring-white/25">
            <ListChecks className="h-3.5 w-3.5" />
            Both halves start with a page
          </span>
          <h2
            id="grok-cta-title"
            className="mt-6 text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Give Grok something worth citing
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            {OFFER}
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
