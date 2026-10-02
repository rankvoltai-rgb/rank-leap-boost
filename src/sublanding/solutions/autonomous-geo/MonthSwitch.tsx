import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIRST_WEEK, MONTH, MONTH_ROWS, type Mode, type MonthRow } from "./content";

/**
 * The page's one idea, drawn once: the same month for a sample company, as a
 * to-do list or as finished work. The rows never change, only who did them.
 *
 * Both versions of every line are in the markup, stacked in one grid cell, so
 * a row is as tall as its longer version and flipping never moves the layout.
 * The flip runs top to bottom (rows) and left to right (the day strip), and
 * every transition is dropped under prefers-reduced-motion.
 */

const MODES: Mode[] = ["homework", "done"];

/** Milliseconds between one row (or day tick) starting its flip and the next. */
const ROW_STEP = 28;
const TICK_STEP = 14;

export function MonthSwitch() {
  const [mode, setMode] = useState<Mode>("homework");
  const [all, setAll] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const listId = useId();

  const done = mode === "done";
  const rows = all ? MONTH_ROWS : MONTH_ROWS.slice(0, FIRST_WEEK);

  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-4">
        <header className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <SiteLabel />
          <div className="flex items-center justify-between gap-3">
            <span
              id={labelId}
              className="whitespace-nowrap text-xs font-medium text-muted-foreground"
            >
              {MONTH.switchLabel}
            </span>
            <ModeSwitch value={mode} onChange={setMode} labelledBy={labelId} />
          </div>
        </header>

        <Count done={done} />

        <div className="relative">
          <ol id={listId} className="divide-y divide-border">
            {rows.map((row, i) => (
              <Row key={row.day} row={row} done={done} index={i} />
            ))}
          </ol>
          {!all && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 sm:px-6">
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={all}
            aria-controls={listId}
            onClick={() => {
              setAll((v) => !v);
              // Collapsing pulls the button up past the reader; bring it back to
              // the middle of the screen, clear of the sticky navbar.
              if (all)
                requestAnimationFrame(() => toggleRef.current?.scrollIntoView({ block: "center" }));
            }}
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-ink transition-colors hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
          >
            {all ? MONTH.less : MONTH.more(MONTH_ROWS.length - FIRST_WEEK)}
            <ChevronDown
              aria-hidden
              className={cn(
                "h-4 w-4 transition-transform motion-reduce:transition-none",
                all && "rotate-180",
              )}
            />
          </button>
          <span className="text-xs text-muted-foreground">{MONTH.sample}</span>
        </div>
      </div>
      <figcaption className="mx-auto mt-5 max-w-2xl text-pretty text-center text-sm leading-relaxed text-muted-foreground">
        {MONTH.caption}
      </figcaption>
    </figure>
  );
}

/* ---------- Header ---------- */

function SiteLabel() {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface font-display text-sm font-semibold text-ink"
      >
        {MONTH.initial}
      </span>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-ink">{MONTH.site}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{MONTH.period}</p>
      </div>
    </div>
  );
}

