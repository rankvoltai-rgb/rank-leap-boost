/**
 * The Shopify publisher against an in-memory stand-in for Supabase and a
 * scripted Shopify. What matters here is behaviour at the edges: never a
 * duplicate post, never overwriting an edit made in Shopify, and tokens that
 * keep working (or are dropped cleanly) without the merchant.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown>;

const db: Record<string, Row[]> = {};
const UNIQUE: Record<string, string[]> = {
  shopify_articles: ["connection_id", "shopify_blog_id", "blog_id"],
};

class Query {
  private filters: ((r: Row) => boolean)[] = [];
  private op: "select" | "insert" | "update" | "delete" = "select";
  private payload: Row = {};
  private mode: "many" | "maybe" | "one" = "many";
  constructor(private table: string) {}
  select() {
    return this;
  }
  insert(row: Row) {
    this.op = "insert";
    this.payload = row;
    return this;
  }
  update(patch: Row) {
    this.op = "update";
    this.payload = patch;
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }
  eq(k: string, v: unknown) {
    this.filters.push((r) => r[k] === v);
    return this;
  }
  in(k: string, vs: unknown[]) {
    this.filters.push((r) => vs.includes(r[k]));
    return this;
  }
  is(k: string, v: unknown) {
    this.filters.push((r) => (r[k] ?? null) === v);
    return this;
  }
  order() {
    return this;
  }
  range() {
    return this;
  }
  maybeSingle() {
    this.mode = "maybe";
    return this.run();
  }
  single() {
    this.mode = "one";
    return this.run();
  }
  then<A, B>(ok?: (v: { data: unknown; error: unknown }) => A, bad?: (e: unknown) => B) {
    return this.run().then(ok, bad);
  }
  private async run(): Promise<{ data: unknown; error: unknown }> {
    const rows = (db[this.table] ??= []);
    const match = (r: Row) => this.filters.every((f) => f(r));
    if (this.op === "insert") {
      const keys = UNIQUE[this.table];
      if (keys && rows.some((r) => keys.every((k) => r[k] === this.payload[k]))) {
        return { data: null, error: { code: "23505", message: "duplicate key" } };
      }
      const row = {
        id: `row-${rows.length + 1}-${Math.random()}`,
        created_at: new Date().toISOString(),
        ...this.payload,
      };
      rows.push(row);
      return { data: row, error: null };
    }
    if (this.op === "update") {
      const hit = rows.filter(match);
      for (const r of hit) Object.assign(r, this.payload);
      return { data: this.mode === "many" ? hit : (hit[0] ?? null), error: null };
    }
    if (this.op === "delete") {
      db[this.table] = rows.filter((r) => !match(r));
      return { data: null, error: null };
    }
    const hit = rows.filter(match);
    return { data: this.mode === "many" ? hit : (hit[0] ?? null), error: null };
  }
}

vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: { from: (t: string) => new Query(t) },
}));

const { publishArticle, syncSite } = await import("./publish.server");
const { encryptToken, decryptToken } = await import("@/lib/webflow/crypto");
const { REOPEN_APP } = await import("./api.server");

const KEY = "q2Vz0bJx8m1K1bq3oZ7m0q6oQm3Yy5r3vM9pX7m1c2E=";
const PURPOSE = "rankbox/shopify/token/v1";
const SHOP = "fernwood.myshopify.com";
const BLOG = "gid://shopify/Blog/7";
const scope = { userId: "user-1", siteId: "site-1" };
const ARTICLE_ID = "0f3c2a9e-1111-2222-3333-444455556666";
const inAnHour = () => new Date(Date.now() + 3600_000).toISOString();

/** Scripted Shopify: each call is matched in order against `routes`. */
type Call = { kind: string; body: Row };
let calls: Call[] = [];
let routes: ((call: Call) => Response | undefined)[] = [];

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Which operation a request is, from its URL and query text. */
function kindOf(url: string, body: Row): string {
  if (url.endsWith("/admin/oauth/access_token")) return `token:${body.grant_type}`;
  const q = String(body.query ?? "");
  if (q.includes("articleCreate")) return "create";
  if (q.includes("articleUpdate")) return "update";
  if (q.includes("articles(")) return "find";
  if (q.includes("article(id")) return "article";
  if (q.includes("blog(id")) return "blog";
  return "other";
}

const post = (overrides: Row = {}) => ({
  id: "gid://shopify/Article/100",
  title: "What Is Cold Brew?",
  handle: "what-is-cold-brew",
  createdAt: new Date().toISOString(),
  updatedAt: "2026-09-28T10:00:01Z",
  isPublished: true,
  blog: { id: BLOG },
  ...overrides,
});

