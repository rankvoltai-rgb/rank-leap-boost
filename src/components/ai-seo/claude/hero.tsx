/**
 * The top of the Claude guide: the engine rail and the title on the left, the
 * citation it's all about on the right; then the quotable short answer and the
 * four-fact spec band, each a band of its own inside the rails.
 */
import { Link } from "@tanstack/react-router";
import { ChevronRight, Quote } from "lucide-react";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { Md } from "@/components/ai-seo/kit";
import { Accent, Band, LINE, Pill } from "@/components/landing/frame";
import type { Engine } from "@/data/ai-seo/engines";
import type { EngineGuide } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";
import { CitationAnatomy } from "./citation-anatomy";

export function ClaudeHero({
  engine,
  guide,
  minutes,
}: {
  engine: Engine;
  guide: EngineGuide;
  minutes: number;
}) {
  return (
    <header id="top" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        {/* The way between guides, on a strip of its own above the title. */}
        <div
          className={cn(
            "flex flex-col gap-3 border-b px-5 py-4 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12",
            LINE,
          )}
        >
          <EngineRail active={guide.slug} />
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
              <li>
                <Link to="/ai-seo" className="py-2 transition-colors hover:text-ink">
                  AI SEO guides
                </Link>
              </li>
              <li aria-current="page" className="flex items-center gap-1.5 font-medium text-cta">
                <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
                {engine.name}
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <div className="flex min-w-0 flex-col justify-center px-5 pb-10 pt-8 sm:px-10 lg:py-14 lg:pl-12 lg:pr-10">
            <h1 className="text-balance font-display text-[2.1rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink sm:text-[2.75rem] lg:text-[3.05rem]">
              {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
            </h1>
            <p className="mt-5 max-w-[38rem] text-[1.05rem] leading-relaxed text-muted-foreground sm:text-[1.12rem]">
              {plainText(guide.subhead)}
            </p>

            <ul className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8rem] text-muted-foreground">
              <li>
                Updated{" "}
                <time dateTime={engine.updated} className="font-medium text-ink">
                  {formatDate(engine.updated)}
                </time>
              </li>
              <li aria-hidden className="hidden h-3.5 w-px bg-ink/[0.12] sm:block" />
              <li>
                <span className="font-medium text-ink">{minutes} minutes</span> to read
              </li>
              <li aria-hidden className="hidden h-3.5 w-px bg-ink/[0.12] sm:block" />
              <li>
                <a href="#sources" className="transition-colors hover:text-ink">
                  <span className="font-medium text-ink">{guide.sources.length} sources</span>,
                  linked at the end
                </a>
              </li>
            </ul>
          </div>

          {/* The citation, in a grey cell of its own. */}
          <div
            className={cn(
              "flex items-center border-t bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-12",
              LINE,
            )}
          >
            <CitationAnatomy preview={guide.preview} className="mx-auto w-full max-w-[30rem]" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function ShortAnswer({ text }: { text: string }) {
  return (
    <Band inner="grid gap-5 px-5 py-9 sm:px-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:py-11">
      <div>
        <Pill icon={Quote}>The short answer</Pill>
      </div>
      <p className="max-w-[48rem] text-pretty text-[1.1rem] leading-[1.7] text-ink sm:text-[1.2rem]">
        <Md text={text} />
      </p>
    </Band>
  );
}

export function FactBand({ facts }: { facts: EngineGuide["facts"] }) {
  return (
    <Band>
      <div className="overflow-hidden">
        <dl className="-mb-px -mr-px grid grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div
              key={f.label}
              className={cn(
                "flex flex-col-reverse justify-end gap-2 border-b border-r px-5 py-6 sm:px-8",
                LINE,
              )}
            >
              <dt className="text-[0.8rem] leading-snug text-muted-foreground">
                {plainText(f.label)}
              </dt>
              <dd
                className={cn(
                  "text-ink",
                  f.mono
                    ? "font-mono text-[1rem] font-semibold leading-snug sm:text-[1.1rem]"
                    : "font-display text-[1.15rem] font-medium leading-snug tracking-[-0.02em] sm:text-[1.3rem]",
                )}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Band>
  );
}
