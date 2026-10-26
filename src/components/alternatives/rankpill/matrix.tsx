/**
 * Row for row. RankPill is the one competitor that sets out to do the same
 * job, so the useful question about each row isn't "who has it" but "does it
 * differ". The section opens with the two short lists of where each product
 * differs, then the evidence: every matrix row, each tagged Same or Differs,
 * with a tally strip on top and a switch that folds the matching rows away.
 *
 * "Same" is worked out from the data (both cells "yes"), never written, so a
 * row moves between the two on its own when either side changes.
 *
 * One table, two shapes: a three-column hairline table from `sm` up, and on a
 * phone each row stacks its label over the two cells. Explicit row and cell
 * roles keep the table semantics when the rows change display.
 */
import { useState } from "react";
import { Check, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { formatCheckedOn, type Competitor } from "@/data/alternatives";
import { StateMark } from "./parts";
import { RANKBOX_TINT, STATE_LEGEND, allRows, rowMatches } from "./lib";

/* "Same job. Half the monthly price. Different plumbing." → the last
   sentence carries the accent. */
function splitLastSentence(title: string): [string, string] {
  const at = title.lastIndexOf(". ", title.length - 2);
  if (at === -1) return ["", title];
  return [title.slice(0, at + 2), title.slice(at + 2)];
}

export function RowForRow({ competitor: c }: { competitor: Competitor }) {
  const p = c.positioning;
  const [lead, tail] = splitLastSentence(p.title);
  const rows = allRows(c);
  const matching = rows.filter(rowMatches).length;
  const differing = rows.length - matching;
  const [onlyDiff, setOnlyDiff] = useState(false);

  return (
    <section id="rows" aria-labelledby="rows-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <SectionHead
        icon={Rows3}
        eyebrow="Row for row"
        title={
          <span id="rows-title">
            {lead}
            <Accent>{tail}</Accent>
          </span>
        }
        subtitle={p.body}
      />

      {/* Where each one differs, in a sentence a line. */}
      <Band>
        <CellGrid className="md:grid-cols-2">
          <li className={cn(CELL, RANKBOX_TINT, "p-6 sm:p-8 lg:p-10")}>
            <Reveal>
              <div className="flex items-center gap-3">
                <RankboxMark className="h-9 w-9" />
                <div>
                  <h3 className="text-[1rem] font-semibold tracking-tight text-ink">
                    {p.rankboxTitle}
                  </h3>
                  {p.rankboxTag && (
                    <p className="text-[0.8rem] text-muted-foreground">{p.rankboxTag}</p>
                  )}
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {p.rankbox.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.92rem] leading-snug text-ink">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
          <li className={cn(CELL, "p-6 sm:p-8 lg:p-10")}>
            <Reveal delay={0.06}>
              <div className="flex items-center gap-3">
                <CompetitorMark competitor={c} className="h-9 w-9" />
                <div>
                  <h3 className="text-[1rem] font-semibold tracking-tight text-ink">
                    {p.themTitle}
                  </h3>
                  <p className="text-[0.8rem] text-muted-foreground">{c.category}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {p.them.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.92rem] leading-snug text-ink/80">
                    <span
                      aria-hidden
                      className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        </CellGrid>
      </Band>

      {/* The tally, and the switch that folds the matching rows away. */}
      <Band inner="flex flex-col gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div className="min-w-0">
          <p className="text-[0.95rem] text-ink">
            <span className="font-semibold tabular-nums">
              {matching} of {rows.length}
            </span>{" "}
            rows are included on both;{" "}
            <span className="font-semibold tabular-nums">{differing}</span> differ.
          </p>
          <div aria-hidden className="mt-3 flex flex-wrap gap-1">
            {rows.map((r) => (
              <span
                key={r.label}
                title={r.label}
                className={cn(
                  "h-2.5 w-5 rounded-[3px]",
                  rowMatches(r) ? "bg-ink/[0.12]" : "bg-cta",
                )}
              />
            ))}
          </div>
        </div>
        <div
          role="group"
          aria-label="Rows shown"
          className="grid shrink-0 grid-cols-2 gap-1 rounded-lg border border-ink/[0.08] bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          {[
            { on: false, label: `All ${rows.length} rows` },
            { on: true, label: `The ${differing} that differ` },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={onlyDiff === o.on}
              onClick={() => setOnlyDiff(o.on)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[0.8rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                onlyDiff === o.on ? "bg-cta-soft text-cta" : "text-muted-foreground hover:text-ink",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Band>

      <Band>
        <table role="table" className="w-full border-collapse text-left max-sm:block">
          <caption className="sr-only">
            Rankbox compared with {c.name}, row by row, each marked same or different
          </caption>
          <thead role="rowgroup" className="hidden sm:table-header-group">
            <tr role="row">
              <th scope="col" role="columnheader" className="w-[34%] px-6 py-4 lg:px-10">
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Capability
                </span>
              </th>
              <th
                scope="col"
                role="columnheader"
                className={cn("border-l px-5 py-4", LINE, RANKBOX_TINT)}
              >
                <span className="flex items-center gap-2 text-[0.9rem] font-medium text-cta">
                  <RankboxMark className="h-6 w-6" />
                  Rankbox
                </span>
              </th>
              <th scope="col" role="columnheader" className={cn("border-l px-5 py-4", LINE)}>
                <span className="flex items-center gap-2 text-[0.9rem] font-medium text-ink">
                  <CompetitorMark competitor={c} className="h-6 w-6 text-[0.5rem]" />
                  {c.name}
                </span>
              </th>
            </tr>
          </thead>
          {c.matrix.map((g) => {
            const Icon = g.icon;
            const groupDiffers = g.rows.some((r) => !rowMatches(r));
            const folded = onlyDiff && !groupDiffers;
            return (
              <tbody
                key={g.group}
                role="rowgroup"
                className={cn(folded ? "hidden" : "max-sm:block")}
              >
                <tr role="row" className={cn("border-t max-sm:block", LINE)}>
                  <th
                    scope="rowgroup"
                    role="rowheader"
                    colSpan={3}
                    className="max-sm:block bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-5 py-2.5 sm:px-6 lg:px-10"
                  >
                    <span className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/70">
                      <Icon className="h-3.5 w-3.5 text-brand-blue" aria-hidden />
                      {g.group}
                    </span>
                  </th>
                </tr>
                {g.rows.map((r) => {
                  const match = rowMatches(r);
                  return (
                    <tr
                      key={r.label}
                      role="row"
                      className={cn(
                        "border-t",
                        LINE,
                        onlyDiff && match ? "hidden" : "grid grid-cols-2 sm:table-row",
                      )}
                    >
                      <th
                        scope="row"
                        role="rowheader"
                        className="relative col-span-2 px-5 pb-3 pt-5 align-top font-normal sm:px-6 sm:py-5 lg:px-10"
                      >
                        {!match && (
                          <span
                            aria-hidden
                            className="absolute inset-y-0 left-0 w-[3px] bg-cta sm:inset-y-3"
                          />
                        )}
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-[0.92rem] font-semibold text-ink">{r.label}</span>
                          <span
                            className={cn(
                              "rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
                              match ? "bg-ink/[0.05] text-ink/55" : "bg-cta-soft text-cta",
                            )}
                          >
                            {match ? "Same" : "Differs"}
                          </span>
                        </span>
                        <span className="mt-1 block text-[0.8rem] leading-snug text-muted-foreground">
                          {r.detail}
                        </span>
                      </th>
                      <td
                        role="cell"
                        className={cn(
                          "px-5 py-4 align-top sm:border-l sm:py-5",
                          LINE,
                          RANKBOX_TINT,
                        )}
                      >
                        <span className="mb-1.5 block text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-cta sm:hidden">
                          Rankbox
                        </span>
                        <span className="flex gap-2.5">
                          <StateMark state={r.rankbox.state} rankbox />
                          <span className="text-[0.84rem] leading-snug text-ink">
                            {r.rankbox.note}
                          </span>
                        </span>
                      </td>
                      <td role="cell" className={cn("border-l px-5 py-4 align-top sm:py-5", LINE)}>
                        <span className="mb-1.5 block text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink/60 sm:hidden">
                          {c.name}
                        </span>
                        <span className="flex gap-2.5">
                          <StateMark state={r.them.state} />
                          <span
                            className={cn(
                              "text-[0.84rem] leading-snug",
                              r.them.state === "no" ? "text-muted-foreground" : "text-ink/80",
                            )}
                          >
                            {r.them.note}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>
      </Band>

      <Band inner="flex flex-col gap-3 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {STATE_LEGEND.map((l) => (
            <li
              key={l.state}
              className="flex items-center gap-2 text-[0.75rem] text-muted-foreground"
            >
              <span aria-hidden>
                <StateMark state={l.state} />
              </span>
              {l.label}
            </li>
          ))}
        </ul>
        <p className="text-[0.75rem] leading-relaxed text-muted-foreground">
          From {c.name}&rsquo;s public pages, last reviewed {formatCheckedOn(c.pricing.checkedOn)}.
        </p>
      </Band>
    </section>
  );
}
