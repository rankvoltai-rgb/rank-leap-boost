/**
 * The focal picture on /features/authority-backlinks: one exchange link
 * followed from match to verified live, as the three screens it passes
 * through, laid out on graph paper.
 *
 *   the article      where the link is written in, one per article
 *   the live check   the real page fetched: live, in the body, dofollow
 *   the ledger       a credit held when the link is reserved, settled only
 *                    on a live verdict
 *
 * It runs both sides of the exchange in turn, as the dashboard's tabs split
 * them: Get links (a member's article links to yoursite.com, which spends)
 * and Give links (yoursite.com's own article carries a member's link, which
 * earns). Labels follow the app (components/dashboard/exchange) and the flow
 * follows lib/exchange: escrow on reserve, settle_spend and settle_earn on a
 * live verdict, nothing settled before.
 *
 * Every value is a sample and the frame says so. Partner sites are named by
 * their niche, never by a domain. It plays only while about half of it is on
 * screen, starts over when it leaves, and with reduced motion holds the
 * finished Get-links frame.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Globe,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";

const EASE = [0.16, 1, 0.3, 1] as const;

export const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.28)]";

/* ---------- The two samples ---------- */

type Side = "get" | "give";

interface Sample {
  side: Side;
  /** The site whose article carries the link (the host). */
  host: { name: string; path: string; own: boolean };
  title: string;
  lead: string;
  before: string;
  anchor: string;
  after: string;
  /** Where the link points. */
  target: string;
  /** Terms the article and the linked page share: why they matched. */
  topic: string[];
  /** The next section of the article, so it reads as a real one. */
  sub: string;
  more: string;
}

const SAMPLES: Sample[] = [
  {
    side: "get",
    host: { name: "A project-management blog", path: "/blog/sprint-reviews", own: false },
    title: "How small teams run a sprint review",
    lead: "Keep it short: show what shipped, hear what changed, and agree on what comes next.",
    before: "New to the ritual? Start from a ",
    anchor: "sprint planning template",
    after: " so every review opens on the same three questions.",
    target: "yoursite.com/templates/sprint-planning",
    topic: ["sprint", "planning", "team"],
    sub: "What to bring",
    more: "A demo of the work, the one number that moved, and a single question for the room. Everything else can wait for the retro.",
  },
  {
    side: "give",
    host: { name: "yoursite.com", path: "/blog/team-retros", own: true },
    title: "How to run a retro your team looks forward to",
    lead: "Retros fade when they turn into status meetings. Keep them about the work, and end on one change to try.",
    before: "To keep notes consistent from one retro to the next, share a ",
    anchor: "retro notes template",
    after: " before the meeting starts.",
    target: "a member's page, on a meeting-notes app",
    topic: ["retro", "notes", "team"],
    sub: "Close on one change",
    more: "Pick one thing to try before the next retro, name who owns it, and open the next session by checking how it went.",
  },
];

/*
 * One sample's phases, and how long each holds:
 *   0 matching   1 matched, credit held   2 placed, first check running
 *   3–5 checks pass one by one   6 live, credits settle   7 hold
 */
const PHASE_MS = [1100, 1200, 1400, 750, 750, 850, 1000, 3200];
const PER = PHASE_MS.length;
const STEPS = PER * SAMPLES.length;
/** The finished Get-links frame: what reduced motion shows. */
const FINAL = PER - 1;

/* ---------- The ledger, derived from where the loop is ---------- */

interface Entry {
  id: string;
  label: string;
  note: string;
  credits: number;
  balance: number;
}

const GRANT: Entry = {
  id: "grant",
  label: "Monthly grant",
  note: "monthly plan grant",
  credits: 30,
  balance: 30,
};
const HELD: Entry = {
  id: "held",
  label: "Held for a link",
  note: "reserved on a project-management blog",
  credits: -1,
  balance: 29,
};
const SPENT: Entry = {
  id: "spent",
  label: "Link went live",
  note: "link verified live",
  credits: 0,
  balance: 29,
};
const EARNED: Entry = {
  id: "earned",
  label: "Hosted link went live",
  note: "hosted link verified live",
  credits: 1,
  balance: 30,
};

function ledgerAt(sample: number, phase: number) {
  const rows = [GRANT];
  if (sample > 0 || phase >= 1) rows.push(HELD);
  if (sample > 0 || phase >= 6) rows.push(SPENT);
  if (sample === 1 && phase >= 6) rows.push(EARNED);
  return {
    rows: rows.reverse(),
    balance: rows[0].balance,
    held: sample === 0 && phase >= 1 && phase < 6 ? 1 : 0,
    inbound: 4 + (sample > 0 || phase >= 6 ? 1 : 0),
    hosted: 2 + (sample === 1 && phase >= 6 ? 1 : 0),
  };
}

