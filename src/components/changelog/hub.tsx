/**
 * /changelog: a dated ship log, in the landing's frame.
 *
 *   hero       what this page is, and a ship calendar drawn from the log's
 *              own dates (a cell per day, blue where something shipped) over
 *              the latest releases, so the pace reads before any scrolling
 *   stats      four numbers from the log: releases, ship days, live, last
 *   filters    a sticky hairline bar of kinds; the choice lives in the URL
 *   timeline   one band per day, newest first: the date on a sticky rail,
 *              each release in full beside it
 *
 * The unfiltered log is the canonical page, and every release on it is
 * server-rendered in full, so crawlers and readers without JavaScript get the
 * whole log. A filter only narrows it.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, History, Rss } from "lucide-react";
import { Accent, Band, CELL, CellGrid, GHOST_BUTTON, LINE, Pill } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { TRIAL_CTA, TRIAL_NOTE } from "@/data/pricing";
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
  EntryLabels,
  EntryLinks,
  EntryPoints,
  EntryProse,
  StatusDot,
  StatusNote,
  weekday,
} from "./kit";
import { EntryVisual } from "./visuals";

const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/** How many releases the hero's card lists under the calendar. */
const LATEST = 5;
/** The calendar never grows past this many weeks; older ones scroll off. */
const MAX_WEEKS = 8;

const DAYS = groupByDate(CHANGELOG);

/* ---------- Hero ---------- */

