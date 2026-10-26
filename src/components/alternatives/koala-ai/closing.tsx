/**
 * The end of /alternatives/koala-ai: the questions, the paper trail, where
 * else to look, and the closing band. The closing band echoes the meter: the
 * thirty article tiles rise from its lower edge, cropped by it.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowUpRight, BookCheck, Compass, FileText, HelpCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  Pill,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, VsLockup } from "@/components/alternatives/kit";
import { COMPANY } from "@/data/company";
import { PLAN } from "@/data/pricing";
import { MATCHUPS, matchupTitle } from "@/data/compare/matchups";
import {
  COMPETITORS,
  KIND_LABEL,
  formatCheckedOn,
  getCompetitor,
  type Competitor,
} from "@/data/alternatives";
import { RulerTicks } from "./parts";
import { displayUrl } from "./tokens";

/* ---------- FAQ ---------- */

export function KoalaFAQ({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal
            className={cn(
              "flex flex-col border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2
              id="faq-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
            >
              Rankbox vs {c.name}, <Accent>answered</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              The questions people ask before switching from {c.name}. Every {c.name} detail is from
              its own pages, linked in the sources below.
            </p>
            <VsLockup competitor={c} size="sm" className="mt-8 hidden lg:flex" />
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {c.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center gap-4 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      <span className="w-6 shrink-0 text-[0.75rem] font-semibold tabular-nums text-muted-foreground group-data-[state=open]:text-brand-blue">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{f.q}</span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                        <Plus className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pl-10 pr-10 text-sm leading-relaxed text-muted-foreground"
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

/* ---------- Sources ---------- */

export function KoalaSources({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const checked = formatCheckedOn(c.pricing.checkedOn);
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <Band>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal
            className={cn(
              "min-w-0 border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={BookCheck}>Sources</Pill>
            <h2
              id="sources-title"
              className="mt-5 font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            >
              How this comparison <Accent>was checked</Accent>
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Every {c.name} fact on this page comes from {c.name}&rsquo;s own public pages, read on{" "}
              {checked}. Anything we could not confirm there is left out. Rankbox facts describe
              what ships today, not what is planned.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Spotted something out of date?{" "}
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Correction: Rankbox vs ${c.name}`)}`}
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
              >
                Email {COMPANY.email}
              </a>{" "}
              and we will fix the row.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="min-w-0">
            <ol className="divide-y divide-ink/[0.07]">
              {c.sources.map((src, i) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener nofollow"
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-10"
                  >
                    <span className="w-5 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9rem] font-medium text-ink">{src.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {displayUrl(src.url)}
                      </span>
                    </span>
                    <span className="hidden shrink-0 text-[0.72rem] text-muted-foreground sm:block">
                      Read {checked}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Other comparisons ---------- */

/* The other tools founders shortlist, the same kind of tool first, and any
   head-to-head page this competitor appears in. */
export function OtherComparisons({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const others = COMPETITORS.filter((o) => o.slug !== c.slug).sort(
    (a, b) => Number(b.kind === c.kind) - Number(a.kind === c.kind),
  );
  const headToHead = MATCHUPS.filter((m) => m.a === c.slug || m.b === c.slug);

  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Pill icon={Compass}>More comparisons</Pill>
            <h2
              id="others-title"
              className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
            >
              Comparing <Accent>something else?</Accent>
            </h2>
            <p className="mt-2 text-[0.95rem] text-muted-foreground">
              The same questions, asked of the other tools founders shortlist.
            </p>
          </div>
          <Link to="/alternatives" className={cn(GHOST_BUTTON, "w-fit shrink-0")}>
            All alternatives
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </Band>

      {headToHead.length > 0 && (
        <Band>
          <ul>
            {headToHead.map((m) => {
              const side = m.a === c.slug ? m.b : m.a;
              const rival = getCompetitor(side);
              return (
                <li key={m.slug} className={cn("border-b last:border-b-0", LINE)}>
                  <Link
                    to="/compare/$slug"
                    params={{ slug: m.slug }}
                    className="group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-10 lg:px-12"
                  >
                    <span className="flex shrink-0 -space-x-1.5">
                      <CompetitorMark competitor={c} className="h-8 w-8 ring-2 ring-white" />
                      {rival && (
                        <CompetitorMark competitor={rival} className="h-8 w-8 ring-2 ring-white" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-brand-blue">
                        Head to head
                      </span>
                      <span className="block text-[0.98rem] font-semibold text-ink">
                        {matchupTitle(m)}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Band>
      )}

      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <li key={o.slug} className={CELL}>
              <Link
                to="/alternatives/$slug"
                params={{ slug: o.slug }}
                className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <span className="flex items-center justify-between gap-3">
                  <CompetitorMark competitor={o} className="h-9 w-9" />
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                  />
                </span>
                <span className="mt-4 text-[0.98rem] font-semibold tracking-tight text-ink">
                  Rankbox vs {o.name}
                </span>
                <span className="mt-1 text-[0.8rem] leading-snug text-muted-foreground">
                  {o.category}
                </span>
                {o.kind === c.kind && (
                  <span className="mt-3 w-fit rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.68rem] font-medium text-cta">
                    {KIND_LABEL[o.kind]}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Closing band ---------- */

export function KoalaCTA({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <RulerTicks edge="top" onBlue />
        <div className="relative px-5 pt-16 text-center sm:px-8 sm:pt-20">
          <Reveal>
            <div className="flex justify-center">
              <VsLockup competitor={c} onDark size="sm" />
            </div>
            <h2
              id="cta-title"
              className="mx-auto mt-6 max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              {c.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white/85 sm:text-[1.05rem]">
              {c.ctaBody}
            </p>
            <div className="mx-auto mt-8 flex max-w-xl justify-center">
              <UrlForm url={url} onChange={setUrl} />
            </div>
            <p className="mt-3.5 text-[0.85rem] text-white/85">{TRIAL_NOTE}</p>
          </Reveal>

          {/* A month of articles, rising from the band's foot. */}
          <div
            aria-hidden
            className="mx-auto mt-12 grid max-w-xl translate-y-3 grid-cols-10 gap-1.5 sm:mt-14"
          >
            {Array.from({ length: PLAN.articlesPerMonth }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "flex aspect-[4/5] items-center justify-center rounded-[4px] bg-white text-cta shadow-[0_6px_18px_-8px_rgba(4,24,72,0.55)]",
                  i >= 20 && "opacity-90",
                )}
              >
                <FileText className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
            ))}
          </div>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
