/**
 * The workbench: the pieces every free tool is built from.
 *
 * A tool is an input pane on the left and a result pane on the right (stacked
 * on a phone, result pinned on a desktop). Inputs are plain form controls;
 * results are code panes with copy/download, score rings, check lists and
 * meters. Keep tools to these pieces so the whole set reads as one product.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Check, CheckCircle2, Copy, Download, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================================================================== */
/* Layout                                                              */
/* ================================================================== */

/**
 * Two panes. `sticky` pins the result while a long form scrolls; turn it off
 * for tools whose result is longer than the form.
 */
export function Workbench({
  input,
  output,
  sticky = true,
  ratio = "even",
}: {
  input: ReactNode;
  output: ReactNode;
  sticky?: boolean;
  ratio?: "even" | "wide-output" | "wide-input";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 lg:gap-8",
        ratio === "even" && "lg:grid-cols-2",
        ratio === "wide-output" && "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]",
        ratio === "wide-input" && "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]",
      )}
    >
      <div className="min-w-0 space-y-5">{input}</div>
      <div className={cn("min-w-0 space-y-5", sticky && "lg:sticky lg:top-24 lg:self-start")}>
        {output}
      </div>
    </div>
  );
}

/** Single-column tool (AI tools whose form is one line and the result is long). */
export function Stack({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

/** A titled group of controls or results. */
export function Pane({
  title,
  description,
  actions,
  children,
  className,
  flush = false,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** No inner padding — for tables and lists that run edge to edge. */
  flush?: boolean;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card shadow-1", className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            {title && (
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-[0.82rem] leading-snug text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn(!flush && "space-y-5 p-5")}>{children}</div>
    </section>
  );
}

/* ================================================================== */
/* Form controls                                                       */
/* ================================================================== */

export function Field({
  label,
  hint,
  required,
  children,
  error,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[0.85rem] font-semibold text-ink">
          {label}
          {required && <span className="ml-1 text-volt">*</span>}
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1.5 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

export const inputBase =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-ink shadow-1 outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/60 focus:border-volt/60 focus:ring-2 focus:ring-volt/20 disabled:opacity-60";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function TextArea({
  mono = false,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { mono?: boolean }) {
  return (
    <textarea
      {...props}
      className={cn(
        inputBase,
        "min-h-28 resize-y leading-relaxed",
        mono && "font-mono text-[0.8rem]",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select {...props} className={cn(inputBase, "appearance-none pr-9", props.className)} />
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      >
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

/** Row with a switch on the right. */
export function Toggle({
  label,
  description,
  checked,
  onChange,
  badge,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  badge?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt"
    >
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-medium text-ink">
          <span className="truncate">{label}</span>
          {badge}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-ink" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

/** A small set of mutually exclusive options. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  label?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex max-w-full overflow-x-auto rounded-xl border border-border bg-surface p-1 [scrollbar-width:none]"
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "shrink-0 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt",
              size === "md" ? "px-3.5 py-1.5 text-[0.82rem]" : "px-2.5 py-1 text-xs",
              on ? "bg-card text-ink shadow-1" : "text-muted-foreground hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Named starting points for a form. */
export function Presets<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | null;
  onChange: (v: T) => void;
  options: { value: T; label: string; hint?: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            title={o.hint}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-[0.8rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt",
              on
                ? "border-ink bg-ink text-background"
                : "border-border bg-card text-ink/75 hover:border-ink/25 hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/* Buttons                                                             */
/* ================================================================== */

export function RunButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm",
        props.className,
      )}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/40 border-t-background" />
      )}
      {children}
    </button>
  );
}

export function GhostButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[0.78rem] font-semibold text-ink/75 transition-colors hover:border-ink/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt disabled:opacity-50",
        props.className,
      )}
    >
      {children}
    </button>
  );
}

/* ================================================================== */
/* Copy / download                                                     */
/* ================================================================== */

export function useCopied(): [string | null, (key: string, text: string) => void] {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(key);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(null), 1800);
      },
      () => {
        /* clipboard blocked: nothing to confirm */
      },
    );
  };
  return [copied, copy];
}

export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, copy] = useCopied();
  return (
    <GhostButton onClick={() => copy("v", value)} disabled={!value} className={className}>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </GhostButton>
  );
}

