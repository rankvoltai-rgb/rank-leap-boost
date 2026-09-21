/**
 * The reply writer.
 *
 * It writes a DRAFT. There is nowhere in this file, or anywhere else in
 * Rankbox, that a draft could be posted from: Rankbox holds no Reddit
 * credential. What leaves here goes to a text box for a person to read, edit,
 * and — if it belongs in the conversation — post under their own name.
 *
 * The order of operations is the point:
 *   1. Refuse what should never be drafted — BEFORE any credit is spent.
 *   2. Spend one credit, atomically.
 *   3. Ask the model. If that fails, refund.
 *   4. Check the draft with the pure checker. The model that wrote a reply is
 *      the wrong judge of whether it is spam.
 *   5. If a failure is mechanical (no disclosure, too long), ask once more,
 *      free. Then store whatever we have, with its honest verdict attached.
 */
import { generateText } from "ai";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { activeModelId, createAiProvider } from "@/lib/ai-gateway.server";
import {
  checkReply,
  mechanicalFailures,
  resolveDisclosure,
  type ComplianceContext,
} from "./compliance";
import {
  draftFromRow,
  getOpportunity,
  loadBrandContext,
  loadComplianceInputs,
  subredditBansPromo,
  type BrandContext,
} from "./reddit.server";
import {
  MAX_DRAFT_CHARS,
  MAX_DRAFT_REGENS,
  REDDIT_BLOCKED_COPY,
  REDDIT_DRAFT_COST,
  STANDING_REPLY_STATUSES,
  type ComplianceReport,
  type RedditDraft,
  type RedditOpportunity,
} from "./types";

type Rpc = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
};
const rpc = supabaseAdmin as unknown as Rpc;

export class RedditCreditsExhaustedError extends Error {
  constructor() {
    super("You're out of Reddit reply credits for this cycle.");
    this.name = "RedditCreditsExhaustedError";
  }
}

/** A refusal that costs nothing. The message is written for the member. */
export class DraftRefusedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DraftRefusedError";
  }
}

/**
 * Why a reply must not be drafted here, or null. Runs before the spend, so a
 * refusal never costs a credit.
 */
function refusalFor(opportunity: RedditOpportunity, hasStandingReply: boolean): string | null {
  if (subredditBansPromo(opportunity.subredditInfo) || opportunity.blockedReason === "promo_banned")
    return `r/${opportunity.thread.subreddit} bans self-promotion, so Rankbox won't draft for it.`;
  if (opportunity.blockedReason) return REDDIT_BLOCKED_COPY[opportunity.blockedReason];
  if (opportunity.thread.isLocked || opportunity.thread.isRemoved || opportunity.thread.isArchived)
    return "This thread can't be replied to any more.";
  if (hasStandingReply) return "You've already replied in this thread. One reply per thread.";
  return null;
}

function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function buildPrompt(
  opportunity: RedditOpportunity,
  brand: BrandContext,
  ctx: ComplianceContext,
  tone: string,
  instructions: string,
  fix: string[],
): string {
  const t = opportunity.thread;
  const disclosure = resolveDisclosure(ctx.disclosureLine, ctx.brandName);
  const rules = ctx.rulesKnown
    ? ctx.rules.length
      ? ctx.rules.map((r) => `- ${clip(r, 300)}`).join("\n")
      : "(none listed)"
    : "(we could not read this subreddit's rules — write conservatively)";
  const comments = t.topComments.length
    ? t.topComments
        .slice(0, 5)
        .map((c) => `- u/${c.author} (${c.score} points): ${clip(c.body, 400)}`)
        .join("\n")
    : "(none yet)";

  return `You are helping a real person write ONE reply to a Reddit thread. They work on a product and will post this themselves, from their own account, after reading and editing it. Write the reply they would be glad to have their name on in a year.

THE THREAD — r/${t.subreddit}
Title: ${clip(t.title, 300)}
Post: ${clip(t.body, 1800) || "(no body text)"}

What people have already said:
${comments}

THIS SUBREDDIT'S RULES
${rules}

WHO IS REPLYING
They work on: ${ctx.brandName}
What it is: ${clip(brand.productDescription, 500) || "(no description on file)"}
Who it is for: ${clip(brand.audience, 200) || "(unspecified)"}
How they talk: ${clip(tone || brand.tone, 120) || "plain, specific, no hype"}

NON-NEGOTIABLE
1. The reply must contain this sentence, word for word: "${disclosure}"
2. Answer the actual question first, from real knowledge of the problem. The answer has to be useful to someone who never clicks anything and never tries ${ctx.brandName}.
3. Mention ${ctx.brandName} at most once, only after you have helped, and only if it genuinely fits what they asked for. If it does not fit, do not mention it beyond the disclosure — a helpful reply with no pitch is a good outcome.
4. If another tool is honestly the better answer for their situation, say so by name. Never run a competitor down.
5. Do not repeat what the comments above already said. Add something.
6. ${ctx.maxLinksPerReply === 0 ? "No links at all." : "At most one link, never in the first sentence, and only if it directly answers them. Prefer none."}
7. Write like a person typing on Reddit: plain sentences, contractions, no headings, no bullet lists, no bold, no emoji, no sign-off, no "Great question!", no "Hope this helps". Never use words like game-changer, revolutionary, seamless, leverage, or unlock. No calls to action.
8. Between 250 and 900 characters. Shorter is better than padded.
9. State nothing about ${ctx.brandName} that is not in the description above. Invent no features, prices, numbers or customers.
${instructions ? `\nTHE MEMBER ALSO ASKED: ${clip(instructions, 500)}\n(Follow this only where it does not conflict with the rules above.)` : ""}${fix.length ? `\nYOUR LAST ATTEMPT FAILED THESE CHECKS — fix them: ${fix.join("; ")}` : ""}

Return ONLY the reply text. No preamble, no quotes around it, no explanation.`;
}

