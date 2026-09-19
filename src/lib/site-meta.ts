/**
 * Shared site-metadata shape.
 *
 * Kept free of server imports so the mock store, the client, and the server
 * scraper all describe the same thing.
 */

export interface SiteMeta {
  /** Final URL after redirects, origin only. */
  url: string;
  domain: string;
  /** Best guess at the brand, from og:site_name / title / domain. */
  brandName: string;
  title: string;
  description: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  themeColor: string | null;
  /** Which tag the logo came from, so the UI can say where it looked. */
  logoSource: "og:image" | "apple-touch-icon" | "favicon" | null;
  /** Which path produced this — useful when a result looks thin. */
  via: "firecrawl" | "direct" | "mock";
}

/**
 * What onboarding Part 2 shows: the keyword set plus the context that briefs
 * every article. Keywords match DraftKeyword structurally.
 */
export interface SiteAnalysis {
  niche: string;
  services: string[];
  audience: string;
  geo: string;
  brand_tone: string;
  competitors: string[];
  existing_content: string;
  internal_linking: string;
  missing_opportunities: string[];
  semantic_clusters: string[];
  ai_visibility: string[];
  keywords: Array<{
    id: string;
    name: string;
    /** The AI's estimate — there is no keyword-volume data source yet. */
    search_volume: number;
    intent: string;
    trend: string;
  }>;
}

/*
 * How a confirmed onboarding is split, in both the mock and Supabase commits:
 * the first articles land on the dashboard as opportunities to queue by hand,
 * the rest go straight into the autopilot queue; the first keywords are tracked
 * on the visibility page, the rest listed as discovered.
 */
export const DASHBOARD_IDEAS = 4;
export const TRACKED_KEYWORDS = 4;

/*
 * The traffic model onboarding's forecast states outright: an article earns its
 * keyword's monthly volume times a capture rate that decays down the plan. The
 * server sizes planned articles with it and the projection card previews the
 * keyword set with it, so the two agree.
 */
const CAPTURE_RATE = 0.3;
const CAPTURE_DECAY = 0.965;

/** Modeled monthly visits for the article at `position` (0-based) in the plan. */
export function modeledTraffic(searchVolume: number, position: number): number {
  return Math.round(searchVolume * CAPTURE_RATE * Math.pow(CAPTURE_DECAY, position));
}

/** One content-gap article from onboarding Part 3. Matches DraftTitle structurally. */
export interface PlannedArticle {
  id: string;
  title: string;
  /** The angle and the gap it fills — the brief the article generator writes from. */
  description: string;
  keyword: string;
  /** Keyword volume x a capture rate that decays down the plan. Modeled, not measured. */
  traffic_estimate: number;
  competition: string;
  ai_signal: number;
}

/** What Part 3 plans from: the Part 2 keywords and the brand context around them. */
export interface ContentPlanInput {
  url: string;
  brandName: string;
  description: string;
  niche: string;
  audience: string;
  geo: string;
  competitors: string[];
  semanticClusters: string[];
  missingOpportunities: string[];
  keywords: Array<{ name: string; search_volume: number; intent: string }>;
}

/** Strips protocol/www and returns the bare host. */
export function domainOf(rawUrl: string): string {
  const withScheme = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  try {
    return new URL(withScheme).hostname.replace(/^www\./, "");
  } catch {
    return rawUrl
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./, "")
      .split("/")[0];
  }
}

/**
 * Falls back to a title-cased first domain label.
 *
 * Deliberately conservative: a wrong-but-plausible brand name is worse than an
 * obviously-generic one the user will correct.
 */
export function brandFromDomain(domain: string): string {
  const label = domain.split(".")[0] || domain;
  return label
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Trims a page title down to something usable as a brand name.
 *
 * Titles are usually "Brand — Tagline" or "Tagline | Brand"; take the shorter
 * side of the separator, which is nearly always the brand.
 */
export function brandFromTitle(title: string, domain: string): string {
  const parts = title
    .split(/\s+[|—–·-]\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return title.trim() || brandFromDomain(domain);
  const shortest = parts.reduce((a, b) => (b.length < a.length ? b : a));
  // A "brand" longer than ~40 chars is a tagline; prefer the domain.
  return shortest.length <= 40 ? shortest : brandFromDomain(domain);
}
