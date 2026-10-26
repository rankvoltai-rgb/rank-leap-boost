/**
 * /ai-seo/grok — its own layout, in the landing page's frame.
 *
 * The page is built around the one thing that makes Grok different: a single
 * answer drawn from two live sources, the open web and X. The hero shows that
 * split happening (SplitAnswer), each section is tagged with the half it
 * serves, and the long read sits beside a sticky contents rail like the blog's.
 */
import { useMemo, useRef, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Accent, Band, LINE } from "@/components/landing/frame";
import {
  AuthorCard,
  ReadingProgress,
  ShareButtons,
  TableOfContents,
} from "@/components/blog/ArticleChrome";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { ExploreMore } from "@/components/ExploreMore";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { GrokBlocks } from "./blocks";
import {
  Checklist,
  ClosingBand,
  FaqBand,
  OtherGuidesBand,
  RailNote,
  SectionHeading,
  ShortAnswerBand,
  SourcesBand,
  Takeaways,
  type Half,
} from "./sections";
import { SplitAnswer } from "./SplitAnswer";

const SITE = "https://rankbox.xyz";

/* Which half of a Grok answer each section serves. Unknown ids simply go
   untagged, so a renamed section never breaks the page. */
const HALVES: Record<string, Half> = {
  "two-indexes": "both",
  "x-search-levers": "x",
  "web-half": "web",
  "nameless-fetcher": "web",
  "missing-referrer": "both",
  grokipedia: "context",
  "company-and-ads": "context",
  "grok-folklore": "both",
};

/* A faint drafting grid behind the hero's visual. */
const GRID: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, color-mix(in oklab, var(--ink) 5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--ink) 5%, transparent) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

export function GrokGuidePage({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `${SITE}/ai-seo/${engine.slug}`;
  const title = `${guide.headline.lead} ${guide.headline.accent}`;
  const minutes = guideReadingMinutes(guide);
  const updated = formatDate(engine.updated);
  const checklistTitle = `${guide.checklist.length} moves, ranked by impact`;

  const toc = useMemo(
    () => [
      { id: "takeaways", text: "Key takeaways" },
      ...guide.sections.map((s) => ({ id: s.id, text: s.title })),
      { id: "checklist", text: checklistTitle },
      { id: "faq", text: "FAQ" },
      { id: "sources", text: "Sources" },
    ],
    [guide, checklistTitle],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />

      {/* ---------- hero ---------- */}
      <header id="top" className="relative scroll-mt-16 bg-white">
        {/* The way between guides: every engine one click away, above the title. */}
        <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b px-5 py-3 sm:px-10 lg:px-12",
              LINE,
            )}
          >
            <EngineRail active={guide.slug} />
            <p className="text-[0.78rem] text-muted-foreground">
              {updated && <>Updated {updated} · </>}
              {minutes} min read
            </p>
          </div>
        </div>
        <div
          className={cn(
            "relative mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)]",
            LINE,
          )}
        >
          <div className="flex min-w-0 flex-col justify-center px-5 pb-10 pt-7 motion-safe:animate-hero-rise sm:px-10 lg:py-12 lg:pl-12 lg:pr-10">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
                <li>
                  <Link to="/ai-seo" className="py-2 transition-colors hover:text-ink">
                    AI SEO guides
                  </Link>
                </li>
                <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
                <li aria-current="page" className="font-medium text-cta">
                  {engine.name}
                </li>
              </ol>
            </nav>

            <h1 className="mt-4 text-balance font-display text-[2.1rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink sm:text-[2.75rem] lg:text-[3rem]">
              {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
            </h1>
            <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-muted-foreground sm:text-[1.08rem]">
              {guide.subhead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ShareButtons url={url} title={title} />
              <p className="text-[0.8rem] text-muted-foreground">
                {guide.sources.length} sources ·{" "}
                <a href="#sources" className="font-medium text-cta hover:text-cta-hover">
                  see them all
                </a>
              </p>
            </div>
          </div>

          <div
            className={cn(
              "min-w-0 border-t p-3 motion-safe:animate-hero-rise lg:border-l lg:border-t-0",
              LINE,
            )}
            style={{ "--rise-delay": "0.08s" } as CSSProperties}
          >
            <div
              className="flex h-full items-center rounded-lg border border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-3 py-6 sm:px-8 sm:py-10"
              style={GRID}
            >
              <SplitAnswer preview={guide.preview} className="mx-auto w-full max-w-[34rem]" />
            </div>
          </div>
        </div>
      </header>

      <ShortAnswerBand guide={guide} />

      {/* ---------- the long read + rail ---------- */}
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div ref={bodyRef} className="min-w-0 px-5 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-14">
          <article className="max-w-[44rem]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <Takeaways items={guide.takeaways} />

            {guide.sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className={cn("scroll-mt-24 border-t pt-12", i === 0 ? "mt-0" : "mt-14", LINE)}
              >
                <SectionHeading id={s.id} index={i + 1} half={HALVES[s.id]}>
                  {s.title}
                </SectionHeading>
                <div className="mt-6">
                  <GrokBlocks blocks={s.blocks} idPrefix={s.id} />
                </div>
              </section>
            ))}

            <section
              id="checklist"
              aria-labelledby="checklist-title"
              className={cn("mt-14 scroll-mt-24 border-t pt-12", LINE)}
            >
              <SectionHeading id="checklist" index={guide.sections.length + 1} half="both">
                {checklistTitle}
              </SectionHeading>
              <Checklist slug={engine.slug} items={guide.checklist} />
            </section>

            <footer className={cn("mt-14 border-t pt-10", LINE)}>
              <AuthorCard author="Rankbox Team" />
            </footer>
          </article>
        </div>

        <aside className={cn("hidden border-l lg:block", LINE)}>
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-14 [scrollbar-width:none]">
            <TableOfContents entries={toc} variant="rail" />
            <RailNote />
          </div>
        </aside>
      </Band>

      <FaqBand faqs={guide.faqs} engineName={engine.name} />
      <SourcesBand
        sources={guide.sources}
        checked={
          updated
            ? `Each claim on this page is tied to one of these, checked as of ${updated}.`
            : "Each claim on this page is tied to one of these."
        }
      />
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
