/**
 * Pushing finished articles into a store's Shopify blog.
 *
 * Called from the same three places as the Webflow publisher, all server-side:
 * autopilot right after it writes an article, the dashboard after a manual
 * "write now" or editor publish, and "Publish missing articles" in the app.
 * Every path goes through `publishArticle`, which is idempotent: the ledger
 * (shopify_articles) records what each article became, and an unchanged
 * article is never rewritten.
 *
 * An article the merchant edited or deleted in Shopify is left alone: the
 * store is the source of truth once a post is there.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";
import type { SiteScope } from "@/lib/entitlement.server";
import { fetchAll, writeBackLiveUrl } from "@/lib/webflow/publish.server";
import {
  ShopifyApiError,
  createArticle,
  findArticleByHandle,
  getArticle,
  getBlog,
  isHandleTaken,
  mayHaveLanded,
  shopifyConfig,
  updateArticle,
  type ShopifyArticle,
} from "./api.server";
import { bodyHtmlForShopify } from "./body";
import {
  composeLiveUrl,
  hashArticle,
  shopifyHandle,
  toCreateInput,
  toUpdateInput,
  withSuffix,
  contentHash,
  type ArticleForShopify,
} from "./mapping";
import { withAccessToken, type ShopifyConnection } from "./tokens.server";

type LedgerRow = Tables<"shopify_articles">;

export type PublishOutcome =
  | { result: "created"; articleId: string; liveUrl: string | null; visible: boolean }
  | { result: "updated"; articleId: string }
  | { result: "unchanged" }
  | {
      result: "skipped";
      reason:
        | "not_connected"
        | "not_finished"
        | "in_progress"
        | "edited_in_shopify"
        | "deleted_in_shopify";
    }
  | { result: "failed"; error: string };

const BLOG_COLUMNS = "id, title, description, body, tags, status";

export async function loadConnectionForSite(scope: SiteScope): Promise<ShopifyConnection | null> {
  const { data, error } = await supabaseAdmin
    .from("shopify_connections")
    .select("*")
    .eq("site_id", scope.siteId)
    .eq("user_id", scope.userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

/** Ready to publish: linked to a site, holding tokens, and a blog is picked. */
export function isPublishing(conn: ShopifyConnection | null): conn is ShopifyConnection {
  return (
    !!conn &&
    !!conn.site_id &&
    !!conn.shopify_blog_id &&
    (!!conn.access_token_enc || !!conn.refresh_token_enc) &&
    (conn.status === "active" || conn.status === "error")
  );
}

/** Only an active or failing connection moves between the two; setup and uninstalled stay put. */
async function recordConnectionError(conn: ShopifyConnection, message: string | null) {
  await supabaseAdmin
    .from("shopify_connections")
    .update(
      message
        ? { status: "error", last_error: message }
        : { status: "active", last_error: null, last_published_at: new Date().toISOString() },
    )
    .eq("id", conn.id)
    .in("status", ["active", "error"]);
}

