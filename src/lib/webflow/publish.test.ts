/**
 * The publisher against an in-memory stand-in for Supabase and a scripted
 * Webflow API. What matters here is behaviour at the edges: never a duplicate
 * item, never overwriting an edit made in Webflow, and a revoked token deleted.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown>;

const db: Record<string, Row[]> = {};
const UNIQUE: Record<string, string[]> = {
  webflow_items: ["connection_id", "collection_id", "blog_id"],
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
const { encryptToken } = await import("./crypto");

const KEY = "q2Vz0bJx8m1K1bq3oZ7m0q6oQm3Yy5r3vM9pX7m1c2E=";
const scope = { userId: "user-1", siteId: "site-1" };
const BLOG_ID = "0f3c2a9e-1111-2222-3333-444455556666";

/** Scripted Webflow: each call is matched in order against `routes`. */
let calls: { method: string; path: string; body: unknown }[] = [];
let routes: ((method: string, path: string, body: Row) => Response | undefined)[] = [];

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function seed(overrides: Row = {}) {
  db.webflow_connections = [
    {
      id: "conn-1",
      user_id: "user-1",
      site_id: "site-1",
      access_token_enc: await encryptToken("wf-token", KEY),
      webflow_site_id: "wf-site",
      webflow_domain: "loomwise.io",
      collection_id: "coll-1",
      collection_slug: "blog",
      field_map: { body: "post-body", summary: "post-summary", tags: null, publishedAt: null },
      summary_is_rich: false,
      publish_mode: "live",
      status: "active",
      ...overrides,
    },
  ];
  db.blogs = [
    {
      id: BLOG_ID,
      user_id: "user-1",
      site_id: "site-1",
      title: "What Is a Design System?",
      description: "A plain answer.",
      body: "# What Is a Design System?\n\nBody text.",
      tags: ["design"],
      status: "finished",
      published_url: null,
      updated_at: "2026-09-27T10:00:00.000Z",
    },
  ];
  db.webflow_items = [];
  db.profiles = [{ id: "site-1", user_id: "user-1", website_url: "https://loomwise.io" }];
  db.exchange_sites = [];
}

beforeEach(async () => {
  process.env.WEBFLOW_CLIENT_ID = "client";
  process.env.WEBFLOW_CLIENT_SECRET = "secret";
  process.env.INTEGRATIONS_ENCRYPTION_KEY = KEY;
  calls = [];
  routes = [];
  vi.stubGlobal("fetch", async (url: string, init: RequestInit = {}) => {
    const method = init.method ?? "GET";
    const path = new URL(url).pathname.replace(/^\/v2/, "");
    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ method, path, body });
    for (const route of routes) {
      const res = route(method, path, body);
      if (res) return res;
    }
    throw new Error(`unscripted Webflow call: ${method} ${path}`);
  });
  vi.spyOn(console, "error").mockImplementation(() => {});
  await seed();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const createsLive =
  (id = "item-1") =>
  (m: string, p: string) =>
    m === "POST" && p === "/collections/coll-1/items/live"
      ? json(202, { id, lastUpdated: "2026-09-27T10:00:01.000Z" })
      : undefined;

