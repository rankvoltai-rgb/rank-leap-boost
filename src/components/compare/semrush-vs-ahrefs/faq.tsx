/**
 * The questions people ask about this pair, every answer open in the server
 * HTML (the route lifts them into FAQPage JSON-LD), then how the page was
 * made and every source it rests on, grouped by who published it.
 */
import { BookMarked, HelpCircle } from "lucide-react";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { matchupTitle, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry, Source } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md } from "./md";

export function Faq({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <span id="faq-title">
            {matchupTitle(matchup)}: <Accent>common questions</Accent>
          </span>
        }
      />
      <Band>
        <CellGrid className="lg:grid-cols-2">
          {entry.faqs.map((f, i) => (
            <li key={f.q} className={cn(CELL, "px-6 py-8 sm:px-10 lg:px-12 lg:py-10")}>
              <h3 className="flex gap-3 text-[1.02rem] font-medium leading-snug text-ink sm:text-[1.06rem]">
                <span
                  aria-hidden
                  className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft text-[0.68rem] font-semibold text-cta tabular-nums"
                >
                  {i + 1}
                </span>
                {f.q}
              </h3>
              <p className="mt-3 pl-9 text-[0.9rem] leading-relaxed text-muted-foreground">
                <Md text={f.a} />
              </p>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Sources by publisher, in the order each publisher is first cited, numbered as listed. */
function byPublisher(sources: Source[]) {
  const groups = new Map<string, { n: number; source: Source }[]>();
  sources.forEach((source, i) => {
    const list = groups.get(source.publisher) ?? [];
    list.push({ n: i + 1, source });
    groups.set(source.publisher, list);
  });
  return [...groups.entries()];
}

export function Sources({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const groups = byPublisher(entry.sources);
  return (
    <section aria-labelledby="sources" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12",
              LINE,
            )}
          >
            <Pill icon={BookMarked}>Method &amp; sources</Pill>
            <h2
              id="sources"
              className="mt-5 scroll-mt-24 font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2rem]"
            >
              Where every fact <Accent>comes from</Accent>
            </h2>
            <p className="mt-3 text-[0.86rem] text-muted-foreground">
              {entry.sources.length} sources from {groups.length} publishers.
            </p>
          </div>
          <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
            <h3 className="text-[0.95rem] font-semibold text-ink">How we compared</h3>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
              From {sides.a.name}&rsquo;s and {sides.b.name}&rsquo;s own pricing pages,
              documentation and changelogs, plus dated third-party reporting, last read on{" "}
              {formatDate(entry.pricing.checkedOn)}. We haven&rsquo;t benchmarked either product
              ourselves, so where a round turns on judgment the verdict says so, and every factual
              claim traces to a source below. Rankbox makes a product in this space; it appears
              once, as the third option, and nowhere in the scoring.
            </p>
          </div>
        </div>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(([publisher, list]) => (
            <li key={publisher} className={cn(CELL, "px-6 py-7 sm:px-8")}>
              <h3 className="flex items-baseline justify-between gap-3 text-[0.88rem] font-semibold text-ink">
                {publisher}
                <span className="text-[0.72rem] font-normal tabular-nums text-muted-foreground">
                  {list.length}
                </span>
              </h3>
              <ul className="mt-3 space-y-2.5">
                {list.map(({ n, source }) => (
                  <li key={source.href} className="flex gap-2.5 text-[0.84rem] leading-snug">
                    <span className="w-5 shrink-0 text-right text-[0.72rem] tabular-nums text-ink/35">
                      {n}
                    </span>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group min-w-0"
                    >
                      <span className="text-ink decoration-ink/30 underline-offset-4 group-hover:text-cta group-hover:underline">
                        {source.title}
                      </span>
                      <span className="mt-0.5 block text-[0.74rem] text-muted-foreground">
                        {hostOf(source.href)} ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}
