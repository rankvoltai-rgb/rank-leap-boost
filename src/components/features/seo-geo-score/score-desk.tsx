/**
 * The page's focal picture: a draft on the proofing table, with its
 * scorecard laid over the corner.
 *
 * The scorecard follows the Rankbox editor: one score gauge with the
 * editor's bands and verdicts, the checklist's icons and detail lines (word
 * for word from the editor), and "n of 11 checks passed". The GEO readout
 * counts the six checks the Rank page groups as "What AI engines look for".
 * Each open check carries a numbered flag, and the same number sits in the
 * draft's margin where its fix lands.
 *
 * The story, once the picture is about half on screen: the draft is flagged
 * at 76 with 2 of 6 AI signals; four fixes land one by one (the keyword moves
 * into the opening answer, sources get linked, a third section and an FAQ
 * are added); the score climbs 81, 88, 92, 96 and the signals fill to 6 of 6.
 * The meta description stays a warning, so it's ready without being perfect.
 * The arithmetic is the editor's: weights from the scoring docs, 105 points
 * with a keyword set. It starts over when it comes back on screen; with
 * reduced motion it shows the finished frame.
 *
 * Sample data on "yoursite.com", and labelled as such.
 */
import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { useStory } from "./clock";
import {
  AMBER_TEXT,
  Flag,
  ScoreRing,
  StatusIcon,
  TextBar,
  type FlagState,
  type Status,
} from "./parts";
import { scoreTone, verdict } from "./bands";

/* Draft, then each fix as two beats (the edit lands, then its check
   resolves), then ready. */
const DURATIONS = [2000, 650, 1350, 650, 1350, 650, 1350, 650, 1500, 4400] as const;
const READY = DURATIONS.length - 1;

/* By fixes resolved. 80 of 105 points to start, then +5, +7, +5, +4. */
const SCORES = [76, 81, 88, 92, 96];
/* By edits landed: the new opening, the links, the section, the FAQ. */
const WORDS = [1840, 1846, 1846, 1912, 1986];
const BASE_PASSED = 6;
const TOTAL_CHECKS = 11;

/* The Rank page's six AI signals, in its order. Depth and Easy to read pass
   from the start. */
const SIGNALS = [
  "Answers up front",
  "FAQ section",
  "Clear sections",
  "Cites sources",
  "Depth",
  "Easy to read",
] as const;

interface Fix {
  label: string;
  /** The check's label once it passes, where the editor changes it. */
  passLabel?: string;
  from: Status;
  open: string;
  pass: (h2: number) => string;
  signal: (typeof SIGNALS)[number];
}

const FIXES: Fix[] = [
  {
    label: "Keyword in introduction",
    from: "warn",
    open: "Mention the keyword early in the intro.",
    pass: () => "Keyword appears in the first 100 words.",
    signal: "Answers up front",
  },
  {
    label: "Internal & external links",
    from: "fail",
    open: "Add links to relevant pages and sources.",
    pass: () => "3 links add authority and context.",
    signal: "Cites sources",
  },
  {
    label: "Section structure",
    passLabel: "Clear section structure",
    from: "warn",
    open: "Only 2 H2 — add more sections.",
    pass: (h2) => `${h2} H2 sections help scanning and AI parsing.`,
    signal: "Clear sections",
  },
  {
    label: "FAQ for AI engines",
    from: "warn",
    open: "Add a FAQ section for AI citations.",
    pass: () => "FAQ section helps AI answer engines cite you.",
    signal: "FAQ section",
  },
];

/* Where the story is, from the phase. */
function read(phase: number) {
  const edits = Math.min(FIXES.length, Math.floor((phase + 1) / 2));
  const resolved = Math.min(FIXES.length, Math.floor(phase / 2));
  const activeFix = phase > 0 && phase < READY ? Math.ceil(phase / 2) : 0;
  const flag = (n: number): FlagState =>
    activeFix === n ? "active" : resolved >= n ? "done" : "open";
  /* The new text stays highlighted while its fix is the one landing. */
  const fresh = (n: number) => activeFix === n && edits >= n;
  return { edits, resolved, activeFix, flag, fresh, ready: phase === READY };
}

/* ---------- Small pieces ---------- */

