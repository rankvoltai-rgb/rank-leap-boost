import type { Fragment, ReactNode } from "react";
import type { NotionBlock, RichTextSpan } from "@/lib/notion.server";

/* ---------- inline rich text ---------- */
function Rich({ spans }: { spans?: RichTextSpan[] }) {
  if (!spans || spans.length === 0) return null;
  return (
    <>
      {spans.map((s, i) => {
        let node: ReactNode = s.text;
        if (s.code)
          node = (
            <code
              key={i}
              className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
            >
              {node}
            </code>
          );
        if (s.bold) node = <strong className="font-semibold text-ink">{node}</strong>;
        if (s.italic) node = <em>{node}</em>;
        if (s.strikethrough) node = <s>{node}</s>;
        if (s.href)
          node = (
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-volt underline-offset-2 hover:underline"
            >
              {node}
            </a>
          );
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function youtubeVimeo(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host === "youtube.com") {
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/"))
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* ignore */
  }
  return url;
}

function MediaEmbed({ block }: { block: NotionBlock }) {
  const url = block.url ?? "";
  if (!url) return null;

  if (block.embedKind === "youtube" || block.embedKind === "vimeo") {
    return (
      <figure className="my-6">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
          <iframe
            src={youtubeVimeo(url)}
            title="Embedded video"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <Caption caption={block.caption} />
      </figure>
    );
  }

  if (block.embedKind === "file") {
    return (
      <figure className="my-6">
        <video
          src={url}
          controls
          className="w-full rounded-2xl border border-border bg-black"
        />
        <Caption caption={block.caption} />
      </figure>
    );
  }

  // generic embed / bookmark -> link card
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-sm transition-colors hover:bg-secondary"
    >
      <span className="truncate text-ink">{url}</span>
      <span className="shrink-0 text-muted-foreground">↗</span>
    </a>
  );
}

function Caption({ caption }: { caption?: RichTextSpan[] }) {
  if (!caption || caption.length === 0) return null;
  return (
    <figcaption className="mt-2 text-center text-xs text-muted-foreground">
      <Rich spans={caption} />
    </figcaption>
  );
}

/* ---------- single block ---------- */
function Block({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "paragraph":
      if (!block.richText || block.richText.length === 0) return <div className="h-3" />;
      return (
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">
          <Rich spans={block.richText} />
        </p>
      );
    case "heading_1":
      return (
        <h2 className="mt-12 scroll-mt-24 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          <Rich spans={block.richText} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="mt-10 scroll-mt-24 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          <Rich spans={block.richText} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 className="mt-8 scroll-mt-24 font-display text-lg font-semibold tracking-tight text-ink">
          <Rich spans={block.richText} />
        </h4>
      );
    case "quote":
      return (
        <blockquote className="mt-6 border-l-2 border-volt pl-5 text-[1.0625rem] italic leading-relaxed text-ink">
          <Rich spans={block.richText} />
        </blockquote>
      );
    case "callout":
      return (
        <div className="mt-6 flex gap-3 rounded-2xl border border-border bg-card p-5">
          {block.icon && <span className="text-xl leading-none">{block.icon}</span>}
          <div className="text-[1rem] leading-relaxed text-muted-foreground">
            <Rich spans={block.richText} />
            <Children blocks={block.children} />
          </div>
        </div>
      );
    case "code":
      return (
        <pre className="mt-6 overflow-x-auto rounded-2xl border border-border bg-secondary p-4 text-sm">
          <code className="font-mono text-ink">
            {(block.richText ?? []).map((s) => s.text).join("")}
          </code>
        </pre>
      );
    case "image":
      if (!block.url) return null;
      return (
        <figure className="my-6">
          <img
            src={block.url}
            alt={(block.caption ?? []).map((c) => c.text).join("") || "Article image"}
            loading="lazy"
            className="w-full rounded-2xl border border-border"
          />
          <Caption caption={block.caption} />
        </figure>
      );
    case "video":
    case "embed":
    case "bookmark":
    case "link_preview":
      return <MediaEmbed block={block} />;
    case "divider":
      return <hr className="my-10 border-border" />;
    case "to_do":
      return (
        <label className="mt-2 flex items-start gap-2 text-[1.0625rem] leading-relaxed text-muted-foreground">
          <input type="checkbox" checked={block.checked} readOnly className="mt-1.5" />
          <span>
            <Rich spans={block.richText} />
          </span>
        </label>
      );
    default:
      if (block.richText && block.richText.length)
        return (
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">
            <Rich spans={block.richText} />
          </p>
        );
      return null;
  }
}

/* ---------- list grouping ---------- */
function Children({ blocks }: { blocks?: NotionBlock[] }) {
  if (!blocks || blocks.length === 0) return null;
  return <NotionBlocks blocks={blocks} nested />;
}

function ListItem({ block }: { block: NotionBlock }) {
  return (
    <li className="text-[1.0625rem] leading-relaxed text-muted-foreground">
      <Rich spans={block.richText} />
      <Children blocks={block.children} />
    </li>
  );
}

export function NotionBlocks({
  blocks,
  nested = false,
}: {
  blocks: NotionBlock[];
  nested?: boolean;
}) {
  const out: ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === "bulleted_list_item" || b.type === "numbered_list_item") {
      const ordered = b.type === "numbered_list_item";
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === b.type) {
        items.push(blocks[i]);
        i++;
      }
      const cls = `${nested ? "mt-2" : "mt-4"} space-y-2 ${ordered ? "list-decimal" : "list-disc"} pl-6`;
      out.push(
        ordered ? (
          <ol key={items[0].id} className={cls}>
            {items.map((it) => (
              <ListItem key={it.id} block={it} />
            ))}
          </ol>
        ) : (
          <ul key={items[0].id} className={cls}>
            {items.map((it) => (
              <ListItem key={it.id} block={it} />
            ))}
          </ul>
        ),
      );
      continue;
    }
    out.push(<Block key={b.id} block={b} />);
    i++;
  }
  return <>{out}</>;
}