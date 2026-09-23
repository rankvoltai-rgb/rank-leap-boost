import { describe, expect, it } from "vitest";
import { articlesNeedingReport, planSync } from "./reconcile";
import { contentHash } from "./mapping";
import { emptyLedger, type Ledger } from "./ledger";
import { article } from "./fixtures";

function ledgerFor(articles: ReturnType<typeof article>[]): Ledger {
  const base = emptyLedger();
  for (const a of articles) base.items[a.id] = { h: contentHash(a), slug: a.slug };
  return base;
}

describe("planSync", () => {
  it("writes everything on a first run and deletes nothing", () => {
    const remote = [article({ id: "a1" }), article({ id: "a2" })];
    const plan = planSync({
      remote,
      existingIds: ["stale-1"],
      ledger: emptyLedger(),
      walkWasComplete: true,
    });
    expect(plan.toWrite).toHaveLength(2);
    // An empty ledger means we can't tell our items from the user's, so
    // deletion only starts working on the next sync.
    expect(plan.toRemove).toEqual([]);
  });

  it("writes nothing when content is unchanged", () => {
    const remote = [article({ id: "a1" })];
    const plan = planSync({
      remote,
      existingIds: ["a1"],
      ledger: ledgerFor(remote),
      walkWasComplete: true,
    });
    expect(plan.toWrite).toHaveLength(0);
    expect(plan.unchanged).toBe(1);
  });

  // The write-back trigger bumps updated_at; the plan must not react to it.
  it("stays quiet after a live URL is reported", () => {
    const before = [article({ id: "a1" })];
    const after = [
      article({
        id: "a1",
        updated_at: "2026-09-22T12:00:00.000Z",
        published_url: "https://brightloop.app/blog/x",
      }),
    ];
    const plan = planSync({
      remote: after,
      existingIds: ["a1"],
      ledger: ledgerFor(before),
      walkWasComplete: true,
    });
    expect(plan.toWrite).toHaveLength(0);
    expect(plan.unchanged).toBe(1);
  });

  it("rewrites an edited article", () => {
    const before = [article({ id: "a1" })];
    const plan = planSync({
      remote: [article({ id: "a1", title: "Rewritten" })],
      existingIds: ["a1"],
      ledger: ledgerFor(before),
      walkWasComplete: true,
    });
    expect(plan.toWrite).toHaveLength(1);
  });

  it("removes articles that left Rankbox", () => {
    const gone = article({ id: "a2" });
    const plan = planSync({
      remote: [article({ id: "a1" })],
      existingIds: ["a1", "a2"],
      ledger: ledgerFor([article({ id: "a1" }), gone]),
      walkWasComplete: true,
    });
    expect(plan.toRemove).toEqual(["a2"]);
    expect(plan.nextItems.a2).toBeUndefined();
  });

  it("never removes an item the plugin didn't create", () => {
    const plan = planSync({
      remote: [article({ id: "a1" })],
      existingIds: ["a1", "hand-written"],
      ledger: ledgerFor([article({ id: "a1" })]),
      walkWasComplete: true,
    });
    expect(plan.toRemove).toEqual([]);
  });

  // An incremental walk can't distinguish "deleted" from "not in this page".
  it("never removes on an incomplete walk", () => {
    const plan = planSync({
      remote: [article({ id: "a1" })],
      existingIds: ["a1", "a2"],
      ledger: ledgerFor([article({ id: "a1" }), article({ id: "a2" })]),
      walkWasComplete: false,
    });
    expect(plan.toRemove).toEqual([]);
  });

  it("keeps the original slug when an article is retitled", () => {
    const before = [article({ id: "a1", slug: "old-slug-a1b2" })];
    const plan = planSync({
      remote: [article({ id: "a1", slug: "new-slug-a1b2", title: "Renamed" })],
      existingIds: ["a1"],
      ledger: ledgerFor(before),
      walkWasComplete: true,
    });
    expect(plan.toWrite[0].slug).toBe("old-slug-a1b2");
  });

  it("adopts the new slug when the user opts in, and writes the change", () => {
    const before = [article({ id: "a1", slug: "old-slug-a1b2" })];
    const plan = planSync({
      remote: [article({ id: "a1", slug: "new-slug-a1b2" })],
      existingIds: ["a1"],
      ledger: ledgerFor(before),
      walkWasComplete: true,
      followSlugRenames: true,
    });
    expect(plan.toWrite).toHaveLength(1);
    expect(plan.toWrite[0].slug).toBe("new-slug-a1b2");
  });

  it("force rewrites unchanged articles", () => {
    const remote = [article({ id: "a1" })];
    const plan = planSync({
      remote,
      existingIds: ["a1"],
      ledger: ledgerFor(remote),
      walkWasComplete: true,
      force: true,
    });
    expect(plan.toWrite).toHaveLength(1);
  });

  it("records a slug change so the old URL can be redirected", () => {
    const before = [article({ id: "a1", slug: "old-slug-a1b2" })];
    const plan = planSync({
      remote: [article({ id: "a1", slug: "new-slug-a1b2" })],
      existingIds: ["a1"],
      ledger: ledgerFor(before),
      walkWasComplete: true,
      followSlugRenames: true,
    });
    expect(plan.slugChanges).toEqual([{ from: "old-slug-a1b2", to: "new-slug-a1b2" }]);
  });

  it("records no slug change when the slug is held stable", () => {
    const before = [article({ id: "a1", slug: "old-slug-a1b2" })];
    const plan = planSync({
      remote: [article({ id: "a1", slug: "new-slug-a1b2" })],
      existingIds: ["a1"],
      ledger: ledgerFor(before),
      walkWasComplete: true,
    });
    expect(plan.slugChanges).toEqual([]);
  });

  it("records no slug change for a brand new article", () => {
    const plan = planSync({
      remote: [article({ id: "a1" })],
      existingIds: [],
      ledger: emptyLedger(),
      walkWasComplete: true,
    });
    expect(plan.slugChanges).toEqual([]);
  });

  it("deduplicates colliding slugs across the batch", () => {
    const plan = planSync({
      remote: [article({ id: "a1", slug: "same" }), article({ id: "a2", slug: "same" })],
      existingIds: [],
      ledger: emptyLedger(),
      walkWasComplete: true,
    });
    expect(plan.toWrite.map((i) => i.slug)).toEqual(["same", "same-2"]);
  });
});

