/**
 * Matching a Rankbox article onto a Webflow CMS collection.
 *
 * Every collection has two built-in fields, `name` and `slug`, which always
 * take the article's title and slug. Everything else is the user's own schema,
 * so the rest is a mapping they confirm once: which field holds the body, the
 * summary, the tags, the date. `suggestFieldMap` pre-fills it from field names;
 * `checkFieldMap` says whether Webflow will accept items written with it.
 */

/** The field types this app can write. Webflow has more; those are left alone. */
export type WebflowFieldType =
  | "PlainText"
  | "RichText"
  | "DateTime"
  | "Image"
  | "Link"
  | "Switch"
  | "Number"
  | (string & {});

/** One field from `GET /v2/collections/{id}`. */
export interface WebflowField {
  id: string;
  slug: string;
  displayName: string;
  type: WebflowFieldType;
  isRequired?: boolean;
  isEditable?: boolean;
}

/** What each Rankbox value can go into. `body` is the only one that's required. */
export const ROLES = {
  body: { label: "Article body", types: ["RichText"], required: true },
  summary: { label: "Meta description", types: ["PlainText", "RichText"], required: false },
  tags: { label: "Tags", types: ["PlainText"], required: false },
  publishedAt: { label: "Published date", types: ["DateTime"], required: false },
} as const satisfies Record<string, { label: string; types: string[]; required: boolean }>;

export type Role = keyof typeof ROLES;
export const ROLE_KEYS = Object.keys(ROLES) as Role[];

/** Field slugs per role. `null` means "don't write this". */
export type FieldMap = Record<Role, string | null>;

/** Built into every collection; always title and slug, never user-mapped. */
export const BUILT_IN_SLUGS = new Set(["name", "slug"]);

/** Name fragments that suggest a role, strongest first. */
const HINTS: Record<Role, string[]> = {
  body: ["post-body", "body", "content", "article", "post"],
  summary: ["meta-description", "description", "summary", "excerpt", "intro"],
  tags: ["tags", "tag", "keywords", "topics"],
  publishedAt: ["published-date", "publish-date", "published", "date"],
};

function writable(field: WebflowField): boolean {
  return field.isEditable !== false && !BUILT_IN_SLUGS.has(field.slug);
}

/** Fields that may hold `role`, in collection order. */
export function candidatesFor(fields: WebflowField[], role: Role): WebflowField[] {
  const types: readonly string[] = ROLES[role].types;
  return fields.filter((f) => writable(f) && types.includes(f.type));
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function score(field: WebflowField, role: Role): number {
  const names = [normalize(field.slug), normalize(field.displayName)];
  const hints = HINTS[role];
  for (let i = 0; i < hints.length; i++) {
    const hint = hints[i];
    if (names.some((n) => n === hint)) return 100 - i * 2;
    if (names.some((n) => n.includes(hint))) return 50 - i * 2;
  }
  return 0;
}

/**
 * Best guess per role. A field is used for at most one role, and the body is
 * chosen first: a collection with a single rich text field should get it as
 * the body, not the summary.
 */
export function suggestFieldMap(fields: WebflowField[]): FieldMap {
  const taken = new Set<string>();
  const map = Object.fromEntries(ROLE_KEYS.map((r) => [r, null])) as FieldMap;

  for (const role of ROLE_KEYS) {
    const options = candidatesFor(fields, role).filter((f) => !taken.has(f.slug));
    const ranked = options.map((f) => ({ f, s: score(f, role) })).sort((a, b) => b.s - a.s);
    // The body is required, so any rich text field beats none. Optional
    // roles only take a field whose name actually suggests it.
    const pick = ranked.find((r) => r.s > 0) ?? (ROLES[role].required ? ranked[0] : undefined);
    if (pick) {
      map[role] = pick.f.slug;
      taken.add(pick.f.slug);
    }
  }
  return map;
}

export interface FieldMapCheck {
  ok: boolean;
  /** Human-readable, one per problem, ready to show under the form. */
  problems: string[];
}

/** Whether items written with `map` will be accepted by this collection. */
export function checkFieldMap(fields: WebflowField[], map: Partial<FieldMap>): FieldMapCheck {
  const problems: string[] = [];
  const bySlug = new Map(fields.map((f) => [f.slug, f]));
  const used = new Map<string, Role>();

  for (const role of ROLE_KEYS) {
    const slug = map[role] ?? null;
    const spec = ROLES[role];
    if (!slug) {
      if (spec.required) problems.push(`Choose a field for the ${spec.label.toLowerCase()}.`);
      continue;
    }
    const field = bySlug.get(slug);
    if (!field) {
      problems.push(
        `The ${spec.label.toLowerCase()} field "${slug}" is no longer in this collection.`,
      );
      continue;
    }
    if (!writable(field) || !(spec.types as readonly string[]).includes(field.type)) {
      problems.push(`"${field.displayName}" can't hold the ${spec.label.toLowerCase()}.`);
      continue;
    }
    const clash = used.get(slug);
    if (clash) {
      problems.push(
        `"${field.displayName}" is chosen for both the ${ROLES[clash].label.toLowerCase()} and the ${spec.label.toLowerCase()}.`,
      );
      continue;
    }
    used.set(slug, role);
  }

  // Webflow rejects an item that leaves a required field empty, so a required
  // field Rankbox has nothing for would fail every single publish.
  for (const field of fields) {
    if (field.isRequired && !BUILT_IN_SLUGS.has(field.slug) && !used.has(field.slug)) {
      problems.push(
        `Webflow requires "${field.displayName}", which Rankbox has nothing to put in. Map it above or make it optional in Webflow.`,
      );
    }
  }

  return { ok: problems.length === 0, problems };
}

/** Parse a stored map, dropping anything that isn't a known role. */
export function parseFieldMap(raw: unknown): FieldMap {
  const map = Object.fromEntries(ROLE_KEYS.map((r) => [r, null])) as FieldMap;
  if (!raw || typeof raw !== "object") return map;
  for (const role of ROLE_KEYS) {
    const value = (raw as Record<string, unknown>)[role];
    if (typeof value === "string" && value.trim()) map[role] = value.trim();
  }
  return map;
}
