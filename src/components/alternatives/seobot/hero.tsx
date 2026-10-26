/**
 * The hero of /alternatives/seobot: the promise on the left over a faint
 * staircase (the page's motif: SEObot's six credit plans against Rankbox's
 * one), and the facts that decide most shortlists ruled down the right as a
 * two-column sheet. Facts rather than scores: "$199 a month, 50 articles"
 * can be checked against SEObot's own pricing doc, a 0–100 bar can't.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { UrlForm } from "@/components/landing/Hero";
import { LINE, Pill } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { PLAN, formatUsd } from "@/data/pricing";
import {
  RANKBOX_SNAPSHOT,
  formatCheckedOnShort,
  type CellState,
  type Competitor,
  type Fact,
} from "@/data/alternatives";
import { StateMark } from "./atoms";
import { RANKBOX_TINT, rise } from "./tokens";

/* A stepped outline rising to the right, with one low flat step beside it:
   the ladder the page is about, drawn as a hairline. */
function StepTrace() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_75%_at_70%_80%,#000_15%,transparent_75%)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,24,40,0.10)_1px,transparent_1.3px)] [background-size:18px_18px]" />
      <svg
        viewBox="0 0 640 420"
        preserveAspectRatio="xMaxYMax meet"
        className="absolute bottom-0 right-0 h-[78%] w-auto text-brand-blue"
      >
        <path
          d="M196 420V356H270V306H344V256H418V206H492V156H566V106H640"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1.25"
        />
        <path
          d="M196 420V356H270V306H344V256H418V206H492V156H566V106H640V420Z"
          fill="currentColor"
          fillOpacity="0.035"
        />
        <path d="M40 420V356H140V420" fill="currentColor" fillOpacity="0.09" />
        <path d="M40 420V356H140V420" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      </svg>
    </div>
  );
}

type GlanceCell = string | Fact;

