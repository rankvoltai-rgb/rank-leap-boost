/**
 * What a member without a paid plan sees instead of Reddit presence: the page
 * in preview — blurred, inert, out of reach — under a frosted card that says
 * plainly why it isn't part of the trial.
 *
 * The preview rows below are STATIC and live in this file on purpose. This
 * component renders in production for every trialing account, so it must not
 * sit on any path that could reach the network: no query, no server function,
 * no mock store. An unpaid account costs nothing at Apify because there is
 * nothing here that could ask.
 */
import { Link } from "@tanstack/react-router";
import { ArrowBigUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/dashboard/primitives";
import { CheckIcon, ThreadIcon } from "@/components/dashboard/icons";
import { GoogleMark, PerplexityMark, ChatGPTMark } from "@/components/landing/ai-logos";
import { BrandMark } from "@/components/landing/shared";
import { IS_MOCK, simulatePaidPlan, TRIAL_DAYS, type RedditAccess } from "@/lib/data";
import { formatShortDate } from "@/lib/format-date";

const POINTS = [
  "Threads ranked by measured Google position and measured AI citations — each with its date",
  "A reply draft that discloses who you are, checked against the subreddit's rules where we can read them",
  "You post every reply yourself, from your own account. Rankbox never posts to Reddit",
  "Every thread you join, re-checked weekly, with the dated record kept",
];

const PREVIEW = [
  {
    sub: "startups",
    title: "What's the best project tool for a 4-person startup?",
    rank: 3,
    cited: "Perplexity",
    up: "124",
    comments: "37",
    fit: 71,
  },
  {
    sub: "projectmanagement",
    title: "Trello vs Asana for a small product team?",
    rank: 2,
    cited: "ChatGPT",
    up: "89",
    comments: "52",
    fit: 66,
  },
  {
    sub: "SaaS",
    title: "Alternatives to ClickUp that aren't overwhelming?",
    rank: 5,
    cited: null,
    up: "61",
    comments: "28",
    fit: 52,
  },
  {
    sub: "agile",
    title: "Sprint planning tool for a tiny team — is Jira overkill?",
    rank: 11,
    cited: null,
    up: "73",
    comments: "41",
    fit: 44,
  },
  {
    sub: "productivity",
    title: "Kanban board apps with simple automations?",
    rank: 8,
    cited: null,
    up: "44",
    comments: "19",
    fit: 41,
  },
] as const;

export function RedditGate({
  access,
  trialEndsAt,
  onStartTrial,
  onSimulated,
}: {
  access: Exclude<RedditAccess, "paid" | "lapsed">;
  trialEndsAt: string | null;
  onStartTrial: () => void;
  onSimulated: () => void;
}) {
  const trial = access === "trial";
  return (
    <div className="relative">
      <div
        aria-hidden
        inert
        className="pointer-events-none max-h-[40rem] select-none overflow-hidden blur-[5px] [mask-image:linear-gradient(to_bottom,black_45%,transparent_95%)]"
      >
        <div className="overflow-hidden rounded-card border border-border bg-card">
          {PREVIEW.map((row) => (
            <div
              key={row.title}
              className="flex items-center gap-6 border-b border-border px-4 py-4 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BrandMark name="Reddit" className="h-4 w-4 rounded-full text-[0.5rem]" />
                  <span className="font-semibold text-ink">r/{row.sub}</span>
                </p>
                <p className="mt-1 truncate text-[13px] font-medium text-ink">{row.title}</p>
              </div>
              <div className="hidden items-center gap-1.5 sm:flex">
                <span className="inline-flex items-center gap-1 rounded-md bg-card px-1.5 py-0.5 text-[0.7rem] font-medium text-ink ring-1 ring-border">
                  <GoogleMark className="h-3 w-3" />#{row.rank}
                </span>
                {row.cited && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-card px-1.5 py-0.5 text-[0.7rem] font-medium text-ink ring-1 ring-border">
                    {row.cited === "Perplexity" ? (
                      <PerplexityMark className="h-3 w-3" />
                    ) : (
                      <ChatGPTMark className="h-3 w-3" />
                    )}
                    Cited by {row.cited}
                  </span>
                )}
              </div>
              <div className="hidden items-center gap-3 text-xs text-muted-foreground md:flex">
                <span className="flex items-center gap-0.5">
                  <ArrowBigUp className="h-4 w-4 text-[#ff4500]" />
                  <span className="font-semibold text-ink">{row.up}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {row.comments}
                </span>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-volt/70 text-[0.62rem] font-semibold text-ink">
                {row.fit}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex justify-center px-4 pt-6 sm:pt-10">
        <section
          aria-labelledby="reddit-gate-title"
          className="glass h-fit w-full max-w-lg rounded-card p-7 text-center shadow-elevation-lg"
        >
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-card bg-brand-blue text-white">
            <ThreadIcon className="h-5 w-5" />
          </span>
          <h2 id="reddit-gate-title" className="mt-4 text-lg font-semibold tracking-tight text-ink">
            {trial ? "Part of the paid plan" : "Reddit presence comes with the plan"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {trial
              ? `Reddit presence opens with your first invoice${trialEndsAt ? `, on ${formatShortDate(trialEndsAt)}` : ""}. Replies go out under your own name in threads that outlive a trial, so it isn't something to hand a throwaway account.`
              : `Start the ${TRIAL_DAYS}-day trial to set up your site; Reddit presence unlocks the day your first invoice is paid.`}
          </p>
          <ul className="mt-5 space-y-2 text-left">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm text-ink">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {p}
              </li>
            ))}
          </ul>
          {access === "none" ? (
            <Button variant="brand" className="mt-6 w-full" onClick={onStartTrial}>
              Start {TRIAL_DAYS}-day free trial
            </Button>
          ) : (
            <Link
              to="/dashboard/billing"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-background transition-colors hover:bg-ink/90"
            >
              See your plan
            </Link>
          )}
          {IS_MOCK && (
            <button
              type="button"
              onClick={() => void simulatePaidPlan().then(onSimulated)}
              className="mt-3 text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-ink"
            >
              Mock: simulate the first paid invoice
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