const creates =
  (article: Row = post()) =>
  (c: Call) =>
    c.kind === "create"
      ? json(200, { data: { articleCreate: { article, userErrors: [] } } })
      : undefined;

async function seed(overrides: Row = {}) {
  db.shopify_connections = [
    {
      id: "conn-1",
      shop: SHOP,
      user_id: "user-1",
      site_id: "site-1",
      access_token_enc: await encryptToken("shpat_live", KEY, PURPOSE),
      access_expires_at: inAnHour(),
      refresh_token_enc: await encryptToken("refresh-1", KEY, PURPOSE),
      refresh_expires_at: new Date(Date.now() + 80 * 86400_000).toISOString(),
      shop_domain: "fernwoodcoffee.com",
      shopify_blog_id: BLOG,
      shopify_blog_handle: "news",
      publish_visible: true,
      author: "Fernwood Team",
      status: "active",
      last_error: null,
      ...overrides,
    },
  ];
  db.blogs = [
    {
      id: ARTICLE_ID,
      user_id: "user-1",
      site_id: "site-1",
      title: "What Is Cold Brew?",
      description: "A plain answer.",
      body: "# What Is Cold Brew?\n\nBody text.",
      tags: ["coffee"],
      status: "finished",
      published_url: null,
      updated_at: "2026-09-28T10:00:00.000Z",
    },
  ];
  db.shopify_articles = [];
  db.profiles = [{ id: "site-1", user_id: "user-1", website_url: "https://fernwoodcoffee.com" }];
  db.exchange_sites = [];
}

