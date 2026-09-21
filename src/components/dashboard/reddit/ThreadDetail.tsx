/**
 * One thread, opened. The layout follows the order a careful person would
 * want the facts in: why we surfaced it (and how we know), the post itself,
 * what people have already said, and only then the reply.
 */
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button, Panel } from "@/components/dashboard/primitives";
import {
  dismissRedditOpportunity,
  generateRedditDraft,
  getRedditOpportunity,
  REDDIT_BLOCKED_COPY,
  REDDIT_DRAFT_COST,
  restoreRedditOpportunity,
  type RedditOpportunity,
} from "@/lib/data";
import { fitPercent } from "@/lib/reddit/scoring";
import { DraftPanel } from "./DraftPanel";
import { EvidenceBadges } from "./EvidenceBadge";
import { plural, threadAge } from "./format";
import { ActivityStat, SubredditLine } from "./shared";

/** The score's terms, in the member's words, so the number can show its work. */
const TERMS: Array<{ key: string; label: string; measured: boolean }> = [
  { key: "googleRank", label: "Google position", measured: true },
  { key: "aiCited", label: "Cited by an AI engine", measured: true },
  { key: "answerable", label: "You have something to say here", measured: false },
  { key: "subredditFit", label: "Subreddit fits your space", measured: false },
  { key: "engagement", label: "Votes and comments", measured: true },
  { key: "velocity", label: "Still active", measured: false },
  { key: "freshness", label: "Recent", measured: false },
];

