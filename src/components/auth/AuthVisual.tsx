import { motion, useMotionValue, useTransform, animate, type Variants } from "motion/react";
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

/* ---------- AI engine brand logos ---------- */
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

const ENGINES = [
  { name: "ChatGPT", Logo: ChatGPTLogo, color: "#10a37f", status: "Recommended" },
  { name: "Gemini", Logo: GeminiLogo, color: "#4285f4", status: "Cited 12×" },
  { name: "Perplexity", Logo: PerplexityLogo, color: "#20b8cd", status: "Top source" },
  { name: "Claude", Logo: ClaudeLogo, color: "#d97757", status: "Recommended" },
];

const PIPELINE = [
  { icon: Search, label: "Researching keywords", sub: "1,240 opportunities found" },
  { icon: Sparkles, label: "Writing the article", sub: "SEO-optimized, on-brand" },
  { icon: Globe, label: "Publishing to your CMS", sub: "WordPress · Webflow · Ghost" },
  { icon: Bot, label: "Indexed by AI search", sub: "Cited by ChatGPT & Google" },
];

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

      {/* AI search visibility */}
      <motion.div
        custom={2}
        variants={reveal}
        initial="hidden"
        animate="show"
        className="rounded-2xl border border-background/10 bg-gradient-to-b from-background/[0.07] to-background/[0.02] p-5"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-background">Visible across AI search</p>
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--volt)" }}>
            <ArrowUpRight className="h-3.5 w-3.5" /> 4 engines
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {ENGINES.map((engine, i) => {
            const Logo = engine.Logo;
            return (
              <motion.div
                key={engine.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.6 + i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="flex items-center gap-2.5 rounded-xl border border-background/10 bg-background/[0.03] px-3 py-2.5"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${engine.color}1f`, color: engine.color }}
                >
                  <Logo className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-background">{engine.name}</p>
                  <p className="flex items-center gap-1 truncate text-[0.7rem] text-background/50">
                    <Check className="h-3 w-3 shrink-0" style={{ color: "var(--volt)" }} />
                    {engine.status}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
