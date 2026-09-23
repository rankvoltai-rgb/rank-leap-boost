/**
 * Finding — or creating — the collection this plugin syncs into.
 *
 * In `configureManagedCollection` and `syncManagedCollection` modes Framer has
 * already chosen the collection. From the canvas the plugin has to find its own,
 * which is what makes the product's "the plugin creates your collection" claim
 * true.
 */
import { framer, type ManagedCollection } from "framer-plugin";
import { DATA_KEYS } from "./storage";

export const DEFAULT_COLLECTION_NAME = "Articles";
const FALLBACK_COLLECTION_NAME = "Rankbox Articles";

async function isOurs(collection: ManagedCollection): Promise<boolean> {
  try {
    return (await collection.getPluginData(DATA_KEYS.owner)) === "rankbox";
  } catch {
    return false;
  }
}

async function markOwned(collection: ManagedCollection): Promise<void> {
  await collection.setPluginData(DATA_KEYS.owner, "rankbox");
  try {
    await framer.setPluginData(DATA_KEYS.collectionId, collection.id);
  } catch {
    // The project-level pointer is only an optimisation.
  }
}

/**
 * Resolve the collection to sync into, creating one when there isn't a match.
 *
 * `createManagedCollection` rejects when a collection of that name already
 * exists, so the lookup comes first — and a rejection is itself the signal to
 * go back and adopt the existing one.
 */
export async function findOrCreateCollection(): Promise<ManagedCollection> {
  const collections = await framer.getManagedCollections();

  // 1. The pointer we wrote last time.
  try {
    const pointer = await framer.getPluginData(DATA_KEYS.collectionId);
    const byId = pointer ? collections.find((c) => c.id === pointer) : undefined;
    if (byId) return byId;
  } catch {
    // Fall through to the scan.
  }

  // 2. Our ownership marker.
  for (const collection of collections) {
    if (await isOurs(collection)) {
      await markOwned(collection);
      return collection;
    }
  }

  // 3. A collection that simply has the name we use.
  const byName = collections.find(
    (c) => c.name === DEFAULT_COLLECTION_NAME || c.name === FALLBACK_COLLECTION_NAME,
  );
  if (byName) {
    await markOwned(byName);
    return byName;
  }

  // 4. Create one, falling back to adopting a same-named collection if the
  //    create rejects because one already exists.
  try {
    const created = await framer.createManagedCollection(DEFAULT_COLLECTION_NAME);
    await markOwned(created);
    return created;
  } catch (err) {
    const retry = await framer.getManagedCollections();
    const existing = retry.find((c) => c.name === DEFAULT_COLLECTION_NAME);
    if (existing) {
      await markOwned(existing);
      return existing;
    }
    try {
      const fallback = await framer.createManagedCollection(FALLBACK_COLLECTION_NAME);
      await markOwned(fallback);
      return fallback;
    } catch {
      throw err;
    }
  }
}

/** The collection Framer launched the plugin with. */
export async function activeCollection(): Promise<ManagedCollection> {
  const collection = await framer.getActiveManagedCollection();
  await markOwned(collection);
  return collection;
}
