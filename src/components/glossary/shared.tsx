/**
 * Pieces shared by the glossary hub and entry pages: the term card, the
 * category label, and the copy / cite actions.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Copy, Quote } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCategory, type GlossaryTerm } from "@/data/glossary/terms";
import { formatDate } from "@/lib/format-date";
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

export const SITE = "https://rankbox.xyz";

export function termUrl(slug: string): string {
  return `${SITE}/glossary/${slug}`;
}

/**
 * The definition minus its subject, for places that already show the term as
 * a heading: "Query fan-out is an AI search technique…" under a "Query
 * fan-out" title reads as "An AI search technique…". Falls back to the whole
 * sentence when the subject isn't the term.
 */
export function definitionGist(term: GlossaryTerm): string {
  const text = plainText(term.definition);
  const m = text.match(/^(.{1,120}?)\s(?:is|are)\s(.+)$/);
  const stem = term.term.toLowerCase().replace(/s$/, "");
  if (!m || !m[1].toLowerCase().includes(stem)) return text;
  return m[2].charAt(0).toUpperCase() + m[2].slice(1);
}

/* ---------- term card ---------- */

/**
 * One term on the hub and in related-terms grids. The definition is shown in
 * full where there's room and clamped where there isn't — either way it's in
 * the HTML, so the card is a complete answer even before the click.
 */
export function TermCard({
  term,
  compact = false,
  className,
}: {
  term: GlossaryTerm;
  /** The hub's dense grid: two-line gist, no footer row. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/glossary/$term"
      params={{ term: term.slug }}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-border bg-card shadow-1 transition-all hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt",
        compact ? "p-4" : "p-5",
        className,
      )}
    >
      <span className="flex h-5 items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {term.abbr && (
          <span className="rounded-md bg-volt/10 px-1.5 font-mono text-[0.68rem] leading-5 tracking-normal text-volt">
            {term.abbr}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">{getCategory(term.category).name}</span>
        {compact && (
          <ArrowRight
            aria-hidden
            className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-volt opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
          />
        )}
      </span>
      <span
        className={cn(
          "font-display font-semibold leading-snug tracking-tight text-ink",
          compact ? "mt-2 text-[1rem]" : "mt-2.5 text-[1.08rem]",
        )}
      >
        {term.term}
      </span>
      <span
        className={cn(
          "mt-1.5 flex-1 leading-relaxed text-muted-foreground",
          compact ? "line-clamp-2 text-[0.84rem]" : "line-clamp-3 text-[0.88rem]",
        )}
      >
        {definitionGist(term)}
      </span>
      {!compact && (
        <span className="mt-4 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-ink/70 transition-colors group-hover:text-volt">
          Read the entry
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      )}
    </Link>
  );
}

/* ---------- copy / cite ---------- */

function useCopied(): [string | null, (key: string, text: string) => void] {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(key);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(null), 1800);
      },
      () => {
        /* clipboard blocked (insecure context, permissions): nothing to confirm */
      },
    );
  };
  return [copied, copy];
}

/**
 * "Copy" takes the definition with its source attached; "Cite" offers the
 * formats people paste into an article, a doc or a README. Every format links
 * back — the cheapest backlink there is, given freely.
 */
export function CiteActions({ term }: { term: GlossaryTerm }) {
  const [copied, copy] = useCopied();
  const url = termUrl(term.slug);
  const definition = plainText(term.definition);
  const formats = [
    {
      key: "citation",
      label: "Citation",
      text: `Rankbox. “${term.term}.” AI Search Glossary, updated ${formatDate(term.updated)}. ${url}`,
    },
    { key: "html", label: "HTML link", text: `<a href="${url}">${term.term}</a>` },
    { key: "markdown", label: "Markdown link", text: `[${term.term}](${url})` },
  ];

  const button =
    "inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[0.78rem] font-semibold text-ink/75 transition-colors hover:border-ink/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt";

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={() => copy("definition", `${definition} — ${url}`)}
        className={button}
        aria-label="Copy definition"
      >
        {copied === "definition" ? (
          <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        <span aria-live="polite">{copied === "definition" ? "Copied" : "Copy"}</span>
      </button>
      <Popover>
        <PopoverTrigger className={button}>
          <Quote className="h-3.5 w-3.5" />
          Cite
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] rounded-xl p-2">
          <p className="px-2 pb-1.5 pt-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Cite this term
          </p>
          <ul>
            {formats.map((f) => (
              <li key={f.key}>
                <button
                  type="button"
                  onClick={() => copy(f.key, f.text)}
                  className="group flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.8rem] font-semibold text-ink">{f.label}</span>
                    <span className="mt-0.5 block truncate font-mono text-[0.7rem] text-muted-foreground">
                      {f.text}
                    </span>
                  </span>
                  <span className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-ink">
                    {copied === f.key ? (
                      <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
