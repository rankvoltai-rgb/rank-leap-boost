/**
 * What opens on the right when a run finishes: the article it wrote, the
 * plan it made, or the page it published.
 *
 * Each follows the product. The article carries the real score card (one
 * score out of 100, "9 of 11 checks passed", the editor's own verdict line)
 * and the parts every Rankbox draft has: the answer first, sections, key
 * takeaways, an FAQ. No picture, because Rankbox doesn't add images. The
 * plan uses the app's statuses (Scheduled, Idea). The live page is drawn in
 * the sample site's own colours, since a published article takes the site's
 * design, not ours.
 */
import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  FileText,
  Globe,
  Lock,
  Maximize2,
  PanelRight,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE, type PanelKind } from "./script";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- The panel's frame ---------- */

function TabBar({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-1 px-3">
      <span className="flex h-7 max-w-[11.5rem] items-center gap-1.5 rounded-lg bg-ink/[0.045] pl-2 pr-1.5 text-[12px] font-medium leading-[18px] text-ink">
        <Icon className="h-3.5 w-3.5 shrink-0 text-cta" strokeWidth={1.75} />
        <span className="truncate">{label}</span>
        <X className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={2} />
      </span>
      <span className="flex h-7 w-7 items-center justify-center text-muted-foreground">
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <span className="ml-auto flex items-center gap-3.5 pr-1 text-muted-foreground">
        <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        <PanelRight className="h-4 w-4" strokeWidth={1.75} />
      </span>
    </div>
  );
}