function Count({ value, still }: { value: number; still: boolean }) {
  const spring = useSpring(value, { stiffness: 70, damping: 20 });
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString("en-US"));
  useEffect(() => {
    if (still) spring.jump(value);
    else spring.set(value);
  }, [value, still, spring]);
  return <motion.span>{text}</motion.span>;
}

/* Two versions of a passage in one grid cell, crossfading, so the swap
   never moves the text around it. */
function Swap({ on, before, after }: { on: boolean; before: ReactNode; after: ReactNode }) {
  const layer =
    "col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none";
  return (
    <div className="grid">
      <div className={cn(layer, on ? "opacity-0" : "opacity-100")}>{before}</div>
      <div className={cn(layer, on ? "opacity-100" : "opacity-0")}>{after}</div>
    </div>
  );
}

function Fresh({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "-mx-0.5 rounded-[3px] px-0.5 transition-colors duration-700 [box-decoration-break:clone] motion-reduce:transition-none",
        on ? "bg-cta/[0.13]" : "bg-transparent",
      )}
    >
      {children}
    </span>
  );
}

/* A phrase that becomes a link: dotted amber while links are missing, then
   underlined in blue. */
function LinkText({ on, fresh, children }: { on: boolean; fresh: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "-mx-0.5 rounded-[3px] px-0.5 underline underline-offset-[3px] transition-[color,background-color] duration-500 motion-reduce:transition-none",
        on
          ? "text-cta decoration-cta/45 decoration-1"
          : "decoration-warning decoration-dotted decoration-[1.5px]",
        fresh ? "bg-cta/[0.13]" : "bg-transparent",
      )}
    >
      {children}
    </span>
  );
}

/* A dashed slot where a missing piece goes. */
function Slot({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-full items-center rounded-lg border border-dashed border-warning/80 bg-warning/[0.07] px-3 text-[0.72rem] font-medium",
        AMBER_TEXT,
      )}
    >
      {children}
    </div>
  );
}

function Block({ flag, children }: { flag?: ReactNode; children: ReactNode }) {
  return (
    <div className="relative pl-7 sm:pl-9">
      {flag && <span className="absolute left-0 top-[0.1rem]">{flag}</span>}
      {children}
    </div>
  );
}

const H2 = "text-[0.9rem] font-semibold tracking-tight text-ink";
const P = "text-[0.8rem] leading-[1.6] text-ink/75";

/* ---------- The draft ---------- */

