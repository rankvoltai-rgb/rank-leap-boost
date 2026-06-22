import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";
import { Search, Sparkles, Globe, Bot, Check, ArrowUpRight } from "lucide-react";

/* ---------- Animated number counter ---------- */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v).toLocaleString()}${suffix}`);
  useEffect(() => {
    const controls = animate(count, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [count, to]);
  return <motion.span>{rounded}</motion.span>;
}

/* ---------- Ranking sparkline ---------- */
function Sparkline() {
  const points = [38, 33, 31, 24, 19, 14, 9, 5, 2, 1];
  const w = 132;
  const h = 40;
  const max = 40;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = (p / max) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-[132px] overflow-visible">
      <motion.path
        d={path}
        fill="none"
        stroke="var(--volt)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.9 }}
      />
      <motion.circle
        cx={w}
        cy={(points[points.length - 1] / max) * h}
        r="3.5"
        fill="var(--volt)"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ duration: 0.5, delay: 2.3 }}
      />
    </svg>
  );
}

const PIPELINE = [
  { icon: Search, label: "Researching keywords", sub: "1,240 opportunities found" },
  { icon: Sparkles, label: "Writing the article", sub: "SEO-optimized, on-brand" },
  { icon: Globe, label: "Publishing to your CMS", sub: "WordPress · Webflow · Ghost" },
  { icon: Bot, label: "Indexed by AI search", sub: "Cited by ChatGPT & Google" },
];

const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

export function AuthVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % PIPELINE.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mt-10 space-y-5">
      {/* Hero: live agent pipeline */}
      <motion.div
        custom={0}
        variants={reveal}
        initial="hidden"
        animate="show"
        className="rounded-2xl border border-background/10 bg-gradient-to-b from-background/[0.07] to-background/[0.02] p-6"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-background">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: "var(--volt)" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: "var(--volt)" }}
              />
            </span>
            Agent working
          </span>
          <span className="rounded-md bg-background/10 px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide text-background/60">
            Live
          </span>
        </div>

        <div className="relative mt-5">
          {/* connecting spine */}
          <span className="absolute left-[15px] top-3 bottom-3 w-px bg-background/10" />
          <ul className="space-y-4">
            {PIPELINE.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === active;
              const isDone = i < active;
              return (
                <li key={step.label} className="relative flex items-center gap-3.5">
                  <motion.span
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300"
                    style={{
                      background: isActive ? "var(--volt)" : "hsl(0 0% 100% / 0.04)",
                      borderColor: isActive ? "transparent" : "hsl(0 0% 100% / 0.12)",
                    }}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4 text-background/70" />
                    ) : (
                      <Icon
                        className="h-[15px] w-[15px]"
                        style={{ color: isActive ? "white" : "hsl(0 0% 100% / 0.45)" }}
                      />
                    )}
                  </motion.span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm transition-colors duration-300 ${
                        isActive ? "font-medium text-background" : "text-background/55"
                      }`}
                    >
                      {step.label}
                    </p>
                    <motion.p
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        height: isActive ? "auto" : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden text-xs text-background/45"
                    >
                      {step.sub}
                    </motion.p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>

      {/* Quiet stats strip */}
      <motion.div
        custom={1}
        variants={reveal}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-background/10 bg-background/10"
      >
        <div className="bg-ink p-5">
          <p className="text-xs text-background/50">Organic traffic</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-background">
            <Counter to={12480} />
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium" style={{ color: "var(--volt)" }}>
            <ArrowUpRight className="h-3.5 w-3.5" /> +38% this month
          </p>
        </div>
        <div className="bg-ink p-5">
          <p className="text-xs text-background/50">Articles live</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-background">
            <Counter to={146} />
          </p>
          <p className="mt-1 text-xs text-background/45">auto-published</p>
        </div>
      </motion.div>

      {/* Ranking strip */}
      <motion.div
        custom={2}
        variants={reveal}
        initial="hidden"
        animate="show"
        className="flex items-center justify-between rounded-2xl border border-background/10 bg-background/[0.04] px-5 py-4"
      >
        <div>
          <p className="text-sm font-medium text-background">Avg. Google position</p>
          <p className="mt-0.5 text-xs text-background/45">across tracked keywords</p>
        </div>
        <div className="flex items-center gap-3">
          <Sparkline />
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--volt)" }}
          >
            #1
          </span>
        </div>
      </motion.div>
    </div>
  );
}
