/**
 * /ai-seo/manus, in the landing page's frame. Manus is an agent rather than
 * an index, so the page is built around one task's path through a site: the
 * hero shows it (AgentRun), the spec band names how the agent identifies
 * itself, and the article follows the same order — task, routes in, edge,
 * extraction, citation, bulk and repeat visits, ownership, measurement.
 */
import { useMemo, useRef, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Globe, KeyRound, Link2Off, ShieldCheck, Zap } from "lucide-react";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { Md } from "@/components/ai-seo/kit";
import { ReadingProgress, ShareButtons, TableOfContents } from "@/components/blog/ArticleChrome";
import { ExploreMore } from "@/components/ExploreMore";
import { Band, CELL, CellGrid, LINE, Pill } from "@/components/landing/frame";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import { AgentRun } from "./AgentRun";
import { GuideBlockView } from "./blocks";
import { ChecklistBand, ClosingBand, FaqBand, RailOffer, ReadNextBand, SourcesBand } from "./parts";

const SITE = "https://rankbox.xyz";
const FACT_ICONS = [Globe, KeyRound, ShieldCheck, Link2Off];

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ManusGuidePage({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug);
  const bodyRef = useRef<HTMLDivElement>(null);
  const minutes = guideReadingMinutes(guide);
  const url = `${SITE}/ai-seo/${guide.slug}`;
  const title = `${guide.headline.lead} ${guide.headline.accent}`;
  const name = engine?.name ?? "Manus";
  const updated = engine ? formatDate(engine.updated) : "";

  const toc = useMemo(
    () => [
      ...guide.sections.map((s) => ({ id: s.id, text: s.title })),
      { id: "checklist", text: `The ${name} checklist` },
      { id: "faq", text: "Questions, answered" },
      { id: "sources", text: "Sources" },
    ],
    [guide.sections, name],
  );

  return (
    <>
      <ReadingProgress target={bodyRef} />

      {/* ---------- hero ---------- */}
      <header id="top" className="relative scroll-mt-28 bg-white">
        <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
          <div
            className={cn(
              "flex flex-col gap-3 border-b px-5 py-3.5 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12",
              LINE,
            )}
          >
            <EngineRail active={guide.slug} />
            <nav aria-label="Breadcrumb" className="hidden lg:block">
              <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
                <li>
                  <Link to="/ai-seo" className="py-2 transition-colors hover:text-ink">
                    AI SEO guides
                  </Link>
                </li>
                <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
                <li aria-current="page" className="font-medium text-cta">
                  {name}
                </li>
              </ol>
            </nav>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]">
            <div className="flex flex-col justify-center px-5 pb-10 pt-9 motion-safe:animate-hero-rise sm:px-10 lg:py-14 lg:pl-12 lg:pr-10">
              <h1 className="text-balance font-display text-[2.05rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.7rem] lg:text-[2.85rem]">
                {guide.headline.lead}{" "}
                <span className="font-bold text-brand-blue">{guide.headline.accent}</span>
              </h1>
              <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">
                {guide.subhead}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[0.8rem] text-muted-foreground">
                  By{" "}
                  <Link
                    to="/about"
                    className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    Rankbox
                  </Link>
                  {updated && <> · Updated {updated}</>} · {minutes} min read
                </p>
                <ShareButtons url={url} title={title} />
              </div>
            </div>
            <div
              className={cn(
                "border-t p-3 motion-safe:animate-hero-rise sm:p-5 lg:border-l lg:border-t-0 lg:p-6",
                LINE,
              )}
              style={{ "--rise-delay": "0.08s" } as CSSProperties}
            >
              <AgentRun preview={guide.preview} />
            </div>
          </div>
        </div>
      </header>

      {/* ---------- spec band ---------- */}
      <Band>
        <CellGrid className="grid-cols-2 lg:grid-cols-4">
          {guide.facts.map((f, i) => {
            const Icon = FACT_ICONS[i % FACT_ICONS.length];
            return (
              <li key={f.label} className={cn(CELL, "px-5 py-5 sm:px-7 sm:py-6")}>
                <span className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <Icon aria-hidden className="h-3.5 w-3.5 text-brand-blue" />
                  {f.label}
                </span>
                <span
                  className={cn(
                    "mt-2 block text-[1.05rem] font-medium leading-snug tracking-[-0.01em] text-ink sm:text-[1.2rem]",
                    f.mono ? "font-mono text-[1rem] sm:text-[1.1rem]" : "font-display",
                  )}
                >
                  {f.value}
                </span>
              </li>
            );
          })}
        </CellGrid>
      </Band>

      {/* ---------- the short answer, then the takeaways ---------- */}
      <Band inner="grid gap-6 px-5 py-10 sm:px-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:py-14">
        <div>
          <Pill icon={Zap}>The short answer</Pill>
        </div>
        <p className="max-w-[48rem] text-[1.15rem] leading-[1.7] text-ink sm:text-[1.3rem] sm:leading-[1.65]">
          <Md text={guide.shortAnswer} />
        </p>
      </Band>
      <Band id="takeaways" className="scroll-mt-28">
        <h2 className="sr-only">Key takeaways</h2>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {guide.takeaways.map((t, i) => (
            <li key={i} className={cn(CELL, "flex gap-3 px-5 py-6 sm:px-7")}>
              <span className="w-6 shrink-0 pt-0.5 font-mono text-[0.72rem] font-semibold text-cta">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 break-words text-[0.93rem] leading-relaxed text-ink/80">
                <Md text={t} />
              </span>
            </li>
          ))}
        </CellGrid>
      </Band>

      {/* ---------- the article + rail ---------- */}
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div ref={bodyRef} className="min-w-0 px-5 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-14">
          <div className="max-w-[43rem]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            {guide.sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className={cn("scroll-mt-28 break-words", i > 0 && "mt-16 border-t pt-14", LINE)}
              >
                <p className="font-mono text-[0.72rem] font-semibold tracking-[0.12em] text-cta">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2
                  id={`${s.id}-title`}
                  className="mt-2 text-balance font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[2rem]"
                >
                  {s.title}
                </h2>
                {s.blocks.map((b, j) => (
                  <GuideBlockView key={j} block={b} />
                ))}
              </section>
            ))}
          </div>
        </div>

        <aside className={cn("hidden border-l lg:block", LINE)}>
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-14 [scrollbar-width:none]">
            <TableOfContents entries={toc} variant="rail" />
            <RailOffer />
          </div>
        </aside>
      </Band>

      <ChecklistBand items={guide.checklist} />
      <FaqBand faqs={guide.faqs} engineName={name} />
      <SourcesBand sources={guide.sources} checked={updated} />
      <ReadNextBand links={guide.furtherReading} />
      <ExploreMore
        path={`/ai-seo/${guide.slug}`}
        exclude={guide.furtherReading.map((r) => r.href)}
        framed
      />
      <ClosingBand />
    </>
  );
}
