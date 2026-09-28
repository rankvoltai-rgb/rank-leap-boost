import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * IndexNow for rankbox.xyz itself: tells Bing (and through it Copilot),
 * Yandex, Seznam, Naver, Yep and the other participating engines about new
 * and changed pages the day they go live, instead of waiting for a recrawl.
 * Google doesn't take part; it keeps reading the sitemap.
 *
 * The live sitemap is the source of truth. Each run submits the URLs that are
 * new or whose <lastmod> moved since they were last sent
 * (indexnow_submissions), so every change is announced once. Pages the
 * sitemap lists without a lastmod are announced when they first appear, not
 * on later edits. URLs that leave the sitemap aren't announced as removed:
 * when Notion is down the sitemap drops its posts for a while, and those
 * pages still exist.
 */

// Served as public/<key>.txt, which is how the engines check that pings for
// rankbox.xyz come from rankbox.xyz. Not a secret. Change both together.
export const INDEXNOW_KEY = "7d12912cf883cd47099fbfca7f679488";

const SITE = "https://rankbox.xyz";
const HOST = "rankbox.xyz";
// The shared endpoint: one submission reaches every participating engine.
const ENDPOINT = "https://api.indexnow.org/indexnow";
// The protocol's per-request ceiling.
const MAX_URLS_PER_REQUEST = 10_000;
// PostgREST returns at most 1,000 rows per request.
const PAGE_SIZE = 1000;

export interface SitemapUrl {
  url: string;
  lastmod: string | null;
}

export interface IndexNowReport {
  inSitemap: number;
  submitted: number;
}

export function parseSitemap(xml: string): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1];
    if (!loc) continue;
    urls.push({ url: loc, lastmod: block.match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/)?.[1] ?? null });
  }
  return urls;
}

/**
 * The sitemap URLs to submit: ones never sent, and ones whose lastmod differs
 * from the one sent. Other hosts are dropped (IndexNow rejects the whole
 * request over one), and so are repeats.
 */
export function pickChanged(current: SitemapUrl[], sent: Map<string, string | null>): SitemapUrl[] {
  const seen = new Set<string>();
  return current.filter((u) => {
    if (seen.has(u.url)) return false;
    seen.add(u.url);
    if (!u.url.startsWith(`${SITE}/`)) return false;
    if (!sent.has(u.url)) return true;
    return u.lastmod !== null && sent.get(u.url) !== u.lastmod;
  });
}

async function loadSent(): Promise<Map<string, string | null>> {
  const sent = new Map<string, string | null>();
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabaseAdmin
      .from("indexnow_submissions")
      .select("url, lastmod")
      .order("url")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`indexnow_submissions read failed: ${error.message}`);
    for (const row of data) sent.set(row.url, row.lastmod);
    if (data.length < PAGE_SIZE) return sent;
  }
}

async function submit(urlList: string[]): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
    signal: AbortSignal.timeout(30_000),
  });
  // 200 is accepted; 202 is accepted while the key file is still being checked.
  // 403 means the key file isn't live, 429 means slow down: nothing is recorded,
  // so the next run tries the same URLs again.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

export async function runIndexNow(): Promise<IndexNowReport> {
  const res = await fetch(`${SITE}/sitemap.xml`, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const current = parseSitemap(await res.text());
  // An empty parse is a broken sitemap, not a site with no pages.
  if (current.length === 0) throw new Error("sitemap listed no URLs");

  const changed = pickChanged(current, await loadSent());
  for (let i = 0; i < changed.length; i += MAX_URLS_PER_REQUEST) {
    const batch = changed.slice(i, i + MAX_URLS_PER_REQUEST);
    await submit(batch.map((u) => u.url));
    const submittedAt = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("indexnow_submissions")
      .upsert(
        batch.map((u) => ({ url: u.url, lastmod: u.lastmod, submitted_at: submittedAt })),
        { onConflict: "url" },
      );
    if (error) throw new Error(`indexnow_submissions write failed: ${error.message}`);
  }
  return { inSitemap: current.length, submitted: changed.length };
}
