/**
 * Plain helpers for the /alternatives/jasper layout: the state labels, matrix
 * lookups by label, and the sample-screen card class. Kept out of the
 * component files so fast refresh stays component-only.
 */
import type { CellState, Competitor, MatrixRow } from "@/data/alternatives";

export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or via an add-on",
  no: "Not what it's built for",
};

/** Every row of the matrix, flat, in the order the page lists them. */
export function allRows(c: Competitor): MatrixRow[] {
  return c.matrix.flatMap((g) => g.rows);
}

/** Matrix rows by label, in the order asked for. Labels that aren't there drop out. */
export function rowsByLabel(c: Competitor, labels: readonly string[]): MatrixRow[] {
  const rows = allRows(c);
  return labels
    .map((l) => rows.find((r) => r.label === l))
    .filter((r): r is MatrixRow => Boolean(r));
}

/** "https://www.jasper.ai/pricing?x=1" → "jasper.ai/pricing". */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}

/** The hairline white card the page's sample screens sit in. */
export const SCREEN =
  "rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-24px_rgba(16,24,40,0.28)]";
