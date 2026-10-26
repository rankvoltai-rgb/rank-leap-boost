/**
 * The smaller pictures on /alternatives/outrank: one per place the two
 * products differ (Reddit, backlink credits, article length), the run-both
 * timeline for switching, and Outrank's publishing destinations.
 *
 * They are product screens drawn as white hairline cards. Figures and notes
 * come from the competitor entry, data/pricing and the shared Rankbox cells;
 * the few labels written here only name what is drawn. Where a card is a
 * sample, it says so.
 */
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, FileText, Lock, PauseCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { RedditMark } from "@/components/landing/ai-logos";
import { LINE } from "@/components/landing/frame";
import { PLAN } from "@/data/pricing";
import { RANKBOX_CELLS, RANKBOX_PUBLISHING, type Competitor } from "@/data/alternatives";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { findRow, numbersIn } from "./lib";

const CARD =
  "w-full overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_44px_-24px_rgba(16,24,40,0.24)]";

function CardHead({ icon, title, tag }: { icon: ReactNode; title: string; tag?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 border-b px-4 py-3", LINE)}>
      {icon}
      <span className="min-w-0 flex-1 truncate text-[0.85rem] font-medium text-ink">{title}</span>
      {tag && (
        <span
          className={cn(
            "shrink-0 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
            LINE,
          )}
        >
          {tag}
        </span>
      )}
    </div>
  );
}

/** Grey placeholder text, for the lines of a sample the reader isn't meant to read. */
function Lines({ widths, className }: { widths: string[]; className?: string }) {
  return (
    <div aria-hidden className={cn("space-y-1.5", className)}>
      {widths.map((w, i) => (
        <span key={i} className="block h-1.5 rounded-full bg-ink/[0.08]" style={{ width: w }} />
      ))}
    </div>
  );
}

/* ---------- 1. Reddit ---------- */

/** A thread found and a reply drafted, waiting for its owner to post it. */
export function RedditDraft() {
  return (
    <div
      className={CARD}
      role="img"
      aria-label="Sample: a Reddit thread with a reply drafted, waiting for you to post it"
    >
      <CardHead
        icon={
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
            <RedditMark className="h-3.5 w-3.5" />
          </span>
        }
        title="Reddit presence"
        tag="Sample"
      />
      <div aria-hidden className="space-y-3 p-4">
        <div className={cn("rounded-lg border bg-white p-3", LINE)}>
          <div className="flex items-center gap-2 text-[0.68rem] text-muted-foreground">
            <span className="h-4 w-4 rounded-full bg-[#ff4500]/15" />
            <span>Thread found</span>
            <span className="ml-auto rounded bg-ink/[0.05] px-1.5 py-0.5 font-medium">
              Matches a buyer search
            </span>
          </div>
          <Lines widths={["88%", "64%"]} className="mt-2.5 [&>span]:h-2 [&>span]:bg-ink/[0.14]" />
          <Lines widths={["96%", "90%", "52%"]} className="mt-2.5" />
        </div>

        <div className="rounded-lg border border-brand-blue/30 bg-cta-soft/60 p-3">
          <div className="flex items-center gap-2 text-[0.68rem] font-medium text-brand-blue">
            <RankboxMark className="h-4 w-4" />
            Draft reply, in your voice
          </div>
          <Lines widths={["94%", "98%", "71%"]} className="mt-2.5 [&>span]:bg-brand-blue/[0.16]" />
          <p className="mt-2 text-[0.68rem] text-ink/70">
            …more on{" "}
            <span className="font-medium text-brand-blue underline decoration-brand-blue/30 underline-offset-2">
              yoursite.com
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-[0.7rem]">
          <span className="inline-flex items-center gap-1 rounded-md bg-cta px-2 py-1 font-medium text-white">
            <Check className="h-3 w-3" strokeWidth={3} /> Drafted
          </span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border border-dashed px-2 py-1 font-medium text-ink",
              "border-ink/25",
            )}
          >
            You post it
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- 2. Backlink credits ---------- */

