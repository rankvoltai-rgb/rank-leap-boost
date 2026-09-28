/**
 * Pushing finished articles into a connected Webflow collection.
 *
 * Called from three places, all server-side: autopilot right after it writes
 * an article, the dashboard after a manual "write now" or editor publish, and
 * "Sync now" for anything not in Webflow yet. Every path goes through
 * `publishArticle`, which is idempotent: the ledger (webflow_items) records
 * what each article became, and an unchanged article is never rewritten.
 *
 * Two rules from Webflow's Marketplace guidelines shape the update path:
 * Webflow stays the source of truth, so an item someone edited in Webflow is
 * left alone rather than overwritten; and a revoked token is deleted at once.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";
import type { SiteScope } from "@/lib/entitlement.server";
import { isOnDomain, normalizeDomain } from "@/lib/exchange/domain";
import {
  WebflowApiError,
  createItem,
  findItemBySlug,
  getCollection,
  getItem,
  isSlugConflict,
  mayHaveLanded,
  updateItem,
  webflowConfig,
  type WebflowItem,
} from "./api.server";
import { bodyHtmlForWebflow } from "./body";
import { decryptToken } from "./crypto";
import { parseFieldMap } from "./fields";
import { composeLiveUrl } from "./live-url";
import { contentHash, toFieldData, webflowSlug, withSuffix } from "./mapping";

export type ConnectionRow = Tables<"webflow_connections">;
type LedgerRow = Tables<"webflow_items">;

export type PublishOutcome =
  | { result: "created"; itemId: string; liveUrl: string | null; draft: boolean }
  | { result: "updated"; itemId: string }
  | { result: "unchanged" }
  | {
      result: "skipped";
      reason:
        | "not_connected"
        | "not_finished"
        | "in_progress"
        | "edited_in_webflow"
        | "deleted_in_webflow";
    }
  | { result: "failed"; error: string };

const BLOG_COLUMNS = "id, title, description, body, tags, status, published_url, site_id, user_id";

export async function loadConnection(scope: SiteScope): Promise<ConnectionRow | null> {
  const { data, error } = await supabaseAdmin
    .from("webflow_connections")
    .select("*")
    .eq("site_id", scope.siteId)
    .eq("user_id", scope.userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

/** Ready to publish: authorized, and a collection is mapped. */
export function isPublishing(conn: ConnectionRow | null): conn is ConnectionRow {
  return (
    !!conn &&
    !!conn.access_token_enc &&
    !!conn.collection_id &&
    (conn.status === "active" || conn.status === "error")
  );
}

export async function tokenFor(conn: ConnectionRow): Promise<string> {
  if (!conn.access_token_enc) throw new WebflowApiError(401, "Not connected to Webflow.");
  return decryptToken(conn.access_token_enc, webflowConfig().encryptionKey);
}

/**
 * Webflow said the token is no good: the user revoked the app or uninstalled
 * it. Delete the token (Webflow requires it) but keep the row, so the ledger
 * survives and reconnecting doesn't create every item a second time.
 */
export async function forgetToken(conn: ConnectionRow, message: string): Promise<void> {
  await supabaseAdmin
    .from("webflow_connections")
    .update({ access_token_enc: null, status: "disconnected", last_error: message })
    .eq("id", conn.id);
}

async function recordConnectionError(conn: ConnectionRow, message: string | null) {
  await supabaseAdmin
    .from("webflow_connections")
    .update(
      message
        ? { status: "error", last_error: message }
        : { status: "active", last_error: null, last_published_at: new Date().toISOString() },
    )
    .eq("id", conn.id);
}

/** Domains a live URL may be written back on, same rule as the public API's PATCH. */
async function ownDomains(scope: SiteScope): Promise<string[]> {
  const [{ data: exchange }, { data: profile }] = await Promise.all([
    supabaseAdmin
      .from("exchange_sites")
      .select("domain")
      .eq("id", scope.siteId)
      .eq("user_id", scope.userId)
      .in("status", ["verified", "suspended"])
      .maybeSingle(),
    supabaseAdmin
      .from("profiles")
      .select("website_url")
      .eq("id", scope.siteId)
      .eq("user_id", scope.userId)
      .maybeSingle(),
  ]);
  return [exchange?.domain ?? "", normalizeDomain(profile?.website_url ?? "")].filter(Boolean);
}

