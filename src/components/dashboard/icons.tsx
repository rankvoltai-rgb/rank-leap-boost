import { cn } from "@/lib/utils";

/**
 * Rankvolt icon system — bespoke, geometric line marks engineered for the
 * AI-search / GEO product. Single 24px grid, 1.7 stroke, rounded joins, with
 * an optional "volt" accent node that ties the set to the brand.
 *
 * These intentionally avoid the generic lucide look: every glyph carries a
 * small charge/energy cue (a node, a spark, a beam) so the UI reads as a
 * living signal system rather than a stock dashboard.
 */

export interface IconProps {
  className?: string;
  /** Renders the brand accent node in the volt color instead of currentColor. */
  accent?: boolean;
}

function Svg({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/* ── Signature mark ─────────────────────────────────────────────── */

export function VoltMark({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M13.5 2.5 5 13.2a.6.6 0 0 0 .47.98H10l-1.3 7.1a.4.4 0 0 0 .72.3L19 10.9a.6.6 0 0 0-.48-.98H14l1.2-6.92a.4.4 0 0 0-.7-.5Z" />
    </Svg>
  );
}

/* ── Navigation ─────────────────────────────────────────────────── */

// Overview — an oscilloscope pulse, the heartbeat of the autopilot.
export function PulseIcon({ className, accent }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M2.5 12.5h3.2l2-5.4 3.2 10 2.3-7 1.6 2.4h4.7" />
      <circle
        cx="21"
        cy="12.5"
        r="1.4"
        className={accent ? "fill-volt stroke-volt" : "fill-current"}
        strokeWidth={0}
      />
    </Svg>
  );
}

// Articles — a sheet with a generative spark in the corner.
export function ArticleIcon({ className, accent }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8.5" />
      <path d="M8.5 12h7M8.5 16h4.5" />
      <path
        d="M18 2.2c.25 1.3.7 1.75 2 2-1.3.25-1.75.7-2 2-.25-1.3-.7-1.75-2-2 1.3-.25 1.75-.7 2-2Z"
        className={accent ? "fill-volt stroke-volt" : "fill-current/0"}
      />
    </Svg>
  );
}

// Calendar — schedule carrying a charge (the autopilot cadence).
export function CalendarIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
      <path d="M12.6 12.2 10 15.6h2.2l-.8 2.8 3.3-4h-2.4l.7-2.2-.4-.0Z" />
    </Svg>
  );
}

// Keyword Lab — a lens with a beam, scanning for gaps.
export function BeamIcon({ className, accent }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6.2" />
      <path d="m20 20-3.6-3.6" />
      <path
        d="M11 8.3c.2 1.3.8 1.9 2.1 2.1-1.3.2-1.9.8-2.1 2.1-.2-1.3-.8-1.9-2.1-2.1 1.3-.2 1.9-.8 2.1-2.1Z"
        className={accent ? "fill-volt stroke-volt" : ""}
      />
    </Svg>
  );
}

/* ── Metric / signal glyphs ─────────────────────────────────────── */

// Search demand — radiating signal waves from a source.
export function SignalIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="6" cy="18" r="1.6" className="fill-current" strokeWidth={0} />
      <path d="M5 13a8 8 0 0 1 6 6" />
      <path d="M5 8.5A12.5 12.5 0 0 1 16.5 20" />
    </Svg>
  );
}

// Trajectory / trend — a charted rise with a launch arrow.
export function TrendIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 16.5 8.5 11l3.4 3 6.6-7.2" />
      <path d="M14.5 6.5h4v4" />
      <circle cx="8.5" cy="11" r="1" className="fill-current" strokeWidth={0} />
      <circle cx="11.9" cy="14" r="1" className="fill-current" strokeWidth={0} />
    </Svg>
  );
}

// Intent — a precision target lock.
export function TargetIcon({ className, accent }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle
        cx="12"
        cy="12"
        r="1.1"
        className={accent ? "fill-volt stroke-volt" : "fill-current"}
        strokeWidth={0}
      />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </Svg>
  );
}

/* ── Actions / system ───────────────────────────────────────────── */

export function AddIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </Svg>
  );
}

export function RemoveIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 7h15M9.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M6.5 7l.9 12a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9l.9-12" />
      <path d="M10.5 11v6M13.5 11v6" />
    </Svg>
  );
}

// Autopilot — an orbiting system with a volt core.
export function AutopilotIcon({ className, accent }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 4.5a7.5 7.5 0 1 1-5.3 2.2" />
      <path d="M6.7 6.7 5 4.4M6.7 6.7l2.7-.4" />
      <path d="M12.6 9.3 10 12.7h2.2l-.8 2.7 3.2-3.9h-2.4l.8-2.2-.4-.0Z" className={accent ? "fill-volt stroke-volt" : ""} />
    </Svg>
  );
}

export function RocketIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M13.5 4.5C17 6 18 9.5 18 13l-3.2 2.4-3-3L14 9.2c-.2-3 .3-4.7-.5-4.7Z" />
      <path d="M14.8 4.6C11 4 7.8 5.4 5.5 8.7L8 11M9.2 13.8 11.5 16c3.3-2.3 4.7-5.5 4.1-9.3" />
      <path d="M7 16c-1.4.6-2 2-2 4 2 0 3.4-.6 4-2" />
    </Svg>
  );
}

export function FlameIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3c.5 3-2 4-3.3 6.2A5.5 5.5 0 1 0 18 13c0-2.4-1.3-3.7-2.6-5.2-.6 1-1.3 1.6-2 1.8C13.2 7 13 4.8 12 3Z" />
    </Svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </Svg>
  );
}

export function PublishIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 16V4.5M12 4.5 7.5 9M12 4.5 16.5 9" />
      <path d="M4.5 15v2.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15" />
    </Svg>
  );
}

export function CardIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 9.5h18M6.5 14.5h3" />
    </Svg>
  );
}

// Settings — control sliders, lighter than a literal gear.
export function ControlsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 8h9M17 8h3M4 16h3M11 16h9" />
      <circle cx="15" cy="8" r="2.1" />
      <circle cx="9" cy="16" r="2.1" />
    </Svg>
  );
}

// Rank — a radar sweep locating where you're cited.
export function RadarIcon({ className, accent }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M20 12a8 8 0 1 1-4.2-7" />
      <path d="M12 12 18 7" />
      <circle cx="12" cy="12" r="3.4" />
      <circle
        cx="18"
        cy="7"
        r="1.3"
        className={accent ? "fill-volt stroke-volt" : "fill-current"}
        strokeWidth={0}
      />
    </Svg>
  );
}

// Insights — charted bars rising with a spark above the peak.
export function ChartIcon({ className, accent }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 20V11M9 20V8M14 20v-5M19 20V5" />
      <circle
        cx="19"
        cy="3"
        r="1.3"
        className={accent ? "fill-volt stroke-volt" : "fill-current"}
        strokeWidth={0}
      />
    </Svg>
  );
}
