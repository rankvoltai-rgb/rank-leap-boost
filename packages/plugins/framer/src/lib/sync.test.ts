import { describe, expect, it, vi } from "vitest";
import { PermissionError, syncArticles } from "./sync";
import { LEDGER_KEY, parseLedger } from "./ledger";
import { RANKBOX_FIELDS } from "./fields";
import { article } from "./fixtures";
import type { CollectionFieldLike, CollectionItemLike, ManagedCollectionLike } from "./types";
import type { PublishedArticle } from "@rankbox/api-client";

/** An in-memory stand-in for a Framer managed collection. */
function fakeCollection(seed: { fields?: CollectionFieldLike[]; itemIds?: string[] } = {}) {
  const state = {
    fields: seed.fields ?? [],
    itemIds: seed.itemIds ?? [],
    data: new Map<string, string>(),
    added: [] as CollectionItemLike[],
    removed: [] as string[],
    setFieldsCalls: 0,
  };
  const collection: ManagedCollectionLike = {
    id: "col-1",
    name: "Articles",
    getFields: async () => state.fields,
    setFields: async (fields) => {
      state.setFieldsCalls += 1;
      state.fields = fields;
    },
    getItemIds: async () => state.itemIds,
    addItems: async (items) => {
      state.added.push(...items);
    },
    removeItems: async (ids) => {
      state.removed.push(...ids);
    },
    getPluginData: async (key) => state.data.get(key) ?? null,
    setPluginData: async (key, value) => {
      if (value === null) state.data.delete(key);
      else state.data.set(key, value);
    },
  };
  return { collection, state };
}

function fakeClient(articles: PublishedArticle[]) {
  return {
    listArticles: async () => ({
      articles,
      count: articles.length,
      next_since: articles.at(-1)?.updated_at ?? null,
    }),
  };
}

describe("syncArticles", () => {
  it("creates the fields and writes every article on a first run", async () => {
    const { collection, state } = fakeCollection();
    const result = await syncArticles({
      collection,
      client: fakeClient([article({ id: "a1" }), article({ id: "a2" })]),
    });

    expect(state.setFieldsCalls).toBe(1);
    expect(state.fields).toHaveLength(RANKBOX_FIELDS.length);
    expect(result.written).toBe(2);
    expect(result.removed).toBe(0);
    expect(result.complete).toBe(true);
  });

  it("records a ledger so the next sync can tell what changed", async () => {
    const { collection, state } = fakeCollection();
    await syncArticles({ collection, client: fakeClient([article({ id: "a1" })]) });

    const ledger = parseLedger(state.data.get(LEDGER_KEY) ?? null);
    expect(ledger.items.a1).toMatchObject({ slug: "how-to-price-a-saas-product-a1b2c3d4" });
    expect(ledger.lastFullAt).not.toBeNull();
  });

  it("writes nothing and skips setFields on an unchanged re-sync", async () => {
    const { collection, state } = fakeCollection();
    const client = fakeClient([article({ id: "a1" })]);
    await syncArticles({ collection, client });
    state.itemIds = ["a1"];
    const before = state.setFieldsCalls;

    const second = await syncArticles({ collection, client });

    expect(second.written).toBe(0);
    expect(second.unchanged).toBe(1);
    // The schema already matches, so the CMS is left alone entirely.
    expect(state.setFieldsCalls).toBe(before);
  });

  it("removes articles that left Rankbox once a ledger exists", async () => {
    const { collection, state } = fakeCollection();
    await syncArticles({
      collection,
      client: fakeClient([article({ id: "a1" }), article({ id: "a2" })]),
    });
    state.itemIds = ["a1", "a2"];

    const second = await syncArticles({ collection, client: fakeClient([article({ id: "a1" })]) });

    expect(second.removed).toBe(1);
    expect(state.removed).toEqual(["a2"]);
  });

  it("keeps fields the user added to the collection", async () => {
    const custom: CollectionFieldLike = { id: "author", name: "Author", type: "string" };
    const { collection, state } = fakeCollection({ fields: [custom] });
    await syncArticles({ collection, client: fakeClient([article()]) });
    expect(state.fields.find((f) => f.id === "author")).toEqual(custom);
  });

  it("reports progress through each phase", async () => {
    const { collection } = fakeCollection();
    const phases: string[] = [];
    await syncArticles({
      collection,
      client: fakeClient([article()]),
      onProgress: (p) => phases.push(p.phase),
    });
    expect(phases).toContain("fetching");
    expect(phases).toContain("writing");
    expect(phases.at(-1)).toBe("done");
  });

  it("refuses to write when the user lacks CMS permission", async () => {
    const { collection } = fakeCollection();
    await expect(
      syncArticles({
        collection,
        client: fakeClient([article()]),
        can: (method) => method !== "ManagedCollection.setFields",
      }),
    ).rejects.toBeInstanceOf(PermissionError);
  });

  it("surfaces a field type conflict without overwriting it", async () => {
    const { collection } = fakeCollection({
      fields: [{ id: "content", name: "Content", type: "string" }],
    });
    const result = await syncArticles({ collection, client: fakeClient([article()]) });
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].actual).toBe("string");
  });

  it("stamps live URLs into items when the site is published", async () => {
    const { collection, state } = fakeCollection();
    await syncArticles({
      collection,
      client: fakeClient([article({ id: "a1" })]),
      liveUrlFor: (slug) => `https://brightloop.app/blog/${slug}`,
    });
    expect(state.added[0].fieldData.liveUrl.value).toBe(
      "https://brightloop.app/blog/how-to-price-a-saas-product-a1b2c3d4",
    );
  });

  it("honours cancellation mid-write", async () => {
    const { collection } = fakeCollection();
    const controller = new AbortController();
    const many = Array.from({ length: 250 }, (_, i) => article({ id: `a${i}`, slug: `s${i}` }));
    const spy = vi.spyOn(collection, "addItems").mockImplementation(async () => {
      controller.abort();
    });
    await expect(
      syncArticles({ collection, client: fakeClient(many), signal: controller.signal }),
    ).rejects.toThrow(/cancelled/i);
    spy.mockRestore();
  });
});
