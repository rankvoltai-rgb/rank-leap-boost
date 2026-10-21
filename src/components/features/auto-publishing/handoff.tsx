/**
 * The page's focal picture: the handoff, as publishing works today. On the
 * left, Rankbox's publishing queue for yoursite.com; on the right, that
 * site's blog; between them, the publishing API. A finished article doesn't
 * get pushed anywhere: the site's own code asks for what changed, receives
 * the article, publishes it, and reports the live URL back, which is when
 * Rankbox marks it Live.
 *
 * The connector line under the cards comes from data/auto-publishing.ts, so
 * the day a connector ships the picture says so too. The articles are
 * samples, the window says so, and the site is "yoursite.com".
 *
 * Runs only while about half of it is on screen and starts over once it
 * leaves. With reduced motion it shows the last frame, the URL reported.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Check, ChevronDown, CodeXml, FileText, Hourglass, Link2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import type { PlatformId } from "@/data/platforms";
import {
  API_BASE,
  API_DESTINATION,
  CONNECTOR_STATUS_SENTENCE,
  destinationsIn,
  paceOptionLabel,
} from "@/data/auto-publishing";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- Sample articles ---------- */

interface Sample {
  title: string;
  description: string;
  /** First 8 characters of the article id, which the API appends to the slug. */
  id: string;
  score: number;
}

const SAMPLES: Sample[] = [
  {
    title: "How to Price a SaaS Product in Year One",
    description: "Pick a value metric, set three tiers, and test before you raise.",
    id: "8f3c2a91",
    score: 94,
  },
  {
    title: "Onboarding Emails That Turn Trials into Customers",
    description: "Seven emails, sent on what people do rather than the calendar.",
    id: "2b71e0c4",
    score: 92,
  },
  {
    title: "What to Put on a Pricing Page",
    description: "The sections buyers look for, in the order they read them.",
    id: "c94d1a07",
    score: 96,
  },
  {
    title: "How to Write a Changelog People Read",
    description: "Lead with the change, keep it short, and link to the docs.",
    id: "5e08b3f2",
    score: 91,
  },
];

const sample = (i: number) => SAMPLES[((i % SAMPLES.length) + SAMPLES.length) % SAMPLES.length];
const kebab = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const livePath = (s: Sample) => `/blog/${kebab(s.title)}`;

/* ---------- The timeline ---------- */

const STEPS = [
  "writing",
  "checking",
  "finished",
  "request",
  "response",
  "publish",
  "report",
  "live",
] as const;
type Step = (typeof STEPS)[number];

const MS: Record<Step, number> = {
  writing: 1700,
  checking: 1700,
  finished: 900,
  request: 1050,
  response: 1150,
  publish: 1100,
  report: 1050,
  live: 3000,
};
const at = (s: Step) => STEPS.indexOf(s);
const LAST = STEPS.length - 1;

/** The three calls that cross the wire, and which way each one travels. */
const CALLS = {
  request: { method: "GET", path: "/articles?since=", toSite: false },
  response: { method: "GET", path: "/articles?since=", toSite: true },
  report: { method: "PATCH", path: "/articles/:id", toSite: false },
} as const;
type Call = keyof typeof CALLS;

const PACE = 5;
const CHECKS = ["Keyword in title", "Meta description", "FAQ for AI engines"];

/* ---------- Small parts ---------- */

type RowStage = "live" | "finished" | "checking" | "writing" | "scheduled";

function StageChip({ stage, score, day }: { stage: RowStage; score?: ReactNode; day?: string }) {
  const base =
    "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold";
  if (stage === "live")
    return (
      <span className={cn(base, "bg-success/12 text-success")}>
        <Check className="h-3 w-3" strokeWidth={3} />
        Live
      </span>
    );
  if (stage === "finished") return <span className={cn(base, "bg-cta text-white")}>Finished</span>;
  if (stage === "checking")
    return (
      <span className={cn(base, "bg-cta-soft text-cta")}>
        Checking <span className="tabular-nums">{score}</span>
      </span>
    );
  if (stage === "writing")
    return (
      <span className={cn(base, "gap-1.5 bg-cta-soft text-cta")}>
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cta" />
        </span>
        Writing
      </span>
    );
  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <span className="text-[0.62rem] text-muted-foreground">{day}</span>
      <span className={cn(base, "border border-ink/[0.08] font-medium text-muted-foreground")}>
        Scheduled
      </span>
    </span>
  );
}

