import { useId, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANNER, type PlannerEngine } from "./content";
import { formatCount, planPromptCheck, readWhole } from "./planner";

type FieldKey = keyof typeof PLANNER.fields;
const FIELD_ORDER: FieldKey[] = ["sites", "prompts", "runs", "minutes"];

/**
 * How many answers the monthly prompt check means, from the visitor's own
 * numbers. Every field shows its own error when it isn't a whole number in
 * range, and the result waits (a dash) until all of them are.
 */
export function PromptPlanner() {
  const [raw, setRaw] = useState<Record<FieldKey, string>>(() => ({
    sites: String(PLANNER.fields.sites.initial),
    prompts: String(PLANNER.fields.prompts.initial),
    runs: String(PLANNER.fields.runs.initial),
    minutes: String(PLANNER.fields.minutes.initial),
  }));
  const [engines, setEngines] = useState<PlannerEngine[]>([...PLANNER.initialEngines]);

  const values = Object.fromEntries(
    FIELD_ORDER.map((k) => [k, readWhole(raw[k], PLANNER.fields[k].min, PLANNER.fields[k].max)]),
  ) as Record<FieldKey, number | null>;
  const ready = FIELD_ORDER.every((k) => values[k] !== null) && engines.length > 0;
  const plan = ready
    ? planPromptCheck({
        sites: values.sites!,
        prompts: values.prompts!,
        engines: engines.length,
        runs: values.runs!,
        minutes: values.minutes!,
      })
    : null;

  const toggle = (id: PlannerEngine) =>
    setEngines((cur) => (cur.includes(id) ? cur.filter((e) => e !== id) : [...cur, id]));

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-5 py-5 sm:px-7">
        <h3 className="text-[1.1rem] font-semibold tracking-tight text-ink">{PLANNER.title}</h3>
        <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {PLANNER.intro}
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6 px-5 py-6 sm:px-7">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2">
            {FIELD_ORDER.map((k) => (
              <NumberField
                key={k}
                field={k}
                value={raw[k]}
                valid={values[k] !== null}
                onChange={(v) => setRaw((cur) => ({ ...cur, [k]: v }))}
              />
            ))}
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-ink">{PLANNER.enginesLabel}</legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {PLANNER.engines.map((e) => {
                const on = engines.includes(e.id);
                return (
                  <button
                    key={e.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(e.id)}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[0.82rem] font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                      on
                        ? "border-cta/40 bg-cta-soft text-cta"
                        : "border-border bg-card text-muted-foreground hover:text-ink",
                    )}
                  >
                    {on && <Check aria-hidden className="h-3.5 w-3.5" />}
                    {e.label}
                  </button>
                );
              })}
            </div>
            {engines.length === 0 && (
              <p role="alert" className="mt-2 text-xs text-destructive">
                {PLANNER.noEngines}
              </p>
            )}
          </fieldset>
        </div>

        <div
          aria-live="polite"
          className="flex flex-col justify-center border-t border-border bg-surface/60 px-5 py-7 sm:px-7 md:border-l md:border-t-0"
        >
          <p className="font-display text-[3rem] font-semibold leading-none tracking-[-0.04em] text-ink">
            {plan ? formatCount(plan.perClient) : "–"}
          </p>
          <p className="mt-2 text-sm font-medium text-ink">{PLANNER.perClient}</p>
          {plan && (
            <>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {PLANNER.formula(values.prompts!, engines.length, values.runs!)}
              </p>
              <div className="mt-6 space-y-1.5 border-t border-border pt-5 text-sm text-muted-foreground">
                <p>{PLANNER.total(formatCount(plan.total))}</p>
                <p>{PLANNER.hours(formatCount(plan.hours))}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="border-t border-border px-5 py-4 text-xs leading-relaxed text-muted-foreground sm:px-7">
        {PLANNER.footnote}
      </p>
    </div>
  );
}

function NumberField({
  field,
  value,
  valid,
  onChange,
}: {
  field: FieldKey;
  value: string;
  valid: boolean;
  onChange: (v: string) => void;
}) {
  const id = useId();
  const errId = useId();
  const f = PLANNER.fields[field];
  const n = Number(value);
  const step = (d: number) => {
    const base = Number.isFinite(n) ? Math.round(n) : f.initial;
    onChange(String(Math.min(f.max, Math.max(f.min, base + d))));
  };
  const btn =
    "grid h-9 w-9 shrink-0 place-items-center text-muted-foreground transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta disabled:opacity-40";
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-2 text-sm font-medium text-ink"
      >
        {f.label}
        {"hint" in f && <span className="text-xs font-normal text-muted-foreground">{f.hint}</span>}
      </label>
      <div
        className={cn(
          "mt-1.5 flex items-center overflow-hidden rounded-lg border bg-card transition-colors focus-within:border-cta/50",
          valid ? "border-border" : "border-destructive/60",
        )}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={valid && n <= f.min}
          aria-label={`${f.label} −1`}
          className={btn}
        >
          <Minus aria-hidden className="h-3.5 w-3.5" />
        </button>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!valid || undefined}
          aria-describedby={valid ? undefined : errId}
          className="h-9 min-w-0 flex-1 bg-transparent text-center font-mono text-sm text-ink outline-none"
        />
        <button
          type="button"
          onClick={() => step(1)}
          disabled={valid && n >= f.max}
          aria-label={`${f.label} +1`}
          className={btn}
        >
          <Plus aria-hidden className="h-3.5 w-3.5" />
        </button>
      </div>
      {!valid && (
        <p id={errId} className="mt-1.5 text-xs text-destructive">
          {PLANNER.invalid(f.min, f.max)}
        </p>
      )}
    </div>
  );
}
