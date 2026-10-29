import { useId, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { PACE_OPTIONS, paceOptionLabel } from "@/data/auto-publishing";
import { cn } from "@/lib/utils";
import { PACE } from "./content";
import { MoreLinks } from "./MoreLinks";
import { SectionShell } from "./SectionShell";
import { SelectField } from "./SelectField";
import {
  formatHours,
  isCapped,
  parseMinutes,
  rosterTotals,
  siteMonth,
  type RosterRow,
} from "./planner";

const FIELD =
  "h-9 w-full rounded-lg border border-ink/[0.12] bg-white px-3 text-[0.88rem] text-ink shadow-[0_1px_1px_rgba(16,24,40,0.03)] focus-visible:border-cta/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/30";

/**
 * 06. The roster planner: the visitor's clients, a pace each from the
 * dashboard's own list, and their own minutes of editing per article. It
 * returns the month's articles (each site capped at its allowance) and the
 * editing hours they take. Arithmetic only, on their inputs; no prices.
 *
 * States: a roster (the default three sample clients), an empty roster (a
 * prompt to add one), an invalid minutes field (an inline error, and the
 * hours total waits), and a full roster (Add is disabled).
 */
export function RosterPlanner() {
  const uid = useId();
  const [rows, setRows] = useState<RosterRow[]>(() =>
    PACE.defaults.map((d, i) => ({ id: `r${i}`, name: d.name, pace: d.pace })),
  );
  const [minutesRaw, setMinutesRaw] = useState(String(PACE.defaultMinutes));
  const next = useRef(PACE.defaults.length);

  const minutes = parseMinutes(minutesRaw);
  const totals = rosterTotals(rows, minutes);
  const anyCapped = rows.some((r) => isCapped(r.pace));
  const full = rows.length >= PACE.maxRows;

  const update = (id: string, patch: Partial<RosterRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));
  const add = () => {
    if (full) return;
    const n = next.current++;
    setRows((rs) => [...rs, { id: `r${n}`, name: `${PACE.newClient} ${rs.length + 1}`, pace: 3 }]);
  };

  const minutesId = `${uid}-minutes`;
  const errorId = `${uid}-minutes-error`;

  return (
    <SectionShell id="pace" intro={PACE.intro}>
      <div
        role="group"
        aria-label={PACE.label}
        className="grid overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:grid-cols-[minmax(0,1fr)_17rem]"
      >
        {/* The roster. */}
        <div className="p-4 sm:p-6">
          <div
            aria-hidden
            className="hidden grid-cols-[minmax(0,1fr)_9.5rem_5.5rem_2.25rem] gap-3 px-1 pb-2 text-[0.72rem] font-medium text-muted-foreground sm:grid"
          >
            <span>{PACE.cols.client}</span>
            <span>{PACE.cols.pace}</span>
            <span className="text-right">{PACE.cols.month}</span>
            <span />
          </div>

          {rows.length === 0 ? (
            <p className="rounded-xl border border-dashed border-ink/[0.14] px-4 py-8 text-center text-[0.88rem] text-muted-foreground">
              {PACE.empty}
            </p>
          ) : (
            <ul className="grid gap-2">
              {rows.map((r) => {
                const month = siteMonth(r.pace);
                return (
                  <li
                    key={r.id}
                    className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 rounded-xl border border-ink/[0.06] bg-surface/40 p-2 sm:grid-cols-[minmax(0,1fr)_9.5rem_5.5rem_2.25rem] sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0"
                  >
                    <input
                      aria-label={PACE.clientField}
                      className={FIELD}
                      value={r.name}
                      maxLength={60}
                      onChange={(e) => update(r.id, { name: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => remove(r.id)}
                      aria-label={`${PACE.remove} ${r.name || PACE.newClient}`}
                      className="order-2 flex h-9 w-9 items-center justify-center justify-self-end rounded-lg text-muted-foreground transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 sm:order-last"
                    >
                      <X aria-hidden className="h-4 w-4" />
                    </button>
                    <SelectField
                      aria-label={`${PACE.paceField} ${r.name || PACE.newClient}`}
                      className="order-3 sm:order-none"
                      value={r.pace}
                      onChange={(e) => update(r.id, { pace: Number(e.target.value) })}
                    >
                      {PACE_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {paceOptionLabel(p)}
                        </option>
                      ))}
                    </SelectField>
                    <p className="order-4 text-right text-[0.82rem] text-muted-foreground sm:order-none">
                      <span>{PACE.upTo} </span>
                      <span className="font-semibold tabular-nums text-ink">{month}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={add}
            disabled={full}
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink/[0.12] bg-white px-3 text-[0.84rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.2] hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus aria-hidden className="h-4 w-4" />
            {PACE.add}
          </button>

          <div className="mt-6 border-t border-ink/[0.07] pt-5">
            <label htmlFor={minutesId} className="block text-[0.82rem] font-medium text-ink">
              {PACE.minutes}
              <span className="ml-2 font-normal text-muted-foreground">{PACE.minutesHint}</span>
            </label>
            <input
              id={minutesId}
              inputMode="numeric"
              className={cn(
                FIELD,
                "mt-2 max-w-[8rem] tabular-nums",
                minutes === null && "border-destructive/60",
              )}
              value={minutesRaw}
              aria-invalid={minutes === null}
              aria-describedby={minutes === null ? errorId : undefined}
              onChange={(e) => setMinutesRaw(e.target.value)}
            />
            {minutes === null && (
              <p id={errorId} className="mt-2 text-[0.8rem] text-destructive">
                {PACE.minutesError}
              </p>
            )}
          </div>
        </div>

        {/* The month. */}
        <div
          aria-live="polite"
          className="grid content-start gap-5 border-t border-ink/[0.07] bg-surface/70 p-5 sm:grid-cols-3 sm:p-6 lg:grid-cols-1 lg:border-l lg:border-t-0"
        >
          <Total label={PACE.totals.sites} value={String(totals.sites)} />
          <Total label={PACE.totals.articles} value={totals.articles.toLocaleString("en-US")} />
          <Total
            label={PACE.totals.hours}
            value={totals.hours === null ? "–" : formatHours(totals.hours)}
            accent
          />
          {anyCapped && (
            <p className="text-[0.75rem] leading-relaxed text-muted-foreground sm:col-span-3 lg:col-span-1">
              {PACE.capped}
            </p>
          )}
        </div>
      </div>

      <ul className="mt-6 grid max-w-3xl gap-2">
        {PACE.notes.map((n) => (
          <li key={n} className="flex gap-3 text-[0.86rem] leading-relaxed text-muted-foreground">
            <span aria-hidden className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-ink/30" />
            {n}
          </li>
        ))}
      </ul>
      <MoreLinks links={PACE.links} />
    </SectionShell>
  );
}

function Total({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[0.75rem] font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] tabular-nums",
          accent ? "text-brand-blue" : "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}