function describe(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/**
 * Publish one finished article. Never throws: autopilot calls this right
 * after writing an article, and a Shopify problem must not undo that.
 */
export async function publishArticle(scope: SiteScope, blogId: string): Promise<PublishOutcome> {
  let conn: ShopifyConnection | null = null;
  try {
    conn = await loadConnectionForSite(scope);
    if (!isPublishing(conn)) return { result: "skipped", reason: "not_connected" };
    const linked = conn;
    return await withAccessToken(linked, shopifyConfig(), (token) =>
      publishWith(scope, linked, token, blogId),
    );
  } catch (err) {
    const message = describe(err);
    if (conn) await recordConnectionError(conn, message);
    console.error("shopify publish failed", { blogId, message });
    return { result: "failed", error: message };
  }
}

/** The core, for callers that already hold a token (sync). Throws. */
export async function publishWith(
  scope: SiteScope,
  conn: ShopifyConnection,
  token: string,
  blogId: string,
): Promise<PublishOutcome> {
  const shopifyBlogId = conn.shopify_blog_id!;
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

  const article: ArticleForShopify = {
    id: blog.id,
    title: blog.title,
    description: blog.description,
    body_html: bodyHtmlForShopify(blog.body),
    tags: blog.tags,
  };

  const { data: ledger } = await supabaseAdmin
    .from("shopify_articles")
    .select("*")
    .eq("connection_id", conn.id)
    .eq("shopify_blog_id", shopifyBlogId)
    .eq("blog_id", blog.id)
    .maybeSingle();

  if (ledger && (ledger.state === "pending" || ledger.state === "updating")) {
    // Another run holds this article right now, or one died holding it.
    // Give a live run time to finish before treating the lock as abandoned.
    if (Date.now() - Date.parse(ledger.locked_at ?? ledger.created_at) < STALE_LOCK_MS) {
      return { result: "skipped", reason: "in_progress" };
    }
    if (ledger.state === "pending") {
      // It died between asking Shopify and recording the answer, so the
      // article may exist. `create` looks for it before making another.
      await supabaseAdmin
        .from("shopify_articles")
        .delete()
        .eq("id", ledger.id)
        .eq("state", "pending");
      return create(scope, conn, token, article, readAt, true);
    }
    // It died mid-update: release the lease and carry on.
    const settled = ledger.is_published ? "published" : "hidden";
    await supabaseAdmin
      .from("shopify_articles")
      .update({ state: settled, locked_at: null })
      .eq("id", ledger.id)
      .eq("state", "updating");
    return update(conn, token, { ...ledger, state: settled, locked_at: null }, article, readAt);
  }
  if (ledger) return update(conn, token, ledger, article, readAt);
  return create(scope, conn, token, article, readAt, false);
}

/** A create or update takes seconds; a lock older than this belongs to a run that died. */
const STALE_LOCK_MS = 10 * 60 * 1000;

/**
 * An article made this recently, with this handle and title, and not in the
 * ledger, is taken to be our own create whose answer was lost (a timeout, a
 * 5xx), not a post the merchant wrote. Adopting it is what stops a second copy.
 */
const ADOPT_WINDOW_MS = 30 * 60 * 1000;

async function isOurLostArticle(
  found: ShopifyArticle,
  conn: ShopifyConnection,
  article: ArticleForShopify,
  recovering: boolean,
): Promise<boolean> {
  if ((found.title ?? "") !== (article.title.trim() || "Untitled")) return false;
  const recent = !!found.createdAt && Date.now() - Date.parse(found.createdAt) < ADOPT_WINDOW_MS;
  // After a run died mid-create, age doesn't matter: the next run may be a day
  // later, and the dead run's article is exactly what we're looking for.
  if (!recent && !recovering) return false;
  const { data: tracked } = await supabaseAdmin
    .from("shopify_articles")
    .select("id")
    .eq("connection_id", conn.id)
    .eq("shopify_article_id", found.id)
    .maybeSingle();
  return !tracked;
}

/**
 * Create the article, or adopt it when an earlier attempt made it but the
 * answer never came back. A handle another post already has gets -2, -3….
 */
async function createOrAdopt(
  token: string,
  conn: ShopifyConnection,
  article: ArticleForShopify,
  recovering: boolean,
): Promise<ShopifyArticle> {
  const blogId = conn.shopify_blog_id!;
  const base = shopifyHandle(article.title, article.id);
  let handle = base;
  for (let n = 1; ; n++) {
    try {
      return await createArticle(
        conn.shop,
        token,
        toCreateInput(article, {
          blogId,
          handle,
          author: conn.author ?? "",
          visible: conn.publish_visible,
        }),
      );
    } catch (err) {
      const taken = isHandleTaken(err);
      if (!taken && !mayHaveLanded(err)) throw err;
      const found = await findArticleByHandle(conn.shop, token, blogId, handle);
      if (found && (await isOurLostArticle(found, conn, article, recovering))) return found;
      if (!taken || n >= 5) throw err;
      handle = withSuffix(base, n + 1);
    }
  }
}

async function create(
  scope: SiteScope,
  conn: ShopifyConnection,
  token: string,
  article: ArticleForShopify,
  readAt: string,
  recovering: boolean,
): Promise<PublishOutcome> {
  const shopifyBlogId = conn.shopify_blog_id!;

  // Claim the article first. The unique (connection, blog, article) key means
  // autopilot and a sync racing on one article can't both create a post: the
  // loser sees the claim and backs off.
  const { data: claim, error: claimError } = await supabaseAdmin
    .from("shopify_articles")
    .insert({
      connection_id: conn.id,
      blog_id: article.id,
      shopify_blog_id: shopifyBlogId,
      shopify_article_id: "",
      handle: shopifyHandle(article.title, article.id),
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

  let made: ShopifyArticle;
  try {
    made = await createOrAdopt(token, conn, article, recovering);
  } catch (err) {
    await supabaseAdmin.from("shopify_articles").delete().eq("id", claim.id);
    throw err;
  }

  const visible = made.isPublished;
  const liveUrl = visible
    ? composeLiveUrl(conn.shop_domain, conn.shopify_blog_handle, made.handle)
    : null;
  const { error } = await supabaseAdmin
    .from("shopify_articles")
    .update({
      shopify_article_id: made.id,
      // What Shopify kept, which may differ from what we asked for.
      handle: made.handle,
      content_hash: hashArticle(article),
      shopify_updated_at: made.updatedAt ?? null,
      is_published: visible,
      live_url: liveUrl,
      state: visible ? "published" : "hidden",
      locked_at: null,
      pushed_at: readAt,
    })
    .eq("id", claim.id);
  // The post exists in Shopify either way. A lost ledger row would mean a
  // duplicate on the next sync, so this is worth failing loudly for.
  if (error) throw new Error(`Published to Shopify, but couldn't record it: ${error.message}`);

  await recordConnectionError(conn, null);
  await writeBackLiveUrl(scope, article.id, liveUrl);
  return { result: "created", articleId: made.id, liveUrl, visible };
}

async function update(
  conn: ShopifyConnection,
  token: string,
  ledger: LedgerRow,
  article: ArticleForShopify,
  readAt: string,
): Promise<PublishOutcome> {
  if (ledger.state === "edited_in_shopify")
    return { result: "skipped", reason: "edited_in_shopify" };
  if (ledger.state === "deleted_in_shopify")
    return { result: "skipped", reason: "deleted_in_shopify" };

  // The handle stays what it was created with: changing it breaks the live URL.
  const input = toUpdateInput(article);
  const hash = contentHash(input);
  if (hash === ledger.content_hash) {
    // The row changed but nothing we write did (a live URL write-back, notes,
    // the schedule). Move the mark so sync stops considering it.
    await supabaseAdmin.from("shopify_articles").update({ pushed_at: readAt }).eq("id", ledger.id);
    return { result: "unchanged" };
  }

  // Lease the row. Without it, two overlapping runs would each see the
  // other's write as an edit made in Shopify and freeze the article.
  const settled = ledger.state;
  const { data: leased } = await supabaseAdmin
    .from("shopify_articles")
    .update({ state: "updating", locked_at: new Date().toISOString() })
    .eq("id", ledger.id)
    .eq("state", settled)
    .select("id");
  if (!leased?.length) return { result: "skipped", reason: "in_progress" };

  const release = (patch: Partial<LedgerRow> = {}) =>
    supabaseAdmin
      .from("shopify_articles")
      .update({ state: settled, locked_at: null, ...patch })
      .eq("id", ledger.id);

  try {
    const current = await getArticle(conn.shop, token, ledger.shopify_article_id);
    if (!current) {
      // Gone is a deletion only if the blog itself is still there; a missing
      // blog is a setup problem to report, not a post to forget.
      if (!(await getBlog(conn.shop, token, ledger.shopify_blog_id))) {
        throw new ShopifyApiError(
          404,
          "The Shopify blog Rankbox publishes to no longer exists. Pick another blog in the Rankbox app in Shopify.",
          "blog_missing",
        );
      }
      await release({ state: "deleted_in_shopify" });
      return { result: "skipped", reason: "deleted_in_shopify" };
    }

    if (
      ledger.shopify_updated_at &&
      current.updatedAt &&
      current.updatedAt !== ledger.shopify_updated_at
    ) {
      await release({ state: "edited_in_shopify" });
      return { result: "skipped", reason: "edited_in_shopify" };
    }

    const updated = await updateArticle(conn.shop, token, ledger.shopify_article_id, input);
    await release({
      content_hash: hash,
      shopify_updated_at: updated.updatedAt ?? current.updatedAt ?? null,
      is_published: updated.isPublished,
      pushed_at: readAt,
      last_error: null,
    });
    await recordConnectionError(conn, null);
    return { result: "updated", articleId: ledger.shopify_article_id };
  } catch (err) {
    await release();
    throw err;
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

/** Failures every later article would hit the same way: stop at the first. */
function failsEverything(err: unknown): boolean {
  return (
    err instanceof ShopifyApiError &&
    ([402, 403, 404, 423].includes(err.status) || err.code === "blog_missing")
  );
}

/**
 * Publish every finished article that isn't in the blog yet, and update ones
 * changed since their last push. Stops at `budgetMs` so it fits inside a
 * single function invocation; the caller runs it again for the rest.
 */
export async function syncSite(scope: SiteScope, budgetMs = 40_000): Promise<SyncResult> {
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

  const conn = await loadConnectionForSite(scope);
  if (!isPublishing(conn)) {
    throw new ShopifyApiError(409, "Pick a blog and start publishing first.");
  }
  const shopifyBlogId = conn.shopify_blog_id!;

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
        .from("shopify_articles")
        .select("blog_id, pushed_at, state")
        .eq("connection_id", conn.id)
        .eq("shopify_blog_id", shopifyBlogId)
        .order("id", { ascending: true })
        .range(from, to),
    ),
  ]);

  const pushed = new Map(ledger.map((l) => [l.blog_id, l]));
  const due = blogs.filter((b) => {
    const l = pushed.get(b.id);
    if (!l) return true;
    if (l.state === "edited_in_shopify" || l.state === "deleted_in_shopify") return false;
    // Locked: publishWith waits out a live lock and takes over a dead one.
    if (l.state === "pending" || l.state === "updating") return true;
    return b.updated_at > l.pushed_at;
  });

  if (due.length) {
    await withAccessToken(conn, shopifyConfig(), async (token) => {
      for (let i = 0; i < due.length; i++) {
        if (Date.now() - started > budgetMs) {
          result.remaining = due.length - i;
          return;
        }
        try {
          const outcome = await publishWith(scope, conn, token, due[i].id);
          if (outcome.result === "created") result.created++;
          else if (outcome.result === "updated") result.updated++;
          else if (outcome.result === "unchanged") result.unchanged++;
          else result.skipped++;
        } catch (err) {
          // A retired token: let withAccessToken refresh and run the rest.
          if (err instanceof ShopifyApiError && err.unauthorized) {
            due.splice(0, i);
            throw err;
          }
          result.failed++;
          const message = describe(err);
          if (result.errors.length < 5 && !result.errors.includes(message))
            result.errors.push(message);
          // Validation errors: three in a row and it's the setup, not the article.
          if (
            failsEverything(err) ||
            (err instanceof ShopifyApiError && err.status === 422 && result.failed >= 3)
          ) {
            result.remaining = due.length - i - 1;
            return;
          }
        }
      }
    });
  }

  if (result.failed && !result.created && !result.updated) {
    await recordConnectionError(conn, result.errors[0]);
  } else if (!result.failed) {
    // Nothing failed. Clear an old error without claiming a new publish.
    await supabaseAdmin
      .from("shopify_connections")
      .update({ status: "active", last_error: null })
      .eq("id", conn.id)
      .eq("status", "error");
  }
  return result;
}
