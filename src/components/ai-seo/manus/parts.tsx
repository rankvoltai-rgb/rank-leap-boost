/**
 * The Manus guide's bands below the article: the checklist, the questions,
 * the sources, where to read next, the rail offer and the closing band.
 */
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  HelpCircle,
  ListChecks,
  Plus,
} from "lucide-react";
import { Md } from "@/components/ai-seo/kit";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Band, CELL, CellGrid, LINE, Pill, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Mark as BrandMark } from "@/components/brand/Mark";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import type { ChecklistItem, EngineGuide, Faq, Source } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";

const H2 =
  "font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]";

/* ---------- checklist ---------- */

const IMPACT: { key: ChecklistItem["impact"]; label: string; note: string }[] = [
  { key: "high", label: "Do first", note: "Access and extraction" },
  { key: "medium", label: "Then", note: "Structure, bursts and measurement" },
  { key: "low", label: "Finish with", note: "Policy and polish" },
];

export function ChecklistBand({ items }: { items: ChecklistItem[] }) {
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const groups = useMemo(
    () =>
      IMPACT.map((g) => ({ ...g, items: items.filter((i) => i.impact === g.key) })).filter(
        (g) => g.items.length > 0,
      ),
    [items],
  );
  const pct = Math.round((done.size / items.length) * 100);

  return (
    <section id="checklist" aria-labelledby="checklist-title" className="scroll-mt-28">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-24">
              <Pill icon={ListChecks}>Checklist</Pill>
              <h2 id="checklist-title" className={cn(H2, "mt-5")}>
                The Manus checklist
              </h2>
              <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
                {items.length} steps in the order they pay off. Tick them off as you go; nothing is
                saved or sent.
              </p>
              <div className="mt-7 max-w-xs">
                <div className="flex items-baseline justify-between text-[0.8rem]">
                  <span className="font-medium text-ink">
                    {done.size} of {items.length} done
                  </span>
                  <span className="font-mono text-muted-foreground">{pct}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                  <div
                    className="h-full rounded-full bg-cta transition-[width] duration-300 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-10 lg:px-12 lg:py-10">
            {groups.map((g) => (
              <div key={g.key} className="mt-6 first:mt-0">
                <p className="flex items-baseline gap-2">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cta">
                    {g.label}
                  </span>
                  <span className="text-[0.75rem] text-muted-foreground">{g.note}</span>
                </p>
                <ul className="mt-2 divide-y divide-ink/[0.07]">
                  {g.items.map((c) => {
                    const on = done.has(c.id);
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => toggle(c.id)}
                          className="group flex w-full gap-3.5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2"
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                              on
                                ? "border-cta bg-cta text-white"
                                : "border-ink/[0.18] bg-white text-transparent group-hover:border-cta/50",
                            )}
                          >
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="min-w-0">
                            <span
                              className={cn(
                                "block font-medium leading-snug transition-colors",
                                on ? "text-ink/50 line-through decoration-ink/30" : "text-ink",
                              )}
                            >
                              {c.title}
                            </span>
                            <span className="mt-1 block text-[0.9rem] leading-relaxed text-muted-foreground">
                              <Md text={c.detail} />
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
        </div>
      </Band>
    </section>
  );
}

/* ---------- questions ---------- */

export function FaqBand({ faqs, engineName }: { faqs: Faq[]; engineName: string }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-28">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-24">
              <Pill icon={HelpCircle} className="w-fit">
                FAQ
              </Pill>
              <h2 id="faq-title" className={cn(H2, "mt-5")}>
                {engineName} questions, answered
              </h2>
            </div>
          </div>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="single"
              collapsible
              defaultValue="faq-0"
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
                    className="max-w-2xl pb-5 pr-10 text-[0.93rem] leading-relaxed text-muted-foreground"
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

export function SourcesBand({ sources, checked }: { sources: Source[]; checked: string }) {
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-28">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-9 sm:px-10 lg:px-12">
        <div>
          <Pill icon={BookOpen}>Sources</Pill>
          <h2 id="sources-title" className={cn(H2, "mt-4")}>
            Where every claim comes from
          </h2>
        </div>
        <p className="text-[0.85rem] text-muted-foreground">
          {sources.length} sources · last checked {checked}
        </p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s, i) => (
            <li key={s.href} className={CELL}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener"
                className="group flex h-full gap-3 px-6 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <span className="w-6 shrink-0 pt-0.5 font-mono text-[0.7rem] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9rem] font-medium leading-snug text-ink group-hover:text-cta">
                    {s.title}
                  </span>
                  <span className="mt-1 block truncate text-[0.75rem] text-muted-foreground">
                    {s.publisher} · {host(s.href)}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                />
              </a>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- read next ---------- */

export function ReadNextBand({ links }: { links: EngineGuide["furtherReading"] }) {
  return (
    <section aria-labelledby="read-next-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <h2
          id="read-next-title"
          className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          Read next
        </h2>
        <Link
          to="/ai-seo"
          className="group inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color] hover:border-ink/[0.18] hover:bg-ink/[0.02]"
        >
          All AI SEO guides
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {links.map((r) => (
            <li key={r.href} className={CELL}>
              <Link
                to={r.href}
                className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <span className="flex items-center justify-between gap-3 text-[1rem] font-semibold leading-snug tracking-tight text-ink">
                  {r.title}
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                  />
                </span>
                <span className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  {r.description}
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

/* Rankbox, for what it does: research, writing, scoring, publishing. It
   doesn't monitor Manus, so nothing here says it does. */
const OFFER_TITLE = "Publish pages an agent can finish on";
const OFFER_BODY =
  "Rankbox researches the questions your buyers ask AI, writes source-backed articles with the facts in plain text, scores each one and publishes on a schedule.";

export function RailOffer() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft">
        <BrandMark className="h-4 w-4 text-brand-blue" />
      </span>
      <p className="mt-4 font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        {OFFER_TITLE}
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">{OFFER_BODY}</p>
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
    <section aria-labelledby="manus-cta-title">
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
            id="manus-cta-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            {OFFER_TITLE}
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            {OFFER_BODY}
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
