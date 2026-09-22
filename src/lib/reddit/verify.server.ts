/**
 * Checking that a reply the member says they posted is really there.
 *
 * This looks at a public comment on a site we do not control, so its findings
 * are kept modest. `unreachable` and `blocked` mean WE failed to look; they
 * are recorded and change nothing about the reply. Only an actual sighting
 * confirms it, only an actual [removed] marks it removed, and it takes three
 * clean misses in a row before we say it can't be found.
 *
 * Nothing here moves a credit. Rankbox sold a draft, not an outcome — a reply
 * a moderator removes costs the member nothing and refunds nothing.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { SiteScope } from "@/lib/entitlement.server";
import { apifyConfigured, fetchRedditComment, fetchRedditPosts } from "./apify.server";
import { groupScrape, toRedditComment } from "./normalize";
import type { RedditReplyStatus } from "./types";

type Rpc = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
};
const rpc = supabaseAdmin as unknown as Rpc;

const PER_CHECK_USD = 0.05;

export type CheckOutcome = "found" | "missing" | "removed" | "unreachable" | "blocked";

async function apply(replyId: string, outcome: CheckOutcome, score: number | null, detail: string) {
  const { data } = await rpc.rpc("reddit_apply_reply_check", {
    _reply_id: replyId,
    _outcome: outcome,
    _score: score,
    _detail: detail,
  });
  return (data as RedditReplyStatus | null) ?? null;
}

/**
 * One check of one reply. `scope` limits the lookup to that site's replies
 * when a member asks for it; the cron passes null and checks whatever is due.
 */
export async function verifyReply(
  replyId: string,
  scope: SiteScope | null,
): Promise<{ outcome: CheckOutcome; status: RedditReplyStatus | null }> {
  let query = supabaseAdmin.from("reddit_replies").select("*").eq("id", replyId);
  if (scope) query = query.eq("site_id", scope.siteId).eq("user_id", scope.userId);
  const { data: reply } = await query.maybeSingle();
  if (!reply) throw new Error("That reply isn't on file.");

  // A bare claim has no link, so there is nothing to look at. Its status
  // cannot change until the member gives us one.
  if (!reply.permalink || !reply.reddit_comment_id)
    return { outcome: "missing", status: reply.status };

  if (!apifyConfigured())
    return {
      outcome: "unreachable",
      status: await apply(reply.id, "unreachable", null, "no provider configured"),
    };

  const res = await fetchRedditComment(reply.permalink, { maxChargeUsd: PER_CHECK_USD });
  if (!res.ok) {
    const outcome: CheckOutcome = res.reason === "http" ? "blocked" : "unreachable";
    return { outcome, status: await apply(reply.id, outcome, null, res.reason ?? "") };
  }

  const wanted = reply.reddit_comment_id.toLowerCase();
  const comment = res.items.map(toRedditComment).find((c) => c?.commentId === wanted) ?? null;
  if (!comment) return { outcome: "missing", status: await apply(reply.id, "missing", null, "") };
  if (comment.isRemoved)
    return { outcome: "removed", status: await apply(reply.id, "removed", null, comment.body) };
  return { outcome: "found", status: await apply(reply.id, "found", comment.score, "") };
}

/**
 * Re-measure threads that have a live reply in them, and append to the dated
 * series the Mentions chart is drawn from. Append-only: a reading is never
 * revised, only followed by the next one.
 */
export async function remeasureThreads(threadIds: string[], maxChargeUsd: number): Promise<number> {
  if (threadIds.length === 0 || !apifyConfigured()) return 0;
  const { data: threads } = await supabaseAdmin
    .from("reddit_threads")
    .select("id, reddit_id, permalink")
    .in("id", threadIds);
  if (!threads?.length) return 0;

  const res = await fetchRedditPosts(
    threads.map((t) => t.permalink),
    { commentsPerPost: 0, maxChargeUsd },
  );
  if (!res.ok) return 0;

  const idByReddit = new Map(threads.map((t) => [t.reddit_id, t.id]));
  const checkedAt = new Date().toISOString();
  const rows: Array<{
    thread_id: string;
    up_votes: number;
    num_comments: number;
    checked_at: string;
  }> = [];
  for (const post of groupScrape(res.items)) {
    const threadId = idByReddit.get(post.redditId);
    if (!threadId) continue;
    rows.push({
      thread_id: threadId,
      up_votes: post.upVotes,
      num_comments: post.numComments,
      checked_at: checkedAt,
    });
    const payload: Record<string, unknown> = {
      reddit_id: post.redditId,
      subreddit: post.subreddit,
      permalink: post.permalink,
      up_votes: post.upVotes,
      num_comments: post.numComments,
      is_locked: post.isLocked,
      is_removed: post.isRemoved,
      hydrated_at: checkedAt,
    };
    if (post.isArchived !== null) payload.is_archived = post.isArchived;
    await rpc.rpc("reddit_upsert_thread", { _payload: payload });
  }
  if (rows.length > 0) await supabaseAdmin.from("reddit_thread_stats").insert(rows);
  return rows.length;
}
