/**
 * The page's focal scene: one Rankbox account, switching between brand sites.
 *
 * Drawn after the real dashboard: the sidebar with the site switcher at its
 * foot (its "Your sites" list, "Studio overview" and "Add a site" rows are
 * the switcher's own), the address bar carrying ?site= for every site but the
 * plan's own, and each site's "How it writes" settings (audience, tone, house
 * rules) beside its articles this cycle. Every brand is fictional and on a
 * .example domain, and the window says Sample.
 *
 * It moves only while about half of it is on screen: each brand comes up in
 * turn, then its draft in review publishes. Choosing a brand stops the cycle
 * there. With reduced motion it holds one frame, the first brand's draft just
 * published. The server renders the first brand, so nothing shifts on load.
 */
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  CalendarDays,
  Check,
  ChevronsUpDown,
  FileText,
  KeyRound,
  LayoutDashboard,
  Plus,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { PLAN, STUDIO, formatUsd } from "@/data/pricing";
import { multiBrand } from "@/data/persona-pages/multi-brand-companies";
import { BRANDS, LOOKS, useHalfOnScreen } from "./looks";
import { BrandMark, SampleTag } from "./ui";

const EASE = [0.16, 1, 0.3, 1] as const;
/* Two beats per brand: it comes up, then its draft in review publishes. */
const BEATS = BRANDS.length * 2;
const BEAT_MS = 1900;
/* The still frame: the first brand, its draft just published. */
const REST = 1;

/* Short stand-ins for site ids in the address bar. The plan's own site has
   no ?site= at all, as in the dashboard. */
const SITE_IDS = ["", "b71e4c", "4d09a2", "e5c3f8"];

function useBeat(run: boolean, reduce: boolean, held: number | null) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (held !== null) {
      setT(held * 2 + 1);
      return;
    }
    if (reduce) {
      setT(REST);
      return;
    }
    if (!run) return;
    const id = window.setInterval(() => setT((n) => (n + 1) % BEATS), BEAT_MS);
    return () => window.clearInterval(id);
  }, [run, reduce, held]);
  return t;
}

type Status = "Published" | "In review" | "Scheduled";

function StatusChip({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold",
        status === "Published" && "bg-[#e9f6ee] text-success",
        status === "In review" && "bg-ink/[0.05] text-muted-foreground",
        status === "Scheduled" && "bg-cta-soft text-cta",
      )}
    >
      {status === "Published" ? (
        <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={3} />
      ) : (
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {status}
    </span>
  );
}

/* ---------- The site switcher, open ---------- */

function SiteList({
  active,
  onPick,
  compact = false,
}: {
  active: number;
  onPick: (i: number) => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="border-b border-ink/[0.07] px-3 py-3">
        <p className="flex items-center justify-between px-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Your sites <span className="tabular-nums">{BRANDS.length}</span>
        </p>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {BRANDS.map((b, i) => (
            <button
              key={b.domain}
              type="button"
              onClick={() => onPick(i)}
              aria-pressed={i === active}
              aria-label={`Show ${b.name}`}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-1.5 transition-[background-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                i === active
                  ? "bg-cta-soft shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cta)_28%,transparent)]"
                  : "hover:bg-ink/[0.03]",
              )}
            >
              <BrandMark index={i} className="h-7 w-7" />
              <span className="w-full truncate text-center text-[0.6rem] font-medium text-ink">
                {b.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_18px_36px_-20px_rgba(16,24,40,0.35)]">
      <p className="flex items-center justify-between px-2 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Your sites <span className="tabular-nums">{BRANDS.length}</span>
      </p>
      <ul>
        {BRANDS.map((b, i) => (
          <li key={b.domain}>
            <button
              type="button"
              onClick={() => onPick(i)}
              aria-pressed={i === active}
              aria-label={`Show ${b.name}`}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                i === active ? "bg-cta-soft" : "hover:bg-ink/[0.03]",
              )}
            >
              <BrandMark index={i} className="h-6 w-6 rounded-md" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.72rem] font-medium text-ink">{b.name}</span>
                <span className="block truncate text-[0.6rem] text-muted-foreground">
                  {b.domain}
                </span>
              </span>
              <Check
                aria-hidden
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-brand-blue transition-opacity duration-300",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          </li>
        ))}
      </ul>
      <div aria-hidden className="my-1 h-px bg-ink/[0.07]" />
      <div aria-hidden className="flex items-center gap-2 rounded-md px-2 py-1.5">
        <span className="grid h-6 w-6 place-items-center">
          <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
        <span className="flex-1 text-[0.72rem] text-ink">Studio overview</span>
      </div>
      <div aria-hidden className="flex items-center gap-2 rounded-md px-2 py-1.5">
        <span className="grid h-6 w-6 place-items-center rounded-full border border-dashed border-ink/[0.2]">
          <Plus className="h-3 w-3 text-muted-foreground" />
        </span>
        <span className="flex-1 text-[0.72rem] text-ink">Add a site</span>
        <span className="text-[0.62rem] tabular-nums text-muted-foreground">
          {formatUsd(STUDIO.monthlyPerSite)}/mo
        </span>
      </div>
    </div>
  );
}

