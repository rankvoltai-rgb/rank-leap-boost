/**
 * The checklist, in the order to work through it. Ticks are kept in this
 * browser (same key the old guide used, so nobody loses progress); storage is
 * optional, so every read and write is guarded and the list works without it.
 */
import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Md } from "@/components/ai-seo/kit";
import type { ChecklistItem } from "@/data/ai-seo/types";
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

const IMPACT: Record<ChecklistItem["impact"], { label: string; className: string }> = {
  high: { label: "High impact", className: "text-cta" },
  medium: { label: "Medium impact", className: "text-ink/60" },
  low: { label: "Low impact", className: "text-muted-foreground" },
};

export function Readiness({ storageKey, items }: { storageKey: string; items: ChecklistItem[] }) {
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
      /* storage unavailable: ticks still work for this visit */
    }
  };
  const toggle = (id: string) =>
    save(done.includes(id) ? done.filter((d) => d !== id) : [...done, id]);
  const count = items.filter((i) => done.includes(i.id)).length;
  const pct = Math.round((count / items.length) * 100);

  return (
    <div className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white">
      <div className="flex items-center gap-4 border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-3 sm:px-5">
        <p className="shrink-0 text-[0.85rem] font-semibold text-ink" aria-live="polite">
          {count} of {items.length} done
        </p>
        <div
          className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-ink/[0.07]"
          role="progressbar"
          aria-label="Checklist progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div
            className="h-full rounded-full bg-cta transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
        {count > 0 && (
          <button
            type="button"
            onClick={() => save([])}
            className="inline-flex shrink-0 items-center gap-1 text-[0.78rem] font-medium text-muted-foreground transition-colors hover:text-ink"
          >
            <RotateCcw aria-hidden className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>
      <ol className="divide-y divide-ink/[0.06]">
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
                    checked ? "border-cta bg-cta text-white" : "border-ink/[0.18] bg-white",
                  )}
                >
                  {checked && <Check className="h-3 w-3" strokeWidth={3.5} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <span className="text-[0.78rem] font-semibold tabular-nums text-muted-foreground">
                      {i + 1}.
                    </span>
                    <span
                      className={cn(
                        "font-semibold leading-snug transition-colors",
                        checked
                          ? "text-muted-foreground line-through decoration-ink/30"
                          : "text-ink",
                      )}
                    >
                      {plainText(item.title)}
                    </span>
                    <span className={cn("text-[0.75rem] font-medium", impact.className)}>
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
