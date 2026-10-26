/**
 * The comparisons themselves, shelved by kind of product. Each shelf is a
 * ruled header band and a row of hairline cells; a shelf with fewer tools
 * gives each one more room (one tool gets the full width, laid out sideways)
 * rather than leaving empty cells. Each card previews the page: the rows
 * where the two genuinely differ, read from the competitor's own matrix, and
 * the date its facts were checked.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CompetitorMark, FactDot } from "@/components/alternatives/kit";
import { Reveal } from "@/components/landing/shared";
import { Band, CELL, CellGrid, LINE, PANEL } from "@/components/landing/frame";
import { KIND_BLURB, formatCheckedOn, type Competitor } from "@/data/alternatives";
import { cn } from "@/lib/utils";
import { UsMark } from "./marks";
import { KIND_GROUPS, differences } from "./data";

/* Spans on the six-column desktop grid, by how many tools share the shelf. */
const SPAN: Record<number, string> = {
  1: "sm:col-span-2 lg:col-span-6",
  2: "lg:col-span-3",
  3: "lg:col-span-2",
};

function Lockup({ competitor }: { competitor: Competitor }) {
  return (
    <span aria-hidden className="flex items-center gap-2">
      <UsMark className="h-9 w-9 text-brand-blue" />
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        vs
      </span>
      <CompetitorMark competitor={competitor} className="h-9 w-9" />
    </span>
  );
}

function Differences({ competitor }: { competitor: Competitor }) {
  const rows = differences(competitor);
  if (rows.length === 0) return null;
  return (
    <ul className={cn("rounded-lg border bg-white", LINE)}>
      <li
        aria-hidden
        className={cn(
          "grid grid-cols-[minmax(0,1fr)_1.25rem_1.25rem] items-center gap-2.5 border-b px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
          LINE,
        )}
      >
        <span>Where they differ</span>
        <UsMark className="h-5 w-5 text-brand-blue" />
        <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.5rem]" />
      </li>
      {rows.map((r) => (
        <li
          key={r.label}
          className="grid grid-cols-[minmax(0,1fr)_1.25rem_1.25rem] items-center gap-2.5 px-3 py-2 text-xs"
        >
          <span className="truncate text-ink">{r.label}</span>
          <span className="flex justify-center">
            <span className="sr-only">Rankbox:</span>
            <FactDot state={r.rankbox.state} className="mt-0 h-5 w-5" />
          </span>
          <span className="flex justify-center">
            <span className="sr-only">{competitor.name}:</span>
            <FactDot state={r.them.state} className="mt-0 h-5 w-5" />
          </span>
        </li>
      ))}
    </ul>
  );
}

function ComparisonCard({ competitor, wide }: { competitor: Competitor; wide: boolean }) {
  return (
    <Link
      to="/alternatives/$slug"
      params={{ slug: competitor.slug }}
      className={cn(
        "group flex h-full flex-col gap-6 p-6 transition-colors hover:bg-[color-mix(in_oklab,var(--cta)_3%,white)] focus-visible:bg-[color-mix(in_oklab,var(--cta)_4%,white)] focus-visible:outline-none sm:p-8",
        wide && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12",
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <Lockup competitor={competitor} />
          <span className="text-right text-[0.7rem] text-muted-foreground">
            Checked {formatCheckedOn(competitor.pricing.checkedOn)}
          </span>
        </div>
        <h4 className="mt-5 font-display text-[1.2rem] font-medium tracking-[-0.02em] text-ink">
          Rankbox vs {competitor.name}
        </h4>
        <p className="mt-1 text-xs font-medium text-cta">{competitor.category}</p>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {competitor.oneLiner}
        </p>
        {wide && (
          <span className="mt-6 hidden items-center gap-1.5 text-sm font-semibold text-cta lg:inline-flex">
            Read the full comparison
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>

      <div className={cn("mt-auto flex flex-col gap-6", wide && "lg:mt-0 lg:justify-center")}>
        <Differences competitor={competitor} />
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-semibold text-cta",
            wide && "lg:hidden",
          )}
        >
          Read the full comparison
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function Shelves() {
  return (
    <>
      {KIND_GROUPS.map((g) => {
        const span = SPAN[Math.min(g.items.length, 3)] ?? SPAN[3];
        return (
          <div key={g.kind}>
            <Band inner={cn("px-5 py-4 sm:px-8", PANEL)}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-ink">
                  {g.label}
                  <span
                    className={cn(
                      "rounded-md border bg-white px-1.5 py-0.5 text-[0.68rem] font-medium tabular-nums text-muted-foreground",
                      LINE,
                    )}
                  >
                    {g.items.length}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground">{KIND_BLURB[g.kind]}</p>
              </div>
            </Band>
            <Band>
              <CellGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
                {g.items.map((c, i) => (
                  <li key={c.slug} className={cn(CELL, "bg-white", span)}>
                    <Reveal className="h-full" delay={(i % 3) * 0.06}>
                      <ComparisonCard competitor={c} wide={g.items.length === 1} />
                    </Reveal>
                  </li>
                ))}
              </CellGrid>
            </Band>
          </div>
        );
      })}
    </>
  );
}