function Shell({
  icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col bg-white">
      <TabBar icon={icon} label={label} />
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/** A block that settles into place a beat after the panel opens. */
function Settle({
  delay,
  animate,
  className,
  children,
}: {
  delay: number;
  animate: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={animate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- 1. The article ---------- */

const SCORE = 94;
/** The editor's 11 checks: nine pass, two warn (as in the docs' own example). */
const CHECKS = [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 0.5] as const;

function ScoreCard({ animate }: { animate: boolean }) {
  const r = 17;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3.5 rounded-xl px-3.5 py-3 shadow-[0_0_0_1px_rgba(16,24,40,0.08)]">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle
            cx="22"
            cy="22"
            r={r}
            fill="none"
            strokeWidth="3.5"
            stroke="currentColor"
            className="text-ink/[0.07]"
          />
          <motion.circle
            cx="22"
            cy="22"
            r={r}
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke="currentColor"
            className="text-cta"
            strokeDasharray={c}
            initial={animate ? { strokeDashoffset: c } : false}
            animate={{ strokeDashoffset: c * (1 - SCORE / 100) }}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
          />
        </svg>
        <span className="text-[14px] font-semibold tabular-nums text-ink">{SCORE}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium leading-[18px] text-ink">
          Strong — ready to rank.
        </span>
        <span className="block text-[12px] leading-[18px] text-muted-foreground">
          9 of 11 checks passed
        </span>
      </span>
      <span className="hidden shrink-0 items-center gap-[3px] min-[440px]:flex" aria-hidden>
        {CHECKS.map((v, i) => (
          <motion.span
            key={i}
            className={cn("h-4 w-[5px] rounded-full", v === 1 ? "bg-cta" : "bg-warning")}
            initial={animate ? { opacity: 0, scaleY: 0.4 } : false}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + i * 0.045, ease: EASE }}
          />
        ))}
      </span>
    </div>
  );
}

const H = "text-[14px] font-semibold leading-5 text-ink";
const P = "text-[14px] leading-[22px] text-ink/80";

function ArticlePanel({ animate }: { animate: boolean }) {
  return (
    <Shell icon={FileText} label="Cold brew caffeine">
      <div className="px-6 pb-10 pt-5">
        <Settle delay={0.1} animate={animate}>
          <h3 className="text-[20px] font-semibold leading-[26px] tracking-[-0.015em] text-ink">
            Does cold brew have more caffeine than drip coffee?
          </h3>
          <p className="mt-1.5 text-[13px] leading-[18px] text-muted-foreground">
            {SITE.name} blog · 2,460 words · 12 min read
          </p>
        </Settle>
        <Settle delay={0.22} animate={animate} className="mt-5">
          <ScoreCard animate={animate} />
        </Settle>
        <Settle delay={0.34} animate={animate} className="mt-5">
          <p className={P}>
            Usually, yes, glass for glass. Cold brew is steeped as a concentrate, so an undiluted
            glass carries more caffeine than a cup of drip. Cut it one to one with water or milk and
            the two land close together.
          </p>
          <h4 className={cn(H, "mt-6")}>Why the cold changes less than you think</h4>
          <p className={cn(P, "mt-2")}>
            Cold water draws caffeine out of the grounds more slowly than hot water does. Time and
            ratio make up the difference: twelve hours or more of steeping, and far more coffee for
            every cup of water.
          </p>
          <h4 className={cn(H, "mt-6")}>Key takeaways</h4>
          <ul className={cn(P, "mt-2 space-y-1.5")}>
            {[
              "The ratio of coffee to water sets the strength, not the temperature.",
              "Diluted one to one, most cold brew lands close to drip.",
              "Bean and roast move the number more than the brew method does.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink/45" />
                {t}
              </li>
            ))}
          </ul>
          <h4 className={cn(H, "mt-6")}>Questions people also ask</h4>
          <ul className="mt-2 divide-y divide-ink/[0.07] text-[14px] leading-5 text-ink">
            {[
              "Is cold brew stronger than espresso?",
              "Does steeping longer add more caffeine?",
              "How much cold brew concentrate is one serving?",
            ].map((q) => (
              <li key={q} className="flex items-center justify-between gap-3 py-2.5">
                {q}
                <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
              </li>
            ))}
          </ul>
        </Settle>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
      />
    </Shell>
  );
}

/* ---------- 2. The plan ---------- */

const INTENTS = [
  { label: "Storage", count: 5, tone: "bg-cta" },
  { label: "Roast dates", count: 4, tone: "bg-cta/65" },
  { label: "Grinding", count: 3, tone: "bg-cta/40" },
  { label: "Buying", count: 2, tone: "bg-cta/20" },
] as const;

const PLANNED = [
  {
    day: "Mon",
    date: "16",
    title: "How long do whole coffee beans stay fresh?",
    keyword: "how long do coffee beans last",
  },
  {
    day: "Thu",
    date: "19",
    title: "Should you keep coffee beans in the fridge?",
    keyword: "coffee beans in fridge",
  },
  {
    day: "Mon",
    date: "23",
    title: "How soon after roasting should you brew?",
    keyword: "coffee roast date",
  },
  {
    day: "Thu",
    date: "26",
    title: "How long does ground coffee stay fresh?",
    keyword: "ground coffee freshness",
  },
] as const;

const IDEAS = [
  "Do valve bags keep beans fresh longer?",
  "Is it worth grinding just before brewing?",
  "Can you freeze coffee beans?",
] as const;

function Label({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <p className="flex items-baseline justify-between text-[12px] font-medium leading-[18px] text-muted-foreground">
      <span>{children}</span>
      {aside && <span className="font-normal">{aside}</span>}
    </p>
  );
}

function PlanPanel({ animate }: { animate: boolean }) {
  const total = INTENTS.reduce((n, i) => n + i.count, 0);
  return (
    <Shell icon={CalendarDays} label="Bean freshness plan">
      <div className="px-6 pb-8 pt-5">
        <Settle delay={0.1} animate={animate}>
          <h3 className="text-[20px] font-semibold leading-[26px] tracking-[-0.015em] text-ink">
            Bean freshness
          </h3>
          <p className="mt-1.5 text-[13px] leading-[18px] text-muted-foreground">
            {total} questions buyers ask, grouped by what they want to know
          </p>
        </Settle>

        <Settle delay={0.22} animate={animate} className="mt-5">
          <div className="flex h-2 gap-[3px]" aria-hidden>
            {INTENTS.map((it, i) => (
              <motion.span
                key={it.label}
                className={cn("h-full origin-left rounded-full", it.tone)}
                style={{ flexGrow: it.count }}
                initial={animate ? { scaleX: 0 } : false}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.09, ease: EASE }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] leading-[18px] text-muted-foreground">
            {INTENTS.map((it) => (
              <li key={it.label} className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", it.tone)} />
                {it.label}
                <span className="font-medium tabular-nums text-ink">{it.count}</span>
              </li>
            ))}
          </ul>
        </Settle>

        <Settle delay={0.36} animate={animate} className="mt-7">
          <Label aside="Two a week">Scheduled</Label>
          <ul className="mt-2 divide-y divide-ink/[0.07] overflow-hidden rounded-xl shadow-[0_0_0_1px_rgba(16,24,40,0.08)]">
            {PLANNED.map((a, i) => (
              <motion.li
                key={a.title}
                className="flex h-[54px] items-center gap-3 px-3"
                initial={animate ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.75 + i * 0.12 }}
              >
                <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-ink/[0.04]">
                  <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.06em] text-muted-foreground">
                    {a.day}
                  </span>
                  <span className="mt-0.5 text-[13px] font-semibold leading-none tabular-nums text-ink">
                    {a.date}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium leading-[18px] text-ink">
                    {a.title}
                  </span>
                  <span className="block truncate font-mono text-[11px] leading-[18px] text-muted-foreground">
                    {a.keyword}
                  </span>
                </span>
                <span className="shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-[11px] font-medium leading-4 text-cta">
                  Scheduled
                </span>
              </motion.li>
            ))}
          </ul>
        </Settle>

        <Settle delay={0.5} animate={animate} className="mt-6">
          <Label aside="10 saved">Ideas</Label>
          <ul className="mt-1 divide-y divide-ink/[0.07] text-[13px] leading-[18px] text-ink">
            {IDEAS.map((q) => (
              <li key={q} className="flex items-center justify-between gap-3 py-2.5">
                <span className="truncate">{q}</span>
                <span className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-4 text-muted-foreground shadow-[0_0_0_1px_rgba(16,24,40,0.1)]">
                  Idea
                </span>
              </li>
            ))}
          </ul>
        </Settle>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent"
      />
    </Shell>
  );
}

