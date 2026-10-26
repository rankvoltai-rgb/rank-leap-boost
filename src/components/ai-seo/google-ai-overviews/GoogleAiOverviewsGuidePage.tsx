/**
 * /ai-seo/google-ai-overviews: the Google guide, in the landing page's frame.
 *
 * The page is built around the one mechanic that sets Google apart: query
 * fan-out. The hero states the short answer; the figure under it shows a
 * results page whose AI Overview cites a page that won a sub-query nobody
 * typed; the long read beside its sticky contents explains why, then the
 * switches, the controls, the labels, the click data and the reporting.
 */
import { useMemo, useRef } from "react";
import {
  AuthorCard,
  ReadingProgress,
  ShareButtons,
  TableOfContents,
} from "@/components/blog/ArticleChrome";
import { Band, LINE } from "@/components/landing/frame";
import { ExploreMore } from "@/components/ExploreMore";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";
import { SectionBlocks } from "./Blocks";
import { FanOutFigure } from "./FanOutFigure";
import {
  ClosingBand,
  FactBand,
  FaqBand,
  FigureBand,
  FurtherReading,
  Hero,
  OtherGuidesBand,
  RailOffer,
  Runbook,
  SectionHeading,
  SourcesBand,
  Takeaways,
} from "./parts";

const SITE = "https://rankbox.xyz";

/* The figure's sub-queries are the guide's own: the first list in the
   fan-out section, Google's lawn example. */
function fanOutQueries(guide: EngineGuide): string[] {
  for (const section of guide.sections) {
    if (section.id !== "query-fan-out") continue;
    for (const b of section.blocks) if (b.kind === "list") return b.items.map(plainText);
  }
  return [];
}

export function GoogleAiOverviewsGuidePage({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `${SITE}/ai-seo/${engine.slug}`;
  const shareTitle = `${guide.headline.lead} ${guide.headline.accent}`;
  const fanOut = useMemo(() => fanOutQueries(guide), [guide]);

  const toc = useMemo(
    () => [
      { id: "takeaways", text: "What to know first" },
      ...guide.sections.map((s) => ({ id: s.id, text: plainText(s.title) })),
      { id: "checklist", text: "The runbook" },
      { id: "faq", text: "FAQ" },
      { id: "sources", text: "Sources" },
    ],
    [guide],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />
      <Hero
        engine={engine}
        guide={guide}
        minutes={guideReadingMinutes(guide)}
        meta={<ShareButtons url={url} title={shareTitle} />}
      />

      {fanOut.length >= 3 && (
        <FigureBand>
          <FanOutFigure
            preview={guide.preview}
            fanOut={fanOut}
            caption="Google's own fan-out example from its AI optimization guide, drawn as a results page. The sites are invented; the mechanics are Google's."
          />
        </FigureBand>
      )}

      <FactBand facts={guide.facts} />

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div ref={bodyRef} className="min-w-0 px-5 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-14">
          {/* Long tokens (robots.txt lines, URLs) may break mid-word rather
              than push a phone-width column sideways; code and tables keep
              their own horizontal scroll. */}
          <article className="max-w-[43rem] [overflow-wrap:anywhere]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <Takeaways id="takeaways" items={guide.takeaways} />

            {guide.sections.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id}>
                <SectionHeading id={s.id} index={i + 1}>
                  {plainText(s.title)}
                </SectionHeading>
                <SectionBlocks blocks={s.blocks} idPrefix={s.id} />
              </section>
            ))}

            <section aria-labelledby="checklist">
              <SectionHeading id="checklist" index={guide.sections.length + 1}>
                The runbook: everything above, in the order to do it
              </SectionHeading>
              <Runbook slug={guide.slug} items={guide.checklist} />
            </section>

            <footer className={cn("mt-16 space-y-8 border-t pt-10", LINE)}>
              <FurtherReading items={guide.furtherReading} />
              <div className="flex flex-wrap items-center justify-between gap-5">
                <p className="text-sm text-muted-foreground">
                  Useful? Send it to whoever owns your Search Console.
                </p>
                <ShareButtons url={url} title={shareTitle} />
              </div>
              <AuthorCard author="Rankbox Team" />
            </footer>
          </article>
        </div>

        <aside className={cn("hidden border-l lg:block", LINE)}>
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-14 [scrollbar-width:none]">
            <TableOfContents entries={toc} variant="rail" />
            <RailOffer />
          </div>
        </aside>
      </Band>

      <FaqBand faqs={guide.faqs} title="Questions site owners ask about Google's AI answers" />
      <SourcesBand sources={guide.sources} />
      <OtherGuidesBand current={engine} />
      <ExploreMore
        path={`/ai-seo/${guide.slug}`}
        exclude={guide.furtherReading.map((r) => r.href)}
        framed
      />
      <ClosingBand />
    </>
  );
}
