/**
 * /ai-seo/deepseek, in the landing page's frame.
 *
 * The page is built around the one thing that sets DeepSeek apart in 2026:
 * it runs its own search engine and publishes the scores each result
 * carries. So the hero pairs the headline with the quotable short answer and
 * four facts; the focal band shows one question answered with Search off and
 * on, the engine's scorecard beside it; then the long read, with a sticky
 * table of contents, the work list, FAQ and sources.
 */
import { useMemo, useRef, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, ToggleRight, Zap } from "lucide-react";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { Md } from "@/components/ai-seo/kit";
import { ReadingProgress, ShareButtons, TableOfContents } from "@/components/blog/ArticleChrome";
import { ExploreMore } from "@/components/ExploreMore";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { Accent, Band, LINE, PANEL, Pill, Spacer } from "@/components/landing/frame";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { GuideBlocks } from "./GuideBlocks";
import { SearchToggle } from "./SearchToggle";
import { ClosingBand, GuideFaq, GuideSources, MoreGuides, WorkList } from "./EndMatter";

const SITE = "https://rankbox.xyz";

/* Staggers the CSS entrance (animate-hero-rise in styles.css). */
const rise = (s: number) => ({ "--rise-delay": `${s}s` }) as CSSProperties;

/* ---------- hero ---------- */

