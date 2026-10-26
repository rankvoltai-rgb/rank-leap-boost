/**
 * The page's last stretch: the questions, how the comparison was made and
 * every source behind it, the other head-to-heads, and the closing band.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight, ArrowUpRight, BookOpenCheck, Equal, HelpCircle, Plus } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Accent, Band, CELL, CellGrid, LINE, Pill, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import {
  getCategory,
  matchupTitle,
  relatedMatchups,
  sidesOf,
  MATCHUPS,
  type Matchup,
} from "@/data/compare/matchups";
import type { MatchupEntry, Source } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md, PairMarks } from "./parts";
import { SIDES, plural } from "./util";

/* ---------- FAQ ---------- */

export function Faq({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
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
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              {matchupTitle(matchup)}: <Accent>common questions</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-muted-foreground">
              {plural(entry.faqs.length, "question")}, answered from the{" "}
              <a href="#sources" className="text-ink underline underline-offset-4 hover:text-cta">
                sources below
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="multiple"
              defaultValue={["faq-0"]}
              className="divide-y divide-ink/[0.07]"
            >
              {entry.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-start gap-4 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      <span className="mt-0.5 w-6 shrink-0 text-[0.75rem] tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{f.q}</span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pl-10 pr-10 text-[0.9rem] leading-relaxed text-muted-foreground"
                  >
                    <Md text={f.a} />
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

/* ---------- Method and sources ---------- */

/** Sources grouped by publisher, in the order each publisher first appears. */
function byPublisher(sources: Source[]): [string, Source[]][] {
  const groups = new Map<string, Source[]>();
  for (const s of sources) groups.set(s.publisher, [...(groups.get(s.publisher) ?? []), s]);
  return [...groups.entries()];
}

export function Sources({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12",
              LINE,
            )}
          >
            <Pill icon={BookOpenCheck} className="w-fit">
              Method and sources
            </Pill>
            <h2
              id="sources-title"
              className="mt-5 font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            >
              {plural(entry.sources.length, "source")}, <Accent>all linked</Accent>
            </h2>
          </div>
          <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
            <h3 className="text-[0.95rem] font-medium text-ink">How we compared</h3>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
              From {sides.a.name}&rsquo;s and {sides.b.name}&rsquo;s own pricing pages,
              documentation and changelogs, plus dated third-party reporting, last read on{" "}
              <time dateTime={entry.pricing.checkedOn} className="font-medium text-ink">
                {formatDate(entry.pricing.checkedOn)}
              </time>
              . We haven&rsquo;t benchmarked either product ourselves, so where a round turns on
              judgment the verdict says so, and every factual claim traces to a source below.
              Rankbox makes a product in this space; it appears once, as the third option, and
              nowhere in the scoring.
            </p>
          </div>
        </div>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {byPublisher(entry.sources).map(([publisher, list]) => (
            <li key={publisher} className={cn(CELL, "px-6 py-7 sm:px-8")}>
              <p className="flex items-baseline justify-between gap-3">
                <span className="text-[0.9rem] font-medium text-ink">{publisher}</span>
                <span className="text-[0.72rem] tabular-nums text-muted-foreground">
                  {list.length}
                </span>
              </p>
              <ul className="mt-3 space-y-2">
                {list.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="group inline-flex items-start gap-1.5 text-[0.84rem] leading-snug text-muted-foreground transition-colors hover:text-cta"
                    >
                      <span className="underline decoration-ink/15 underline-offset-[3px] group-hover:decoration-cta/50">
                        {s.title}
                      </span>
                      <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Other head-to-heads ---------- */

/** Rows rather than cards: pair, title, score, and who each side is for. */
export function OtherMatchups({ matchup }: { matchup: Matchup }) {
  const others = relatedMatchups(matchup, MATCHUPS.length - 1);
  if (others.length === 0) return null;
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-10 sm:px-10 lg:px-12">
        <div>
          <h2
            id="others-title"
            className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Still shortlisting? <Accent>Other head-to-heads</Accent>
          </h2>
          <p className="mt-2 text-[0.92rem] text-muted-foreground">
            The same rounds, run on the other pairs people weigh.
          </p>
        </div>
        <Link
          to="/compare"
          className="group inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.18]"
        >
          All head-to-heads
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <ul className="divide-y divide-ink/[0.07]">
          {others.map((m) => {
            const s = sidesOf(m);
            return (
              <li key={m.slug}>
                <Link
                  to="/compare/$slug"
                  params={{ slug: m.slug }}
                  className="group grid items-center gap-x-6 gap-y-3 px-6 py-5 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_auto] lg:px-12"
                >
                  <span className="flex items-center gap-3.5">
                    <PairMarks a={s.a} b={s.b} />
                    <span className="min-w-0">
                      <span className="block text-[0.72rem] text-muted-foreground">
                        {getCategory(m.category).name}
                      </span>
                      <span className="block text-[1rem] font-medium tracking-tight text-ink group-hover:text-cta">
                        {matchupTitle(m)}
                      </span>
                    </span>
                  </span>
                  <span className="grid gap-1 text-[0.8rem] leading-snug text-muted-foreground">
                    {SIDES.map((side) => (
                      <span key={side} className="flex gap-2">
                        <ProductMark
                          product={s[side]}
                          className="mt-px h-4 w-4 shrink-0 text-[0.45rem]"
                        />
                        <span>
                          <span className="font-medium text-ink">{s[side].name}</span>:{" "}
                          {m.bestFor[side]}
                        </span>
                      </span>
                    ))}
                  </span>
                  <span className="flex items-center gap-3 md:justify-end">
                    <span
                      title={`Rounds won: ${s.a.name} ${m.tally.a}, ${s.b.name} ${m.tally.b}`}
                      className="inline-flex items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.75rem] font-medium tabular-nums text-ink"
                    >
                      {m.tally.a}&ndash;{m.tally.b}
                      {m.tally.draw > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                          <Equal className="ml-1 h-3 w-3" aria-hidden />
                          {m.tally.draw}
                          <span className="sr-only"> {plural(m.tally.draw, "draw")}</span>
                        </span>
                      )}
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="h-4 w-4 text-muted-foreground transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-cta"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}

/* ---------- Closing band ---------- */

/**
 * The closing ask, kept to what happens next: paste a URL and onboarding
 * reads the site and shows its content gaps, competitors and topics. The
 * trial takes a card, so the note under the form says only what's true.
 */
export function ClosingCta() {
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
        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <Reveal className="flex flex-col items-center">
            <h2
              id="closing-title"
              className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
            >
              Rather have the articles than another tool?
            </h2>
            <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white/85">
              Paste your URL. Rankbox reads your site and shows the content gaps, the competitors
              you&rsquo;re up against, and the topics it would write first.
            </p>
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <UrlForm url={url} onChange={setUrl} />
              <p className="text-[0.85rem] text-white/85">{TRIAL_NOTE}</p>
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
