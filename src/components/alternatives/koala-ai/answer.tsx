/**
 * The quotable paragraph, set as a page of its own: the short answer large on
 * the left, each product's one-line verdict and who it suits on the right,
 * and the four shortlist facts as a hairline table underneath. The table
 * reads from the same snapshot as the hub, so the two never disagree.
 */
import { MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, LINE, Pill, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import {
  RANKBOX_SNAPSHOT,
  formatCheckedOnShort,
  type Competitor,
  type Fact,
} from "@/data/alternatives";
import { StateGlyph } from "./parts";
import { RANKBOX_TINT } from "./tokens";

function Verdict({
  mark,
  name,
  verdict,
  bestFor,
}: {
  mark: React.ReactNode;
  name: string;
  verdict: string;
  bestFor: string;
}) {
  return (
    <div className="flex gap-3.5 px-6 py-7 sm:px-9">
      {mark}
      <div className="min-w-0">
        <p className="text-[0.95rem] font-semibold text-ink">{name}</p>
        <p className="mt-1 text-[0.9rem] leading-relaxed text-muted-foreground">{verdict}</p>
        <p className="mt-3 text-[0.78rem] text-muted-foreground">
          <span className="font-semibold uppercase tracking-[0.1em] text-ink/70">Best for</span> ·{" "}
          {bestFor}
        </p>
      </div>
    </div>
  );
}

function FactCell({ fact, tone }: { fact: Fact; tone: "rankbox" | "them" }) {
  return (
    <span className="flex items-start gap-2">
      <StateGlyph state={fact.state} tone={tone} className="mt-px" />
      <span
        className={cn(
          "text-[0.85rem] leading-snug",
          tone === "rankbox" ? "text-ink" : "text-ink/80",
        )}
      >
        {fact.short}
      </span>
    </span>
  );
}

export function ShortAnswer({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const facts: { label: string; rankbox: Fact; them: Fact }[] = [
    { label: "Publishing", rankbox: RANKBOX_SNAPSHOT.publishing, them: c.snapshot.publishing },
    { label: "Backlinks", rankbox: RANKBOX_SNAPSHOT.backlinks, them: c.snapshot.backlinks },
    {
      label: "AI visibility",
      rankbox: RANKBOX_SNAPSHOT.aiVisibility,
      them: c.snapshot.aiVisibility,
    },
    { label: "Keyword data", rankbox: RANKBOX_SNAPSHOT.keywordData, them: c.snapshot.keywordData },
  ];

  return (
    <section id="answer" aria-labelledby="answer-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[1.55fr_1fr]">
          <Reveal
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-14",
              LINE,
            )}
          >
            <h2 id="answer-title">
              <Pill icon={MessageSquareQuote}>The short answer</Pill>
            </h2>
            <p className="mt-6 text-pretty text-[1.08rem] leading-[1.7] text-ink sm:text-[1.22rem] sm:leading-[1.7]">
              {c.shortAnswer}
            </p>
          </Reveal>

          <Reveal delay={0.06} className="flex flex-col justify-center">
            <div className={cn("border-b", LINE, RANKBOX_TINT)}>
              <Verdict
                mark={<RankboxMark className="h-9 w-9" />}
                name="Rankbox"
                verdict={c.verdict.rankbox}
                bestFor={RANKBOX_SNAPSHOT.bestFor}
              />
            </div>
            <Verdict
              mark={<CompetitorMark competitor={c} className="h-9 w-9" />}
              name={c.name}
              verdict={c.verdict.them}
              bestFor={c.snapshot.bestFor}
            />
          </Reveal>
        </div>
      </Band>

      {/* The shortlist facts, as a hairline table. */}
      <Band>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">
              Rankbox and {c.name} at a glance, checked {formatCheckedOnShort(c.pricing.checkedOn)}
            </caption>
            <thead>
              <tr>
                <th scope="col" className="w-[22%] px-6 py-4 sm:px-10">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    At a glance
                  </span>
                </th>
                <th scope="col" className={cn("border-l px-5 py-4 sm:px-6", LINE, RANKBOX_TINT)}>
                  <span className="flex items-center gap-2 text-sm font-medium text-cta">
                    <RankboxMark className="h-5 w-5" />
                    Rankbox
                  </span>
                </th>
                <th scope="col" className={cn("border-l px-5 py-4 sm:px-6", LINE)}>
                  <span className="flex items-center gap-2 text-sm font-medium text-ink">
                    <CompetitorMark competitor={c} className="h-5 w-5 text-[0.5rem]" />
                    {c.name}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {facts.map((f) => (
                <tr key={f.label} className={cn("border-t", LINE)}>
                  <th
                    scope="row"
                    className="px-6 py-4 text-[0.85rem] font-normal text-muted-foreground sm:px-10"
                  >
                    {f.label}
                  </th>
                  <td className={cn("border-l px-5 py-4 sm:px-6", LINE, RANKBOX_TINT)}>
                    <FactCell fact={f.rankbox} tone="rankbox" />
                  </td>
                  <td className={cn("border-l px-5 py-4 sm:px-6", LINE)}>
                    <FactCell fact={f.them} tone="them" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>
    </section>
  );
}