/** Two options, one selected: a radio group, with arrow keys between them. */
function ModeSwitch({
  value,
  onChange,
  labelledBy,
}: {
  value: Mode;
  onChange: (m: Mode) => void;
  labelledBy: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const next: Mode =
      e.key === "Home"
        ? "homework"
        : e.key === "End"
          ? "done"
          : value === "homework"
            ? "done"
            : "homework";
    onChange(next);
    refs.current[MODES.indexOf(next)]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      onKeyDown={onKeyDown}
      className="flex shrink-0 rounded-full border border-border bg-surface p-1"
    >
      {MODES.map((m, i) => {
        const on = value === m;
        return (
          <button
            key={m}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(m)}
            className={cn(
              "relative h-8 rounded-full px-4 text-sm font-semibold transition-colors sm:px-5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              on ? "text-white" : "text-muted-foreground hover:text-ink",
            )}
          >
            {on && (
              <motion.span
                layoutId="autonomous-geo-mode"
                aria-hidden
                className="absolute inset-0 rounded-full bg-cta shadow-1"
                transition={{ type: "spring", stiffness: 520, damping: 42 }}
              />
            )}
            <span className="relative">{MONTH.modes[m]}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- The count and the day strip ---------- */

function Count({ done }: { done: boolean }) {
  const now = done ? MONTH.count.done : MONTH.count.homework;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 border-b border-border px-4 py-5 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:items-center sm:gap-10 sm:px-6 sm:py-6">
      <div>
        <p className="flex items-baseline gap-2.5">
          <span className="font-display text-[2.5rem] font-semibold leading-none tracking-tight text-ink tabular-nums">
            {MONTH_ROWS.length}
          </span>
          <Swap
            done={done}
            delay={0}
            className="text-sm font-semibold text-ink"
            homework={MONTH.count.homework.label}
            finished={MONTH.count.done.label}
          />
        </p>
        <Swap
          done={done}
          delay={0}
          className="mt-1.5 text-xs text-muted-foreground"
          homework={MONTH.count.homework.sub}
          finished={MONTH.count.done.sub}
        />
        <span className="sr-only" aria-live="polite">
          {`${MONTH_ROWS.length} ${now.label}, ${now.sub}.`}
        </span>
      </div>
      <Ticks done={done} />
    </div>
  );
}

function Ticks({ done }: { done: boolean }) {
  const n = MONTH_ROWS.length;
  return (
    <div aria-hidden>
      <div className="flex h-8 gap-[3px] sm:gap-1">
        {MONTH_ROWS.map((r, i) => (
          <span
            key={r.day}
            className={cn(
              "flex-1 rounded-[3px] border transition-colors duration-200 motion-reduce:transition-none",
              done ? "border-cta bg-cta" : "border-border bg-surface",
            )}
            style={{ transitionDelay: `${(done ? i : n - 1 - i) * TICK_STEP}ms` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[0.68rem] tabular-nums text-muted-foreground">
        <span>{`${MONTH.month} 1`}</span>
        <span>{`${MONTH.month} ${n}`}</span>
      </div>
    </div>
  );
}

/* ---------- Rows ---------- */

function Row({ row, done, index }: { row: MonthRow; done: boolean; index: number }) {
  const delay = index * ROW_STEP;
  return (
    <li className="grid grid-cols-[3.1rem_1.125rem_minmax(0,1fr)] gap-x-3 px-4 py-3.5 sm:grid-cols-[3.6rem_1.125rem_minmax(0,1fr)_7.5rem] sm:items-center sm:gap-x-4 sm:px-6">
      <span className="font-mono text-[0.72rem] leading-5 text-muted-foreground tabular-nums">
        {`${MONTH.month} ${String(row.day).padStart(2, "0")}`}
      </span>
      <Box done={done} delay={delay} />
      <Swap
        done={done}
        delay={delay}
        className="text-sm leading-5"
        homework={
          <>
            <span className="mr-2 inline-block rounded-[5px] border border-border bg-surface px-1.5 align-[1px] text-[0.68rem] font-medium leading-[1.05rem] text-muted-foreground">
              {MONTH.sources[row.source]}
            </span>
            <span className="text-ink/75">{row.task}</span>
          </>
        }
        finished={<span className="font-medium text-ink">{row.title}</span>}
      />
      <Swap
        done={done}
        delay={delay}
        className="col-start-3 mt-1.5 text-xs leading-5 sm:col-start-auto sm:mt-0 sm:text-right"
        homework={<span className="text-muted-foreground">{MONTH.owner.homework}</span>}
        finished={<span className="font-semibold text-cta">{MONTH.owner.done}</span>}
      />
    </li>
  );
}

/** A checkbox that gets ticked: empty for homework, filled blue when done. */
function Box({ done, delay }: { done: boolean; delay: number }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-px flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-[5px] border transition-colors duration-300 motion-reduce:transition-none sm:mt-0",
        done ? "border-cta bg-cta" : "border-muted-foreground/35 bg-card",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Check
        strokeWidth={3}
        className={cn(
          "h-3 w-3 text-white transition duration-300 motion-reduce:transition-none",
          done ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
        style={{ transitionDelay: `${delay}ms` }}
      />
    </span>
  );
}

/** Both versions of a line in one grid cell; the inactive one fades out of the way. */
function Swap({
  done,
  delay,
  homework,
  finished,
  className,
}: {
  done: boolean;
  delay: number;
  homework: ReactNode;
  finished: ReactNode;
  className?: string;
}) {
  const layer = "[grid-area:1/1] transition duration-300 ease-out motion-reduce:transition-none";
  return (
    <span className={cn("grid", className)}>
      <span
        aria-hidden={done}
        className={cn(layer, done ? "pointer-events-none -translate-y-1 opacity-0" : "opacity-100")}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {homework}
      </span>
      <span
        aria-hidden={!done}
        className={cn(layer, done ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0")}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {finished}
      </span>
    </span>
  );
}