beforeEach(async () => {
  process.env.SHOPIFY_API_KEY = "client-id";
  process.env.SHOPIFY_API_SECRET = "secret";
  process.env.INTEGRATIONS_ENCRYPTION_KEY = KEY;
  calls = [];
  routes = [];
  vi.stubGlobal("fetch", async (url: string, init: RequestInit = {}) => {
    const body = init.body ? (JSON.parse(String(init.body)) as Row) : {};
    const call = { kind: kindOf(url, body), body };
    calls.push(call);
    for (const route of routes) {
      const res = route(call);
      if (res) return res;
    }
    throw new Error(`unscripted Shopify call: ${call.kind}`);
  });
  vi.spyOn(console, "error").mockImplementation(() => {});
  await seed();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const conn = () => db.shopify_connections[0];
const kinds = () => calls.map((c) => c.kind);

describe("creating", () => {
  it("creates a visible post, records it, and reports the live URL", async () => {
    routes.push(creates());
    const out = await publishArticle(scope, ARTICLE_ID);

    expect(out).toEqual({
      result: "created",
      articleId: "gid://shopify/Article/100",
      liveUrl: "https://fernwoodcoffee.com/blogs/news/what-is-cold-brew",
      visible: true,
    });
    const sent = (calls[0].body.variables as { article: Row }).article;
    expect(sent).toMatchObject({
      blogId: BLOG,
      title: "What Is Cold Brew?",
      handle: "what-is-cold-brew",
      summary: "<p>A plain answer.</p>",
      tags: ["coffee"],
      author: { name: "Fernwood Team" },
      isPublished: true,
    });
    // The body's own H1 is dropped: the theme already shows the title.
    expect(sent.body).toBe("<p>Body text.</p>");
    expect(db.shopify_articles[0]).toMatchObject({
      shopify_article_id: "gid://shopify/Article/100",
      handle: "what-is-cold-brew",
      state: "published",
    });
    expect(db.blogs[0].published_url).toBe(
      "https://fernwoodcoffee.com/blogs/news/what-is-cold-brew",
    );
    expect(conn()).toMatchObject({ status: "active", last_error: null });
  });

  it("adds hidden posts unpublished, with no live URL", async () => {
    await seed({ publish_visible: false });
    routes.push(creates(post({ isPublished: false })));
    const out = await publishArticle(scope, ARTICLE_ID);
    expect(out).toMatchObject({ result: "created", visible: false, liveUrl: null });
    expect((calls[0].body.variables as { article: Row }).article.isPublished).toBe(false);
    expect(db.shopify_articles[0].state).toBe("hidden");
    expect(db.blogs[0].published_url).toBeNull();
  });

  it("doesn't report a myshopify.com URL as the article's home", async () => {
    await seed({ shop_domain: SHOP });
    routes.push(creates());
    await publishArticle(scope, ARTICLE_ID);
    expect(db.blogs[0].published_url).toBeNull();
  });

  it("keeps the handle Shopify actually gave the post", async () => {
    routes.push(creates(post({ handle: "what-is-cold-brew-1" })));
    await publishArticle(scope, ARTICLE_ID);
    expect(db.shopify_articles[0].handle).toBe("what-is-cold-brew-1");
  });

  it("adopts its own post when the create's answer was lost, instead of making a second", async () => {
    let created = 0;
    routes.push((c) => {
      if (c.kind !== "create") return undefined;
      created++;
      return json(502, {});
    });
    routes.push((c) =>
      c.kind === "find" ? json(200, { data: { articles: { nodes: [post()] } } }) : undefined,
    );

    const out = await publishArticle(scope, ARTICLE_ID);
    expect(out).toMatchObject({ result: "created", articleId: "gid://shopify/Article/100" });
    // A create is never retried blind after a 5xx.
    expect(created).toBe(1);
    expect(db.shopify_articles).toHaveLength(1);
  });

  it("moves to -2 when another post has the handle", async () => {
    const handles: string[] = [];
    routes.push((c) => {
      if (c.kind !== "create") return undefined;
      const handle = (c.body.variables as { article: Row }).article.handle as string;
      handles.push(handle);
      return handles.length === 1
        ? json(200, {
            data: {
              articleCreate: {
                article: null,
                userErrors: [
                  {
                    field: ["article", "handle"],
                    message: "Handle has already been taken",
                    code: "TAKEN",
                  },
                ],
              },
            },
          })
        : json(200, { data: { articleCreate: { article: post({ handle }), userErrors: [] } } });
    });
    // The post holding the handle is the merchant's own, from long ago.
    routes.push((c) =>
      c.kind === "find"
        ? json(200, {
            data: {
              articles: {
                nodes: [
                  post({
                    id: "gid://shopify/Article/1",
                    title: "Our Story",
                    createdAt: "2025-01-01T00:00:00Z",
                  }),
                ],
              },
            },
          })
        : undefined,
    );
    await publishArticle(scope, ARTICLE_ID);
    expect(handles).toEqual(["what-is-cold-brew", "what-is-cold-brew-2"]);
    expect(db.shopify_articles[0].handle).toBe("what-is-cold-brew-2");
  });

  it("does nothing for a site whose store hasn't picked a blog", async () => {
    await seed({ shopify_blog_id: null, status: "setup" });
    expect(await publishArticle(scope, ARTICLE_ID)).toEqual({
      result: "skipped",
      reason: "not_connected",
    });
    expect(calls).toHaveLength(0);
  });
});

describe("updating", () => {
  async function published() {
    routes.push(creates());
    await publishArticle(scope, ARTICLE_ID);
    calls = [];
    routes = [];
  }

  it("leaves an unchanged article alone", async () => {
    await published();
    expect(await publishArticle(scope, ARTICLE_ID)).toEqual({ result: "unchanged" });
    expect(calls).toHaveLength(0);
  });

  it("updates a changed article, without touching its handle or visibility", async () => {
    await published();
    db.blogs[0].body = "# What Is Cold Brew?\n\nBetter body.";
    routes.push((c) =>
      c.kind === "article" ? json(200, { data: { article: post() } }) : undefined,
    );
    routes.push((c) =>
      c.kind === "update"
        ? json(200, {
            data: {
              articleUpdate: {
                article: post({ updatedAt: "2026-09-28T11:00:00Z" }),
                userErrors: [],
              },
            },
          })
        : undefined,
    );
    expect(await publishArticle(scope, ARTICLE_ID)).toMatchObject({ result: "updated" });
    const sent = (calls[1].body.variables as { article: Row }).article;
    expect(sent.body).toBe("<p>Better body.</p>");
    expect(sent).not.toHaveProperty("handle");
    expect(sent).not.toHaveProperty("isPublished");
    expect(sent).not.toHaveProperty("author");
    expect(db.shopify_articles[0]).toMatchObject({
      state: "published",
      shopify_updated_at: "2026-09-28T11:00:00Z",
      locked_at: null,
    });
  });

  it("never overwrites a post the merchant edited in Shopify", async () => {
    await published();
    db.blogs[0].body = "Changed in Rankbox.";
    routes.push((c) =>
      c.kind === "article"
        ? json(200, { data: { article: post({ updatedAt: "2026-09-28T12:34:00Z" }) } })
        : undefined,
    );
    expect(await publishArticle(scope, ARTICLE_ID)).toEqual({
      result: "skipped",
      reason: "edited_in_shopify",
    });
    expect(kinds()).not.toContain("update");
    expect(db.shopify_articles[0].state).toBe("edited_in_shopify");
  });

  it("doesn't bring back a post the merchant deleted", async () => {
    await published();
    db.blogs[0].body = "Changed in Rankbox.";
    routes.push((c) => (c.kind === "article" ? json(200, { data: { article: null } }) : undefined));
    routes.push((c) =>
      c.kind === "blog"
        ? json(200, { data: { blog: { id: BLOG, title: "News", handle: "news" } } })
        : undefined,
    );
    expect(await publishArticle(scope, ARTICLE_ID)).toEqual({
      result: "skipped",
      reason: "deleted_in_shopify",
    });
    expect(db.shopify_articles[0].state).toBe("deleted_in_shopify");
  });

  it("reports a deleted blog as a setup problem, not a deleted post", async () => {
    await published();
    db.blogs[0].body = "Changed in Rankbox.";
    routes.push((c) => (c.kind === "article" ? json(200, { data: { article: null } }) : undefined));
    routes.push((c) => (c.kind === "blog" ? json(200, { data: { blog: null } }) : undefined));
    const out = await publishArticle(scope, ARTICLE_ID);
    expect(out).toMatchObject({ result: "failed" });
    expect(db.shopify_articles[0].state).toBe("published");
    expect(conn().status).toBe("error");
    expect(conn().last_error).toMatch(/blog .* no longer exists/);
  });
});

describe("tokens", () => {
  const refreshes =
    (access = "shpat_new", refresh = "refresh-2") =>
    (c: Call) =>
      c.kind === "token:refresh_token"
        ? json(200, {
            access_token: access,
            expires_in: 3600,
            refresh_token: refresh,
            refresh_token_expires_in: 7776000,
            scope: "write_content",
          })
        : undefined;

  it("refreshes an expired access token and stores both new tokens encrypted", async () => {
    await seed({ access_expires_at: new Date(Date.now() - 1000).toISOString() });
    routes.push(refreshes(), creates());
    expect(await publishArticle(scope, ARTICLE_ID)).toMatchObject({ result: "created" });
    expect(calls[0].body).toMatchObject({
      grant_type: "refresh_token",
      refresh_token: "refresh-1",
    });
    expect(await decryptToken(conn().access_token_enc as string, KEY, PURPOSE)).toBe("shpat_new");
    expect(await decryptToken(conn().refresh_token_enc as string, KEY, PURPOSE)).toBe("refresh-2");
  });

  it("refreshes once and retries when Shopify retired the token (401)", async () => {
    let creates401 = true;
    routes.push(refreshes());
    routes.push((c) => {
      if (c.kind !== "create") return undefined;
      if (creates401) {
        creates401 = false;
        return json(401, {});
      }
      return json(200, { data: { articleCreate: { article: post(), userErrors: [] } } });
    });
    expect(await publishArticle(scope, ARTICLE_ID)).toMatchObject({ result: "created" });
    expect(kinds()).toEqual(["create", "token:refresh_token", "create"]);
    expect(db.shopify_articles).toHaveLength(1);
  });

  it("drops tokens Shopify refuses, and says to open the app", async () => {
    await seed({ access_expires_at: new Date(Date.now() - 1000).toISOString() });
    routes.push((c) =>
      c.kind === "token:refresh_token" ? json(400, { error: "invalid_grant" }) : undefined,
    );
    expect(await publishArticle(scope, ARTICLE_ID)).toEqual({
      result: "failed",
      error: REOPEN_APP,
    });
    expect(conn()).toMatchObject({
      access_token_enc: null,
      refresh_token_enc: null,
      status: "error",
      last_error: REOPEN_APP,
    });
  });
});

describe("syncSite", () => {
  it("publishes what's missing and skips posts edited in Shopify", async () => {
    db.blogs.push({
      ...db.blogs[0],
      id: "11111111-2222-3333-4444-555555555555",
      title: "Cold Brew Ratios",
    });
    db.shopify_articles.push({
      id: "led-1",
      connection_id: "conn-1",
      blog_id: "11111111-2222-3333-4444-555555555555",
      shopify_blog_id: BLOG,
      shopify_article_id: "gid://shopify/Article/5",
      handle: "cold-brew-ratios",
      content_hash: "x",
      state: "edited_in_shopify",
      pushed_at: "2026-09-01T00:00:00.000Z",
    });
    routes.push(creates());
    const result = await syncSite(scope);
    expect(result).toMatchObject({ created: 1, failed: 0, remaining: 0 });
    expect(kinds()).toEqual(["create"]);
  });
});