/**
 * Tell the backlink exchange where the article went live. Only when the URL
 * is on the site's own domain (a `*.webflow.io` staging URL isn't), and only
 * when no URL has been recorded yet: a manual or sitemap URL wins. Shared
 * with the Shopify publisher (a `*.myshopify.com` URL isn't on the domain either).
 */
export async function writeBackLiveUrl(scope: SiteScope, blogId: string, liveUrl: string | null) {
  if (!liveUrl) return;
  const domains = await ownDomains(scope);
  if (!domains.some((d) => isOnDomain(liveUrl, d))) return;
  await supabaseAdmin
    .from("blogs")
    .update({
      published_url: liveUrl,
      published_url_source: "plugin",
      published_at: new Date().toISOString(),
    })
    .eq("id", blogId)
    .eq("site_id", scope.siteId)
    .eq("user_id", scope.userId)
    .is("published_url", null);
}

function describe(err: unknown): string {
  if (err instanceof WebflowApiError) return err.message;
  return err instanceof Error ? err.message : String(err);
}

/**
 * Publish one finished article. Never throws: autopilot calls this right
 * after writing an article, and a Webflow problem must not undo that.
 */
export async function publishArticle(scope: SiteScope, blogId: string): Promise<PublishOutcome> {
  let conn: ConnectionRow | null = null;
  try {
    conn = await loadConnection(scope);
    if (!isPublishing(conn)) return { result: "skipped", reason: "not_connected" };
    const token = await tokenFor(conn);
    return await publishWith(scope, conn, token, blogId);
  } catch (err) {
    const message = describe(err);
    if (conn && err instanceof WebflowApiError && err.revoked) {
      await forgetToken(conn, "Webflow access was removed. Reconnect Webflow to keep publishing.");
    } else if (conn) {
      await recordConnectionError(conn, message);
    }
    console.error("webflow publish failed", { blogId, message });
    return { result: "failed", error: message };
  }
}

/** The core, for callers that already hold a decrypted token (sync). Throws. */
export async function publishWith(
  scope: SiteScope,
  conn: ConnectionRow,
  token: string,
  blogId: string,
): Promise<PublishOutcome> {
  const collectionId = conn.collection_id!;
  // Taken before the article is read, and recorded as the push time. An edit
  // saved while this run is in flight is then still newer than the push, so
  // the next sync picks it up instead of losing it.
  const readAt = new Date().toISOString();
  const { data: blog, error } = await supabaseAdmin
    .from("blogs")
    .select(BLOG_COLUMNS)
    .eq("id", blogId)
    .eq("site_id", scope.siteId)
    .eq("user_id", scope.userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!blog || blog.status !== "finished") return { result: "skipped", reason: "not_finished" };

  const map = parseFieldMap(conn.field_map);
  const article = {
    id: blog.id,
    title: blog.title,
    slug: webflowSlug(blog.title, blog.id),
    description: blog.description,
    body_html: bodyHtmlForWebflow(blog.body),
    tags: blog.tags,
    // Set once, on create: a date that moved on every edit would make every
    // edit look like a new post.
    published_at: new Date().toISOString(),
  };

  const { data: ledger } = await supabaseAdmin
    .from("webflow_items")
    .select("*")
    .eq("connection_id", conn.id)
    .eq("collection_id", collectionId)
    .eq("blog_id", blog.id)
    .maybeSingle();

  if (ledger && (ledger.state === "pending" || ledger.state === "updating")) {
    // Another run holds this article right now, or one died holding it.
    // Give a live run time to finish before treating the lock as abandoned.
    if (Date.now() - Date.parse(ledger.locked_at ?? ledger.created_at) < STALE_LOCK_MS) {
      return { result: "skipped", reason: "in_progress" };
    }
    if (ledger.state === "pending") {
      // It died between asking Webflow and recording the answer, so the item
      // may exist. `create` looks for it before making another.
      await supabaseAdmin.from("webflow_items").delete().eq("id", ledger.id).eq("state", "pending");
      return create(scope, conn, token, article, map, readAt, true);
    }
    // It died mid-update: release the lease and carry on.
    const settled = ledger.is_draft ? "draft" : "published";
    await supabaseAdmin
      .from("webflow_items")
      .update({ state: settled, locked_at: null })
      .eq("id", ledger.id)
      .eq("state", "updating");
    return update(
      conn,
      token,
      { ...ledger, state: settled, locked_at: null },
      article,
      map,
      readAt,
    );
  }
  if (ledger) return update(conn, token, ledger, article, map, readAt);
  return create(scope, conn, token, article, map, readAt, false);
}

