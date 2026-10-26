/**
 * Sample screens for the three places Rankbox and Byword differ, one per
 * deep dive, keyed by the feature each one links to. They show only what the
 * deep dive's own points say, on a sample site (yoursite.com), and are
 * marked as samples.
 */
import type { ReactNode } from "react";
import { ArrowRight, Check, Copy, Link2, Lock, MessageSquare, Search } from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import { cn } from "@/lib/utils";
import { PLAN } from "@/data/pricing";
import { SCREEN } from "./parts";

function Frame({
  icon: Icon,
  title,
  aside,
  children,
}: {
  icon: typeof Search;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div aria-hidden className={cn(SCREEN, "w-full max-w-[26rem] overflow-hidden text-left")}>
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-[0.78rem] font-medium text-ink">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
            <Icon className="h-3 w-3" />
          </span>
          <span className="truncate">{title}</span>
        </span>
        {aside}
      </div>
      <div className="p-4">{children}</div>
      <div className="flex items-center justify-between border-t border-ink/[0.07] px-4 py-2 text-[0.65rem] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Mark className="h-3 w-3 text-brand-blue" />
          yoursite.com
        </span>
        <span className="rounded border border-ink/[0.08] px-1.5 py-px font-semibold uppercase tracking-[0.12em]">
          Sample
        </span>
      </div>
    </div>
  );
}

const ROW = "flex items-center gap-2.5 rounded-lg border border-ink/[0.07] bg-white px-3 py-2";

/* answer-space-research: a plan approved once, the next article on cadence. */
function PlanSample() {
  const rows: { q: string; state: "done" | "next" | "queued" }[] = [
    { q: "How to plan a product launch", state: "done" },
    { q: "Kanban vs scrum for small teams", state: "done" },
    { q: "What goes in a launch checklist?", state: "next" },
    { q: "How to estimate a project timeline", state: "queued" },
  ];
  return (
    <Frame
      icon={Search}
      title="Content plan"
      aside={
        <span className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.65rem] font-semibold text-cta">
          Approved
        </span>
      }
    >
      <div className="mb-3 flex items-center justify-between text-[0.72rem]">
        <span className="text-muted-foreground">Cadence</span>
        <span className="flex gap-1">
          {["Weekly", "Daily"].map((c) => (
            <span
              key={c}
              className={cn(
                "rounded-md px-2 py-0.5 font-medium",
                c === "Daily" ? "bg-cta text-white" : "border border-ink/[0.08] text-ink",
              )}
            >
              {c}
            </span>
          ))}
        </span>
      </div>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.q} className={cn(ROW, r.state === "next" && "border-cta/30 bg-cta-soft")}>
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                r.state === "done" && "bg-cta text-white",
                r.state === "next" && "border border-cta text-cta",
                r.state === "queued" && "border border-ink/15",
              )}
            >
              {r.state === "done" && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
              {r.state === "next" && <ArrowRight className="h-2.5 w-2.5" />}
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.75rem] font-medium text-ink">
              {r.q}
            </span>
            <span
              className={cn(
                "shrink-0 text-[0.6rem] font-semibold uppercase tracking-wide",
                r.state === "done" && "text-muted-foreground",
                r.state === "next" && "text-cta",
                r.state === "queued" && "text-muted-foreground/70",
              )}
            >
              {r.state === "done" ? "Written" : r.state === "next" ? "Next" : "In plan"}
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/* authority-backlinks: monthly credits, a link's cost, escrow until verified. */
function CreditsSample() {
  const spent = 3;
  return (
    <Frame
      icon={Link2}
      title="Backlink credits"
      aside={
        <span className="text-[0.68rem] font-medium tabular-nums text-muted-foreground">
          {PLAN.backlinkCreditsPerMonth} this month
        </span>
      }
    >
      <div className="grid grid-cols-15 gap-1">
        {Array.from({ length: PLAN.backlinkCreditsPerMonth }, (_, i) => (
          <span
            key={i}
            className={cn("aspect-square rounded-[3px]", i < spent ? "bg-ink/[0.12]" : "bg-cta")}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-1.5">
        <li className={ROW}>
          <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-[0.75rem] font-medium text-ink">
            Link in a member&rsquo;s article
          </span>
          <span className="shrink-0 text-[0.68rem] tabular-nums text-muted-foreground">
            2 credits
          </span>
          <span className="shrink-0 rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-ink/70">
            Escrow
          </span>
        </li>
        <li className={ROW}>
          <Check className="h-3.5 w-3.5 shrink-0 text-cta" strokeWidth={3} />
          <span className="min-w-0 flex-1 truncate text-[0.75rem] font-medium text-ink">
            Link in a member&rsquo;s article
          </span>
          <span className="shrink-0 text-[0.68rem] tabular-nums text-muted-foreground">
            1 credit
          </span>
          <span className="shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-cta">
            Verified
          </span>
        </li>
      </ul>
    </Frame>
  );
}

/* reddit-presence: a thread found, a reply drafted, posted by you. */
function RedditSample() {
  return (
    <Frame icon={MessageSquare} title="Reddit threads">
      <div className="rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_40%,white)] px-3 py-2.5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Thread found
        </p>
        <p className="mt-1 text-[0.78rem] font-medium leading-snug text-ink">
          How do small teams keep a launch on schedule?
        </p>
      </div>
      <div className="mt-2.5 rounded-lg border border-cta/25 bg-white px-3 py-2.5 shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_7%,transparent)]">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-cta">
          Draft reply
        </p>
        <p className="mt-1 text-[0.75rem] leading-relaxed text-ink/80">
          What worked for us: one shared checklist, a single owner per task, and a short review
          every Friday. Happy to share the template we use.
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-[0.68rem] text-muted-foreground">Posted by you, under your name</span>
        <span className="inline-flex items-center gap-1 rounded-md bg-cta px-2 py-1 text-[0.68rem] font-semibold text-white">
          <Copy className="h-3 w-3" />
          Copy draft
        </span>
      </div>
    </Frame>
  );
}

const SAMPLES: Record<string, () => ReactNode> = {
  "answer-space-research": PlanSample,
  "authority-backlinks": CreditsSample,
  "reddit-presence": RedditSample,
};

export function BattlegroundSample({ featureSlug }: { featureSlug: string }) {
  const Sample = SAMPLES[featureSlug];
  return Sample ? <Sample /> : null;
}
