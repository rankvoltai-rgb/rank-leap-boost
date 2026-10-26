/**
 * The back half of /compare/jasper-vs-writesonic: the disclosed third option,
 * the questions, where every fact comes from, the other head-to-heads, and
 * the closing band.
 *
 * Rankbox appears once, in the third option, and claims only RANKBOX_SHIPS.
 * The FAQ answers are always in the server HTML (forceMount), because the
 * route's FAQPage JSON-LD is built from the same entries.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  GitCompareArrows,
  HelpCircle,
  Lightbulb,
  Plus,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
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
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
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
import type { MatchupEntry } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md } from "./atoms";
import { CARD, DOTS, SIDES, SOLID_BUTTON, plural } from "./lib";

/* ---------- the third option ---------- */

/** "If the goal is articles on your site, not another workspace" → the words after the comma in blue. */
function accentTail(title: string) {
  const at = title.lastIndexOf(", ");
  if (at < 0) return title;
  return (
    <>
      {title.slice(0, at + 1)} <Accent>{title.slice(at + 2)}</Accent>
    </>
  );
}

export function ThirdOption({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const ours = SIDES.map((s) => sides[s]).filter((p) =>
    (COMPETITOR_SLUGS as readonly string[]).includes(p.slug),
  );

  return (
    <section id="third-option" aria-labelledby="third-title" className="scroll-mt-20">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <Reveal
            className={cn(
              "border-b px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-16",
              LINE,
            )}
          >
            <Pill icon={Lightbulb}>A third option</Pill>
            <p className="mt-3 text-[0.78rem] text-muted-foreground">
              From the team that wrote this page &mdash; weigh it accordingly.
            </p>
            <h2
              id="third-title"
              className="mt-5 text-balance font-display text-[1.8rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]"
            >
              {accentTail(entry.thirdOption.title)}
            </h2>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">
              <Md text={entry.thirdOption.body} />
            </p>

            <div className="mt-8 flex flex-col items-start gap-2.5">
              <Link to="/features" className={SOLID_BUTTON}>
                See how Rankbox works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="text-[0.8rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>

            {ours.length > 0 && (
              <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem]">
                {ours.map((p) => (
                  <Link
                    key={p.slug}
                    to="/alternatives/$slug"
                    params={{ slug: p.slug }}
                    className="group inline-flex items-center gap-1.5 font-medium text-ink transition-colors hover:text-cta"
                  >
                    Rankbox vs {p.name}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </p>
            )}
          </Reveal>

          {/* What ships today, as the four steps it runs. */}
          <div className={cn("flex items-center px-5 py-10 sm:px-10 lg:px-12", PANEL)} style={DOTS}>
            <Reveal delay={0.08} className="mx-auto w-full max-w-[26rem]">
              <div className={cn(CARD, "overflow-hidden")}>
                <div className={cn("flex items-center gap-2.5 border-b px-5 py-3.5", LINE)}>
                  <RankboxTile className="h-7 w-7" />
                  <p className="text-[0.85rem] font-medium text-ink">What Rankbox does today</p>
                </div>
                <ol className="relative px-5 py-5">
                  <span
                    aria-hidden
                    className="absolute bottom-9 left-[2.05rem] top-9 w-px bg-ink/[0.1]"
                  />
                  {RANKBOX_SHIPS.map((line, i) => (
                    <li key={line} className="relative flex gap-3.5 py-2.5">
                      <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cta text-[0.7rem] font-semibold text-white ring-4 ring-white tabular-nums">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-[0.88rem] leading-snug text-ink/85">{line}</span>
                    </li>
                  ))}
                </ol>
                <p
                  className={cn(
                    "border-t bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-5 py-3 text-[0.8rem] font-medium text-ink",
                    LINE,
                  )}
                >
                  {RANKBOX_PRICE_LINE}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- questions, method, sources ---------- */

function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function Questions({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <>
      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20">
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
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
              >
                {matchupTitle(matchup)}: <Accent>common questions</Accent>
              </h2>
              <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
                Price, free plans, WordPress, Surfer, AI search engines and seats &mdash; answered
                from the sources below.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
              <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
                {entry.faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`q-${i}`} className="border-b-0">
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
                      <Md text={f.a} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </Band>
      </section>

      <section aria-labelledby="sources" className="scroll-mt-20">
        <Spacer />
        <Band>
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <div
              className={cn(
                "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
                LINE,
              )}
            >
              <Pill icon={BookOpenCheck} className="w-fit">
                Sources
              </Pill>
              <h2
                id="sources"
                className="mt-5 scroll-mt-24 font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2rem]"
              >
                Where every fact <Accent>comes from</Accent>
              </h2>
              <p className="mt-4 text-[0.9rem] leading-relaxed text-muted-foreground">
                From {sides.a.name}&rsquo;s and {sides.b.name}&rsquo;s own pricing pages and
                documentation, plus the third-party pages listed here, last read on{" "}
                <time dateTime={entry.pricing.checkedOn} className="font-medium text-ink">
                  {formatDate(entry.pricing.checkedOn)}
                </time>
                . Neither product was benchmarked for this page, so where a round turns on judgment
                the verdict says so, and every factual claim traces to a source. Rankbox makes a
                product in this space; it appears once, as the third option, and nowhere in the
                scoring.
              </p>
            </div>

            <ol className="divide-y divide-ink/[0.07]">
              {entry.sources.map((s, i) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 px-6 py-3.5 transition-colors hover:bg-ink/[0.015] sm:px-10 lg:px-12"
                  >
                    <span className="w-5 shrink-0 pt-px text-right text-[0.78rem] tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9rem] font-medium leading-snug text-ink decoration-ink/30 underline-offset-4 group-hover:underline">
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[0.78rem] text-muted-foreground">
                        {s.publisher} · {hostOf(s.href)}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cta"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </Band>
      </section>
    </>
  );
}

/* ---------- the other head-to-heads ---------- */

export function OtherMatchups({ matchup }: { matchup: Matchup }) {
  const related = relatedMatchups(matchup);
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="related-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-10 sm:px-10 lg:px-12">
        <div>
          <Pill icon={GitCompareArrows}>More head-to-heads</Pill>
          <h2
            id="related-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Still <Accent>shortlisting?</Accent>
          </h2>
        </div>
        <Link
          to="/compare"
          className="group inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-ink transition-colors hover:text-cta"
        >
          All head-to-heads
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-3">
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
                    <span className="flex items-center gap-1.5">
                      <ProductMark product={s.a} className="h-8 w-8 text-xs" />
                      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                        vs
                      </span>
                      <ProductMark product={s.b} className="h-8 w-8 text-xs" />
                    </span>
                    <span
                      title={`Rounds won: ${s.a.name} ${a}, ${s.b.name} ${b}${draw ? `, ${plural(draw, "draw")}` : ""}`}
                      className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-cta-hover"
                    >
                      {a}&ndash;{b}
                      {draw > 0 && ` · ${plural(draw, "draw")}`}
                    </span>
                  </span>
                  <span className="mt-5 text-[1.02rem] font-semibold tracking-tight text-ink">
                    {matchupTitle(m)}
                  </span>
                  <span className="mt-3 flex-1 space-y-2">
                    {SIDES.map((side) => (
                      <span
                        key={side}
                        className="block text-[0.82rem] leading-snug text-muted-foreground"
                      >
                        <span className="font-medium text-ink">{s[side].name}:</span>{" "}
                        {m.bestFor[side]}
                      </span>
                    ))}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-cta">
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

/* ---------- the closing band ---------- */

export function ClosingBand() {
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