function Sheet({ phase, still }: { phase: number; still: boolean }) {
  const { edits, flag, fresh, ready, activeFix } = read(phase);
  const linked = edits >= 2;

  return (
    <div className="relative h-[23rem] overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-32px_rgba(16,24,40,0.32)] sm:h-[28rem] lg:h-[35rem]">
      <div className="flex items-center gap-2.5 border-b border-ink/[0.07] px-4 py-2.5 sm:px-5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
          <FileText className="h-3.5 w-3.5" />
        </span>
        <span className="truncate text-[0.75rem] font-medium text-ink">yoursite.com/blog</span>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold transition-colors duration-300",
            ready
              ? "bg-success/12 text-success"
              : activeFix
                ? "bg-cta-soft text-cta"
                : "border border-ink/[0.08] text-muted-foreground",
          )}
        >
          {activeFix > 0 && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cta motion-reduce:animate-none" />
          )}
          {ready ? "Ready" : activeFix ? "Fixing" : "Draft"}
        </span>
        <span className="ml-auto hidden shrink-0 text-[0.7rem] text-muted-foreground sm:inline">
          Keyword: <span className="font-medium text-ink">kanban vs scrum</span>
        </span>
        <span className="ml-auto shrink-0 text-[0.7rem] tabular-nums text-muted-foreground sm:ml-3">
          <Count value={WORDS[edits]} still={still} /> words
        </span>
      </div>

      <div className="space-y-4 px-4 pt-6 sm:px-8 sm:pt-7 lg:pr-[3.6rem]">
        <Block>
          <p className="font-display text-[1.12rem] font-semibold leading-snug tracking-[-0.015em] text-ink sm:text-[1.22rem]">
            Kanban vs Scrum: Which Should a Small Team Use?
          </p>
        </Block>

        <Block flag={<Flag n={1} state={flag(1)} />}>
          <Swap
            on={edits >= 1}
            before={
              <p className={P}>
                <span className="underline decoration-warning decoration-wavy decoration-1 underline-offset-[3px]">
                  Every growing team reaches the point where a shared to-do list stops working.
                </span>
              </p>
            }
            after={
              <p className={P}>
                <Fresh on={fresh(1)}>
                  <span className="font-semibold text-ink">Kanban vs scrum</span> comes down to
                  cadence: scrum plans work in fixed sprints, while kanban pulls it in as capacity
                  frees up.
                </Fresh>
              </p>
            }
          />
          <TextBar w="72%" className="mt-2" />
        </Block>

        <Block flag={<Flag n={2} state={flag(2)} />}>
          <p className={H2}>How kanban works</p>
          <p className={cn(P, "mt-1.5")}>
            Work moves across a board, and{" "}
            <LinkText on={linked} fresh={fresh(2)}>
              work-in-progress limits
            </LinkText>{" "}
            keep any column from piling up.
          </p>
          <TextBar w="84%" className="mt-2" />
        </Block>

        <Block>
          <p className={H2}>How scrum works</p>
          <p className={cn(P, "mt-1.5")}>
            Work is planned in sprints of one to four weeks and closed by a{" "}
            <LinkText on={linked} fresh={fresh(2)}>
              sprint review
            </LinkText>{" "}
            and a{" "}
            <LinkText on={linked} fresh={fresh(2)}>
              retrospective
            </LinkText>
            .
          </p>
          <TextBar w="64%" className="mt-2" />
        </Block>

        <Block flag={<Flag n={3} state={flag(3)} />}>
          <Swap
            on={edits >= 3}
            before={<Slot>Missing: a third H2 section</Slot>}
            after={
              <div>
                <p className={H2}>
                  <Fresh on={fresh(3)}>Which one fits a small team?</Fresh>
                </p>
                <TextBar w="92%" className="mt-2.5" />
                <TextBar w="58%" className="mt-2" />
              </div>
            }
          />
        </Block>

        <Block flag={<Flag n={4} state={flag(4)} />}>
          <Swap
            on={edits >= 4}
            before={<Slot>Missing: an FAQ section</Slot>}
            after={
              <div>
                <p className={H2}>
                  <Fresh on={fresh(4)}>Frequently asked questions</Fresh>
                </p>
                <p className="mt-1.5 text-[0.78rem] font-medium text-ink/80">
                  Is kanban better for small teams?
                </p>
                <p className="mt-1 text-[0.78rem] font-medium text-ink/80">
                  Can you combine kanban and scrum?
                </p>
              </div>
            }
          />
        </Block>

        <Block>
          <TextBar w="88%" />
          <TextBar w="76%" className="mt-2" />
        </Block>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

/* ---------- The scorecard ---------- */

function CheckRow({
  status,
  label,
  detail,
  active = false,
  flag,
  still,
}: {
  status: Status;
  label: string;
  detail: string;
  active?: boolean;
  flag?: ReactNode;
  still: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-start gap-2.5 rounded-lg px-2 py-[0.45rem] transition-colors duration-300",
        active ? "bg-cta-soft" : "bg-transparent",
      )}
    >
      <StatusIcon status={status} className="mt-px" animate={!still} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.76rem] font-medium leading-tight text-ink">{label}</p>
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            key={detail}
            initial={still ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.22 }}
            className="mt-0.5 truncate text-[0.68rem] leading-snug text-muted-foreground"
          >
            {detail}
          </motion.p>
        </AnimatePresence>
      </div>
      {flag}
    </li>
  );
}

