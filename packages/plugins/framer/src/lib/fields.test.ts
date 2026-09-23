import { describe, expect, it } from "vitest";
import { FIELD_IDS, RANKBOX_FIELDS, fieldsEqual, mergeFields } from "./fields";
import type { CollectionFieldLike } from "./types";

describe("RANKBOX_FIELDS", () => {
  it("covers every field the integrations page promises", () => {
    const names = RANKBOX_FIELDS.map((f) => f.name);
    // Slug is the item's own slug property, not a field.
    expect(names).toEqual(
      expect.arrayContaining(["Title", "Description", "Content", "Tags", "Live URL"]),
    );
  });

  it("declares markdown on the content field so Framer converts it", () => {
    const content = RANKBOX_FIELDS.find((f) => f.id === FIELD_IDS.content);
    expect(content?.type).toBe("formattedText");
    expect(content?.contentType).toBe("markdown");
  });
});

describe("mergeFields", () => {
  it("creates the full set on an empty collection", () => {
    const { fields, conflicts } = mergeFields([]);
    expect(fields).toHaveLength(RANKBOX_FIELDS.length);
    expect(conflicts).toEqual([]);
  });

  it("keeps a label the user renamed", () => {
    const existing: CollectionFieldLike[] = [
      { id: FIELD_IDS.content, name: "Post body", type: "formattedText" },
    ];
    const { fields } = mergeFields(existing);
    const content = fields.find((f) => f.id === FIELD_IDS.content);
    expect(content?.name).toBe("Post body");
    // Structure still comes from us.
    expect(content?.contentType).toBe("markdown");
  });

  it("preserves fields the user added", () => {
    const custom: CollectionFieldLike = { id: "author", name: "Author", type: "string" };
    const { fields } = mergeFields([custom]);
    expect(fields.find((f) => f.id === "author")).toEqual(custom);
    expect(fields).toHaveLength(RANKBOX_FIELDS.length + 1);
  });

  it("reports a type conflict rather than silently overwriting", () => {
    const { conflicts } = mergeFields([{ id: FIELD_IDS.content, name: "Content", type: "string" }]);
    expect(conflicts).toEqual([
      { id: FIELD_IDS.content, name: "Content", expected: "formattedText", actual: "string" },
    ]);
  });
});

describe("fieldsEqual", () => {
  it("is true for an already-correct collection, so setFields is skipped", () => {
    const { fields } = mergeFields(RANKBOX_FIELDS);
    expect(fieldsEqual(RANKBOX_FIELDS, fields)).toBe(true);
  });

  it("is false when a field is missing", () => {
    expect(fieldsEqual(RANKBOX_FIELDS.slice(1), RANKBOX_FIELDS)).toBe(false);
  });

  it("is false when contentType differs", () => {
    const changed = RANKBOX_FIELDS.map((f) =>
      f.id === FIELD_IDS.content ? { ...f, contentType: "html" as const } : f,
    );
    expect(fieldsEqual(changed, RANKBOX_FIELDS)).toBe(false);
  });
});
