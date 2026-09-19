/**
 * Building blocks for the feature-page product visuals.
 *
 * Every visual is a *sample*: the numbers are illustrative and each window is
 * labelled as such, the same rule the landing's Answer Monitor follows. The
 * brands are the site's fictional ones (Plannora and friends).
 *
 * SSR-safe: hooks start from a fixed first frame and only animate in effects,
 * so server and client markup agree. Reduced motion jumps to the final frame.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** True once the element has scrolled into view, so off-screen loops stay idle. */
export function useInView<T extends Element>(margin = "0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, margin]);
  return [ref, inView] as const;
}

/**
 * Steps 0 → length-1 every `ms`, then wraps. Reduced motion holds on
 * `restIndex` (the most telling frame) instead of cycling.
 */
export function useCycle(length: number, ms: number, restIndex = length - 1, run = true) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setI(restIndex);
      return;
    }
    const id = window.setInterval(() => setI((n) => (n + 1) % length), ms);
    return () => window.clearInterval(id);
  }, [length, ms, restIndex, run]);
  return i;
}

/** Counts from `from` to `to` once `run` is true. */
export function useCountUp(to: number, { from = 0, ms = 1400, run = true } = {}) {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setV(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, ms, run]);
  return v;
}

/**
 * Types `text` out, holds, clears, and repeats. Returns the visible slice and
 * whether it is still typing. Reduced motion shows the full text.
 */
export function useTypewriter(text: string, { speed = 22, hold = 2600, run = true } = {}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setN(text.length);
      return;
    }
    let alive = true;
    let id = 0;
    const loop = (i: number) => {
      if (!alive) return;
      setN(i);
      if (i < text.length) id = window.setTimeout(() => loop(i + 1), speed);
      else id = window.setTimeout(() => loop(0), hold);
    };
    loop(0);
    return () => {
      alive = false;
      window.clearTimeout(id);
    };
  }, [text, speed, hold, run]);
  return { typed: text.slice(0, n), typing: n < text.length };
}

/* ---------- Window chrome ---------- */

export function ProductWindow({
  title,
  icon: Icon,
  children,
  className,
  bodyClassName,
  badge = "Sample",
}: {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  badge?: string | null;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card text-ink shadow-elevation-lg ring-1 ring-ink/5",
        className,
      )}
    >
      <div className="relative flex items-center gap-2 border-b border-border bg-surface/70 px-4 py-2.5">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-border" />
          ))}
        </span>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[0.7rem] font-medium text-muted-foreground">
          {Icon && <Icon className="h-3.5 w-3.5 text-volt" />}
          {title}
        </span>
        {badge && (
          <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col", bodyClassName)}>{children}</div>
    </div>
  );
}

/* ---------- Small parts ---------- */

/** Tiny uppercase label, the Answer Monitor's section label. */
export function Label({
  children,
  right,
  className,
}: {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
    >
      <span>{children}</span>
      {right && <span className="normal-case tracking-normal">{right}</span>}
    </div>
  );
}

/** The inset panel benefit cards put their UI in. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface/60 p-3.5 sm:p-4", className)}>
      {children}
    </div>
  );
}

/** A white row inside a panel. */
export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg bg-card px-3 py-2 ring-1 ring-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Favicon-style lettermark for a (fictional) domain. */
export function Letter({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border border-border bg-white text-[0.6rem] font-semibold uppercase text-muted-foreground",
        className,
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

type Tone = "volt" | "success" | "warning" | "flame" | "muted";

const TONE_TEXT: Record<Tone, string> = {
  volt: "text-volt",
  success: "text-success",
  warning: "text-[oklch(0.62_0.15_70)]",
  flame: "text-flame",
  muted: "text-muted-foreground",
};

const TONE_BG: Record<Tone, string> = {
  volt: "bg-volt",
  success: "bg-success",
  warning: "bg-warning",
  flame: "bg-flame",
  muted: "bg-muted-foreground/40",
};

const TONE_SOFT: Record<Tone, string> = {
  volt: "bg-volt/10 text-volt ring-volt/25",
  success: "bg-success/10 text-success ring-success/25",
  warning: "bg-warning/15 text-[oklch(0.55_0.14_70)] ring-warning/30",
  flame: "bg-flame/10 text-flame ring-flame/25",
  muted: "bg-secondary text-muted-foreground ring-border",
};

/** Status chip: small, uppercase, tinted. */
export function Chip({
  tone = "muted",
  children,
  className,
  dot = false,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.06em] ring-1",
        TONE_SOFT[tone],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", TONE_BG[tone])} />}
      {children}
    </span>
  );
}

/** Horizontal meter, 0–100. */
export function Meter({
  value,
  tone = "volt",
  className,
}: {
  value: number;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-700 ease-out",
          TONE_BG[tone],
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/** Pulsing live dot. */
export function LiveDot({ tone = "success" }: { tone?: Tone }) {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-70",
          TONE_BG[tone],
        )}
      />
      <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", TONE_BG[tone])} />
    </span>
  );
}

/** Pass / fail tick. */
export function Tick({ ok, className }: { ok: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
        ok ? "bg-success/15 text-success" : "bg-flame/15 text-flame",
        className,
      )}
    >
      {ok ? (
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
      ) : (
        <X className="h-2.5 w-2.5" strokeWidth={3} />
      )}
    </span>
  );
}

/** Circular score gauge. */
export function Ring({
  value,
  label,
  size = 88,
  tone = "volt",
  className,
}: {
  value: number;
  label?: string;
  size?: number;
  tone?: Tone;
  className?: string;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          className={cn("transition-[stroke-dashoffset] duration-700 ease-out", {
            "stroke-volt": tone === "volt",
            "stroke-success": tone === "success",
            "stroke-warning": tone === "warning",
            "stroke-flame": tone === "flame",
          })}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-semibold leading-none tracking-tight text-ink tabular-nums"
          style={{ fontSize: Math.round(size * 0.27) }}
        >
          {value}
        </span>
        {label && size >= 64 && (
          <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export { TONE_TEXT };
export type { Tone };
