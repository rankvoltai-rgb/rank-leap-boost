import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import rankvoltMark from "@/assets/rankvolt-mark.png.asset.json";

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

/* ---------- Rankvolt logo ---------- */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-card shadow-sm">
        <img src={rankvoltMark.url} alt="Rankvolt" className="h-5 w-5 object-contain" />
      </span>
      <span className="text-[1.2rem] font-semibold tracking-tight text-ink">Rankvolt</span>
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
      <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-[2.75rem] md:leading-[1.08]">
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
  src,
}: {
  name: string;
  className?: string;
  src?: string;
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
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        className={cn(
          "rounded-full object-cover ring-2 ring-background",
          className,
        )}
      />
    );
  }
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

/* Official brand glyphs (simple-icons), drawn in white on the colored badge. */
const BRAND_PATHS: Record<string, string> = {
  WordPress:
    "M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0",
  Shopify:
    "M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.62-2.658-1.696-2.658-4.366 0-2.25 1.62-4.439 4.875-4.439 1.245 0 1.86.359 1.86.359l-.945 2.91-.05-.013zM14.265.929c.103 0 .206.039.296.104-.66.314-1.38 1.11-1.68 2.7-.45.135-.93.285-1.44.435C11.85 2.58 12.967.929 14.265.929M15.045 2.82c.135.33.225.795.225 1.44v.21c-.555.165-1.155.345-1.755.525.345-1.32.99-1.965 1.53-2.175M16.792 4.485c-.045 0-.105 0-.165.015a3.93 3.93 0 0 0-.225-1.245c.69.135 1.035.93 1.17 1.41-.255.075-.51.15-.78.225v-.405z",
  Webflow:
    "m24 4.515-7.658 14.97H9.149l3.205-6.204h-.144C9.566 16.713 5.621 18.973 0 19.485v-6.118s3.596-.213 5.71-2.435H0V4.515h6.417v5.278l.144-.001 2.622-5.277h4.854v5.244h.144l2.72-5.244H24Z",
  Wix: "m0 7.354 2.113 9.292h.801a1.54 1.54 0 0 0 1.506-1.218l1.351-6.34a.171.171 0 0 1 .167-.137c.08 0 .15.058.167.137l1.352 6.34a1.54 1.54 0 0 0 1.506 1.218h.805l2.113-9.292h-.565c-.62 0-1.159.43-1.296 1.035l-1.26 5.545-1.106-5.176a1.76 1.76 0 0 0-2.19-1.324c-.639.176-1.113.716-1.251 1.365l-1.094 5.127-1.26-5.537A1.33 1.33 0 0 0 .563 7.354H0zm13.992 0a.951.951 0 0 0-.951.95v8.342h.635a.952.952 0 0 0 .951-.95V7.353h-.635zm1.778 0 3.158 4.66-3.14 4.632h1.325c.368 0 .712-.181.918-.486l1.756-2.59a.12.12 0 0 1 .197 0l1.754 2.59c.206.305.55.486.918.486h1.326l-3.14-4.632L24 7.354h-1.326c-.368 0-.712.181-.918.486l-1.772 2.617a.12.12 0 0 1-.197 0L18.014 7.84a1.108 1.108 0 0 0-.918-.486H15.77z",
  Framer: "M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z",
};

export function BrandMark({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const path = BRAND_PATHS[name];
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-lg text-[0.8rem] font-semibold text-white",
        BRAND_COLORS[name] ?? "bg-ink",
        className,
      )}
    >
      {path ? (
        <svg
          viewBox="0 0 24 24"
          role="img"
          aria-label={name}
          className="h-[55%] w-[55%] fill-white"
        >
          <path d={path} />
        </svg>
      ) : (
        name[0]
      )}
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

/* ---------- Premium pill badge ---------- */
export function Badge({
  children,
  className,
  dot = true,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur",
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        </span>
      )}
      {children}
    </span>
  );
}

/* ---------- Statistic card ---------- */
export function StatCard({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 text-center shadow-elevation",
        className,
      )}
    >
      <p className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
    </div>
  );
}

/* ---------- Section divider ---------- */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto h-px max-w-6xl px-5", className)}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

/* ---------- Notion-style block card ---------- */
export function BlockCard({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card",
        hover && "transition-all hover:-translate-y-1 hover:shadow-elevation-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Notion-style eyebrow label ---------- */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-volt" />
      {children}
    </span>
  );
}