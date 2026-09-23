/**
 * The `syncManagedCollection` path: Framer asked for a re-sync.
 *
 * This deliberately renders no UI. Framer surfaces a toast of its own while a
 * plugin runs in this mode, and the documented best experience is to do the
 * work and get out of the way.
 */
import { framer } from "framer-plugin";
import { RankboxClient } from "@rankbox/api-client";
import { syncArticles } from "./lib/sync";
import { composeLiveUrl, normalizeBlogPath } from "./lib/live-url";
import { describeErrorLine } from "./lib/errors";
import { activeCollection } from "./collection";
import { adaptCollection, can, productionUrl, readConfig } from "./framer-adapter";
import { addSlugRedirects, installSeo, reportLiveUrls } from "./services";
import { DATA_KEYS, loadApiKey, loadBaseUrl } from "./storage";

export async function runHeadlessSync(): Promise<never> {
  const baseUrl = loadBaseUrl();

  try {
    const collection = await activeCollection();
    const adapted = adaptCollection(collection);
    const config = await readConfig(adapted);
    const apiKey = loadApiKey(collection.id);

    // The key lives in the browser, not the project, so a teammate — or this
    // user on another machine — can reach a configured collection with no key.
    // Say so plainly instead of failing with an auth error.
    if (!apiKey) {
      return framer.closePlugin(
        "Rankbox isn't connected in this browser. Open the Rankbox plugin and paste your key.",
        { variant: "error" },
      );
    }

    framer.setBackgroundMessage("Syncing articles from Rankbox…");

    const client = new RankboxClient({ apiKey, baseUrl });
    const origin = await productionUrl();
    const path = normalizeBlogPath(config.blogPath);
    const liveUrlFor = origin ? (slug: string) => composeLiveUrl(origin, path, slug) : undefined;

    const result = await syncArticles({
      collection: adapted,
      client,
      liveUrlFor,
      followSlugRenames: config.followSlugRenames,
      can,
    });

    await collection.setPluginData(DATA_KEYS.lastSyncAt, new Date().toISOString());

    // Keep renamed articles' old URLs alive. Best-effort by design.
    if (result.slugChanges.length > 0) await addSlugRedirects(result.slugChanges, path);

    // Reporting and structured data both need a published site to point at.
    let reported = 0;
    if (origin) {
      if (config.autoReport) {
        const report = await reportLiveUrls({
          client,
          articles: result.articles,
          ledger: result.ledger,
          productionUrl: origin,
          blogPath: path,
        });
        reported = report.reported;
      }
      if (config.seoEnabled) {
        const who = await client.ping().catch(() => null);
        await installSeo({
          articles: result.articles,
          ledger: result.ledger,
          productionUrl: origin,
          blogPath: path,
          brandName: config.brandName ?? who?.brand_name ?? null,
          logoUrl: who?.logo_url ?? null,
        });
      }
    }

    return framer.closePlugin(summarize(result.written, result.removed, reported), {
      variant: "success",
    });
  } catch (err) {
    return framer.closePlugin(describeErrorLine(err, { baseUrl, phase: "sync" }), {
      variant: "error",
    });
  }
}

function summarize(written: number, removed: number, reported: number): string {
  const parts: string[] = [];
  if (written) parts.push(`${written} article${written === 1 ? "" : "s"} synced`);
  if (removed) parts.push(`${removed} removed`);
  if (reported) parts.push(`${reported} URL${reported === 1 ? "" : "s"} reported`);
  return parts.length ? `Rankbox: ${parts.join(", ")}.` : "Rankbox: already up to date.";
}
