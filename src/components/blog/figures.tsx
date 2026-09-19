/**
 * Diagrams an article can place with `![alt](figure:<id> "caption")`.
 *
 * Built from the site's own tokens rather than exported images, so they stay
 * sharp at any size, match the product UI, and cost nothing to load. Each is
 * exposed to assistive tech as one image described by the markdown alt text.
 */
import type { ReactNode } from "react";
import { Bot, Check, Search } from "lucide-react";
import { ChatGPTMark } from "@/components/landing/ai-logos";
import { cn } from "@/lib/utils";

/* ---------- shared bits ---------- */

function Callout({ n, className }: { n: number; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue text-[0.65rem] font-bold text-white shadow-sm",
        className,
      )}
    >
      {n}
    </span>
  );
}

function Bar({ w, className }: { w: string; className?: string }) {
  return (
    <span className={cn("block h-1.5 rounded-full bg-ink/10", className)} style={{ width: w }} />
  );
}

/* ---------- 1. How a question becomes a cited answer ---------- */

function Step({
  n,
  title,
  body,
  children,
}: {
  n: number;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-4 shadow-1">
      <div className="flex items-center gap-2">
        <Callout n={n} />
        <p className="text-sm font-semibold text-ink">{title}</p>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-4 flex flex-1 flex-col justify-end">{children}</div>
    </div>
  );
}

function CitationPipeline() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Step n={1} title="Ask" body="A buyer asks a full question, with context.">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3 py-2 text-[0.72rem] leading-snug text-white">
          What's the best CRM for a 5-person real estate team?
        </div>
      </Step>
      <Step n={2} title="Search" body="ChatGPT searches the web for fresh sources.">
        <div className="space-y-1.5">
          {[
            { icon: Bot, label: "OAI-SearchBot index" },
            { icon: Search, label: "Search providers (Bing)" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[0.68rem] font-medium text-ink"
            >
              <Icon className="h-3.5 w-3.5 text-brand-blue" />
              {label}
            </div>
          ))}
        </div>
      </Step>
      <Step n={3} title="Read" body="It reads the top pages and pulls out passages.">
        <div className="space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "space-y-1 rounded-lg border px-2.5 py-2",
                i === 1 ? "border-volt/40 bg-volt/5" : "border-border bg-surface opacity-60",
              )}
            >
              <Bar w="70%" />
              {i === 1 ? (
                <span className="block h-1.5 w-[92%] rounded-full bg-volt/60" />
              ) : (
                <Bar w="85%" />
              )}
            </div>
          ))}
        </div>
      </Step>
      <Step n={4} title="Answer" body="The reply quotes that passage and links the source.">
        <div className="rounded-lg border border-border bg-surface p-2.5">
          <div className="flex items-center gap-1.5">
            <ChatGPTMark className="h-3.5 w-3.5" />
            <span className="text-[0.65rem] font-semibold text-ink">ChatGPT</span>
          </div>
          <div className="mt-2 space-y-1">
            <Bar w="95%" />
            <div className="flex items-center gap-1">
              <Bar w="55%" />
              <span className="rounded bg-volt/15 px-1 text-[0.55rem] font-bold text-volt">1</span>
            </div>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-volt/40 bg-volt/10 px-1.5 py-0.5 text-[0.6rem] font-semibold text-ink">
            <span className="h-1 w-1 rounded-full bg-volt" />
            yoursite.com
          </div>
        </div>
      </Step>
    </div>
  );
}

/* ---------- 2. Anatomy of a citable page ---------- */

const ANATOMY = [
  { title: "A question-shaped heading", body: "Worded the way a buyer asks it." },
  { title: "The answer, first", body: "Two or three sentences that stand alone." },
  { title: "Numbers with named sources", body: "Specific facts the model can credit." },
  { title: "Lists and tables", body: "Steps and comparisons that are easy to lift." },
  { title: "An FAQ", body: "Short answers to the follow-up questions." },
];