function ScoreCard({ phase, still }: { phase: number; still: boolean }) {
  const { edits, resolved, activeFix, flag, ready } = read(phase);
  const score = SCORES[resolved];
  const lit = new Set<string>(["Depth", "Easy to read"]);
  FIXES.slice(0, resolved).forEach((f) => lit.add(f.signal));
  const h2 = 2 + (edits >= 3 ? 1 : 0) + (edits >= 4 ? 1 : 0);
  const open = FIXES.length - resolved;

  return (
    <div className="overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06),0_32px_64px_-28px_rgba(16,24,40,0.38)]">
      <div className="flex items-center gap-2 px-4 py-3">
        <Mark className="h-4 w-4 text-brand-blue" />
        <p className="text-[0.82rem] font-semibold text-ink">SEO / GEO Score</p>
        <span className="ml-auto rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Sample
        </span>
      </div>

      <div className="grid grid-cols-2 divide-x divide-ink/[0.07] border-y border-ink/[0.07]">
        <div className="flex items-center gap-3 p-3.5">
          <ScoreRing score={score} size={56} still={still} />
          <div className="min-w-0">
            <p className="text-[0.8rem] font-semibold text-ink">SEO</p>
            <p className="text-[0.68rem] leading-snug text-muted-foreground">For Google</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-3.5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[0.8rem] font-semibold text-ink">GEO</p>
            <p className="truncate text-[0.68rem] text-muted-foreground">For AI answers</p>
          </div>
          <p className="mt-1.5 text-[1.3rem] font-semibold leading-none tracking-tight text-ink tabular-nums">
            {lit.size}
            <span className="text-[0.78rem] font-medium text-muted-foreground"> / 6 signals</span>
          </p>
          <div className="mt-2 grid grid-cols-6 gap-1">
            {SIGNALS.map((s) => (
              <span
                key={s}
                title={s}
                className={cn(
                  "h-1.5 rounded-full transition-colors duration-500 motion-reduce:transition-none",
                  lit.has(s) ? "bg-cta" : "bg-ink/[0.08]",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-[0.74rem] font-medium text-ink">
          <span
            className="h-1.5 w-1.5 rounded-full transition-colors duration-500"
            style={{ background: scoreTone(score) }}
          />
          {verdict(score)}
        </span>
        <span className="text-[0.68rem] tabular-nums text-muted-foreground">
          {BASE_PASSED + resolved} of {TOTAL_CHECKS} checks passed
        </span>
      </div>

      <div className="border-t border-ink/[0.07] px-2.5 pb-1.5 pt-2.5">
        <div className="flex items-center justify-between px-2 pb-1">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Checklist
          </p>
          <p className="text-[0.66rem] text-muted-foreground">
            {open > 0 ? `${open} to fix` : "All flags fixed"}
          </p>
        </div>
        <ul>
          {FIXES.map((f, i) => {
            const n = i + 1;
            const done = resolved >= n;
            return (
              <CheckRow
                key={f.label}
                status={done ? "pass" : f.from}
                label={done ? (f.passLabel ?? f.label) : f.label}
                detail={done ? f.pass(h2) : f.open}
                active={activeFix === n}
                flag={<Flag n={n} state={flag(n)} className="mt-0.5" />}
                still={still}
              />
            );
          })}
          <CheckRow
            status="warn"
            label="Meta description"
            detail="172 characters — aim for 120–160."
            still={still}
          />
          <li className="flex items-center gap-2.5 px-2 py-2 text-[0.7rem] text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success/70" />
            {BASE_PASSED} more checks passed
          </li>
        </ul>
      </div>

      <div className="border-t border-ink/[0.07] p-3">
        <div
          className={cn(
            "flex h-9 items-center justify-center gap-2 rounded-lg text-[0.8rem] font-semibold transition-colors duration-500 motion-reduce:transition-none",
            ready
              ? "bg-cta text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)]"
              : activeFix
                ? "bg-cta-soft text-cta"
                : cn("border border-warning/60 bg-warning/[0.07]", AMBER_TEXT),
          )}
        >
          {ready ? (
            <>
              Publish
              <ArrowRight className="h-4 w-4" />
            </>
          ) : activeFix ? (
            `Applying fix ${activeFix} of ${FIXES.length}`
          ) : (
            `${FIXES.length} fixes found`
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Together ---------- */

export function ScoreDesk() {
  const { ref, phase, still } = useStory<HTMLDivElement>(DURATIONS);
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Sample: a draft on yoursite.com scores 76 for Google with 2 of 6 AI signals. Four flagged fixes land one by one, and it finishes at 96 with 6 of 6 signals, ready to publish."
      className="relative mx-auto max-w-[60rem]"
    >
      <div className="lg:flex lg:items-start lg:justify-center">
        <div className="relative lg:w-[38.5rem] lg:shrink-0">
          <Sheet phase={phase} still={still} />
        </div>
        <div className="relative z-10 mx-2 -mt-28 sm:mx-auto sm:max-w-[23rem] lg:mx-0 lg:-ml-10 lg:mt-14 lg:w-[22.5rem] lg:max-w-none lg:shrink-0">
          <ScoreCard phase={phase} still={still} />
        </div>
      </div>
    </div>
  );
}
