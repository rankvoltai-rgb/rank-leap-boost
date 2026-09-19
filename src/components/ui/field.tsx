/**
 * The single labelled-input primitive.
 *
 * Replaces three near-identical local copies (auth/AuthSplit, auth/Onboarding,
 * dashboard.settings) that were drifting apart visually.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const CONTROL =
  "w-full rounded-xl border border-border bg-card px-3.5 text-sm text-ink shadow-1 outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-volt focus:ring-2 focus:ring-volt/15 disabled:cursor-not-allowed disabled:opacity-60";

function Label({
  children,
  required,
  hint,
}: {
  children: ReactNode;
  required?: boolean;
  hint?: ReactNode;
}) {
  return (
    <span className="mb-1.5 flex items-baseline justify-between gap-3">
      <span className="text-sm font-medium text-ink">
        {children}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
    </span>
  );
}

export function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  hint,
  prefix,
  disabled,
  className,
  autoFocus,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: ReactNode;
  /** Static leading text inside the control, e.g. a scheme or currency. */
  prefix?: string;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <Label required={required} hint={hint}>
        {label}
      </Label>
      <span
        className={cn(
          "flex items-center gap-0 overflow-hidden rounded-xl",
          prefix &&
            "border border-border bg-card shadow-1 focus-within:border-volt focus-within:ring-2 focus-within:ring-volt/15",
        )}
      >
        {prefix && (
          <span className="shrink-0 select-none pl-3.5 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-11",
            prefix
              ? "w-full flex-1 border-0 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-muted-foreground"
              : CONTROL,
          )}
        />
      </span>
    </label>
  );
}

export function TextareaField({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  hint,
  required,
  className,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <Label required={required} hint={hint}>
        {label}
      </Label>
      <textarea
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={cn(CONTROL, "resize-none py-2.5 leading-relaxed")}
      />
    </label>
  );
}