/* ---------- Small parts ---------- */

function SampleBadge() {
  return (
    <span className="rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      Sample
    </span>
  );
}

const STAGES = ["Matched", "Placed", "Live"] as const;

function Stepper({ stage }: { stage: number }) {
  return (
    <ol className="flex items-center gap-1">
      {STAGES.map((label, i) => {
        const done = i <= stage;
        const live = done && i === STAGES.length - 1;
        return (
          <li
            key={label}
            className={cn(
              "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold transition-colors duration-500",
              live
                ? "bg-success/12 text-success"
                : done
                  ? "bg-cta-soft text-cta"
                  : "text-muted-foreground/80",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                live ? "bg-success" : done ? "bg-cta" : "bg-ink/15",
              )}
            />
            {label}
          </li>
        );
      })}
    </ol>
  );
}

/* The anchor phrase: plain words until the link is placed, then a soft blue
   sweep and the link itself. The sweep is a background, so a phrase that
   wraps on a phone highlights on both lines. */
function Anchor({ placed, run, children }: { placed: boolean; run: boolean; children: string }) {
  return (
    <span
      className={cn(
        "rounded-[4px] bg-no-repeat px-[2px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]",
        placed
          ? "font-medium text-cta underline decoration-cta/45 decoration-[1.5px] underline-offset-[3px]"
          : "text-ink/80",
      )}
      style={{
        backgroundImage: "linear-gradient(var(--cta-soft), var(--cta-soft))",
        backgroundSize: placed ? "100% 100%" : "0% 100%",
        transition: run
          ? "background-size 0.7s cubic-bezier(0.16,1,0.3,1), color 0.7s ease"
          : "none",
      }}
    >
      {children}
    </span>
  );
}

function SkeletonLine({ w }: { w: string }) {
  return <span className="block h-[7px] rounded-full bg-ink/[0.06]" style={{ width: w }} />;
}

/* ---------- The article ---------- */

