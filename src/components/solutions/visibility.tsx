/**
 * /solutions/ai-search-visibility, section by section. The centrepiece is the
 * gate lab: the same sample answer as the hero, with a switch per gate, so a
 * visitor can break one condition and watch the answer go to a rival. The
 * hero shows why an answer named the brand; the lab shows what happens when
 * it can't.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  FileText,
  Info,
  Radar,
  ScrollText,
} from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { ChatGPTMark } from "@/components/landing/ai-logos";
import { GATES, READINESS_SIGNALS, SAMPLE, type GateId } from "@/data/solutions/gates";
import { VISIBILITY } from "@/data/solutions/ai-search-visibility";
import type { PricedProduct } from "@/data/solutions/market";
import { RANKBOX_TRACKING } from "@/data/competitors/shared";
import { PLAN, formatUsd } from "@/data/pricing";
import { formatCheckedOn } from "@/data/alternatives";
import { FeatureLink, Heading, IntegrationLink, ToolRow } from "./kit";
import { cn } from "@/lib/utils";

/* ---------- The answer card both the hero and the lab use ---------- */

function AnswerShell({
  children,
  footer,
  className,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card text-ink shadow-elevation-lg ring-1 ring-ink/5",
        className,
      )}
    >
      <div className="relative flex items-center gap-2 border-b border-border bg-surface/70 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-border" />
          ))}
        </span>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
          <ChatGPTMark className="h-3.5 w-3.5" />
          {SAMPLE.engine}
        </span>
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex justify-end">
          <p className="max-w-[88%] rounded-lg rounded-br-sm bg-ink px-4 py-2.5 text-sm leading-relaxed text-background">
            {SAMPLE.prompt}
          </p>
        </div>
        {children}
      </div>
      {footer}
    </div>
  );
}

