import type { Blog, IntegrationKey } from "@/lib/data";
import type { PlatformId } from "@/data/platforms";

/**
 * Whether articles are actually reaching the user's site.
 *
 * Publishing is pull-based: the site (a plugin, or the user's own code) asks
 * the API for new articles with its key, and every request stamps the key's
 * last_used_at. So a key existing proves nothing — a key being *used* is the
 * signal. Everything here is read from that stamp and the articles' own
 * timestamps; nothing is inferred beyond them.
 */

/** No request in this long, and a working site has probably stopped syncing. */
export const STALE_AFTER_HOURS = 48;

export type KeyStatus = "live" | "idle" | "waiting" | "revoked";

export function keyStatus(key: IntegrationKey, now = Date.now()): KeyStatus {
  if (key.revoked_at) return "revoked";
  if (!key.last_used_at) return "waiting";
  const hours = (now - new Date(key.last_used_at).getTime()) / 3_600_000;
  return hours <= STALE_AFTER_HOURS ? "live" : "idle";
}

/** The site as a whole: the best any active key is doing. */
export type SiteStatus = "none" | "waiting" | "live" | "stale";

export function siteStatus(keys: IntegrationKey[] | undefined, now = Date.now()): SiteStatus {
  const active = (keys ?? []).filter((k) => !k.revoked_at);
  if (active.length === 0) return "none";
  const statuses = active.map((k) => keyStatus(k, now));
  if (statuses.includes("live")) return "live";
  if (statuses.includes("idle")) return "stale";
  return "waiting";
}

/** The most recent sync across active keys. */
export function lastSync(keys: IntegrationKey[] | undefined): string | null {
  return (
    (keys ?? [])
      .filter((k) => !k.revoked_at && k.last_used_at)
      .map((k) => k.last_used_at as string)
      .sort()
      .pop() ?? null
  );
}

export interface Delivery {
  published: number;
  /** Published articles last changed before the sync — the site has them. */
  delivered: number;
  /** Published or edited since — they arrive on the next sync. */
  waiting: number;
}

/**
 * The API hands a site every published article changed since its last pull,
 * so anything published or edited after the latest sync hasn't reached it.
 */
export function delivery(blogs: Blog[], syncedAt: string | null): Delivery {
  const published = blogs.filter((b) => b.status === "finished");
  if (!syncedAt) return { published: published.length, delivered: 0, waiting: published.length };
  const waiting = published.filter((b) => b.updated_at > syncedAt).length;
  return { published: published.length, delivered: published.length - waiting, waiting };
}

/** "just now", "12 min ago", "3 hours ago", "2 days ago". */
export function timeAgo(iso: string | null, now = Date.now()): string {
  if (!iso) return "never";
  const minutes = Math.round((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.round(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}

/** The platform a key was made for, from its name — keys made in setup are named after it. */
export function platformOf(key: Pick<IntegrationKey, "name">): PlatformId | null {
  const name = key.name.toLowerCase();
  const ids: PlatformId[] = ["shopify", "wordpress", "webflow", "square", "framer"];
  return ids.find((id) => name.includes(id)) ?? null;
}
