/**
 * The back half of /compare/koala-ai-vs-byword: Rankbox as the disclosed
 * third option (only what RANKBOX_SHIPS lists), the FAQ beside how the page
 * was made, every source with the date it was read, the other head-to-heads,
 * and the closing ask on blue.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight, ArrowUpRight, BookOpen, Check, HelpCircle, Plus, Shuffle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Reveal } from "@/components/landing/shared";
import { Band, CELL, CellGrid, LINE, PANEL, Pill, Spacer } from "@/components/landing/frame";
import { ProductMark, RankboxTile } from "@/components/compare/kit";
import { COMPETITOR_SLUGS } from "@/data/alternatives";
import {
  RANKBOX_PRICE_LINE,
  RANKBOX_SHIPS,
  matchupTitle,
  relatedMatchups,
  sidesOf,
  type Matchup,
} from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Side } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { CARD, KICKER, SIDES, SOLID_BUTTON, plural } from "./tokens";
import { Md } from "./ui";

/* ---------- the third option ---------- */

export function ThirdOptionSection({
  sides,
  entry,
}: {
  sides: Record<Side, Product>;
  entry: MatchupEntry;
}) {
  const ours = SIDES.map((s) => sides[s]).filter((p) =>
    (COMPETITOR_SLUGS as readonly string[]).includes(p.slug),
  );
  return (
    <section id="third-option" aria-labelledby="third-title" className="scroll-mt-16">
      <Spacer />
      <Band inner={cn(PANEL, "px-5 py-10 sm:px-10 sm:py-14 lg:px-14")}>
        <Reveal>
          <div className={cn(CARD, "overflow-hidden border-dashed border-ink/[0.16]")}>
            <div className="grid lg:grid-cols-[1.15fr_1fr]">
              <div className={cn("px-6 py-8 sm:px-9 sm:py-10 lg:border-r", LINE)}>
                <p className="flex items-center gap-3">
                  <RankboxTile className="h-9 w-9" />
                  <span className={KICKER}>
                    A third option · from the team that wrote this page
                  </span>
                </p>
                <h2
                  id="third-title"
                  className="mt-6 text-balance font-display text-[1.6rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[1.9rem]"
                >
                  {entry.thirdOption.title}
                </h2>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                  <Md text={entry.thirdOption.body} />
                </p>
                <div className="mt-8 flex flex-col items-start gap-2.5">
                  <Link to="/features" className={SOLID_BUTTON}>
                    See how Rankbox works
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <p className="text-[0.8rem] text-muted-foreground">{TRIAL_NOTE}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className={cn(KICKER, "border-b px-6 py-4 sm:px-8", LINE)}>
                  What Rankbox does today · {RANKBOX_PRICE_LINE}
                </p>
                <ul className="flex-1 divide-y divide-ink/[0.07]">
                  {RANKBOX_SHIPS.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 px-6 py-4 text-[0.9rem] leading-snug text-ink sm:px-8"
                    >
                      <span className="mt-0.5 flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
                {ours.length > 0 && (
                  <div
                    className={cn(
                      "flex flex-wrap gap-x-6 gap-y-2 border-t px-6 py-4 sm:px-8",
                      LINE,
                    )}
                  >
                    {ours.map((p) => (
                      <Link
                        key={p.slug}
                        to="/alternatives/$slug"
                        params={{ slug: p.slug }}
                        className="group inline-flex items-center gap-1.5 text-[0.84rem] font-medium text-ink hover:text-cta"
                      >
                        Rankbox vs {p.name}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Band>
    </section>
  );
}

/* ---------- FAQ, method, sources ---------- */

export function FaqSection({
  matchup,
  sides,
  entry,
}: {
  matchup: Matchup;
  sides: Record<Side, Product>;
  entry: MatchupEntry;
}) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
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
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]"
            >
              {matchupTitle(matchup)}: common questions
            </h2>
            <aside
              aria-label="How this comparison was made"
              className="mt-8 rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_55%,white)] p-5 text-[0.84rem] leading-relaxed text-muted-foreground lg:mt-auto"
            >
              <p className="font-medium text-ink">How we compared</p>
              <p className="mt-2">
                From {sides.a.name}&rsquo;s and {sides.b.name}&rsquo;s own pricing pages,
                documentation and changelogs, plus dated third-party reporting, last read on{" "}
                {formatDate(entry.pricing.checkedOn)}. We haven&rsquo;t benchmarked either product
                ourselves, so where a round turns on judgment the verdict says so, and every factual
                claim traces to a source below. Rankbox makes a product in this space; it appears
                once, as the third option, and nowhere in the scoring.
              </p>
            </aside>
          </div>

          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {entry.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`q-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-cta/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-cta group-data-[state=open]:bg-cta group-data-[state=open]:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-sm leading-relaxed text-muted-foreground"
                  >
                    <Md text={f.a} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Band>

      {/* Every source, with the date the pages were read. */}
      <Band id="sources" className="scroll-mt-16">
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5 sm:px-10 lg:px-12",
            LINE,
          )}
        >
          <h2 className="flex items-center gap-2.5 text-[1.05rem] font-semibold tracking-tight text-ink">
            <BookOpen className="h-4 w-4 text-cta" aria-hidden />
            Sources
            <span className="font-normal text-muted-foreground">
              · {plural(entry.sources.length, "page")}
            </span>
          </h2>
          <p className="text-[0.8rem] text-muted-foreground">
            Checked on{" "}
            <time dateTime={entry.pricing.checkedOn} className="font-medium text-ink">
              {formatDate(entry.pricing.checkedOn)}
            </time>
          </p>
        </div>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {entry.sources.map((s) => (
            <li key={s.href} className={CELL}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex h-full items-start justify-between gap-3 px-6 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] sm:px-7"
              >
                <span className="min-w-0">
                  <span className="block text-[0.72rem] text-muted-foreground">{s.publisher}</span>
                  <span className="mt-0.5 block text-[0.88rem] font-medium leading-snug text-ink group-hover:text-cta">
                    {s.title}
                  </span>
                  <span className="mt-1 block truncate text-[0.72rem] text-muted-foreground/80">
                    {s.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </span>
                <ArrowUpRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cta"
                  aria-hidden
                />
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
  const others = relatedMatchups(matchup, 5);
  if (others.length === 0) return null;
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="px-6 py-9 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Pill icon={Shuffle}>More head-to-heads</Pill>
            <h2
              id="others-title"
              className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
            >
              Still shortlisting?
            </h2>
          </div>
          <Link
            to="/compare"
            className="group inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-ink hover:text-cta"
          >
            All head-to-heads
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {others.map((m) => {
            const s = sidesOf(m);
            return (
              <li key={m.slug} className={CELL}>
                <Link
                  to="/compare/$slug"
                  params={{ slug: m.slug }}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-7"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5">
                      <ProductMark product={s.a} className="h-8 w-8 text-xs" />
                      <span className="text-[0.7rem] font-medium text-muted-foreground">vs</span>
                      <ProductMark product={s.b} className="h-8 w-8 text-xs" />
                    </span>
                    <span className="rounded-md border border-ink/[0.08] px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-muted-foreground">
                      {m.tally.a}–{m.tally.b}
                      {m.tally.draw > 0 && ` · ${plural(m.tally.draw, "draw")}`}
                    </span>
                  </span>
                  <span className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink group-hover:text-cta">
                    {matchupTitle(m)}
                  </span>
                  <span className="mt-3 flex-1 space-y-1.5 text-[0.82rem] leading-snug text-muted-foreground">
                    {(["a", "b"] as const).map((side) => (
                      <span key={side} className="block">
                        <span className="font-medium text-ink">{s[side].name}:</span>{" "}
                        {m.bestFor[side]}
                      </span>
                    ))}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.84rem] font-medium text-cta">
                    Read the verdict
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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

export function KoalaBywordCta() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2
            id="cta-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Rather have the articles than another tool?
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white/90">
            Paste your URL. Rankbox reads your site and shows the content gaps, the competitors
            you&rsquo;re up against, and the topics it would write first.
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <UrlForm url={url} onChange={setUrl} />
            <p className="text-[0.85rem] text-white/90">{TRIAL_NOTE}</p>
          </div>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
