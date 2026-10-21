/**
 * The product pictures on /use-cases/local-businesses, drawn the way the
 * landing draws Rankbox: white screens with hairline borders and soft
 * shadows, soft blue for whatever is picked.
 *
 * Every screen is a sample. The site is "yoursite.com" and the shop is "your
 * bakery", so no real business stands in as a customer; the topic map shows
 * the persona's own sample brand, which its note calls fictional. Platforms
 * appear only as places a site can run, never as a live one-click connection.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Globe, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { IntegrationGlyph } from "@/components/integrations/visuals";
import type { PersonaTopics } from "@/data/personas";

const EASE = [0.16, 1, 0.3, 1] as const;

const SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)]";

function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

function Tick({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-[background-color,border-color] duration-300",
        on ? "border-cta bg-cta text-white" : "border-ink/[0.16] bg-white text-transparent",
        className,
      )}
    >
      <Check className="h-2.5 w-2.5" strokeWidth={3.2} />
    </span>
  );
}

/* ---------- The sample topic map ---------- */

/* Each stage's tint, from the landing's feature rows: what the customer is
   doing reads in colour as well as in the chip. */
const STAGE_TINTS = [
  { bar: "#1877f2", chip: "#eaf2fe", ink: "#1661c9" },
  { bar: "#7c3aed", chip: "#f1eefd", ink: "#6d28d9" },
  { bar: "#16a34a", chip: "#e9f6ee", ink: "#15803d" },
  { bar: "#d97706", chip: "#fdf4e4", ink: "#b45309" },
] as const;

/* The order the owner ticks questions in: a few from each stage, one or two
   left unticked, as the workflow says ("tick the ones that fit"). */
const PICK_ORDER: [number, number][] = [
  [2, 0],
  [0, 0],
  [1, 0],
  [3, 0],
  [2, 1],
  [0, 1],
  [3, 2],
];
const FIRST_PICK_MS = 900;
const PICK_MS = 720;

/**
 * The topic map for the persona's sample business: every question is real
 * text, grouped by where the customer is, and the owner ticks the ones worth
 * an article. Ticks start once the map is mostly on screen and clear when it
 * leaves; with reduced motion the picks are already made.
 */
