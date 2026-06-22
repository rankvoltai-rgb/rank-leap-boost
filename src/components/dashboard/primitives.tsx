import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";
import { ProgressRing } from "@/components/dashboard/rewards";

export function Panel({
  children,
  className,
  hover,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card",
        hover &&
          "transition-colors duration-200 hover:border-ink/15 hover:bg-secondary/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Pill-style segmented tabs with optional per-tab counts. */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1 rounded-xl border border-border bg-card p-1", className)}>
      {tabs.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              active ? "bg-ink text-background shadow-sm" : "text-muted-foreground hover:text-ink",
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.62rem] font-semibold tabular-nums",
                  active ? "bg-background/20 text-background" : "bg-secondary text-muted-foreground",
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** A friendly, on-brand empty state with optional icon and call to action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Panel className={cn("flex flex-col items-center gap-3 px-6 py-14 text-center", className)}>
      {icon && (
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-secondary text-muted-foreground">
          {icon}
        </span>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </Panel>
  );
}

/** Animated metric card with count-up value and optional progress ring. */
export function MetricCard({
  label,
  value,
  format,
  suffix,
  hint,
  emphasis,
  icon,
  accentValue,
  ring,
}: {
  label: string;
  value: number;
  format?: (n: number) => string;
  suffix?: string;
  hint?: ReactNode;
  emphasis?: boolean;
  icon?: ReactNode;
  accentValue?: boolean;
  ring?: { value: number; max: number };
}) {
  const pct = ring ? Math.round((ring.max > 0 ? ring.value / ring.max : 0) * 100) : 0;
  return (
    <Panel className="relative flex min-h-[128px] flex-col overflow-hidden p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
        {icon && (
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p
          className={cn(
            "font-semibold tracking-tight tabular-nums",
            accentValue ? "text-volt" : "text-ink",
            emphasis ? "text-4xl leading-none" : "text-3xl",
          )}
        >
          <CountUp value={value} format={format} suffix={suffix} />
        </p>
        {ring && (
          <ProgressRing value={ring.value} max={ring.max} size={52} stroke={5}>
            <span className="text-[0.68rem] font-semibold text-ink tabular-nums">{pct}%</span>
          </ProgressRing>
        )}
      </div>
      {hint && (
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
      )}
    </Panel>
  );
}

export function StatCard({
  label,
  value,
  hint,
  emphasis,
  media,
  icon,
}: {
  label: string;
  value?: ReactNode;
  hint?: string;
  emphasis?: boolean;
  media?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Panel
      className={cn(
        "flex min-h-[128px] flex-col p-5",
        emphasis && "relative overflow-hidden",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
        {icon && (
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
            {icon}
          </span>
        )}
      </div>
      {media ? (
        <div className="mt-3">{media}</div>
      ) : (
        <p
          className={cn(
            "mt-2 font-semibold tracking-tight text-ink tabular-nums",
            emphasis ? "text-4xl leading-none" : "text-2xl",
          )}
        >
          {value}
        </p>
      )}
      {hint && (
        <div className={cn("mt-auto flex items-center gap-2 pt-1", emphasis && "pt-2")}>
          {emphasis && <span className="h-1.5 w-1.5 rounded-full bg-success" />}
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
      )}
    </Panel>
  );
}

/**
 * Reference-style metric card: muted label with a soft icon top-right, a large
 * tabular figure, and a single delta / context line beneath. Flat and
 * border-led — no shadows or gradient accents.
 */
export function MetricStat({
  label,
  value,
  icon,
  delta,
  deltaTone = "success",
  hint,
  accent,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  delta?: ReactNode;
  deltaTone?: "success" | "danger" | "neutral";
  hint?: ReactNode;
  accent?: boolean;
}) {
  return (
    <Panel className="flex min-h-[124px] flex-col gap-3 p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
            {icon}
          </span>
        )}
      </div>
      <p
        className={cn(
          "text-[2rem] font-semibold leading-none tracking-tight tabular-nums",
          accent ? "text-volt" : "text-ink",
        )}
      >
        {value}
      </p>
      {(delta || hint) && (
        <p className="mt-auto text-xs text-muted-foreground">
          {delta && (
            <span
              className={cn(
                "font-semibold",
                deltaTone === "success" && "text-success",
                deltaTone === "danger" && "text-destructive",
                deltaTone === "neutral" && "text-ink",
              )}
            >
              {delta}{" "}
            </span>
          )}
          {hint}
        </p>
      )}
    </Panel>
  );
}

const PILL_TONES: Record<string, string> = {
  neutral: "border-border bg-secondary text-muted-foreground",
  ink: "border-transparent bg-ink text-background",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/15 text-ink",
  info: "border-info/20 bg-info/10 text-info",
  danger: "border-destructive/20 bg-destructive/10 text-destructive",
};

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof PILL_TONES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        PILL_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "solid",
  className,
  ...props
}: {
  children: ReactNode;
  variant?: "solid" | "ghost" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    solid:
      "bg-ink text-background hover:bg-ink/90",
    ghost: "border border-border bg-card text-ink hover:bg-secondary",
    danger:
      "border border-border bg-card text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-6">
      <div>
        <h1 className="text-[1.7rem] font-semibold tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}