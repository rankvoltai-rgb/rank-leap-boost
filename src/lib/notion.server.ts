/**
 * Server-only Notion helpers. All calls go through the Lovable connector
 * gateway — never call api.notion.com directly, and never import this file
 * from client/route module scope (it reads secrets at runtime).
 */

const GATEWAY = "https://connector-gateway.lovable.dev/notion/v1";

export interface RichTextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  href?: string | null;
}

export interface NotionBlock {
  id: string;
  type: string;
  richText?: RichTextSpan[];
  language?: string;
  url?: string;
  caption?: RichTextSpan[];
  checked?: boolean;
  embedKind?: "youtube" | "vimeo" | "file" | "other";
  icon?: string | null;
  children?: NotionBlock[];
}

export interface PostMeta {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string | null;
  cover: string | null;
  tags: string[];
  author: string;
}

export interface PostFull extends PostMeta {
  blocks: NotionBlock[];
}

function keys() {
  const lovable = process.env.LOVABLE_API_KEY;
  const notion = process.env.NOTION_API_KEY;
  if (!lovable) throw new Error("LOVABLE_API_KEY is not configured");
  if (!notion) throw new Error("NOTION_API_KEY is not configured");
  return { lovable, notion };
}

async function notionFetch(path: string, init?: RequestInit) {
  const { lovable, notion } = keys();
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": notion,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Notion gateway ${res.status}: ${typeof data === "object" ? JSON.stringify(data) : data}`,
    );
  }
  return data;
}

