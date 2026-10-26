/**
 * The guide's to-do list, with ticks kept in this browser: numbered in the
 * order to do the work, each tagged with how much it moves.
 */
import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import type { ChecklistItem } from "@/data/ai-seo/types";
import { Md } from "@/components/ai-seo/kit";
import { LINE, PANEL } from "@/components/landing/frame";
import { cn } from "@/lib/utils";

const IMPACT: Record<ChecklistItem["impact"], { label: string; className: string }> = {
  high: { label: "High impact", className: "bg-cta-soft text-cta" },
  medium: { label: "Medium", className: "bg-ink/[0.05] text-ink/60" },
  low: { label: "Low", className: "bg-ink/[0.04] text-ink/45" },
};

export function Checklist({ storageKey, items }: { storageKey: string; items: ChecklistItem[] }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const saved = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(saved)) setDone(saved.filter((id): id is string => typeof id === "string"));
    } catch {
      /* storage unavailable: start empty */
    }
  }, [storageKey]);

  const save = (next: string[]) => {
    setDone(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* storage unavailable: the ticks still work for this visit */
    }
  };

  const toggle = (id: string) =>
    save(done.includes(id) ? done.filter((d) => d !== id) : [...done, id]);
  const count = items.filter((i) => done.includes(i.id)).length;
  const pct = Math.round((count / items.length) * 100);

  return (
    <div className={cn("mt-8 overflow-hidden rounded-xl border bg-white", LINE)}>
      <div className={cn("flex items-center gap-4 border-b px-4 py-3.5 sm:px-5", LINE, PANEL)}>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-ink" aria-live="polite">
              {count} of {items.length} done
            </p>
            {count > 0 && (
              <button
                type="button"
                onClick={() => save([])}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-ink"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                Reset
              </button>
            )}
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Checklist progress"
          >
            <div
              className="h-full rounded-full bg-cta transition-[width] duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
      <ol className="divide-y divide-ink/[0.07]">
        {items.map((item, i) => {
          const checked = done.includes(item.id);
          const impact = IMPACT[item.impact];
          return (
            <li key={item.id}>
              <label className="flex cursor-pointer gap-3.5 px-4 py-3.5 transition-colors hover:bg-ink/[0.015] sm:px-5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(item.id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-cta/40 peer-focus-visible:ring-offset-2",
                    checked ? "border-cta bg-cta text-white" : "border-ink/20 bg-white",
                  )}
                >
                  {checked && <Check className="h-3 w-3" strokeWidth={3.5} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="font-mono text-[0.7rem] font-semibold text-ink/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-semibold leading-snug transition-colors",
                        checked ? "text-ink/45 line-through decoration-ink/30" : "text-ink",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em]",
                        impact.className,
                      )}
                    >
                      {impact.label}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.92rem] leading-relaxed text-ink/70">
                    <Md text={item.detail} />
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
