/**
 * Everything after the DeepSeek guide's last section: the work list (in the
 * reading column), then the FAQ, the sources, the way on to other guides and
 * the closing band — each in the landing page's railed frame.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight, ArrowUpRight, BookOpen, Check, HelpCircle, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Md, EngineMark } from "@/components/ai-seo/kit";
import { Band, CELL, CellGrid, LINE, Pill, Spacer } from "@/components/landing/frame";
import { MarkDither } from "@/components/landing/hero-dither";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { ENGINES } from "@/data/ai-seo/engines";
import type { EngineGuide } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";

const IMPACT: Record<EngineGuide["checklist"][number]["impact"], string> = {
  high: "bg-cta text-white",
  medium: "bg-cta-soft text-cta",
  low: "bg-ink/[0.05] text-ink/60",
};

/* ---------- work list ---------- */

/* Tickable, for a reader working through it on the page. Nothing is stored. */
export function WorkList({ items }: { items: EngineGuide["checklist"] }) {
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const flip = (id: string) =>
    setDone((d) => {
      const next = new Set(d);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <section id="checklist" aria-labelledby="checklist-title" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[0.72rem] font-semibold text-cta">✓</p>
          <h2
            id="checklist-title"
            className="mt-2 font-display text-[1.65rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[2rem]"
          >
            Your DeepSeek work list
          </h2>
        </div>
        <p className="text-[0.8rem] tabular-nums text-muted-foreground" aria-live="polite">
          {done.size} of {items.length} done
        </p>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-ink/[0.06]">
        <div
          className="h-full origin-left bg-cta transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: `scaleX(${done.size / items.length})` }}
        />
      </div>
      <ol className="mt-6 overflow-hidden rounded-xl border border-ink/[0.08]">
        {items.map((c, i) => {
          const on = done.has(c.id);
          return (
            <li key={c.id} className={cn("bg-white", i > 0 && "border-t border-ink/[0.06]")}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => flip(c.id)}
                className="grid w-full cursor-pointer grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3.5 px-4 py-4 text-left transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-5"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                    on ? "border-cta bg-cta text-white" : "border-ink/20 bg-white text-transparent",
                  )}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span
                      className={cn(
                        "font-semibold leading-snug text-ink transition-colors",
                        on && "text-ink/45 line-through decoration-ink/25",
                      )}
                    >
                      {c.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em]",
                        IMPACT[c.impact],
                      )}
                    >
                      {c.impact}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.92rem] leading-relaxed text-ink/70">
                    <Md text={c.detail} />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Rankaria's split FAQ. Answers are force-mounted, so every one is in the
   server HTML (and matches the FAQPage schema) even while closed. */
export function GuideFaq({ faqs }: { faqs: EngineGuide["faqs"] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-28">
              <Pill icon={HelpCircle}>FAQ</Pill>
              <h2
                id="faq-title"
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
              >
                DeepSeek SEO questions
              </h2>
              <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-muted-foreground">
                {faqs.length} answers, sourced like the rest of the guide.
              </p>
            </div>
          </div>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="multiple"
              defaultValue={["faq-0"]}
              className="divide-y divide-ink/[0.07]"
            >
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-b-0">
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
                    className="max-w-2xl pb-5 pr-10 text-[0.94rem] leading-relaxed text-ink/70"
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

function host(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function SourceCells({ items }: { items: EngineGuide["sources"] }) {
  return (
    <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <li key={s.href} className={CELL}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col px-5 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-5 sm:px-6"
          >
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {s.publisher}
            </span>
            <span className="mt-1.5 flex-1 text-[0.9rem] font-medium leading-snug text-ink transition-colors group-hover:text-cta">
              {s.title}
            </span>
            <span className="mt-3 hidden items-center gap-1 font-mono text-[0.7rem] text-muted-foreground sm:inline-flex">
              {host(s.href)}
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            </span>
          </a>
        </li>
      ))}
    </CellGrid>
  );
}

/* DeepSeek's own documents first, then everyone else's: the reader can see
   at a glance which claims rest on the vendor's word. */
export function GuideSources({ sources }: { sources: EngineGuide["sources"] }) {
  const own = sources.filter((s) => s.publisher.startsWith("DeepSeek"));
  const others = sources.filter((s) => !s.publisher.startsWith("DeepSeek"));
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
            {sources.length} sources behind this guide
          </h2>
        </div>
      </Band>
      <Band inner="px-6 py-3 sm:px-10 lg:px-12">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-cta">
          DeepSeek's own documents · {own.length}
        </p>
      </Band>
      <Band>
        <SourceCells items={own} />
      </Band>
      <Band inner="px-6 py-3 sm:px-10 lg:px-12">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Independent research and reporting · {others.length}
        </p>
      </Band>
      <Band>
        <SourceCells items={others} />
      </Band>
    </section>
  );
}

/* ---------- onward ---------- */

export function MoreGuides({ guide }: { guide: EngineGuide }) {
  const engines = ENGINES.filter((e) => e.slug !== guide.slug);
  return (
    <section aria-labelledby="onward-title">
      <Spacer />
      <Band inner="px-6 py-8 sm:px-10 lg:px-12">
        <h2
          id="onward-title"
          className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          Go further
        </h2>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {guide.furtherReading.map((r) => (
            <li key={r.href} className={CELL}>
              <a
                href={r.href}
                className="group flex h-full flex-col p-6 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <span className="font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-cta">
                  {r.title}
                </span>
                <span className="mt-2 flex-1 text-[0.86rem] leading-relaxed text-muted-foreground">
                  {r.description}
                </span>
                <ArrowRight className="mt-4 h-4 w-4 text-cta transition-transform group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </CellGrid>
      </Band>
      <Band inner="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:px-10 lg:px-12">
        <p className="shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Other engine guides
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {engines.map((e) => (
            <li key={e.slug}>
              <Link
                to="/ai-seo/$engine"
                params={{ engine: e.slug }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white pl-1.5 pr-2.5 text-[0.78rem] font-medium text-ink/80 transition-colors hover:border-cta/30 hover:text-cta"
              >
                <EngineMark mark={e.mark} className="h-3.5 w-3.5" />
                {e.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}

/* ---------- closing ---------- */

export function ClosingBand() {
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
        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2
            id="closing-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Turn this guide into published pages
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Rankbox researches the questions your buyers ask, writes dated, source-backed articles,
            scores them, and publishes them on your schedule.
          </p>
          <a
            href="/auth"
            className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            Start free trial
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <p className="mt-3 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
