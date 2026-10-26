/**
 * The field as a hairline table: every tool, the same five questions, the
 * Rankbox row pinned first and carrying the soft blue key across. On a phone
 * the table keeps its shape and scrolls inside its own box, with the tool
 * column pinned so a row never loses its name.
 */
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CompetitorMark, FactDot } from "@/components/alternatives/kit";
import { LINE } from "@/components/landing/frame";
import type { Fact } from "@/data/alternatives";
import { cn } from "@/lib/utils";
import { UsMark } from "./marks";
import { FIELD_ROWS, type FieldRow } from "./data";

/* Widths on the 900px-minimum table, so "Per article" never wraps. */
const HEADERS = [
  { label: "Price", width: "w-[12%]" },
  { label: "Per article", width: "w-[10%]" },
  { label: "Publishing", width: "w-[18%]" },
  { label: "Backlinks", width: "w-[16%]" },
  { label: "AI visibility", width: "w-[17%]" },
];

const US_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";

function FactCell({ fact, us }: { fact: Fact; us?: boolean }) {
  return (
    <td className={cn("border-l px-4 py-4 align-top", LINE, us && US_TINT)}>
      <span className="flex items-start gap-2 text-[0.8rem] leading-snug text-ink/85">
        <FactDot state={fact.state} />
        <span className="min-w-0">{fact.short}</span>
      </span>
    </td>
  );
}

function ToolCell({ row }: { row: FieldRow }) {
  return (
    <th
      scope="row"
      className={cn(
        "sticky left-0 z-10 px-4 py-4 text-left align-top font-normal shadow-[inset_-1px_0_0_rgba(16,24,40,0.07)] sm:px-6",
        row.us ? "bg-[color-mix(in_oklab,var(--cta)_5%,white)]" : "bg-white",
      )}
    >
      <span className="flex items-start gap-3">
        {row.us ? (
          <UsMark className="h-8 w-8 text-brand-blue" />
        ) : (
          <CompetitorMark competitor={row.competitor!} className="h-8 w-8" />
        )}
        <span className="min-w-0">
          {row.competitor ? (
            <Link
              to="/alternatives/$slug"
              params={{ slug: row.competitor.slug }}
              className="group inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-cta"
            >
              {row.name}
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-cta" />
            </Link>
          ) : (
            <span className="text-sm font-semibold text-cta">{row.name}</span>
          )}
          <span className="mt-0.5 block max-w-[8.5rem] text-xs leading-snug text-muted-foreground sm:max-w-none">
            {row.bestFor}
          </span>
        </span>
      </span>
    </th>
  );
}

export function FieldTable() {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <caption className="sr-only">AI SEO tools compared</caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 w-[12rem] bg-white px-4 shadow-[inset_-1px_0_0_rgba(16,24,40,0.07)] sm:w-[27%] py-4 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-6"
            >
              Tool
            </th>
            {HEADERS.map((h) => (
              <th
                key={h.label}
                scope="col"
                className={cn(
                  "whitespace-nowrap border-l px-4 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
                  LINE,
                  h.width,
                )}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FIELD_ROWS.map((r) => (
            <tr key={r.key} className={cn("border-t", LINE)}>
              <ToolCell row={r} />
              <td className={cn("border-l px-4 py-4 align-top", LINE, r.us && US_TINT)}>
                <span
                  className={cn(
                    "block text-sm font-semibold tabular-nums",
                    r.us ? "text-cta" : "text-ink",
                  )}
                >
                  {r.price}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{r.plan}</span>
              </td>
              <td className={cn("border-l px-4 py-4 align-top", LINE, r.us && US_TINT)}>
                <span
                  className={cn(
                    "text-sm tabular-nums",
                    r.each === null
                      ? "text-muted-foreground"
                      : r.us
                        ? "font-semibold text-cta"
                        : "font-semibold text-ink",
                  )}
                >
                  {r.perArticle}
                </span>
              </td>
              <FactCell fact={r.publishing} us={r.us} />
              <FactCell fact={r.backlinks} us={r.us} />
              <FactCell fact={r.aiVisibility} us={r.us} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
