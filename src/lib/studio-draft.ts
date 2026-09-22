/**
 * Progress through Studio's "Add a site" flow, kept in this browser.
 *
 * Separate from onboarding's draft (src/lib/onboarding-draft.ts) so adding a
 * client site can never disturb, or be mistaken for, the account's own setup.
 * Bound to the account that started it, like onboarding's.
 *
 * `paidSiteId` is set the moment the charge goes through. From then on the
 * site exists and is paid for, so a failed save of its plan is retried
 * against that site — never by charging again.
 */
import type { OnboardingDraft } from "@/lib/mock/store";

const KEY = "rankbox.studio.draft.v1";

export interface StudioDraft extends OnboardingDraft {
  paidSiteId: string | null;
}

interface Stored {
  owner: string;
  draft: StudioDraft;
}

function read(): Stored | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

/** The saved draft, if this account started it. */
export function loadStudioDraft(owner: string): StudioDraft | null {
  const stored = read();
  return stored && stored.owner === owner ? stored.draft : null;
}

export function saveStudioDraft(owner: string, draft: StudioDraft) {
  if (typeof window === "undefined" || !owner) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ owner, draft } satisfies Stored));
  } catch {
    /* quota or private mode — the flow still works, it just won't resume */
  }
}

export function clearStudioDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}

export function emptyStudioDraft(): StudioDraft {
  return {
    step: 1,
    url: "",
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
    paidSiteId: null,
  };
}
