import { describe, expect, it } from "vitest";
import { MAX_PAGES, PAGE_SIZE, walkArticles } from "./pagination";
import { article } from "./fixtures";
import type { ArticlesPage } from "@rankbox/api-client";

/** A fake API that hands back canned pages and records the cursors it saw. */
function fakeClient(pages: ArticlesPage[]) {
  const seen: Array<string | null | undefined> = [];
  let i = 0;
  return {
    seen,
    listArticles: async (options: { since?: string | null }) => {
      seen.push(options.since);
      return pages[Math.min(i++, pages.length - 1)];
    },
  };
}

function page(count: number, nextSince: string | null, idPrefix = "a"): ArticlesPage {
  return {
    articles: Array.from({ length: count }, (_, n) =>
      article({ id: `${idPrefix}${n}`, updated_at: nextSince ?? "2026-09-01T00:00:00.000Z" }),
    ),
    count,
    next_since: nextSince,
  };
}

describe("walkArticles", () => {
  it("handles an empty library", async () => {
    const result = await walkArticles(fakeClient([page(0, null)]), null);
    expect(result.articles).toHaveLength(0);
    expect(result.complete).toBe(true);
  });

  it("stops after one short page", async () => {
    const client = fakeClient([page(12, "2026-09-02T00:00:00.000Z")]);
    const result = await walkArticles(client, null);
    expect(result.articles).toHaveLength(12);
    expect(result.complete).toBe(true);
    expect(client.seen).toEqual([null]);
  });

  it("pages through a full page followed by a short one", async () => {
    const client = fakeClient([
      page(PAGE_SIZE, "2026-09-02T00:00:00.000Z", "p1-"),
      page(7, "2026-09-03T00:00:00.000Z", "p2-"),
    ]);
    const result = await walkArticles(client, null);
    expect(result.articles).toHaveLength(PAGE_SIZE + 7);
    expect(result.complete).toBe(true);
    // Second request must resume from the first page's cursor.
    expect(client.seen).toEqual([null, "2026-09-02T00:00:00.000Z"]);
  });

  it("passes an incremental starting cursor through", async () => {
    const client = fakeClient([page(3, "2026-09-05T00:00:00.000Z")]);
    await walkArticles(client, "2026-09-04T00:00:00.000Z");
    expect(client.seen).toEqual(["2026-09-04T00:00:00.000Z"]);
  });

  // More than a page of articles sharing one updated_at would stall the
  // cursor. Better to report it than to silently drop the remainder.
  it("detects a stalled cursor instead of looping", async () => {
    const stuck = page(PAGE_SIZE, "2026-09-02T00:00:00.000Z");
    const result = await walkArticles(
      fakeClient([stuck, stuck, stuck]),
      "2026-09-02T00:00:00.000Z",
    );
    expect(result.complete).toBe(false);
    expect(result.reason).toBe("no-progress");
  });

  it("treats a missing next_since on a full page as a stall", async () => {
    const result = await walkArticles(fakeClient([page(PAGE_SIZE, null)]), null);
    expect(result.complete).toBe(false);
    expect(result.reason).toBe("no-progress");
  });

  it("caps a runaway walk", async () => {
    let n = 0;
    const client = {
      listArticles: async () => {
        n += 1;
        return page(PAGE_SIZE, `2026-09-${String((n % 27) + 1).padStart(2, "0")}T00:00:00.000Z`);
      },
    };
    const result = await walkArticles(client, null);
    expect(result.complete).toBe(false);
    expect(result.reason).toBe("max-pages");
    expect(n).toBe(MAX_PAGES);
  });

  it("reports progress as pages arrive", async () => {
    const seen: number[] = [];
    await walkArticles(
      fakeClient([page(PAGE_SIZE, "2026-09-02T00:00:00.000Z", "p1-"), page(5, null, "p2-")]),
      null,
      { onPage: (total) => seen.push(total) },
    );
    expect(seen).toEqual([PAGE_SIZE, PAGE_SIZE + 5]);
  });

  it("surfaces a mid-walk failure", async () => {
    let call = 0;
    const client = {
      listArticles: async () => {
        call += 1;
        if (call === 2) throw new Error("network down");
        return page(PAGE_SIZE, "2026-09-02T00:00:00.000Z");
      },
    };
    await expect(walkArticles(client, null)).rejects.toThrow("network down");
  });
});