export function ChangelogHero() {
  return (
    <section id="top" aria-labelledby="changelog-title" className="relative scroll-mt-16 bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col justify-center px-5 pb-12 pt-7 sm:px-8 sm:pb-14 lg:py-16 lg:pl-12 lg:pr-8">
            <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise">
              <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                <li>
                  <Link to="/" className="py-2 transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li aria-current="page" className="font-medium text-ink">
                  Changelog
                </li>
              </ol>
            </nav>

            <div
              className="mt-9 motion-safe:animate-hero-rise lg:mt-12"
              style={{ animationDelay: "0.05s" }}
            >
              <Pill icon={History}>Last shipped {formatDate(CHANGELOG_UPDATED)}</Pill>
            </div>

            <h1
              id="changelog-title"
              className="mt-5 text-balance font-display text-[2.4rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.3rem] lg:text-[3.2rem] xl:text-[3.6rem]"
              style={{ animationDelay: "0.12s" }}
            >
              Rankbox <Accent>changelog</Accent>
            </h1>

            <p
              className="mt-5 max-w-[32rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={{ animationDelay: "0.2s" }}
            >
              Everything we ship to Rankbox, dated as it ships. Each release says whether you can
              use it today, and if not, what it&rsquo;s waiting on.
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise"
              style={{ animationDelay: "0.28s" }}
            >
              <a href="/auth" className={SOLID_BUTTON}>
                {TRIAL_CTA}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href={RSS_PATH} className={cn(GHOST_BUTTON, "h-11 px-4 text-[0.9rem]")}>
                <Rss className="h-4 w-4 text-cta" />
                Subscribe via RSS
              </a>
            </div>
            <p
              className="mt-3.5 text-[0.82rem] text-muted-foreground motion-safe:animate-hero-rise"
              style={{ animationDelay: "0.32s" }}
            >
              {TRIAL_NOTE}
            </p>
          </div>

          {/* Flush to the right rail, with a hairline of white around it. */}
          <div
            className="min-w-0 px-3 pb-3 motion-safe:animate-hero-rise lg:py-3 lg:pl-0 lg:pr-3"
            style={{ animationDelay: "0.36s" }}
          >
            <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#eef4fe] px-4 py-10 sm:px-10 sm:py-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(24,119,242,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,119,242,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_30%,transparent_100%)]"
              />
              <ShipLog />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- The ship log card ---------- */

const DAY_MS = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

/** Monday of the week holding `day` (UTC), as a timestamp. */
function mondayOf(day: string): number {
  const t = Date.parse(`${day}T00:00:00Z`);
  const dow = (new Date(t).getUTCDay() + 6) % 7; // Monday = 0
  return t - dow * DAY_MS;
}

/** Weeks (Monday first) from the oldest release to the newest, capped at MAX_WEEKS. */
function calendarWeeks(): string[][] {
  const first = mondayOf(CHANGELOG.at(-1)!.date);
  const last = mondayOf(CHANGELOG[0].date);
  const weeks: string[][] = [];
  for (let w = first; w <= last; w += 7 * DAY_MS) {
    weeks.push(Array.from({ length: 7 }, (_, d) => iso(w + d * DAY_MS)));
  }
  return weeks.slice(-MAX_WEEKS);
}

const BY_DAY = new Map(DAYS.map((g) => [g.date, g.entries]));

function cellTone(n: number) {
  if (n === 0) return "bg-ink/[0.03] text-ink/35";
  if (n === 1) return "bg-cta/55 text-white";
  if (n === 2) return "bg-cta/80 text-white";
  return "bg-cta text-white";
}

function monthLabel(day: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
    new Date(`${day}T00:00:00Z`),
  );
}

function ShipLog() {
  const weeks = calendarWeeks();
  const latest = CHANGELOG.slice(0, LATEST);
  const rest = CHANGELOG.length - latest.length;
  return (
    <div className="relative w-full max-w-[25rem] rounded-2xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_56px_-28px_rgba(16,24,40,0.4)] sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[0.78rem] font-semibold text-ink">Ship log</p>
        <p className="text-[0.72rem] text-muted-foreground">
          {CHANGELOG.length} releases · {DAYS.length} ship days
        </p>
      </div>

      {/* The calendar: a row per week (Monday first), a cell per day, with its
          date. Days something shipped are blue, deeper the more shipped. */}
      <div className="mt-4" role="group" aria-label="Ship calendar: days with a release are blue">
        <div
          aria-hidden
          className="grid grid-cols-[2rem_repeat(7,minmax(0,1fr))] gap-1 text-center text-[0.6rem] font-medium text-muted-foreground"
        >
          <span />
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-1 space-y-1">
          {weeks.map((week, wi) => {
            // A row is labelled with its Monday's month, once, when that month begins.
            const month =
              wi === 0 || monthLabel(week[0]) !== monthLabel(weeks[wi - 1][0]) ? week[0] : null;
            return (
              <div key={week[0]} className="grid grid-cols-[2rem_repeat(7,minmax(0,1fr))] gap-1">
                <span
                  aria-hidden
                  className="flex items-center text-[0.6rem] font-medium text-muted-foreground"
                >
                  {month ? monthLabel(month) : ""}
                </span>
                {week.map((day) => {
                  const entries = BY_DAY.get(day) ?? [];
                  const n = entries.length;
                  const cell = cn(
                    "flex h-7 items-center justify-center rounded-md text-[0.62rem] tabular-nums",
                    cellTone(n),
                  );
                  const date = Number(day.slice(8));
                  return n ? (
                    <a
                      key={day}
                      href={`#${entries[0].slug}`}
                      title={`${formatShortDate(day)}: ${n} release${n === 1 ? "" : "s"}`}
                      aria-label={`${formatDate(day)}: ${n} release${n === 1 ? "" : "s"}`}
                      className={cn(
                        cell,
                        "font-semibold transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-1",
                      )}
                    >
                      {date}
                    </a>
                  ) : (
                    <span key={day} aria-hidden className={cell}>
                      {date}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <ol className="mt-5 divide-y divide-ink/[0.06] border-t border-ink/[0.06]">
        {latest.map((e) => (
          <li key={e.slug}>
            <a
              href={`#${e.slug}`}
              className="group flex items-center gap-2.5 py-2 text-[0.82rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
            >
              <StatusDot status={e.status} className="h-2 w-2" />
              <time
                dateTime={e.date}
                className="w-12 shrink-0 font-mono text-[0.68rem] uppercase text-muted-foreground"
              >
                {formatShortDate(e.date)}
              </time>
              <span className="min-w-0 truncate font-medium text-ink transition-colors group-hover:text-cta">
                {e.title}
              </span>
            </a>
          </li>
        ))}
      </ol>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-ink/[0.06] pt-3">
        <StatusLegend />
        {rest > 0 && (
          <a
            href="#timeline"
            className="text-[0.72rem] font-semibold text-cta hover:text-cta-hover"
          >
            +{rest} earlier
          </a>
        )}
      </div>
    </div>
  );
}

function StatusLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {(Object.keys(STATUSES) as ChangeStatus[]).map((s) => (
        <li
          key={s}
          className="flex items-center gap-1.5 text-[0.68rem] font-medium text-muted-foreground"
        >
          <StatusDot status={s} className="h-2 w-2" />
          {STATUSES[s].label}
        </li>
      ))}
    </ul>
  );
}

/* ---------- Stats ---------- */

export function ShipStats() {
  const live = CHANGELOG.filter((e) => e.status === "live").length;
  const stats = [
    { value: String(CHANGELOG.length), label: "releases in the log" },
    { value: String(DAYS.length), label: "days we shipped" },
    { value: String(live), label: `of ${CHANGELOG.length} live today` },
    { value: formatShortDate(CHANGELOG_UPDATED), label: "latest release" },
  ];
  return (
    <Band>
      <CellGrid className="grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label} className={cn(CELL, "px-5 py-6 sm:px-8 sm:py-7")}>
            <p className="font-display text-[1.7rem] font-medium tracking-[-0.02em] text-ink tabular-nums sm:text-[2rem]">
              {s.value}
            </p>
            <p className="mt-1 text-[0.82rem] text-muted-foreground">{s.label}</p>
          </li>
        ))}
      </CellGrid>
    </Band>
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
    // -mb-px: the first day's band draws its own top line, so the two meet as one.
    <div className={cn("sticky top-16 z-30 -mb-px border-y bg-white/90 backdrop-blur-md", LINE)}>
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center gap-3 border-x px-4 py-2.5 sm:px-8 lg:px-12",
          LINE,
        )}
      >
        <div
          role="group"
          aria-label="Filter releases"
          className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[0.85rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                  on ? "bg-cta-soft text-cta" : "text-ink hover:bg-ink/[0.04]",
                )}
              >
                {c.label}
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    on ? "text-cta/70" : "text-muted-foreground",
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
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[0.85rem] font-medium text-muted-foreground transition-colors hover:bg-ink/[0.04] hover:text-ink"
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
      {groupByDate(entries).map((g) => (
        <Band key={g.date}>
          <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)]">
            <div
              className={cn(
                "border-b px-5 py-5 sm:px-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-10",
                LINE,
              )}
            >
              <div className="flex items-baseline gap-3 lg:sticky lg:top-36 lg:block">
                <time dateTime={g.date} className="text-[0.95rem] font-semibold text-ink">
                  {formatDate(g.date)}
                </time>
                <p className="text-[0.78rem] text-muted-foreground lg:mt-1">
                  {weekday(g.date)}
                  <span className="lg:hidden"> · </span>
                  <span className="lg:mt-3 lg:block">
                    {g.entries.length} release{g.entries.length === 1 ? "" : "s"}
                  </span>
                </p>
              </div>
            </div>
            <div className="min-w-0">
              {g.entries.map((e, i) => (
                <TimelineEntry key={e.slug} entry={e} first={i === 0} />
              ))}
            </div>
          </div>
        </Band>
      ))}
      <EndOfLog />
    </section>
  );
}

