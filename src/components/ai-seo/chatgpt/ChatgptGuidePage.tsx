/**
 * /ai-seo/chatgpt, in its own layout. The page follows one ChatGPT answer from
 * prompt to pageview: the hero draws that journey (the focal visual), and the
 * body takes its stages in order — the searches ChatGPT writes, the pages it
 * reads but doesn't cite, the OpenAI agents that fetch them, what they
 * receive, how the click shows up in analytics — then the two surfaces that
 * work differently (shopping feeds and agents), the beliefs the 2026 data
 * broke, the fixes in order, questions and sources.
 *
 * Every visitor-facing word comes from the guide data, so the page and its
 * JSON-LD always agree; the few labels here are structural.
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
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";
import { Blocks } from "./blocks";
import { GuideHero } from "./hero";
import {
  Brief,
  ClosingBand,
  FactStrip,
  FaqList,
  Heading,
  Onward,
  RailOffer,
  SourceList,
  WorkOrder,
} from "./parts";

const SITE = "https://rankbox.xyz";

/** The rewritten searches the guide shows in its fan-out block, for the hero. */
function fanOutQueries(guide: EngineGuide): string[] {
  for (const s of guide.sections) {
    for (const b of s.blocks) {
      if (b.kind === "code" && b.lang === "fan-out") return b.code.split("\n").filter(Boolean);
    }
  }
  return [];
}

/* The rail is narrow: a title's lead clause ("Read isn't cited") names the
   section well enough there, and the full title stays on the heading. */
function tocLabel(title: string): string {
  return plainText(title.split(":")[0]);
}

export function ChatgptGuidePage({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `${SITE}/ai-seo/${engine.slug}`;
  const title = `${guide.headline.lead} ${guide.headline.accent}`;
  const fanOut = useMemo(() => fanOutQueries(guide), [guide]);

  const toc = useMemo(
    () => [
      { id: "takeaways", text: "In brief" },
      ...guide.sections.map((s) => ({ id: s.id, text: tocLabel(s.title) })),
      { id: "checklist", text: "The fixes, in order" },
      { id: "faq", text: "Questions" },
      { id: "sources", text: "Sources" },
    ],
    [guide],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />
      <GuideHero
        engine={engine}
        guide={guide}
        fanOut={fanOut}
        readingMinutes={guideReadingMinutes(guide)}
      />
      <FactStrip guide={guide} />

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Long tokens (user agents, IP-file URLs) may break mid-word rather
            than push a phone-width column sideways; code keeps its own scroll. */}
        <article
          ref={bodyRef}
          className="min-w-0 px-5 py-10 [overflow-wrap:anywhere] sm:px-10 lg:py-14 lg:pl-12 lg:pr-14"
        >
          <div className="max-w-[43rem]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <Brief items={guide.takeaways} />

            {guide.sections.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id}>
                <Heading id={s.id} kicker={String(i + 1).padStart(2, "0")}>
                  {plainText(s.title)}
                </Heading>
                <Blocks blocks={s.blocks} idPrefix={s.id} />
              </section>
            ))}

            <section aria-labelledby="checklist">
              <Heading id="checklist" kicker="Do this">
                The fixes, in the order to make them
              </Heading>
              <WorkOrder items={guide.checklist} />
            </section>

            <section aria-labelledby="faq">
              <Heading id="faq" kicker="FAQ">
                Questions people ask about ChatGPT search
              </Heading>
              <FaqList faqs={guide.faqs} />
            </section>

            <section aria-labelledby="sources">
              <Heading id="sources" kicker="Sources">
                {`The ${guide.sources.length} sources behind this guide`}
              </Heading>
              <SourceList sources={guide.sources} />
            </section>

            <footer className={cn("mt-14 space-y-8 border-t pt-10", LINE)}>
              <div className="flex flex-wrap items-center justify-between gap-5">
                <p className="text-sm text-muted-foreground">
                  Share it with whoever owns your SEO.
                </p>
                <ShareButtons url={url} title={title} />
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

      <Onward engine={engine} guide={guide} />
      <ExploreMore
        path={`/ai-seo/${guide.slug}`}
        exclude={guide.furtherReading.map((r) => r.href)}
        framed
      />
      <ClosingBand />
    </>
  );
}
