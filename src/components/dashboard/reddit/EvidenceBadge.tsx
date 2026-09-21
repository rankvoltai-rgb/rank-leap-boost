/**
 * What we know about a thread, and how we know it.
 *
 * This is the honesty component, and its whole design is a short list of the
 * only things it is allowed to say:
 *
 *   a MEASURED Google position      "#3" + when it was measured
 *   a MEASURED AI citation          "Cited by Perplexity" + when
 *   checked, and not cited          said in words, not left blank
 *   never checked                   said in words, and not the same words
 *
 * There is no code path here that renders a badge from an inference. "Not
 * checked" and "checked — not cited" are different facts about our own work,
 * and a member deciding where to spend their name deserves to tell them apart.
 */
import type { ComponentType } from "react";
import { ChatGPTMark, GeminiMark, GoogleMark, PerplexityMark } from "@/components/landing/ai-logos";
import { REDDIT_AI_ENGINE_LABELS, type RedditThreadView } from "@/lib/data";
import { cn } from "@/lib/utils";
import { timeAgo } from "./format";
import { MeasuredAt } from "./shared";

const ENGINE_MARK: Record<string, ComponentType<{ className?: string }>> = {
  chatgpt: ChatGPTMark,
  perplexity: PerplexityMark,
  gemini: GeminiMark,
  google_ai_overview: GoogleMark,
};

const chip =
  "inline-flex items-center gap-1 rounded-md bg-card px-1.5 py-0.5 text-[0.7rem] font-medium text-ink ring-1 ring-border";
const quiet =
  "inline-flex items-center rounded-md px-1.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground ring-1 ring-border/70";
/** Dashed, so "we never looked" reads differently at a glance from "we looked". */
const unasked =
  "inline-flex items-center rounded-md border border-dashed border-border px-1.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground";

export function EvidenceBadges({
  thread,
  detailed,
  className,
}: {
  thread: RedditThreadView;
  /** The detail panel spells out the query and the date; the table stays compact. */
  detailed?: boolean;
  className?: string;
}) {
  const position = thread.googlePosition;
  const cited = thread.aiCitations.filter((c) => c.cited);
  const asked = thread.aiCitations.filter((c) => !c.cited);

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {position ? (
        <span
          className={chip}
          title={`Position ${position.position} on Google for “${position.query}” — ${position.country.toUpperCase()}, ${position.device}, measured ${timeAgo(position.checkedAt)}. Positions move; this one is true for that search at that moment.`}
        >
          <GoogleMark className="h-3 w-3" />#{position.position}
          {detailed && (
            <>
              <span className="font-normal text-muted-foreground">for “{position.query}”</span>
              <MeasuredAt at={position.checkedAt} className="font-normal" />
            </>
          )}
        </span>
      ) : (
        <span
          className={quiet}
          title="This thread wasn't in the Google results we measured for your keywords. It may still rank for searches we didn't run."
        >
          No Google position measured
        </span>
      )}

      {cited.map((c) => {
        const Mark = ENGINE_MARK[c.engine] ?? GoogleMark;
        return (
          <span
            key={`${c.engine}-${c.checkedAt}`}
            className={chip}
            title={`${REDDIT_AI_ENGINE_LABELS[c.engine]} cited this thread when asked “${c.query}”, measured ${timeAgo(c.checkedAt)}.${c.snippet ? ` It said: “${c.snippet}”` : ""}`}
          >
            <Mark className="h-3 w-3" />
            Cited by {REDDIT_AI_ENGINE_LABELS[c.engine]}
            {detailed && <MeasuredAt at={c.checkedAt} className="font-normal" />}
          </span>
        );
      })}

      {cited.length === 0 &&
        (thread.aiChecked ? (
          <span
            className={quiet}
            title={`We asked ${asked.map((c) => REDDIT_AI_ENGINE_LABELS[c.engine]).join(", ")} ${asked[0] ? timeAgo(asked[0].checkedAt) : ""}, and ${asked.length === 1 ? "it" : "they"} didn't cite this thread.`}
          >
            AI checked — not cited
          </span>
        ) : (
          <span
            className={unasked}
            title="We only check your top keywords against AI answers each week, and this thread wasn't among them. This says nothing either way about whether AI engines cite it."
          >
            AI not checked
          </span>
        ))}
    </div>
  );
}
