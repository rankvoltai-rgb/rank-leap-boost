/**
 * Meta's five user agents as a switchboard: each row is one agent, with what
 * it feeds and whether robots.txt binds it, and a two-way switch. The
 * robots.txt beside it is written from the switches, so the trade-off is
 * concrete — flip meta-webindexer off and the file says what you've done.
 *
 * It opens on the split the guide argues for: in Meta AI search and link
 * previews, out of training and ads. The advice tag on each row stays put,
 * so a choice against it is visible rather than silent.
 */
import { useMemo, useState } from "react";
import { AlertTriangle, Check, Minus } from "lucide-react";
import type { Crawler } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import { LINE, PANEL } from "@/components/landing/frame";
import { Md } from "@/components/ai-seo/kit";
import { CodePanel } from "./CodePanel";

const FEEDS: Record<Crawler["role"], string> = {
  search: "Meta AI search",
  user: "User-requested fetches",
  training: "Model training",
  other: "Outside Meta AI",
};

const ROBOTS: Record<Crawler["robots"], { label: string; Icon: typeof Check }> = {
  yes: { label: "Honors robots.txt", Icon: Check },
  partial: { label: "May bypass it", Icon: Minus },
  no: { label: "Ignores it", Icon: Minus },
};

const ADVICE: Record<Crawler["advice"], string> = {
  allow: "Keep allowed",
  "your-call": "Your call",
  block: "Block it",
};

function robotsFile(bots: Crawler[], allowed: Record<string, boolean>): string {
  return bots
    .map((b) => {
      const head = `# ${FEEDS[b.role]}${b.robots === "partial" ? " (may bypass robots.txt)" : ""}`;
      return `${head}\nUser-agent: ${b.token}\n${allowed[b.token] ? "Allow" : "Disallow"}: /`;
    })
    .join("\n\n");
}

export function CrawlerSwitchboard({ bots }: { bots: Crawler[] }) {
  const initial = useMemo(
    () => Object.fromEntries(bots.map((b) => [b.token, b.advice === "allow"])),
    [bots],
  );
  const [allowed, setAllowed] = useState<Record<string, boolean>>(initial);
  const file = robotsFile(bots, allowed);

  return (
    <div className="my-9">
      <ul
        className={cn(
          "divide-y overflow-hidden rounded-xl border bg-white",
          LINE,
          "divide-ink/[0.07]",
        )}
      >
        {bots.map((b) => {
          const on = allowed[b.token];
          const r = ROBOTS[b.robots];
          const against = b.advice === "allow" && !on;
          return (
            <li key={b.token} className="px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <code className="font-mono text-[0.9rem] font-semibold text-ink">{b.token}</code>
                <span className="rounded-md bg-ink/[0.04] px-1.5 py-0.5 text-[0.68rem] font-medium text-ink/65">
                  {FEEDS[b.role]}
                </span>
                <span
                  className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-ink/55"
                  title={b.robotsNote}
                >
                  <r.Icon aria-hidden className="h-3 w-3" strokeWidth={2.5} />
                  {r.label}
                </span>
                <span className="ml-auto flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
                      b.advice === "allow" ? "text-cta" : "text-ink/45",
                    )}
                  >
                    {ADVICE[b.advice]}
                  </span>
                  <span
                    role="group"
                    aria-label={`robots.txt rule for ${b.token}`}
                    className={cn("inline-flex rounded-lg border p-0.5", LINE, PANEL)}
                  >
                    {[true, false].map((value) => (
                      <button
                        key={String(value)}
                        type="button"
                        aria-pressed={on === value}
                        onClick={() => setAllowed((a) => ({ ...a, [b.token]: value }))}
                        className={cn(
                          "h-7 rounded-md px-2.5 text-[0.72rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                          on === value
                            ? value
                              ? "bg-cta text-white shadow-[0_1px_2px_rgba(16,24,40,0.12)]"
                              : "bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                            : "text-ink/50 hover:text-ink",
                        )}
                      >
                        {value ? "Allow" : "Disallow"}
                      </button>
                    ))}
                  </span>
                </span>
              </div>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-ink/70">
                <Md text={b.purpose} />
                {b.robotsNote && <span className="text-ink/50"> {b.robotsNote}.</span>}
              </p>
              {against && (
                <p className="mt-2 flex items-center gap-1.5 text-[0.78rem] font-medium text-[oklch(0.5_0.13_55)]">
                  <AlertTriangle aria-hidden className="h-3.5 w-3.5 shrink-0" />
                  {b.robots === "yes"
                    ? "Against the advice above: this rule takes the agent out."
                    : "Against the advice above — and this agent may fetch anyway."}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <CodePanel lang="robots.txt" code={file} className="mb-0 mt-4" />
    </div>
  );
}