function Sources({ list, own }: { list: string[]; own?: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[0.7rem] font-medium text-muted-foreground">Sources</p>
      <ul className="space-y-1.5">
        {list.map((s) => {
          const isOwn = own !== undefined && s.startsWith(own);
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5",
                isOwn ? "border-volt/40 bg-volt/[0.06]" : "border-border bg-background",
              )}
            >
              <span
                aria-hidden
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[0.6rem] font-semibold uppercase text-muted-foreground"
              >
                {s.charAt(0)}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{s}</span>
              {isOwn && (
                <span className="shrink-0 text-[0.65rem] font-semibold text-volt">you</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Named({ brand }: { brand: string }) {
  return (
    <span className="font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2">
      {brand}
    </span>
  );
}

/* ---------- 1. Hero aside: why this answer named the brand ---------- */

const EVIDENCE: Record<GateId, string> = {
  readable: "robots.txt lets OAI-SearchBot fetch the page",
  answered: "A page answers this exact question",
  liftable: "The answer leads, under a matching heading",
  corroborated: "Recommended in r/startups and on review sites",
};

export function CitationXray() {
  return (
    <AnswerShell
      footer={
        <div className="border-t border-border bg-surface/60 px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold text-ink">
            Why {SAMPLE.engine} named {SAMPLE.brand}
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {/* The page's one timed moment: the reasons tick in, in gate order.
                CSS rather than JS, so the server and client render the same. */}
            {GATES.map((g, i) => (
              <li
                key={g.id}
                style={{ animationDelay: `${0.9 + i * 0.22}s` }}
                className="flex animate-in fade-in slide-in-from-bottom-1 items-start gap-2 rounded-lg border border-border bg-card px-2.5 py-2 duration-300 fill-mode-backwards motion-reduce:animate-none"
              >
                <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.72rem] font-semibold text-ink">{g.name}</span>
                  <span className="block text-[0.7rem] leading-snug text-muted-foreground">
                    {EVIDENCE[g.id]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.66rem] text-muted-foreground">
            Illustration. Plannora is a sample brand.
          </p>
        </div>
      }
    >
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background">
          <ChatGPTMark className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-[0.95rem] leading-relaxed">
            For a five-person team, <Named brand={SAMPLE.brand} /> is the pick most reviewers land
            on: boards and automations out of the box, and free for up to five people.
          </p>
          <Sources list={SAMPLE.sources} own={SAMPLE.domain} />
        </div>
      </div>
    </AnswerShell>
  );
}

/* ---------- 2. The gate lab ---------- */

const ALL_ON: Record<GateId, boolean> = {
  readable: true,
  answered: true,
  liftable: true,
  corroborated: true,
};

function GateSwitch({
  gate,
  on,
  onToggle,
}: {
  gate: (typeof GATES)[number];
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border bg-card px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2",
        on ? "border-border hover:border-ink/20" : "border-flame/40 bg-flame/[0.04]",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-semibold text-ink">{gate.name}</span>
        <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
          {gate.question}
        </span>
      </span>
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          on ? "bg-cta" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            on ? "translate-x-[1.375rem]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function GateLab() {
  const [gates, setGates] = useState(ALL_ON);
  const failing = GATES.find((g) => !gates[g.id]);
  const passing = GATES.filter((g) => gates[g.id]).length;

  return (
    <section
      id="gates"
      aria-labelledby="gates-title"
      className="scroll-mt-24 border-b border-border bg-surface/50 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading id="gates-title" title={VISIBILITY.gatesTitle} intro={VISIBILITY.gatesIntro} />

        <div className="mx-auto mt-14 grid max-w-5xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
          {/* The switches follow the answer on phones, so each flip's result is
              right above the thumb; on desktop they sit to its left. */}
          <div className="order-2 space-y-3 lg:order-1">
            {GATES.map((g) => (
              <GateSwitch
                key={g.id}
                gate={g}
                on={gates[g.id]}
                onToggle={() => setGates((s) => ({ ...s, [g.id]: !s[g.id] }))}
              />
            ))}
            <div className="flex items-center justify-between px-1 pt-1 text-sm">
              <span className="text-muted-foreground">
                <span className="font-semibold tabular-nums text-ink">{passing} of 4</span> gates
                pass
              </span>
              <button
                type="button"
                onClick={() => setGates(ALL_ON)}
                disabled={passing === 4}
                className="rounded-md px-2 py-1 font-semibold text-cta transition-opacity hover:underline disabled:opacity-0"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="order-1 lg:sticky lg:top-28 lg:order-2">
            <AnswerShell>
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                  <ChatGPTMark className="h-4 w-4" />
                </span>
                <div aria-live="polite" className="min-w-0 flex-1 space-y-3">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={failing ? "rival" : "brand"}
                      /* A cross-fade only: it answers the click without moving
                         anything, so it needs no reduced-motion branch. */
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {failing ? (
                        <p className="text-[0.95rem] leading-relaxed">
                          Most small teams go with <Named brand={SAMPLE.rival} />: it&rsquo;s quick
                          to set up and the reviews are consistently good.
                        </p>
                      ) : (
                        <p className="text-[0.95rem] leading-relaxed">
                          For a five-person team, <Named brand={SAMPLE.brand} /> is the pick most
                          reviewers land on: boards and automations out of the box, and free for up
                          to five people.
                        </p>
                      )}
                      <Sources
                        list={failing ? SAMPLE.rivalSources : SAMPLE.sources}
                        own={SAMPLE.domain}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div
                    className={cn(
                      "flex items-start gap-2 rounded-lg px-3 py-2.5 text-[0.82rem] leading-snug",
                      failing ? "bg-flame/10 text-ink" : "bg-success/10 text-ink",
                    )}
                  >
                    {failing ? (
                      <CircleAlert className="mt-px h-4 w-4 shrink-0 text-flame" />
                    ) : (
                      <Check className="mt-px h-4 w-4 shrink-0 text-success" />
                    )}
                    <span>
                      {failing ? (
                        <>
                          <span className="font-semibold">{failing.name} failed.</span>{" "}
                          {failing.fail}
                        </>
                      ) : (
                        <>
                          <span className="font-semibold">All four gates pass.</span> {SAMPLE.brand}{" "}
                          is named, and its own page is the first source.
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </AnswerShell>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Illustration. Plannora and Loopcraft are sample brands.
            </p>
          </div>
        </div>

        {/* What fixes each gate: the lab's lesson, written out for readers and
            engines alike. */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
          {GATES.map((g) => (
            <div key={g.id} className="flex flex-col bg-card p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold text-ink">{g.name}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{g.why}</p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs font-semibold text-ink">In Rankbox</p>
                {g.features.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {g.features.map((f) => (
                      <FeatureLink key={f} slug={f} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-1.5 text-[0.83rem] leading-snug text-muted-foreground">
                    A one-time setup. The free tools below cover it.
                  </p>
                )}
              </div>
              <div className="mt-4 flex-1">
                <p className="text-xs font-semibold text-ink">Check it free</p>
                <div className="-mx-3 mt-1 grid gap-x-2 sm:grid-cols-2">
                  {g.tools.slice(0, 2).map((t) => (
                    <ToolRow key={t} slug={t} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. Trackers vs Rankbox ---------- */

function startsAt(p: PricedProduct): string {
  if (!p.from) return `${p.name}: custom quote`;
  const yearly =
    p.from.annual !== undefined && p.from.annual < p.from.monthly
      ? ` (${formatUsd(p.from.annual)} yearly)`
      : "";
  return `${p.name}: ${formatUsd(p.from.monthly)}/mo${yearly}`;
}

export function TrackerContrast({ trackers }: { trackers: PricedProduct[] }) {
  const checked = trackers[0]?.checkedOn;
  const rows: { label: string; tracker: React.ReactNode; rankbox: React.ReactNode }[] = [
    {
      label: "What it does",
      tracker: "Runs your buyer prompts through AI engines and reports who got named.",
      rankbox: "Writes the answers and earns the mentions that decide who gets named.",
    },
    {
      label: "What you get each month",
      tracker: "A share-of-voice report across your prompt panel.",
      rankbox: `${PLAN.articlesPerMonth} articles, ${PLAN.backlinkCreditsPerMonth} backlink credits and ${PLAN.redditRepliesPerMonth} Reddit reply drafts.`,
    },
    {
      label: "Starts at",
      tracker: (
        <>
          {trackers.map((t) => (
            <span key={t.slug} className="block">
              {startsAt(t)}
            </span>
          ))}
        </>
      ),
      rankbox: `${formatUsd(PLAN.monthly)}/mo for one site`,
    },
    {
      label: "Still up to you",
      tracker: "Writing, publishing and outreach: the work that changes the answer.",
      rankbox: RANKBOX_TRACKING.cell.note,
    },
  ];

  return (
    <section aria-labelledby="trackers-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="trackers-title"
          title={VISIBILITY.trackerTitle}
          intro={VISIBILITY.trackerIntro}
        />
        <Reveal delay={0.06}>
          <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-1">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">An AI visibility tracker compared with Rankbox</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[26%] px-5 py-4 sm:px-6">
                    <span className="sr-only">Question</span>
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                    <span className="flex items-center gap-2">
                      <Radar className="h-4 w-4 text-muted-foreground" />
                      An AI visibility tracker
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="bg-cta-soft/60 px-5 py-4 font-semibold text-cta sm:px-6"
                  >
                    Rankbox
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.label} className="align-top">
                    <th
                      scope="row"
                      className="px-5 py-4 text-[0.8rem] font-semibold text-muted-foreground sm:px-6"
                    >
                      {r.label}
                    </th>
                    <td className="px-5 py-4 leading-relaxed text-ink sm:px-6">{r.tracker}</td>
                    <td className="bg-cta-soft/60 px-5 py-4 leading-relaxed text-ink sm:px-6">
                      {r.rankbox}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-4 text-sm leading-relaxed text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-2xl">
              <span className="font-semibold text-ink">The best setup is both:</span> a tracker to
              measure, Rankbox to move the number. On one budget, move the number first; the free
              prompt kit below covers the measuring.
              {checked && (
                <>
                  {" "}
                  Tracker prices from each vendor&rsquo;s pricing page, checked{" "}
                  {formatCheckedOn(checked)}.
                </>
              )}
            </p>
            <Link
              to="/compare/$slug"
              params={{ slug: "profound-vs-peec-ai" }}
              className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-cta hover:underline"
            >
              Profound vs Peec AI
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 4. The loop, beside the Rank page ---------- */

/* Sample numbers for the illustration; the real page reads the account. */
const SAMPLE_SIGNALS = [17, 15, 18, 14, 16, 17];
const SAMPLE_MOVES: { kind: string; text: string }[] = [
  { kind: "Cover", text: "Answer “kanban vs scrum for a small team”" },
  { kind: "Strengthen", text: "Add sources to “Plannora pricing, explained”" },
  { kind: "Schedule", text: "3 finished answers are ready to publish" },
];

function RankPanel() {
  const answered = 18;
  const market = 42;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevation-lg">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <p className="text-sm font-semibold text-ink">Rank</p>
          <p className="text-xs text-muted-foreground">plannora.io · sample data</p>
        </div>
        <span className="rounded-full bg-cta-soft px-2.5 py-1 text-[0.7rem] font-semibold text-cta">
          Dashboard
        </span>
      </div>
      <div className="space-y-6 p-5">
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold text-ink">Market answered</p>
            <p className="text-xs tabular-nums text-muted-foreground">
              <span className="font-semibold text-ink">{answered}</span> of {market} buyer questions
            </p>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-cta"
              style={{ width: `${Math.round((answered / market) * 100)}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink">AI-readiness checks, across live answers</p>
          <ul className="mt-2.5 space-y-2">
            {READINESS_SIGNALS.map((label, i) => (
              <li key={label} className="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-3">
                <span className="truncate text-[0.78rem] text-muted-foreground">{label}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-surface">
                  <span
                    className="block h-full rounded-full bg-success"
                    style={{ width: `${Math.round((SAMPLE_SIGNALS[i] / answered) * 100)}%` }}
                  />
                </span>
                <span className="text-right text-[0.72rem] tabular-nums text-muted-foreground">
                  {SAMPLE_SIGNALS[i]}/{answered}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink">Next moves</p>
          <ul className="mt-2.5 space-y-2">
            {SAMPLE_MOVES.map((m) => (
              <li
                key={m.kind}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
              >
                <span className="w-[4.6rem] shrink-0 text-[0.7rem] font-semibold text-cta">
                  {m.kind}
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.8rem] text-ink">{m.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function BuildLoop() {
  return (
    <section
      aria-labelledby="loop-title"
      className="border-y border-border bg-surface/50 py-24 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16">
        <div>
          <Heading
            id="loop-title"
            align="left"
            title={VISIBILITY.loopTitle}
            intro={VISIBILITY.loopIntro}
          />
          <ol className="mt-10 space-y-0">
            {VISIBILITY.loop.map((step, i) => (
              <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                {i < VISIBILITY.loop.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[0.95rem] top-9 h-[calc(100%-2.25rem)] w-px bg-border"
                  />
                )}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card font-display text-sm font-semibold tabular-nums text-ink shadow-sm">
                  {i + 1}
                </span>
                <div className="min-w-0 pt-1">
                  <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                  <div className="mt-3">
                    {step.feature ? (
                      <FeatureLink slug={step.feature} />
                    ) : step.integration ? (
                      <IntegrationLink slug={step.integration} label="Rankbox API" />
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <Reveal delay={0.08} className="lg:sticky lg:top-28">
          <RankPanel />
          <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
            The Rank page shows how much of your market you answer and how ready each answer is for
            AI engines, then picks the next moves.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 5. Measure it free ---------- */

export function MeasureFree() {
  return (
    <section aria-labelledby="measure-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="measure-title"
          title={VISIBILITY.measureTitle}
          intro={VISIBILITY.measureIntro}
        />
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
          <Reveal className="h-full">
            <MeasureCard
              icon={ScrollText}
              title="Test the answers"
              body="Thirty buyer prompts to paste into ChatGPT, Perplexity and Gemini, with a scorecard for your share of voice."
            >
              <ToolRow slug="ai-visibility-prompt-generator" className="-mx-3" />
            </MeasureCard>
          </Reveal>
          <Reveal delay={0.05} className="h-full">
            <MeasureCard
              icon={Radar}
              title="Read your logs"
              body="See which AI bots already fetch your pages, how often, and which pages they never reach."
            >
              <ToolRow slug="ai-crawler-log-analyzer" className="-mx-3" />
            </MeasureCard>
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <MeasureCard
              icon={FileText}
              title="Count the clicks"
              body="Crawled, cited, clicked, converted: the four numbers that prove AI visibility pays, and a control test."
            >
              <Link
                to="/blog/$slug"
                params={{ slug: "how-to-measure-geo" }}
                className="group -mx-3 flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
              >
                How to measure GEO
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
              </Link>
            </MeasureCard>
          </Reveal>
        </div>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2 text-center text-sm leading-relaxed text-muted-foreground">
            {RANKBOX_TRACKING.fact.state === "yes" ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            ) : (
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span>
              <span className="font-semibold text-ink">What Rankbox measures today:</span>{" "}
              {RANKBOX_TRACKING.cell.note}
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function MeasureCard({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: typeof Radar;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-soft text-cta">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-5 border-t border-border pt-3">{children}</div>
    </div>
  );
}
