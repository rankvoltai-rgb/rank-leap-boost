import type { CollectionFieldLike, ContentType } from "./types";

/**
 * The fields Rankbox manages. These ids are a wire format: once shipped they
 * are never renamed, because a changed id orphans every item already in a
 * user's collection.
 */
export const FIELD_IDS = {
  title: "title",
  description: "description",
  content: "content",
  tags: "tags",
  seoScore: "seoScore",
  publishedAt: "publishedAt",
  liveUrl: "liveUrl",
} as const;

/**
 * Feed Framer the Markdown and let it convert, rather than the server's
 * pre-rendered HTML. Framer then only emits node types its rich text actually
 * models, instead of re-parsing HTML and silently dropping what it can't map.
 * Flip this one constant if a real sync shows the HTML path renders better.
 */
export const BODY_SOURCE: "markdown" | "html" = "markdown";

const CONTENT_TYPE: ContentType = BODY_SOURCE === "markdown" ? "markdown" : "html";

export const RANKBOX_FIELDS: CollectionFieldLike[] = [
  { id: FIELD_IDS.title, name: "Title", type: "string" },
  { id: FIELD_IDS.description, name: "Description", type: "string" },
  { id: FIELD_IDS.content, name: "Content", type: "formattedText", contentType: CONTENT_TYPE },
  { id: FIELD_IDS.tags, name: "Tags", type: "string" },
  { id: FIELD_IDS.seoScore, name: "SEO Score", type: "number" },
  { id: FIELD_IDS.publishedAt, name: "Published", type: "date" },
  { id: FIELD_IDS.liveUrl, name: "Live URL", type: "link" },
];

const OWNED_IDS = new Set<string>(RANKBOX_FIELDS.map((f) => f.id));

export function isRankboxField(id: string): boolean {
  return OWNED_IDS.has(id);
}

export interface FieldConflict {
  id: string;
  name: string;
  expected: string;
  actual: string;
}

export interface MergeResult {
  fields: CollectionFieldLike[];
  /** Fields we own whose type the user changed — never silently overwritten. */
  conflicts: FieldConflict[];
}

/**
 * Merge our required fields into whatever the collection already has.
 *
 * Rules: a user's renamed label wins (they may have called Content "Post
 * body"), our type and contentType win, and any field we don't own survives in
 * its original position. A type conflict is reported rather than clobbered.
 */
export function mergeFields(
  existing: CollectionFieldLike[],
  required: CollectionFieldLike[] = RANKBOX_FIELDS,
): MergeResult {
  const byId = new Map(existing.map((f) => [f.id, f]));
  const conflicts: FieldConflict[] = [];

  const merged = required.map((req) => {
    const current = byId.get(req.id);
    if (!current) return { ...req };
    if (current.type !== req.type) {
      conflicts.push({
        id: req.id,
        name: current.name || req.name,
        expected: req.type,
        actual: current.type,
      });
    }
    // Keep the user's label, take everything structural from ours.
    return { ...req, name: current.name || req.name };
  });

  const extras = existing.filter((f) => !OWNED_IDS.has(f.id));
  return { fields: [...merged, ...extras], conflicts };
}

/**
 * True when the collection's fields already match, so `setFields` can be
 * skipped entirely. Without this the plugin churns the CMS on every sync.
 */
export function fieldsEqual(a: CollectionFieldLike[], b: CollectionFieldLike[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((field, i) => {
    const other = b[i];
    return (
      field.id === other.id &&
      field.type === other.type &&
      field.name === other.name &&
      (field.contentType ?? undefined) === (other.contentType ?? undefined)
    );
  });
}
