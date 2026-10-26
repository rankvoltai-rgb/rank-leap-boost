/**
 * /ai-seo/mistral: the Mistral Vibe guide in the landing page's frame.
 *
 * A split hero (title beside the quotable answer), then the page's focal
 * visual, one Vibe web answer taken apart from prompt to Sources panel, and
 * the spec band. The long read follows in a reading column beside a sticky
 * contents rail; questions, sources and the other guides close it in bands.
 */
import { useMemo, useRef } from "react";
import {
  AuthorCard,
  ReadingProgress,
  ShareButtons,
  TableOfContents,
} from "@/components/blog/ArticleChrome";
import { ExploreMore } from "@/components/ExploreMore";
import { Band, LINE, Spacer } from "@/components/landing/frame";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import { Blocks } from "./blocks";
import {
  Brief,
  Checklist,
  ClosingBand,
  FactBand,
  GuideHero,
  OtherGuides,
  QuestionsBand,
  RailOffer,
  SectionHeading,
  SourcesBand,
  ToolShelf,
} from "./parts";
import { VibeAnatomy } from "./VibeAnatomy";

const SITE = "https://rankbox.xyz";

export function MistralGuidePage({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `${SITE}/ai-seo/${guide.slug}`;
  const title = `${guide.headline.lead} ${guide.headline.accent}`;

  const toc = useMemo(
    () => [
      { id: "takeaways", text: "In brief" },
      ...guide.sections.map((s) => ({ id: s.id, text: s.title })),
      { id: "checklist", text: "The checklist" },
      { id: "faq", text: "Questions" },
      { id: "sources", text: "Sources" },
    ],
    [guide],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />
      <GuideHero guide={guide} engine={engine} minutes={guideReadingMinutes(guide)} />

      <VibeAnatomy
        preview={guide.preview}
        title="One Vibe web answer, taken apart"
        caption="An illustration of the pipeline in Nicolas Sitter's May 2026 capture. The domains are reserved examples, and “Votre marque” marks where your brand would sit."
      />
      <FactBand facts={guide.facts} />

      <Spacer />
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Long tokens (user agents, IP-file paths) may break mid-word rather
            than push a phone-width column sideways; code keeps its own scroll. */}
        <div
          ref={bodyRef}
          className="min-w-0 px-5 py-10 [overflow-wrap:anywhere] sm:px-10 lg:py-14 lg:pl-12 lg:pr-14"
        >
          <div className="max-w-[43rem]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <Brief items={guide.takeaways} />

            {guide.sections.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id} className="mt-16">
                <SectionHeading id={s.id} n={i + 1}>
                  {s.title}
                </SectionHeading>
                <Blocks blocks={s.blocks} idPrefix={s.id} />
              </section>
            ))}

            <Checklist slug={guide.slug} items={guide.checklist} />
            <ToolShelf items={guide.furtherReading} />

            <footer className={cn("mt-14 space-y-8 border-t pt-10", LINE)}>
              <div className="flex flex-wrap items-center justify-between gap-5">
                <p className="text-sm text-muted-foreground">
                  Useful? Send it to whoever owns your robots.txt.
                </p>
                <ShareButtons url={url} title={title} />
              </div>
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

      <QuestionsBand faqs={guide.faqs} />
      <SourcesBand sources={guide.sources} />
      <OtherGuides current={guide.slug} />
      <ExploreMore
        path={`/ai-seo/${guide.slug}`}
        exclude={guide.furtherReading.map((r) => r.href)}
        framed
      />
      <ClosingBand />
    </>
  );
}
