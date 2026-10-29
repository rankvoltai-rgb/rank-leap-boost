import { useId, useState, type ReactNode } from "react";
import { AlertCircle, Info, Minus, Plus } from "lucide-react";
import { formatUsd } from "@/sublanding/_shared/facts";
import { cn } from "@/lib/utils";
import { MARGIN } from "./content";
import {
  FIELD_MAX,
  LIMITS,
  readCalculator,
  type CalcField,
  type FieldError,
  type MarginResult,
  type PlanSite,
} from "./calc";
import { CARD, FOCUS, LedgerRow, TEXT_LINK } from "./parts";

/**
 * The page's main interaction: an agency's month across its clients, worked
 * out from the visitor's own numbers plus Rankbox's published price. The
 * retainer starts blank, so the page never puts a price in anyone's mouth;
 * until it's typed, the panel shows the bill and the break-even instead.
 */

const R = MARGIN.results;

const money = (n: number) => formatUsd(Math.round(n * 100) / 100);

function errorText(error: FieldError, max: number): string {
  if (error === "tooBig") return MARGIN.errors.tooBig(max);
  return MARGIN.errors[error];
}

export function MarginCalculator() {
  const [clientsRaw, setClientsRaw] = useState("3");
  const [planSite, setPlanSite] = useState<PlanSite>("agency");
  const [raw, setRaw] = useState<Record<CalcField, string>>({
    retainer: "",
    setupFee: "",
    hours: "",
    rate: "",
    setupHours: "",
  });

  const calc = readCalculator(clientsRaw, planSite, raw);
  const { result, values } = calc;
  const clientsError = calc.clientsError
    ? MARGIN.errors.clients(LIMITS.clients.min, LIMITS.clients.max)
    : null;

  const set = (f: CalcField) => (v: string) => setRaw((r) => ({ ...r, [f]: v }));
  const step = (by: number) => {
    const now = calc.clients ?? LIMITS.clients.min;
    const next = Math.min(LIMITS.clients.max, Math.max(LIMITS.clients.min, now + by));
    setClientsRaw(String(next));
  };

  const fieldError = (f: CalcField) => {
    const e = calc.errors[f];
    return e ? errorText(e, FIELD_MAX[f]) : null;
  };

  const showSetup = values.setupFee !== null || values.setupHours !== null;

  return (
    <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      {/* Inputs */}
      <form
        className={cn(CARD, "divide-y divide-border")}
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <fieldset className="p-6 sm:p-8">
          <legend className="sr-only">{MARGIN.clients.legend}</legend>
          <p aria-hidden className="text-sm font-semibold text-ink">
            {MARGIN.clients.legend}
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10">
            <ClientStepper
              value={clientsRaw}
              onChange={setClientsRaw}
              onStep={step}
              error={clientsError}
            />
            <PlanSitePicker value={planSite} onChange={setPlanSite} />
          </div>
        </fieldset>

        <fieldset className="p-6 sm:p-8">
          <legend className="sr-only">{MARGIN.price.legend}</legend>
          <p aria-hidden className="text-sm font-semibold text-ink">
            {MARGIN.price.legend}
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <AmountField
              label={MARGIN.price.retainer}
              prefix="$"
              suffix={R.perMonth}
              value={raw.retainer}
              onChange={set("retainer")}
              error={fieldError("retainer")}
              hint={
                <>
                  {MARGIN.price.retainerHint}{" "}
                  <a href="#market-rates" className={TEXT_LINK}>
                    {MARGIN.price.retainerLink}
                  </a>
                </>
              }
            />
            <AmountField
              label={MARGIN.price.setupFee}
              prefix="$"
              value={raw.setupFee}
              onChange={set("setupFee")}
              error={fieldError("setupFee")}
              hint={MARGIN.price.optional}
            />
          </div>
        </fieldset>

        <fieldset className="p-6 sm:p-8">
          <legend className="sr-only">{MARGIN.time.legend}</legend>
          <p aria-hidden className="text-sm font-semibold text-ink">
            {MARGIN.time.legend}
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <AmountField
              label={MARGIN.time.hours}
              suffix="h"
              value={raw.hours}
              onChange={set("hours")}
              error={fieldError("hours")}
              hint={MARGIN.time.hoursHint}
            />
            <AmountField
              label={MARGIN.time.rate}
              prefix="$"
              suffix="/h"
              value={raw.rate}
              onChange={set("rate")}
              error={fieldError("rate")}
              hint={MARGIN.time.rateHint}
            />
            <AmountField
              label={MARGIN.time.setupHours}
              suffix="h"
              value={raw.setupHours}
              onChange={set("setupHours")}
              error={fieldError("setupHours")}
              hint={MARGIN.time.setupHoursHint}
              className="sm:col-span-2"
            />
          </div>
        </fieldset>
      </form>

      {/* Results */}
      <section
        aria-labelledby="margin-results"
        className={cn(CARD, "p-6 sm:p-8 lg:sticky lg:top-24")}
      >
        <h3 id="margin-results" className="text-sm font-semibold text-ink">
          {R.title}
        </h3>
        {/* One short line for screen readers, instead of re-reading the panel on every keystroke. */}
        <p aria-live="polite" className="sr-only">
          {calc.status === "error" || !result
            ? R.error
            : result.margin === null
              ? R.emptyBreakEven(money(result.breakEven))
              : `${R.margin} ${money(result.margin)}${R.perMonth}`}
        </p>

        {calc.status === "error" || !result ? (
          <p className="mt-6 flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive">
            <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            {R.error}
          </p>
        ) : (
          <Results
            result={result}
            planSite={planSite}
            clients={calc.clients ?? 1}
            hours={values.hours ?? 0}
            rate={values.rate ?? 0}
            showSetup={showSetup}
            setupFee={values.setupFee ?? 0}
          />
        )}

        <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
          {R.firstMonth}{" "}
          <a href="#billing" className={TEXT_LINK}>
            {R.firstMonthLink}
          </a>
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Results({
  result,
  planSite,
  clients,
  hours,
  rate,
  showSetup,
  setupFee,
}: {
  result: MarginResult;
  planSite: PlanSite;
  clients: number;
  hours: number;
  rate: number;
  showSetup: boolean;
  setupFee: number;
}) {
  const priced = result.revenue !== null && result.margin !== null;
  const loss = priced && (result.margin ?? 0) < 0;
  const revenue = result.revenue ?? 0;
  // The split of each dollar billed, drawn only while there's a margin to show.
  const split =
    priced && !loss && revenue > 0
      ? [
          { key: "bill", share: result.rankboxBill / revenue, className: "bg-ink/45" },
          { key: "time", share: result.teamTime / revenue, className: "bg-ink/15" },
          { key: "margin", share: (result.margin ?? 0) / revenue, className: "bg-cta" },
        ].filter((s) => s.share > 0)
      : [];

  return (
    <>
      {split.length > 0 && (
        <div aria-hidden className="mt-6 flex h-3 gap-[2px] overflow-hidden rounded-[4px]">
          {split.map((s) => (
            <span
              key={s.key}
              className={cn(
                "h-full motion-safe:transition-[flex-grow] motion-safe:duration-300",
                s.className,
              )}
              style={{ flexGrow: s.share, flexBasis: 0 }}
            />
          ))}
        </div>
      )}

      <dl className="mt-6 space-y-3">
        <div>
          <LedgerRow
            label={R.bill}
            value={`${money(result.rankboxBill)}${R.perMonth}`}
            swatch={split.length ? "bg-ink/45" : undefined}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {R.billDetail(planSite, result.studioSites)}
            {planSite === "agency" && <> · {R.billNoteAgency}</>}
          </p>
        </div>
        <LedgerRow label={R.perClient} value={`${money(result.rankboxPerClient)}${R.perMonth}`} />
        <div>
          <LedgerRow
            label={R.time}
            value={`${money(result.teamTime)}${R.perMonth}`}
            swatch={split.length ? "bg-ink/15" : undefined}
          />
          {result.teamTime > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {R.timeDetail(clients, hours, money(rate))}
            </p>
          )}
        </div>
        <LedgerRow label={R.totalCost} value={`${money(result.totalCost)}${R.perMonth}`} strong />
      </dl>

      {!priced ? (
        <div className="mt-6 rounded-xl border border-dashed border-ink/15 bg-surface/60 p-5">
          <p className="text-sm font-medium text-ink">{R.empty}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {R.emptyBreakEven(money(result.breakEven))}
          </p>
        </div>
      ) : (
        <div className="mt-6 border-t border-border pt-6">
          <dl className="space-y-3">
            <LedgerRow label={R.revenue} value={`${money(revenue)}${R.perMonth}`} />
          </dl>
          <div className="mt-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                aria-hidden
                className={cn("h-2 w-2 rounded-[2px]", loss ? "bg-destructive" : "bg-cta")}
              />
              {R.margin}
            </p>
            <p
              className={cn(
                "mt-1 font-display text-[2.5rem] font-semibold leading-none tracking-[-0.035em]",
                loss ? "text-destructive" : "text-ink",
              )}
            >
              {money(result.margin ?? 0)}
              <span className="ml-1 font-sans text-base font-normal tracking-normal text-muted-foreground">
                {R.perMonth}
              </span>
            </p>
            {result.marginPct !== null && (
              <p className="mt-2 text-sm text-muted-foreground">{R.marginPct(result.marginPct)}</p>
            )}
          </div>

          {loss && (
            <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive">
              <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              {R.loss(money(Math.abs(result.margin ?? 0)), money(result.breakEven))}
            </p>
          )}

          <dl className="mt-5 space-y-1">
            <LedgerRow label={R.breakEven} value={money(result.breakEven)} />
            <p className="text-xs text-muted-foreground">{R.breakEvenDetail}</p>
          </dl>

          {result.teamTime === 0 && (
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Info aria-hidden className="mt-px h-3.5 w-3.5 shrink-0" />
              {R.zeroTime}
            </p>
          )}
        </div>
      )}

      {showSetup && (
        <div className="mt-6 border-t border-border pt-6">
          <h4 className="text-sm font-semibold text-ink">{R.setupTitle}</h4>
          <dl className="mt-3 space-y-2.5">
            <LedgerRow label={R.setupFee} value={money(setupFee)} />
            <LedgerRow label={R.setupCost} value={money(result.setupTimeCost)} />
            <LedgerRow label={R.setupNet} value={money(result.setupNet)} strong />
          </dl>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

const INPUT =
  "h-11 w-full rounded-lg border bg-white text-[0.95rem] tabular-nums text-ink placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-4";

function AmountField({
  label,
  hint,
  prefix,
  suffix,
  value,
  onChange,
  error,
  className,
}: {
  label: string;
  hint?: ReactNode;
  prefix?: string;
  suffix?: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  className?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative mt-2">
        {prefix && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted-foreground"
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined
          }
          className={cn(
            INPUT,
            prefix ? "pl-7" : "pl-3.5",
            suffix ? "pr-12" : "pr-3.5",
            error
              ? "border-destructive/60 focus-visible:ring-destructive/15"
              : "border-ink/15 hover:border-ink/25 focus-visible:border-cta focus-visible:ring-cta/15",
          )}
        />
        {suffix && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-muted-foreground"
          >
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function ClientStepper({
  value,
  onChange,
  onStep,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onStep: (by: number) => void;
  error: string | null;
}) {
  const id = useId();
  const button = cn(
    "flex h-11 w-11 items-center justify-center rounded-lg border border-ink/15 bg-white text-ink transition-colors hover:border-ink/25 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40",
    FOCUS,
  );
  const n = Number(value);
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {MARGIN.clients.label}
      </label>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          className={button}
          onClick={() => onStep(-1)}
          disabled={n <= LIMITS.clients.min}
          aria-label={MARGIN.clients.less}
        >
          <Minus aria-hidden className="h-4 w-4" />
        </button>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            INPUT,
            "w-16 px-2 text-center",
            error
              ? "border-destructive/60 focus-visible:ring-destructive/15"
              : "border-ink/15 hover:border-ink/25 focus-visible:border-cta focus-visible:ring-cta/15",
          )}
        />
        <button
          type="button"
          className={button}
          onClick={() => onStep(1)}
          disabled={n >= LIMITS.clients.max}
          aria-label={MARGIN.clients.more}
        >
          <Plus aria-hidden className="h-4 w-4" />
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 max-w-[12rem] text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function PlanSitePicker({ value, onChange }: { value: PlanSite; onChange: (v: PlanSite) => void }) {
  const name = useId();
  const hintId = `${name}-hint`;
  return (
    <div role="radiogroup" aria-labelledby={`${name}-label`} aria-describedby={hintId}>
      <p id={`${name}-label`} className="text-sm font-medium text-ink">
        {MARGIN.planSite.label}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg border border-ink/15 bg-surface/60 p-1">
        {MARGIN.planSite.options.map((o) => (
          <label key={o.value} className="relative block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span className="flex h-9 items-center justify-center rounded-md px-2 text-center text-[0.82rem] font-medium leading-tight text-muted-foreground transition-colors hover:text-ink peer-checked:bg-cta peer-checked:text-white peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-cta/40 peer-focus-visible:ring-offset-1">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      <p id={hintId} className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {MARGIN.planSite.hints[value]}
      </p>
    </div>
  );
}