describe("creating", () => {
  it("creates a live item, records it, and reports the live URL", async () => {
    routes.push(createsLive());
    const out = await publishArticle(scope, BLOG_ID);

    expect(out).toEqual({
      result: "created",
      itemId: "item-1",
      liveUrl: "https://loomwise.io/blog/what-is-a-design-system",
      draft: false,
    });
    const sent = calls[0].body as { isDraft: boolean; fieldData: Row };
    expect(sent.isDraft).toBe(false);
    expect(sent.fieldData).toMatchObject({
      name: "What Is a Design System?",
      slug: "what-is-a-design-system",
      "post-summary": "A plain answer.",
    });
    // The body's own H1 is dropped: the template already shows the title.
    expect(sent.fieldData["post-body"]).toBe("<p>Body text.</p>");

    expect(db.webflow_items).toHaveLength(1);
    expect(db.webflow_items[0]).toMatchObject({ item_id: "item-1", state: "published" });
    expect(db.blogs[0].published_url).toBe("https://loomwise.io/blog/what-is-a-design-system");
  });

  it("saves drafts to the staged endpoint and reports no live URL", async () => {
    await seed({ publish_mode: "draft" });
    routes.push((m, p) =>
      m === "POST" && p === "/collections/coll-1/items" ? json(202, { id: "item-1" }) : undefined,
    );
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toMatchObject({ result: "created", draft: true, liveUrl: null });
    expect((calls[0].body as { isDraft: boolean }).isDraft).toBe(true);
    expect(db.blogs[0].published_url).toBeNull();
  });

  it("doesn't report a webflow.io URL as the article's home", async () => {
    await seed({ webflow_domain: "loomwise.webflow.io" });
    routes.push(createsLive());
    await publishArticle(scope, BLOG_ID);
    expect(db.blogs[0].published_url).toBeNull();
  });

  it("moves to -2 when the slug is taken by someone else's post", async () => {
    routes.push((m) =>
      m === "GET"
        ? json(200, {
            items: [
              {
                id: "theirs",
                createdOn: "2025-01-01T00:00:00.000Z",
                fieldData: { name: "What Is a Design System?" },
              },
            ],
          })
        : undefined,
    );
    routes.push((m, p, body) => {
      if (m !== "POST") return undefined;
      const slug = (body.fieldData as Row).slug;
      return slug === "what-is-a-design-system"
        ? json(400, {
            message: "Validation Error",
            details: ["slug: Unique value is already in database"],
          })
        : json(202, { id: "item-2" });
    });
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toMatchObject({ result: "created", itemId: "item-2" });
    expect(db.webflow_items[0].slug).toBe("what-is-a-design-system-2");
  });

  it("adopts its own item when the create timed out but landed, instead of making a copy", async () => {
    routes.push((m) => {
      if (m === "POST") throw new Error("The operation was aborted");
      return undefined;
    });
    routes.push((m) =>
      m === "GET"
        ? json(200, {
            items: [
              {
                id: "landed",
                createdOn: new Date().toISOString(),
                lastUpdated: "2026-09-27T10:00:01.000Z",
                isDraft: false,
                fieldData: { name: "What Is a Design System?", slug: "what-is-a-design-system" },
              },
            ],
          })
        : undefined,
    );
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toMatchObject({ result: "created", itemId: "landed" });
    // One create, never retried blind.
    expect(calls.filter((c) => c.method === "POST")).toHaveLength(1);
    expect(db.webflow_items[0]).toMatchObject({ item_id: "landed", state: "published" });
  });

  it("doesn't retry a create that failed with a 5xx and didn't land", async () => {
    routes.push((m) => (m === "POST" ? json(502, { message: "Bad gateway" }) : undefined));
    routes.push((m) => (m === "GET" ? json(200, { items: [] }) : undefined));
    const out = await publishArticle(scope, BLOG_ID);
    expect(out.result).toBe("failed");
    expect(calls.filter((c) => c.method === "POST")).toHaveLength(1);
    expect(db.webflow_items).toHaveLength(0);
  });

  it("finds the item a crashed run made, however long ago, rather than duplicating it", async () => {
    db.webflow_items.push({
      id: "stale",
      connection_id: "conn-1",
      collection_id: "coll-1",
      blog_id: BLOG_ID,
      state: "pending",
      item_id: "",
      locked_at: "2026-09-01T00:00:00.000Z",
      created_at: "2026-09-01T00:00:00.000Z",
    });
    routes.push((m) =>
      m === "POST"
        ? json(400, { message: "Validation Error", details: ["slug: already in database"] })
        : undefined,
    );
    routes.push((m) =>
      m === "GET"
        ? json(200, {
            items: [
              {
                id: "old-landed",
                createdOn: "2026-09-01T00:00:00.000Z",
                fieldData: { name: "What Is a Design System?" },
              },
            ],
          })
        : undefined,
    );
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toMatchObject({ result: "created", itemId: "old-landed" });
    expect(db.webflow_items).toHaveLength(1);
  });

  it("backs off while another run holds the claim, making no Webflow call", async () => {
    db.webflow_items.push({
      id: "claim",
      connection_id: "conn-1",
      collection_id: "coll-1",
      blog_id: BLOG_ID,
      state: "pending",
      item_id: "",
      created_at: new Date().toISOString(),
    });
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toEqual({ result: "skipped", reason: "in_progress" });
    expect(calls).toHaveLength(0);
  });

  it("releases its claim when the create fails, so the next run retries", async () => {
    routes.push(() => json(400, { message: "Validation Error" }));
    const out = await publishArticle(scope, BLOG_ID);
    expect(out.result).toBe("failed");
    expect(db.webflow_items).toHaveLength(0);
    expect(db.webflow_connections[0].status).toBe("error");
  });
});

