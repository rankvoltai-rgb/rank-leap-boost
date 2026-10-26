/**
 * Sample screens for the three deep dives on /alternatives/frase. They show
 * the shape of each thing (a credit ledger, a drafted reply, a month of
 * articles), use yoursite.com, and carry no copy beyond short labels taken
 * from the deep dive's own points. Grey bars stand in for text rather than
 * inventing it. Decorative: the words beside each one say it all.
 */
import { motion } from "motion/react";
import { Check, FileText, Link2, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN, formatUsd } from "@/data/pricing";
import type { Competitor } from "@/data/alternatives";
import { CompetitorMark, RankboxMark } from "../kit";
import { entryPlan } from "./model";
import { CARD } from "./helpers";
import { TextBar } from "./ui";

const STAGES = ["In escrow", "Published", "Verified"] as const;

function StageChip({ stage }: { stage: (typeof STAGES)[number] }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold",
        stage === "Verified" && "bg-success/12 text-success",
        stage === "Published" && "bg-cta-soft text-cta",
        stage === "In escrow" && "border border-ink/[0.1] text-muted-foreground",
      )}
    >
      {stage}
    </span>
  );
}

export function BacklinkSample() {
  const rows = [
    { slug: "blog/pricing-guide", cost: 1, stage: "Verified" as const },
    { slug: "blog/how-it-works", cost: 2, stage: "Published" as const },
    { slug: "blog/getting-started", cost: 3, stage: "In escrow" as const },
  ];
  return (
    <div aria-hidden className={cn(CARD, "w-full max-w-md p-4 sm:p-5")}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[0.8rem] font-semibold text-ink">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
            <Link2 className="h-3.5 w-3.5" />
          </span>
          Backlink credits
        </span>
        <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.66rem] font-semibold tabular-nums text-cta">
          {PLAN.backlinkCreditsPerMonth} this month
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li
            key={r.slug}
            className="flex items-center gap-2.5 rounded-lg border border-ink/[0.07] bg-white px-3 py-2.5"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.72rem] text-ink">
                <span className="text-muted-foreground">yoursite.com/</span>
                {r.slug}
              </span>
              <span className="mt-0.5 block text-[0.62rem] text-muted-foreground">
                Link inside a member&rsquo;s article
              </span>
            </span>
            <span className="shrink-0 text-[0.66rem] tabular-nums text-muted-foreground">
              {r.cost} {r.cost === 1 ? "credit" : "credits"}
            </span>
            <StageChip stage={r.stage} />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-1.5 border-t border-ink/[0.06] pt-3 text-[0.62rem] font-medium text-muted-foreground">
        {STAGES.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5">
            {i > 0 && <span className="h-px w-4 bg-ink/15" />}
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full",
                i === STAGES.length - 1
                  ? "bg-success/15 text-success"
                  : "bg-ink/[0.06] text-ink/50",
              )}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RedditSample() {
  return (
    <div aria-hidden className={cn(CARD, "w-full max-w-md overflow-hidden")}>
      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
        <span className="flex items-center gap-2 text-[0.8rem] font-semibold text-ink">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
            <MessageSquare className="h-3.5 w-3.5" />
          </span>
          Threads found
        </span>
        <span className="text-[0.66rem] text-muted-foreground">Reddit</span>
      </div>
      <ul className="space-y-1.5 px-4 sm:px-5">
        {[
          { w: ["88%", "54%"], state: "Reply drafted" },
          { w: ["76%", "40%"], state: "Reply drafted" },
        ].map((t, i) => (
          <li
            key={i}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2.5",
              i === 0
                ? "border-cta/30 bg-[color-mix(in_oklab,var(--cta)_4%,white)]"
                : "border-ink/[0.07]",
            )}
          >
            <span className="h-6 w-6 shrink-0 rounded-full bg-ink/[0.07]" />
            <span className="min-w-0 flex-1 space-y-1.5">
              <TextBar w={t.w[0]} />
              <TextBar w={t.w[1]} className="bg-ink/[0.05]" />
            </span>
            <span className="shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-semibold text-cta">
              {t.state}
            </span>
          </li>
        ))}
      </ul>
      <div className="mx-4 mb-4 mt-3 rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-3 sm:mx-5 sm:mb-5">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Draft reply
        </p>
        <div className="mt-2.5 space-y-1.5">
          <TextBar w="96%" />
          <TextBar w="90%" />
          <TextBar w="62%" />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[0.62rem] text-muted-foreground">Written to help first</span>
          <span className="inline-flex items-center gap-1 rounded-md border border-ink/[0.1] bg-white px-2 py-1 text-[0.64rem] font-semibold text-ink">
            <Send className="h-3 w-3" />
            You post it
          </span>
        </div>
      </div>
    </div>
  );
}

/* A month of articles as tiles: Rankbox's plan beside the competitor's
   cheapest per-article plan, both read from the pricing data. */
export function ArticlesSample({ competitor }: { competitor: Competitor }) {
  const entry = entryPlan(competitor);
  const rows = [
    {
      key: "rankbox",
      mark: <RankboxMark className="h-6 w-6" />,
      name: "Rankbox",
      price: formatUsd(PLAN.monthly),
      count: PLAN.articlesPerMonth,
      tile: "bg-cta",
    },
    ...(entry && entry.monthly !== null && entry.articles
      ? [
          {
            key: "them",
            mark: <CompetitorMark competitor={competitor} className="h-6 w-6 text-[0.55rem]" />,
            name: `${competitor.name} ${entry.name}`,
            price: formatUsd(entry.monthly),
            count: entry.articles,
            tile: "bg-ink/25",
          },
        ]
      : []),
  ];
  return (
    <div aria-hidden className={cn(CARD, "w-full max-w-md p-4 sm:p-5")}>
      <div className="flex items-center gap-2 text-[0.8rem] font-semibold text-ink">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
          <FileText className="h-3.5 w-3.5" />
        </span>
        Articles a month
      </div>
      <div className="mt-4 space-y-4">
        {rows.map((r) => (
          <div key={r.key}>
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                {r.mark}
                <span className="truncate text-[0.74rem] font-medium text-ink">{r.name}</span>
              </span>
              <span className="shrink-0 text-[0.7rem] tabular-nums text-muted-foreground">
                <span className="font-semibold text-ink">{r.count}</span> for {r.price}/mo
              </span>
            </div>
            <div className="mt-2 grid grid-cols-10 gap-1">
              {Array.from({ length: r.count }, (_, i) => (
                <motion.span
                  key={i}
                  className={cn("h-4 rounded-[3px]", r.tile)}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.25, delay: 0.15 + i * 0.025 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
