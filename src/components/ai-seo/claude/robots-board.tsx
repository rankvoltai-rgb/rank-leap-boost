/**
 * Anthropic's three bots as switches. Each row is one robots.txt group; flip
 * it and the file underneath rewrites itself, and the strip above says what
 * Claude can still do with the site. It starts on the guide's own advice, so
 * the server HTML (and anyone without JavaScript) gets the recommended file.
 */
import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { Crawler } from "@/data/ai-seo/types";
import { Md } from "@/components/ai-seo/kit";
import { cn } from "@/lib/utils";
import { CodePanel } from "./code-panel";

const ROLE: Record<Crawler["role"], { label: string; outcome: string }> = {
  search: { label: "Search index", outcome: "Find you in search" },
  user: { label: "Live fetch for a user", outcome: "Read you for a user" },
  training: { label: "Model training", outcome: "Learn from you in training" },
  other: { label: "Other", outcome: "Reach you" },
};

type Rule = "allow" | "block";

export function RobotsBoard({ bots }: { bots: Crawler[] }) {
  const [rules, setRules] = useState<Record<string, Rule>>(() =>
    Object.fromEntries(bots.map((b) => [b.token, b.advice === "block" ? "block" : "allow"])),
  );

  const file = useMemo(
    () =>
      bots
        .map(
          (b) => `User-agent: ${b.token}\n${rules[b.token] === "block" ? "Disallow" : "Allow"}: /`,
        )
        .join("\n\n"),
    [bots, rules],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
      {/* What Claude can still do, given the switches below. */}
      <ul
        aria-live="polite"
        className="flex flex-wrap gap-x-5 gap-y-2 border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-3 sm:px-5"
      >
        {bots.map((b) => {
          const on = rules[b.token] !== "block";
          return (
            <li
              key={b.token}
              className={cn(
                "flex items-center gap-1.5 text-[0.82rem] font-medium transition-colors",
                on ? "text-ink" : "text-muted-foreground line-through decoration-ink/30",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-[5px]",
                  on ? "bg-cta text-white" : "bg-ink/[0.08] text-ink/50",
                )}
              >
                {on ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <X className="h-3 w-3" strokeWidth={3} />
                )}
              </span>
              <span className="sr-only">{on ? "Claude can" : "Claude can't"} </span>
              {ROLE[b.role].outcome}
            </li>
          );
        })}
      </ul>

      <ul className="divide-y divide-ink/[0.06]">
        {bots.map((b) => {
          const rule = rules[b.token];
          const set = (next: Rule) => setRules((r) => ({ ...r, [b.token]: next }));
          return (
            <li
              key={b.token}
              className={cn(
                "grid gap-x-5 gap-y-3 px-4 py-4 transition-colors sm:grid-cols-[minmax(0,1fr)_auto] sm:px-5",
                rule === "block" && "bg-ink/[0.015]",
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <code className="font-mono text-[0.95rem] font-semibold text-ink">{b.token}</code>
                  <span className="text-[0.78rem] font-medium text-muted-foreground">
                    {ROLE[b.role].label}
                  </span>
                  {b.robots === "yes" && (
                    <span className="inline-flex items-center gap-1 text-[0.78rem] font-medium text-cta">
                      <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                      Honors robots.txt
                    </span>
                  )}
                  {b.advice === "your-call" && (
                    <span className="rounded-md bg-ink/[0.05] px-1.5 py-px text-[0.72rem] font-semibold text-ink/60">
                      Your call
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink/70">
                  <Md text={b.purpose} />
                  {b.robotsNote && <> {b.robotsNote}</>}
                </p>
              </div>
              <div
                role="group"
                aria-label={`robots.txt rule for ${b.token}`}
                className="flex h-9 w-fit shrink-0 self-start rounded-lg border border-ink/[0.1] bg-white p-0.5"
              >
                {(["allow", "block"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={rule === r}
                    onClick={() => set(r)}
                    className={cn(
                      "rounded-md px-3 text-[0.8rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                      rule === r
                        ? r === "allow"
                          ? "bg-cta text-white"
                          : "bg-ink/[0.08] text-ink"
                        : "text-muted-foreground hover:text-ink",
                    )}
                  >
                    {r === "allow" ? "Allow" : "Block"}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-ink/[0.07] p-3 sm:p-4">
        <CodePanel lang="robots.txt" code={file} />
      </div>
    </div>
  );
}