/** A count that climbs while the draft is being checked. */
function useScore(target: number, running: boolean, settled: boolean) {
  const value = useMotionValue(settled ? target : 61);
  const text = useTransform(value, (v) => String(Math.round(v)));
  useEffect(() => {
    if (settled) {
      value.jump(target);
      return;
    }
    if (!running) {
      value.jump(61);
      return;
    }
    const controls = animate(value, target, { duration: 1.3, ease: [0.33, 0, 0.2, 1] });
    return () => controls.stop();
  }, [running, settled, target, value]);
  return text;
}

/* ---------- Rankbox: the publishing queue ---------- */

function QueueCard({ n, step, run }: { n: number; step: number; run: boolean }) {
  const focal = sample(n);
  const focalStage: RowStage =
    step === at("writing")
      ? "writing"
      : step === at("checking")
        ? "checking"
        : step >= at("live")
          ? "live"
          : "finished";
  const score = useScore(focal.score, run && step === at("checking"), step > at("checking"));

  // Absolute positions in the stream, so rows keep their identity (and
  // glide) as each article moves up the queue.
  const rows: { i: number; stage: RowStage; day?: string }[] = [
    { i: n - 1, stage: "live" },
    { i: n, stage: focalStage },
    { i: n + 1, stage: "scheduled", day: "Thu" },
    { i: n + 2, stage: "scheduled", day: "Fri" },
  ];

  const liveConnectors = destinationsIn("available").filter((d) => d.id !== "api");
  const awaiting = destinationsIn("awaiting-approval");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_56px_-28px_rgba(4,24,72,0.35)]">
      <div className="flex h-11 items-center gap-2.5 border-b border-ink/[0.06] px-3.5">
        <Mark className="h-[18px] w-[18px] shrink-0 text-brand-blue" />
        <span className="text-[0.8rem] font-semibold text-ink">Publishing</span>
        <span className="hidden items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.66rem] font-medium text-ink min-[400px]:flex">
          yoursite.com
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </span>
        <span className="ml-auto rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Sample
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-3.5 py-2 text-[0.68rem]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          Pace
          <span className="rounded-md bg-cta px-1.5 py-0.5 font-semibold text-white">
            {paceOptionLabel(PACE)}
          </span>
        </span>
        <span className="flex items-center gap-1.5 font-medium text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-cta" />
          Autopilot <span className="font-semibold text-cta">On</span>
        </span>
      </div>

      <ul className="flex-1 space-y-1.5 p-3">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map(({ i, stage, day }) => {
            const s = sample(i);
            const isFocal = i === n;
            return (
              <motion.li
                key={i}
                layout={run ? "position" : false}
                initial={run ? { opacity: 0, y: 12 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
                transition={{ duration: 0.55, ease: EASE }}
                className={cn(
                  "relative overflow-hidden rounded-lg border px-3 py-2.5 transition-[border-color,background-color] duration-500",
                  isFocal && stage !== "live"
                    ? "border-cta/25 bg-[color-mix(in_oklab,var(--cta)_3.5%,white)]"
                    : "border-ink/[0.07] bg-white",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-[0.76rem] font-medium",
                      stage === "scheduled" ? "text-ink/60" : "text-ink",
                    )}
                  >
                    {s.title}
                  </span>
                  <StageChip
                    stage={stage}
                    day={day}
                    score={isFocal ? <motion.span>{score}</motion.span> : null}
                  />
                </div>

                {stage === "live" && (
                  <p className="mt-1 flex items-center gap-1 truncate font-mono text-[0.62rem] text-muted-foreground">
                    <Link2 className="h-3 w-3 shrink-0 text-success" />
                    yoursite.com{livePath(s)}
                  </p>
                )}

                {isFocal && stage === "checking" && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {CHECKS.map((c, k) => (
                      <motion.span
                        key={c}
                        initial={run ? { opacity: 0, scale: 0.9 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 + k * 0.3, duration: 0.3, ease: EASE }}
                        className="inline-flex items-center gap-1 rounded-md border border-ink/[0.07] bg-white px-1.5 py-0.5 text-[0.6rem] text-ink/75"
                      >
                        <Check className="h-2.5 w-2.5 text-success" strokeWidth={3} />
                        {c}
                      </motion.span>
                    ))}
                  </div>
                )}

                {isFocal && stage === "finished" && (
                  <p className="mt-1 text-[0.62rem] text-muted-foreground">
                    Ready for your site · SEO <span className="tabular-nums">{s.score}</span>
                  </p>
                )}

                {/* The draft being written fills a hairline as it goes. */}
                {isFocal && stage === "writing" && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-cta/70"
                    initial={{ scaleX: run ? 0 : 0.6 }}
                    animate={{ scaleX: run ? 1 : 0.6 }}
                    transition={{ duration: run ? MS.writing / 1000 : 0, ease: "linear" }}
                  />
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-ink/[0.06] px-3.5 py-2.5">
        <span className="text-[0.62rem] text-muted-foreground">Delivered through</span>
        <span className="inline-flex items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
          <CodeXml className="h-3 w-3" />
          Publishing API
        </span>
        {liveConnectors.map((d) => (
          <span
            key={d.id}
            className="inline-flex items-center gap-1 rounded-md border border-ink/[0.08] px-1 py-0.5 text-[0.62rem] font-medium text-ink"
          >
            <IntegrationLogo id={d.id as PlatformId} title={false} className="h-3.5 w-3.5" />
            {d.name}
          </span>
        ))}
        {awaiting.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5">
            <span className="flex -space-x-1 opacity-45 grayscale">
              {awaiting.map((d) => (
                <IntegrationLogo
                  key={d.id}
                  id={d.id as PlatformId}
                  title={false}
                  className="h-4 w-4 ring-2 ring-white"
                />
              ))}
            </span>
            <span className="flex items-center gap-1 text-[0.6rem] text-muted-foreground">
              <Hourglass className="h-3 w-3" />
              Awaiting approval
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- The wire: the publishing API between the two ---------- */

function Packet({ call, axis, run }: { call: Call; axis: "x" | "y"; run: boolean }) {
  const { toSite } = CALLS[call];
  const prop = axis === "x" ? "left" : "top";
  const from = toSite ? "0%" : "100%";
  const to = toSite ? "100%" : "0%";
  const duration = (MS[call] - 150) / 1000;
  return (
    <motion.span
      className={cn(
        "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 font-mono text-[0.62rem] font-semibold shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_10%,transparent),0_6px_14px_-6px_rgba(4,24,72,0.4)]",
        axis === "x" ? "top-1/2" : "left-1/2",
        call === "response" ? "bg-cta text-white" : "border border-cta/30 bg-white text-cta",
      )}
      initial={{ [prop]: run ? from : to, opacity: 0 }}
      animate={{ [prop]: to, opacity: run ? [0, 1, 1, 0] : 0 }}
      transition={{
        duration,
        ease: [0.45, 0, 0.2, 1],
        opacity: { duration, times: [0, 0.12, 0.84, 1] },
      }}
    >
      {call === "response" ? (
        <>
          <FileText className="h-3 w-3" />1 article
        </>
      ) : (
        CALLS[call].method
      )}
    </motion.span>
  );
}

function Track({
  axis,
  call,
  run,
  className,
}: {
  axis: "x" | "y";
  call: Call | null;
  run: boolean;
  className?: string;
}) {
  const active = call !== null;
  return (
    <div
      aria-hidden
      className={cn("relative", axis === "x" ? "h-8 w-full" : "w-8 self-stretch", className)}
    >
      {/* The line, dashed at rest and drawn solid while a call is crossing. */}
      <span
        className={cn(
          "absolute",
          axis === "x"
            ? "inset-x-0 top-1/2 h-0 -translate-y-1/2 border-t-[1.5px] border-dashed"
            : "inset-y-0 left-1/2 w-0 -translate-x-1/2 border-l-[1.5px] border-dashed",
          "border-cta/30",
        )}
      />
      <motion.span
        className={cn(
          "absolute bg-cta/70",
          axis === "x"
            ? "inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2"
            : "inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2",
        )}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* Sockets where the wire meets each card. */}
      {(["start", "end"] as const).map((end) => (
        <span
          key={end}
          className={cn(
            "absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-cta shadow-[0_0_0_1px_color-mix(in_oklab,var(--cta)_30%,transparent)]",
            axis === "x"
              ? cn("top-1/2", end === "start" ? "left-0" : "left-full")
              : cn("left-1/2", end === "start" ? "top-0" : "top-full"),
          )}
        />
      ))}
      <AnimatePresence>
        {call && <Packet key={`${call}`} call={call} axis={axis} run={run} />}
      </AnimatePresence>
    </div>
  );
}

/** The two calls the site makes, as a request log: each lights while it's
 *  crossing the wire and shows its response once it lands. */
function CallLog({ step, className }: { step: number; className?: string }) {
  const lines = [
    {
      method: "GET",
      path: "/articles?since=",
      on: step === at("request") || step === at("response"),
      done: step >= at("publish"),
      result: "200 · 1 article",
    },
    {
      method: "PATCH",
      path: "/articles/:id",
      on: step === at("report"),
      done: step >= at("live"),
      result: "200 · URL saved",
    },
  ];
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-ink/[0.08] bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.05),0_12px_28px_-18px_rgba(4,24,72,0.35)]",
        className,
      )}
    >
      <p className="truncate border-b border-ink/[0.06] px-2.5 py-1.5 font-mono text-[0.58rem] text-muted-foreground">
        {API_BASE}
      </p>
      {lines.map((l, k) => (
        <div
          key={l.method}
          className={cn(
            "relative px-2.5 py-2 transition-colors duration-300",
            k > 0 && "border-t border-ink/[0.06]",
            l.on && "bg-[color-mix(in_oklab,var(--cta)_6%,white)]",
          )}
        >
          <span
            className={cn(
              "absolute inset-y-0 left-0 w-[2px] bg-cta transition-opacity duration-300",
              l.on ? "opacity-100" : "opacity-0",
            )}
          />
          <div className="flex items-center gap-1.5 font-mono text-[0.6rem]">
            <span
              className={cn(
                "shrink-0 rounded px-1 py-px font-semibold",
                l.method === "GET" ? "bg-success/10 text-success" : "bg-cta-soft text-cta",
              )}
            >
              {l.method}
            </span>
            <span className="truncate text-ink/80">{l.path}</span>
          </div>
          <p
            className={cn(
              "mt-1 text-[0.58rem] font-medium transition-colors duration-300",
              l.done ? "text-success" : l.on ? "text-cta" : "text-muted-foreground",
            )}
          >
            {l.done ? l.result : l.on ? "In flight…" : "Waiting"}
          </p>
        </div>
      ))}
    </div>
  );
}

function ApiChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.7rem] font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta text-white">
        <CodeXml className="h-3 w-3" />
      </span>
      Publishing API
    </span>
  );
}

/* ---------- yoursite.com: the blog ---------- */

function SiteCard({ n, step, run }: { n: number; step: number; run: boolean }) {
  const published = step >= at("publish");
  const posts = (published ? [n, n - 1, n - 2] : [n - 1, n - 2, n - 3]).map((i) => ({
    i,
    fresh: published && i === n,
  }));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_56px_-28px_rgba(4,24,72,0.35)]">
      <div className="flex h-11 items-center gap-3 border-b border-ink/[0.06] px-3.5">
        <span className="flex gap-1">
          {[0, 1, 2].map((k) => (
            <span key={k} className="h-2 w-2 rounded-full bg-ink/[0.12]" />
          ))}
        </span>
        <span className="flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-md bg-ink/[0.04] px-2 text-[0.66rem] text-ink/70">
          <Lock className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
          <span className="truncate">yoursite.com/blog</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        {/* The site's own header, left as a sketch: it's whatever yours is. */}
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-md bg-ink/[0.1]" />
          <span className="h-2 w-16 rounded-full bg-ink/[0.1]" />
          <span className="ml-auto h-1.5 w-8 rounded-full bg-ink/[0.07]" />
          <span className="h-1.5 w-8 rounded-full bg-ink/[0.07]" />
          <span className="h-1.5 w-8 rounded-full bg-ink/[0.07]" />
        </div>
        <p className="mt-4 font-display text-[1.15rem] font-semibold tracking-tight text-ink">
          Blog
        </p>

        <ul className="mt-2.5 flex-1 space-y-1.5">
          <AnimatePresence initial={false} mode="popLayout">
            {posts.map(({ i, fresh }) => {
              const s = sample(i);
              return (
                <motion.li
                  key={i}
                  layout={run ? "position" : false}
                  initial={run ? { opacity: 0, y: -10, scale: 0.98 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 transition-[border-color,background-color] duration-700",
                    fresh
                      ? "border-cta/25 bg-[color-mix(in_oklab,var(--cta)_4%,white)]"
                      : "border-ink/[0.06] bg-white",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-[0.76rem] font-semibold text-ink">
                      {s.title}
                    </p>
                    {fresh && (
                      <span className="shrink-0 rounded-md bg-cta px-1.5 py-0.5 text-[0.58rem] font-semibold text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[0.66rem] text-muted-foreground">
                    {s.description}
                  </p>
                  {fresh && (
                    <p className="mt-1 truncate font-mono text-[0.6rem] text-cta">{livePath(s)}</p>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

/* ---------- The scene ---------- */

export function Handoff({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  const [step, setStep] = useState(0);
  const run = inView && !reduce;

  // Reduced motion: the last frame, held.
  useEffect(() => {
    if (!reduce) return;
    setN(0);
    setStep(LAST);
  }, [reduce]);

  // Off screen: back to the start, so the next visit sees the whole handoff.
  useEffect(() => {
    if (reduce || inView) return;
    setN(0);
    setStep(0);
  }, [inView, reduce]);

  useEffect(() => {
    if (!run) return;
    const id = window.setTimeout(() => {
      if (step === LAST) {
        setN((x) => x + 1);
        setStep(0);
      } else setStep((s) => s + 1);
    }, MS[STEPS[step]]);
    return () => window.clearTimeout(id);
  }, [run, step]);

  const name = STEPS[step];
  const call: Call | null =
    name === "request" || name === "response" || name === "report" ? name : null;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Sample: Rankbox finishes and checks an article, yoursite.com pulls it through the publishing API, publishes it on its blog, and reports the live URL back, which marks the article Live in Rankbox."
      className={cn(
        "grid items-stretch gap-0 lg:grid-cols-[minmax(0,1fr)_11.5rem_minmax(0,1fr)]",
        className,
      )}
    >
      <QueueCard n={n} step={step} run={run} />

      {/* Between the cards: across on a wide screen, down on a phone, where
          the wire runs card to card beside the request log. */}
      <div className="hidden flex-col items-center justify-center gap-3 lg:flex">
        <ApiChip />
        <Track axis="x" call={call} run={run} />
        <CallLog step={step} className="w-[calc(100%-1.5rem)]" />
      </div>
      <div className="flex items-stretch gap-5 pl-6 pr-2 sm:pl-10 lg:hidden">
        <Track axis="y" call={call} run={run} className="shrink-0" />
        <div className="flex max-w-[16rem] flex-1 flex-col items-start gap-2.5 py-5">
          <ApiChip />
          <CallLog step={step} className="w-full" />
        </div>
      </div>

      <SiteCard n={n} step={step} run={run} />
    </div>
  );
}

/** The status line under the scene: the API's real status, and the
 *  connectors' when any are still waiting. */
export function HandoffLegend() {
  return (
    <div className="flex flex-col items-center gap-2 text-center text-[0.78rem] sm:flex-row sm:justify-center sm:gap-5 sm:text-left">
      <span className="inline-flex items-center gap-1.5 font-medium text-ink">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
        Publishing API · {API_DESTINATION.status}
      </span>
      {CONNECTOR_STATUS_SENTENCE && (
        <span className="max-w-md text-balance text-muted-foreground sm:max-w-none">
          <Hourglass className="-mt-0.5 mr-1.5 inline h-3.5 w-3.5 text-[oklch(0.55_0.14_70)]" />
          {CONNECTOR_STATUS_SENTENCE}
        </span>
      )}
    </div>
  );
}