/* ---------- 3. The live page ---------- */

const COMPARE = [
  ["Grind", "Medium-fine", "Coarse"],
  ["Brew time", "3 to 4 minutes", "4 minute steep"],
  ["Cleanup", "Lift out the filter", "Rinse the mesh"],
  ["Forgiving?", "Less", "More"],
] as const;

function LivePanel({ animate }: { animate: boolean }) {
  return (
    <Shell icon={Globe} label={SITE.domain}>
      <div className="flex h-11 items-center justify-between gap-3 px-4">
        <span className="flex min-w-0 items-center gap-1.5 text-[12px] leading-[18px] text-muted-foreground">
          <Lock className="h-3 w-3 shrink-0" strokeWidth={2} />
          <span className="truncate">{SITE.domain}/blog/pour-over-vs-french-press</span>
        </span>
        <span className="flex h-6 shrink-0 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium leading-[18px] text-ink shadow-[0_0_0_1px_rgba(16,24,40,0.1)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-success motion-safe:animate-ping" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          Live
        </span>
      </div>

      {/* The site's own page: its colours and type, not Rankbox's. */}
      <Settle delay={0.15} animate={animate} className="h-full">
        <div className="h-full bg-[#f6f1e7] text-[#2a1b12]">
          <div className="flex h-14 items-center justify-between border-b border-[#2a1b12]/10 px-6">
            <span className="text-[17px] font-extrabold leading-none tracking-[-0.04em]">
              driftmoor<span style={{ color: SITE.color }}>.</span>
            </span>
            <span className="text-[12px] font-medium text-[#2a1b12]/70">Brew guides ↗</span>
          </div>
          <div className="px-6 pt-7">
            <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase leading-none tracking-[0.14em] text-[#2a1b12]/60">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SITE.color }} />
              Brew guides
            </p>
            <h3 className="mt-4 text-[34px] font-extrabold leading-[1.04] tracking-[-0.04em]">
              Pour-over or
              <br />
              French press?
            </h3>
            <p className="mt-3.5 max-w-[26rem] text-[14px] leading-[22px] text-[#2a1b12]/75">
              French press is the easier start: fewer steps, and more room for error. Pour-over
              rewards a steady hand with a cleaner cup.
            </p>
            <p className="mt-3 text-[12px] leading-[18px] text-[#2a1b12]/55">
              By the Driftmoor team · 9 min read
            </p>

            <Settle delay={0.5} animate={animate} className="mt-6">
              <div className="overflow-hidden rounded-xl bg-white/55 shadow-[0_0_0_1px_rgba(42,27,18,0.1)]">
                <div className="grid grid-cols-[6.5rem_1fr_1fr] border-b border-[#2a1b12]/10 text-[12px] font-semibold leading-[18px]">
                  <span className="px-3.5 py-2.5" />
                  <span className="px-3 py-2.5">Pour-over</span>
                  <span className="px-3 py-2.5">French press</span>
                </div>
                {COMPARE.map(([k, a, b], i) => (
                  <div
                    key={k}
                    className={cn(
                      "grid grid-cols-[6.5rem_1fr_1fr] text-[13px] leading-[18px]",
                      i > 0 && "border-t border-[#2a1b12]/[0.07]",
                    )}
                  >
                    <span className="px-3.5 py-2.5 text-[#2a1b12]/55">{k}</span>
                    <span className="px-3 py-2.5">{a}</span>
                    <span className="px-3 py-2.5">{b}</span>
                  </div>
                ))}
              </div>
            </Settle>
          </div>
        </div>
      </Settle>
    </Shell>
  );
}

export function Panel({ kind, animate }: { kind: PanelKind; animate: boolean }) {
  if (kind === "article") return <ArticlePanel animate={animate} />;
  if (kind === "plan") return <PlanPanel animate={animate} />;
  return <LivePanel animate={animate} />;
}