function glanceRows(c: Competitor): { label: string; rankbox: GlanceCell; them: GlanceCell }[] {
  return [
    { label: "Best for", rankbox: RANKBOX_SNAPSHOT.bestFor, them: c.snapshot.bestFor },
    {
      label: "Price",
      rankbox: `${formatUsd(PLAN.monthly)}/mo`,
      them: `${formatUsd(c.pricing.monthly)}/mo · ${c.pricing.plan}`,
    },
    {
      label: "Articles",
      rankbox: `${PLAN.articlesPerMonth} a month`,
      them: c.pricing.articles ? `${c.pricing.articles} a month` : "Not sold per article",
    },
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

function GlanceValue({ value, brand }: { value: GlanceCell; brand?: boolean }) {
  if (typeof value === "string") {
    return (
      <span className={cn("block", brand ? "font-medium text-ink" : "text-ink/80")}>{value}</span>
    );
  }
  return (
    <span className="flex items-start gap-2">
      <StateMark state={value.state as CellState} brand={brand} />
      <span className={brand ? "text-ink" : "text-ink/80"}>{value.short}</span>
    </span>
  );
}

function GlanceSheet({ competitor }: { competitor: Competitor }) {
  const rows = glanceRows(competitor);
  return (
    <div className="flex h-full flex-col">
      <table className="w-full flex-1 table-fixed border-collapse text-left">
        <caption className="px-5 pb-4 pt-6 text-left sm:px-8 lg:pt-8">
          <span className="flex items-center justify-between gap-3">
            <span className="text-[0.95rem] font-medium tracking-tight text-ink">At a glance</span>
            <span className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.72rem] font-medium text-cta-hover">
              Checked {formatCheckedOnShort(competitor.pricing.checkedOn)}
            </span>
          </span>
        </caption>
        <colgroup>
          <col className="w-[6.4rem] sm:w-[7rem] lg:w-[6.6rem]" />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr className={cn("border-t", LINE)}>
            <th scope="col" className="py-3 pl-4 pr-2 sm:pl-8">
              <span className="sr-only">Fact</span>
            </th>
            <th scope="col" className={cn("border-l px-3 py-3 sm:px-4", LINE, RANKBOX_TINT)}>
              <span className="flex items-center gap-2 text-[0.85rem] font-semibold text-ink">
                <RankboxMark className="h-6 w-6" />
                Rankbox
              </span>
            </th>
            <th scope="col" className={cn("border-l px-3 py-3 sm:px-4", LINE)}>
              <span className="flex min-w-0 items-center gap-2 text-[0.85rem] font-semibold text-ink">
                <CompetitorMark competitor={competitor} className="h-6 w-6 text-[0.55rem]" />
                <span className="truncate">{competitor.name}</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="text-[0.8rem] leading-snug">
          {rows.map((r) => (
            <tr key={r.label} className={cn("border-t", LINE)}>
              <th
                scope="row"
                className="py-3 pl-4 pr-2 align-top text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:pl-8"
              >
                {r.label}
              </th>
              <td className={cn("border-l px-3 py-3 align-top sm:px-4", LINE, RANKBOX_TINT)}>
                <GlanceValue value={r.rankbox} brand />
              </td>
              <td className={cn("border-l px-3 py-3 align-top sm:px-4", LINE)}>
                <GlanceValue value={r.them} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p
        className={cn(
          "mt-auto border-t px-5 py-4 text-[0.75rem] leading-relaxed text-muted-foreground sm:px-8",
          LINE,
        )}
      >
        {competitor.name} facts from their own pages; Rankbox facts are what ships today.{" "}
        <a href="#compare" className="font-medium text-ink underline underline-offset-2">
          Every row
        </a>{" "}
        and{" "}
        <a href="#sources" className="font-medium text-ink underline underline-offset-2">
          the sources
        </a>{" "}
        are below.
      </p>
    </div>
  );
}

export function SeobotHero({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");

  return (
    <section id="top" aria-labelledby="alt-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.3fr_1fr]">
          <div className="relative overflow-hidden px-5 pb-14 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-20 lg:pl-14 lg:pr-12">
            <StepTrace />

            <div className="relative">
              <nav
                aria-label="Breadcrumb"
                className="motion-safe:animate-hero-rise"
                style={rise(0)}
              >
                <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                  <li>
                    <Link to="/" className="py-2 transition-colors hover:text-ink">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li>
                    <Link to="/alternatives" className="py-2 transition-colors hover:text-ink">
                      Alternatives
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li aria-current="page" className="font-medium text-ink">
                    {competitor.name}
                  </li>
                </ol>
              </nav>

              <div
                className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise sm:mt-12"
                style={rise(0.05)}
              >
                <span aria-hidden className="flex items-center gap-2">
                  <RankboxMark className="h-8 w-8" />
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    vs
                  </span>
                  <CompetitorMark competitor={competitor} className="h-8 w-8 text-[0.6rem]" />
                </span>
                <Pill icon={Scale}>{competitor.eyebrow}</Pill>
              </div>

              <h1
                id="alt-title"
                className="mt-6 text-balance font-display text-[2.2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.1rem] lg:text-[3.2rem] xl:text-[3.45rem]"
                style={rise(0.12)}
              >
                <span className="block">{competitor.headline.lead}</span>{" "}
                <span className="font-bold text-brand-blue">{competitor.headline.accent}</span>
              </h1>

              <p
                className="mt-6 max-w-[36rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
                style={rise(0.22)}
              >
                {competitor.subhead}
              </p>

              <div
                className="mt-9 w-full max-w-[35rem] motion-safe:animate-hero-rise"
                style={rise(0.32)}
              >
                <UrlForm url={url} onChange={setUrl} variant="split" />
                <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "border-t bg-white motion-safe:animate-hero-rise lg:border-l lg:border-t-0",
              LINE,
            )}
            style={rise(0.42)}
          >
            <GlanceSheet competitor={competitor} />
          </div>
        </div>
      </div>
    </section>
  );
}