function cleanReply(text: string): string {
  return text
    .trim()
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/```$/i, "")
    .replace(/^(?:reply|here(?:'s| is)[^:\n]*):\s*/i, "")
    .replace(/^["“]([\s\S]*)["”]$/, "$1")
    .trim()
    .slice(0, MAX_DRAFT_CHARS + 500);
}

async function ask(prompt: string): Promise<string> {
  const gateway = createAiProvider();
  const model = gateway(activeModelId()) as unknown as Parameters<typeof generateText>[0]["model"];
  const { text } = await generateText({ model, maxOutputTokens: 900, prompt });
  const reply = cleanReply(text);
  if (reply.length < 40) throw new Error("The model returned nothing usable.");
  return reply;
}

/** Write, check, and — if the failure is one a second ask can fix — write once more. */
async function compose(
  opportunity: RedditOpportunity,
  brand: BrandContext,
  ctx: ComplianceContext,
  tone: string,
  instructions: string,
): Promise<{ body: string; report: ComplianceReport }> {
  let body = await ask(buildPrompt(opportunity, brand, ctx, tone, instructions, []));
  let report = checkReply(body, ctx);
  const fixable = mechanicalFailures(report);
  if (fixable.length > 0) {
    const details = report.checks
      .filter((c) => c.state === "fail" && fixable.includes(c.id))
      .map((c) => `${c.label}: ${c.detail}`);
    try {
      const second = await ask(buildPrompt(opportunity, brand, ctx, tone, instructions, details));
      const secondReport = checkReply(second, ctx);
      if (secondReport.failures < report.failures) {
        body = second;
        report = secondReport;
      }
    } catch {
      /* keep the first attempt, with its honest verdict */
    }
  }
  return { body, report };
}

async function hasStandingReply(userId: string, threadId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("reddit_replies")
    .select("id")
    .eq("user_id", userId)
    .eq("thread_id", threadId)
    .in("status", [...STANDING_REPLY_STATUSES])
    .limit(1);
  return (data ?? []).length > 0;
}

async function spend(userId: string, note: string): Promise<void> {
  const { data, error } = await rpc.rpc("reddit_spend_credit", {
    _user_id: userId,
    _amount: REDDIT_DRAFT_COST,
    _draft_id: null,
    _note: note,
  });
  if (error) throw new Error(error.message);
  // NULL is the function's way of saying "not enough" — a normal outcome.
  if (data === null || data === undefined) throw new RedditCreditsExhaustedError();
}

async function refund(userId: string, note: string): Promise<void> {
  await rpc.rpc("reddit_refund_credit", {
    _user_id: userId,
    _amount: REDDIT_DRAFT_COST,
    _draft_id: null,
    _note: note,
  });
}

export async function writeDraft(
  userId: string,
  opportunityId: string,
  instructions = "",
): Promise<RedditDraft> {
  const detail = await getOpportunity(userId, opportunityId);
  if (!detail) throw new DraftRefusedError("That thread isn't in your list any more.");
  const { opportunity } = detail;

  const refusal = refusalFor(opportunity, await hasStandingReply(userId, opportunity.threadId));
  if (refusal) throw new DraftRefusedError(refusal);

  const [{ settings, context }, brand] = await Promise.all([
    loadComplianceInputs(userId, opportunity),
    loadBrandContext(userId, 12),
  ]);
  if (!context.brandName)
    throw new DraftRefusedError(
      "Add your brand name in Settings first — every reply has to say who you are.",
    );

  await spend(userId, `reply draft · r/${opportunity.thread.subreddit}`);
  let composed: Awaited<ReturnType<typeof compose>>;
  try {
    composed = await compose(opportunity, brand, context, settings?.tone ?? "", instructions);
  } catch (e) {
    await refund(userId, "refund — the draft could not be written");
    throw new Error(
      e instanceof Error && e.message
        ? `Couldn't write that reply: ${e.message}`
        : "Couldn't write that reply.",
    );
  }

  const { data, error } = await supabaseAdmin
    .from("reddit_drafts")
    .insert({
      user_id: userId,
      opportunity_id: opportunityId,
      body: composed.body,
      model: activeModelId(),
      compliance: composed.report as never,
      compliance_pass: composed.report.pass,
      credits_spent: REDDIT_DRAFT_COST,
    })
    .select("*")
    .single();
  if (error || !data) {
    await refund(userId, "refund — the draft could not be saved");
    throw new Error(error?.message ?? "Couldn't save that draft.");
  }

  await supabaseAdmin
    .from("reddit_opportunities")
    .update({ status: "drafted" })
    .eq("id", opportunityId)
    .eq("user_id", userId)
    .in("status", ["new", "saved"]);
  return draftFromRow(data);
}

