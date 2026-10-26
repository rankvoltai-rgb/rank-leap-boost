/**
 * /ai-seo/meta-ai: the Meta AI guide in its own layout.
 *
 * Meta AI's peculiarity is where it answers — inside a WhatsApp thread, a
 * Facebook search tab, a pair of glasses — so the page opens on one question
 * asked across those surfaces, with the source spot marked on each. Below,
 * the short answer reads as a received message beside the spec sheet, then a
 * long reading column with a sticky contents rail (as on the blog), the FAQ
 * as a question-and-answer thread, the sources split into Meta's own pages
 * and everyone else's, the other guides and the offer.
 */
import { useMemo, useRef } from "react";
import {
  AuthorCard,
  ReadingProgress,
  ShareButtons,
  TableOfContents,
} from "@/components/blog/ArticleChrome";
import { ExploreMore } from "@/components/ExploreMore";
import { Band, LINE } from "@/components/landing/frame";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import { MetaBlocks, PROSE } from "./Blocks";
import { Checklist } from "./Checklist";
import { LABELS } from "./copy";
import {
  ClosingBand,
  FactBand,
  FaqThread,
  FurtherReading,
  Hero,
  OtherGuides,
  RailOffer,
  SectionHeading,
  SourcesBand,
  Takeaways,
} from "./parts";

const SITE = "https://rankbox.xyz";

export function MetaAiGuidePage({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `${SITE}/ai-seo/${engine.slug}`;

  const toc = useMemo(
    () => [
      { id: "takeaways", text: LABELS.takeaways },
      ...guide.sections.map((s) => ({ id: s.id, text: s.title })),
      { id: "checklist", text: LABELS.checklist },
      { id: "faq", text: LABELS.faqTitle },
      { id: "sources", text: LABELS.sourcesTitle },
    ],
    [guide],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />
      <Hero guide={guide} engine={engine} minutes={guideReadingMinutes(guide)} url={url} />
      <FactBand facts={guide.facts} />

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Long tokens (user agents, URLs) may break mid-word rather than push
            a phone-width column sideways; code and tables scroll in their
            own boxes. */}
        <div
          ref={bodyRef}
          className="min-w-0 px-5 py-10 [overflow-wrap:anywhere] sm:px-10 lg:py-14 lg:pl-12 lg:pr-14"
        >
          <article className="max-w-[43rem]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <Takeaways items={guide.takeaways} />

            {guide.sections.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id}>
                <SectionHeading id={s.id} index={i + 1}>
                  {s.title}
                </SectionHeading>
                <MetaBlocks blocks={s.blocks} idPrefix={s.id} />
              </section>
            ))}

            <section aria-labelledby="checklist">
              <SectionHeading id="checklist">{LABELS.checklist}</SectionHeading>
              <p className={cn("mt-6", PROSE)}>{LABELS.checklistIntro}</p>
              <Checklist
                storageKey={`rankbox.ai-seo.checklist.${engine.slug}`}
                items={guide.checklist}
              />
            </section>

            <FurtherReading items={guide.furtherReading} />

            <footer className={cn("mt-14 space-y-8 border-t pt-10", LINE)}>
              <div className="flex flex-wrap items-center justify-between gap-5">
                <p className="text-sm text-muted-foreground">{LABELS.share}</p>
                <ShareButtons url={url} title={`${guide.headline.lead} ${guide.headline.accent}`} />
              </div>
              <AuthorCard author="Rankbox Team" />
            </footer>
          </article>
        </div>

        <aside className={cn("hidden border-l lg:block", LINE)}>
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-10 [scrollbar-width:none]">
            <TableOfContents entries={toc} variant="rail" />
            <RailOffer />
          </div>
        </aside>
      </Band>

      <FaqThread faqs={guide.faqs} />
      <SourcesBand sources={guide.sources} checked={engine.updated} />
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
