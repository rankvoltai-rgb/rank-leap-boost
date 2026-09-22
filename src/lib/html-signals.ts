/**
 * Regex-level reads of an HTML document: the tags a crawler looks at first.
 *
 * No DOM, so it runs in a server function and in the browser alike. It is
 * deliberately forgiving — the point is to report what a page declares, not
 * to validate its markup.
 */

export interface Heading {
  level: number;
  text: string;
}

export interface HtmlSignals {
  title: string;
  description: string;
  canonical: string;
  robotsMeta: string;
  lang: string;
  viewport: boolean;
  og: Record<string, string>;
  twitterCard: string;
  headings: Heading[];
  h1Count: number;
  /** schema.org @type values found in JSON-LD blocks. */
  schemaTypes: string[];
  jsonLdBlocks: number;
  jsonLdErrors: number;
  /** Visible text with tags, scripts and styles removed. */
  text: string;
  wordCount: number;
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function attr(tag: string, name: string): string {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return decode((m?.[1] ?? m?.[2] ?? m?.[3] ?? "").trim());
}

export function stripTags(html: string): string {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/** Headings from HTML, in document order. */
export function headingsFromHtml(html: string): Heading[] {
  const out: Heading[] = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    out.push({ level: Number(m[1]), text: stripTags(m[2]) });
  }
  return out;
}

/** Headings from Markdown (ATX `#` style), in document order. */
export function headingsFromMarkdown(md: string): Heading[] {
  const out: Heading[] = [];
  let inFence = false;
  for (const line of md.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = line.match(/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (m) out.push({ level: m[1].length, text: m[2].trim() });
  }
  return out;
}

function collectTypes(node: unknown, into: Set<string>) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((n) => collectTypes(n, into));
    return;
  }
  const rec = node as Record<string, unknown>;
  const t = rec["@type"];
  if (typeof t === "string") into.add(t);
  if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && into.add(x));
  const graph = rec["@graph"];
  if (graph) collectTypes(graph, into);
}

export function readHtmlSignals(html: string): HtmlSignals {
  const head = html.slice(0, 200_000);
  const title = decode(
    (head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/\s+/g, " ").trim(),
  );

  const metas = head.match(/<meta\b[^>]*>/gi) ?? [];
  let description = "";
  let robotsMeta = "";
  let viewport = false;
  let twitterCard = "";
  const og: Record<string, string> = {};
  for (const tag of metas) {
    const name = (attr(tag, "name") || attr(tag, "property")).toLowerCase();
    const content = attr(tag, "content");
    if (!name) continue;
    if (name === "description" && !description) description = content;
    if (name === "robots") robotsMeta = content;
    if (name === "viewport") viewport = true;
    if (name === "twitter:card") twitterCard = content;
    if (name.startsWith("og:")) og[name.slice(3)] = content;
  }

  const links = head.match(/<link\b[^>]*>/gi) ?? [];
  const canonicalTag = links.find((l) => /rel\s*=\s*["']?canonical/i.test(l));
  const canonical = canonicalTag ? attr(canonicalTag, "href") : "";

  const lang = attr(head.match(/<html\b[^>]*>/i)?.[0] ?? "", "lang");

  const schemaTypes = new Set<string>();
  let jsonLdBlocks = 0;
  let jsonLdErrors = 0;
  const ldRe = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = ldRe.exec(html))) {
    jsonLdBlocks += 1;
    try {
      collectTypes(JSON.parse(m[1].trim()), schemaTypes);
    } catch {
      jsonLdErrors += 1;
    }
  }

  const headings = headingsFromHtml(html);
  const text = stripTags(html.replace(/<head[\s\S]*?<\/head>/i, " "));
  const wordCount = text ? text.split(/\s+/).length : 0;

  return {
    title,
    description,
    canonical,
    robotsMeta,
    lang,
    viewport,
    og,
    twitterCard,
    headings,
    h1Count: headings.filter((h) => h.level === 1).length,
    schemaTypes: [...schemaTypes],
    jsonLdBlocks,
    jsonLdErrors,
    text,
    wordCount,
  };
}