function ArticleCard({ s, phase, run }: { s: Sample; phase: number; run: boolean }) {
  const stage = phase === 0 ? -1 : phase === 1 ? 0 : phase < 6 ? 1 : 2;
  const placed = phase >= 2;
  return (
    <div className={cn(CARD, "relative flex h-full flex-col overflow-hidden")}>
      {/* The host page's address bar. */}
      <div className="flex items-center gap-2.5 border-b border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-4 py-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
          {s.host.own ? (
            <Mark className="h-3.5 w-3.5 text-brand-blue" />
          ) : (
            <Globe className="h-3.5 w-3.5 text-ink/55" />
          )}
        </span>
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="shrink-0 text-[0.76rem] font-semibold text-ink">{s.host.name}</span>
          <span className="truncate font-mono text-[0.66rem] text-muted-foreground">
            {s.host.path}
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {s.host.own ? "Your article" : "A member's article"}
          </span>
          <Stepper stage={stage} />
        </div>

        <p className="mt-3 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.4rem]">
          {s.title}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <AnimatePresence initial={false} mode="wait">
            {phase === 0 ? (
              <motion.span
                key="matching"
                initial={run ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="inline-flex items-center gap-1.5 rounded-md border border-ink/[0.08] bg-white px-2 py-1 text-[0.66rem] font-medium text-muted-foreground"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cta" />
                </span>
                Looking for a topic match
              </motion.span>
            ) : (
              <motion.span
                key="matched"
                initial={run ? { opacity: 0, y: 4 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="inline-flex items-center gap-1.5 rounded-md bg-cta-soft px-2 py-1 text-[0.66rem] font-semibold text-cta"
              >
                Topic fit
                <span className="font-medium">{s.topic.join(" · ")}</span>
              </motion.span>
            )}
          </AnimatePresence>
          <span className="rounded-md border border-ink/[0.08] bg-white px-2 py-1 text-[0.66rem] font-medium text-muted-foreground">
            1 exchange link per article
          </span>
        </div>

        <p className="mt-4 text-[0.84rem] leading-relaxed text-muted-foreground">{s.lead}</p>
        <p className="mt-3 text-[0.84rem] leading-relaxed text-ink/80">
          {s.before}
          <Anchor placed={placed} run={run}>
            {s.anchor}
          </Anchor>
          {s.after}
        </p>
        <motion.div
          className="mt-2.5 flex min-w-0 max-w-full items-center gap-1.5 self-start rounded-md border border-cta/20 bg-white px-2 py-1 text-[0.66rem] shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
          initial={false}
          animate={{ opacity: placed ? 1 : 0, y: placed ? 0 : -4 }}
          transition={{ duration: run ? 0.45 : 0, ease: EASE, delay: run && placed ? 0.35 : 0 }}
        >
          <CornerDownRight className="h-3 w-3 shrink-0 text-cta" />
          <span className="shrink-0 text-muted-foreground">Links to</span>
          <span className={cn("truncate text-ink", !s.host.own && "font-mono")}>{s.target}</span>
        </motion.div>

        <p className="mt-5 text-[0.86rem] font-semibold text-ink">{s.sub}</p>
        <p className="mt-1.5 text-[0.84rem] leading-relaxed text-muted-foreground">{s.more}</p>

        {/* The rest of the article, as the reader would scroll on. */}
        <div className="mt-5 space-y-2.5">
          <SkeletonLine w="100%" />
          <SkeletonLine w="94%" />
          <SkeletonLine w="71%" />
        </div>
        <div className="mt-5 hidden space-y-2.5 lg:block">
          <span className="block h-2.5 w-1/3 rounded-full bg-ink/[0.09]" />
          <SkeletonLine w="97%" />
          <SkeletonLine w="88%" />
          <SkeletonLine w="62%" />
        </div>
      </div>
      {/* On wide screens the card is cut to the height of the screens beside
          it; the article fades out where it's cut. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-16 rounded-b-xl bg-gradient-to-t from-white to-transparent lg:block"
      />
    </div>
  );
}

/* ---------- The live check ---------- */

const CHECKS = [
  { label: "Article is live", detail: "the page loads" },
  { label: "Link is on the page", detail: "in the article body" },
  { label: "Dofollow", detail: "passes authority" },
] as const;

function CheckCard({ s, phase }: { s: Sample; phase: number }) {
  const passed = Math.max(0, Math.min(CHECKS.length, phase - 2));
  const checking = phase >= 2 && phase <= 4 ? phase - 2 : -1;
  const live = phase >= 6;
  return (
    <div className={cn(CARD, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-4 py-2.5">
        <span className="flex items-center gap-2 text-[0.8rem] font-semibold text-ink">
          <ShieldCheck className="h-4 w-4 text-cta" />
          Live check
        </span>
        <span className="text-[0.66rem] text-muted-foreground">
          on {s.host.own ? "your page" : "the member's page"}
        </span>
      </div>
      <ul className="divide-y divide-ink/[0.05] px-4">
        {CHECKS.map((c, i) => {
          const ok = i < passed;
          const busy = i === checking;
          return (
            <li key={c.label} className="flex items-center gap-3 py-2.5">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  ok
                    ? "border-success/30 bg-success/12 text-success"
                    : busy
                      ? "border-cta/30 bg-cta-soft text-cta"
                      : "border-ink/[0.1] bg-white text-transparent",
                )}
              >
                {ok ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : busy ? (
                  <Loader2 className="h-3 w-3 animate-spin motion-reduce:animate-none" />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-[0.78rem] font-medium transition-colors duration-300",
                    ok || busy ? "text-ink" : "text-ink/55",
                  )}
                >
                  {c.label}
                </span>
                <span className="block text-[0.66rem] text-muted-foreground">{c.detail}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="flex min-h-[2.75rem] items-center justify-between gap-2 border-t border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_45%,white)] px-4 py-2">
        <AnimatePresence initial={false} mode="wait">
          {live ? (
            <motion.span
              key="live"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 480, damping: 26 }}
              className="inline-flex items-center gap-1.5 rounded-md bg-success/12 px-2 py-1 text-[0.68rem] font-semibold text-success"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Live · dofollow
            </motion.span>
          ) : (
            <motion.span
              key="wait"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="text-[0.68rem] text-muted-foreground"
            >
              {phase >= 2 ? "Checking the real page" : "Runs once the article is published"}
            </motion.span>
          )}
        </AnimatePresence>
        <span
          className={cn(
            "text-[0.68rem] font-semibold transition-opacity duration-500",
            live ? "text-ink opacity-100" : "opacity-0",
          )}
        >
          {s.side === "get" ? "Held credit settles" : "+1 credit to you"}
        </span>
      </div>
    </div>
  );
}

/* ---------- The ledger ---------- */

/* A count that rises into place when it changes while playing, and simply
   is its value otherwise. */
function Figure({ value, run }: { value: number; run: boolean }) {
  return (
    <motion.span
      key={value}
      initial={run ? { y: 8, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="inline-block tabular-nums"
    >
      {value}
    </motion.span>
  );
}

function LedgerCard({ sample, phase, run }: { sample: number; phase: number; run: boolean }) {
  const l = ledgerAt(sample, phase);
  const stats: { label: string; value: number; hint: string }[] = [
    {
      label: "Credits to spend",
      value: l.balance,
      hint: l.held ? `${l.held} held for a link` : "none held",
    },
    { label: "Links pointing at you", value: l.inbound, hint: "verified live" },
    { label: "Links you host", value: l.hosted, hint: "verified live" },
  ];
  return (
    <div className={cn(CARD, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-4 py-2.5">
        <span className="flex items-center gap-2 text-[0.8rem] font-semibold text-ink">
          <Wallet className="h-4 w-4 text-cta" />
          Credits
        </span>
        <span className="text-[0.66rem] text-muted-foreground">yoursite.com</span>
      </div>
      <div className="grid grid-cols-3 gap-px border-b border-ink/[0.06] bg-ink/[0.06]">
        {stats.map((st) => (
          <div key={st.label} className="bg-white px-3 py-2.5 sm:px-4">
            <p className="min-h-[2.5em] text-[0.62rem] font-medium leading-tight text-muted-foreground sm:min-h-0">
              {st.label}
            </p>
            <p className="mt-1 text-[1.2rem] font-semibold leading-none tracking-tight text-ink">
              <Figure value={st.value} run={run} />
            </p>
            <p className="mt-0.5 truncate text-[0.6rem] text-muted-foreground">{st.hint}</p>
          </div>
        ))}
      </div>
      <p className="px-4 pb-1 pt-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Recent activity
      </p>
      {/* Room for three rows from the start, so a new row never pushes the
          page below it down. */}
      <ul className="relative min-h-[9.25rem] px-2 pb-2">
        <AnimatePresence initial={false} mode="popLayout">
          {l.rows.slice(0, 3).map((e) => (
            <motion.li
              key={e.id}
              layout={run ? "position" : false}
              initial={run ? { opacity: 0, y: -10 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5"
            >
              <span className="min-w-0">
                <span className="block text-[0.76rem] font-medium text-ink">{e.label}</span>
                <span className="block truncate text-[0.64rem] text-muted-foreground">
                  {e.note}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span
                  className={cn(
                    "block text-[0.76rem] font-semibold tabular-nums",
                    e.credits > 0
                      ? "text-success"
                      : e.credits < 0
                        ? "text-ink"
                        : "text-muted-foreground",
                  )}
                >
                  {e.credits > 0 ? `+${e.credits}` : e.credits === 0 ? "—" : `−${-e.credits}`}
                </span>
                <span className="block text-[0.6rem] text-muted-foreground tabular-nums">
                  balance {e.balance}
                </span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/* ---------- The joints between the screens ---------- */

function Flow({
  dir,
  active,
  run,
  className,
}: {
  dir: "h" | "v";
  active: boolean;
  run: boolean;
  className?: string;
}) {
  const h = dir === "h";
  return (
    <div
      aria-hidden
      className={cn("relative", h ? "h-full w-full" : "mx-auto h-10 w-6", className)}
    >
      <span
        className={cn(
          "absolute border-dashed transition-colors duration-500",
          h ? "inset-x-1.5 top-1/2 border-t" : "inset-y-1.5 left-1/2 border-l",
          active ? "border-cta/55" : "border-ink/[0.16]",
        )}
      />
      {h ? (
        <ChevronRight
          className={cn(
            "absolute -right-0.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors duration-500",
            active ? "text-cta" : "text-ink/25",
          )}
        />
      ) : (
        <ChevronDown
          className={cn(
            "absolute -bottom-0.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 transition-colors duration-500",
            active ? "text-cta" : "text-ink/25",
          )}
        />
      )}
      {active && run && (
        <span className={cn("absolute", h ? "inset-x-1.5 top-1/2" : "inset-y-1.5 left-1/2")}>
          <motion.span
            className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-cta shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_18%,transparent)]"
            initial={h ? { left: "0%" } : { top: "0%" }}
            animate={h ? { left: "100%" } : { top: "100%" }}
            transition={{ duration: 0.85, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.15 }}
          />
        </span>
      )}
    </div>
  );
}

/* ---------- The whole relay ---------- */

/** The product's own header for the exchange: site, tabs, and the sample flag. */
function AppBar({ side }: { side: Side }) {
  const tabs: { id: Side | "overview"; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "get", label: "Get links" },
    { id: "give", label: "Give links" },
  ];
  return (
    <div className={cn(CARD, "flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4", "shadow-none")}>
      <Mark className="h-4 w-4 shrink-0 text-brand-blue" />
      <span className="text-[0.8rem] font-semibold text-ink">Backlinks</span>
      <span className="hidden items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.68rem] font-medium text-ink sm:inline-flex">
        yoursite.com
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </span>
      <span className="flex gap-0.5 sm:ml-2">
        {tabs.map((t) => {
          const on = t.id === side;
          return (
            <span
              key={t.id}
              className={cn(
                "rounded-md px-2 py-1 text-[0.68rem] font-medium transition-colors duration-500",
                on ? "bg-cta-soft font-semibold text-cta" : "text-muted-foreground",
                t.id === "overview" && "hidden md:inline",
              )}
            >
              {t.label}
            </span>
          );
        })}
      </span>
      <span className="ml-auto">
        <SampleBadge />
      </span>
    </div>
  );
}

export function LinkRelay({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // About half of it on screen before it plays, so it never runs while only
  // its top edge peeks over the fold. On a phone it is taller than the
  // screen, so it also plays while it fills the middle of the screen.
  const half = useInView(ref, { amount: 0.45 });
  const centred = useInView(ref, { margin: "-35% 0px -35% 0px" });
  const inView = half || centred;
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const run = inView && !reduce;

  // Off screen, start over, so the next visit sees it from the beginning.
  useEffect(() => {
    if (!inView) setStep(0);
  }, [inView]);

  useEffect(() => {
    if (!run) return;
    const id = window.setTimeout(() => setStep((n) => (n + 1) % STEPS), PHASE_MS[step % PER]);
    return () => window.clearTimeout(id);
  }, [run, step]);

  // Reduced motion is only known in the browser, so the first client render
  // draws the same frame the server did and switches after mounting.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shown = mounted && reduce ? FINAL : step;
  const sample = Math.floor(shown / PER);
  const phase = shown % PER;
  const s = SAMPLES[sample];

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Sample of the backlink exchange: a member's article about sprint reviews links to yoursite.com, the link is checked on the live page and found dofollow, and only then does the credit held in yoursite.com's ledger settle. Then the other side: yoursite.com's own article carries a member's link and earns a credit once it is verified live."
      className={cn("text-left", className)}
    >
      <AppBar side={s.side} />

      <div className="mt-3 grid grid-cols-1 lg:mt-4 lg:grid-cols-[minmax(0,1.12fr)_3.25rem_minmax(0,1fr)] lg:grid-rows-[auto_2.75rem_auto]">
        {/* Out of the flow on wide screens, so the article never sets the
            height: the two screens on the right do. */}
        <div className="relative lg:row-span-3">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={s.side}
              className="h-full lg:absolute lg:inset-0"
              initial={run ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <ArticleCard s={s} phase={phase} run={run} />
            </motion.div>
          </AnimatePresence>
        </div>

        <Flow dir="h" active={phase >= 2 && phase <= 5} run={run} className="hidden lg:block" />
        <Flow dir="v" active={phase >= 2 && phase <= 5} run={run} className="lg:hidden" />

        <div className="lg:col-start-3 lg:row-start-1">
          <CheckCard s={s} phase={phase} />
        </div>

        <Flow dir="v" active={phase >= 6} run={run} className="lg:col-start-3 lg:row-start-2" />

        <div className="lg:col-start-3 lg:row-start-3">
          <LedgerCard sample={sample} phase={phase} run={run} />
        </div>
      </div>
    </div>
  );
}

/* ---------- The band it sits in ---------- */

/* Graph paper in the brand blue, faint: a ledger's ruling rather than a
   painting, so this page's picture has its own ground. */
const GRAPH: CSSProperties = {
  backgroundColor: "#f6f9fe",
  backgroundImage:
    "linear-gradient(to right, rgba(24,119,242,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,119,242,0.07) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
  backgroundPosition: "-1px -1px",
};

export function GraphPaper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)} style={GRAPH}>
      {/* A soft white wash from the top, so the ruling recedes behind the
          screens rather than competing with them. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,255,255,0.85),transparent_70%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
