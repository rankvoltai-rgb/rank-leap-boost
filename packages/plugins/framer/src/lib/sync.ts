import type { PublishedArticle } from "@rankbox/api-client";
import { fieldsEqual, mergeFields, type FieldConflict } from "./fields";
import { LEDGER_KEY, parseLedger, serializeLedger, type Ledger } from "./ledger";
import { walkArticles, type ArticleFetcher } from "./pagination";
import { planSync, type SlugChange } from "./reconcile";
import type { ManagedCollectionLike } from "./types";

/** Above this, a full walk costs too many requests and we go incremental. */
export const RECONCILE_MAX_ARTICLES = 1000;

/** Framer accepts large batches, but chunking keeps progress honest. */
export const WRITE_CHUNK = 100;

export interface SyncProgress {
  phase: "fetching" | "fields" | "writing" | "removing" | "done";
  fetched?: number;
  written?: number;
  total?: number;
}

export interface SyncOptions {
  collection: ManagedCollectionLike;
  client: ArticleFetcher;
  /** Null forces a full reconcile. */
  since?: string | null;
  followSlugRenames?: boolean;
  liveUrlFor?: (slug: string) => string | null;
  force?: boolean;
  signal?: AbortSignal;
  onProgress?: (progress: SyncProgress) => void;
  /** Guards every mutating Framer call. Defaults to allowing everything. */
  can?: (method: string) => boolean;
}

export interface SyncResult {
  written: number;
  removed: number;
  unchanged: number;
  total: number;
  complete: boolean;
  stalled?: "no-progress" | "max-pages";
  /** Slugs that moved this sync — the caller adds redirects for them. */
  slugChanges: SlugChange[];
  conflicts: FieldConflict[];
  articles: PublishedArticle[];
  ledger: Ledger;
}

export class PermissionError extends Error {
  constructor(public method: string) {
    super("You don't have permission to change this project's CMS.");
    this.name = "PermissionError";
  }
}

/**
 * Bring the collection in line with the site's finished articles.
 *
 * Defaults to a full walk: the API caps pages at 100, so a typical site is one
 * or two requests, and a complete list is what makes deletes correct. The
 * ledger's content hashes mean a full walk still writes nothing when nothing
 * changed, so the cost is bounded reads, not CMS churn.
 */
export async function syncArticles(options: SyncOptions): Promise<SyncResult> {
  const {
    collection,
    client,
    followSlugRenames = false,
    liveUrlFor,
    force = false,
    signal,
    onProgress,
    can = () => true,
  } = options;

  const ledger = parseLedger(await collection.getPluginData(LEDGER_KEY));

  // Only go incremental once a library is big enough that a full walk is
  // genuinely expensive — and never when the caller asked for a full run.
  const knownCount = Object.keys(ledger.items).length;
  const useCursor =
    options.since !== null &&
    knownCount > RECONCILE_MAX_ARTICLES &&
    !force &&
    Boolean(ledger.cursor);
  const since = useCursor ? (options.since ?? ledger.cursor) : null;

  onProgress?.({ phase: "fetching", fetched: 0 });
  const walk = await walkArticles(client, since, {
    signal,
    onPage: (fetched) => onProgress?.({ phase: "fetching", fetched }),
  });

  // Align the collection's schema before writing anything into it.
  onProgress?.({ phase: "fields" });
  const existingFields = await collection.getFields();
  const { fields, conflicts } = mergeFields(existingFields);
  if (!fieldsEqual(existingFields, fields)) {
    if (!can("ManagedCollection.setFields")) throw new PermissionError("setFields");
    await collection.setFields(fields);
  }

  const existingIds = await collection.getItemIds();
  const plan = planSync({
    remote: walk.articles,
    existingIds,
    ledger,
    walkWasComplete: walk.complete,
    followSlugRenames,
    liveUrlFor,
    force,
  });

  let written = 0;
  if (plan.toWrite.length > 0) {
    if (!can("ManagedCollection.addItems")) throw new PermissionError("addItems");
    for (let i = 0; i < plan.toWrite.length; i += WRITE_CHUNK) {
      if (signal?.aborted) throw new Error("Sync cancelled.");
      const chunk = plan.toWrite.slice(i, i + WRITE_CHUNK);
      await collection.addItems(chunk);
      written += chunk.length;
      onProgress?.({ phase: "writing", written, total: plan.toWrite.length });
    }
  }

  let removed = 0;
  if (plan.toRemove.length > 0) {
    if (!can("ManagedCollection.removeItems")) throw new PermissionError("removeItems");
    onProgress?.({ phase: "removing", total: plan.toRemove.length });
    await collection.removeItems(plan.toRemove);
    removed = plan.toRemove.length;
  }

  const nextLedger: Ledger = {
    ...ledger,
    items: plan.nextItems,
    cursor: walk.cursor,
    lastFullAt: walk.complete ? new Date().toISOString() : ledger.lastFullAt,
  };
  await collection.setPluginData(LEDGER_KEY, serializeLedger(nextLedger));

  onProgress?.({ phase: "done" });
  return {
    written,
    removed,
    unchanged: plan.unchanged,
    total: walk.articles.length,
    complete: walk.complete,
    stalled: walk.reason,
    slugChanges: plan.slugChanges,
    conflicts,
    articles: walk.articles,
    ledger: nextLedger,
  };
}
