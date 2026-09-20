/**
 * The feature matrix — the section people actually came for.
 *
 * One DOM, two shapes. The obvious build is a table for desktop plus a set of
 * cards for mobile, but that ships the entire matrix twice and this is a page
 * whose job is to be quoted: duplicating half the body text is the one thing
 * it cannot afford. So each row is a single grid that collapses from three
 * columns to one, and the only markup that repeats is the two product labels
 * per row (hidden on desktop, where the sticky header carries them instead).
 *
 * The Rankbox column is a continuous tinted band rather than per-cell
 * highlighting, so the eye tracks one column down the page instead of
 * re-reading a checkerboard. The header sticks under the navbar
 * (--top-chrome) so you never lose which column is which mid-scroll.
 */
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { CellBadge, CellBody, CompetitorMark, RankboxMark } from "./kit";
import { cn } from "@/lib/utils";
import { formatCheckedOn } from "@/data/alternatives";
import type { Competitor, MatrixGroup, MatrixRow as Row } from "@/data/alternatives";

const LEGEND = [
  { state: "yes" as const, label: "Included" },
  { state: "partial" as const, label: "Partly, or via an add-on" },
  { state: "no" as const, label: "Not what it's built for" },
];

function Legend() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {LEGEND.map((i) => (
        <span key={i.label} className="flex items-center gap-2 text-xs text-muted-foreground">
          {/* The visible label already says this, so the badge's own
              screen-reader text would just repeat it. */}
          <span aria-hidden>
            <CellBadge state={i.state} />
          </span>
          {i.label}
        </span>
      ))}
    </div>
  );
}

/* ---------- sticky column header (desktop only) ---------- */

function StickyHeader({ competitor }: { competitor: Competitor }) {
  return (
    <div className="sticky top-[var(--top-chrome)] z-20 hidden lg:block">
      <div className="grid grid-cols-[1.25fr_1fr_1fr] overflow-hidden rounded-t-2xl border border-border bg-card/85 backdrop-blur-md">
        <div className="flex items-center px-6 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Capability
          </span>
        </div>
        <div className="flex items-center gap-2.5 border-l border-border bg-brand-blue/[0.06] px-5 py-4">
          <RankboxMark className="h-8 w-8" />
          <span className="text-sm font-semibold text-ink">Rankbox</span>
        </div>
        <div className="flex items-center gap-2.5 border-l border-border px-5 py-4">
          <CompetitorMark competitor={competitor} className="h-8 w-8" />
          <span className="text-sm font-semibold text-ink">{competitor.name}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- one row ---------- */

/* The per-cell product label. Carries the column meaning on a phone, where
   the sticky header is not rendered. */
function CellLabel({ children, mark }: { children: string; mark: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2 lg:hidden">
      {mark}
      <span className="text-xs font-semibold text-ink">{children}</span>
    </div>
  );
}

function MatrixRow({
  row,
  competitor,
  first,
}: {
  row: Row;
  competitor: Competitor;
  first: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 bg-card lg:grid-cols-[1.25fr_1fr_1fr] lg:transition-colors lg:hover:bg-surface/40",
        // Phone: each row is a discrete card. Desktop: a hairline-separated
        // table row inside the bordered block.
        "mb-3 overflow-hidden rounded-2xl border border-border",
        "lg:mb-0 lg:rounded-none lg:border-x-0 lg:border-b-0",
        first ? "lg:border-t-0" : "lg:border-t",
      )}
    >
      <div className="px-5 pb-1 pt-5 lg:px-6 lg:py-5">
        <p className="text-sm font-semibold text-ink">{row.label}</p>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">{row.detail}</p>
      </div>

      <div className="px-5 py-4 lg:border-l lg:border-border lg:bg-brand-blue/[0.06] lg:px-5 lg:py-5">
        <div className="rounded-xl bg-brand-blue/[0.06] p-3.5 lg:bg-transparent lg:p-0">
          <CellLabel mark={<RankboxMark className="h-6 w-6" />}>Rankbox</CellLabel>
          <CellBody cell={row.rankbox} />
        </div>
      </div>

      <div className="px-5 pb-5 pt-0 lg:border-l lg:border-border lg:px-5 lg:py-5">
        <div className="rounded-xl border border-border p-3.5 lg:rounded-none lg:border-0 lg:p-0">
          <CellLabel mark={<CompetitorMark competitor={competitor} className="h-6 w-6" />}>
            {competitor.name}
          </CellLabel>
          <CellBody cell={row.them} />
        </div>
      </div>
    </div>
  );
}

/* ---------- one group ---------- */

function Group({
  group,
  competitor,
  last,
}: {
  group: MatrixGroup;
  competitor: Competitor;
  last: boolean;
}) {
  const Icon = group.icon;
  return (
    <div className={cn("lg:border-x lg:border-border", last && "lg:rounded-b-2xl lg:border-b")}>
      {/* Spans all three columns, so the matrix reads as chapters. */}
      <div className="mb-3 flex items-center gap-2.5 pt-6 lg:mb-0 lg:border-y lg:border-border lg:bg-surface/70 lg:px-6 lg:py-3 lg:pt-3">
        <Icon className="h-4 w-4 text-volt" aria-hidden />
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
          {group.group}
        </h3>
      </div>
      {group.rows.map((row, i) => (
        <MatrixRow key={row.label} row={row} competitor={competitor} first={i === 0} />
      ))}
    </div>
  );
}

/* ---------- section ---------- */

export function ComparisonMatrix({ competitor }: { competitor: Competitor }) {
  const rowCount = competitor.matrix.reduce((n, g) => n + g.rows.length, 0);
  return (
    <section
      id="compare"
      aria-labelledby="compare-title"
      className="scroll-mt-[var(--top-chrome)] border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Side by side</Eyebrow>
          <h2
            id="compare-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Rankbox vs {competitor.name}, in {rowCount} rows
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Every row is something a growth programme needs. Where {competitor.name} isn&rsquo;t
            built for one, we say what it <em>is</em> built for instead.
          </p>
          <Legend />
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <StickyHeader competitor={competitor} />
          {competitor.matrix.map((g, i) => (
            <Group
              key={g.group}
              group={g}
              competitor={competitor}
              last={i === competitor.matrix.length - 1}
            />
          ))}
        </Reveal>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          Compiled from {competitor.name}&rsquo;s public documentation and pricing pages, last
          reviewed {formatCheckedOn(competitor.pricing.checkedOn)}. Products change — check theirs
          before you decide, and tell us if we have a row wrong.
        </p>
      </div>
    </section>
  );
}
