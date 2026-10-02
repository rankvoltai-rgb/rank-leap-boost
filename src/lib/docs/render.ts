/**
 * Docs markdown -> HTML, plus the outline the "On this page" rail is built
 * from. Runs on the server; the page ships finished HTML.
 *
 * Beyond GitHub-flavoured markdown it understands:
 *   - `> [!NOTE]` / `[!TIP]` / `[!IMPORTANT]` / `[!WARNING]` callouts;
 *   - a code fence's title, ```bash title="cURL"```, and consecutive titled
 *     fences rendered as one tabbed group;
 *   - `{{availability:<platform>}}` on its own line (see availabilityNote).
 *
 * Headings get ids from their text (lowercased, punctuation dropped, spaces
 * to hyphens), the scheme the pages use to link to each other's sections.
 */
import { Marked, type Token, type Tokens } from "marked";
import { availabilityNote } from "@/data/docs";
import { highlight } from "./highlight";

export interface DocHeading {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface RenderedDoc {
  html: string;
  headings: DocHeading[];
}

const CALLOUTS = {
  NOTE: { kind: "note", label: "Note" },
  TIP: { kind: "tip", label: "Tip" },
  IMPORTANT: { kind: "important", label: "Important" },
  WARNING: { kind: "warning", label: "Warning" },
  CAUTION: { kind: "warning", label: "Caution" },
} as const;

const CALLOUT_MARKER = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*\n?/;

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Terminal",
  sh: "Terminal",
  shell: "Terminal",
  json: "JSON",
  http: "HTTP",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TypeScript",
  js: "JavaScript",
  javascript: "JavaScript",
  python: "Python",
  py: "Python",
  php: "PHP",
  html: "HTML",
  yaml: "YAML",
  toml: "TOML",
  diff: "Diff",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Heading text -> anchor id. Shared with the tests and the search index. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Strips inline markdown so a heading reads as plain text. */
function plainInline(text: string): string {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim();
}

/**
 * `{{availability:x}}` lines -> a NOTE callout in markdown, so the HTML page
 * and the .md copy agents read say the same thing.
 */
export function resolveDirectives(markdown: string): string {
  return markdown.replace(/^\{\{availability:([a-z-]+)\}\}[ \t]*$/gm, (line, id: string) => {
    const note = availabilityNote(id);
    return note ? `> [!NOTE]\n> **Availability:** ${note.text}` : "";
  });
}

function parseInfo(info: string | undefined): { lang: string; title: string | null } {
  const raw = (info ?? "").trim();
  const lang = raw.match(/^[^\s{]+/)?.[0] ?? "text";
  const title = raw.match(/title=(?:"([^"]*)"|'([^']*)'|(\S+))/);
  return { lang, title: title ? (title[1] ?? title[2] ?? title[3]) : null };
}

const COPY_BUTTON =
  '<button type="button" class="docs-copy" data-copy aria-label="Copy code">Copy</button>';

function codeBody(code: Tokens.Code, lang: string): string {
  return `<pre><code class="language-${escapeHtml(lang)}">${highlight(code.text, lang)}</code></pre>`;
}

function renderCodeBlock(code: Tokens.Code): string {
  const { lang, title } = parseInfo(code.lang);
  const label = title ?? LANGUAGE_LABELS[lang.toLowerCase()] ?? "";
  return [
    `<div class="docs-code" data-lang="${escapeHtml(lang)}">`,
    `<div class="docs-code-bar"><span class="docs-code-title">${escapeHtml(label)}</span>${COPY_BUTTON}</div>`,
    codeBody(code, lang),
    `</div>`,
  ].join("");
}

let groupSeq = 0;

function renderCodeGroup(codes: Tokens.Code[]): string {
  const group = `cg${++groupSeq}`;
  const tabs = codes
    .map((c, i) => {
      const { title } = parseInfo(c.lang);
      const selected = i === 0;
      return `<button type="button" role="tab" id="${group}-t${i}" aria-controls="${group}-p${i}" aria-selected="${selected}" tabindex="${selected ? 0 : -1}" data-tab="${i}">${escapeHtml(title ?? "")}</button>`;
    })
    .join("");
  const panels = codes
    .map((c, i) => {
      const { lang } = parseInfo(c.lang);
      return `<div role="tabpanel" id="${group}-p${i}" aria-labelledby="${group}-t${i}" data-panel="${i}"${i === 0 ? "" : " hidden"}>${codeBody(c, lang)}</div>`;
    })
    .join("");
  return [
    `<div class="docs-code docs-code-group" data-tabs>`,
    `<div class="docs-code-bar"><div class="docs-tabs" role="tablist" aria-label="Code examples">${tabs}</div>${COPY_BUTTON}</div>`,
    panels,
    `</div>`,
  ].join("");
}

/** Runs of two or more titled code fences become one tabbed group. */
function groupCodeTokens(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type !== "code" || !parseInfo((t as Tokens.Code).lang).title) {
      out.push(t);
      continue;
    }
    const run: Tokens.Code[] = [t as Tokens.Code];
    let j = i + 1;
    while (j < tokens.length) {
      const next = tokens[j];
      if (next.type === "space") {
        j++;
        continue;
      }
      if (next.type === "code" && parseInfo((next as Tokens.Code).lang).title) {
        run.push(next as Tokens.Code);
        j++;
        continue;
      }
      break;
    }
    if (run.length < 2) {
      out.push(t);
      continue;
    }
    const html = renderCodeGroup(run);
    out.push({ type: "html", raw: html, text: html, block: true, pre: false } as Tokens.HTML);
    i = j - 1;
  }
  return out;
}

