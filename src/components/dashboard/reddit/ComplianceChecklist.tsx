/**
 * The reply's checklist. Three states, because two would lie: where we could
 * not run a check — we never read the subreddit's rules, or the rule is about
 * the member's own posting history — the row is a grey dash with the thing to
 * go and look at. It is never rounded up to a tick.
 */
import { Check, Minus, X } from "lucide-react";
import { complianceSummary } from "@/lib/reddit/compliance";
import type { ComplianceReport, ComplianceState } from "@/lib/data";
import { cn } from "@/lib/utils";

const MARK: Record<ComplianceState, { icon: typeof Check; className: string; label: string }> = {
  pass: { icon: Check, className: "bg-success/15 text-success", label: "Passes" },
  fail: { icon: X, className: "bg-destructive/15 text-destructive", label: "Needs fixing" },
  unknown: {
    icon: Minus,
    className: "bg-secondary text-muted-foreground",
    label: "We couldn't check this",
  },
};

export function ComplianceChecklist({ report }: { report: ComplianceReport }) {
  const verdict =
    report.failures > 0
      ? { text: "Fix this before you post", className: "border-warning/30 bg-warning/15 text-ink" }
      : report.unknowns > 0
        ? {
            text: "Ready — after you check the rest yourself",
            className: "border-border bg-secondary text-ink",
          }
        : {
            text: "Ready for you to post",
            className: "border-success/20 bg-success/10 text-success",
          };

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {report.checks.map((c) => {
          const m = MARK[c.state];
          const Icon = m.icon;
          return (
            <li key={c.id} className="flex gap-2.5">
              <span
                className={cn(
                  "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full",
                  m.className,
                )}
                aria-label={m.label}
                role="img"
              >
                <Icon className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-snug text-ink">{c.label}</p>
                {/* A pass needs no explanation. A fail or an unknown always gets one. */}
                {c.state !== "pass" && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{c.detail}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">{complianceSummary(report)}</span>
        <span
          className={cn("rounded-sm border px-2.5 py-0.5 text-xs font-medium", verdict.className)}
        >
          {verdict.text}
        </span>
      </div>
    </div>
  );
}
