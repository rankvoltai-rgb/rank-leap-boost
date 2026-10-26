/**
 * The hub's centre: every engine against the same seven questions. The cells
 * come from each guide's `profile` (shipped by the route's loader), the row
 * labels from PROFILE_ROWS, so nothing here is hand-copied from a guide.
 *
 * lg and up: one table with a pinned label column. A switch shows the
 * frontier five, the other six, or all eleven; columns that are switched off
 * stay in the server HTML, hidden, so every value is always on the page.
 * Hovering a column tints it, which is how you read one engine top to bottom.
 *
 * Below lg: an engine picker and one engine's card, label above value.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EngineMark, EngineTile } from "@/components/ai-seo/kit";
import { LINE } from "@/components/landing/frame";
import {
  ENGINES,
  TIERS,
  type Engine,
  type EngineSlug,
  type EngineTier,
} from "@/data/ai-seo/engines";
import { PROFILE_ROWS } from "@/data/ai-seo/overview";
import type { EngineProfile } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import type { ProfileRow } from "./shared";

type View = EngineTier | "all";

const VIEWS: { id: View; label: string; count: number }[] = [
  {
    id: "frontier",
    label: TIERS.frontier.label,
    count: ENGINES.filter((e) => e.tier === "frontier").length,
  },
  { id: "more", label: TIERS.more.label, count: ENGINES.filter((e) => e.tier === "more").length },
  { id: "all", label: "All engines", count: ENGINES.length },
];

const shown = (e: Engine, view: View) => view === "all" || e.tier === view;

function useProfiles(profiles: ProfileRow[]) {
  const bySlug = new Map(profiles.map((p) => [p.slug, p.profile]));
  return (slug: EngineSlug): EngineProfile | undefined => bySlug.get(slug);
}

/* ---------- the table (md and up) ---------- */