describe("articlesNeedingReport", () => {
  const liveUrl = (slug: string) => `https://brightloop.app/blog/${slug}`;

  it("skips articles whose URL Rankbox already has", () => {
    const a = article({
      id: "a1",
      slug: "x",
      published_url: "https://brightloop.app/blog/x",
    });
    expect(articlesNeedingReport([a], ledgerFor([a]), liveUrl)).toHaveLength(0);
  });

  it("reports articles with no URL yet", () => {
    const a = article({ id: "a1", slug: "x", published_url: null });
    const pending = articlesNeedingReport([a], ledgerFor([a]), liveUrl);
    expect(pending).toHaveLength(1);
    expect(pending[0].url).toBe("https://brightloop.app/blog/x");
  });

  it("uses the ledger's slug, not the article's current one", () => {
    const stored = article({ id: "a1", slug: "old" });
    const renamed = article({ id: "a1", slug: "new" });
    const pending = articlesNeedingReport([renamed], ledgerFor([stored]), liveUrl);
    expect(pending[0].url).toBe("https://brightloop.app/blog/old");
  });

  it("reports a URL that changed", () => {
    const a = article({ id: "a1", slug: "x", published_url: "https://old.example/blog/x" });
    expect(articlesNeedingReport([a], ledgerFor([a]), liveUrl)).toHaveLength(1);
  });
});