export function ThreadDetail({
  opportunityId,
  balance,
  readOnly,
  onClose,
}: {
  opportunityId: string | null;
  balance: number;
  readOnly: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: detail } = useQuery({
    queryKey: ["reddit", "opportunity", opportunityId],
    queryFn: () => getRedditOpportunity({ id: opportunityId as string }),
    enabled: opportunityId !== null,
    refetchInterval: 15_000,
  });
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["reddit"] });

  return (
    <Sheet open={opportunityId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl">
        {!detail ? (
          <div className="space-y-4 p-6">
            <SheetTitle className="sr-only">Loading thread</SheetTitle>
            <SheetDescription className="sr-only">Loading</SheetDescription>
            <div className="skeleton h-6 w-2/3" />
            <div className="skeleton h-28 w-full" />
            <div className="skeleton h-40 w-full" />
          </div>
        ) : (
          <Body
            key={detail.opportunity.id}
            opportunity={detail.opportunity}
            draft={detail.drafts[0] ?? null}
            reply={detail.reply}
            balance={balance}
            readOnly={readOnly}
            onChanged={refresh}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function Body({
  opportunity,
  draft,
  reply,
  balance,
  readOnly,
  onChanged,
  onClose,
}: {
  opportunity: RedditOpportunity;
  draft: Parameters<typeof DraftPanel>[0]["draft"] | null;
  reply: Parameters<typeof DraftPanel>[0]["reply"];
  balance: number;
  readOnly: boolean;
  onChanged: () => void;
  onClose: () => void;
}) {
  const [writing, setWriting] = useState(false);
  const thread = opportunity.thread;
  const blocked = opportunity.blockedReason;
  const fit = fitPercent(opportunity.score);
  const rulesUnread = opportunity.subredditInfo?.rulesSource === "unavailable";

  async function write() {
    setWriting(true);
    try {
      await generateRedditDraft({ opportunityId: opportunity.id });
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't draft a reply.");
    } finally {
      setWriting(false);
    }
  }

  async function dismiss() {
    try {
      if (opportunity.status === "dismissed")
        await restoreRedditOpportunity({ id: opportunity.id });
      else await dismissRedditOpportunity({ id: opportunity.id });
      onChanged();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update that.");
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* why this thread — and how we know */}
      <div className="border-b border-border bg-secondary/30 px-6 py-3 pr-12">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Why this thread
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {threadAge(thread.postedAt)}
          </span>
        </div>
        <EvidenceBadges thread={thread} detailed className="mt-2" />
      </div>

      <div className="flex-1 space-y-5 p-6">
        {/* the post */}
        <div>
          <SubredditLine subreddit={thread.subreddit} author={thread.author || undefined} />
          <SheetTitle className="mt-1.5 text-base font-semibold leading-snug text-ink">
            {thread.title}
          </SheetTitle>
          <SheetDescription className="sr-only">
            A Reddit thread in r/{thread.subreddit}
          </SheetDescription>
          {thread.body && (
            <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">
              {thread.body}
            </p>
          )}
          <div className="mt-2.5 flex flex-wrap items-center gap-4">
            <ActivityStat
              upVotes={thread.upVotes}
              numComments={thread.numComments}
              partial={thread.partialData}
            />
            <a
              href={thread.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-ink"
            >
              Open on Reddit <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* what people already said */}
        {thread.topComments.length > 0 && (
          <div className="space-y-3">
            {thread.topComments.slice(0, 3).map((c) => (
              <div key={`${c.author}-${c.score}`} className="ml-2 border-l-2 border-border pl-3">
                <p className="text-[0.7rem] text-muted-foreground">
                  <span className="font-semibold text-ink">u/{c.author}</span> · ▲ {c.score}
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-ink/80">{c.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* the reply, or the reason there won't be one */}
        {blocked && !reply ? (
          <Panel className="border-warning/30 bg-warning/10 p-4">
            <p className="text-sm font-semibold text-ink">Rankbox won&rsquo;t draft for this one</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {REDDIT_BLOCKED_COPY[blocked]}
            </p>
            {blocked === "promo_banned" && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                This holds however well the thread ranks. A reply that gets your account actioned
                isn&rsquo;t an opportunity, and it can&rsquo;t be switched back on in settings.
              </p>
            )}
          </Panel>
        ) : draft ? (
          <DraftPanel
            opportunity={opportunity}
            draft={draft}
            reply={reply}
            readOnly={readOnly}
            onChanged={onChanged}
          />
        ) : reply ? null : (
          <Panel className="space-y-3 p-4">
            {rulesUnread && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                We couldn&rsquo;t read r/{thread.subreddit}&rsquo;s rules. The draft will be checked
                against everything else, and that one check will be left for you.
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="brand"
                onClick={() => void write()}
                disabled={writing || readOnly || balance < REDDIT_DRAFT_COST}
              >
                {writing ? "Writing…" : `Draft a reply · ${plural(REDDIT_DRAFT_COST, "credit")}`}
              </Button>
              <span className="text-xs text-muted-foreground">
                {readOnly
                  ? "Resubscribe to draft replies."
                  : balance < REDDIT_DRAFT_COST
                    ? "You're out of reply credits for this cycle."
                    : `${plural(balance, "credit")} left this cycle. You review it before anything leaves this page.`}
              </span>
            </div>
          </Panel>
        )}

        {/* the score, showing its work */}
        {fit !== null && (
          <details className="group rounded-card border border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-ink">
              <span>How this was ranked</span>
              <span className="text-xs text-muted-foreground">
                Fit {fit} / 100 <span className="group-open:hidden">· show</span>
              </span>
            </summary>
            <div className="space-y-2 border-t border-border px-4 py-3">
              {TERMS.map((t) => {
                const value = Math.round((opportunity.breakdown[t.key] ?? 0) * 100);
                return (
                  <div key={t.key} className="flex items-center gap-3 text-xs">
                    <span className="w-48 shrink-0 text-ink">{t.label}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full bg-volt"
                        style={{ width: `${value}%` }}
                      />
                    </span>
                    <span className="w-16 shrink-0 text-right text-muted-foreground">
                      {t.measured ? "measured" : "estimated"}
                    </span>
                  </div>
                );
              })}
              <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
                Fit is our estimate of whether this thread is worth your time. It is not a
                prediction of traffic, upvotes or citations.
              </p>
            </div>
          </details>
        )}
      </div>

      {!readOnly && !reply && opportunity.status !== "posted" && (
        <div className="border-t border-border px-6 py-3">
          <button
            type="button"
            onClick={() => void dismiss()}
            className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-ink"
          >
            {opportunity.status === "dismissed" ? "Restore to my list" : "Not for me — dismiss"}
          </button>
        </div>
      )}
    </div>
  );
}
