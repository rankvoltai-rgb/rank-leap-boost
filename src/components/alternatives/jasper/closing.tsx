/**
 * The page's second half: how switching works, the questions, the paper
 * trail, where to read next, and the closing band.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BookCheck,
  Check,
  HelpCircle,
  LayoutGrid,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  LINE_FILL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark, VsLockup } from "@/components/alternatives/kit";
import { COMPANY } from "@/data/company";
import { COMPETITORS, formatCheckedOn, type Competitor } from "@/data/alternatives";
import { MATCHUPS, matchupTitle } from "@/data/compare/matchups";
import { SCREEN, displayUrl } from "./helpers";
import { AccentTail } from "./parts";

/* ---------- Switching ---------- */

export function Switching({ competitor }: { competitor: Competitor }) {
  const m = competitor.migration;
  return (
    <section aria-labelledby="switch-title">
      <Spacer />
      <SectionHead
        icon={ArrowLeftRight}
        eyebrow="Switching"
        title={
          <span id="switch-title">
            <AccentTail text={m.title} />
          </span>
        }
        subtitle={m.body}
      />
      <Band>
        <ol className={cn("grid gap-px md:grid-cols-3", LINE_FILL)}>
          {m.steps.map((s, i) => (
            <li key={s.title} className="relative bg-white">
              <Reveal delay={i * 0.07} className="h-full px-6 py-8 sm:px-8 sm:py-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/[0.08] bg-white font-display text-[1.1rem] font-medium tabular-nums text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-[1.05rem] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
              {i < m.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-[3.25rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.06)] sm:top-[3.75rem] md:flex"
                >
                  <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Every answer is force-mounted, so it is in the server HTML the FAQPage
   schema is built from, and hidden with CSS while closed. */
export function JasperFAQ({ competitor }: { competitor: Competitor }) {
  const odd = competitor.faqs.length % 2 === 1;
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <span id="faq-title">
            Rankbox vs {competitor.name}, <Accent>answered</Accent>
          </span>
        }
        subtitle={`The questions people ask before switching from ${competitor.name}.`}
      />
      <Band>
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}
        >
          {competitor.faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className={cn(
                "border-b-0 bg-white px-6 sm:px-8 lg:px-10",
                odd && i === competitor.faqs.length - 1 && "md:col-span-2",
              )}
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-start justify-between gap-6 py-6 text-left text-[0.98rem] font-medium leading-snug text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                  {f.q}
                  <span className="mt-[-1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-cta group-data-[state=open]:bg-cta group-data-[state=open]:text-white">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent
                forceMount
                className="pb-6 pr-8 text-[0.9rem] leading-relaxed text-muted-foreground"
              >
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Band>
    </section>
  );
}

/* ---------- Sources ---------- */

export function Sources({ competitor }: { competitor: Competitor }) {
  const checked = formatCheckedOn(competitor.pricing.checkedOn);
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal
            className={cn(
              "min-w-0 border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={BookCheck}>Sources</Pill>
            <h2
              id="sources-title"
              className="mt-5 font-display text-[1.75rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            >
              How this comparison <Accent>was checked</Accent>
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Every {competitor.name} fact on this page comes from {competitor.name}&rsquo;s own
              public pages, read on {checked}. Anything we could not confirm there is left out.
              Rankbox facts describe what ships today, not what is planned.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Spotted something out of date?{" "}
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Correction: Rankbox vs ${competitor.name}`)}`}
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
              >
                Email {COMPANY.email}
              </a>{" "}
              and we will fix the row.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="min-w-0">
            <p className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-6 py-4 text-[0.8rem] text-muted-foreground sm:px-10">
              <span>
                {competitor.sources.length} pages on {competitor.domain}
              </span>
              <span className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.72rem] font-semibold text-cta">
                Checked {checked}
              </span>
            </p>
            <ol className="divide-y divide-ink/[0.07]">
              {competitor.sources.map((src, i) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener nofollow"
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_45%,white)] sm:px-10"
                  >
                    <span className="w-6 shrink-0 text-[0.75rem] font-semibold tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.92rem] font-medium text-ink">{src.label}</span>
                      <span className="block truncate text-[0.78rem] text-muted-foreground">
                        {displayUrl(src.url)}
                      </span>
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

export function OtherComparisons({ competitor }: { competitor: Competitor }) {
  const others = COMPETITORS.filter((c) => c.slug !== competitor.slug);
  const headToHead = MATCHUPS.filter((m) => m.a === competitor.slug || m.b === competitor.slug);
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <Pill icon={LayoutGrid}>More comparisons</Pill>
        <h2
          id="others-title"
          className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          Comparing something else?
        </h2>
        <p className="mt-2 text-[0.95rem] text-muted-foreground">
          The same questions, asked of the other tools founders shortlist.
        </p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {others.map((c) => (
            <li key={c.slug} className={CELL}>
              <Link
                to="/alternatives/$slug"
                params={{ slug: c.slug }}
                className="group flex h-full items-center gap-3.5 px-6 py-5 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <CompetitorMark competitor={c} className="h-9 w-9" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9rem] font-medium text-ink">
                    Rankbox vs {c.name}
                  </span>
                  <span className="block truncate text-[0.76rem] text-muted-foreground">
                    {c.category}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                />
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
      {headToHead.map((m) => (
        <Band key={m.slug}>
          <Link
            to="/compare/$slug"
            params={{ slug: m.slug }}
            className="group grid gap-3 px-6 py-6 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-10 lg:grid-cols-[14rem_minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:px-12"
          >
            <span>
              <span className="block text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Head to head
              </span>
              <span className="mt-1 block text-[1rem] font-semibold tracking-tight text-ink">
                {matchupTitle(m)}
              </span>
            </span>
            <span className="grid gap-1.5 text-[0.85rem] leading-snug text-muted-foreground sm:grid-cols-2 sm:gap-6">
              <span>{m.bestFor.a}</span>
              <span>{m.bestFor.b}</span>
            </span>
            <ArrowUpRight
              aria-hidden
              className="hidden h-4 w-4 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue lg:block"
            />
          </Link>
        </Band>
      ))}
    </section>
  );
}

/* ---------- Closing band ---------- */

const WEEK = [
  { day: "Mon", status: "ready" },
  { day: "Tue", status: "ready" },
  { day: "Wed", status: "ready" },
  { day: "Thu", status: "writing" },
  { day: "Fri", status: "planned" },
  { day: "Sat", status: "planned" },
  { day: "Sun", status: "planned" },
] as const;

const STATUS = {
  ready: { label: "Ready", cls: "bg-cta-soft text-cta" },
  writing: { label: "Writing", cls: "bg-cta text-white" },
  planned: { label: "Planned", cls: "border border-ink/[0.08] text-muted-foreground" },
} as const;

/* A sample week of the queue, for yoursite.com: skeleton articles only, no
   titles or results. */
function SampleWeek() {
  return (
    <div className={cn(SCREEN, "rounded-b-none text-left")}>
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-3">
        <span className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
          <RankboxMark className="h-6 w-6" />
          yoursite.com
        </span>
        <span className="rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Sample week
        </span>
      </div>
      <ol className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-7 sm:p-4">
        {WEEK.map((d, i) => {
          const s = STATUS[d.status];
          return (
            <li
              key={d.day}
              className={cn(
                "flex flex-col gap-2 rounded-lg border border-ink/[0.07] bg-white p-2.5",
                i >= 4 && "hidden sm:flex",
                d.status === "writing" && "border-cta/35",
              )}
            >
              <span className="text-[0.68rem] font-medium text-muted-foreground">{d.day}</span>
              <span className="h-1.5 w-full rounded-full bg-ink/15" />
              <span className="h-1.5 w-2/3 rounded-full bg-ink/10" />
              <span
                className={cn(
                  "mt-1 inline-flex w-fit items-center gap-1 rounded px-1.5 py-0.5 text-[0.6rem] font-semibold",
                  s.cls,
                )}
              >
                {d.status === "ready" && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ClosingBand({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_40%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <div className="relative px-5 pt-14 text-center sm:px-8 sm:pt-20">
          <Reveal>
            <div className="flex justify-center">
              <VsLockup competitor={competitor} onDark size="sm" />
            </div>
            <h2
              id="cta-title"
              className="mx-auto mt-6 max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
            >
              {competitor.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white/90 sm:text-[1.05rem]">
              {competitor.ctaBody}
            </p>
            <div className="mx-auto mt-8 flex max-w-xl justify-center">
              <UrlForm url={url} onChange={setUrl} />
            </div>
            <p className="mt-3.5 text-[0.85rem] text-white/90">{TRIAL_NOTE}</p>
          </Reveal>
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[10.5rem] max-w-3xl overflow-hidden sm:mt-14 sm:h-[11rem]"
          >
            <SampleWeek />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
