/**
 * Carries the website URL captured on the landing page through to onboarding.
 *
 * It has to survive three things the previous implementation didn't handle:
 *   1. Hero.tsx navigates with window.location.href — a full page load, so
 *      React state is destroyed.
 *   2. OAuth bounces through a third-party origin, so a query string alone
 *      does not come back.
 *   3. Email confirmation returns via a link Supabase builds, which drops any
 *      query string we didn't put in emailRedirectTo.
 *
 * localStorage survives all three. The ?url= search param is kept alongside it
 * purely so the link stays shareable and debuggable.
 */
const KEY = "rankvolt.pending_site_url";

export function setPendingSiteUrl(url: string) {
  if (typeof window === "undefined") return;
  const trimmed = url.trim();
  if (!trimmed) return;
  try {
    window.localStorage.setItem(KEY, trimmed);
  } catch {
    /* private mode — the ?url= param is the fallback */
  }
}

export function getPendingSiteUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearPendingSiteUrl() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to clean up */
  }
}

/** Prefers an explicit ?url=, falling back to whatever the hero stored. */
export function resolvePendingSiteUrl(searchUrl?: string): string {
  const fromSearch = (searchUrl ?? "").trim();
  if (fromSearch) {
    setPendingSiteUrl(fromSearch);
    return fromSearch;
  }
  return getPendingSiteUrl();
}
