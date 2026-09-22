/**
 * The two states before there is anything to show: discovery isn't configured
 * for this workspace at all, or the member hasn't switched the feature on.
 *
 * Neither renders an empty table. An empty table reads as "we looked and found
 * nothing", and in both of these states nobody has looked.
 */
import { useState } from "react";
import { toast } from "sonner";
import { Button, Panel } from "@/components/dashboard/primitives";
import { ThreadIcon } from "@/components/dashboard/icons";
import { useSiteId } from "@/components/dashboard/site-context";
import { enableReddit, runRedditSweep } from "@/lib/data";
import { isValidDisclosureLine, resolveDisclosure } from "@/lib/reddit/compliance";
import { cn } from "@/lib/utils";
import { inputClass } from "./format";
import { Field } from "./shared";

export function RedditUnconfiguredCard() {
  return (
    <Panel className="mx-auto max-w-xl p-7 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-card bg-secondary text-muted-foreground">
        <ThreadIcon className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink">
        Reddit discovery isn&rsquo;t switched on yet
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        This workspace has no discovery provider connected, so no threads have been searched for.
        Nothing here is stale or wrong — there&rsquo;s simply nothing measured yet.
      </p>
    </Panel>
  );
}

const STEPS = [
  [
    "We find the threads",
    "Each week we search Google and Reddit for your tracked keywords, and record where each thread ranks and whether AI engines cite it — with the date.",
  ],
  [
    "We draft, and check the draft",
    "One credit writes a reply that discloses who you are. It's checked for the things that get replies removed. Where we can't read a subreddit's rules, we say so.",
  ],
  [
    "You post it",
    "From your own account, after reading it as yourself. Rankbox has no Reddit account and never posts. If a reply doesn't fit the conversation, don't send it.",
  ],
] as const;

export function RedditSetupCard({
  brandName,
  defaultNiche,
  onDone,
}: {
  brandName: string;
  defaultNiche: string;
  onDone: () => void;
}) {
  const siteId = useSiteId();
  const [line, setLine] = useState("Full disclosure: I work on {brand}.");
  const [niche, setNiche] = useState(defaultNiche);
  const [busy, setBusy] = useState(false);
  const ok = isValidDisclosureLine(line, brandName);

  async function start() {
    setBusy(true);
    try {
      await enableReddit(siteId, { disclosureLine: line, niche });
      const result = await runRedditSweep(siteId);
      if (!result.started && result.reason !== "too_soon")
        toast.message("Set up. The first sweep will run shortly.");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't set that up.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Panel className="p-6">
        <h2 className="text-base font-semibold tracking-tight text-ink">How this works</h2>
        <ol className="mt-4 space-y-4">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-ink">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel className="space-y-5 p-6">
        <h2 className="text-base font-semibold tracking-tight text-ink">Before the first sweep</h2>
        <Field
          label="Your disclosure line"
          htmlFor="setup-disclosure"
          hint={
            ok ? (
              <>
                Every draft will include: &ldquo;{resolveDisclosure(line, brandName)}&rdquo; It can
                be reworded later, never removed.
              </>
            ) : (
              <span className="font-medium text-destructive">
                It has to name {brandName} and say, in the first person, that you work on it.
              </span>
            )
          }
        >
          <input
            id="setup-disclosure"
            value={line}
            onChange={(e) => setLine(e.target.value)}
            aria-invalid={!ok}
            className={cn(inputClass, !ok && "border-destructive/50")}
          />
        </Field>
        <Field
          label="Your space"
          htmlFor="setup-niche"
          hint="What you know enough about to be useful on."
        >
          <input
            id="setup-niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => void start()} disabled={busy || !ok}>
            {busy ? "Searching…" : "Run my first sweep"}
          </Button>
          <span className="text-xs text-muted-foreground">
            Free. Only drafting a reply spends a credit.
          </span>
        </div>
      </Panel>
    </div>
  );
}
