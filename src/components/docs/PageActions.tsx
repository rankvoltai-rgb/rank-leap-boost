import { useState } from "react";
import { Check, ChevronDown, Copy, FileText, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DOCS_SITE } from "@/data/docs";

/**
 * "Copy page" and its menu: the page as markdown, the raw .md, and the page
 * handed to an AI assistant. The same markdown agents fetch from <page>.md.
 */
export function PageActions({ path, title }: { path: string; title: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const mdPath = `${path}.md`;
  const mdUrl = `${DOCS_SITE}${mdPath}`;
  const prompt = `Read ${mdUrl} so you can answer my questions about "${title}" in the Rankbox docs.`;

  const copy = async () => {
    try {
      const res = await fetch(mdPath, { headers: { Accept: "text/markdown" } });
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 1800);
  };

  return (
    <div className="inline-flex shrink-0 items-stretch self-start overflow-hidden rounded-lg border border-border bg-card text-sm shadow-1">
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-2 px-3 py-1.5 font-medium text-ink transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta"
      >
        {state === "copied" ? (
          <Check className="h-3.5 w-3.5 text-success" aria-hidden />
        ) : (
          <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        )}
        <span aria-live="polite">
          {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy page"}
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="More ways to use this page"
          className="flex items-center border-l border-border px-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta"
        >
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem asChild>
            <a href={mdPath} target="_blank" rel="noopener" className="flex items-start gap-2.5">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span>
                <span className="block font-medium">View as Markdown</span>
                <span className="block text-xs text-muted-foreground">
                  The plain text agents read
                </span>
              </span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href={`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5"
            >
              <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span>
                <span className="block font-medium">Ask ChatGPT about this page</span>
                <span className="block text-xs text-muted-foreground">
                  Opens a chat with the page
                </span>
              </span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://claude.ai/new?q=${encodeURIComponent(prompt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5"
            >
              <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span>
                <span className="block font-medium">Ask Claude about this page</span>
                <span className="block text-xs text-muted-foreground">
                  Opens a chat with the page
                </span>
              </span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
