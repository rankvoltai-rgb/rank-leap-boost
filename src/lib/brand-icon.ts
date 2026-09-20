/**
 * Brand icon lookup by domain.
 *
 * Shared by the hero URL input (which shows the visitor's own favicon as they
 * type) and the "Used by" card. Uses DuckDuckGo's icon service rather than our
 * own server: both call sites are on the unauthenticated landing page, so a
 * server round trip — or a Firecrawl scrape — would be far too slow and costly,
 * and would mean exposing a public scrape endpoint.
 *
 * Note the service returns a generic icon for unknown domains, so a successful
 * load is not proof the domain exists.
 */

/**
 * Extracts a bare hostname from free text, or null if it is not yet a
 * plausible domain.
 *
 * Strict about the TLD so an icon does not flicker in while someone is still
 * mid-word: "stripe" must not resolve, "stripe.com" must.
 */
export function hostnameFrom(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let host: string;
  try {
    host = new URL(withScheme).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
  return /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(host) ? host : null;
}

/** Icon URL for a domain, or null if the input is not a usable hostname. */
export function brandIconUrl(domain: string): string | null {
  const host = hostnameFrom(domain);
  return host ? `https://icons.duckduckgo.com/ip3/${encodeURIComponent(host)}.ico` : null;
}

/**
 * Icon URL sized for display on a tile, or null if the input is not a usable
 * hostname.
 *
 * The DuckDuckGo service above serves whatever .ico the site happens to
 * publish — usually 16 or 32px, which is fine inside a text input but visibly
 * soft on a 48px comparison-page lockup at 2x. Google's endpoint takes an
 * explicit size and upscales from the best source it has, so it is the better
 * choice wherever the mark is a design element rather than an affordance.
 */
export function brandIconUrlAt(domain: string, size: 32 | 64 | 128 | 256): string | null {
  const host = hostnameFrom(domain);
  if (!host) return null;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
}
