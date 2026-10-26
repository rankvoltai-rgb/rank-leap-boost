/**
 * The plain helpers the /alternatives/surfer-seo sections share: the accent
 * splitters for titles that come from the data, the state labels, and small
 * formatters. Kept apart from ui.tsx so that file exports only components.
 */
import type { CSSProperties, ReactNode } from "react";
import { Accent } from "@/components/landing/frame";
import { matchupsFor } from "@/data/compare/matchups";
import type { CellState, Competitor } from "@/data/alternatives";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** A data title with its closing `words` words in the blue accent. */
export function accentTail(text: string, words: number): ReactNode {
  const parts = text.split(" ");
  if (parts.length <= words) return <Accent>{text}</Accent>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

/** "A does this. B does that." with the closing sentence in the accent. */
export function accentLastSentence(text: string): ReactNode {
  const at = text.trimEnd().slice(0, -1).lastIndexOf(". ");
  if (at < 0) return accentTail(text, 2);
  return (
    <>
      {text.slice(0, at + 1)} <Accent>{text.slice(at + 2)}</Accent>
    </>
  );
}

export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or via an add-on",
  no: "Not what it's built for",
};

/** "https://www.surferseo.com/pricing/" → "surferseo.com/pricing". */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}

/** The head-to-heads a competitor appears in (empty for one with none). */
export function headToHeads(competitor: Competitor) {
  return matchupsFor(competitor.slug as Parameters<typeof matchupsFor>[0]);
}

/** The paths the comparisons band already links to, for ExploreMore's `exclude`. */
export function comparisonPaths(competitor: Competitor): string[] {
  return headToHeads(competitor).map((m) => `/compare/${m.slug}`);
}
