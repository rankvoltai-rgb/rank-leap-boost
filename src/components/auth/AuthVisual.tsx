import { motion, type Variants } from "motion/react";
import { useEffect, useState, type ReactElement } from "react";
import { Quote } from "lucide-react";
import rankvoltMark from "@/assets/rankvolt-mark.png.asset.json";

/* ---------- AI engine brand marks (bespoke SVG, not lucide) ---------- */
function ChatGPTLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6 6 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A6 6 0 0 0 19.02 19.8a5.98 5.98 0 0 0 4-2.9 6.05 6.05 0 0 0-.74-7.08Zm-9.02 12.6a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.78.78 0 0 0 .4-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.5 4.5ZM3.6 18.1a4.47 4.47 0 0 1-.54-3.01l.14.08 4.78 2.76c.24.14.54.14.78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06l-4.83 2.79a4.5 4.5 0 0 1-6.14-1.64ZM2.34 7.9a4.48 4.48 0 0 1 2.34-1.97v5.68c0 .28.15.54.39.68l5.82 3.36-2.02 1.17a.07.07 0 0 1-.07 0l-4.83-2.8A4.5 4.5 0 0 1 2.34 7.9Zm16.6 3.86-5.84-3.38 2.02-1.16a.07.07 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.12v-5.69a.78.78 0 0 0-.4-.68Zm2.01-3.02-.14-.09-4.77-2.78a.78.78 0 0 0-.79 0L9.42 9.24V6.91a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66ZM8.32 12.87 6.3 11.7a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.78 2.76a.78.78 0 0 0-.4.68v6.73Zm1.1-2.37L12 9.01l2.6 1.5v3l-2.6 1.5-2.6-1.5v-3Z" />
    </svg>
  );
}
function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0c.34 6.27 5.73 11.66 12 12-6.27.34-11.66 5.73-12 12-.34-6.27-5.73-11.66-12-12C6.27 11.66 11.66 6.27 12 0Z" />
    </svg>
  );
}
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.42Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.92a6 6 0 0 1 0-3.84V7.5H3.07a10 10 0 0 0 0 9l3.34-2.58Z" />
      <path fill="#EA4335" d="M12 5.96c1.47 0 2.78.5 3.81 1.49l2.85-2.85C16.95 2.99 14.7 2 12 2A10 10 0 0 0 3.07 7.5l3.34 2.58C7.2 7.72 9.4 5.96 12 5.96Z" />
    </svg>
  );
}
function PerplexityLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 3v18M12 7.5 5 4v8.5L12 16l7-3.5V4l-7 3.5ZM5 12.5V20l7-4 7 4v-7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClaudeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.2c.5 2.9 1.3 4.7 2.4 6 1.2 1.1 3 2 6 2.5-2.9.5-4.7 1.3-6 2.4-1.1 1.2-2 3-2.5 6-.5-2.9-1.3-4.7-2.4-6-1.2-1.1-3-2-6-2.5 2.9-.5 4.7-1.3 6-2.4 1.1-1.2 2-3 2.5-6Z" />
    </svg>
  );
}
function GrokLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4 20 14.5 9.5 9 4h3.2l4.3 4.3-2.1 2.1L20 4h-3.2l-2.6 2.6L11.9 4H4l6.4 6.4L4 16.8V20Zm14-9.6L11.4 17H8.2l6.6-6.6h3.2Z" />
    </svg>
  );
}

type Engine = {
  name: string;
  Logo: (props: { className?: string }) => ReactElement;
  color: string;
  brandTint?: boolean;
};

const ENGINES: Engine[] = [
  { name: "ChatGPT", Logo: ChatGPTLogo, color: "#10a37f" },
  { name: "Gemini", Logo: GeminiLogo, color: "#4285f4" },
  { name: "Google", Logo: GoogleLogo, color: "#ffffff", brandTint: true },
  { name: "Perplexity", Logo: PerplexityLogo, color: "#20b8cd" },
  { name: "Claude", Logo: ClaudeLogo, color: "#d97757" },
  { name: "Grok", Logo: GrokLogo, color: "#1a1a1a" },
];

