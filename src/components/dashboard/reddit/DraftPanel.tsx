/**
 * The hand-off. The most important screen in the feature, because it is where
 * Rankbox stops and the member starts.
 *
 * Rankbox has no Reddit account and cannot post. So this panel's job is to be
 * plain about that: here is a draft, here is what we checked and what we
 * couldn't, and the rest — reading it as yourself, deciding it belongs, and
 * posting it under your own name — is yours. The order of the buttons is the
 * order of the work: copy, open the thread, then come back and tell us.
 */
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Button, Panel } from "@/components/dashboard/primitives";
import {
  draftText,
  markRedditReplyPosted,
  MAX_DRAFT_CHARS,
  MAX_DRAFT_REGENS,
  regenerateRedditDraft,
  updateRedditDraft,
  verifyRedditReply,
  type RedditDraft,
  type RedditOpportunity,
  type RedditReply,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { ComplianceChecklist } from "./ComplianceChecklist";
import { inputClass, REPLY_STATUS, timeAgo } from "./format";
import { ReplyStatusPill } from "./shared";

export function DraftPanel({
  opportunity,
  draft,
  reply,
  readOnly,
  onChanged,
}: {
  opportunity: RedditOpportunity;
  draft: RedditDraft;
  reply: RedditReply | null;
  readOnly: boolean;
  onChanged: () => void;
}) {
  const [text, setText] = useState(draftText(draft));
  const [report, setReport] = useState(draft.compliance);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<"rewrite" | "posted" | null>(null);
  const [permalink, setPermalink] = useState("");
  const saved = useRef(draftText(draft));

  // A rewrite replaces the text from outside; pick it up.
  useEffect(() => {
    setText(draftText(draft));
    setReport(draft.compliance);
    saved.current = draftText(draft);
  }, [draft]);

  // Re-check as the member types, a beat after they stop. The check is free.
  useEffect(() => {
    if (readOnly || text === saved.current) return;
    const timer = setTimeout(() => {
      updateRedditDraft({ draftId: draft.id, body: text })
        .then((d) => {
          saved.current = text;
          setReport(d.compliance);
        })
        .catch(() => undefined);
    }, 600);
    return () => clearTimeout(timer);
  }, [text, draft.id, readOnly]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it by hand.");
    }
  }

  async function rewrite() {
    setBusy("rewrite");
    try {
      await regenerateRedditDraft({ draftId: draft.id, instructions: "" });
      setCopied(false);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't rewrite that.");
    } finally {
      setBusy(null);
    }
  }

  async function posted(withLink: boolean) {
    setBusy("posted");
    try {
      await markRedditReplyPosted({
        opportunityId: opportunity.id,
        draftId: draft.id,
        permalink: withLink ? permalink : undefined,
      });
      toast.success(
        withLink
          ? "Got it. We'll confirm your comment is there and track the thread from here."
          : "Recorded. Add the link to your comment any time so we can verify it.",
      );
      setPermalink("");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't record that.");
    } finally {
      setBusy(null);
    }
  }

  if (reply) return <ReplyRecord reply={reply} opportunity={opportunity} onChanged={onChanged} />;

  const freeRewrite = draft.regenCount === 0 && !draft.compliance.pass;
  const rewritesLeft = MAX_DRAFT_REGENS - draft.regenCount;
  const over = text.length > MAX_DRAFT_CHARS;

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-volt/35 bg-volt/[0.06] p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-ink">Suggested reply</span>
          <span className="rounded-sm border border-volt/25 bg-volt/10 px-2 py-0.5 text-[0.68rem] font-medium text-volt">
            Draft · you review
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setCopied(false);
          }}
          readOnly={readOnly}
          rows={8}
          aria-label="Your reply"
          className="w-full resize-y bg-transparent text-sm leading-relaxed text-ink outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className={cn("tabular-nums", over && "font-medium text-destructive")}>
            {text.length} / {MAX_DRAFT_CHARS}
          </span>
          {!readOnly && rewritesLeft > 0 && (
            <button
              type="button"
              onClick={() => void rewrite()}
              disabled={busy !== null}
              className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-ink disabled:opacity-60"
            >
              <RefreshCw className={cn("h-3 w-3", busy === "rewrite" && "animate-spin")} />
              {busy === "rewrite"
                ? "Rewriting…"
                : freeRewrite
                  ? "Rewrite — free, this one failed its checks"
                  : "Rewrite · 1 credit"}
            </button>
          )}
        </div>
      </div>

      <Panel className="p-4">
        <ComplianceChecklist report={report} />
      </Panel>

      {!readOnly && (
        <>
          <div className="rounded-card border border-border bg-secondary/40 p-4">
            <p className="text-sm font-semibold text-ink">What happens next is yours.</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Rankbox doesn&rsquo;t have a Reddit account and can&rsquo;t post for you. Copy this,
              read it once more as yourself, and post it from your own account. If it doesn&rsquo;t
              fit the conversation, don&rsquo;t post it — that judgement is the part we can&rsquo;t
              do.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => void copy()} disabled={report.failures > 0 || over}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy reply"}
            </Button>
            <a
              href={opportunity.thread.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-secondary"
            >
              Open thread <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {report.failures > 0 && (
              <span className="text-xs text-muted-foreground">
                Fix the failed check to copy this.
              </span>
            )}
          </div>

          {copied && (
            <div className="space-y-2 border-t border-border pt-4">
              <label htmlFor="reddit-permalink" className="text-sm font-medium text-ink">
                Posted it? Paste the link to your comment
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  id="reddit-permalink"
                  value={permalink}
                  onChange={(e) => setPermalink(e.target.value)}
                  placeholder="https://www.reddit.com/r/…/comments/…"
                  className={cn(inputClass, "min-w-[16rem] flex-1")}
                />
                <Button
                  onClick={() => void posted(true)}
                  disabled={busy !== null || !permalink.trim()}
                >
                  {busy === "posted" ? "Saving…" : "I posted this"}
                </Button>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                On your comment, use ⋯ → Copy link. With it we can confirm the comment is there and
                keep measuring the thread.{" "}
                <button
                  type="button"
                  onClick={() => void posted(false)}
                  disabled={busy !== null}
                  className="font-medium underline underline-offset-2 hover:text-ink"
                >
                  Skip the link
                </button>{" "}
                and we&rsquo;ll record that you posted, but we won&rsquo;t be able to verify it.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** After the member has posted: what we know, and how we know it. */
function ReplyRecord({
  reply,
  opportunity,
  onChanged,
}: {
  reply: RedditReply;
  opportunity: RedditOpportunity;
  onChanged: () => void;
}) {
  const [permalink, setPermalink] = useState("");
  const [busy, setBusy] = useState(false);
  const status = REPLY_STATUS[reply.status];

  async function run(fn: () => Promise<unknown>, fallback: string) {
    setBusy(true);
    try {
      await fn();
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : fallback);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel className="space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">Your reply</p>
        <ReplyStatusPill status={reply.status} />
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{status.hint}</p>

      {reply.permalink ? (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <a
            href={reply.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-ink underline underline-offset-2"
          >
            View your comment <ExternalLink className="h-3 w-3" />
          </a>
          {reply.lastCheckedAt && (
            <span className="text-muted-foreground">
              Last checked {timeAgo(reply.lastCheckedAt)}
            </span>
          )}
          {(reply.status === "posted" || reply.status === "confirmed") && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void run(() => verifyRedditReply({ replyId: reply.id }), "Couldn't check that.")
              }
              className="font-medium text-muted-foreground underline underline-offset-2 hover:text-ink disabled:opacity-60"
            >
              {busy ? "Checking…" : "Check now"}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <input
              value={permalink}
              onChange={(e) => setPermalink(e.target.value)}
              placeholder="Paste the link to your comment to verify it"
              aria-label="Link to your comment"
              className={cn(inputClass, "min-w-[16rem] flex-1")}
            />
            <Button
              variant="ghost"
              disabled={busy || !permalink.trim()}
              onClick={() =>
                void run(
                  () => markRedditReplyPosted({ opportunityId: opportunity.id, permalink }),
                  "Couldn't save that link.",
                )
              }
            >
              Add link
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Until then this stays out of your measured totals — it&rsquo;s your word, not something
            we saw.
          </p>
        </div>
      )}
    </Panel>
  );
}
