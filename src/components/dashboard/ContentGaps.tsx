/**
 * Content gaps waiting to be claimed.
 *
 * One tap on the circle queues the article, which is the only decision this
 * list asks for — everything else about the idea is one line of context.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "./primitives";
import { TargetIcon } from "./icons";
import type { Blog } from "@/lib/data";

/** Rows shown before "View all", matching the queue above. */
const PREVIEW = 5;

export function ContentGaps({
  gaps,
  busyId,
  onQueue,
}: {
  gaps: Blog[];
  busyId: string | null;
  onQueue: (blog: Blog) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? gaps : gaps.slice(0, PREVIEW);
  return (
    <Panel className="flex flex-col overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4">
        <TargetIcon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-base font-semibold text-ink">Content gaps to win</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums text-muted-foreground">
          {gaps.length}
        </span>
        <Link
          to="/dashboard/blog-engine"
          className="ml-auto rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
        >
          See all
        </Link>
      </div>

      <div className="flex-1 border-t border-border">
        {gaps.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No new gaps right now. Autopilot surfaces more as it scans your space.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {shown.map((gap) => {
              const busy = busyId === gap.id;
              return (
                <li key={gap.id} className="flex items-start gap-3 px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => onQueue(gap)}
                    disabled={busy}
                    title="Add to queue"
                    aria-label={`Add "${gap.title}" to the queue`}
                    className={cn(
                      "group mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors",
                      "hover:border-brand-blue hover:bg-brand-blue hover:text-white disabled:opacity-60",
                    )}
                  >
                    {busy ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-3 w-3 group-hover:hidden" />
                        <Check className="hidden h-3 w-3 group-hover:block" />
                      </>
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink" title={gap.title}>
                      {gap.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {gap.keyword ?? "No keyword"} · +{gap.traffic_estimate.toLocaleString()}/mo ·{" "}
                      {gap.competition ?? "Medium"} competition
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {gaps.length > PREVIEW && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-border px-5 py-3 text-sm font-medium text-brand-blue transition-colors hover:bg-secondary/60"
        >
          {showAll ? "Show less" : `View all ${gaps.length}`}
          <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
        </button>
      )}
    </Panel>
  );
}
