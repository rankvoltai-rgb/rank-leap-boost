/**
 * Renders a post's blocks (from Notion, or markdown via src/lib/markdown-blocks)
 * with the blog's reading typography.
 *
 * Heading anchors and figure numbers come from BlockContext, which ArticleBody
 * fills from the article outline, so the table of contents and the headings
 * always agree on ids.
 */
import { useContext, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Link2 } from "lucide-react";
import type { NotionBlock, RichTextSpan } from "@/lib/notion.server";
import { ArticleFigure } from "@/components/blog/figures";
import { BlockContext } from "@/components/blog/block-context";
import { cn } from "@/lib/utils";

/* ---------- inline rich text ---------- */

const LINK =
  "font-medium text-volt underline decoration-volt/30 decoration-[1.5px] underline-offset-[3px] transition-colors hover:decoration-volt";

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  // Same-site paths route client-side; anything else opens in a new tab.
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link to={href} className={LINK}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={LINK}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {children}
    </a>
  );
}

export function Rich({ spans }: { spans?: RichTextSpan[] }) {
  if (!spans || spans.length === 0) return null;
  return (
    <>
      {spans.map((s, i) => {
        let node: ReactNode = s.text;
        if (s.code)
          node = (
            <code className="rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-[0.84em] font-medium text-ink">
              {node}
            </code>
          );
        if (s.bold) node = <strong className="font-semibold text-ink">{node}</strong>;
        if (s.italic) node = <em>{node}</em>;
        if (s.strikethrough) node = <s>{node}</s>;
        if (s.href) node = <InlineLink href={s.href}>{node}</InlineLink>;
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function Caption({ caption }: { caption?: RichTextSpan[] }) {
  if (!caption || caption.length === 0) return null;
  return (
    <figcaption className="mt-3 text-center text-[0.8rem] text-muted-foreground">
      <Rich spans={caption} />
    </figcaption>
  );
}

/* ---------- media ---------- */

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
      <figure className="my-10">
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
      <figure className="my-10">
        <video src={url} controls className="w-full rounded-2xl border border-border bg-black" />
        <Caption caption={block.caption} />
      </figure>
    );
  }

  let host = url;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    /* keep the raw url */
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-8 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-sm shadow-1 transition-colors hover:bg-surface"
    >
      <span className="min-w-0">
        <span className="block truncate font-semibold text-ink">{host}</span>
        <span className="block truncate text-xs text-muted-foreground">{url}</span>
      </span>
      <span className="shrink-0 text-muted-foreground">↗</span>
    </a>
  );
}

/* ---------- code ---------- */

/* Light tinting for config-style snippets (robots.txt, yaml, env): comments
   fade, keys pick up the accent. Anything else renders plain. */
function CodeLine({ line }: { line: string }) {
  if (/^\s*#/.test(line)) return <span className="text-white/40">{line}</span>;
  const kv = line.match(/^(\s*[\w.-]+)(:)(.*)$/);
  if (kv)
    return (
      <>
        <span className="text-[#8ab4ff]">{kv[1]}</span>
        <span className="text-white/40">{kv[2]}</span>
        <span className="text-white">{kv[3]}</span>
      </>
    );
  return <span className="text-white/90">{line}</span>;
}

export function CodeBlock({ block }: { block: NotionBlock }) {
  const code = (block.richText ?? []).map((s) => s.text).join("");
  const [copied, setCopied] = useState(false);
  // The fence's info string: a language or, as in ```robots.txt, a file name.
  const language = block.language && block.language !== "text" ? block.language : "";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: nothing to do */
    }
  };
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-hero-black shadow-2">
      <div className="flex items-center justify-between border-b border-white/10 bg-hero-black-elev px-4 py-2">
        <span className="font-mono text-[0.72rem] font-medium text-white/50">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.85rem] leading-7">
        <code>
          {code.split("\n").map((line, i) => (
            <div key={i}>
              <CodeLine line={line} />
              {line === "" && "\u00a0"}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ---------- table ---------- */

export function Table({ block }: { block: NotionBlock }) {
  const rows = block.rows ?? [];
  if (!rows.length) return null;
  const [head, ...body] = block.hasColumnHeader ? rows : [null, ...rows];
  // A comparison table (empty corner cell, row labels down the side) gets its
  // last column lifted: that's the "new way" the article argues for.
  const comparison = !!head && head.length >= 3 && !head[0].some((s) => s.text.trim());
  const last = (head ?? rows[0]).length - 1;
  const lift = (col: number) => comparison && col === last;
  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-1">
      <table className="w-full min-w-[36rem] border-collapse text-left text-[0.9rem]">
        {head && (
          <thead>
            <tr className="border-b border-border">
              {head.map((cell, c) => (
                <th
                  key={c}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
                    lift(c) && "bg-volt/[0.07] text-volt",
                  )}
                >
                  <Rich spans={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border">
          {body.map((row, r) => (
            <tr key={r}>
              {(row ?? []).map((cell, c) =>
                comparison && c === 0 ? (
                  <th key={c} scope="row" className="px-4 py-3 align-top font-semibold text-ink">
                    <Rich spans={cell} />
                  </th>
                ) : (
                  <td
                    key={c}
                    className={cn(
                      "px-4 py-3 align-top leading-relaxed text-ink/75",
                      lift(c) && "bg-volt/[0.07] font-medium text-ink",
                    )}
                  >
                    <Rich spans={cell} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- headings ---------- */

function Heading({ block }: { block: NotionBlock }) {
  const { anchors } = useContext(BlockContext);
  const id = anchors.get(block.id);
  const Tag = block.type === "heading_1" ? "h2" : block.type === "heading_2" ? "h3" : "h4";
  const size = {
    h2: "mt-16 text-[1.6rem] font-bold leading-tight sm:text-[1.9rem]",
    h3: "mt-11 text-[1.25rem] font-semibold leading-snug sm:text-[1.35rem]",
    h4: "mt-8 text-[1.05rem] font-semibold leading-snug",
  }[Tag];
  return (
    <Tag
      id={id}
      className={cn("group relative scroll-mt-28 font-display tracking-tight text-ink", size)}
    >
      <Rich spans={block.richText} />
      {id && (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 inline-flex translate-y-[-0.1em] align-middle text-muted-foreground/0 transition-colors group-hover:text-muted-foreground hover:!text-volt focus-visible:text-volt"
        >
          <Link2 className="h-[0.7em] w-[0.7em]" />
        </a>
      )}
    </Tag>
  );
}

/* ---------- single block ---------- */

const PARAGRAPH = "mt-6 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.125rem]";

function Block({ block }: { block: NotionBlock }) {
  const { figureNumbers } = useContext(BlockContext);
  switch (block.type) {
    case "paragraph":
      if (!block.richText || block.richText.length === 0) return <div className="h-3" />;
      return (
        <p className={PARAGRAPH}>
          <Rich spans={block.richText} />
        </p>
      );
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <Heading block={block} />;
    case "quote":
      return (
        <blockquote className="my-10 border-l-[3px] border-volt pl-6 font-display text-[1.3rem] font-medium leading-snug tracking-tight text-ink sm:text-[1.45rem]">
          <Rich spans={block.richText} />
        </blockquote>
      );
    case "callout":
      return (
        <div className="my-8 flex gap-3.5 rounded-2xl border border-border bg-surface p-5">
          {block.icon && <span className="text-xl leading-none">{block.icon}</span>}
          <div className="text-[1rem] leading-relaxed text-ink/80 [&>p:first-child]:mt-0">
            <Rich spans={block.richText} />
            <Children blocks={block.children} />
          </div>
        </div>
      );
    case "code":
      return <CodeBlock block={block} />;
    case "table":
      return <Table block={block} />;
    case "figure":
      return (
        <ArticleFigure
          id={block.url ?? ""}
          alt={block.alt}
          caption={block.caption?.length ? <Rich spans={block.caption} /> : undefined}
          number={figureNumbers.get(block.id)}
        />
      );
    case "image":
      if (!block.url) return null;
      return (
        <figure className="my-10">
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
      return (
        <div className="my-12 flex justify-center gap-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-ink/25" />
          ))}
        </div>
      );
    case "to_do":
      return (
        <label className="mt-3 flex items-start gap-2.5 text-[1.0625rem] leading-relaxed text-ink/80">
          <input type="checkbox" checked={block.checked} readOnly className="mt-1.5 accent-volt" />
          <span>
            <Rich spans={block.richText} />
          </span>
        </label>
      );
    default:
      if (block.richText && block.richText.length)
        return (
          <p className={PARAGRAPH}>
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
    <li className="pl-1.5 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.125rem]">
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
      const cls = cn(
        nested ? "mt-2" : "mt-5",
        "space-y-2.5 pl-6",
        ordered
          ? "list-decimal marker:text-[0.95em] marker:font-semibold marker:text-volt"
          : "list-disc marker:text-volt",
      );
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