/* ---------- helpers ---------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function spans(rich: any[] | undefined): RichTextSpan[] {
  if (!Array.isArray(rich)) return [];
  return rich.map((r) => ({
    text: r.plain_text ?? r.text?.content ?? "",
    bold: r.annotations?.bold || undefined,
    italic: r.annotations?.italic || undefined,
    strikethrough: r.annotations?.strikethrough || undefined,
    code: r.annotations?.code || undefined,
    href: r.href ?? null,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function plain(rich: any[] | undefined): string {
  return spans(rich)
    .map((s) => s.text)
    .join("");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fileUrl(f: any): string | null {
  if (!f) return null;
  if (f.type === "external") return f.external?.url ?? null;
  if (f.type === "file") return f.file?.url ?? null;
  return f.external?.url ?? f.file?.url ?? null;
}

function classifyMedia(url: string): "youtube" | "vimeo" | "file" | "other" {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/vimeo\.com/.test(url)) return "vimeo";
  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)) return "file";
  return "other";
}

/** Convert any YouTube/Vimeo URL into an embeddable iframe src. */
export function toEmbedSrc(url: string): string {
  try {
    const u = new URL(url);
    if (/youtu\.be$/.test(u.hostname)) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (/youtube\.com$/.test(u.hostname.replace(/^www\./, ""))) {
      if (u.pathname.startsWith("/embed/")) return url;
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
      }
    }
    if (/vimeo\.com$/.test(u.hostname.replace(/^www\./, ""))) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* ignore */
  }
  return url;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readProp(props: Record<string, any>, name: string) {
  return props?.[name];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function metaFromPage(page: any): PostMeta {
  const props = page.properties ?? {};
  // find the title prop (type === "title")
  let title = "";
  for (const key of Object.keys(props)) {
    if (props[key]?.type === "title") {
      title = plain(props[key].title);
      break;
    }
  }
  const slugProp = readProp(props, "Slug");
  const excerptProp = readProp(props, "Excerpt");
  const dateProp = readProp(props, "Date");
  const tagsProp = readProp(props, "Tags");
  const authorProp = readProp(props, "Author");

  const cover = fileUrl(page.cover);

  return {
    id: page.id,
    slug: slugProp ? plain(slugProp.rich_text) : "",
    title: title || "Untitled",
    excerpt: excerptProp ? plain(excerptProp.rich_text) : "",
    date: dateProp?.date?.start ?? null,
    cover,
    tags: Array.isArray(tagsProp?.multi_select)
      ? tagsProp.multi_select.map((t: { name: string }) => t.name)
      : [],
    author: authorProp ? plain(authorProp.rich_text) || "Rankvolt" : "Rankvolt",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function statusValue(page: any): string {
  const props = page.properties ?? {};
  const s = props["Status"];
  if (!s) return "";
  if (s.type === "status") return s.status?.name ?? "";
  if (s.type === "select") return s.select?.name ?? "";
  return "";
}

/* ---------- database resolution ---------- */

let cachedDbId: string | null = null;

export async function resolveBlogDatabaseId(): Promise<string | null> {
  if (cachedDbId) return cachedDbId;
  const data = await notionFetch("/search", {
    method: "POST",
    body: JSON.stringify({ filter: { property: "object", value: "database" } }),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbs: any[] = data.results ?? [];
  const named = dbs.find((d) => plain(d.title).trim().toLowerCase() === "blog");
  const chosen = named ?? dbs.find((d) => !!d.properties?.Slug) ?? null;
  cachedDbId = chosen?.id ?? null;
  return cachedDbId;
}

/* ---------- queries ---------- */

export async function listPublishedPosts(): Promise<PostMeta[]> {
  const dbId = await resolveBlogDatabaseId();
  if (!dbId) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: any[] = [];
  let cursor: string | undefined;
  do {
    const data = await notionFetch(`/databases/${dbId}/query`, {
      method: "POST",
      body: JSON.stringify(cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 }),
    });
    results.push(...(data.results ?? []));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return results
    .filter((p) => statusValue(p).toLowerCase() === "published")
    .map(metaFromPage)
    .filter((m) => m.slug)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

async function fetchBlocks(blockId: string, depth = 0): Promise<NotionBlock[]> {
  if (depth > 3) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = [];
  let cursor: string | undefined;
  do {
    const qs = cursor ? `?start_cursor=${cursor}&page_size=100` : `?page_size=100`;
    const data = await notionFetch(`/blocks/${blockId}/children${qs}`);
    raw.push(...(data.results ?? []));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  const out: NotionBlock[] = [];
  for (const b of raw) {
    const type: string = b.type;
    const payload = b[type] ?? {};
    const block: NotionBlock = { id: b.id, type };

    switch (type) {
      case "paragraph":
      case "heading_1":
      case "heading_2":
      case "heading_3":
      case "quote":
        block.richText = spans(payload.rich_text);
        break;
      case "callout":
        block.richText = spans(payload.rich_text);
        block.icon = payload.icon?.emoji ?? null;
        break;
      case "bulleted_list_item":
      case "numbered_list_item":
        block.richText = spans(payload.rich_text);
        break;
      case "to_do":
        block.richText = spans(payload.rich_text);
        block.checked = !!payload.checked;
        break;
      case "code":
        block.richText = spans(payload.rich_text);
        block.language = payload.language ?? "text";
        break;
      case "image": {
        block.url = fileUrl(payload) ?? undefined;
        block.caption = spans(payload.caption);
        break;
      }
      case "video": {
        const url = fileUrl(payload) ?? "";
        block.url = url;
        block.caption = spans(payload.caption);
        block.embedKind = classifyMedia(url);
        break;
      }
      case "embed":
      case "bookmark":
      case "link_preview": {
        const url = payload.url ?? "";
        block.url = url;
        block.caption = spans(payload.caption);
        block.embedKind = classifyMedia(url);
        break;
      }
      case "divider":
        break;
      default:
        // unsupported block: keep type so renderer can skip gracefully
        block.richText = spans(payload.rich_text);
        break;
    }

    if (b.has_children && type !== "code") {
      block.children = await fetchBlocks(b.id, depth + 1);
    }
    out.push(block);
  }
  return out;
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  const dbId = await resolveBlogDatabaseId();
  if (!dbId) return null;
  const data = await notionFetch(`/databases/${dbId}/query`, {
    method: "POST",
    body: JSON.stringify({
      filter: { property: "Slug", rich_text: { equals: slug } },
      page_size: 1,
    }),
  });
  const page = (data.results ?? [])[0];
  if (!page) return null;
  if (statusValue(page).toLowerCase() !== "published") return null;
  const meta = metaFromPage(page);
  const blocks = await fetchBlocks(page.id);
  return { ...meta, blocks };
}
