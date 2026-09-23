/**
 * /changelog: a dated ship log.
 *
 *   hero       what this page is, when we last shipped, and every release in
 *              the log as one index, so the pace reads before any scrolling
 *   filters    a sticky bar of kinds; the choice lives in the URL
 *   timeline   day by day, newest first: the date on a sticky rail, each
 *              release in full beside it
 *
 * The unfiltered log is the canonical page, and every release on it is
 * server-rendered in full, so crawlers and readers without JavaScript get the
 * whole log. A filter only narrows it.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Rss } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { PixelField } from "@/components/landing/Hero";
import { cn } from "@/lib/utils";
import { formatDate, formatShortDate } from "@/lib/format-date";
import {
  CHANGELOG,
  CHANGELOG_FEED_PATH as RSS_PATH,
  CHANGELOG_UPDATED,
  KINDS,
  STATUSES,
  groupByDate,
  type ChangeKind,
  type ChangeStatus,
  type ChangelogEntry,
} from "@/data/changelog";
import {
  CopyLink,
  EntryBody,
  EntryLabels,
  EntryLinks,
  StatusDot,
  StatusNote,
  weekday,
} from "./kit";
import { EntryVisual } from "./visuals";

/** How many releases the hero's index lists before pointing at the rest. */
const INDEX_LIMIT = 8;

/* ---------- Hero ---------- */