function TimelineEntry({ entry, first }: { entry: ChangelogEntry; first: boolean }) {
  return (
    <article
      id={entry.slug}
      aria-labelledby={`${entry.slug}-title`}
      className={cn(
        "scroll-mt-36 px-5 py-10 sm:px-8 sm:py-12 lg:px-12",
        !first && cn("border-t", LINE),
      )}
    >
      <Reveal y={14}>
        <EntryLabels entry={entry} />
        <h2
          id={`${entry.slug}-title`}
          className="mt-4 max-w-3xl text-balance font-display text-[1.65rem] font-medium leading-[1.12] tracking-[-0.025em] text-ink sm:text-[2.05rem]"
        >
          <Link
            to="/changelog/$slug"
            params={{ slug: entry.slug }}
            className="transition-colors hover:text-cta"
          >
            {entry.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground">
          {entry.summary}
        </p>
        <StatusNote entry={entry} className="mt-5 max-w-2xl" />
      </Reveal>

      {entry.visual && (
        <Reveal y={20} delay={0.05} className="mt-8">
          <EntryVisual visual={entry.visual} />
        </Reveal>
      )}

      <EntryProse entry={entry} className="mt-8 max-w-2xl" />
      <EntryPoints entry={entry} className="mt-8" />
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <EntryLinks entry={entry} />
        <CopyLink slug={entry.slug} className="ml-auto" />
      </div>
    </article>
  );
}

/** Where the log starts, said plainly rather than implied by running out. */
function EndOfLog() {
  const first = CHANGELOG.at(-1);
  return (
    <Band>
      <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className={cn("hidden lg:block lg:border-r", LINE)} />
        <div className="px-5 py-10 sm:px-8 lg:px-12">
          <p className="text-[0.95rem] font-semibold text-ink">
            The log starts {first ? formatDate(first.date) : ""}.
          </p>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Earlier releases shipped under the Rankvolt name. New ones land here first, and in the{" "}
            <a href={RSS_PATH} className="font-medium text-cta hover:underline">
              RSS feed
            </a>
            .
          </p>
        </div>
      </div>
    </Band>
  );
}
