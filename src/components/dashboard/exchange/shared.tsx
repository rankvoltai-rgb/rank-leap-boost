/**
 * Small pieces every exchange tab shares: status pills, a copy button, a
 * chip editor for anchors and tags, and the field styles from Settings.
 */
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Check, Copy, X } from "lucide-react";
import { Pill } from "@/components/dashboard/primitives";
import type { PlacementStatus } from "@/lib/data";
import { cn } from "@/lib/utils";
import { STATUS } from "./format";

export function StatusPill({ status }: { status: PlacementStatus }) {
  const s = STATUS[status];
  return (
    <Pill tone={s.tone} className="whitespace-nowrap">
      <span title={s.hint}>{s.label}</span>
    </Pill>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it by hand.");
    }
  }
  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-ink"
    >
      {done ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </button>
  );
}

/** A code-ish value with a copy button beside it. */
export function CopyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-md bg-secondary px-2.5 py-1.5 font-mono text-[12.5px] text-ink">
          {value}
        </code>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

/**
 * A list of short strings the user adds one at a time. Enter or comma adds;
 * the × removes. Used for anchors and topic tags.
 */
export function ChipInput({
  id,
  values,
  onChange,
  placeholder,
  max,
  disabled,
}: {
  id?: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const full = max !== undefined && values.length >= max;

  function commit() {
    const v = draft.trim().replace(/,+$/, "").trim();
    if (!v) return;
    if (values.some((x) => x.toLowerCase() === v.toLowerCase())) {
      setDraft("");
      return;
    }
    if (full) return;
    onChange([...values, v]);
    setDraft("");
  }

  return (
    <div
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring/20",
        disabled && "opacity-60",
      )}
    >
      {values.map((v) => (
        <span
          key={v}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-ink"
        >
          {v}
          {!disabled && (
            <button
              type="button"
              aria-label={`Remove ${v}`}
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="text-muted-foreground hover:text-ink"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      {!full && !disabled && (
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !draft && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={commit}
          placeholder={values.length ? "" : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-0.5 text-sm text-ink outline-none placeholder:text-muted-foreground"
        />
      )}
    </div>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  );
}