function CitablePage() {
  return (
    <div className="grid gap-5 md:grid-cols-[1.25fr_1fr] md:items-center">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-border" />
            ))}
          </span>
          <span className="mx-auto truncate rounded-md bg-background px-3 py-0.5 text-[0.62rem] text-muted-foreground">
            yoursite.com/blog/crm-for-real-estate-teams
          </span>
        </div>
        <div className="space-y-3.5 p-4 sm:p-5">
          <div className="flex items-start gap-2">
            <Callout n={1} className="mt-0.5" />
            <p className="text-sm font-bold leading-snug text-ink">
              What's the best CRM for a small real estate team?
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Callout n={2} className="mt-0.5" />
            <div className="flex-1 space-y-1.5 rounded-lg border-l-2 border-volt bg-volt/5 py-2 pl-3 pr-2">
              <Bar w="96%" className="bg-ink/20" />
              <Bar w="88%" className="bg-ink/20" />
              <Bar w="60%" className="bg-ink/20" />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Callout n={3} className="mt-0.5" />
            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              <Bar w="38%" />
              <span className="rounded bg-ink px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
                stat
              </span>
              <Bar w="22%" />
              <span className="text-[0.62rem] font-semibold text-volt underline underline-offset-2">
                source ↗
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Callout n={4} className="mt-0.5" />
            <div className="flex-1 space-y-1.5">
              {["74%", "62%", "68%"].map((w) => (
                <div key={w} className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-success" strokeWidth={3} />
                  <Bar w={w} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Callout n={5} className="mt-0.5" />
            <div className="flex-1 divide-y divide-border rounded-lg border border-border">
              {["How much does it cost?", "Does it sync with Gmail?"].map((q) => (
                <div key={q} className="flex items-center justify-between px-2.5 py-1.5">
                  <span className="text-[0.66rem] font-semibold text-ink">{q}</span>
                  <span className="text-[0.66rem] text-muted-foreground">+</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ol className="space-y-3">
        {ANATOMY.map((a, i) => (
          <li key={a.title} className="flex gap-3">
            <Callout n={i + 1} className="mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink">{a.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{a.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- 3. A weekly prompt panel ---------- */

type Mark = "cited" | "mentioned" | "absent";

const PANEL: { prompt: string; weeks: Mark[]; page: string }[] = [
  {
    prompt: "best crm for a small real estate team",
    weeks: ["absent", "mentioned", "cited", "cited"],
    page: "/blog/best-crm-real-estate",
  },
  {
    prompt: "crm that syncs with gmail for agents",
    weeks: ["absent", "absent", "mentioned", "cited"],
    page: "/features/gmail-sync",
  },
  {
    prompt: "how to follow up with open house leads",
    weeks: ["mentioned", "cited", "cited", "cited"],
    page: "/blog/open-house-follow-up",
  },
  {
    prompt: "is a crm worth it for 5 agents",
    weeks: ["absent", "absent", "absent", "mentioned"],
    page: "—",
  },
  {
    prompt: "hubspot vs pipedrive for realtors",
    weeks: ["absent", "absent", "absent", "absent"],
    page: "—",
  },
];

function Dot({ mark, className }: { mark: Mark; className?: string }) {
  return (
    <span
      className={cn(
        "block h-3 w-3 shrink-0 rounded-full",
        className,
        mark === "cited" && "bg-volt",
        mark === "mentioned" && "border-2 border-volt bg-volt/20",
        mark === "absent" && "border border-ink/15",
      )}
    />
  );
}

function PromptPanel() {
  const cited = [0, 1, 2, 3].map((w) => PANEL.filter((r) => r.weeks[w] === "cited").length);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-1">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ChatGPTMark className="h-4 w-4" />
          <span className="text-xs font-semibold text-ink">Prompt panel · ChatGPT</span>
        </div>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Example
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground">
              <th className="px-4 py-2 font-semibold">Prompt</th>
              {["Wk 1", "Wk 2", "Wk 3", "Wk 4"].map((w) => (
                <th key={w} className="w-14 px-1 py-2 text-center font-semibold">
                  {w}
                </th>
              ))}
              <th className="px-4 py-2 font-semibold">Cited page</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PANEL.map((row) => (
              <tr key={row.prompt}>
                <td className="px-4 py-2.5 font-medium text-ink">{row.prompt}</td>
                {row.weeks.map((m, i) => (
                  <td key={i} className="px-1 py-2.5">
                    <Dot mark={m} className="mx-auto" />
                  </td>
                ))}
                <td className="px-4 py-2.5 font-mono text-[0.68rem] text-muted-foreground">
                  {row.page}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-surface/60">
              <td className="px-4 py-2.5 text-[0.7rem] font-semibold text-ink">
                Prompts citing you
              </td>
              {cited.map((n, i) => (
                <td
                  key={i}
                  className="px-1 py-2.5 text-center text-[0.7rem] font-bold tabular-nums text-ink"
                >
                  {n}/{PANEL.length}
                </td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border px-4 py-2.5 text-[0.68rem] text-muted-foreground">
        {(
          [
            ["cited", "Cited with a link"],
            ["mentioned", "Named, not linked"],
            ["absent", "Not in the answer"],
          ] as const
        ).map(([m, label]) => (
          <span key={m} className="inline-flex items-center gap-1.5">
            <Dot mark={m} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- registry ---------- */

const FIGURES: Record<string, () => ReactNode> = {
  "citation-pipeline": CitationPipeline,
  "citable-page": CitablePage,
  "prompt-panel": PromptPanel,
};

export function ArticleFigure({
  id,
  alt,
  caption,
  number,
}: {
  id: string;
  alt?: string;
  caption?: ReactNode;
  number?: number;
}) {
  const Figure = FIGURES[id];
  if (!Figure) return null;
  return (
    <figure className="my-10">
      <div
        role="img"
        aria-label={alt}
        className="rounded-3xl border border-border bg-surface/70 bg-dotgrid p-4 sm:p-6"
      >
        <div aria-hidden>
          <Figure />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-[0.8rem] text-muted-foreground">
          {number !== undefined && (
            <span className="font-semibold text-ink">Figure {number}. </span>
          )}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
