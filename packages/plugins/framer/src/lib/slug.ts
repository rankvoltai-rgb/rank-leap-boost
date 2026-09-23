/**
 * Slug handling.
 *
 * Rankbox derives a slug from the title plus a short id suffix, so retitling an
 * article changes its slug. Changing the slug of an article that is already
 * live would break its URL and invalidate the `published_url` already reported
 * to the backlink exchange, so by default an item keeps the slug it was first
 * synced with. See `resolveSlug`.
 */

const MAX_SLUG_LENGTH = 100;

/** Make a string safe to use as a Framer CMS slug. */
export function sanitizeSlug(raw: string, fallbackId = ""): string {
  const cleaned = raw
    .normalize("NFKD")
    // Strip combining marks so "café" becomes "cafe" rather than "caf".
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-$/, "");

  if (cleaned) return cleaned;
  return fallbackId ? `article-${fallbackId.slice(0, 8)}` : "article";
}

/**
 * Keep the slug an item was created with unless the user opted into tracking
 * Rankbox's slugs. `previous` is what the ledger recorded for this article.
 */
export function resolveSlug(
  incoming: string,
  previous: string | undefined,
  followRename: boolean,
  fallbackId: string,
): string {
  if (previous && !followRename) return previous;
  return sanitizeSlug(incoming, fallbackId);
}

/**
 * Framer requires slugs to be unique within a collection, and one duplicate can
 * reject an entire `addItems` batch. The id suffix makes collisions very
 * unlikely, but this is the ten lines of insurance that stops a whole sync
 * failing because two articles landed on the same slug.
 */
export function dedupeSlugs(slugs: string[]): string[] {
  const seen = new Map<string, number>();
  return slugs.map((slug) => {
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count === 0) return slug;
    const suffix = `-${count + 1}`;
    return `${slug.slice(0, MAX_SLUG_LENGTH - suffix.length)}${suffix}`;
  });
}
