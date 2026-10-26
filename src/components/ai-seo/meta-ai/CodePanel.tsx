/**
 * A light code panel for the Meta AI guide: a white tab with the file or
 * language name and a copy button over a pale panel, so the snippets read as
 * part of the white page rather than dark slabs dropped into it. Comment
 * lines are dimmed; long lines scroll inside the panel, never the page.
 */
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINE, PANEL } from "@/components/landing/frame";

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
    <figure className={cn("my-8 overflow-hidden rounded-xl border", LINE, PANEL, className)}>
      <figcaption
        className={cn(
          "flex items-center justify-between gap-3 border-b bg-white px-4 py-1.5",
          LINE,
        )}
      >
        <span className="font-mono text-[0.72rem] font-medium text-muted-foreground">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] font-medium text-ink/60 transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
        >
          {copied ? (
            <Check aria-hidden className="h-3.5 w-3.5 text-cta" />
          ) : (
            <Copy aria-hidden className="h-3.5 w-3.5" />
          )}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.8rem] leading-6 text-ink [overflow-wrap:normal]">
        <code>
          {code.split("\n").map((line, i) => (
            <div key={i} className={cn(line.trimStart().startsWith("#") && "text-ink/45")}>
              {line || " "}
            </div>
          ))}
        </code>
      </pre>
    </figure>
  );
}
