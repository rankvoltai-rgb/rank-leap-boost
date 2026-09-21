import { cn } from "@/lib/utils";

/**
 * Rankbox icon system — bespoke, geometric line marks engineered for the
 * AI-search / GEO product. 24px grid with a 2px safe margin, rounded joins.
 *
 * Strokes are non-scaling: every icon draws a 1.5px line whether it renders at
 * 12px or 24px, so small icons stay crisp instead of thinning to a grey hairline.
 *
 * Where a glyph carries the brand "charge" cue it is a solid node (a filled dot)
 * rather than a tiny bolt or spark — a dot stays legible at 16px, detail doesn't.
 */

export interface IconProps {
  className?: string;
}

function Svg({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5 [&_*]:[vector-effect:non-scaling-stroke]", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** The solid charge node shared across the set. */
function Node({ cx, cy, r = 1.5 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;
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

// Overview — an oscilloscope pulse ending in a live node.
export function PulseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M2.5 12h3.25L8.5 5.5l4 13 2.75-6.5h2" />
      <Node cx={20} cy={12} r={1.75} />
    </Svg>
  );
}

// Articles — a folded sheet, its last line still being written.
export function ArticleIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v3.5A1.5 1.5 0 0 0 15.5 8H19" />
      <path d="M8.75 12.5h6.5M8.75 16.5h3" />
      <Node cx={15} cy={16.5} r={1.25} />
    </Svg>
  );
}

// Backlinks — two links of a chain, charged where they meet.
export function LinkIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M10.5 13.5a3.75 3.75 0 0 0 5.3 0l2.7-2.7a3.75 3.75 0 0 0-5.3-5.3l-1.2 1.2" />
      <path d="M13.5 10.5a3.75 3.75 0 0 0-5.3 0l-2.7 2.7a3.75 3.75 0 0 0 5.3 5.3l1.2-1.2" />
      <Node cx={12} cy={12} r={1.25} />
    </Svg>
  );
}

// Reddit — a conversation with one reply charged: the thread you joined.
export function ThreadIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M20.5 11.5a7.5 7.5 0 0 1-11.2 6.5L4 19.5l1.4-4.6A7.5 7.5 0 1 1 20.5 11.5Z" />
      <path d="M9 10h6M9 13.5h3" />
      <Node cx={16} cy={13.5} r={1.25} />
    </Svg>
  );
}

// Calendar — a schedule with one day charged.
export function CalendarIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <Node cx={15.5} cy={15.25} />
    </Svg>
  );
}

// Rank — a radar sweep: open range rings (so it never reads as the closed
// Target rings) and a blip on the beam where you're cited.
export function RadarIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 7a5 5 0 1 0 5 5" />
      <path d="M12 12 18.36 5.64" />
      <Node cx={12} cy={12} r={1.25} />
      <Node cx={18.36} cy={5.64} r={1.75} />
    </Svg>
  );
}

// Integrations — a plug: connect a site and power flows in.
export function ConnectIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M9 2.5V7M15 2.5V7" />
      <path d="M6.5 7h11v3.5a5.5 5.5 0 0 1-11 0Z" />
      <path d="M12 16v5.5" />
    </Svg>
  );
}

/* ── Metric / signal glyphs ─────────────────────────────────────── */

// Trajectory / trend — a charted rise with a launch arrow.
export function TrendIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M15 7h6v6" />
    </Svg>
  );
}

// Intent — a target with a charged bullseye.
export function TargetIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <Node cx={12} cy={12} />
    </Svg>
  );
}

// Insights — bars rising to a charged peak.
export function ChartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 20v-6.5M9.5 20v-11M14.5 20v-5M19.5 20v-9.5" />
      <Node cx={19.5} cy={5.25} />
    </Svg>
  );
}

/* ── Actions / system ───────────────────────────────────────────── */

export function AddIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </Svg>
  );
}

export function RemoveIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 6.5h16M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5" />
      <path d="m6 6.5.85 12.1a2 2 0 0 0 2 1.9h6.3a2 2 0 0 0 2-1.9L18 6.5" />
      <path d="M10 10.5v6M14 10.5v6" />
    </Svg>
  );
}

// Autopilot — the volt mark cycling on its own.
export function AutopilotIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M13 6.5 8.25 13H11.5l-1 4.5 4.75-6.5H12Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

// Upgrade — a rocket climbing at 45°.
export function RocketIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g transform="translate(-0.5 0.4) rotate(45 12 12)">
        <path d="M12 2.5c2.9 1.9 4.25 5.1 4.25 8.75V16h-8.5v-4.75C7.75 7.6 9.1 4.4 12 2.5Z" />
        <path d="M7.75 11.5 5.25 14v3.75l2.5-1.75M16.25 11.5l2.5 2.5v3.75L16.25 16" />
        <circle cx="12" cy="9" r="1.75" />
        <path d="M10.5 19v1.5M13.5 19v1.5" />
      </g>
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
      <path d="M12 15.5V4M7.5 8.5 12 4l4.5 4.5" />
      <path d="M4 14.5v3A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5v-3" />
    </Svg>
  );
}

export function CardIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.5h19M6.5 15h3" />
    </Svg>
  );
}

// Settings — control sliders, lighter than a literal gear.
export function ControlsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 8H13M17.5 8h3M3.5 16h3M11 16h9.5" />
      <circle cx="15.25" cy="8" r="2.25" />
      <circle cx="8.75" cy="16" r="2.25" />
    </Svg>
  );
}

// Sign out — a door with an exiting arrow.
export function SignOutIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M10 3.5H6.5a2.5 2.5 0 0 0-2.5 2.5v12a2.5 2.5 0 0 0 2.5 2.5H10" />
      <path d="M15.5 7.5 20 12l-4.5 4.5M20 12H9.5" />
    </Svg>
  );
}