/** This month's credits on Rankbox, with Outrank's exchange quoted beneath. */
export function CreditLedger({ competitor }: { competitor: Competitor }) {
  const theirs = findRow(competitor, "Backlink exchange")?.them;
  return (
    <div className={CARD}>
      <CardHead
        icon={<RankboxMark className="h-6 w-6" />}
        title="Backlink credits"
        tag="This month"
      />
      <div className="p-4">
        <dl className={cn("divide-y rounded-lg border", "divide-ink/[0.07]", LINE)}>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Plus aria-hidden className="h-3.5 w-3.5 text-brand-blue" />
            <dt className="flex-1 text-[0.8rem] text-ink">Granted on the paid plan</dt>
            <dd className="text-[0.95rem] font-semibold tabular-nums text-brand-blue">
              +{PLAN.backlinkCreditsPerMonth}
            </dd>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Plus aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />
            <dt className="flex-1 text-[0.8rem] text-ink">Earned by hosting links</dt>
            <dd className="text-[0.75rem] text-muted-foreground">On top</dd>
          </div>
        </dl>

        <p className="mt-4 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          A placed link costs
        </p>
        <ul className="mt-2 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((n) => (
            <li
              key={n}
              className={cn("flex flex-col items-center gap-1.5 rounded-lg border py-2.5", LINE)}
            >
              <span aria-hidden className="flex gap-0.5">
                {Array.from({ length: n }, (_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-cta" />
                ))}
              </span>
              <span className="text-[0.72rem] text-ink">
                {n} credit{n > 1 ? "s" : ""}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-center text-[0.68rem] text-muted-foreground">
          by the host site&rsquo;s tier
        </p>

        <ol className="mt-4 flex items-center gap-1.5 text-[0.68rem]">
          {[
            { label: "Escrow", icon: Lock },
            { label: "Published", icon: FileText },
            { label: "Verified", icon: Check },
          ].map((s, i) => (
            <li key={s.label} className="flex flex-1 items-center gap-1.5">
              <span
                className={cn(
                  "flex flex-1 items-center justify-center gap-1 rounded-md border px-1.5 py-1 font-medium",
                  i === 2
                    ? "border-transparent bg-cta-soft text-cta"
                    : "border-ink/[0.08] text-ink",
                )}
              >
                <s.icon aria-hidden className="h-3 w-3" />
                {s.label}
              </span>
              {i < 2 && (
                <ArrowRight aria-hidden className="h-3 w-3 shrink-0 text-muted-foreground" />
              )}
            </li>
          ))}
        </ol>
      </div>

      {theirs && (
        <div className={cn("flex gap-2.5 border-t bg-ink/[0.015] px-4 py-3", LINE)}>
          <CompetitorMark competitor={competitor} className="mt-0.5 h-5 w-5 text-[0.5rem]" />
          <p className="text-[0.72rem] leading-snug text-muted-foreground">
            <span className="font-medium text-ink">{competitor.name}:</span> {theirs.note}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- 3. Article length ---------- */

/**
 * Both lengths on one scale, read out of the matrix's "Article length" row.
 * Outrank's figure is a minimum its site cites, so its band trails off to the
 * right instead of stopping: the picture claims no more than the source does.
 */
export function WordRuler({ competitor }: { competitor: Competitor }) {
  const reduce = useReducedMotion();
  const row = findRow(competitor, "Article length");
  const ours = numbersIn(RANKBOX_CELLS.writer.note)[0];
  const [low, high] = row ? numbersIn(row.them.note) : [];
  if (!ours || !low || !high) return null;
  const top = Math.ceil(Math.max(ours, high) / 1000) * 1000;
  const pct = (n: number) => `${(n / top) * 100}%`;
  const ticks = Array.from({ length: top / 1000 + 1 }, (_, i) => i * 1000);
  const grow = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { scaleX: 0 },
          whileInView: { scaleX: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <div className={CARD}>
      <CardHead
        icon={
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
            <FileText className="h-3.5 w-3.5" />
          </span>
        }
        title="Words per article"
      />
      <div className="p-4 sm:p-5">
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <RankboxMark className="h-5 w-5" />
              <span className="text-[0.8rem] font-semibold text-ink">Rankbox</span>
              <span className="ml-auto text-[0.8rem] font-semibold tabular-nums text-brand-blue">
                ~{ours.toLocaleString("en-US")}
              </span>
            </div>
            <div aria-hidden className="relative mt-2 h-3 rounded-full bg-ink/[0.05]">
              <motion.span
                {...grow(0.1)}
                className="absolute inset-y-0 left-0 origin-left rounded-full bg-cta"
                style={{ width: pct(ours) }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.5rem]" />
              <span className="text-[0.8rem] font-semibold text-ink">{competitor.name}</span>
              <span className="ml-auto text-[0.8rem] tabular-nums text-muted-foreground">
                {low.toLocaleString("en-US")}–{high.toLocaleString("en-US")} min.
              </span>
            </div>
            <div aria-hidden className="relative mt-2 h-3 rounded-full bg-ink/[0.05]">
              <motion.span
                {...grow(0.25)}
                className="absolute inset-y-0 left-0 origin-left rounded-l-full bg-ink/25"
                style={{ width: pct(low) }}
              />
              <motion.span
                {...grow(0.45)}
                className="absolute inset-y-0 origin-left bg-ink/15"
                style={{ left: pct(low), width: `${((high - low) / top) * 100}%` }}
              />
              {/* "Minimum": the band runs on, dashed, rather than ending. */}
              <span
                className="absolute inset-y-[3px] border-y border-dashed border-ink/25 [mask-image:linear-gradient(to_right,#000,transparent)]"
                style={{ left: pct(high), width: "18%" }}
              />
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="relative mt-3 h-4 text-[0.6rem] tabular-nums text-muted-foreground"
        >
          {ticks.map((t) => (
            <span
              key={t}
              className={cn(
                "absolute top-0",
                t === 0 ? "" : t === top ? "-translate-x-full" : "-translate-x-1/2",
              )}
              style={{ left: pct(t) }}
            >
              {t.toLocaleString("en-US")}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[0.72rem] leading-snug text-muted-foreground">
          <span className="font-medium text-ink">Rankbox:</span> {RANKBOX_CELLS.writer.note}.
          {row && (
            <>
              {" "}
              <span className="font-medium text-ink">{competitor.name}:</span> {row.them.note}.
            </>
          )}
        </p>
      </div>

      <div className={cn("border-t px-4 py-3 sm:px-5", LINE)}>
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          In every Rankbox article
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {["Direct answer", "Key takeaways", "Cited sources", "FAQ"].map((b) => (
            <li
              key={b}
              className="rounded-md border border-ink/[0.08] bg-white px-2 py-1 text-[0.72rem] text-ink"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Switching: the run-both timeline ---------- */

/**
 * Outrank keeps running while Rankbox is set up; it is paused once the
 * first Rankbox articles are live, and what it published stays. Drawn from
 * the migration body and its steps; the steps themselves are listed as text
 * beside it, so the picture is decorative.
 */
export function RunBoth({ competitor }: { competitor: Competitor }) {
  const steps = competitor.migration.steps.length;
  // Where the steps sit along Rankbox's track, and where the switch happens.
  const stepAt = (i: number) => 10 + i * (36 / Math.max(steps - 1, 1));
  const live = 66;
  const ready = stepAt(steps - 1);

  return (
    <div aria-hidden className="select-none">
      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-x-3 gap-y-7 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
        {/* Outrank */}
        <span className="flex items-center gap-2 text-[0.78rem] font-medium text-ink">
          <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.5rem]" />
          <span className="truncate">{competitor.name}</span>
        </span>
        <div className="relative h-7">
          <span
            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-ink/25"
            style={{ left: 0, width: `${live}%` }}
          />
          <span
            className="absolute top-1/2 h-0 -translate-y-1/2 border-t-[3px] border-dotted border-ink/20"
            style={{ left: `${live}%`, right: 0 }}
          />
          <span
            className="absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/70"
            style={{ left: `${live}%` }}
          >
            <PauseCircle className="h-3.5 w-3.5" />
          </span>
          <span
            className="absolute -top-4 hidden whitespace-nowrap text-[0.65rem] text-muted-foreground sm:block"
            style={{ left: `calc(${live}% + 16px)` }}
          >
            Paused · what it published stays
          </span>
        </div>

        {/* Rankbox */}
        <span className="flex items-center gap-2 text-[0.78rem] font-medium text-ink">
          <RankboxMark className="h-5 w-5" />
          Rankbox
        </span>
        <div className="relative h-7">
          <span
            className="absolute top-1/2 h-0 -translate-y-1/2 border-t-2 border-dashed border-brand-blue/30"
            style={{ left: `${stepAt(0)}%`, width: `${ready - stepAt(0)}%` }}
          />
          <span
            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-cta"
            style={{ left: `${ready}%`, right: 0 }}
          />
          {competitor.migration.steps.map((s, i) => (
            <span
              key={s.title}
              className="absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-blue/40 bg-white text-[0.68rem] font-semibold text-brand-blue"
              style={{ left: `${stepAt(i)}%` }}
            >
              {i + 1}
            </span>
          ))}
          <span
            className="absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cta text-white shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_15%,transparent)]"
            style={{ left: `${live}%` }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <span
            className="absolute top-[calc(100%+2px)] hidden whitespace-nowrap text-[0.65rem] font-medium text-brand-blue sm:block"
            style={{ left: `calc(${live}% + 16px)` }}
          >
            First articles live
          </span>
        </div>
      </div>

      {/* The overlap, marked across both tracks. */}
      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
        <span />
        <div className="relative mt-3 h-5">
          <span
            className="absolute inset-y-0 flex items-center justify-center rounded-md bg-cta-soft text-[0.65rem] font-medium text-cta"
            style={{ left: `${ready}%`, width: `${live - ready}%` }}
          >
            Run both
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Where Outrank is better: its destinations ---------- */

/** "WordPress, Webflow, and webhooks" → ["WordPress", "Webflow", "webhooks"]. */
function listItems(note: string): string[] {
  return note
    .split(/,\s*(?:and\s+)?|\s+and\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function Destinations({ competitor }: { competitor: Competitor }) {
  const row = findRow(competitor, "Publishes to your CMS");
  if (!row) return null;
  const theirs = listItems(row.them.note);
  return (
    <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className={cn("border-b px-5 py-7 sm:px-8 lg:border-b-0 lg:border-r lg:px-10", LINE)}>
        <p className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
          <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.5rem]" />
          {competitor.name} publishes natively to
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {theirs.map((d) => (
            <li
              key={d}
              className="rounded-md border border-ink/[0.08] bg-white px-2.5 py-1.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.03)]"
            >
              {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-5 py-7 sm:px-8 lg:px-10">
        <p className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
          <RankboxMark className="h-5 w-5" />
          Rankbox today
        </p>
        <p className="mt-4 text-[0.88rem] leading-relaxed text-muted-foreground">
          {RANKBOX_PUBLISHING.sentence}.
        </p>
      </div>
    </div>
  );
}
