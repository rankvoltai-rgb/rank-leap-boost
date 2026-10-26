/**
 * The quotable paragraph, then the two products as two cards: what each one
 * is for in a sentence (the data's verdict), and the facts that decide most
 * shortlists, read from the same snapshot the /alternatives hub uses so the
 * two pages can never disagree.
 */
import type { ReactNode } from "react";
import { CalendarCheck, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, LINE, LINE_FILL, Pill, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { COMPANY } from "@/data/company";
import { PLAN, formatUsd } from "@/data/pricing";
import {
  RANKBOX_SNAPSHOT,
  formatCheckedOn,
  type Competitor,
  type Fact,
  type Snapshot,
} from "@/data/alternatives";
import { StateToken } from "./parts";

export function ShortAnswer({ competitor }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="short-answer-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)]">
          <Reveal
            className={cn(
              "flex flex-col justify-between gap-6 border-b px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-12",
              LINE,
            )}
          >
            <div>
              <Pill icon={Quote}>In one paragraph</Pill>
              <h2
                id="short-answer-title"
                className="mt-5 font-display text-[1.75rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
              >
                The short answer
              </h2>
            </div>
            <p className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
              <CalendarCheck className="h-3.5 w-3.5 text-cta" aria-hidden />
              {competitor.name} checked {formatCheckedOn(competitor.pricing.checkedOn)}
            </p>
          </Reveal>
          <Reveal delay={0.06} className="px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
            <p className="max-w-[48rem] text-pretty text-[1.06rem] leading-[1.75] text-ink/90 sm:text-[1.18rem]">
              {competitor.shortAnswer}
            </p>
          </Reveal>
        </div>
      </Band>
      <Band>
        <div className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          <ProductCard
            highlight
            mark={<RankboxMark className="h-10 w-10" />}
            name="Rankbox"
            category={COMPANY.category}
            verdict={competitor.verdict.rankbox}
            snapshot={RANKBOX_SNAPSHOT}
            price={`${formatUsd(PLAN.monthly)}/mo`}
            articles={`${PLAN.articlesPerMonth} a month`}
          />
          <ProductCard
            mark={<CompetitorMark competitor={competitor} className="h-10 w-10" />}
            name={competitor.name}
            category={competitor.category}
            verdict={competitor.verdict.them}
            snapshot={competitor.snapshot}
            price={`${formatUsd(competitor.pricing.monthly)}/mo · ${competitor.pricing.plan}`}
            articles={
              competitor.pricing.articles
                ? `${competitor.pricing.articles} a month`
                : "Not sold per article"
            }
            delay={0.06}
          />
        </div>
      </Band>
    </section>
  );
}

function ProductCard({
  highlight = false,
  mark,
  name,
  category,
  verdict,
  snapshot,
  price,
  articles,
  delay = 0,
}: {
  highlight?: boolean;
  mark: ReactNode;
  name: string;
  category: string;
  verdict: string;
  snapshot: Snapshot;
  price: string;
  articles: string;
  delay?: number;
}) {
  const facts: { label: string; value: string | Fact }[] = [
    { label: "Best for", value: snapshot.bestFor },
    { label: "Price", value: price },
    { label: "Articles included", value: articles },
    { label: "Publishing", value: snapshot.publishing },
    { label: "Backlinks", value: snapshot.backlinks },
    { label: "AI visibility", value: snapshot.aiVisibility },
    { label: "Keyword data", value: snapshot.keywordData },
  ];
  return (
    <div className={highlight ? "bg-[color-mix(in_oklab,var(--cta)_4%,white)]" : "bg-white"}>
      <Reveal delay={delay} className="flex h-full flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
        <div className="flex items-center gap-3.5">
          {mark}
          <div className="min-w-0">
            <h3 className="text-[1rem] font-semibold tracking-tight text-ink">{name}</h3>
            <p className="text-[0.8rem] text-muted-foreground">{category}</p>
          </div>
        </div>
        <p className="mt-6 text-balance font-display text-[1.3rem] font-medium leading-[1.3] tracking-[-0.02em] text-ink sm:text-[1.45rem]">
          {verdict}
        </p>
        <dl className={cn("mt-7 divide-y border-t", LINE, "divide-ink/[0.07]")}>
          {facts.map((f) => (
            <div
              key={f.label}
              className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)]"
            >
              <dt className="pt-px text-[0.78rem] text-muted-foreground">{f.label}</dt>
              <dd className="text-[0.86rem] leading-snug text-ink">
                {typeof f.value === "string" ? (
                  <span className={highlight ? "font-medium" : undefined}>{f.value}</span>
                ) : (
                  <span className="flex items-start gap-2">
                    <StateToken state={f.value.state} size="sm" className="mt-px" />
                    <span className={highlight ? "font-medium" : undefined}>{f.value.short}</span>
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
