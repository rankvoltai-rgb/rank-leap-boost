/**
 * Where an item goes live. Webflow serves a collection's template page at
 * `/{collection slug}/{item slug}` on every domain the site is published to,
 * so the URL is fully determined once we know which domain to use.
 */

export interface WebflowSiteDomains {
  shortName?: string | null;
  customDomains?: { url?: string | null }[] | null;
}

function host(value: string | null | undefined): string {
  if (!value) return "";
  const raw = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(raw).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function bare(h: string): string {
  return h.replace(/^www\./, "");
}

/** Same comparison as the public API's domain check: ignores `www.`, allows subdomains. */
export function sameSite(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = bare(host(a));
  const right = bare(host(b));
  if (!left || !right) return false;
  return left === right || left.endsWith(`.${right}`) || right.endsWith(`.${left}`);
}

/**
 * The host to build live URLs on: the custom domain that matches the Rankbox
 * site's own URL, else the first custom domain, else `{shortName}.webflow.io`.
 */
export function pickDomain(
  site: WebflowSiteDomains,
  rankboxUrl: string | null | undefined,
): string | null {
  const custom = (site.customDomains ?? []).map((d) => host(d.url)).filter(Boolean);
  const exact = custom.find((h) => h === host(rankboxUrl));
  if (exact) return exact;
  const matching = custom.find((h) => sameSite(h, rankboxUrl));
  if (matching) return matching;
  if (custom[0]) return custom[0];
  return site.shortName ? `${site.shortName.toLowerCase()}.webflow.io` : null;
}

export function composeLiveUrl(
  domain: string | null,
  collectionSlug: string | null | undefined,
  itemSlug: string,
): string | null {
  if (!domain || !collectionSlug || !itemSlug) return null;
  const clean = (s: string) => s.replace(/^\/+|\/+$/g, "");
  return `https://${domain}/${clean(collectionSlug)}/${clean(itemSlug)}`;
}
