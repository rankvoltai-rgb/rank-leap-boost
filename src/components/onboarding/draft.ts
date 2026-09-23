/**
 * Onboarding drafts as they come back out of storage.
 *
 * A draft outlives the code that wrote it: it sits in localStorage across
 * deploys, so one saved before a field existed (titles, keywords…) comes back
 * without it. Rendering trusted it whole, and one missing list crashed the
 * page on every visit, refresh included. Every field is now checked on the way
 * in and anything missing or malformed falls back to its empty value.
 */
import type { DraftKeyword, DraftTitle, OnboardingDraft } from "@/lib/data";

export function emptyDraft(url: string): OnboardingDraft {
  return {
    step: 1,
    url,
    brandName: "",
    description: "",
    logoUrl: null,
    firstName: "",
    niche: "",
    audience: "",
    brandTone: "",
    geo: "",
    services: [],
    competitors: [],
    semanticClusters: [],
    aiVisibility: [],
    missingOpportunities: [],
    keywords: [],
    analyzedUrl: "",
    titles: [],
    confirmedAt: null,
  };
}

type Loose = Record<string, unknown>;

const isRecord = (v: unknown): v is Loose => typeof v === "object" && v !== null;
const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const strings = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

function keyword(v: unknown, i: number): DraftKeyword | null {
  if (!isRecord(v) || !str(v.name).trim()) return null;
  return {
    id: str(v.id, `kw-${i}`),
    name: str(v.name),
    search_volume: num(v.search_volume),
    intent: str(v.intent),
    trend: str(v.trend),
    ...(v.manual === true ? { manual: true } : {}),
  };
}

function title(v: unknown, i: number): DraftTitle | null {
  if (!isRecord(v) || !str(v.title).trim()) return null;
  return {
    id: str(v.id, `title-${i}`),
    title: str(v.title),
    description: str(v.description),
    keyword: str(v.keyword),
    traffic_estimate: num(v.traffic_estimate),
    competition: str(v.competition),
    ai_signal: num(v.ai_signal),
  };
}

/**
 * A saved draft made whole, or null when there's nothing to resume.
 *
 * Drafts saved before the scan read real sites have no `analyzedUrl`; their
 * brand details and keywords are placeholders, so those restart from step 1
 * with only the URL carried over. A step whose inputs didn't survive steps
 * back to the one that produces them, so no step opens without its data.
 */
export function normalizeDraft(saved: unknown): OnboardingDraft | null {
  if (!isRecord(saved) || saved.step === "done") return null;
  const url = str(saved.url);
  if (typeof saved.analyzedUrl !== "string") return emptyDraft(url);

  const keywords = (Array.isArray(saved.keywords) ? saved.keywords : [])
    .map(keyword)
    .filter((k): k is DraftKeyword => k !== null);
  const titles = (Array.isArray(saved.titles) ? saved.titles : [])
    .map(title)
    .filter((t): t is DraftTitle => t !== null);

  let step: 1 | 2 | 3 = saved.step === 2 || saved.step === 3 ? saved.step : 1;
  if (step === 3 && keywords.length === 0) step = 2;
  if (step >= 2 && !url.trim()) step = 1;

  return {
    step,
    url,
    brandName: str(saved.brandName),
    description: str(saved.description),
    logoUrl: typeof saved.logoUrl === "string" ? saved.logoUrl : null,
    firstName: str(saved.firstName),
    niche: str(saved.niche),
    audience: str(saved.audience),
    brandTone: str(saved.brandTone),
    geo: str(saved.geo),
    services: strings(saved.services),
    competitors: strings(saved.competitors),
    semanticClusters: strings(saved.semanticClusters),
    aiVisibility: strings(saved.aiVisibility),
    missingOpportunities: strings(saved.missingOpportunities),
    keywords,
    analyzedUrl: saved.analyzedUrl,
    titles,
    confirmedAt: typeof saved.confirmedAt === "string" ? saved.confirmedAt : null,
  };
}