export function ChangelogHero() {
  const days = groupByDate(CHANGELOG).length;
  return (
    <section
      aria-labelledby="changelog-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField seed={3} />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-12 sm:pb-20 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <div className="min-w-0">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-1.5 text-xs font-medium text-white/65">
                  <li>
                    <Link to="/" className="transition-colors hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li aria-current="page" className="text-white">
                    Changelog
                  </li>
                </ol>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 motion-reduce:hidden" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Last shipped {formatDate(CHANGELOG_UPDATED)}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                id="changelog-title"
                className="font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-[4rem] xl:text-[4.5rem]"
              >
                Changelog
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80">
                Everything we ship to Rankbox, dated, as it ships. Each release says whether you can
                use it today, and if not, what it&rsquo;s waiting on.
              </p>
            </Reveal>
            <Reveal delay={0.22} className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={RSS_PATH}
                className="group inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-brand-blue shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
              >
                <Rss className="h-4 w-4" />
                Subscribe via RSS
              </a>
              <a
                href="/auth"
                className="group inline-flex h-11 items-center gap-1.5 rounded-xl border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Try Rankbox
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.28} y={24} className="min-w-0">
            <ShipLog days={days} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Every recent release as one list, grouped by day: the pace, at a glance. */
function ShipLog({ days }: { days: number }) {
  const shown = CHANGELOG.slice(0, INDEX_LIMIT);
  const rest = CHANGELOG.length - shown.length;
  return (
    <div className="rounded-2xl bg-white/[0.08] p-2 ring-1 ring-inset ring-white/20 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-2.5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/70">
          Ship log
        </p>
        <p className="text-xs font-medium text-white/70">
          {CHANGELOG.length} releases · {days} days
        </p>
      </div>
      <ol className="rounded-xl bg-white/[0.06] p-1.5 ring-1 ring-inset ring-white/10">
        {groupByDate(shown).map((g) => (
          <li
            key={g.date}
            className="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-2 border-b border-white/10 py-1 last:border-0"
          >
            <time
              dateTime={g.date}
              className="px-1.5 pt-2 font-mono text-[0.7rem] font-medium uppercase tracking-wide text-white/60"
            >
              {formatShortDate(g.date)}
            </time>
            <ul>
              {g.entries.map((e) => (
                <li key={e.slug}>
                  <a
                    href={`#${e.slug}`}
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                    <StatusDot status={e.status} className="h-2 w-2 ring-2 ring-white/20" />
                    <span className="min-w-0 truncate font-medium">{e.title}</span>
                    <ArrowRight
                      aria-hidden
                      className="ml-auto h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-3 pb-1.5 pt-2.5">
        <StatusLegend />
        {rest > 0 && (
          <a href="#timeline" className="text-xs font-semibold text-white/85 hover:text-white">
            +{rest} earlier
          </a>
        )}
      </div>
    </div>
  );
}

function StatusLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
      {(Object.keys(STATUSES) as ChangeStatus[]).map((s) => (
        <li key={s} className="flex items-center gap-1.5 text-[0.7rem] font-medium text-white/75">
          <StatusDot status={s} className="h-2 w-2 ring-2 ring-white/20" />
          {STATUSES[s].label}
        </li>
      ))}
    </ul>
  );
}

/* ---------- Filters ---------- */

export function FilterBar({
  kind,
  onKind,
}: {
  kind?: ChangeKind;
  onKind: (k: ChangeKind | undefined) => void;
}) {
  const chips: { id?: ChangeKind; label: string; count: number }[] = [
    { label: "All", count: CHANGELOG.length },
    ...KINDS.map((k) => ({
      id: k.id,
      label: k.plural,
      count: CHANGELOG.filter((e) => e.kind === k.id).length,
    })).filter((c) => c.count > 0),
  ];
  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
        <div
          role="group"
          aria-label="Filter releases"
          className="-mx-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {chips.map((c) => {
            const on = c.id === kind;
            return (
              <button
                key={c.label}
                type="button"
                aria-pressed={on}
                onClick={() => onKind(c.id)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                  on
                    ? "border-cta bg-cta text-white"
                    : "border-border bg-card text-ink hover:bg-secondary",
                )}
              >
                {c.label}
                <span
                  className={cn(
                    "tabular-nums text-xs",
                    on ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
        <a
          href={RSS_PATH}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
        >
          <Rss className="h-4 w-4" />
          <span className="hidden sm:inline">RSS</span>
        </a>
      </div>
    </div>
  );
}

/* ---------- Timeline ---------- */

export function Timeline({ kind }: { kind?: ChangeKind }) {
  const entries = kind ? CHANGELOG.filter((e) => e.kind === kind) : CHANGELOG;
  return (
    <section id="timeline" aria-label="Releases" className="scroll-mt-32">
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-14 sm:pt-20">
        {groupByDate(entries).map((g, gi) => (
          <div
            key={g.date}
            className={cn(
              "grid gap-x-12 lg:grid-cols-[11rem_minmax(0,1fr)]",
              gi > 0 && "mt-16 lg:mt-0",
            )}
          >
            <div className="relative lg:pb-20">
              <div className="flex items-baseline gap-3 border-b border-border pb-3 lg:sticky lg:top-36 lg:block lg:border-0 lg:pb-0">
                <time dateTime={g.date} className="text-sm font-semibold text-ink">
                  {formatDate(g.date)}
                </time>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground lg:mt-1">
                  {weekday(g.date)}
                </p>
              </div>
            </div>
            <div className="relative min-w-0 lg:border-l lg:border-border lg:pb-20 lg:pl-12">
              {g.entries.map((e, i) => (
                <TimelineEntry key={e.slug} entry={e} first={i === 0} />
              ))}
            </div>
          </div>
        ))}
        <EndOfLog />
      </div>
    </section>
  );
}

function TimelineEntry({ entry, first }: { entry: ChangelogEntry; first: boolean }) {
  return (
    <article
      id={entry.slug}
      aria-labelledby={`${entry.slug}-title`}
      className={cn(
        "relative scroll-mt-36",
        first ? "pt-8 lg:pt-0" : "mt-14 border-t border-border pt-14",
      )}
    >
      {/* This release's marker, centred on the rail's 1px line: the line sits
          49px (border + pl-12) left of the article, the marker is 10px wide.
          It lines up with the labels row, below any top padding. */}
      <span
        aria-hidden
        className={cn(
          "absolute -left-[53.5px] hidden h-2.5 w-2.5 rounded-full bg-cta ring-4 ring-background lg:block",
          first ? "top-[7px]" : "top-[63px]",
        )}
      />
      <Reveal y={14}>
        <EntryLabels entry={entry} />
        <h2
          id={`${entry.slug}-title`}
          className="mt-4 text-balance font-display text-[1.7rem] font-bold leading-[1.12] tracking-tight text-ink sm:text-[2.1rem]"
        >
          <Link
            to="/changelog/$slug"
            params={{ slug: entry.slug }}
            className="transition-colors hover:text-cta"
          >
            {entry.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-2xl text-[1.075rem] leading-relaxed text-muted-foreground">
          {entry.summary}
        </p>
        <StatusNote entry={entry} className="mt-5 max-w-2xl" />
      </Reveal>

      {entry.visual && (
        <Reveal y={20} delay={0.05} className="mt-8">
          <EntryVisual visual={entry.visual} />
        </Reveal>
      )}

      <div className="mt-8 max-w-3xl">
        <EntryBody entry={entry} />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <EntryLinks entry={entry} />
          <CopyLink slug={entry.slug} className="-mr-2.5 ml-auto" />
        </div>
      </div>
    </article>
  );
}

/** Where the log starts, said plainly rather than implied by running out. */
function EndOfLog() {
  const first = CHANGELOG.at(-1);
  return (
    <div className="grid gap-x-12 pb-16 lg:grid-cols-[11rem_minmax(0,1fr)]">
      <div />
      {/* The rail ends here, in a hollow marker: nothing before this date. */}
      <div className="relative mt-16 rounded-2xl border border-dashed border-border px-6 py-7 text-center lg:mt-0 lg:ml-12 lg:text-left">
        <span
          aria-hidden
          className="absolute -left-[53.5px] -top-[5px] hidden h-2.5 w-2.5 rounded-full border-2 border-border bg-background lg:block"
        />
        <p className="text-sm font-semibold text-ink">
          The log starts {first ? formatDate(first.date) : ""}.
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Earlier releases shipped under the Rankvolt name. New ones land here first, and in the{" "}
          <a href={RSS_PATH} className="font-medium text-cta hover:underline">
            RSS feed
          </a>
          .
        </p>
      </div>
    </div>
  );
}