const CALLOUT_ICONS: Record<string, string> = {
  note: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"/>',
  important: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
  warning: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5h.01"/>',
};

export function renderDoc(markdown: string): RenderedDoc {
  const headings: DocHeading[] = [];
  const used = new Map<string, number>();
  groupSeq = 0;

  const md = new Marked({ gfm: true, breaks: false });
  md.use({
    renderer: {
      heading(this: { parser: { parseInline: (t: Token[]) => string } }, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        // The page renders the title as its h1; a stray "#" becomes an h2.
        const depth = Math.min(Math.max(token.depth, 2), 4);
        const text = plainInline(token.text);
        const base = slugifyHeading(text) || "section";
        const n = used.get(base) ?? 0;
        used.set(base, n + 1);
        const id = n ? `${base}-${n + 1}` : base;
        if (depth === 2 || depth === 3) headings.push({ id, text, depth });
        return `<h${depth} id="${id}" class="docs-h"><a href="#${id}" class="docs-anchor">${inner}</a></h${depth}>`;
      },
      code(token: Tokens.Code) {
        return renderCodeBlock(token);
      },
      blockquote(this: { parser: { parse: (t: Token[]) => string } }, token: Tokens.Blockquote) {
        const marker = CALLOUT_MARKER.exec(token.text);
        if (!marker) return `<blockquote>${this.parser.parse(token.tokens)}</blockquote>`;
        const { kind, label } = CALLOUTS[marker[1] as keyof typeof CALLOUTS];
        const body = this.parser.parse(md.lexer(token.text.slice(marker[0].length)));
        return [
          `<aside class="docs-callout" data-kind="${kind}">`,
          `<svg class="docs-callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CALLOUT_ICONS[kind]}</svg>`,
          `<div class="docs-callout-body"><p class="docs-callout-label">${label}</p>${body}</div>`,
          `</aside>`,
        ].join("");
      },
      link(this: { parser: { parseInline: (t: Token[]) => string } }, token: Tokens.Link) {
        const inner = this.parser.parseInline(token.tokens);
        const href = escapeHtml(token.href);
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        const external =
          /^https?:\/\//.test(token.href) && !token.href.startsWith("https://rankbox.xyz");
        return external
          ? `<a href="${href}"${title} target="_blank" rel="noopener noreferrer">${inner}</a>`
          : `<a href="${href}"${title}>${inner}</a>`;
      },
      table(this: { parser: { parseInline: (t: Token[]) => string } }, token: Tokens.Table) {
        const cell = (c: Tokens.TableCell, tag: "th" | "td") => {
          const align = c.align ? ` style="text-align:${c.align}"` : "";
          return `<${tag}${align}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        };
        const head = `<tr>${token.header.map((c) => cell(c, "th")).join("")}</tr>`;
        const rows = token.rows.map((r) => `<tr>${r.map((c) => cell(c, "td")).join("")}</tr>`);
        return `<div class="docs-table"><table><thead>${head}</thead><tbody>${rows.join("")}</tbody></table></div>`;
      },
    },
  });

  const tokens = groupCodeTokens(md.lexer(resolveDirectives(markdown)));
  const html = md.parser(tokens);
  return { html, headings };
}