/* node positions on a circle (viewBox-relative %), starting at top, clockwise */
const RADIUS = 39;
const NODES = ENGINES.map((engine, i) => {
  const angle = (-90 + i * (360 / ENGINES.length)) * (Math.PI / 180);
  return {
    ...engine,
    x: 50 + RADIUS * Math.cos(angle),
    y: 50 + RADIUS * Math.sin(angle),
  };
});

const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.15 + i * 0.12,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  }),
};

/* ---------- Orbital "AI traffic" core ---------- */
function TrafficOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      {/* moving traffic beams (SVG) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <radialGradient id="beam" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--volt)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--volt)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {NODES.map((node, i) => (
          <g key={node.name}>
            <line
              x1={node.x}
              y1={node.y}
              x2="50"
              y2="50"
              stroke="color-mix(in oklab, var(--volt) 30%, var(--border))"
              strokeWidth="0.45"
              strokeDasharray="1.4 2.2"
            />
            {/* traffic packet flowing inward */}
            <motion.circle
              r="1.4"
              fill="url(#beam)"
              initial={{ cx: node.x, cy: node.y, opacity: 0 }}
              animate={{
                cx: [node.x, 50],
                cy: [node.y, 50],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.2,
                delay: i * 0.35,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: "easeIn",
              }}
            />
          </g>
        ))}
      </svg>

      {/* decorative rotating rings */}
      <motion.span
        className="absolute inset-[8%] rounded-full border border-dashed border-border/80"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="absolute inset-[22%] rounded-full border border-border/50"
        animate={{ rotate: -360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      />

      {/* engine nodes */}
      {NODES.map((node, i) => {
        const Logo = node.Logo;
        const isGoogle = node.name === "Google";
        return (
          <motion.div
            key={node.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.4 + i * 0.1 },
              scale: { duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] },
              y: { duration: 3.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card ring-1 ring-ink/[0.06]"
              style={{
                boxShadow: `0 10px 24px -14px ${node.color}, 0 4px 12px -8px rgba(15,23,42,0.25)`,
                color: isGoogle ? undefined : node.color,
              }}
              title={node.name}
            >
              <Logo className="h-6 w-6" />
              <span className="sr-only">{node.name}</span>
            </div>
          </motion.div>
        );
      })}

      {/* center: your brand */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <span
          className="absolute -inset-3 -z-10 rounded-[2rem] opacity-40 blur-xl"
          style={{ background: "radial-gradient(circle, var(--volt), transparent 70%)" }}
        />
        <span
          className="absolute inset-0 -z-10 animate-ping rounded-3xl opacity-15"
          style={{ background: "var(--volt)" }}
        />
        <div
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-3xl bg-card ring-1 ring-ink/[0.06]"
          style={{ boxShadow: "0 0 0 6px color-mix(in oklab, var(--volt) 14%, transparent), 0 18px 40px -16px rgba(15,23,42,0.4)" }}
        >
          <img src={rankvoltMark.url} alt="Rankvolt" className="h-8 w-8 object-contain" />
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            You
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function AuthVisual() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % ENGINES.length), 2400);
    return () => clearInterval(id);
  }, []);

  const active = ENGINES[tick];

  return (
    <div className="relative mt-8 space-y-5">
      {/* Orbit hero */}
      <motion.div
        custom={0}
        variants={reveal}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--volt)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--volt)" }} />
            </span>
            AI traffic, flowing to you
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
            Live
          </span>
        </div>

        <TrafficOrbit />

        {/* rotating "recommended by" line */}
        <div className="mt-2 flex h-5 items-center justify-center gap-2 text-xs text-muted-foreground">
          Recommended by
          <motion.span
            key={active.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-semibold text-ink"
          >
            {active.name}
          </motion.span>
        </div>
      </motion.div>

      {/* Answer card */}
      <motion.div
        custom={1}
        variants={reveal}
        initial="hidden"
        animate="show"
        className="rounded-2xl border border-border bg-card p-4 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--volt)", color: "white" }}
          >
            <Quote className="h-3.5 w-3.5" />
          </span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            "The best option is <span className="font-semibold text-ink">your brand</span> — it's
            widely cited as the most reliable choice."
          </p>
        </div>
      </motion.div>
    </div>
  );
}
