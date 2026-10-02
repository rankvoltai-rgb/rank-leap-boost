/**
 * Docs as markdown for agents, answered before the app renders anything:
 *
 *   /docs.md, /docs/<section>.md, /docs/<section>/<page>.md   always markdown
 *   /docs/... with `Accept: text/markdown` preferred over HTML  markdown too
 *
 * Called from src/server.ts, which only reaches here for /docs paths.
 */
import { docsMarkdownFor } from "./content.server";

/** Whether the request's Accept header ranks markdown above HTML. */
function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const types = accept
    .toLowerCase()
    .split(",")
    .map((t) => t.split(";")[0].trim());
  const md = types.indexOf("text/markdown");
  if (md < 0) return false;
  const html = types.indexOf("text/html");
  return html < 0 || md < html;
}

export function isDocsMarkdownRequest(request: Request): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  const { pathname } = new URL(request.url);
  if (pathname === "/docs.md") return true;
  if (!pathname.startsWith("/docs/") && pathname !== "/docs") return false;
  if (pathname.endsWith(".txt")) return false;
  return pathname.endsWith(".md") || prefersMarkdown(request.headers.get("accept"));
}

export function docsMarkdownResponse(request: Request): Response {
  const { pathname } = new URL(request.url);
  const body = docsMarkdownFor(pathname === "/docs.md" ? "/docs" : pathname);
  const headers = {
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
    "X-Robots-Tag": "noindex",
  };
  if (!body) {
    return new Response(
      `# Not found\n\nThere is no docs page at ${pathname}. The full list is at https://rankbox.xyz/docs/llms.txt\n`,
      { status: 404, headers },
    );
  }
  return new Response(request.method === "HEAD" ? null : body, {
    headers: { ...headers, "Cache-Control": "public, max-age=3600" },
  });
}
