/**
 * /ai-seo/copilot, laid out around the one thing that makes Copilot
 * different: it never visits your site. The hero carries the engine rail,
 * the headline and the short answer; under it, the grounding loop shows a
 * citation being made, from prompt to the AI Performance row Microsoft
 * reports back. Then the spec band, the long read beside its contents rail,
 * the FAQ, further reading and the closing offer.
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
import { CopilotBlocks, PROSE } from "./blocks";
import {
  ClosingBand,
  CopilotHero,
  Essentials,
  FactBand,
  FaqBand,
  FurtherReading,
  GuideH2,
  RailOffer,
  SetupRun,
  SourceList,
} from "./parts";

const SITE = "https://rankbox.xyz";

export function CopilotGuidePage({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `${SITE}/ai-seo/${engine.slug}`;
  const shareTitle = `${guide.headline.lead} ${guide.headline.accent}`;

  const toc = useMemo(
    () => [
      { id: "takeaways", text: "What to know first" },
      ...guide.sections.map((s) => ({ id: s.id, text: s.title })),
      { id: "checklist", text: "The setup, in order" },
      { id: "sources", text: "Sources" },
      { id: "faq", text: "FAQ" },
    ],
    [guide],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />
      <CopilotHero engine={engine} guide={guide} readingMinutes={guideReadingMinutes(guide)} />
      <FactBand guide={guide} />

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Long tokens (user agents, URLs) may break mid-word rather than push
            a phone-width column sideways; code and tables scroll in their own
            boxes. */}
        <article
          ref={bodyRef}
          className="min-w-0 px-5 py-10 [overflow-wrap:anywhere] sm:px-10 lg:py-14 lg:pl-12 lg:pr-14"
        >
          <div className="max-w-[43rem]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <Essentials items={guide.takeaways} />

            {guide.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id} className="mt-20">
                <GuideH2 id={s.id}>{s.title}</GuideH2>
                <CopilotBlocks blocks={s.blocks} idPrefix={s.id} />
              </section>
            ))}

            <section aria-labelledby="checklist" className="mt-20">
              <GuideH2 id="checklist">The Copilot setup, in order</GuideH2>
              <p className={cn("mt-4", PROSE)}>
                Everything above as one run, highest leverage first. Tick steps off as you go; your
                progress stays in this browser.
              </p>
              <SetupRun items={guide.checklist} />
            </section>

            <SourceList sources={guide.sources} />

            <footer className={cn("mt-14 space-y-8 border-t pt-10", LINE)}>
              <div className="flex flex-wrap items-center justify-between gap-5">
                <p className="text-sm text-muted-foreground">
                  Useful? Send it to whoever owns your Bing setup.
                </p>
                <ShareButtons url={url} title={shareTitle} />
              </div>
              <AuthorCard author="Rankbox Team" />
            </footer>
          </div>
        </article>

        <aside className={cn("hidden border-l lg:block", LINE)}>
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-14 [scrollbar-width:none]">
            <TableOfContents entries={toc} variant="rail" />
            <RailOffer />
          </div>
        </aside>
      </Band>

      <FaqBand faqs={guide.faqs} />
      <FurtherReading guide={guide} />
      <ExploreMore
        path={`/ai-seo/${guide.slug}`}
        exclude={guide.furtherReading.map((r) => r.href)}
        framed
      />
      <ClosingBand />
    </>
  );
}
