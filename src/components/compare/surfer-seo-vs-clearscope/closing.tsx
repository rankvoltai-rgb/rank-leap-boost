/**
 * The page's last bands: the disclosed third option, the questions, how the
 * comparison was made and every source, the other head-to-heads, and the
 * closing ask.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight, ArrowUpRight, BookOpen, Check, HelpCircle, Layers, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
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
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { ProductMark, RankboxTile, jumpTo } from "@/components/compare/kit";
import { COMPETITOR_SLUGS } from "@/data/alternatives";
import {
  RANKBOX_PRICE_LINE,
  RANKBOX_SHIPS,
  getCategory,
  matchupTitle,
  relatedMatchups,
  sidesOf,
  type Matchup,
} from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md, PairMarks } from "./parts";
import { SIDES, hostOf, plural } from "./util";

/* ---------- the third option ---------- */

/**
 * Rankbox, disclosed, once, after the whole comparison. It says who wrote
 * the page, and claims RANKBOX_SHIPS and nothing else.
 */
export function ThirdOption({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const ours = SIDES.map((s) => sides[s]).filter((p) =>
    (COMPETITOR_SLUGS as readonly string[]).includes(p.slug),
  );

  return (
    <section id="third-option" aria-labelledby="third-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal className="px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
            <div className="flex items-center gap-3">
              <RankboxTile className="h-9 w-9" />
              <p className="text-[0.78rem] font-medium text-muted-foreground">
                A third option · from the team that wrote this page
              </p>
            </div>
            <h2
              id="third-title"
              className="mt-6 text-balance font-display text-[1.8rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]"
            >
              {entry.thirdOption.title}
            </h2>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
              <Md text={entry.thirdOption.body} />
            </p>
          </Reveal>

          <div
            className={cn(
              "flex flex-col justify-center border-t px-5 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-10",
              LINE,
              PANEL,
            )}
          >
            <Reveal delay={0.06}>
              <p className="text-[0.78rem] font-medium text-muted-foreground">
                What Rankbox does today
              </p>
              <ul
                className={cn(
                  "mt-3 divide-y overflow-hidden rounded-xl border bg-white",
                  LINE,
                  "divide-ink/[0.07]",
                )}
              >
                {RANKBOX_SHIPS.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 px-4 py-3 text-[0.88rem] leading-snug text-ink"
                  >
                    <span className="mt-px flex h-[1.1rem] w-[1.1rem] shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-start gap-x-6 gap-y-4">
                <div>
                  <Link
                    to="/features"
                    className="group inline-flex h-11 items-center gap-2 rounded-lg bg-cta px-5 text-[0.92rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
                  >
                    See how Rankbox works
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <p className="mt-2.5 text-[0.78rem] text-muted-foreground">{TRIAL_NOTE}</p>
                </div>
                <div className="space-y-1.5 pt-1">
                  <p className="text-[0.84rem] font-medium text-ink">{RANKBOX_PRICE_LINE}</p>
                  {ours.map((p) => (
                    <Link
                      key={p.slug}
                      to="/alternatives/$slug"
                      params={{ slug: p.slug }}
                      className="group flex items-center gap-1.5 text-[0.84rem] font-medium text-cta"
                    >
                      Rankbox vs {p.name}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function Faq({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
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
              className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              {matchupTitle(matchup)}: <Accent>common questions</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
              {plural(entry.faqs.length, "question")}, answered from the same{" "}
              <a
                href="#sources"
                onClick={(e) => jumpTo(e, "sources")}
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink/60"
              >
                sources
              </a>{" "}
              as the rest of the page.
            </p>
          </div>

          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="divide-y divide-ink/[0.07]"
            >
              {entry.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-cta group-data-[state=open]:bg-cta group-data-[state=open]:text-white">
                        <Plus className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-[0.9rem] leading-relaxed text-muted-foreground"
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

/* ---------- method and sources ---------- */

export function Sources({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <section aria-labelledby="sources" className="scroll-mt-16">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <Pill icon={BookOpen}>Sources</Pill>
            <h2
              id="sources"
              className="mt-5 scroll-mt-24 font-display text-[1.7rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2rem]"
            >
              How this was <Accent>compared</Accent>
            </h2>
          </div>
          <p className="text-[0.92rem] leading-relaxed text-muted-foreground lg:pt-12">
            From {sides.a.name}&rsquo;s and {sides.b.name}&rsquo;s own pricing pages, documentation
            and changelogs, plus dated third-party reporting, last read on{" "}
            <time dateTime={entry.pricing.checkedOn} className="font-medium text-ink">
              {formatDate(entry.pricing.checkedOn)}
            </time>
            . We haven&rsquo;t benchmarked either product ourselves, so where a round turns on
            judgment the verdict says so, and every factual claim traces to a source below. Rankbox
            makes a product in this space; it appears once, as the third option, and nowhere in the
            scoring.
          </p>
        </div>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {entry.sources.map((s, i) => (
            <li key={s.href} className={CELL}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full gap-3 px-5 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-6"
              >
                <span className="w-5 shrink-0 pt-px text-right text-[0.75rem] tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.86rem] font-medium leading-snug text-ink decoration-ink/30 underline-offset-4 group-hover:underline">
                    {s.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-[0.75rem] text-muted-foreground">
                    <span className="truncate">
                      {s.publisher} · {hostOf(s.href)}
                    </span>
                    <ArrowUpRight
                      className="h-3 w-3 shrink-0 transition-colors group-hover:text-cta"
                      aria-hidden
                    />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- the other head-to-heads ---------- */

export function OtherComparisons({ matchup }: { matchup: Matchup }) {
  const related = relatedMatchups(matchup);
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="related-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-10 sm:px-10 lg:px-12">
        <div>
          <Pill icon={Layers}>Still shortlisting?</Pill>
          <h2
            id="related-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            The same rounds, <Accent>other pairs</Accent>
          </h2>
        </div>
        <Link
          to="/compare"
          className="group inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-ink hover:text-cta"
        >
          All head-to-heads
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-3">
          {related.map((m) => {
            const s = sidesOf(m);
            const { a, b, draw } = m.tally;
            return (
              <li key={m.slug} className={CELL}>
                <Link
                  to="/compare/$slug"
                  params={{ slug: m.slug }}
                  className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-7"
                >
                  <span className="flex items-center justify-between gap-3">
                    <PairMarks sides={s} className="h-8 w-8 text-xs" />
                    <span className="rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-ink">
                      {a}&ndash;{b}
                      {draw > 0 && (
                        <span className="text-muted-foreground"> · {plural(draw, "draw")}</span>
                      )}
                    </span>
                  </span>
                  <span className="mt-5 text-[0.72rem] font-medium text-muted-foreground">
                    {getCategory(m.category).name}
                  </span>
                  <span className="mt-1 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {matchupTitle(m)}
                  </span>
                  <span className="mt-3 flex-1 space-y-2">
                    {SIDES.map((side) => (
                      <span
                        key={side}
                        className="flex gap-2 text-[0.82rem] leading-snug text-muted-foreground"
                      >
                        <ProductMark product={s[side]} className="mt-px h-4 w-4 text-[0.45rem]" />
                        <span>
                          <span className="font-medium text-ink">{s[side].name}:</span>{" "}
                          {m.bestFor[side]}
                        </span>
                      </span>
                    ))}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.84rem] font-medium text-ink group-hover:text-cta">
                    Read the verdict
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- the closing ask ---------- */

/**
 * Kept to what happens next: paste a URL and onboarding reads the site and
 * shows its content gaps, competitors and topic clusters.
 */
export function ClosingCta() {
  const [url, setUrl] = useState("");
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
        <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
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
            <p className="text-[0.84rem] text-white/85">{TRIAL_NOTE}</p>
          </div>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
