/**
 * Guarded fetch for user-supplied URLs.
 *
 * Site analysis fetches whatever URL a user types, from the server. Unguarded,
 * that is an SSRF primitive: it will happily retrieve `http://169.254.169.254/`
 * or a host on a private network and hand the body back to the caller.
 *
 * What this enforces:
 *   - http/https only (no file:, gopher:, data:, …)
 *   - no literal loopback / private / link-local / unique-local IP hosts
 *   - no localhost-ish or cloud metadata hostnames
 *   - redirects followed manually, re-validating every hop
 *   - a byte cap, so a huge response cannot exhaust memory
 *   - a wall-clock timeout
 *
 * Known limitation: hostnames are checked as written. Without a DNS resolver
 * (Cloudflare Workers has no DNS API) a name that resolves to a private
 * address still passes — DNS-rebinding style. Closing that needs resolution at
 * the edge or an egress proxy; this blocks the direct and by far most common
 * form.
 */

const MAX_REDIRECTS = 3;
const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_MAX_BYTES = 512 * 1024;

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata",
  "metadata.google.internal",
  "instance-data",
]);

const BLOCKED_SUFFIXES = [".local", ".localhost", ".internal", ".lan", ".home.arpa"];

function isBlockedIpv4(host: string): boolean {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if ([a, Number(m[2]), Number(m[3]), Number(m[4])].some((n) => n > 255)) return true;
  if (a === 0 || a === 10 || a === 127) return true; // this-network, private, loopback
  if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // private
  if (a === 192 && b === 168) return true; // private
  if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
  if (a >= 224) return true; // multicast + reserved
  return false;
}

/** Expands an IPv6 literal to its eight 16-bit groups, or null if unparseable. */
function expandIpv6(input: string): number[] | null {
  let h = input.toLowerCase();
  // A trailing dotted quad (::ffff:10.0.0.1) becomes two hex groups.
  const dotted = h.match(/^(.*:)(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (dotted) {
    const [a, b, c, d] = dotted.slice(2).map(Number);
    if ([a, b, c, d].some((n) => n > 255)) return null;
    h = `${dotted[1]}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const halves = h.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 ? (halves[1] ? halves[1].split(":") : []) : [];
  if (halves.length === 1 && head.length !== 8) return null;
  const fill = 8 - head.length - tail.length;
  if (fill < 0) return null;
  const groups = [...head, ...Array(halves.length === 2 ? fill : 0).fill("0"), ...tail];
  if (groups.length !== 8) return null;
  const out = groups.map((g) => parseInt(g || "0", 16));
  return out.some((n) => Number.isNaN(n) || n < 0 || n > 0xffff) ? null : out;
}

function isBlockedIpv6(host: string): boolean {
  const h = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (!h.includes(":")) return false;

  const g = expandIpv6(h);
  // Unparseable but colon-bearing: treat as hostile rather than guess.
  if (!g) return true;

  // Loopback ::1 and unspecified ::
  if (g.slice(0, 7).every((n) => n === 0) && (g[7] === 1 || g[7] === 0)) return true;
  // IPv4-mapped ::ffff:a.b.c.d — check the embedded IPv4. URL parsers normalize
  // the dotted form to hex, so this must work on groups, not on the string.
  if (g.slice(0, 5).every((n) => n === 0) && g[5] === 0xffff) {
    const v4 = `${g[6] >> 8}.${g[6] & 0xff}.${g[7] >> 8}.${g[7] & 0xff}`;
    return isBlockedIpv4(v4);
  }
  if ((g[0] & 0xffc0) === 0xfe80) return true; // link-local fe80::/10
  if ((g[0] & 0xfe00) === 0xfc00) return true; // unique-local fc00::/7
  return false;
}

export class UnsafeUrlError extends Error {
  constructor(reason: string) {
    super(`Refusing to fetch that URL: ${reason}`);
    this.name = "UnsafeUrlError";
  }
}

/** Normalizes and validates a user-supplied URL. Throws UnsafeUrlError. */
export function assertSafeUrl(raw: string): URL {
  const trimmed = raw.trim();
  if (!trimmed) throw new UnsafeUrlError("empty");

  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new UnsafeUrlError("not a valid URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError(`scheme ${url.protocol} is not allowed`);
  }

  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(host)) throw new UnsafeUrlError("host is not routable");
  if (BLOCKED_SUFFIXES.some((s) => host.endsWith(s))) {
    throw new UnsafeUrlError("host is not routable");
  }
  if (isBlockedIpv4(host) || isBlockedIpv6(host)) {
    throw new UnsafeUrlError("host is a private or reserved address");
  }
  // Credentials in the URL are a redirect-laundering trick; drop them.
  url.username = "";
  url.password = "";
  return url;
}

export interface SafeFetchResult {
  url: string;
  status: number;
  contentType: string;
  body: string;
  truncated: boolean;
}

/**
 * Fetches a user-supplied URL with the guards above.
 *
 * Redirects are followed manually (`redirect: "manual"`) so each hop is
 * re-validated — otherwise a public URL could 302 straight to a private one.
 */
export async function safeFetchText(
  rawUrl: string,
  opts: { timeoutMs?: number; maxBytes?: number; userAgent?: string; accept?: string } = {},
): Promise<SafeFetchResult> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_BYTES;

  let url = assertSafeUrl(rawUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const res = await fetch(url.toString(), {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": opts.userAgent ?? "RankboxBot/1.0 (+https://rankbox.xyz)",
          Accept: opts.accept ?? "text/html,application/xhtml+xml",
        },
      });

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) throw new UnsafeUrlError("redirect without a location");
        if (hop === MAX_REDIRECTS) throw new UnsafeUrlError("too many redirects");
        // Re-validate the destination, resolving relative Location headers.
        url = assertSafeUrl(new URL(location, url).toString());
        continue;
      }

      const contentType = res.headers.get("content-type") ?? "";

      // Read with a hard byte cap rather than trusting content-length.
      const reader = res.body?.getReader();
      if (!reader)
        return { url: url.toString(), status: res.status, contentType, body: "", truncated: false };

      const chunks: Uint8Array[] = [];
      let total = 0;
      let truncated = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        total += value.byteLength;
        if (total > maxBytes) {
          chunks.push(value.slice(0, Math.max(0, value.byteLength - (total - maxBytes))));
          truncated = true;
          await reader.cancel();
          break;
        }
        chunks.push(value);
      }

      const merged = new Uint8Array(chunks.reduce((n, c) => n + c.byteLength, 0));
      let offset = 0;
      for (const c of chunks) {
        merged.set(c, offset);
        offset += c.byteLength;
      }

      return {
        url: url.toString(),
        status: res.status,
        contentType,
        body: new TextDecoder("utf-8", { fatal: false }).decode(merged),
        truncated,
      };
    }
    throw new UnsafeUrlError("too many redirects");
  } finally {
    clearTimeout(timer);
  }
}
