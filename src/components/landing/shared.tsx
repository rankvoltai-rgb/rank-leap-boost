import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- Animated reveal wrapper ---------- */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 18,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- RankPill logo ---------- */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-ink">
        <span className="block h-3 w-3 rounded-full border-[3px] border-background" />
      </span>
      <span className="text-[1.15rem] font-bold tracking-tight text-ink">RankPill</span>
    </div>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <span className="mb-4 inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-[2.75rem] md:leading-[1.08]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ---------- Star rating ---------- */
export function Stars({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5 text-warning", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85z" />
        </svg>
      ))}
    </div>
  );
}

/* ---------- Avatar (initials / gradient) ---------- */
const GRADIENTS = [
  "from-rose-400 to-orange-300",
  "from-sky-400 to-indigo-400",
  "from-emerald-400 to-teal-300",
  "from-violet-400 to-fuchsia-300",
  "from-amber-400 to-yellow-300",
  "from-cyan-400 to-blue-400",
];

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const idx =
    name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length;
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br text-[0.7rem] font-semibold text-white ring-2 ring-background",
        GRADIENTS[idx],
        className,
      )}
    >
      {initials}
    </span>
  );
}

/* ---------- Platform / brand lettermark badge ---------- */
const BRAND_COLORS: Record<string, string> = {
  WordPress: "bg-[#21759b]",
  Shopify: "bg-[#95bf47]",
  Webflow: "bg-[#4353ff]",
  Wix: "bg-[#0c6efc]",
  Framer: "bg-[#0099ff]",
  Webhooks: "bg-[#6b7280]",
  ChatGPT: "bg-[#10a37f]",
  Claude: "bg-[#d97757]",
  Gemini: "bg-[#1a73e8]",
  Perplexity: "bg-[#20808d]",
  Google: "bg-[#4285f4]",
  Bing: "bg-[#0078d4]",
  Grok: "bg-ink",
  Reddit: "bg-[#ff4500]",
};

export function BrandMark({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-lg text-[0.8rem] font-bold text-white",
        BRAND_COLORS[name] ?? "bg-ink",
        className,
      )}
    >
      {name[0]}
    </span>
  );
}

/* ---------- Buttons (visual-only links) ---------- */
export function PrimaryButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href="/auth"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      {children}
    </a>
  );
}

export function SecondaryButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href="#examples"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      {children}
    </a>
  );
}