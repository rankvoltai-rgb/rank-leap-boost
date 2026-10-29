/**
 * The operating model, as a small dashboard you can click through. Pick a
 * site and three things change: the address bar's `?site=` (the plan's own
 * site has none, as in the real dashboard), the sidebar's selection, and the
 * panel of everything that belongs to that site alone. The account-wide strip
 * underneath never changes, which is the point.
 *
 * All sample data. Articles left is the plan's allowance minus what's
 * published this cycle, so the numbers on screen always add up.
 */
import { useState } from "react";
import { KeyRound, Lock, Mic, Plus, Power, CalendarClock } from "lucide-react";
import { PLAN } from "@/sublanding/_shared/facts";
import { cn } from "@/lib/utils";
import { MODEL, SITE_PRICE, type SampleSite } from "./content";
import { CARD, FOCUS, LIFT, TONE_BG } from "./ui";

export function articlesLeft(site: SampleSite) {
  return PLAN.articlesPerMonth - site.published;
}

function Mark({ site, size = "md" }: { site: SampleSite; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md font-bold text-white",
        TONE_BG[site.tone],
        size === "sm" ? "h-6 w-6 text-[0.7rem]" : "h-9 w-9 text-[0.9rem]",
      )}
    >
      {site.initial}
    </span>
  );
}

function Meter({ label, left, of }: { label: string; left: number; of: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-[0.74rem]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums text-ink">
          {left}/{of}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-brand-blue/70 transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${Math.round((left / of) * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function Diorama() {
  const [id, setId] = useState<string>(MODEL.sites[0].id);
  const site = MODEL.sites.find((s) => s.id === id) ?? MODEL.sites[0];
  const f = MODEL.fields;

  return (
    <figure className="m-0">
      <div className={cn(CARD, LIFT, "overflow-hidden")} role="group" aria-label={MODEL.frameLabel}>
        {/* Address bar: the site you're on travels in the URL. */}
        <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2.5">
          <span className="hidden gap-1 sm:flex" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] text-muted-foreground">
            <Lock aria-hidden className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {MODEL.host}
              {MODEL.path}
              {site.param && (
                <span className="rounded bg-cta-soft px-0.5 text-cta">?site={site.param}</span>
              )}
            </span>
          </span>
        </div>

        <div className="grid md:grid-cols-[15.5rem_minmax(0,1fr)]">
          {/* The site switcher's list. */}
          <div className="border-b border-border p-3 md:border-b-0 md:border-r">
            <p className="px-2 pb-2 pt-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {MODEL.switcherLabel}
              <span className="ml-1.5 tabular-nums">{MODEL.sites.length}</span>
            </p>
            <ul className="grid grid-cols-1 gap-1 min-[420px]:grid-cols-2 md:grid-cols-1">
              {MODEL.sites.map((s) => {
                const on = s.id === site.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setId(s.id)}
                      aria-pressed={on}
                      aria-controls="diorama-panel"
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors duration-150",
                        FOCUS,
                        on ? "bg-cta-soft" : "hover:bg-surface",
                      )}
                    >
                      <Mark site={s} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-[0.82rem] font-medium",
                            on ? "text-cta" : "text-ink",
                          )}
                        >
                          {s.name}
                        </span>
                        <span className="block truncate text-[0.68rem] text-muted-foreground">
                          {s.domain}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 flex items-center gap-2.5 border-t border-border px-2 pt-3 text-[0.8rem] text-muted-foreground">
              <span
                aria-hidden
                className="grid h-6 w-6 place-items-center rounded-full border border-dashed border-border"
              >
                <Plus className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1">{MODEL.addSite}</span>
              <span className="text-[0.72rem] tabular-nums">
                {SITE_PRICE}
                {MODEL.perMonth}
              </span>
            </div>
          </div>

          {/* Everything that belongs to the site you're on. */}
          <div id="diorama-panel" aria-live="polite" className="min-w-0 p-5 sm:p-6">
            <div key={site.id} className="motion-safe:animate-hero-rise">
              <div className="flex items-center gap-3">
                <Mark site={site} />
                <div className="min-w-0">
                  <p className="truncate text-[1rem] font-semibold text-ink">{site.name}</p>
                  <p className="truncate text-[0.76rem] text-muted-foreground">{site.role}</p>
                </div>
              </div>

              <p className="mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {MODEL.panelLabel}
              </p>
              <dl className="mt-2 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                <div className="bg-card p-4">
                  <dt className="flex items-center gap-1.5 text-[0.74rem] text-muted-foreground">
                    <Mic aria-hidden className="h-3.5 w-3.5" />
                    {f.voice}
                  </dt>
                  <dd className="mt-1.5 text-[0.86rem] text-ink">
                    {site.voice.tone} · {site.voice.audience}
                    <span className="mt-1 block text-[0.78rem] text-muted-foreground">
                      “{site.voice.rule}”
                    </span>
                  </dd>
                </div>
                <div className="bg-card p-4">
                  <dt className="flex items-center gap-1.5 text-[0.74rem] text-muted-foreground">
                    <Power aria-hidden className="h-3.5 w-3.5" />
                    {f.autopilot}
                  </dt>
                  <dd className="mt-1.5 text-[0.86rem] text-ink">{site.autopilot}</dd>
                  <dt className="mt-3 flex items-center gap-1.5 text-[0.74rem] text-muted-foreground">
                    <CalendarClock aria-hidden className="h-3.5 w-3.5" />
                    {f.cycle}
                  </dt>
                  <dd className="mt-1.5 text-[0.86rem] tabular-nums text-ink">
                    {site.published} {f.published} · {site.queued} {f.queued}
                  </dd>
                </div>
                <div className="bg-card p-4">
                  <dt className="text-[0.74rem] text-muted-foreground">{f.credits}</dt>
                  <dd className="mt-2 space-y-2.5">
                    <Meter
                      label={f.articles}
                      left={articlesLeft(site)}
                      of={PLAN.articlesPerMonth}
                    />
                    <Meter
                      label={f.backlinks}
                      left={site.backlinksLeft}
                      of={PLAN.backlinkCreditsPerMonth}
                    />
                    <Meter
                      label={f.reddit}
                      left={site.redditLeft}
                      of={PLAN.redditRepliesPerMonth}
                    />
                  </dd>
                </div>
                <div className="bg-card p-4">
                  <dt className="flex items-center gap-1.5 text-[0.74rem] text-muted-foreground">
                    <KeyRound aria-hidden className="h-3.5 w-3.5" />
                    {f.publishing}
                  </dt>
                  <dd className="mt-1.5 text-[0.86rem] text-ink">
                    {f.key} <span className="font-mono tabular-nums">····{site.keyEnding}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* What never changes when you switch. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border bg-surface px-4 py-3 sm:px-5">
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {MODEL.accountLabel}
          </span>
          {MODEL.account.map((a) => (
            <span
              key={a}
              className="rounded-md border border-border bg-card px-2 py-0.5 text-[0.74rem] text-ink/80"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-[0.74rem] text-muted-foreground">
        <span>{MODEL.hint}</span>
        <span>{MODEL.caption}</span>
      </figcaption>
    </figure>
  );
}
