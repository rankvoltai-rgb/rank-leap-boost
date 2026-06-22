import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";
import {
  FileText,
  Sparkles,
  TrendingUp,
  Search,
  Globe,
  Bot,
  CheckCircle2,
} from "lucide-react";

/* ---------- Animated number counter ---------- */
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  useEffect(() => {
    const controls = animate(count, to, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [count, to]);
  return <motion.span>{rounded}</motion.span>;
}

/* ---------- Live ranking chart ---------- */
function RankChart() {
  const points = [38, 33, 30, 24, 19, 14, 9, 5, 3, 1];
  const w = 240;
  const h = 88;
  const max = 40;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = (p / max) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[88px] w-full overflow-visible">
      <defs>
        <linearGradient id="rankFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#rankFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-background"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.circle
        cx={w}
        cy={(points[points.length - 1] / max) * h}
        r="4"
        className="fill-background"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 1] }}
        transition={{ duration: 0.5, delay: 1.9 }}
      />
    </svg>
  );
}

const KEYWORDS = [
  "best crm software",
  "ai writing tools",
  "seo automation",
  "content marketing",
];

const PIPELINE = [
  { icon: Search, label: "Researching keywords", color: "text-sky-300" },
  { icon: Sparkles, label: "Writing article", color: "text-violet-300" },
  { icon: Globe, label: "Publishing to CMS", color: "text-emerald-300" },
  { icon: Bot, label: "Indexed by AI search", color: "text-amber-300" },
];

export function AuthVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % PIPELINE.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mt-10 space-y-4">
      {/* Live agent pipeline card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="rounded-2xl border border-background/10 bg-background/[0.04] p-5 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-background">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Agent working
          </span>
          <span className="text-xs text-background/50">live</span>
        </div>

        <div className="mt-4 space-y-2.5">
          {PIPELINE.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === active;
            const isDone = i < active;
            return (
              <div key={step.label} className="flex items-center gap-3">
                <motion.span
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.14)"
                      : "rgba(255,255,255,0.05)",
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <Icon className={`h-4 w-4 ${isActive ? step.color : "text-background/40"}`} />
                  )}
                </motion.span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm transition-colors ${
                      isActive ? "font-medium text-background" : "text-background/55"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <motion.div
                      layout
                      className="mt-1.5 h-1 overflow-hidden rounded-full bg-background/10"
                    >
                      <motion.div
                        key={active}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.7, ease: "linear" }}
                        className="h-full rounded-full bg-background/60"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-2xl border border-background/10 bg-background/[0.04] p-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-background/55">Organic traffic</span>
            <TrendingUp className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-background">
            <Counter to={12480} suffix="" />
          </p>
          <p className="mt-0.5 text-xs font-medium text-emerald-300">+38% this month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="rounded-2xl border border-background/10 bg-background/[0.04] p-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-background/55">Articles live</span>
            <FileText className="h-4 w-4 text-sky-300" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-background">
            <Counter to={146} />
          </p>
          <p className="mt-0.5 text-xs font-medium text-background/50">auto-published</p>
        </motion.div>
      </div>

      {/* Ranking chart card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="rounded-2xl border border-background/10 bg-background/[0.04] p-5 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-background">Avg. Google position</span>
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-300">
            <TrendingUp className="h-3.5 w-3.5" /> #1
          </span>
        </div>
        <div className="mt-3 text-background/70">
          <RankChart />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {KEYWORDS.map((k, i) => (
            <motion.span
              key={k}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              className="rounded-md border border-background/10 bg-background/5 px-2 py-1 text-[0.7rem] text-background/70"
            >
              {k}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
