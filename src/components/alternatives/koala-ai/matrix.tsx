/**
 * Every row of the comparison as one hairline table, chaptered by the data's
 * groups. Rankbox's column carries the soft blue key from top to bottom; the
 * header sticks under the navbar on wide screens so the columns never lose
 * their names mid-scroll.
 *
 * One DOM for every width: on a phone the same table is laid out as stacked
 * rows (label across the top, the two cells side by side under it), with a
 * small product label in each cell standing in for the header.
 */
import { Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent, Band, LINE, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { formatCheckedOn, type Cell, type Competitor } from "@/data/alternatives";
import { StateGlyph } from "./parts";
import { RANKBOX_TINT, STATE_LABEL } from "./tokens";

function CellNote({
  cell,
  tone,
  product,
}: {
  cell: Cell;
  tone: "rankbox" | "them";
  product: string;
}) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.1em] md:hidden",
          tone === "rankbox" ? "text-cta" : "text-muted-foreground",
        )}
      >
        {product}
      </span>
      <span className="flex items-start gap-2.5">
        <StateGlyph state={cell.state} tone={tone} className="mt-px" />
        <span
          className={cn(
            "text-[0.83rem] leading-snug",
            cell.state === "no" ? "text-muted-foreground" : "text-ink/85",
          )}
        >
          {cell.note}
        </span>
      </span>
    </>
  );
}

export function Matrix({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const rows = c.matrix.reduce((n, g) => n + g.rows.length, 0);
  const head = "md:sticky md:top-[var(--top-chrome)] md:z-10";

  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <SectionHead
        icon={Rows3}
        eyebrow="Side by side"
        title={
          <span id="compare-title">
            Rankbox vs {c.name}, <Accent>in {rows} rows</Accent>
          </span>
        }
        subtitle={`${c.name}'s side comes from its own pages, checked ${formatCheckedOn(c.pricing.checkedOn)}. Rankbox's side is what ships today.`}
      >
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {(["yes", "partial", "no"] as const).map((s) => (
            <li key={s} className="flex items-center gap-2 text-[0.78rem] text-muted-foreground">
              <span aria-hidden>
                <StateGlyph state={s} tone="rankbox" />
              </span>
              {STATE_LABEL[s]}
            </li>
          ))}
        </ul>
      </SectionHead>

      <Band>
        <Reveal>
          <table className="w-full border-collapse text-left max-md:block">
            <caption className="sr-only">Rankbox and {c.name}, capability by capability</caption>
            <thead className="max-md:hidden">
              <tr>
                <th scope="col" className={cn("w-[34%] bg-white px-8 py-4 lg:px-10", head)}>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Capability
                  </span>
                </th>
                <th
                  scope="col"
                  className={cn(
                    "border-l bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-6 py-4",
                    LINE,
                    head,
                  )}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-cta">
                    <RankboxMark className="h-7 w-7" />
                    Rankbox
                  </span>
                </th>
                <th scope="col" className={cn("border-l bg-white px-6 py-4", LINE, head)}>
                  <span className="flex items-center gap-2.5 text-sm font-medium text-ink">
                    <CompetitorMark competitor={c} className="h-7 w-7" />
                    {c.name}
                  </span>
                </th>
              </tr>
            </thead>
            {c.matrix.map((g) => {
              const Icon = g.icon;
              return (
                <tbody key={g.group} className="max-md:block">
                  <tr className={cn("border-t max-md:block", LINE)}>
                    <th
                      scope="rowgroup"
                      colSpan={3}
                      className="bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-5 py-2.5 max-md:block sm:px-8 lg:px-10"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
                          <Icon className="h-3 w-3" aria-hidden />
                        </span>
                        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink">
                          {g.group}
                        </span>
                      </span>
                    </th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr
                      key={r.label}
                      className={cn(
                        "border-t transition-colors max-md:grid max-md:grid-cols-2 md:hover:bg-[color-mix(in_oklab,var(--surface)_25%,white)]",
                        LINE,
                      )}
                    >
                      <th
                        scope="row"
                        className="px-5 pb-1 pt-5 align-top font-normal max-md:col-span-2 sm:px-8 md:py-5 lg:px-10"
                      >
                        <span className="block text-[0.92rem] font-semibold text-ink">
                          {r.label}
                        </span>
                        <span className="mt-1 block text-[0.8rem] leading-snug text-muted-foreground">
                          {r.detail}
                        </span>
                      </th>
                      <td
                        className={cn(
                          "px-5 py-4 align-top sm:px-8 md:border-l md:px-6 md:py-5",
                          LINE,
                          RANKBOX_TINT,
                        )}
                      >
                        <CellNote cell={r.rankbox} tone="rankbox" product="Rankbox" />
                      </td>
                      <td
                        className={cn("border-l px-5 py-4 align-top sm:px-8 md:px-6 md:py-5", LINE)}
                      >
                        <CellNote cell={r.them} tone="them" product={c.name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              );
            })}
          </table>
        </Reveal>
      </Band>
    </section>
  );
}