const NAV = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Articles", icon: FileText },
  { label: "Calendar", icon: CalendarDays },
  { label: "Settings", icon: Settings2 },
];

function Sidebar({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const b = BRANDS[active];
  return (
    <div className="hidden flex-col border-r border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_60%,white)] p-3 lg:flex">
      <div className="flex items-center gap-2 px-1.5 py-1">
        <Mark className="h-5 w-5 text-brand-blue" />
        <span className="text-[0.8rem] font-semibold tracking-tight text-ink">Rankbox</span>
      </div>
      <ul aria-hidden className="mt-4 space-y-0.5">
        {NAV.map(({ label, icon: Icon }, i) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.72rem]",
              i === 0
                ? "bg-white font-medium text-ink shadow-[0_0_0_1px_rgba(16,24,40,0.06)]"
                : "text-ink/60",
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", i === 0 ? "text-brand-blue" : "")} />
            {label}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4">
        <SiteList active={active} onPick={onPick} />
        {/* The switcher itself, which opened the list above. */}
        <div
          aria-hidden
          className="mt-2 flex items-center gap-2 rounded-xl bg-white px-2 py-2 shadow-[inset_0_0_0_1px_rgba(16,24,40,0.08)]"
        >
          <BrandMark index={active} className="h-7 w-7" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.74rem] font-semibold text-ink">{b.name}</span>
            <span className="block truncate text-[0.6rem] text-muted-foreground">{b.domain}</span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

/* ---------- One brand's workspace ---------- */

function Workspace({ index, fresh, reduce }: { index: number; fresh: boolean; reduce: boolean }) {
  const b = BRANDS[index];
  const look = LOOKS[index];
  const count = b.published + (fresh ? 1 : 0);
  /* Left in the plan after this cycle's published and scheduled articles. */
  const planned = PLAN.articlesPerMonth - count - 1;
  const rows: { title: string; status: Status }[] = [
    { title: b.articles[0], status: fresh ? "Published" : "In review" },
    { title: b.articles[1], status: "Scheduled" },
    { title: b.articles[2], status: "Published" },
  ];
  const settings: [string, string][] = [
    ["Audience", b.audience],
    ["Tone", b.tone],
    ["Writing style", b.style],
    ["House rules", b.rule],
  ];

  return (
    <div className="flex h-full flex-col p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <BrandMark index={index} className="h-10 w-10 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[1rem] font-semibold tracking-tight text-ink">{b.name}</p>
          <p className="mt-0.5 flex min-w-0 items-center gap-2 text-[0.68rem] text-muted-foreground">
            <span className="truncate font-mono">{b.domain}</span>
            <span
              className="hidden shrink-0 whitespace-nowrap rounded-md px-1.5 py-px font-medium sm:inline"
              style={{ background: look.wash, color: look.ink }}
            >
              {b.category}
            </span>
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold",
            index === 0 ? "bg-ink/[0.05] text-ink/70" : "bg-cta-soft text-cta",
          )}
        >
          {index === 0 ? "Your plan" : STUDIO.name}
          <span className="hidden sm:inline">
            {index === 0 ? "" : ` · ${formatUsd(STUDIO.monthlyPerSite)}/mo`}
          </span>
        </span>
      </div>

      <div className="mt-5 grid flex-1 grid-cols-[minmax(0,1fr)] content-start gap-3">
        {/* The site's writing settings, labelled as Settings labels them. */}
        <div className="rounded-xl border border-ink/[0.07] bg-white p-3.5">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            How it writes
          </p>
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <dl className="divide-y divide-ink/[0.06] text-[0.72rem]">
              {settings.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-2 py-1.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-lg p-3 pt-2.5" style={{ background: look.wash }}>
              <p
                className="text-[0.58rem] font-semibold uppercase tracking-[0.1em]"
                style={{ color: look.ink }}
              >
                In its voice
              </p>
              <p className="mt-1.5 text-[0.84rem] leading-snug text-ink">&ldquo;{b.line}&rdquo;</p>
            </div>
          </div>
        </div>

        {/* This cycle's articles. */}
        <div className="rounded-xl border border-ink/[0.07] bg-white p-3.5">
          <div className="flex items-baseline justify-between">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              This cycle
            </p>
            <p className="text-[0.72rem] font-semibold tabular-nums text-ink">
              {count} / {PLAN.articlesPerMonth} published
            </p>
          </div>
          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
            <span
              className={cn(
                "block h-full rounded-full bg-cta",
                !reduce && "transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              )}
              style={{ width: `${(count / PLAN.articlesPerMonth) * 100}%` }}
            />
          </span>
          <ul className="mt-3 space-y-1.5">
            {rows.map((r, i) => (
              <li
                key={r.title}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 transition-colors duration-500",
                  i === 0 && fresh
                    ? "border-success/25 bg-[#f3faf5]"
                    : "border-ink/[0.07] bg-white",
                )}
              >
                <span className="min-w-0 truncate text-[0.7rem] font-medium text-ink">
                  {r.title}
                </span>
                <StatusChip status={r.status} />
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-ink/[0.07] pt-2.5 text-[0.66rem]">
            <span className="flex-1 whitespace-nowrap text-muted-foreground">
              {planned} more in this site&rsquo;s plan
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <KeyRound aria-hidden className="h-3.5 w-3.5" />
              REST API key, this site only
              <span className="inline-flex items-center gap-1 font-semibold text-success">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
                Live
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- The scene ---------- */

export function PortfolioSwitcher({ className }: { className?: string }) {
  const [ref, on] = useHalfOnScreen<HTMLElement>();
  const reduce = useReducedMotion() ?? false;
  const [held, setHeld] = useState<number | null>(null);
  const t = useBeat(on, reduce, held);
  const active = Math.floor(t / 2) % BRANDS.length;
  const fresh = t % 2 === 1;
  const { account } = multiBrand;

  return (
    <figure ref={ref} className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_32px_64px_-32px_rgba(16,24,40,0.35)]">
        {/* Window chrome, with the address bar that keeps the site. */}
        <div className="flex items-center gap-3 border-b border-ink/[0.07] px-3.5 py-2.5">
          <span aria-hidden className="hidden gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/[0.1]" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/[0.1]" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/[0.1]" />
          </span>
          <span
            aria-hidden
            className="min-w-0 flex-1 truncate rounded-md bg-ink/[0.04] px-2.5 py-1 font-mono text-[0.64rem] text-muted-foreground"
          >
            rankbox.xyz/dashboard
            {SITE_IDS[active] && <span className="text-cta">?site={SITE_IDS[active]}…</span>}
          </span>
          <span className="hidden shrink-0 text-[0.66rem] font-medium text-ink/70 sm:inline">
            {account.name}
          </span>
          <SampleTag />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)]">
          <Sidebar active={active} onPick={setHeld} />
          <div className="min-w-0">
            <div className="lg:hidden">
              <SiteList compact active={active} onPick={setHeld} />
            </div>
            {/* Every brand's workspace shares one grid cell, so the window
                keeps the tallest one's height and nothing below it moves
                when the brand changes. */}
            <div className="grid grid-cols-[minmax(0,1fr)]">
              {BRANDS.map((b, i) => {
                const on = i === active;
                return (
                  <motion.div
                    key={b.domain}
                    initial={false}
                    animate={{ opacity: on ? 1 : 0, y: on || reduce ? 0 : 6 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : on
                          ? { duration: 0.42, delay: 0.16, ease: EASE }
                          : { duration: 0.16, ease: "easeOut" }
                    }
                    aria-hidden={!on}
                    className={cn("[grid-area:1/1]", !on && "pointer-events-none")}
                  >
                    <Workspace index={i} fresh={on && fresh} reduce={reduce} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-2xl text-balance text-center text-[0.78rem] leading-relaxed text-muted-foreground">
        {account.caption}
      </figcaption>
    </figure>
  );
}
