import { ArrowBigUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_MARKS, GoogleMark } from "@/components/landing/ai-logos";
import { BrandMark } from "@/components/landing/shared";
import { AreaChart } from "@/components/landing/charts";
import { Chip, Label, Panel, ProductWindow, Row, Tick, useInView, useTypewriter } from "./kit";

const REPLY =
  "Full disclosure: I work on Plannora. For a team of four I'd start with whatever has the lightest setup. Our free tier covers up to 5 people with boards and simple automations, and Trello is solid too if you only need boards.";

function markOf(name: string) {
  return AI_MARKS.find((m) => m.name === name)!.Mark;
}

export function RedditHero({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const { typed, typing } = useTypewriter(REPLY, { speed: 20, hold: 3600, run: inView });
  const Perplexity = markOf("Perplexity");

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title="Reddit Presence" icon={MessageSquare} className="flex-1">
        {/* why this thread */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface/50 px-4 py-2.5 text-[0.68rem] font-medium text-ink">
          <span className="text-muted-foreground">Opportunity</span>
          <span className="flex items-center gap-1 rounded-md bg-card px-1.5 py-0.5 ring-1 ring-border">
            <GoogleMark className="h-3 w-3" /> Ranks #3
          </span>
          <span className="flex items-center gap-1 rounded-md bg-card px-1.5 py-0.5 ring-1 ring-border">
            <Perplexity className="h-3 w-3" /> Cited by Perplexity
          </span>
          <span className="ml-auto text-muted-foreground">Active · 3 days old</span>
        </div>

        <div className="flex flex-1 flex-col gap-3.5 p-5">
          {/* post */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center text-muted-foreground">
              <ArrowBigUp className="h-5 w-5 text-[#ff4500]" />
              <span className="text-xs font-semibold tabular-nums text-ink">124</span>
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
                <BrandMark name="Reddit" className="h-4 w-4 rounded-full text-[0.5rem]" />
                <span className="font-semibold text-ink">r/startups</span> · u/tiny_team_tom
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug text-ink">
                What&rsquo;s the best project tool for a 4-person startup?
              </p>
              <p className="mt-1 text-[0.78rem] leading-relaxed text-muted-foreground">
                Jira felt like overkill. We just need to see who&rsquo;s doing what this week.
              </p>
              <p className="mt-1.5 text-[0.65rem] text-muted-foreground">37 comments</p>
            </div>
          </div>

          {/* existing comment */}
          <div className="ml-4 border-l-2 border-border pl-3">
            <p className="text-[0.65rem] text-muted-foreground">
              <span className="font-semibold text-ink">u/ops_mara</span> · ▲ 31
            </p>
            <p className="mt-0.5 text-[0.78rem] leading-relaxed text-ink/80">
              Same boat. We tried three tools and none of them stuck.
            </p>
          </div>

          {/* the draft */}
          <div className="ml-4 rounded-lg border border-volt/35 bg-volt/[0.06] p-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-[0.65rem] font-semibold text-ink">Suggested reply</span>
              <Chip tone="volt">Draft · you review</Chip>
            </div>
            <p className="min-h-[5.25rem] text-[0.78rem] leading-relaxed text-ink">
              {typed}
              {typing && (
                <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse rounded-full bg-volt" />
              )}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border pt-3.5">
            {["Answers the question", "Discloses affiliation", "Follows r/startups rules"].map(
              (c) => (
                <span
                  key={c}
                  className="flex items-center gap-1.5 text-[0.68rem] font-medium text-ink"
                >
                  <Tick ok /> {c}
                </span>
              ),
            )}
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/* ---------- Benefits ---------- */

const THREADS = [
  { sub: "r/startups", t: "Best project tool for a 4-person startup?", g: 3, ai: "Perplexity" },
  { sub: "r/projectmanagement", t: "Kanban or Scrum for a tiny team?", g: 2, ai: "ChatGPT" },
  { sub: "r/SaaS", t: "What do you use instead of Jira?", g: 5, ai: "Gemini" },
];

function HighVisibility() {
  return (
    <Panel>
      <div className="space-y-1.5">
        {THREADS.map((t) => {
          const Mark = markOf(t.ai);
          return (
            <div key={t.t} className="rounded-lg bg-card px-3 py-2.5 ring-1 ring-border">
              <p className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                <BrandMark name="Reddit" className="h-3.5 w-3.5 rounded-full text-[0.45rem]" />
                <span className="font-semibold text-ink">{t.sub}</span>
              </p>
              <p className="mt-1 truncate text-xs font-semibold text-ink">{t.t}</p>
              <div className="mt-1.5 flex gap-1.5">
                <span className="flex items-center gap-1 rounded-md bg-surface px-1.5 py-0.5 text-[0.6rem] font-medium text-ink ring-1 ring-border">
                  <GoogleMark className="h-2.5 w-2.5" /> #{t.g} on Google
                </span>
                <span className="flex items-center gap-1 rounded-md bg-surface px-1.5 py-0.5 text-[0.6rem] font-medium text-ink ring-1 ring-border">
                  <Mark className="h-2.5 w-2.5" /> Cited by {t.ai}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

const CHECKS = [
  ["Answers the question first", true],
  ["Discloses that you work there", true],
  ["Follows the subreddit's rules", true],
  ["No bare link drops", true],
] as const;

function HelpfulNotSpammy() {
  return (
    <Panel className="flex h-full flex-col">
      <Label>Reply check</Label>
      <div className="mt-3 space-y-1.5">
        {CHECKS.map(([c, ok]) => (
          <Row key={c}>
            <span className="text-xs font-medium text-ink">{c}</span>
            <Tick ok={ok} />
          </Row>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="text-[0.65rem] text-muted-foreground">4 of 4 checks pass</span>
        <Chip tone="success" dot>
          Ready for you to post
        </Chip>
      </div>
    </Panel>
  );
}

function Compounding() {
  const ChatGPT = markOf("ChatGPT");
  return (
    <Panel className="h-full">
      <div className="grid h-full gap-4 sm:grid-cols-[1.1fr_1fr] sm:items-center">
        <ol className="relative space-y-3 border-l border-border pl-4">
          {[
            ["14 months ago", "Helpful reply posted in r/startups"],
            ["12 months ago", "Thread reaches #2 on Google"],
            ["This week", "Still quoted in ChatGPT answers"],
          ].map(([when, what], i) => (
            <li key={when} className="relative">
              <span
                className={cn(
                  "absolute -left-[1.3rem] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-surface",
                  i === 2 ? "bg-volt" : "bg-border",
                )}
              />
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {when}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-ink">
                {i === 2 && <ChatGPT className="h-3 w-3" />}
                {what}
              </p>
            </li>
          ))}
        </ol>
        <div className="rounded-lg bg-card p-3 ring-1 ring-border">
          <p className="text-[0.65rem] text-muted-foreground">Monthly thread views</p>
          <AreaChart
            points={[3, 9, 14, 16, 18, 21, 22, 24, 27, 29, 31, 34]}
            className="mt-2 h-16 w-full"
            stroke="#ff4500"
            fill="#ff4500"
          />
        </div>
      </div>
    </Panel>
  );
}

export const redditBenefits = [HighVisibility, HelpfulNotSpammy, Compounding];
