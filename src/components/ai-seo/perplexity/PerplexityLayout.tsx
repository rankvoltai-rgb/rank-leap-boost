/**
 * /ai-seo/perplexity: the guide in the landing page's frame. The hero opens
 * with the engine rail and puts Perplexity's own citation mechanic beside
 * the headline: an answer whose claims map, chip by chip, to numbered
 * sources. Then the quotable answer and the spec band, a long reading column
 * beside a sticky contents rail, and the FAQ, sources and offer in bands of
 * their own.
 */
import { useMemo, useRef } from "react";
import { Band, LINE } from "@/components/landing/frame";
import { ReadingProgress, TableOfContents } from "@/components/blog/ArticleChrome";
import { ExploreMore } from "@/components/ExploreMore";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import {
  Checklist,
  ClosingBand,
  FactsBand,
  FaqBand,
  GuideSectionView,
  Hero,
  RailOffer,
  SourcesBand,
  Takeaways,
} from "./parts";

const SITE = "https://rankbox.xyz";

export function PerplexityLayout({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug);
  const bodyRef = useRef<HTMLDivElement>(null);
  const minutes = guideReadingMinutes(guide);
  const toc = useMemo(
    () => [
      { id: "takeaways", text: "Key takeaways" },
      ...guide.sections.map((s) => ({ id: s.id, text: s.title })),
      { id: "checklist", text: "Checklist" },
      { id: "faq", text: "FAQ" },
      { id: "sources", text: "Sources" },
    ],
    [guide.sections],
  );
  if (!engine) return null;
  const url = `${SITE}/ai-seo/${guide.slug}`;

  return (
    <>
      <ReadingProgress target={bodyRef} />
      <article>
        <Hero guide={guide} engine={engine} minutes={minutes} url={url} />
        <FactsBand guide={guide} />

        <Band inner="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div ref={bodyRef} className="min-w-0 px-5 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-14">
            <div className="max-w-[43rem]">
              <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
              <Takeaways items={guide.takeaways} />
              {guide.sections.map((s, i) => (
                <GuideSectionView key={s.id} section={s} index={i} />
              ))}
              <Checklist items={guide.checklist} />
            </div>
          </div>

          <aside className={cn("hidden border-l lg:block", LINE)}>
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-14 [scrollbar-width:none]">
              <TableOfContents entries={toc} variant="rail" />
              <RailOffer />
            </div>
          </aside>
        </Band>
      </article>

      <FaqBand guide={guide} />
      <SourcesBand sources={guide.sources} checked={formatDate(engine.updated)} />
      <ExploreMore
        path={`/ai-seo/${guide.slug}`}
        exclude={guide.furtherReading.map((r) => r.href)}
        framed
      />
      <ClosingBand />
    </>
  );
}