export function TopicMapWindow({ topics }: { topics: PersonaTopics }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const order = PICK_ORDER.filter(([c, q]) => topics.clusters[c]?.questions[q]);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) {
      setN(order.length);
      return;
    }
    if (!inView) {
      setN(0);
      return;
    }
    if (n >= order.length) return;
    const id = window.setTimeout(() => setN((k) => k + 1), n === 0 ? FIRST_PICK_MS : PICK_MS);
    return () => window.clearTimeout(id);
  }, [inView, reduce, n, order.length]);

  const picked = new Set(order.slice(0, n).map(([c, q]) => `${c}:${q}`));
  const total = topics.clusters.reduce((sum, c) => sum + c.questions.length, 0);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-xl border border-ink/[0.07] bg-white text-left",
        "shadow-[0_2px_4px_rgba(16,24,40,0.04),0_32px_72px_-32px_rgba(16,24,40,0.32)]",
      )}
    >
      {/* Title bar */}
      <div className="flex h-12 items-center gap-2.5 border-b border-ink/[0.06] px-4">
        <Mark className="h-5 w-5 shrink-0 text-brand-blue" />
        <span className="text-[0.82rem] font-semibold text-ink">Topic map</span>
        <span className="hidden min-w-0 items-center gap-1.5 truncate rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.7rem] font-medium text-ink sm:flex">
          {topics.brand}
          <span className="text-muted-foreground">· {topics.domain}</span>
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[0.68rem] font-semibold tabular-nums transition-colors duration-300",
              n > 0 ? "bg-cta-soft text-cta" : "bg-ink/[0.04] text-muted-foreground",
            )}
          >
            {n} of {total} picked
          </span>
          <SampleTag />
        </span>
      </div>

      <div className="grid gap-px bg-ink/[0.06] md:grid-cols-2 lg:grid-cols-4">
        {topics.clusters.map((c, ci) => {
          const tint = STAGE_TINTS[ci % STAGE_TINTS.length];
          return (
            <div key={c.stage} className="relative flex flex-col bg-white p-4 sm:p-5">
              {/* Four bars in a row: the customer's path, left to right. */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ background: tint.bar, opacity: 0.75 }}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-[0.68rem] font-medium tabular-nums text-muted-foreground">
                  {String(ci + 1).padStart(2, "0")}
                </span>
                <span
                  className="rounded-md px-1.5 py-0.5 text-[0.66rem] font-semibold"
                  style={{ background: tint.chip, color: tint.ink }}
                >
                  {c.intent}
                </span>
              </div>
              <h3 className="mt-2 text-[0.95rem] font-semibold tracking-tight text-ink">
                {c.stage}
              </h3>
              <ul className="mt-4 space-y-2">
                {c.questions.map((q, qi) => {
                  const on = picked.has(`${ci}:${qi}`);
                  return (
                    <li
                      key={q}
                      className={cn(
                        "flex gap-2.5 rounded-lg border px-3 py-2.5 text-[0.8rem] leading-snug transition-[background-color,border-color,color] duration-300",
                        on
                          ? "border-cta/25 bg-[color-mix(in_oklab,var(--cta)_5%,white)] text-ink"
                          : "border-ink/[0.07] bg-white text-ink/80",
                      )}
                    >
                      <Tick on={on} className="mt-px" />
                      {q}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- The quiet blog, filling ---------- */

/**
 * A small site's blog index: the launch-week post at the foot, and new posts
 * landing above it as the picture comes on screen (once). Titles come from
 * the sample topic map.
 */
export function QuietBlog({ titles }: { titles: string[] }) {
  const reduce = useReducedMotion();
  const when = ["Today", "Yesterday", "2 days ago"];
  return (
    <div
      aria-hidden
      className={cn(
        "mx-auto w-full max-w-[24rem] rounded-xl border border-ink/[0.07] bg-white",
        SHADOW,
      )}
    >
      <div className="flex h-11 items-center gap-2 border-b border-ink/[0.06] px-3.5">
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="truncate text-[0.76rem] font-medium text-ink">yoursite.com/blog</span>
        <SampleTag className="ml-auto" />
      </div>
      {/* `initial` stays the same on server and client; reduced motion only
          drops the travel, so hydration never sees two different styles. */}
      <motion.ul
        className="space-y-1.5 p-3"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.6 }}
        variants={{
          shown: {
            transition: reduce ? {} : { staggerChildren: 0.32, delayChildren: 0.25 },
          },
        }}
      >
        {titles.slice(0, 3).map((t, i) => (
          <motion.li
            key={t}
            variants={{
              hidden: { opacity: 0, y: -8, filter: "blur(3px)" },
              shown: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: reduce ? { duration: 0 } : { duration: 0.55, ease: EASE },
              },
            }}
            className="flex items-center gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#fdf4e4] text-[#d97706]">
              <Store className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.76rem] font-semibold leading-snug text-ink">{t}</span>
              <span className="block text-[0.64rem] text-muted-foreground">{when[i]}</span>
            </span>
            <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-semibold text-cta">
              New
            </span>
          </motion.li>
        ))}
        <li className="flex items-center gap-3 rounded-lg border border-dashed border-ink/[0.12] bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink/[0.05] text-ink/40">
            <Store className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.76rem] font-medium text-ink/55">
              Welcome to our new website!
            </span>
            <span className="block text-[0.64rem] text-muted-foreground">Launch week</span>
          </span>
        </li>
      </motion.ul>
    </div>
  );
}

/* ---------- The four steps, in miniature ---------- */

function Mini({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-xl border border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PasteSitePicture() {
  return (
    <Mini>
      <div className="flex items-center gap-2 rounded-lg border border-ink/[0.1] bg-white py-1.5 pl-2.5 pr-1.5">
        <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-[0.74rem] text-ink">yoursite.com</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta text-white">
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
      <p className="mt-2.5 text-[0.64rem] text-muted-foreground">Reading your pages…</p>
      <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-ink/[0.06]">
        <span className="block h-full w-2/3 rounded-full bg-cta/70" />
      </span>
    </Mini>
  );
}

export function PickTopicsPicture({ yes, no }: { yes: string; no: string }) {
  return (
    <Mini className="space-y-1.5">
      <div className="flex gap-2 rounded-lg border border-cta/25 bg-white px-2.5 py-2 text-[0.72rem] leading-snug text-ink">
        <Tick on />
        <span className="line-clamp-2">{yes}</span>
      </div>
      <div className="flex gap-2 rounded-lg border border-ink/[0.07] bg-white px-2.5 py-2 text-[0.72rem] leading-snug text-ink/60">
        <Tick on={false} />
        <span className="line-clamp-2">{no}</span>
      </div>
    </Mini>
  );
}

const PLATFORMS = [
  { platform: "square", kind: "app", name: "Square" },
  { platform: "wordpress", kind: "plugin", name: "WordPress" },
  { platform: "webflow", kind: "app", name: "Webflow" },
  { platform: "framer", kind: "plugin", name: "Framer" },
] as const;

export function ConnectSitePicture() {
  return (
    <Mini>
      <p className="text-[0.64rem] font-medium text-muted-foreground">Where your site runs</p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {PLATFORMS.map((p) => (
          <span
            key={p.name}
            className="flex min-w-0 items-center gap-1.5 rounded-lg border border-ink/[0.07] bg-white px-1.5 py-1.5"
          >
            <IntegrationGlyph integration={p} className="h-5 w-5" />
            <span className="truncate text-[0.65rem] font-medium text-ink/80">{p.name}</span>
          </span>
        ))}
      </div>
    </Mini>
  );
}

export function ReadOrNotPicture() {
  return (
    <Mini>
      <p className="text-[0.64rem] font-medium text-muted-foreground">New posts</p>
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-ink/[0.05] p-1 text-center text-[0.68rem] font-medium">
        <span className="rounded-md px-1.5 py-1.5 text-muted-foreground">On schedule</span>
        <span className="rounded-md bg-white px-1.5 py-1.5 text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]">
          As drafts
        </span>
      </div>
      <p className="mt-2.5 text-[0.64rem] text-muted-foreground">Switch any time.</p>
    </Mini>
  );
}

/* ---------- The post, rising from the closing band ---------- */

/** The day's post as its page on your site, cropped by the band's foot. */
export function PostPeek({ title }: { title: string }) {
  return (
    <div
      aria-hidden
      className="rounded-t-xl bg-white text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]"
    >
      <div className="flex h-10 items-center gap-2 border-b border-ink/[0.06] px-4">
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="truncate text-[0.72rem] text-muted-foreground">yoursite.com/blog</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-[0.62rem] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Published 9:00 AM
        </span>
      </div>
      <div className="px-5 pb-6 pt-5 sm:px-7">
        <p className="font-display text-[1.3rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.5rem]">
          {title}
        </p>
        <p className="mt-2 flex items-center gap-2 text-[0.7rem] text-muted-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fdf4e4] text-[#d97706]">
            <Store className="h-3 w-3" />
          </span>
          Your bakery · in your voice
        </p>
        <div className="mt-5 space-y-2">
          {["100%", "94%", "97%", "62%"].map((w, i) => (
            <span key={i} className="block h-2 rounded-full bg-ink/[0.07]" style={{ width: w }} />
          ))}
          <span className="!mt-5 block h-3 w-2/5 rounded-full bg-ink/[0.12]" />
          {["98%", "91%", "70%"].map((w, i) => (
            <span key={i} className="block h-2 rounded-full bg-ink/[0.07]" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}
