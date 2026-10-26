/**
 * /ai-seo/claude, drawn in the landing page's frame. The guide is built around
 * the one mechanic that sets Claude apart: every web-search citation quotes at
 * most 150 characters of the source. The hero shows that citation taken apart;
 * the reading column follows a page's path to it (searched, crawled, fetched,
 * quoted, measured) beside a sticky contents rail; the robots.txt board lets a
 * reader flip Anthropic's three bots and read the file that results.
 *
 * Every visitor-facing word comes from src/data/ai-seo/content/claude.ts, so
 * the page and its JSON-LD (built by the route) always agree.
 */
import { useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AuthorCard, ReadingProgress, ShareButtons } from "@/components/blog/ArticleChrome";
import { ExploreMore } from "@/components/ExploreMore";
import { Md } from "@/components/ai-seo/kit";
import { Band, LINE, Spacer } from "@/components/landing/frame";
import { getEngine } from "@/data/ai-seo/engines";
import { plainText } from "@/lib/inline-md";
import { guideReadingMinutes } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import { ClaudeBlocks, PROSE } from "./blocks";
import { ContentsInline, ContentsRail, RailOffer, type ContentsEntry } from "./contents";
import { ClosingBand, FaqBand, OtherEngines, SourcesBand } from "./end-matter";
import { ClaudeHero, FactBand, ShortAnswer } from "./hero";
import { Readiness } from "./readiness";

const SITE = "https://rankbox.xyz";

const H2 =
  "scroll-mt-28 text-balance font-display text-[1.6rem] font-medium leading-[1.15] tracking-[-0.028em] text-ink sm:text-[1.95rem]";

export function ClaudeGuidePage({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `${SITE}/ai-seo/${engine.slug}`;
  const title = `${guide.headline.lead} ${guide.headline.accent}`;

  const entries = useMemo<ContentsEntry[]>(
    () => [
      { id: "takeaways", text: "Before you read on" },
      ...guide.sections.map((s) => ({ id: s.id, text: plainText(s.title) })),
      { id: "checklist", text: "Claude readiness, in order" },
      { id: "faq", text: "Questions" },
      { id: "sources", text: "Sources" },
    ],
    [guide],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />
      <article>
        <ClaudeHero engine={engine} guide={guide} minutes={guideReadingMinutes(guide)} />
        <ShortAnswer text={guide.shortAnswer} />
        <FactBand facts={guide.facts} />
        <Spacer />

        <Band inner="grid lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className={cn("hidden border-r lg:block", LINE)}>
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-6 overflow-y-auto px-5 py-12 [scrollbar-width:none]">
              <ContentsRail entries={entries} />
              <div className="hidden [@media(min-height:1000px)]:block">
                <RailOffer />
              </div>
            </div>
          </aside>

          <div
            ref={bodyRef}
            className="min-w-0 px-5 py-10 [overflow-wrap:anywhere] [&_:not(pre)>code]:whitespace-nowrap sm:px-10 lg:py-14 lg:pl-14 lg:pr-12"
          >
            <div className="mx-auto max-w-[44rem] lg:mx-0">
              <ContentsInline entries={entries} className="mb-10 lg:hidden" />

              <section aria-labelledby="takeaways">
                <h2 id="takeaways" className={H2}>
                  Before you read on
                </h2>
                <ul className="mt-6 divide-y divide-ink/[0.06] border-y border-ink/[0.06]">
                  {guide.takeaways.map((t) => (
                    <li key={t} className="flex gap-3.5 py-3.5">
                      <span
                        aria-hidden
                        className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-cta"
                      />
                      <span className="text-[1rem] leading-relaxed text-ink/80">
                        <Md text={t} />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {guide.sections.map((s) => (
                <section
                  key={s.id}
                  aria-labelledby={s.id}
                  className={cn("mt-14 border-t pt-12 sm:mt-16 sm:pt-14", LINE)}
                >
                  <h2 id={s.id} className={H2}>
                    {plainText(s.title)}
                  </h2>
                  <div className="mt-6">
                    <ClaudeBlocks blocks={s.blocks} idPrefix={s.id} />
                  </div>
                </section>
              ))}

              <section
                aria-labelledby="checklist"
                className={cn("mt-14 border-t pt-12 sm:mt-16 sm:pt-14", LINE)}
              >
                <h2 id="checklist" className={H2}>
                  Claude readiness, in order
                </h2>
                <p className={cn(PROSE, "mt-5")}>
                  The guide as {guide.checklist.length} jobs, roughly in the order they pay off.
                  Ticks stay in this browser.
                </p>
                <div className="mt-6">
                  <Readiness
                    storageKey={`rankbox.ai-seo.checklist.${engine.slug}`}
                    items={guide.checklist}
                  />
                </div>
              </section>

              {guide.furtherReading.length > 0 && (
                <nav aria-labelledby="further-title" className="mt-12">
                  <h3
                    id="further-title"
                    className="font-display text-[1.1rem] font-semibold tracking-[-0.015em] text-ink"
                  >
                    More on Rankbox
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                    {guide.furtherReading.map((r) => (
                      <li key={r.href}>
                        <Link
                          to={r.href}
                          className="group flex h-full flex-col rounded-xl border border-ink/[0.08] bg-white p-4 transition-colors hover:border-cta/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
                        >
                          <span className="flex items-start justify-between gap-2 text-[0.9rem] font-semibold leading-snug text-ink group-hover:text-cta">
                            {r.title}
                            <ArrowUpRight
                              aria-hidden
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover:text-cta"
                            />
                          </span>
                          <span className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
                            {r.description}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <footer
                className={cn(
                  "mt-14 flex flex-col gap-6 border-t pt-10 sm:flex-row sm:items-center sm:justify-between",
                  LINE,
                )}
              >
                <p className="text-[0.9rem] text-muted-foreground">
                  Send it to whoever owns your robots.txt.
                </p>
                <ShareButtons url={url} title={title} />
              </footer>
              <div className="mt-8">
                <AuthorCard author="Rankbox Team" />
              </div>
            </div>
          </div>
        </Band>
      </article>

      <FaqBand faqs={guide.faqs} engine={engine} />
      <SourcesBand sources={guide.sources} checked={engine.updated} />
      <OtherEngines current={engine} />
      <ExploreMore
        path={`/ai-seo/${guide.slug}`}
        exclude={guide.furtherReading.map((r) => r.href)}
        framed
      />
      <ClosingBand />
    </>
  );
}
