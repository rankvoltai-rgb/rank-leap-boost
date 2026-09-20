/**
 * Domain and URL normalisation for the exchange. Pure, so the server, the
 * dashboard and the mock store all agree on what "the same site" means.
 */

/** Query parameters that identify a click, not a page. */
const TRACKING_PARAM =
  /^(utm_|fbclid$|gclid$|dclid$|msclkid$|mc_cid$|mc_eid$|_hsenc$|_hsmi$|ref$|source$)/i;

const HOSTNAME = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/;

function parse(raw: string): URL | null {
  let s = (raw ?? "").trim();
  if (!s) return null;
  if (s.startsWith("//")) s = `https:${s}`;
  else if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = `https://${s}`;
  try {
    const url = new URL(s);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

/**
 * The bare domain a member verifies: lowercase, no scheme, no `www.`, no path
 * or port; an IDN becomes its punycode form. Empty when the input isn't a
 * domain at all (an IP, a bare word, gibberish).
 */
export function normalizeDomain(raw: string): string {
  const url = parse(raw);
  if (!url) return "";
  const host = url.hostname
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/^www\./, "");
  if (!HOSTNAME.test(host)) return "";
  // A TLD is letters (or punycode); an all-digit last label means an IP literal.
  const tld = host.slice(host.lastIndexOf(".") + 1);
  if (!/^([a-z]{2,63}|xn--[a-z0-9-]{1,59})$/.test(tld)) return "";
  return host;
}

/** The verified-domain form of a URL's host. */
export function domainOf(url: string): string {
  return normalizeDomain(url);
}

/** Whether `url` lives on `domain` or one of its subdomains. */
export function isOnDomain(url: string, domain: string): boolean {
  const d = normalizeDomain(domain);
  const h = domainOf(url);
  if (!d || !h) return false;
  return h === d || h.endsWith(`.${d}`);
}

export function isHttpUrl(raw: string): boolean {
  return parse(raw) !== null && /^https?:\/\//i.test(raw.trim());
}

/**
 * A URL reduced to what identifies the page, for matching an `href` found on
 * a page against a target: scheme-agnostic, `www`-agnostic, no fragment, no
 * tracking parameters, no trailing slash, query sorted. Empty if unparseable.
 */
export function normalizeLinkUrl(raw: string): string {
  const url = parse(raw);
  if (!url) return "";
  const host = url.hostname
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/^www\./, "");
  const params = [...url.searchParams.entries()]
    .filter(([key]) => !TRACKING_PARAM.test(key))
    .sort(([a], [b]) => a.localeCompare(b));
  const query = params.length
    ? `?${params.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&")}`
    : "";
  let path = url.pathname.replace(/\/+$/, "");
  try {
    path = decodeURI(path);
  } catch {
    // Leave a malformed escape as written; it still compares consistently.
  }
  return `${host}${path}${query}`;
}

/** Whether two URLs point at the same page, by normalizeLinkUrl. */
export function sameLink(a: string, b: string): boolean {
  const na = normalizeLinkUrl(a);
  return na !== "" && na === normalizeLinkUrl(b);
}
