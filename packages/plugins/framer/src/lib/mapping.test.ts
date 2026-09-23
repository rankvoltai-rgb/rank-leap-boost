import { describe, expect, it } from "vitest";
import { contentHash, formatTags, toCollectionItem } from "./mapping";
import { FIELD_IDS } from "./fields";
import { article } from "./fixtures";

describe("formatTags", () => {
  it("joins tags for Framer's string field", () => {
    expect(formatTags(["pricing", "saas"])).toBe("pricing, saas");
  });

  it("returns an empty string for no tags", () => {
    expect(formatTags([])).toBe("");
    expect(formatTags(null)).toBe("");
    expect(formatTags(undefined)).toBe("");
  });

  it("drops blank entries", () => {
    expect(formatTags(["pricing", "  ", "saas"])).toBe("pricing, saas");
  });
});

describe("contentHash", () => {
  it("is stable for identical content", () => {
    expect(contentHash(article())).toBe(contentHash(article()));
  });

  // The load-bearing test. A BEFORE UPDATE trigger on `blogs` bumps
  // `updated_at` whenever the plugin reports a live URL, so if the hash
  // included it, every write-back would make every article look changed and
  // the next sync would rewrite the entire collection.
  it("ignores updated_at and published_url", () => {
    const before = contentHash(article());
    const afterReport = contentHash(
      article({
        updated_at: "2026-09-22T12:00:00.000Z",
        published_url: "https://brightloop.app/blog/how-to-price-a-saas-product-a1b2c3d4",
      }),
    );
    expect(afterReport).toBe(before);
  });

  it("changes when written content changes", () => {
    const base = contentHash(article());
    expect(contentHash(article({ title: "Different" }))).not.toBe(base);
    expect(contentHash(article({ body_markdown: "changed" }))).not.toBe(base);
    expect(contentHash(article({ tags: ["other"] }))).not.toBe(base);
    expect(contentHash(article({ seo_score: 91 }))).not.toBe(base);
    expect(contentHash(article({ description: "new" }))).not.toBe(base);
  });
});

describe("toCollectionItem", () => {
  it("emits typed fieldData for every managed field", () => {
    const item = toCollectionItem(article(), "my-slug", null);
    expect(item.id).toBe("a1");
    expect(item.slug).toBe("my-slug");
    for (const id of Object.values(FIELD_IDS)) {
      expect(item.fieldData[id]).toBeDefined();
      expect(item.fieldData[id].type).toBeTruthy();
    }
  });

  it("sends markdown with an explicit contentType", () => {
    const entry = toCollectionItem(article(), "s", null).fieldData[FIELD_IDS.content];
    expect(entry.type).toBe("formattedText");
    // Framer defaults formattedText to HTML, so markdown must be declared.
    expect(entry.contentType).toBe("markdown");
    expect(entry.value).toBe("# Pricing\n\nStart with value.");
  });

  it("falls back to an empty description rather than null", () => {
    const item = toCollectionItem(article({ description: "" }), "s", null);
    expect(item.fieldData[FIELD_IDS.description].value).toBe("");
  });

  it("prefers a freshly composed live URL over the stored one", () => {
    const item = toCollectionItem(
      article({ published_url: "https://old.example/blog/x" }),
      "s",
      "https://new.example/blog/s",
    );
    expect(item.fieldData[FIELD_IDS.liveUrl].value).toBe("https://new.example/blog/s");
  });
});