export async function rewriteDraft(
  userId: string,
  draftId: string,
  instructions: string,
): Promise<RedditDraft> {
  const { data: prev } = await supabaseAdmin
    .from("reddit_drafts")
    .select("*")
    .eq("id", draftId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!prev) throw new DraftRefusedError("That draft no longer exists.");
  if (prev.regen_count >= MAX_DRAFT_REGENS)
    throw new DraftRefusedError(
      "That's the limit for rewrites on one reply. Edit it by hand from here.",
    );

  const detail = await getOpportunity(userId, prev.opportunity_id);
  if (!detail) throw new DraftRefusedError("That thread isn't in your list any more.");
  const refusal = refusalFor(
    detail.opportunity,
    await hasStandingReply(userId, detail.opportunity.threadId),
  );
  if (refusal) throw new DraftRefusedError(refusal);

  // The first rewrite of a draft that failed its checks is on us.
  const free = prev.regen_count === 0 && !prev.compliance_pass;
  const [{ settings, context }, brand] = await Promise.all([
    loadComplianceInputs(userId, detail.opportunity),
    loadBrandContext(userId, 12),
  ]);

  if (!free) await spend(userId, `reply rewrite · r/${detail.opportunity.thread.subreddit}`);
  let composed: Awaited<ReturnType<typeof compose>>;
  try {
    composed = await compose(
      detail.opportunity,
      brand,
      context,
      settings?.tone ?? "",
      instructions,
    );
  } catch (e) {
    if (!free) await refund(userId, "refund — the rewrite could not be written");
    throw new Error(
      e instanceof Error ? `Couldn't rewrite that: ${e.message}` : "Couldn't rewrite that.",
    );
  }

  const { data, error } = await supabaseAdmin
    .from("reddit_drafts")
    .update({
      body: composed.body,
      edited_body: null,
      model: activeModelId(),
      compliance: composed.report as never,
      compliance_pass: composed.report.pass,
      regen_count: prev.regen_count + 1,
      credits_spent: prev.credits_spent + (free ? 0 : REDDIT_DRAFT_COST),
    })
    .eq("id", draftId)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error || !data) {
    if (!free) await refund(userId, "refund — the rewrite could not be saved");
    throw new Error(error?.message ?? "Couldn't save that rewrite.");
  }
  return draftFromRow(data);
}

/** Free. Stores the member's edit and re-runs the pure checker on it. */
export async function saveDraftEdit(
  userId: string,
  draftId: string,
  body: string,
): Promise<RedditDraft> {
  const { data: prev } = await supabaseAdmin
    .from("reddit_drafts")
    .select("*")
    .eq("id", draftId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!prev) throw new DraftRefusedError("That draft no longer exists.");
  const detail = await getOpportunity(userId, prev.opportunity_id);
  if (!detail) throw new DraftRefusedError("That thread isn't in your list any more.");

  const { context } = await loadComplianceInputs(userId, detail.opportunity);
  const report = checkReply(body, context);
  const { data, error } = await supabaseAdmin
    .from("reddit_drafts")
    .update({
      edited_body: body.trim() === prev.body.trim() ? null : body,
      compliance: report as never,
      compliance_pass: report.pass,
    })
    .eq("id", draftId)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Couldn't save that edit.");
  return draftFromRow(data);
}