describe("updating", () => {
  async function published() {
    routes.push(createsLive());
    await publishArticle(scope, BLOG_ID);
    calls = [];
    routes = [];
  }

  it("does nothing for an article whose written content hasn't changed", async () => {
    await published();
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toEqual({ result: "unchanged" });
    expect(calls).toHaveLength(0);
  });

  it("updates the live item, keeping its slug, when the article changed", async () => {
    await published();
    db.blogs[0].title = "Design Systems, Explained";
    routes.push((m, p) =>
      m === "GET" && p === "/collections/coll-1/items/item-1"
        ? json(200, { id: "item-1", isDraft: false, lastUpdated: "2026-09-27T10:00:01.000Z" })
        : undefined,
    );
    routes.push((m, p) =>
      m === "PATCH" && p === "/collections/coll-1/items/item-1/live"
        ? json(200, { id: "item-1", lastUpdated: "2026-09-27T11:00:00.000Z" })
        : undefined,
    );
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toEqual({ result: "updated", itemId: "item-1" });
    expect((calls[1].body as { fieldData: Row }).fieldData).toMatchObject({
      name: "Design Systems, Explained",
      slug: "what-is-a-design-system",
    });
    expect(db.webflow_items[0].webflow_updated_at).toBe("2026-09-27T11:00:00.000Z");
  });

  it("leaves an item that was edited in Webflow alone", async () => {
    await published();
    db.blogs[0].body = "Rewritten.";
    routes.push(() =>
      json(200, { id: "item-1", isDraft: false, lastUpdated: "2026-09-28T09:00:00.000Z" }),
    );
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toEqual({ result: "skipped", reason: "edited_in_webflow" });
    expect(calls.map((c) => c.method)).toEqual(["GET"]);
    expect(db.webflow_items[0].locked_at).toBeNull();
    expect(db.webflow_items[0].state).toBe("edited_in_webflow");
  });

  it("backs off while another run is updating the item", async () => {
    await published();
    db.blogs[0].body = "Rewritten.";
    Object.assign(db.webflow_items[0], { state: "updating", locked_at: new Date().toISOString() });
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toEqual({ result: "skipped", reason: "in_progress" });
    expect(calls).toHaveLength(0);
  });

  it("takes over an update lease left by a run that died", async () => {
    await published();
    db.blogs[0].body = "Rewritten.";
    Object.assign(db.webflow_items[0], {
      state: "updating",
      locked_at: "2026-09-01T00:00:00.000Z",
    });
    routes.push((m) =>
      m === "GET"
        ? json(200, { id: "item-1", isDraft: false, lastUpdated: "2026-09-27T10:00:01.000Z" })
        : undefined,
    );
    routes.push((m) =>
      m === "PATCH"
        ? json(200, { id: "item-1", lastUpdated: "2026-09-27T12:00:00.000Z" })
        : undefined,
    );
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toEqual({ result: "updated", itemId: "item-1" });
    expect(db.webflow_items[0]).toMatchObject({ state: "published", locked_at: null });
  });

  it("treats a 404 as lost access, not a deletion, when the collection is out of reach too", async () => {
    await published();
    db.blogs[0].body = "Rewritten.";
    routes.push(() => json(404, { message: "Not found" }));
    const out = await publishArticle(scope, BLOG_ID);
    expect(out.result).toBe("failed");
    expect(db.webflow_items[0]).toMatchObject({ state: "published", locked_at: null });
  });

  it("doesn't bring back an item deleted in Webflow", async () => {
    await published();
    db.blogs[0].body = "Rewritten.";
    routes.push((m, p) =>
      p === "/collections/coll-1" ? json(200, { id: "coll-1", fields: [] }) : undefined,
    );
    routes.push(() => json(404, { message: "Item not found" }));
    const out = await publishArticle(scope, BLOG_ID);
    expect(out).toEqual({ result: "skipped", reason: "deleted_in_webflow" });
    expect(db.webflow_items[0].state).toBe("deleted_in_webflow");
  });
});

describe("connection states", () => {
  it("skips a site without Webflow", async () => {
    db.webflow_connections = [];
    expect(await publishArticle(scope, BLOG_ID)).toEqual({
      result: "skipped",
      reason: "not_connected",
    });
  });

  it("skips a connection with no collection chosen yet", async () => {
    await seed({ status: "setup", collection_id: null });
    expect((await publishArticle(scope, BLOG_ID)).result).toBe("skipped");
  });

  it("deletes the token when Webflow says it was revoked, keeping the ledger", async () => {
    routes.push(() => json(401, { message: "Unauthorized" }));
    const out = await publishArticle(scope, BLOG_ID);
    expect(out.result).toBe("failed");
    expect(db.webflow_connections[0]).toMatchObject({
      access_token_enc: null,
      status: "disconnected",
    });
  });

  it("skips an article that isn't finished", async () => {
    db.blogs[0].status = "scheduled";
    expect(await publishArticle(scope, BLOG_ID)).toEqual({
      result: "skipped",
      reason: "not_finished",
    });
  });
});

describe("syncSite", () => {
  it("publishes what's missing and skips what's there", async () => {
    db.blogs.push({ ...db.blogs[0], id: "b2", title: "Second Post" });
    let n = 0;
    routes.push((m) => (m === "POST" ? json(202, { id: `item-${++n}` }) : undefined));
    const first = await syncSite(scope);
    expect(first).toMatchObject({ created: 2, failed: 0, remaining: 0 });

    calls = [];
    const second = await syncSite(scope);
    expect(second).toMatchObject({ created: 0, updated: 0 });
    expect(calls).toHaveLength(0);
  });

  it("stops early on a repeated validation error instead of burning the rate limit", async () => {
    for (let i = 0; i < 6; i++) db.blogs.push({ ...db.blogs[0], id: `b${i}`, title: `Post ${i}` });
    routes.push(() => json(400, { message: "Field 'author' is required" }));
    const r = await syncSite(scope);
    expect(r.failed).toBe(3);
    expect(r.remaining).toBe(4);
    expect(r.errors[0]).toMatch(/author/);
  });
});
