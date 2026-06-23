import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- Labeled field ---------- */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      {hint && <span className="ml-2 text-xs text-muted-foreground">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputBase =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-volt focus:ring-2 focus:ring-volt/20";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputBase, "min-h-28 resize-y leading-relaxed", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputBase, "appearance-none", props.className)} />;
}

/* ---------- Toggle row ---------- */
export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:border-ink/20"
    >
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-volt" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

/* ---------- Primary action button ---------- */
export function RunButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      )}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/40 border-t-background" />
      )}
      {children}
    </button>
  );
}

/* ---------- Copy / download output box ---------- */
export function OutputBox({
  value,
  filename,
  language = "text",
}: {
  value: string;
  filename?: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  function download() {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? "download.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {language}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-secondary"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          {filename && (
            <button
              type="button"
              onClick={download}
              className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-secondary"
            >
              Download
            </button>
          )}
        </div>
      </div>
      <pre className="max-h-[420px] overflow-auto px-4 py-3.5 text-[0.82rem] leading-relaxed text-ink">
        <code>{value}</code>
      </pre>
    </div>
  );
}

/* ---------- Error note ---------- */
export function ErrorNote({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      {message}
    </p>
  );
}

/* ---------- Two-column tool shell ---------- */
export function ToolGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">{children}</div>;
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

/* ---------- Shared AI error mapper ---------- */
export function readAiError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/402|credit/i.test(message)) {
    return "This free AI tool is temporarily out of credits. Please try again later.";
  }
  if (/429|rate/i.test(message)) {
    return "Too many requests right now. Please wait a moment and try again.";
  }
  return message || "Something went wrong. Please try again.";
}