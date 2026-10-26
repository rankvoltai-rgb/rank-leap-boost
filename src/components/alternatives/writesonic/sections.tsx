/**
 * The rest of /alternatives/writesonic, in the landing frame: where Writesonic
 * is the better buy, the three places Rankbox does the work itself, running
 * the two together, the FAQ, the paper trail, the other comparisons, and the
 * closing band.
 *
 * Every visitor-facing sentence here is read from the competitor entry; what
 * this file adds is structure and short labels.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileSearch,
  HelpCircle,
  Layers,
  Plus,
  Repeat,
  Scale,
  Swords,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, VsLockup } from "@/components/alternatives/kit";
import { ProductMark } from "@/components/compare/kit";
import { COMPANY } from "@/data/company";
import { getFeature } from "@/data/features";
import {
  COMPETITORS,
  KIND_BLURB,
  KIND_LABEL,
  formatCheckedOn,
  type Competitor,
  type CompetitorKind,
} from "@/data/alternatives";
import { matchupTitle, matchupsFor, sidesOf } from "@/data/compare/matchups";
import type { ProductSlug } from "@/data/compare/products";
import { cn } from "@/lib/utils";
import { displayUrl, splitAccent } from "./lib";

/* ---------- When they win ---------- */

export function WritesonicBetterWhen({ competitor: c }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="better-title">
      <Spacer />
      <SectionHead
        icon={Scale}
        eyebrow="The honest part"
        title={
          <span id="better-title">
            When {c.name} is <Accent>the better choice</Accent>
          </span>
        }
        subtitle={`We'd rather you picked the right tool than churned in a month. ${c.name} is genuinely the better buy in these cases.`}
      />
      <Band>
        <CellGrid className="lg:grid-cols-3">
          {c.betterWhen.map((w, i) => (
            <li key={w.title} className={cn(CELL, "bg-white")}>
              <Reveal delay={i * 0.06} className="flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <CompetitorMark competitor={c} className="h-9 w-9" />
                  <span className="font-display text-[0.95rem] font-medium tabular-nums text-ink/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-[1.08rem] font-semibold leading-snug tracking-tight text-ink">
                  {w.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{w.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- The three deep dives ---------- */

export function WritesonicBattlegrounds({ competitor: c }: { competitor: Competitor }) {
  const title =
    c.battlegroundsTitle ?? `Three things Rankbox does that ${c.name} doesn't set out to`;
  const { lead, accent } = splitAccent(title);
  return (
    <section aria-labelledby="decided-title">
      <Spacer />
      <SectionHead
        icon={Swords}
        eyebrow="Where it's decided"
        title={
          <span id="decided-title">
            {lead} <Accent>{accent}</Accent>
          </span>
        }
        subtitle={
          c.battlegroundsIntro ??
          "Not a longer list of features — the three that change what actually happens on your site."
        }
      />
      {c.battlegrounds.map((b, i) => {
        const feature = getFeature(b.featureSlug);
        const Icon = b.icon;
        return (
          <Band key={b.title}>
            <div className="grid lg:grid-cols-[7rem_1fr_1fr]">
              <div
                className={cn(
                  "flex items-center gap-3 border-b px-6 py-5 lg:flex-col lg:items-start lg:border-b-0 lg:border-r lg:px-8 lg:py-10",
                  LINE,
                )}
              >
                <span className="font-display text-[2rem] font-medium leading-none tracking-[-0.04em] text-brand-blue tabular-nums lg:text-[2.6rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <Reveal className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
                <h3 className="text-balance font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.7rem]">
                  {b.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
                {feature && (
                  <Link
                    to="/features/$slug"
                    params={{ slug: feature.slug }}
                    className={cn(GHOST_BUTTON, "mt-6")}
                  >
                    How {feature.name} works
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </Reveal>
              <div
                className={cn(
                  "flex items-center border-t px-5 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-10",
                  LINE,
                  PANEL,
                )}
              >
                <Reveal delay={0.06} className="w-full">
                  <ul className="divide-y divide-ink/[0.06] overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
                    {b.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex gap-3 px-4 py-3.5 text-[0.88rem] leading-snug text-ink"
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                          <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </Band>
        );
      })}
    </section>
  );
}

/* ---------- Running the two together ---------- */

export function WritesonicRunningBoth({ competitor: c }: { competitor: Competitor }) {
  const m = c.migration;
  const { lead, accent } = splitAccent(m.title);
  return (
    <section aria-labelledby="both-title">
      <Spacer />
      <SectionHead
        icon={Repeat}
        eyebrow="Using both"
        title={
          <span id="both-title">
            {lead} <Accent>{accent}</Accent>
          </span>
        }
        subtitle={m.body}
      >
        <div className="mt-7 flex justify-center">
          <VsLockup competitor={c} size="sm" />
        </div>
      </SectionHead>
      <Band>
        <ol className="grid md:grid-cols-3">
          {m.steps.map((s, i) => (
            <li
              key={s.title}
              className={cn(
                "relative border-t first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0",
                LINE,
              )}
            >
              <Reveal delay={i * 0.07} className="flex h-full flex-col p-6 sm:p-8 lg:p-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cta font-display text-[1.05rem] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)]">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-[1.1rem] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
              {i < m.steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute -right-3 top-12 z-10 hidden h-6 w-6 items-center justify-center rounded-full border bg-white text-ink/50 md:flex",
                    LINE,
                  )}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
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

/* Title left, questions right, each on a hairline with a plus that turns into
   a cross. Answers are force-mounted so they're in the server HTML that the
   route's FAQPage schema describes. */
export function WritesonicFAQ({ competitor: c }: { competitor: Competitor }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal
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
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
            >
              Rankbox vs {c.name}, <Accent>answered</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              The questions people ask when weighing Rankbox against {c.name}.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
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
        </div>
      </Band>
    </section>
  );
}

/* ---------- Sources ---------- */

/* The paper trail: the competitor's own pages every fact came from, the date
   they were read, and an address to report a stale row. The same links go
   out as `citation` in the page schema. */
export function WritesonicSources({ competitor: c }: { competitor: Competitor }) {
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal
            className={cn(
              "min-w-0 border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={FileSearch}>Sources</Pill>
            <h2
              id="sources-title"
              className="mt-5 font-display text-[1.7rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
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
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
              >
                Email {COMPANY.email}
              </a>{" "}
              and we will fix the row.
            </p>
          </Reveal>

          <ol className="min-w-0">
            {c.sources.map((src, i) => (
              <li key={src.url} className={cn("border-b last:border-b-0", LINE)}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_45%,white)] sm:px-10 lg:px-12"
                >
                  <span className="w-6 shrink-0 font-display text-[0.85rem] font-medium tabular-nums text-ink/35">
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
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
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

/* ---------- The other comparisons ---------- */

const KIND_ORDER: CompetitorKind[] = ["autopilot", "writer", "optimizer", "visibility"];

/* Grouped by what each tool is for, so a visitor sees which are really the
   same kind of thing, then the head-to-heads this one appears in. */
export function WritesonicOtherComparisons({ competitor: c }: { competitor: Competitor }) {
  const groups = KIND_ORDER.map((kind) => ({
    kind,
    list: COMPETITORS.filter((o) => o.kind === kind && o.slug !== c.slug),
  })).filter((g) => g.list.length > 0);
  const matchups = matchupsFor(c.slug as ProductSlug);

  const labelCell = cn(
    "flex flex-col justify-center border-b px-6 py-6 sm:px-8 lg:border-b-0 lg:border-r",
    LINE,
  );
  const linkCell =
    "group flex h-full items-center gap-3.5 p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-6";

  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <Pill icon={Layers}>More comparisons</Pill>
        <h2
          id="others-title"
          className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          Comparing <Accent>something else?</Accent>
        </h2>
        <p className="mt-2 text-[0.95rem] text-muted-foreground">
          The same questions, asked of the other tools founders shortlist.
        </p>
      </Band>

      {groups.map(({ kind, list }) => (
        <Band key={kind}>
          <div className="grid lg:grid-cols-[17rem_1fr]">
            <div className={labelCell}>
              <h3 className="text-[0.98rem] font-semibold tracking-tight text-ink">
                {KIND_LABEL[kind]}
              </h3>
              <p className="mt-1 text-[0.82rem] leading-snug text-muted-foreground">
                {KIND_BLURB[kind]}
              </p>
            </div>
            <CellGrid className="sm:grid-cols-2 xl:grid-cols-3">
              {list.map((o) => (
                <li key={o.slug} className={CELL}>
                  <Link to="/alternatives/$slug" params={{ slug: o.slug }} className={linkCell}>
                    <CompetitorMark competitor={o} className="h-10 w-10" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9rem] font-medium text-ink">
                        Rankbox vs {o.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.78rem] text-muted-foreground">
                        {o.category}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </CellGrid>
          </div>
        </Band>
      ))}

      <Band>
        <div className="grid lg:grid-cols-[17rem_1fr]">
          <div className={labelCell}>
            <h3 className="text-[0.98rem] font-semibold tracking-tight text-ink">Head-to-heads</h3>
            <p className="mt-1 text-[0.82rem] leading-snug text-muted-foreground">
              {c.name} weighed against another tool, round by round.
            </p>
          </div>
          <CellGrid className="sm:grid-cols-2 xl:grid-cols-3">
            {matchups.map((m) => {
              const { a, b } = sidesOf(m);
              return (
                <li key={m.slug} className={CELL}>
                  <Link to="/compare/$slug" params={{ slug: m.slug }} className={linkCell}>
                    <span className="flex shrink-0 -space-x-2">
                      <ProductMark product={a} className="h-10 w-10 ring-2 ring-white" />
                      <ProductMark product={b} className="h-10 w-10 ring-2 ring-white" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9rem] font-medium text-ink">
                        {matchupTitle(m)}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.78rem] text-muted-foreground">
                        Head-to-head
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </Link>
                </li>
              );
            })}
            <li className={CELL}>
              <Link to="/compare" className={linkCell}>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9rem] font-medium text-ink">
                    All head-to-heads
                  </span>
                  <span className="mt-0.5 block text-[0.78rem] text-muted-foreground">
                    /compare
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            </li>
            <li className={CELL}>
              <Link to="/alternatives" className={linkCell}>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9rem] font-medium text-ink">All alternatives</span>
                  <span className="mt-0.5 block text-[0.78rem] text-muted-foreground">
                    /alternatives
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            </li>
          </CellGrid>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Closing band ---------- */

/* The landing's closing band: blue inside the rails, the dithered mark in
   white behind it. The URL field sits on a white card, so its blue button
   keeps its contrast, and the trial line sits under it. */
export function WritesonicCTA({ competitor: c }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <div className="relative grid items-center gap-10 px-5 py-14 sm:px-10 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-20">
          <Reveal>
            <VsLockup competitor={c} size="sm" onDark />
            <h2
              id="cta-title"
              className="mt-6 max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
            >
              {c.ctaTitle}
            </h2>
            <p className="mt-4 max-w-lg text-[1rem] leading-relaxed text-white/90 sm:text-[1.05rem]">
              {c.ctaBody}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(4,24,72,0.2),0_24px_48px_-20px_rgba(4,24,72,0.5)] sm:p-6">
              <p className="text-[0.95rem] font-medium text-ink">Start with your site</p>
              <div className="mt-4">
                <UrlForm url={url} onChange={setUrl} variant="split" />
              </div>
              <p className="mt-3 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
