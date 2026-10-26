/**
 * /ai-seo/gemini, in the landing page's frame.
 *
 * The hero carries the engine rail and the page's focal visual: a Gemini
 * answer with its grounding laid open and a live Google-Extended switch,
 * because that switch is the one thing Gemini doesn't share with Google's
 * other AI surfaces. Under it, the spec band, then a long read with a sticky
 * contents rail: the short answer, the guide's own sections and the
 * run-sheet. The FAQ, sources, the other guides, related pages and the
 * closing band follow as full-width bands.
 */
import { useMemo, useRef } from "react";
import { AuthorCard, ReadingProgress, TableOfContents } from "@/components/blog/ArticleChrome";
import { ExploreMore } from "@/components/ExploreMore";
import { Band, LINE } from "@/components/landing/frame";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import { GeminiBlocks } from "./blocks";
import {
  ClosingBand,
  FactsBand,
  FaqBand,
  GeminiHero,
  GoDeeper,
  OtherGuides,
  RailOffer,
  RunSheet,
  ShortAnswer,
  SourcesBand,
} from "./parts";

const SITE = "https://rankbox.xyz";

export function GeminiGuidePage({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `${SITE}/ai-seo/${guide.slug}`;

  const toc = useMemo(
    () => [
      { id: "takeaways", text: "The short answer" },
      ...guide.sections.map((s) => ({ id: s.id, text: s.title.split(":")[0] })),
      { id: "checklist", text: "The run-sheet" },
      { id: "faq", text: "FAQ" },
      { id: "sources", text: "Sources" },
    ],
    [guide],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />
      <GeminiHero guide={guide} engine={engine} minutes={guideReadingMinutes(guide)} url={url} />
      <FactsBand facts={guide.facts} />

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        {/* Long tokens (user agents, IP-list URLs) may break mid-word rather
            than push a phone-width column sideways; code and tables keep
            their own horizontal scroll. */}
        <div
          ref={bodyRef}
          className="min-w-0 px-5 py-10 [overflow-wrap:anywhere] sm:px-10 lg:py-14 lg:pl-12 lg:pr-14"
        >
          <div className="max-w-[43rem]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <ShortAnswer guide={guide} />

            {guide.sections.map((s, i) => (
              <section
                key={s.id}
                aria-labelledby={s.id}
                className={cn("mt-16 border-t pt-12", LINE)}
              >
                <p className="font-mono text-[0.75rem] font-medium text-cta">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-ink/30">
                    {" "}
                    / {String(guide.sections.length).padStart(2, "0")}
                  </span>
                </p>
                <h2
                  id={s.id}
                  className="mt-3 scroll-mt-28 text-balance font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2rem]"
                >
                  {s.title}
                </h2>
                <GeminiBlocks blocks={s.blocks} idPrefix={s.id} />
              </section>
            ))}

            <RunSheet items={guide.checklist} />
            <GoDeeper links={guide.furtherReading} />

            <footer className={cn("mt-14 border-t pt-10", LINE)}>
              <AuthorCard author="Rankbox Team" />
            </footer>
          </div>
        </div>

        <aside className={cn("hidden border-l lg:block", LINE)}>
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-14 [scrollbar-width:none]">
            <TableOfContents entries={toc} variant="rail" />
            <RailOffer />
          </div>
        </aside>
      </Band>

      <FaqBand faqs={guide.faqs} />
      <SourcesBand sources={guide.sources} />
      <OtherGuides current={engine} />
      <ExploreMore
        path={`/ai-seo/${guide.slug}`}
        exclude={guide.furtherReading.map((r) => r.href)}
        framed
      />
      <ClosingBand />
    </>
  );
}
