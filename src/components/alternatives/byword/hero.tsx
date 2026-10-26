/**
 * The hero of /alternatives/byword: the landing hero's frame (white, between
 * the rails, copy centred over the dithered mark), with the two products'
 * spec sheet as the hairline band that closes it — the facts a shortlist is
 * decided on, side by side, each one checkable further down the page.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ChevronRight, Layers } from "lucide-react";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Accent, LINE, Pill } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark, VsLockup } from "@/components/alternatives/kit";
import { cn } from "@/lib/utils";
import { PLAN, formatUsd } from "@/data/pricing";
import { RANKBOX_SNAPSHOT, formatCheckedOn, type Competitor, type Fact } from "@/data/alternatives";
import { RANKBOX_TINT, StateMark, rise } from "./parts";

type Value = string | Fact;

/** The spec sheet's columns, read from the same snapshot the hub table uses. */
function specColumns(
  c: Competitor,
): { label: string; rankbox: Value; them: Value; nowrap?: boolean }[] {
  return [
    {
      label: "Price",
      nowrap: true,
      rankbox: `${formatUsd(PLAN.monthly)}/mo`,
      them: `${formatUsd(c.pricing.monthly)}/mo · ${c.pricing.plan}`,
    },
    {
      label: "Articles",
      nowrap: true,
      rankbox: `${PLAN.articlesPerMonth} a month`,
      them: c.pricing.articles ? `${c.pricing.articles} a month` : "Not sold per article",
    },
    { label: "Best for", rankbox: RANKBOX_SNAPSHOT.bestFor, them: c.snapshot.bestFor },
    { label: "Publishing", rankbox: RANKBOX_SNAPSHOT.publishing, them: c.snapshot.publishing },
    { label: "Backlinks", rankbox: RANKBOX_SNAPSHOT.backlinks, them: c.snapshot.backlinks },
    {
      label: "AI visibility",
      rankbox: RANKBOX_SNAPSHOT.aiVisibility,
      them: c.snapshot.aiVisibility,
    },
    { label: "Keyword data", rankbox: RANKBOX_SNAPSHOT.keywordData, them: c.snapshot.keywordData },
  ];
}

export function BywordHero({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section id="top" aria-labelledby="byword-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.3] [mask-image:radial-gradient(ellipse_62%_78%_at_50%_55%,#000_45%,transparent_100%)]"
        >
          <MarkDither />
        </div>

        <div className="relative px-5 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-8">
          <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
            <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link to="/alternatives" className="transition-colors hover:text-ink">
                  Alternatives
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="text-ink">
                {competitor.name}
              </li>
            </ol>
          </nav>

          <div className="mt-10 flex flex-col items-center text-center sm:mt-12">
            <div className="motion-safe:animate-hero-rise" style={rise(0.04)}>
              <VsLockup competitor={competitor} />
            </div>
            <div className="mt-6 motion-safe:animate-hero-rise" style={rise(0.1)}>
              <Pill icon={Layers}>{competitor.eyebrow}</Pill>
            </div>
            <h1
              id="byword-title"
              className="mt-5 max-w-4xl text-balance font-display text-[2.2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.3rem] lg:text-[3.75rem]"
              style={rise(0.16)}
            >
              <span className="sm:block">{competitor.headline.lead}</span>{" "}
              <Accent>{competitor.headline.accent}</Accent>
            </h1>
            <p
              className="mt-6 max-w-[44rem] text-balance text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
              style={rise(0.24)}
            >
              {competitor.subhead}
            </p>
            <div
              className="mt-9 w-full max-w-[37rem] motion-safe:animate-hero-rise"
              style={rise(0.32)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>
        </div>
      </div>

      <SpecSheet competitor={competitor} />
    </section>
  );
}

/* The band that closes the hero: both products' headline facts in one
   hairline table. On a phone it scrolls sideways inside its own box, with the
   product column pinned. */
function SpecSheet({ competitor }: { competitor: Competitor }) {
  const cols = specColumns(competitor);
  return (
    <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.42)}>
      <div className={cn("mx-auto max-w-6xl border-x", LINE)}>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <caption className="sr-only">
              Rankbox and {competitor.name} at a glance, checked{" "}
              {formatCheckedOn(competitor.pricing.checkedOn)}
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-[9.5rem] bg-white px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  At a glance
                </th>
                {cols.map((col) => (
                  <th
                    key={col.label}
                    scope="col"
                    className={cn(
                      "border-l px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
                      LINE,
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className={cn("border-t", LINE)}>
                <th
                  scope="row"
                  className={cn("sticky left-0 z-10 px-5 py-3.5 align-top", RANKBOX_TINT)}
                >
                  <span className="flex items-center gap-2 text-[0.85rem] font-semibold text-cta">
                    <RankboxMark className="h-6 w-6" />
                    Rankbox
                  </span>
                </th>
                {cols.map((col) => (
                  <td
                    key={col.label}
                    className={cn("border-l px-4 py-3.5 align-top", LINE, RANKBOX_TINT)}
                  >
                    <SpecValue value={col.rankbox} rankbox nowrap={col.nowrap} />
                  </td>
                ))}
              </tr>
              <tr className={cn("border-t", LINE)}>
                <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-3.5 align-top">
                  <span className="flex items-center gap-2 text-[0.85rem] font-semibold text-ink">
                    <CompetitorMark competitor={competitor} className="h-6 w-6 text-[0.6rem]" />
                    {competitor.name}
                  </span>
                </th>
                {cols.map((col) => (
                  <td key={col.label} className={cn("border-l px-4 py-3.5 align-top", LINE)}>
                    <SpecValue value={col.them} nowrap={col.nowrap} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p
          className={cn(
            "flex flex-wrap items-center gap-x-3 gap-y-1 border-t px-5 py-2.5 text-[0.75rem] text-muted-foreground",
            LINE,
          )}
        >
          <span>
            {competitor.name} facts from {competitor.domain}, checked{" "}
            {formatCheckedOn(competitor.pricing.checkedOn)}. Rankbox facts are what ships today.
          </span>
          <a
            href="#compare"
            className="inline-flex items-center gap-1 font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
          >
            Every row
            <ArrowDown className="h-3 w-3" aria-hidden />
          </a>
          <a
            href="#sources"
            className="inline-flex items-center gap-1 font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
          >
            Sources
            <ArrowDown className="h-3 w-3" aria-hidden />
          </a>
        </p>
      </div>
    </div>
  );
}

function SpecValue({
  value,
  rankbox = false,
  nowrap = false,
}: {
  value: Value;
  rankbox?: boolean;
  nowrap?: boolean;
}) {
  if (typeof value === "string") {
    return (
      <span
        className={cn(
          "block text-[0.84rem] leading-snug",
          nowrap && "whitespace-nowrap",
          rankbox ? "font-medium text-ink" : "text-ink/80",
        )}
      >
        {value}
      </span>
    );
  }
  return (
    <span className="flex items-start gap-2">
      <StateMark
        state={value.state}
        rankbox={rankbox}
        className="mt-px h-4 w-4 [&_svg]:h-2.5 [&_svg]:w-2.5"
      />
      <span
        className={cn(
          "text-[0.84rem] leading-snug",
          rankbox ? "font-medium text-ink" : "text-ink/80",
        )}
      >
        {value.short}
      </span>
    </span>
  );
}
