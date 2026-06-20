// Server-only: live web research (Firecrawl) + deterministic SEO scoring reused
// by the article generator. Reads FIRECRAWL_API_KEY inside functions only.
import { analyzeContent, type SeoAnalysis } from "./seo-analysis";
import { markdownToHtml } from "./markdown";

export interface ResearchSource {
  title: string;
  url: string;
}

export interface ResearchBrief {
  ok: boolean;
  topResults: ResearchSource[];
  competitorHeadings: string[];
  sources: ResearchSource[];
  notes: string;
}

const EMPTY_BRIEF: ResearchBrief = {
  ok: false,
  topResults: [],
  competitorHeadings: [],
  sources: [],
  notes: "",
};

type FirecrawlSearchResult = {
  title?: string;
  url?: string;
  description?: string;
  markdown?: string;
};

function extractHeadings(markdown: string): string[] {
  const lines = markdown.split(/\r?\n/);
  const headings: string[] = [];
  for (const line of lines) {
    const m = /^(#{2,4})\s+(.+)$/.exec(line.trim());
    if (m) {
      const text = m[2].replace(/[*_`#]/g, "").trim();
      if (text && text.length <= 110) headings.push(text);
    }
  }
  return headings;
}

/** Pull the top ranking pages for a keyword and distill a research brief. */
export async function gatherResearch(keyword: string): Promise<ResearchBrief> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey || !keyword.trim()) return EMPTY_BRIEF;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const res = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: keyword,
        limit: 10,
        scrapeOptions: { formats: ["markdown"], onlyMainContent: true },
      }),
    });
    if (!res.ok) return EMPTY_BRIEF;
    const json = (await res.json()) as {
      data?: { web?: FirecrawlSearchResult[] } | FirecrawlSearchResult[];
      web?: FirecrawlSearchResult[];
    };
    const raw: FirecrawlSearchResult[] = Array.isArray(json.data)
      ? json.data
      : (json.data?.web ?? json.web ?? []);

    const results = raw.filter((r) => r.url);
    if (!results.length) return EMPTY_BRIEF;

    const topResults: ResearchSource[] = results.slice(0, 10).map((r) => ({
      title: (r.title ?? r.url ?? "").slice(0, 140),
      url: r.url ?? "",
    }));

    const headingSet = new Set<string>();
    for (const r of results.slice(0, 5)) {
      if (!r.markdown) continue;
      for (const h of extractHeadings(r.markdown)) headingSet.add(h);
    }
    const competitorHeadings = Array.from(headingSet).slice(0, 40);

    const sources: ResearchSource[] = topResults.slice(0, 5);

    const notes = results
      .slice(0, 5)
      .map((r, i) => `${i + 1}. ${r.title ?? r.url}: ${(r.description ?? "").slice(0, 220)}`)
      .join("\n");

    return { ok: true, topResults, competitorHeadings, sources, notes };
  } catch {
    return EMPTY_BRIEF;
  } finally {
    clearTimeout(timeout);
  }
}

/** Deterministic SEO score from raw markdown, reusing the editor's analyzer. */
export function scoreArticle(input: {
  title: string;
  keyword: string;
  metaDescription: string;
  body: string;
}): SeoAnalysis {
  const html = markdownToHtml(input.body ?? "");
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return analyzeContent({
    title: input.title,
    keyword: input.keyword,
    metaDescription: input.metaDescription,
    html,
    text,
  });
}
