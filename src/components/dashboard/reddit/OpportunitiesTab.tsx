/**
 * The threads a sweep found, ranked. Blocked threads are a filter here and not
 * a hidden bucket: a thread the member can see we found, and can see why we
 * won't touch, is more trustworthy than one we quietly dropped.
 */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState, Pill } from "@/components/dashboard/primitives";
import { DataTable, Td, Tr } from "@/components/dashboard/data-table";
import { ThreadIcon } from "@/components/dashboard/icons";
import { ProgressRing } from "@/components/dashboard/rewards";
import { listRedditOpportunities, REDDIT_BLOCKED_COPY, type RedditOpportunity } from "@/lib/data";
import { fitPercent } from "@/lib/reddit/scoring";
import { cn } from "@/lib/utils";
import { EvidenceBadges } from "./EvidenceBadge";
import { matchesFilter, threadAge, type OpportunityFilter } from "./format";
import { ActivityStat, SubredditLine } from "./shared";

const FILTERS: Array<{ id: OpportunityFilter; label: string }> = [
  { id: "open", label: "All open" },
  { id: "ranked", label: "Ranks on Google" },
  { id: "cited", label: "AI-cited" },
  { id: "fresh", label: "Fresh" },
  { id: "drafted", label: "Drafted" },
  { id: "blocked", label: "Blocked" },
];

const EMPTY_COPY: Record<OpportunityFilter, string> = {
  open: "Nothing open right now. The next sweep will look again.",
  ranked: "No open thread has a measured Google position right now.",
  cited: "No open thread has a measured AI citation. We check your top keywords each week.",
  fresh: "Nothing from the last week.",
  drafted: "No drafts waiting on you.",
  blocked: "Nothing blocked.",
};

export function OpportunitiesTab({
  action,
  onOpen,
}: {
  /** The sweep button, placed by the page so it can sit beside the filters. */
  action?: React.ReactNode;
  onOpen: (id: string) => void;
}) {
  const [filter, setFilter] = useState<OpportunityFilter>("open");
  const { data: all } = useQuery({
    queryKey: ["reddit", "opportunities"],
    queryFn: listRedditOpportunities,
    refetchInterval: 30_000,
  });

  const counts = useMemo(() => {
    const out = {} as Record<OpportunityFilter, number>;
    for (const f of FILTERS) out[f.id] = (all ?? []).filter((o) => matchesFilter(o, f.id)).length;
    return out;
  }, [all]);

  if (!all) return <div className="skeleton h-72 w-full" />;

  if (all.length === 0)
    return (
      <EmptyState
        icon={<ThreadIcon className="h-5 w-5" />}
        title="No sweep has run yet"
        description="A sweep searches Google and Reddit for your tracked keywords and ranks the threads it finds. It's free, and it runs weekly once you've started."
        action={action}
      />
    );

  const rows = all.filter((o) => matchesFilter(o, filter));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter threads">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === f.id
                  ? "border-ink bg-ink text-background"
                  : "border-border bg-card text-muted-foreground hover:text-ink",
              )}
            >
              {f.label}
              <span className={cn("tabular-nums", filter !== f.id && "text-muted-foreground/70")}>
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>
        {action && <div className="ml-auto">{action}</div>}
      </div>

      {rows.length === 0 ? (
        <EmptyState title={EMPTY_COPY[filter]} />
      ) : (
        <DataTable
          minWidth={820}
          columns={[
            { label: "Thread" },
            { label: "What we measured" },
            { label: "Activity" },
            { label: filter === "blocked" ? "Why not" : "Fit", className: "text-right" },
          ]}
        >
          {rows.map((o) => (
            <Row key={o.id} opportunity={o} onOpen={() => onOpen(o.id)} />
          ))}
        </DataTable>
      )}

      {filter === "blocked" && rows.length > 0 && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          These were found by the sweep and set aside. We list them so you can see what was skipped
          and why — not because there&rsquo;s anything to do about them.
        </p>
      )}
    </div>
  );
}

function Row({ opportunity: o, onOpen }: { opportunity: RedditOpportunity; onOpen: () => void }) {
  const fit = fitPercent(o.score);
  return (
    <Tr
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open thread: ${o.thread.title}`}
      className="cursor-pointer focus-visible:bg-secondary/60 focus-visible:outline-none"
    >
      <Td className="max-w-[22rem]">
        <SubredditLine subreddit={o.thread.subreddit} />
        <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-snug text-ink">
          {o.thread.title}
        </p>
        {o.status === "drafted" && (
          <Pill tone="info" className="mt-1.5">
            Draft waiting
          </Pill>
        )}
      </Td>
      <Td>
        <EvidenceBadges thread={o.thread} />
      </Td>
      <Td>
        <ActivityStat
          upVotes={o.thread.upVotes}
          numComments={o.thread.numComments}
          partial={o.thread.partialData}
        />
        <p className="mt-1 text-xs text-muted-foreground">{threadAge(o.thread.postedAt)}</p>
      </Td>
      <Td className="text-right">
        {o.blockedReason ? (
          <span className="block max-w-[15rem] text-left text-xs leading-relaxed text-muted-foreground sm:ml-auto">
            {REDDIT_BLOCKED_COPY[o.blockedReason]}
          </span>
        ) : fit !== null ? (
          <span
            className="inline-flex justify-end"
            title={`Fit ${fit} / 100 — our estimate, not a prediction.`}
          >
            <ProgressRing value={fit} max={100} size={36} stroke={4}>
              <span className="text-[0.62rem] font-semibold tabular-nums text-ink">{fit}</span>
            </ProgressRing>
          </span>
        ) : null}
      </Td>
    </Tr>
  );
}