/** A create or update takes seconds; a lock older than this belongs to a run that died. */
const STALE_LOCK_MS = 10 * 60 * 1000;

/**
 * An item made this recently, with this slug and title, and not in the
 * ledger, is taken to be our own create whose answer was lost (a timeout, a
 * 5xx), not a post the user wrote. Adopting it is what stops a second copy.
 */
const ADOPT_WINDOW_MS = 30 * 60 * 1000;

type Article = Parameters<typeof toFieldData>[0];

/** What we hash: everything written except the date, which is create-only. */
function hashable(fieldData: Record<string, unknown>, dateField: string | null) {
  if (!dateField) return fieldData;
  const { [dateField]: _date, ...rest } = fieldData;
  return rest;
}

async function isOurLostItem(
  found: WebflowItem,
  conn: ConnectionRow,
  article: Article,
  recovering: boolean,
): Promise<boolean> {
  const name = String(found.fieldData?.name ?? "");
  if (name !== (article.title.trim() || "Untitled")) return false;
  const recent = !!found.createdOn && Date.now() - Date.parse(found.createdOn) < ADOPT_WINDOW_MS;
  // After a run died mid-create, age doesn't matter: the next run may be a day
  // later, and the dead run's item is exactly what we're looking for.
  if (!recent && !recovering) return false;
  const { data: tracked } = await supabaseAdmin
    .from("webflow_items")
    .select("id")
    .eq("connection_id", conn.id)
    .eq("collection_id", conn.collection_id!)
    .eq("item_id", found.id)
    .maybeSingle();
  return !tracked;
}

/**
 * Create the item, or adopt it when an earlier attempt made it but the answer
 * never came back. A slug taken by someone else's item gets -2, -3….
 */
async function createOrAdopt(
  token: string,
  conn: ConnectionRow,
  article: Article,
  map: ReturnType<typeof parseFieldMap>,
  live: boolean,
  recovering: boolean,
): Promise<{ item: WebflowItem; slug: string }> {
  const collectionId = conn.collection_id!;
  let slug = article.slug;
  for (let n = 1; ; n++) {
    try {
      const fieldData = toFieldData(article, map, slug, conn.summary_is_rich);
      return { item: await createItem(token, collectionId, fieldData, live), slug };
    } catch (err) {
      const conflict = isSlugConflict(err);
      if (!conflict && !mayHaveLanded(err)) throw err;
      const found = await findItemBySlug(token, collectionId, slug);
      if (found && (await isOurLostItem(found, conn, article, recovering))) {
        return { item: found, slug };
      }
      if (!conflict || n >= 5) throw err;
      slug = withSuffix(article.slug, n + 1);
    }
  }
}

