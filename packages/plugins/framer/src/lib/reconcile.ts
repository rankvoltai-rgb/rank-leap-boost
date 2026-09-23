import type { PublishedArticle } from "@rankbox/api-client";
import { contentHash, toCollectionItem } from "./mapping";
import { dedupeSlugs, resolveSlug } from "./slug";
import type { Ledger, LedgerEntry } from "./ledger";
import type { CollectionItemLike } from "./types";

export interface PlanOptions {
  /** Articles the API returned for this walk. */
  remote: PublishedArticle[];
  /** Item ids currently in the Framer collection. */
  existingIds: string[];
  ledger: Ledger;
  /** False on an incremental walk — deletes are unsafe then. */
  walkWasComplete: boolean;
  /** Let Rankbox's slug changes rewrite live URLs. Off by default. */
  followSlugRenames?: boolean;
  /** Compose a live URL for an article, when the site is published. */
  liveUrlFor?: (slug: string) => string | null;
  /** Force a write of every article, ignoring the ledger. */
  force?: boolean;
}

export interface SlugChange {
  from: string;
  to: string;
}

export interface SyncPlan {
  toWrite: CollectionItemLike[];
  toRemove: string[];
  unchanged: number;
  /** Slugs that moved, so old URLs can be redirected rather than 404. */
  slugChanges: SlugChange[];
  /** The ledger as it should be saved once the plan is applied. */
  nextItems: Record<string, LedgerEntry>;
}

/**
 * Decide what to write and what to delete. Pure — no Framer, no network.
 *
 * Safety rules encoded here:
 *  - Deletes only happen on a complete walk. An incremental walk can't tell
 *    "deleted" from "unchanged".
 *  - Only items the ledger knows about are ever deleted, so a CMS item a user
 *    added by hand is never touched.
 *  - A first run against an existing collection (empty ledger) writes
 *    everything and deletes nothing; deletion starts working on the next sync.
 */
export function planSync(options: PlanOptions): SyncPlan {
  const {
    remote,
    existingIds,
    ledger,
    walkWasComplete,
    followSlugRenames = false,
    liveUrlFor,
    force = false,
  } = options;

  const ledgerWasEmpty = Object.keys(ledger.items).length === 0;

  // Resolve slugs first so duplicates can be settled across the whole batch.
  const slugs = dedupeSlugs(
    remote.map((article) =>
      resolveSlug(article.slug, ledger.items[article.id]?.slug, followSlugRenames, article.id),
    ),
  );

  const toWrite: CollectionItemLike[] = [];
  const slugChanges: SlugChange[] = [];
  const nextItems: Record<string, LedgerEntry> = { ...ledger.items };
  let unchanged = 0;

  remote.forEach((article, i) => {
    const slug = slugs[i];
    const hash = contentHash(article);
    const previous = ledger.items[article.id];
    const slugChanged = previous?.slug !== undefined && previous.slug !== slug;

    if (!force && previous && previous.h === hash && !slugChanged) {
      unchanged += 1;
      return;
    }

    // A moved slug means the old page URL is about to stop resolving.
    if (slugChanged && previous) slugChanges.push({ from: previous.slug, to: slug });

    toWrite.push(toCollectionItem(article, slug, liveUrlFor?.(slug) ?? null));
    nextItems[article.id] = { h: hash, slug };
  });

  let toRemove: string[] = [];
  if (walkWasComplete && !ledgerWasEmpty) {
    const remoteIds = new Set(remote.map((a) => a.id));
    toRemove = existingIds.filter((id) => !remoteIds.has(id) && id in ledger.items);
    for (const id of toRemove) delete nextItems[id];
  }

  return { toWrite, toRemove, unchanged, slugChanges, nextItems };
}

/** Articles whose live URL isn't what Rankbox already has recorded. */
export function articlesNeedingReport(
  remote: PublishedArticle[],
  ledger: Ledger,
  liveUrlFor: (slug: string) => string | null,
): Array<{ article: PublishedArticle; url: string }> {
  const pending: Array<{ article: PublishedArticle; url: string }> = [];
  for (const article of remote) {
    const slug = ledger.items[article.id]?.slug ?? article.slug;
    const url = liveUrlFor(slug);
    if (!url) continue;
    if (article.published_url === url) continue;
    pending.push({ article, url });
  }
  return pending;
}