export function downloadText(value: string, filename: string, type = "text/plain") {
  const blob = new Blob([value], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * A code result. Shows the file name, size and line count, and offers Copy and
 * (when a filename is given) Download.
 */
export function OutputBox({
  value,
  filename,
  language = "text",
  placeholder = "Fill in the form and the result appears here.",
  lineNumbers = false,
  maxHeight = 520,
  mime,
}: {
  value: string;
  filename?: string;
  language?: string;
  placeholder?: string;
  lineNumbers?: boolean;
  maxHeight?: number;
  mime?: string;
}) {
  const lines = value ? value.split("\n") : [];
  const bytes = new Blob([value]).size;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-1">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface/60 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex gap-1" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </span>
          <span className="truncate font-mono text-[0.72rem] font-semibold text-ink/80">
            {filename ?? language}
          </span>
          {value && (
            <span className="hidden shrink-0 text-[0.7rem] text-muted-foreground sm:inline">
              {lines.length} {lines.length === 1 ? "line" : "lines"} · {formatBytes(bytes)}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <CopyButton value={value} />
          {filename && (
            <GhostButton onClick={() => downloadText(value, filename, mime)} disabled={!value}>
              <Download className="h-3.5 w-3.5" />
              Download
            </GhostButton>
          )}
        </div>
      </div>
      {value ? (
        <pre
          className="overflow-auto px-4 py-3.5 font-mono text-[0.8rem] leading-relaxed text-ink"
          style={{ maxHeight }}
        >
          {lineNumbers ? (
            <code className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4">
              {lines.map((l, i) => (
                <span key={i} className="contents">
                  <span className="select-none text-right text-muted-foreground/50">{i + 1}</span>
                  <span className="whitespace-pre">{l || " "}</span>
                </span>
              ))}
            </code>
          ) : (
            <code>{value}</code>
          )}
        </pre>
      ) : (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">{placeholder}</p>
      )}
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

/* ================================================================== */
/* Results                                                             */
/* ================================================================== */

export type Status = "pass" | "warn" | "fail" | "info";

const STATUS: Record<Status, { Icon: typeof Check; className: string; label: string }> = {
  pass: { Icon: CheckCircle2, className: "text-success", label: "Pass" },
  warn: { Icon: AlertTriangle, className: "text-warning", label: "Warning" },
  fail: { Icon: XCircle, className: "text-destructive", label: "Fail" },
  info: { Icon: Info, className: "text-info", label: "Note" },
};

export function StatusIcon({ status, className }: { status: Status; className?: string }) {
  const { Icon, className: color, label } = STATUS[status];
  return <Icon className={cn("h-[18px] w-[18px] shrink-0", color, className)} aria-label={label} />;
}

export interface CheckItem {
  id: string;
  status: Status;
  label: string;
  detail?: ReactNode;
  /** The fix, shown under the detail when the check didn't pass. */
  fix?: ReactNode;
}

/** A list of pass/warn/fail rows, failures first. */
export function CheckList({ items, sort = true }: { items: CheckItem[]; sort?: boolean }) {
  const order: Record<Status, number> = { fail: 0, warn: 1, info: 2, pass: 3 };
  const rows = sort ? [...items].sort((a, b) => order[a.status] - order[b.status]) : items;
  return (
    <ul className="divide-y divide-border">
      {rows.map((c) => (
        <li key={c.id} className="flex gap-3 px-5 py-3.5">
          <StatusIcon status={c.status} className="mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{c.label}</p>
            {c.detail && (
              <p className="mt-0.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                {c.detail}
              </p>
            )}
            {c.fix && c.status !== "pass" && (
              <p className="mt-1.5 rounded-lg bg-surface px-3 py-2 text-[0.82rem] leading-relaxed text-ink/80">
                <span className="font-semibold text-ink">Fix: </span>
                {c.fix}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A 0–100 score in a ring. */
export function ScoreRing({
  score,
  label,
  size = 112,
  caption,
}: {
  score: number;
  label?: string;
  size?: number;
  caption?: string;
}) {
  const id = useId();
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const r = 44;
  const c = 2 * Math.PI * r;
  const tone = clamped >= 80 ? "text-success" : clamped >= 50 ? "text-warning" : "text-destructive";
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-labelledby={id}>
          <title id={id}>
            {label ?? "Score"}: {clamped} out of 100
          </title>
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-border"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * clamped) / 100}
            className={cn("transition-[stroke-dashoffset] duration-700 ease-out", tone)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[1.75rem] font-bold leading-none tracking-tight text-ink">
            {clamped}
          </span>
          <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            / 100
          </span>
        </div>
      </div>
      {(label || caption) && (
        <div className="min-w-0">
          {label && (
            <p className="font-display text-lg font-semibold tracking-tight text-ink">{label}</p>
          )}
          {caption && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{caption}</p>
          )}
        </div>
      )}
    </div>
  );
}

/** A horizontal gauge with a good range. */
export function Meter({
  label,
  value,
  max,
  min = 0,
  unit = "",
  format,
}: {
  label: string;
  value: number;
  max: number;
  /** Below this is "short". */
  min?: number;
  unit?: string;
  format?: (v: number) => string;
}) {
  const status: Status =
    value === 0 ? "info" : value < min ? "warn" : value > max ? "fail" : "pass";
  const note =
    status === "pass"
      ? "Good"
      : status === "info"
        ? "Empty"
        : status === "warn"
          ? `Aim for ${min}${unit}+`
          : `Over by ${format ? format(value - max) : value - max}${unit}`;
  const pct = Math.min(100, (value / max) * 100);
  const bar =
    status === "pass"
      ? "bg-success"
      : status === "info"
        ? "bg-border"
        : status === "warn"
          ? "bg-warning"
          : "bg-destructive";
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">{label}</span>
        <span
          className={cn(
            "font-medium tabular-nums",
            status === "pass"
              ? "text-success"
              : status === "fail"
                ? "text-destructive"
                : "text-muted-foreground",
          )}
        >
          {format ? format(value) : value}
          {unit} · {note}
        </span>
      </div>
      <div className="relative mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className={cn("h-full rounded-full transition-all", bar)}
          style={{ width: `${pct}%` }}
        />
        {min > 0 && (
          <span
            aria-hidden
            className="absolute top-0 h-full w-px bg-ink/30"
            style={{ left: `${(min / max) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}

/** A number with a label. */
export function Stat({ value, label, hint }: { value: ReactNode; label: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <p className="font-display text-2xl font-bold tracking-tight text-ink tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-[0.7rem] text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

export function StatGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  return (
    <div
      className={cn(
        "grid gap-3",
        cols === 2 && "grid-cols-2",
        cols === 3 && "grid-cols-3",
        cols === 4 && "grid-cols-2 sm:grid-cols-4",
      )}
    >
      {children}
    </div>
  );
}

export function Chips({ items, onCopy }: { items: string[]; onCopy?: boolean }) {
  const [copied, copy] = useCopied();
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) =>
        onCopy ? (
          <button
            key={item}
            type="button"
            onClick={() => copy(item, item)}
            className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-ink/80 transition-colors hover:border-ink/25 hover:text-ink"
          >
            {copied === item ? "Copied" : item}
          </button>
        ) : (
          <span
            key={item}
            className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-ink/80"
          >
            {item}
          </span>
        ),
      )}
    </div>
  );
}

/** A copyable text result (one meta description, one headline). */
export function ResultRow({
  text,
  meta,
  index,
}: {
  text: string;
  meta?: ReactNode;
  index?: number;
}) {
  return (
    <li className="flex items-start gap-3 px-5 py-4">
      {index !== undefined && (
        <span className="mt-0.5 font-mono text-[0.72rem] font-semibold text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[0.95rem] leading-relaxed text-ink">{text}</p>
        {meta && <div className="mt-1.5 text-xs text-muted-foreground">{meta}</div>}
      </div>
      <CopyButton value={text} className="shrink-0" />
    </li>
  );
}

export function EmptyState({
  title,
  body,
  icon,
}: {
  title: string;
  body?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {body && (
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      )}
    </div>
  );
}

/** Skeleton shown while an AI tool is generating. */
export function Thinking({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5" aria-busy>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 animate-pulse rounded bg-border/70"
          style={{ width: `${[92, 78, 85, 60, 70][i % 5]}%` }}
        />
      ))}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
    >
      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}

export function readAiError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/402|credit/i.test(message)) {
    return "This free AI tool is temporarily out of credits. Please try again later.";
  }
  if (/429|rate|too quickly/i.test(message)) {
    return "Too many requests right now. Please wait a moment and try again.";
  }
  return message || "Something went wrong. Please try again.";
}

/* ================================================================== */
/* Small helpers                                                       */
/* ================================================================== */

/** Splits a textarea into trimmed, non-empty lines. */
export function lines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Adds https:// when the user typed a bare domain. */
export function withScheme(url: string): string {
  const t = url.trim();
  if (!t) return "";
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`;
}

let measureCanvas: HTMLCanvasElement | null = null;

/** Width of `text` in pixels for a font, measured on a canvas. 0 on the server. */
export function textWidth(text: string, font: string): number {
  if (typeof document === "undefined") return 0;
  measureCanvas ??= document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
}

/** Truncates `text` at `maxPx` with an ellipsis. */
export function truncateToWidth(
  text: string,
  font: string,
  maxPx: number,
): { text: string; cut: boolean } {
  if (!text || textWidth(text, font) <= maxPx) return { text, cut: false };
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (textWidth(`${text.slice(0, mid)} …`, font) <= maxPx) lo = mid;
    else hi = mid - 1;
  }
  return { text: `${text.slice(0, lo).trimEnd()} …`, cut: true };
}