async function create(
  scope: SiteScope,
  conn: ConnectionRow,
  token: string,
  article: Article,
  map: ReturnType<typeof parseFieldMap>,
  readAt: string,
  recovering: boolean,
): Promise<PublishOutcome> {
  const collectionId = conn.collection_id!;
  const live = conn.publish_mode === "live";

  // Claim the article first. The unique (connection, collection, blog) key
  // means autopilot and "Sync now" racing on one article can't both create
  // an item: the loser sees the claim and backs off.
  const { data: claim, error: claimError } = await supabaseAdmin
    .from("webflow_items")
    .insert({
      connection_id: conn.id,
      user_id: conn.user_id,
      blog_id: article.id,
      collection_id: collectionId,
      item_id: "",
      slug: article.slug,
      content_hash: "",
      state: "pending",
      locked_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (claimError) {
    if (claimError.code === "23505") return { result: "skipped", reason: "in_progress" };
    throw new Error(claimError.message);
  }

  let made;
  try {
    made = await createOrAdopt(token, conn, article, map, live, recovering);
  } catch (err) {
    await supabaseAdmin.from("webflow_items").delete().eq("id", claim.id);
    throw err;
  }
  const { item, slug } = made;
  // An adopted item may be a draft whatever the mode says now.
  const draft = item.isDraft ?? !live;

  const fieldData = toFieldData(article, map, slug, conn.summary_is_rich);
  const liveUrl = draft ? null : composeLiveUrl(conn.webflow_domain, conn.collection_slug, slug);
  const { error } = await supabaseAdmin
    .from("webflow_items")
    .update({
      item_id: item.id,
      slug,
      content_hash: contentHash(hashable(fieldData, map.publishedAt)),
      webflow_updated_at: item.lastUpdated ?? null,
      is_draft: draft,
      live_url: liveUrl,
      state: draft ? "draft" : "published",
      locked_at: null,
      pushed_at: readAt,
    })
    .eq("id", claim.id);
  // The item exists in Webflow either way. A lost ledger row would mean a
  // duplicate on the next sync, so this is worth failing loudly for.
  if (error) throw new Error(`Published to Webflow, but couldn't record it: ${error.message}`);

  await recordConnectionError(conn, null);
  await writeBackLiveUrl(scope, article.id, liveUrl);
  return { result: "created", itemId: item.id, liveUrl, draft };
}

async function update(
  conn: ConnectionRow,
  token: string,
  ledger: LedgerRow,
  article: Article,
  map: ReturnType<typeof parseFieldMap>,
  readAt: string,
): Promise<PublishOutcome> {
  if (ledger.state === "edited_in_webflow")
    return { result: "skipped", reason: "edited_in_webflow" };
  if (ledger.state === "deleted_in_webflow")
    return { result: "skipped", reason: "deleted_in_webflow" };

  // The slug stays what it was created with: changing it breaks the live URL.
  const fieldData = hashable(
    toFieldData(article, map, ledger.slug, conn.summary_is_rich),
    map.publishedAt,
  );
  const hash = contentHash(fieldData);
  if (hash === ledger.content_hash) {
    // The row changed but nothing we write did (a live URL write-back, notes,
    // the schedule). Move the mark so sync stops considering it.
    await supabaseAdmin.from("webflow_items").update({ pushed_at: readAt }).eq("id", ledger.id);
    return { result: "unchanged" };
  }

  // Lease the row. Without it, two overlapping runs (two quick "publish
  // changes", or one during "Sync now") would each see the other's write as
  // an edit made in Webflow and freeze the article.
  const settled = ledger.state;
  const { data: leased } = await supabaseAdmin
    .from("webflow_items")
    .update({ state: "updating", locked_at: new Date().toISOString() })
    .eq("id", ledger.id)
    .eq("state", settled)
    .select("id");
  if (!leased?.length) return { result: "skipped", reason: "in_progress" };

  const release = (patch: Partial<LedgerRow> = {}) =>
    supabaseAdmin
      .from("webflow_items")
      .update({ state: settled, locked_at: null, ...patch })
      .eq("id", ledger.id);

  try {
    let current;
    try {
      current = await getItem(token, ledger.collection_id, ledger.item_id);
    } catch (err) {
      if (!(err instanceof WebflowApiError && err.status === 404)) throw err;
      // A 404 is a deletion only if the collection itself is still in reach;
      // otherwise it's lost access (a reconnect without this site), and
      // this throws instead of marking a live item deleted.
      await getCollection(token, ledger.collection_id);
      // Deleted in Webflow. That's the user's call; don't bring it back.
      await release({ state: "deleted_in_webflow" });
      return { result: "skipped", reason: "deleted_in_webflow" };
    }

    if (
      ledger.webflow_updated_at &&
      current.lastUpdated &&
      current.lastUpdated !== ledger.webflow_updated_at
    ) {
      await release({ state: "edited_in_webflow" });
      return { result: "skipped", reason: "edited_in_webflow" };
    }

    const live = !current.isDraft;
    const item = await updateItem(token, ledger.collection_id, ledger.item_id, fieldData, live);
    await release({
      content_hash: hash,
      webflow_updated_at: item.lastUpdated ?? current.lastUpdated ?? null,
      is_draft: !live,
      pushed_at: readAt,
      last_error: null,
    });
    await recordConnectionError(conn, null);
    return { result: "updated", itemId: ledger.item_id };
  } catch (err) {
    await release();
    throw err;
  }
}

const PAGE = 1000;

/** Every row of a query, a page at a time: PostgREST stops at 1000 per request. */
export async function fetchAll<T>(
  page: (
    from: number,
    to: number,
  ) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

export interface SyncResult {
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
  failed: number;
  /** Articles not reached before the time budget ran out. Call again. */
  remaining: number;
  errors: string[];
}

/**
 * Publish every finished article that isn't in the collection yet, and update
 * ones changed since their last push. Stops at `budgetMs` so it fits inside a
 * single function invocation; the caller runs it again for the rest.
 */
export async function syncSite(scope: SiteScope, budgetMs = 45_000): Promise<SyncResult> {
  const started = Date.now();
  const result: SyncResult = {
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0,
    remaining: 0,
    errors: [],
  };

  const conn = await loadConnection(scope);
  if (!isPublishing(conn)) throw new Error("Connect Webflow and choose a collection first.");
  const token = await tokenFor(conn);

  const [blogs, ledger] = await Promise.all([
    fetchAll((from, to) =>
      supabaseAdmin
        .from("blogs")
        .select("id, updated_at")
        .eq("site_id", scope.siteId)
        .eq("user_id", scope.userId)
        .eq("status", "finished")
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to),
    ),
    fetchAll((from, to) =>
      supabaseAdmin
        .from("webflow_items")
        .select("blog_id, pushed_at, state")
        .eq("connection_id", conn.id)
        .eq("collection_id", conn.collection_id!)
        .order("id", { ascending: true })
        .range(from, to),
    ),
  ]);

  const pushed = new Map(ledger.map((l) => [l.blog_id, l]));
  const due = blogs.filter((b) => {
    const l = pushed.get(b.id);
    if (!l) return true;
    if (l.state === "edited_in_webflow" || l.state === "deleted_in_webflow") return false;
    // Locked: publishWith waits out a live lock and takes over a dead one.
    if (l.state === "pending" || l.state === "updating") return true;
    return b.updated_at > l.pushed_at;
  });

  for (let i = 0; i < due.length; i++) {
    if (Date.now() - started > budgetMs) {
      result.remaining = due.length - i;
      break;
    }
    try {
      const outcome = await publishWith(scope, conn, token, due[i].id);
      if (outcome.result === "created") result.created++;
      else if (outcome.result === "updated") result.updated++;
      else if (outcome.result === "unchanged") result.unchanged++;
      else result.skipped++;
    } catch (err) {
      if (err instanceof WebflowApiError && err.revoked) {
        await forgetToken(
          conn,
          "Webflow access was removed. Reconnect Webflow to keep publishing.",
        );
        throw new Error("Webflow access was removed. Reconnect Webflow to keep publishing.");
      }
      result.failed++;
      const message = describe(err);
      if (result.errors.length < 5 && !result.errors.includes(message)) result.errors.push(message);
      // Some errors fail every article the same way: stop early rather than
      // spend the rate limit proving it 200 times. An unpublished site is
      // certain from the first; a validation error after three in a row.
      if (
        err instanceof WebflowApiError &&
        (err.code === "site_not_published" || (err.status === 400 && result.failed >= 3))
      ) {
        result.remaining = due.length - i - 1;
        break;
      }
    }
  }

  await recordConnectionError(
    conn,
    result.failed && !result.created && !result.updated ? result.errors[0] : null,
  );
  return result;
}
