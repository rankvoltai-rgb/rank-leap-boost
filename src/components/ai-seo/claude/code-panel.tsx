/** A code sample in a hairline panel, with its language and a copy button. */
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodePanel({
  lang,
  code,
  className,
}: {
  lang: string;
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <figure
      className={cn("overflow-hidden", "rounded-xl border border-ink/[0.08] bg-white", className)}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] py-1.5 pl-4 pr-1.5">
        <span className="text-[0.75rem] font-medium text-muted-foreground">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[0.75rem] font-medium text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
        >
          {copied ? (
            <Check aria-hidden className="h-3.5 w-3.5 text-cta" />
          ) : (
            <Copy aria-hidden className="h-3.5 w-3.5" />
          )}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3.5 text-[0.82rem] leading-[1.7] text-ink">
        <code className="font-mono">
          {code.split("\n").map((line, i) => (
            <span
              key={i}
              className={cn(
                "block min-h-[1.7em]",
                line.trimStart().startsWith("#") && "text-muted-foreground",
              )}
            >
              {line}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
