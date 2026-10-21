/**
 * The smaller pictures on /features/authority-backlinks: one per step, one
 * per benefit, the network drawn behind the hero and the closing band, and
 * the ledger that peeks out of the closing band.
 *
 * Each shows something the exchange really does (lib/exchange): pages with
 * rotating anchors, credits that are held and then settled or returned,
 * links that travel one way, verified member sites. No figure here is a
 * result: where a number appears it is the plan's own allowance or a count
 * in a sample, and partner sites are named by niche, not by a domain.
 */
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Ban,
  Check,
  CornerDownRight,
  Globe,
  Link2,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { ChatGPTMark, ClaudeMark, GeminiMark, PerplexityMark } from "@/components/landing/ai-logos";
import { useCycle } from "@/components/features/showcase/kit";
import { CARD } from "./relay";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROW = "rounded-lg border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]";

/* ---------- Step 1: pick your pages ---------- */

const TARGETS = [
  {
    url: "yoursite.com/templates/sprint-planning",
    anchors: ["sprint planning template", "free sprint template", "plan your next sprint"],
  },
  {
    url: "yoursite.com/blog/kanban-vs-scrum",
    anchors: ["kanban vs scrum", "choosing kanban or scrum"],
  },
];

export function TargetsPicture() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  // The anchor used next moves along, the way the exchange picks the one
  // used least so far.
  const turn = useCycle(6, 1700, 0, inView);
  return (
    <div ref={ref} className={cn(CARD, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-4 py-2.5">
        <span className="text-[0.78rem] font-semibold text-ink">Pages to rank</span>
        <span className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.64rem] font-semibold text-cta">
          Get links
        </span>
      </div>
      <ul className="space-y-2 p-3">
        {TARGETS.map((t, ti) => {
          const next = turn % t.anchors.length;
          return (
            <li key={t.url} className={cn(ROW, "px-3 py-2.5")}>
              <div className="flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 shrink-0 text-cta" />
                <span className="min-w-0 flex-1 truncate font-mono text-[0.7rem] text-ink">
                  {t.url}
                </span>
                {/* An "on" switch, as the dashboard shows an active target. */}
                <span
                  aria-hidden
                  className="flex h-4 w-7 shrink-0 items-center justify-end rounded-full bg-cta p-0.5"
                >
                  <span className="h-3 w-3 rounded-full bg-white" />
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 pl-[1.375rem]">
                {t.anchors.map((a, ai) => {
                  const on = ai === next;
                  return (
                    <span
                      key={a}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.64rem] font-medium transition-colors duration-500",
                        on
                          ? "border-cta/30 bg-cta-soft text-cta"
                          : "border-ink/[0.07] bg-white text-muted-foreground",
                      )}
                    >
                      {a}
                      {on && ti === 0 && (
                        <span className="text-[0.56rem] font-semibold uppercase tracking-wide">
                          next
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="flex items-center gap-1.5 border-t border-ink/[0.06] px-4 py-2 text-[0.64rem] text-muted-foreground">
        <RotateCcw className="h-3 w-3" />
        Anchor text rotates · each page gains links at a capped pace
      </p>
    </div>
  );
}

/* ---------- Step 2: earn and spend ---------- */

function Node({ own, children }: { own?: boolean; children: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 truncate rounded-md border px-1.5 py-0.5 text-[0.68rem] font-medium",
        own ? "border-cta/25 bg-cta-soft text-cta" : "border-ink/[0.08] bg-white text-ink",
      )}
    >
      {own ? (
        <Mark className="h-3 w-3 shrink-0" />
      ) : (
        <Globe className="h-3 w-3 shrink-0 text-ink/50" />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

export function CreditsPicture() {
  return (
    <div className="space-y-2">
      <div className={cn(ROW, "flex items-center gap-3 px-3 py-2.5")}>
        <span className="w-9 shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Give
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <Node own>yoursite.com</Node>
          <ArrowRight className="h-3 w-3 shrink-0 text-cta" />
          <Node>a meeting-notes app</Node>
        </span>
        <span className="shrink-0 rounded-md bg-success/12 px-1.5 py-0.5 text-[0.68rem] font-semibold text-success tabular-nums">
          +1
        </span>
      </div>
      <div className={cn(ROW, "flex items-center gap-3 px-3 py-2.5")}>
        <span className="w-9 shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Get
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <Node>a project-management blog</Node>
          <ArrowRight className="h-3 w-3 shrink-0 text-cta" />
          <Node own>yoursite.com</Node>
        </span>
        <span className="shrink-0 rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.68rem] font-semibold text-ink tabular-nums">
          −1
        </span>
      </div>
      {/* The swap the exchange never asks for. */}
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-ink/[0.12] px-3 py-2.5">
        <span className="w-9 shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
          Swap
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 opacity-55">
          <span className="truncate text-[0.68rem] font-medium text-muted-foreground line-through decoration-[#e11d48]/50">
            yoursite.com → a project-management blog
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-[0.64rem] font-semibold text-[#e11d48]">
          <X className="h-3 w-3" strokeWidth={2.5} />
          Never asked
        </span>
      </div>
    </div>
  );
}

/* ---------- Step 3: verified live ---------- */

const TRACK = [
  { label: "Reserved", note: "credit held" },
  { label: "Placed", note: "link in the article" },
  { label: "Live", note: "checked, credits move" },
] as const;

export function StatusPicture() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const at = useCycle(4, 1300, 2, inView);
  const reached = Math.min(at, 2);
  return (
    <div ref={ref} className={cn(CARD, "px-4 pb-4 pt-5 sm:px-5")}>
      <ol className="relative grid grid-cols-3">
        {/* The rail, filling as the link moves along it. */}
        <span
          aria-hidden
          className="absolute left-[16.66%] right-[16.66%] top-[0.6875rem] h-[2px] rounded-full bg-ink/[0.07]"
        >
          <span
            className="block h-full rounded-full bg-cta transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${reached * 50}%` }}
          />
        </span>
        {TRACK.map((t, i) => {
          const done = i <= reached;
          const live = done && i === 2;
          return (
            <li key={t.label} className="relative flex flex-col items-center text-center">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white transition-colors duration-500",
                  live
                    ? "border-success bg-success text-white"
                    : done
                      ? "border-cta text-cta"
                      : "border-ink/[0.12] text-transparent",
                )}
              >
                {live ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <span className={cn("h-1.5 w-1.5 rounded-full", done ? "bg-cta" : "")} />
                )}
              </span>
              <span
                className={cn(
                  "mt-2 text-[0.74rem] font-semibold transition-colors duration-500",
                  live ? "text-success" : done ? "text-ink" : "text-ink/45",
                )}
              >
                {t.label}
              </span>
              <span className="mt-0.5 text-[0.62rem] leading-snug text-muted-foreground">
                {t.note}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 flex items-center gap-2 rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_50%,white)] px-3 py-2 text-[0.66rem] text-muted-foreground">
        <CornerDownRight className="h-3 w-3 shrink-0" />
        Never goes live? The held credit is returned.
      </p>
    </div>
  );
}

/* ---------- Benefit: verified sources ---------- */

const PROOFS = ["Proved control of its domain", "Paying Rankbox member", "Publishes real articles"];
const NEVER = ["Link farms", "Private blog networks", "Sites that only sell links"];

export function VerifiedPicture() {
  return (
    <div className="mx-auto w-full max-w-[24rem] space-y-3">
      <div className={cn(CARD, "overflow-hidden")}>
        <div className="flex items-center gap-2.5 border-b border-ink/[0.06] px-4 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white">
            <Globe className="h-3.5 w-3.5 text-ink/55" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.8rem] font-semibold text-ink">
              A project-management blog
            </span>
            <span className="block text-[0.64rem] text-muted-foreground">Member site</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-success/12 px-1.5 py-0.5 text-[0.64rem] font-semibold text-success">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </span>
        </div>
        <ul className="divide-y divide-ink/[0.05] px-4">
          {PROOFS.map((p) => (
            <li key={p} className="flex items-center gap-2.5 py-2.5 text-[0.76rem] text-ink">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-dashed border-ink/[0.12] bg-white/60 px-4 py-3">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Never in the network
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {NEVER.map((n) => (
            <span
              key={n}
              className="inline-flex items-center gap-1 rounded-md border border-ink/[0.07] bg-white px-1.5 py-0.5 text-[0.66rem] text-muted-foreground line-through decoration-[#e11d48]/45"
            >
              <Ban className="h-3 w-3 text-[#e11d48]/70" />
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Benefit: authority that compounds ---------- */

const PAGES = [
  { label: "/pricing", future: false },
  { label: "/templates/sprint-planning", future: false },
  { label: "/blog/kanban-vs-scrum", future: false },
  { label: "Next article", future: true },
  { label: "The one after", future: true },
];

export function CompoundPicture() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const reduce = useReducedMotion();
  const show = inView || !!reduce;
  return (
    <div ref={ref} className="mx-auto w-full max-w-[25rem]">
      {/* Links in from member sites, meeting at the domain. */}
      <div className="flex justify-center gap-3">
        {["A member's article", "A member's article", "A member's article"].map((l, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.6rem] font-medium text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
          >
            <Globe className="h-2.5 w-2.5" />
            <span className="hidden sm:inline">{l}</span>
            <span className="sm:hidden">Member</span>
          </span>
        ))}
      </div>
      <svg aria-hidden viewBox="0 0 300 34" className="mx-auto block h-8 w-[78%]" fill="none">
        {[30, 150, 270].map((x, i) => (
          <motion.path
            key={x}
            d={`M ${x} 2 C ${x} 20, 150 14, 150 32`}
            stroke="var(--cta)"
            strokeOpacity={0.55}
            strokeWidth={1.4}
            strokeDasharray="3 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: show ? 1 : 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }
            }
          />
        ))}
      </svg>
      <div className={cn(CARD, "flex items-center gap-2.5 px-3.5 py-2.5")}>
        <Mark className="h-4 w-4 shrink-0 text-brand-blue" />
        <span className="text-[0.8rem] font-semibold text-ink">yoursite.com</span>
        <span className="ml-auto text-[0.62rem] font-medium text-muted-foreground">
          Domain authority
        </span>
        <span className="block h-1.5 w-16 overflow-hidden rounded-full bg-ink/[0.06]">
          <motion.span
            className="block h-full origin-left rounded-full bg-cta"
            initial={{ scaleX: 0.3 }}
            animate={{ scaleX: show ? 0.72 : 0.3 }}
            transition={reduce ? { duration: 0 } : { duration: 1.2, delay: 0.5, ease: EASE }}
          />
        </span>
      </div>
      {/* Every page on the domain, and the ones not written yet. */}
      <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {PAGES.map((p, i) => (
          <motion.li
            key={p.label}
            className={cn(
              "relative overflow-hidden rounded-lg px-2.5 pb-2 pt-2.5 text-[0.64rem]",
              p.future
                ? "border border-dashed border-cta/30 bg-white/70 text-cta"
                : "border border-ink/[0.07] bg-white font-mono text-ink/75",
              i === PAGES.length - 1 && "hidden sm:block",
            )}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.5, delay: 0.7 + i * 0.08, ease: EASE }
            }
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-0 top-0 h-[3px]",
                p.future ? "bg-cta/30" : "bg-cta/70",
              )}
            />
            <span className="block truncate">{p.label}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Benefit: trust signals for AI ---------- */

const ENGINES = [ChatGPTMark, PerplexityMark, GeminiMark, ClaudeMark];

export function AnswerPicture() {
  return (
    <div className={cn(CARD, "mx-auto w-full max-w-[25rem] overflow-hidden")}>
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-4 py-2.5">
        <span className="flex -space-x-1">
          {ENGINES.map((M, i) => (
            <span
              key={i}
              className="flex h-5 w-5 items-center justify-center rounded-md border border-ink/[0.08] bg-white"
            >
              <M className="h-3 w-3" />
            </span>
          ))}
        </span>
        <span className="rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Sample answer
        </span>
      </div>
      <div className="space-y-3 p-4">
        <p className="ml-auto w-fit max-w-[88%] rounded-lg border border-ink/[0.07] bg-white px-3 py-2 text-[0.74rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          Good sprint planning template for a small team?
        </p>
        <div className="space-y-1.5">
          <span className="block h-[7px] w-full rounded-full bg-ink/[0.07]" />
          <span className="block h-[7px] w-[86%] rounded-full bg-ink/[0.07]" />
        </div>
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Sources
          </p>
          <ul className="mt-1.5 space-y-1">
            <li className="flex items-center gap-2 rounded-md border border-cta/25 bg-cta-soft px-2 py-1.5">
              <Mark className="h-3 w-3 shrink-0 text-brand-blue" />
              <span className="truncate font-mono text-[0.64rem] text-ink">
                yoursite.com/templates/sprint-planning
              </span>
            </li>
            {["82%", "64%"].map((w) => (
              <li
                key={w}
                className="flex items-center gap-2 rounded-md border border-ink/[0.06] px-2 py-1.5"
              >
                <Globe className="h-3 w-3 shrink-0 text-ink/35" />
                <span className="block h-[6px] rounded-full bg-ink/[0.07]" style={{ width: w }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- The network, behind the hero ---------- */

/* Member sites as small tiles, kept to the edges so the copy stays clear,
   joined by hairlines. A few joins carry a link one way, never back. Fixed
   coordinates, so server and client draw the same thing. */
const NODES: [number, number][] = [
  [70, 90],
  [190, 40],
  [150, 210],
  [40, 330],
  [210, 380],
  [110, 520],
  [250, 560],
  [1080, 70],
  [960, 150],
  [1110, 270],
  [990, 330],
  [1060, 470],
  [920, 540],
  [1120, 590],
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [5, 6],
  [7, 8],
  [7, 9],
  [8, 10],
  [9, 10],
  [10, 11],
  [11, 12],
  [11, 13],
  [12, 13],
];
/* Edges that carry a link, and which way it travels. */
const FLOWS = [1, 5, 7, 11, 14];

export function NetworkField({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  // The flows run only while the field is on screen.
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const animateFlows = inView && !reduce;
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 1160 640"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      fill="none"
    >
      {EDGES.map(([a, b], i) => {
        const [x1, y1] = NODES[a];
        const [x2, y2] = NODES[b];
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--ink)"
              strokeOpacity={0.09}
              strokeWidth={1}
            />
            {FLOWS.includes(i) && (
              <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--brand-blue)"
                strokeOpacity={0.55}
                strokeWidth={1.4}
                strokeDasharray="4 8"
                initial={{ strokeDashoffset: 0 }}
                animate={animateFlows ? { strokeDashoffset: -48 } : { strokeDashoffset: 0 }}
                transition={
                  animateFlows
                    ? { duration: 2.4 + (i % 3) * 0.5, ease: "linear", repeat: Infinity }
                    : { duration: 0 }
                }
              />
            )}
          </g>
        );
      })}
      {NODES.map(([x, y], i) => (
        <g key={i} transform={`translate(${x - 13} ${y - 13})`}>
          <rect width={26} height={26} rx={7} fill="#fff" stroke="var(--ink)" strokeOpacity={0.1} />
          <rect x={8} y={9} width={10} height={2} rx={1} fill="var(--ink)" fillOpacity={0.16} />
          <rect x={8} y={14} width={7} height={2} rx={1} fill="var(--ink)" fillOpacity={0.1} />
        </g>
      ))}
    </svg>
  );
}

/* ---------- The closing band's peek ---------- */

const PEEK = [
  { label: "Link went live", note: "link verified live", credits: "—", tone: "muted" },
  { label: "Hosted link went live", note: "hosted link verified live", credits: "+1", tone: "up" },
  {
    label: "Held for a link",
    note: "reserved on a project-management blog",
    credits: "−1",
    tone: "ink",
  },
  { label: "Monthly grant", note: "monthly plan grant", credits: "+30", tone: "up" },
] as const;

export function LedgerPeek() {
  return (
    <div
      className={cn(
        CARD,
        "rounded-b-none text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]",
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-4 py-3">
        <span className="flex items-center gap-2 text-[0.82rem] font-semibold text-ink">
          <Mark className="h-4 w-4 text-brand-blue" />
          Recent activity
        </span>
        <span className="rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Sample
        </span>
      </div>
      <ul className="divide-y divide-ink/[0.05] px-4">
        {PEEK.map((e) => (
          <li key={e.label} className="flex items-center justify-between gap-3 py-2.5">
            <span className="min-w-0">
              <span className="block text-[0.8rem] font-medium text-ink">{e.label}</span>
              <span className="block truncate text-[0.66rem] text-muted-foreground">{e.note}</span>
            </span>
            <span
              className={cn(
                "shrink-0 text-[0.8rem] font-semibold tabular-nums",
                e.tone === "up"
                  ? "text-success"
                  : e.tone === "ink"
                    ? "text-ink"
                    : "text-muted-foreground",
              )}
            >
              {e.credits}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
