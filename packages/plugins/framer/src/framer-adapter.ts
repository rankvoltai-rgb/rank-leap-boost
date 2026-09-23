/**
 * The only bridge between the real Framer runtime and the structural
 * interfaces the pure modules in `src/lib` are written against. Keeping the
 * cast here is what lets the sync engine be tested with no Framer at all.
 */
import { framer, type ManagedCollection } from "framer-plugin";
import { fnv1a } from "./lib/hash";
import { DATA_KEYS } from "./storage";
import type { ManagedCollectionLike } from "./lib/types";

export function adaptCollection(collection: ManagedCollection): ManagedCollectionLike {
  return collection as unknown as ManagedCollectionLike;
}

/** Guard every mutating call; a viewer-role collaborator can open the plugin. */
export function can(method: string): boolean {
  try {
    return framer.isAllowedTo(method as Parameters<typeof framer.isAllowedTo>[0]);
  } catch {
    // An unknown method name shouldn't hard-block the user.
    return true;
  }
}

/** The production origin of the published site, or null if never published. */
export async function productionUrl(): Promise<string | null> {
  try {
    const info = await framer.getPublishInfo();
    return info.production?.url ?? null;
  } catch {
    return null;
  }
}

/**
 * Identifies which Rankbox site a collection was synced from, without storing
 * anything secret. Swapping keys to a different site must not silently merge
 * two sites' articles into one collection.
 */
export function siteFingerprint(keyPrefix: string, brandName: string | null): string {
  return fnv1a(`${keyPrefix}|${brandName ?? ""}`);
}

export async function readConfig(collection: ManagedCollectionLike) {
  const [
    brandName,
    keyPrefix,
    blogPath,
    autoReport,
    seoEnabled,
    followSlugRenames,
    lastSyncAt,
    fingerprint,
  ] = await Promise.all([
    collection.getPluginData(DATA_KEYS.brandName),
    collection.getPluginData(DATA_KEYS.keyPrefix),
    collection.getPluginData(DATA_KEYS.blogPath),
    collection.getPluginData(DATA_KEYS.autoReport),
    collection.getPluginData(DATA_KEYS.seoEnabled),
    collection.getPluginData(DATA_KEYS.followSlugRenames),
    collection.getPluginData(DATA_KEYS.lastSyncAt),
    collection.getPluginData(DATA_KEYS.siteFingerprint),
  ]);

  return {
    brandName,
    keyPrefix,
    blogPath: blogPath ?? "",
    // The user asked for reporting to happen on its own, so it defaults on.
    // It still never fires before the site has actually been published.
    autoReport: autoReport !== "false",
    seoEnabled: seoEnabled !== "false",
    followSlugRenames: followSlugRenames === "true",
    lastSyncAt,
    fingerprint,
  };
}

export type PluginConfig = Awaited<ReturnType<typeof readConfig>>;

export async function writeConfig(
  collection: ManagedCollectionLike,
  patch: Partial<Record<keyof typeof DATA_KEYS, string | null>>,
): Promise<void> {
  await Promise.all(
    Object.entries(patch).map(([key, value]) =>
      collection.setPluginData(DATA_KEYS[key as keyof typeof DATA_KEYS], value),
    ),
  );
}
