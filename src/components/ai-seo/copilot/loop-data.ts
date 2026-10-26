/**
 * The words inside the grounding-loop illustration that the guide's preview
 * doesn't already carry: the few-word queries Copilot writes, the pages
 * Bing's index holds for them, and the row Bing later reports back. Every
 * brand and domain is invented (none is a registered domain), and the
 * `example.com` row uses the reserved example domain.
 */

export type IndexState = "fresh" | "indexed" | "nocache" | "noarchive";

export interface IndexRow {
  url: string;
  state: IndexState;
  /** The step at which the scan reaches this row. */
  at: number;
}

export const LOOP = {
  queries: ["easy crm setup small team", "crm pricing 5 users", "pipefolk vs quotaloft"],
  /** Which query the Bing panel shows while it scans. */
  activeQuery: 1,
  index: [
    { url: "pipefolk.io/pricing", state: "fresh", at: 6 },
    { url: "crmfieldnotes.com/easiest-crm", state: "indexed", at: 7 },
    { url: "crmbench.net/pipefolk-vs-quotaloft", state: "nocache", at: 7 },
    { url: "salesdeskguide.com/small-team-crm", state: "indexed", at: 8 },
    { url: "example.com/crm-guide", state: "noarchive", at: 8 },
  ] satisfies IndexRow[],
  receipt: { query: "crm pricing 5 users", page: "pipefolk.io/pricing" },
};

export const STATE_LABEL: Record<IndexState, string> = {
  fresh: "IndexNow ping",
  indexed: "Indexed",
  nocache: "nocache: snippet only",
  noarchive: "noarchive: skipped",
};