function Hero({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug);
  const url = `${SITE}/ai-seo/${guide.slug}`;
  const title = `${guide.headline.lead} ${guide.headline.accent}`;
  return (
    <header id="top" className="relative scroll-mt-16 bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        {/* The way between guides, first thing on the page. */}
        <div
          className={cn(
            "flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12",
            LINE,
          )}
        >
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
              <li>
                <Link to="/ai-seo" className="py-2 transition-colors hover:text-ink">
                  AI SEO guides
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3.5 w-3.5 text-ink/25" />
              </li>
              <li aria-current="page" className="font-medium text-cta">
                {engine?.name ?? guide.slug}
              </li>
            </ol>
          </nav>
          <EngineRail active={guide.slug} />
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-center px-5 pb-10 pt-9 sm:px-10 lg:py-14 lg:pl-12 lg:pr-10">
            <h1
              className="text-balance font-display text-[2.05rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[2.75rem] lg:text-[3.05rem]"
              style={rise(0)}
            >
              {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
            </h1>
            <p
              className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
              style={rise(0.06)}
            >
              {guide.subhead}
            </p>
            <div
              className="mt-8 flex flex-wrap items-center justify-between gap-4 motion-safe:animate-hero-rise"
              style={rise(0.12)}
            >
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] text-muted-foreground">
                {engine && (
                  <span className="whitespace-nowrap">
                    Updated{" "}
                    <span className="font-medium text-ink">{formatDate(engine.updated)}</span>
                  </span>
                )}
                <span aria-hidden className="text-ink/20">
                  ·
                </span>
                <span className="whitespace-nowrap">{guideReadingMinutes(guide)} min read</span>
                <span aria-hidden className="text-ink/20">
                  ·
                </span>
                <span className="whitespace-nowrap">{guide.sources.length} sources</span>
              </p>
              <ShareButtons url={url} title={title} />
            </div>
          </div>

          {/* The answer to quote. */}
          <div className={cn("border-t p-3 sm:p-4 lg:border-l lg:border-t-0", LINE, PANEL)}>
            <div
              className="flex h-full flex-col justify-center rounded-xl border border-ink/[0.07] bg-white p-5 motion-safe:animate-hero-rise sm:p-7"
              style={rise(0.08)}
            >
              <Pill icon={Zap} className="w-fit">
                The short answer
              </Pill>
              <p className="mt-4 text-[0.98rem] leading-[1.7] text-ink/80 sm:text-[1.02rem]">
                <Md text={guide.shortAnswer} />
              </p>
            </div>
          </div>
        </div>

        {/* The spec strip: four facts that frame the guide. */}
        <dl className={cn("grid grid-cols-2 border-t lg:grid-cols-4", LINE)}>
          {guide.facts.map((f, i) => (
            <div
              key={f.label}
              className={cn(
                "flex flex-col justify-between gap-3 px-5 py-5 sm:px-8 lg:px-10",
                i % 2 === 1 && "border-l",
                i >= 2 && "border-t lg:border-t-0",
                i === 2 && "lg:border-l",
                LINE,
              )}
            >
              <dt className="text-[0.74rem] leading-snug text-muted-foreground">{f.label}</dt>
              <dd
                className={cn(
                  "font-medium leading-none text-brand-blue",
                  f.mono
                    ? "font-mono text-[1.1rem] sm:text-[1.25rem]"
                    : "font-display text-[1.55rem] tracking-[-0.02em] sm:text-[1.8rem]",
                )}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

/* ---------- focal band ---------- */

function FocalBand({ guide }: { guide: EngineGuide }) {
  return (
    <section aria-labelledby="search-toggle-title">
      <Band inner="flex flex-col gap-4 px-5 py-7 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <div>
          <Pill icon={ToggleRight}>Search off vs. on</Pill>
          <h2
            id="search-toggle-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.95rem]"
          >
            One question, <Accent>two answers</Accent>
          </h2>
        </div>
        <p className="max-w-md text-[0.8rem] leading-relaxed text-muted-foreground lg:text-right">
          Illustration, not a screenshot. Steps from DeepSeek's V4 encoding notes, fields from its
          Search API; the scores are invented and users never see them. Flip the Search pill to
          compare.
        </p>
      </Band>
      <Band inner={PANEL}>
        <SearchToggle preview={guide.preview} />
      </Band>
    </section>
  );
}

/* ---------- body ---------- */

function Takeaways({ items }: { items: string[] }) {
  return (
    <section
      id="takeaways"
      aria-labelledby="takeaways-title"
      className="scroll-mt-28 rounded-xl border border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_45%,white)] p-5 sm:p-7"
    >
      <h2
        id="takeaways-title"
        className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-cta"
      >
        In brief
      </h2>
      <ul className="mt-4 space-y-3.5">
        {items.map((t) => (
          <li key={t} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
            <span className="mt-[0.3rem] flex h-[1.1rem] w-[1.1rem] items-center justify-center rounded-full bg-cta text-white">
              <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
            </span>
            <span className="text-[0.98rem] leading-[1.7] text-ink/80">
              <Md text={t} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RailOffer() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5">
      <p className="font-display text-[1rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        Pages DeepSeek can date, trust and quote
      </p>
      <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted-foreground">
        Rankbox writes source-backed, dated articles for the questions your buyers ask.
      </p>
      <a
        href="/auth"
        className="group mt-4 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-cta px-4 text-[0.82rem] font-semibold text-white transition-colors hover:bg-cta-hover"
      >
        Start free trial
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
      <p className="mt-2 text-center text-[0.68rem] text-muted-foreground">{TRIAL_NOTE}</p>
    </div>
  );
}

export function DeepseekLayout({ guide }: { guide: EngineGuide }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const toc = useMemo(
    () => [
      { id: "takeaways", text: "In brief" },
      ...guide.sections.map((s) => ({ id: s.id, text: s.title })),
      { id: "checklist", text: "Your DeepSeek work list" },
      { id: "faq", text: "Questions" },
      { id: "sources", text: "Sources" },
    ],
    [guide.sections],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />
      <article>
        <Hero guide={guide} />
        <FocalBand guide={guide} />
        <Spacer />

        <Band inner="grid lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div ref={bodyRef} className="min-w-0 px-5 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-14">
            <div className="max-w-[44rem]">
              <TableOfContents entries={toc} variant="inline" className="mb-8 lg:hidden" />
              <Takeaways items={guide.takeaways} />

              {guide.sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-title`}
                  className={cn("mt-14 scroll-mt-28 border-t pt-12", LINE)}
                >
                  <p className="font-mono text-[0.72rem] font-semibold text-cta">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2
                    id={`${s.id}-title`}
                    className="mt-2 text-balance font-display text-[1.65rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[2rem]"
                  >
                    {s.title}
                  </h2>
                  <GuideBlocks blocks={s.blocks} idPrefix={s.id} />
                </section>
              ))}

              <div className={cn("mt-14 border-t pt-12", LINE)}>
                <WorkList items={guide.checklist} />
              </div>
            </div>
          </div>

          <aside className={cn("hidden border-l lg:block", LINE)}>
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-14 [scrollbar-width:none]">
              <TableOfContents entries={toc} variant="rail" />
              {/* Only where the full contents list still fits above it. */}
              <div className="hidden [@media(min-height:62rem)]:block">
                <RailOffer />
              </div>
            </div>
          </aside>
        </Band>
      </article>

      <GuideFaq faqs={guide.faqs} />
      <GuideSources sources={guide.sources} />
      <MoreGuides guide={guide} />
      <ExploreMore
        path={`/ai-seo/${guide.slug}`}
        exclude={guide.furtherReading.map((r) => r.href)}
        framed
      />
      <ClosingBand />
    </>
  );
}
