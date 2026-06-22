import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "rounded-2xl border border-border bg-card shadow-elevation",
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-elevation-lg",
        className,
      )}
    >
      {children}
    </div>
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
      {emphasis && (
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-volt to-transparent" />
      )}
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
      "bg-ink text-background shadow-sm hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-md active:translate-y-0",
    ghost: "border border-border bg-card text-ink hover:bg-secondary",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
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