function MatrixTable({ profiles }: { profiles: ProfileRow[] }) {
  const [view, setView] = useState<View>("frontier");
  const [col, setCol] = useState<EngineSlug | null>(null);
  const profileOf = useProfiles(profiles);
  const wide = view === "all";

  return (
    <div className="hidden lg:block">
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4 sm:px-10 lg:px-12",
          LINE,
        )}
      >
        <div
          role="group"
          aria-label="Engines to compare"
          className="inline-flex rounded-lg border border-ink/[0.08] bg-ink/[0.02] p-0.5"
        >
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[0.82rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                view === v.id
                  ? "bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                  : "text-ink/65 hover:text-ink",
              )}
            >
              {v.label}
              <span
                className={cn(
                  "font-mono text-[0.7rem]",
                  view === v.id ? "text-cta/70" : "text-muted-foreground",
                )}
              >
                {v.count}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[0.8rem] text-muted-foreground">
          {wide ? "Scroll sideways inside the table" : "Hover a column to read one engine"}
        </p>
      </div>

      <div className={cn(wide && "overflow-x-auto")}>
        <table
          className={cn("w-full table-fixed border-collapse text-left", wide && "min-w-[118rem]")}
          onMouseLeave={() => setCol(null)}
        >
          <caption className="sr-only">
            The answer engines compared on {PROFILE_ROWS.length} attributes
          </caption>
          <colgroup>
            <col className={wide ? "w-[12rem]" : "w-[13.5rem]"} />
          </colgroup>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-white px-6 py-4 align-bottom text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:pl-10 lg:pl-12"
              >
                Engine
              </th>
              {ENGINES.map((e) => (
                <th
                  key={e.slug}
                  scope="col"
                  onMouseEnter={() => setCol(e.slug)}
                  className={cn(
                    "border-l px-4 py-4 align-bottom transition-colors",
                    LINE,
                    !shown(e, view) && "hidden",
                    col === e.slug && "bg-[color-mix(in_oklab,var(--cta-soft)_70%,white)]",
                  )}
                >
                  <Link
                    to="/ai-seo/$engine"
                    params={{ engine: e.slug }}
                    className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                      <EngineMark mark={e.mark} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.9rem] font-semibold text-ink transition-colors group-hover:text-cta">
                        {e.shortName}
                      </span>
                      <span className="block truncate text-[0.72rem] font-normal text-muted-foreground">
                        {e.vendor}
                      </span>
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROFILE_ROWS.map((row) => (
              <tr key={row.key} className={cn("border-t", LINE)}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white px-6 py-4 align-top shadow-[1px_0_0_color-mix(in_oklab,var(--ink)_7%,transparent)] sm:pl-10 lg:pl-12"
                >
                  <span className="block text-[0.86rem] font-semibold leading-snug text-ink">
                    {row.label}
                  </span>
                  <span className="mt-1 block text-[0.74rem] font-normal leading-snug text-muted-foreground">
                    {row.why}
                  </span>
                </th>
                {ENGINES.map((e) => (
                  <td
                    key={e.slug}
                    onMouseEnter={() => setCol(e.slug)}
                    className={cn(
                      "border-l px-4 py-4 align-top transition-colors",
                      LINE,
                      !shown(e, view) && "hidden",
                      col === e.slug && "bg-[color-mix(in_oklab,var(--cta-soft)_70%,white)]",
                      row.mono
                        ? "break-words font-mono text-[0.76rem] font-medium leading-relaxed text-ink"
                        : "text-[0.84rem] leading-relaxed text-ink/75",
                    )}
                  >
                    {profileOf(e.slug)?.[row.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={cn("border-t", LINE)}>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white px-6 py-4 text-left text-[0.86rem] font-semibold text-ink sm:pl-10 lg:pl-12"
              >
                Full guide
              </th>
              {ENGINES.map((e) => (
                <td
                  key={e.slug}
                  onMouseEnter={() => setCol(e.slug)}
                  className={cn(
                    "border-l px-4 py-4 transition-colors",
                    LINE,
                    !shown(e, view) && "hidden",
                    col === e.slug && "bg-[color-mix(in_oklab,var(--cta-soft)_70%,white)]",
                  )}
                >
                  <Link
                    to="/ai-seo/$engine"
                    params={{ engine: e.slug }}
                    className="group inline-flex items-center gap-1 text-[0.82rem] font-semibold text-cta hover:text-cta-hover"
                  >
                    <span className="sr-only">{e.name} </span>
                    Read it
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/* ---------- the picker (below md) ---------- */

function PickerButton({
  engine,
  selected,
  onPick,
}: {
  engine: Engine;
  selected: boolean;
  onPick: (slug: EngineSlug) => void;
}) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        aria-label={engine.name}
        title={engine.name}
        onClick={() => onPick(engine.slug)}
        className={cn(
          "flex aspect-square w-full items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
          selected
            ? "border-cta/40 bg-cta-soft shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_12%,transparent)]"
            : "border-ink/[0.08] bg-white",
        )}
      >
        <EngineMark mark={engine.mark} className="h-5 w-5" />
      </button>
    </li>
  );
}

function MatrixPicker({ profiles }: { profiles: ProfileRow[] }) {
  const [slug, setSlug] = useState<EngineSlug>(ENGINES[0].slug);
  const profileOf = useProfiles(profiles);
  const engine = ENGINES.find((e) => e.slug === slug)!;
  const profile = profileOf(slug);

  return (
    <div className="px-5 py-6 sm:px-8 lg:hidden">
      {(["frontier", "more"] as const).map((tier) => (
        <div key={tier} className="mb-4">
          <p className="mb-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {TIERS[tier].label}
          </p>
          <ul className="grid max-w-md grid-cols-6 gap-1.5">
            {ENGINES.filter((e) => e.tier === tier).map((e) => (
              <PickerButton key={e.slug} engine={e} selected={e.slug === slug} onPick={setSlug} />
            ))}
          </ul>
        </div>
      ))}

      <article
        aria-live="polite"
        className={cn("mt-5 overflow-hidden rounded-xl border bg-white", LINE)}
      >
        <header className={cn("flex items-center gap-3 border-b px-4 py-4", LINE)}>
          <EngineTile engine={engine} className="h-10 w-10 rounded-lg" />
          <div className="min-w-0">
            <h3 className="truncate text-[1rem] font-semibold text-ink">{engine.name}</h3>
            <p className="text-[0.76rem] text-muted-foreground">
              {engine.vendor} · {TIERS[engine.tier].short}
            </p>
          </div>
        </header>
        <dl>
          {PROFILE_ROWS.map((row, i) => (
            <div key={row.key} className={cn("px-4 py-3.5", i > 0 && "border-t", LINE)}>
              <dt className="text-[0.72rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {row.label}
              </dt>
              <dd
                className={cn(
                  "mt-1",
                  row.mono
                    ? "break-words font-mono text-[0.8rem] font-medium text-ink"
                    : "text-[0.9rem] leading-relaxed text-ink/80",
                )}
              >
                {profile?.[row.key] ?? "—"}
              </dd>
            </div>
          ))}
        </dl>
        <Link
          to="/ai-seo/$engine"
          params={{ engine: engine.slug }}
          className={cn(
            "group flex items-center justify-between border-t px-4 py-3.5 text-[0.88rem] font-semibold text-cta",
            LINE,
          )}
        >
          Read the {engine.shortName} guide
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </article>
    </div>
  );
}

export function EngineMatrix({ profiles }: { profiles: ProfileRow[] }) {
  return (
    <>
      <MatrixTable profiles={profiles} />
      <MatrixPicker profiles={profiles} />
    </>
  );
}
