/**
 * The end of /alternatives/surfer-seo: the FAQ (answers in the server HTML,
 * since the route's FAQPage schema is built from them), the sources the page
 * was checked against, the other comparisons, and the closing band.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowUpRight, BookCheck, GitCompareArrows, HelpCircle, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { UrlForm } from "@/components/landing/Hero";
import { Reveal } from "@/components/landing/shared";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, VsLockup } from "@/components/alternatives/kit";
import { COMPANY } from "@/data/company";
import { matchupTitle, getCategory } from "@/data/compare/matchups";
import { cn } from "@/lib/utils";
import { COMPETITORS, KIND_LABEL, formatCheckedOn, type Competitor } from "@/data/alternatives";
import { displayUrl, headToHeads } from "./text";

/* ---------- FAQ ---------- */

export function FaqSection({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <span id="faq-title">
            Rankbox vs {c.name}, <Accent>answered</Accent>
          </span>
        }
        subtitle={`The questions people ask before switching from ${c.name}.`}
      />
      <Band>
        <Reveal className="mx-auto max-w-3xl px-5 py-4 sm:px-8 sm:py-6">
          <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
            {c.faqs.map((f, i) => (
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
      </Band>
    </section>
  );
}

/* ---------- Sources ---------- */

/* Where testimonials would go on another page. A comparison earns trust by
   being checkable: the competitor's own pages, the date they were read, and
   an address for a stale row. The same links go out as `citation` in the
   page schema. */
export function SourcesSection({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal
            className={cn(
              "min-w-0 border-b px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={BookCheck} className="w-fit">
              Sources
            </Pill>
            <h2
              id="sources-title"
              className="mt-5 text-balance font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            >
              How this comparison <Accent>was checked</Accent>
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Every {c.name} fact on this page comes from {c.name}&rsquo;s own public pages, read on{" "}
              {formatCheckedOn(c.pricing.checkedOn)}. Anything we could not confirm there is left
              out. Rankbox facts describe what ships today, not what is planned.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Spotted something out of date?{" "}
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Correction: Rankbox vs ${c.name}`)}`}
                className="whitespace-nowrap font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
              >
                Email {COMPANY.email}
              </a>{" "}
              and we will fix the row.
            </p>
          </Reveal>

          <ol className="min-w-0 divide-y divide-ink/[0.07]">
            {c.sources.map((src, i) => (
              <li key={src.url}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="group flex items-center gap-4 px-5 py-4 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-10 lg:px-12"
                >
                  <span className="w-5 shrink-0 text-[0.72rem] font-medium tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.92rem] font-medium text-ink">{src.label}</span>
                    <span className="block truncate text-[0.76rem] text-muted-foreground">
                      {displayUrl(src.url)}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                  />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Other comparisons ---------- */

/* Someone weighing one tool is usually weighing two: the other Rankbox
   comparisons, then the head-to-heads this competitor appears in. */
export function OtherComparisons({ competitor }: { competitor: Competitor }) {
  const others = COMPETITORS.filter((o) => o.slug !== competitor.slug);
  const matchups = headToHeads(competitor);
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-5 py-10 sm:px-10 lg:px-12">
        <div>
          <Pill icon={GitCompareArrows}>More comparisons</Pill>
          <h2
            id="others-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Comparing something else?
          </h2>
        </div>
        <Link
          to="/alternatives"
          className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-ink transition-colors hover:text-brand-blue"
        >
          All comparisons
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <li key={o.slug} className={CELL}>
              <Link
                to="/alternatives/$slug"
                params={{ slug: o.slug }}
                className="group flex h-full items-center gap-3.5 px-5 py-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-6"
              >
                <CompetitorMark competitor={o} className="h-9 w-9" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9rem] font-semibold text-ink">
                    Rankbox vs {o.name}
                  </span>
                  <span className="block truncate text-[0.75rem] text-muted-foreground">
                    {KIND_LABEL[o.kind]}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                />
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
      {matchups.length > 0 && (
        <Band>
          <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-10 lg:px-12">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Head-to-head
            </span>
            <ul className="flex flex-wrap gap-2">
              {matchups.map((m) => (
                <li key={m.slug}>
                  <Link
                    to="/compare/$slug"
                    params={{ slug: m.slug }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color] hover:border-ink/[0.18] hover:bg-ink/[0.02]"
                  >
                    {matchupTitle(m)}
                    <span className="text-muted-foreground">· {getCategory(m.category).name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Band>
      )}
    </section>
  );
}

/* ---------- Closing band ---------- */

/* A blue band in the rails (--cta, so white body text passes AA), the
   month's tiles returning as a faint row along its foot, and the form on a
   white card so its blue button keeps its contrast. */
export function ClosingBand({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  const c = competitor;
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-1.5 opacity-[0.16] [mask-image:linear-gradient(to_right,transparent,#000_20%,#000_80%,transparent)]"
        >
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} className="h-3.5 w-3.5 shrink-0 rounded-[3px] bg-white" />
          ))}
        </div>

        <Reveal className="relative px-5 pb-16 pt-14 text-center sm:px-8 sm:pb-20 sm:pt-16">
          <div className="flex justify-center">
            <VsLockup competitor={c} onDark size="sm" />
          </div>
          <h2
            id="cta-title"
            className="mx-auto mt-6 max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            {c.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            {c.ctaBody}
          </p>
          <div className="mx-auto mt-8 max-w-[38rem] rounded-xl bg-white p-2.5 shadow-[0_1px_2px_rgba(4,24,72,0.2),0_18px_40px_-18px_rgba(4,24,72,0.55)]">
            <UrlForm url={url} onChange={setUrl} variant="split" />
          </div>
          <p className="mt-4 text-[0.85rem] text-white">{TRIAL_NOTE}</p>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
