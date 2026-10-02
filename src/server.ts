import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { botFromUserAgent } from "./lib/lab/experiments";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Requests the lab experiments record (src/lib/lab): every /lab page, and bot
// visits to blog posts. Checked here so ordinary page views never load the
// logger.
function isLabLogged(request: Request): boolean {
  const path = new URL(request.url).pathname;
  if (path.startsWith("/lab/") || path === "/lab") return true;
  return path.startsWith("/blog/") && botFromUserAgent(request.headers.get("user-agent")) !== null;
}

// Docs pages as markdown for agents (<page>.md, or Accept: text/markdown).
// Checked here so ordinary page views never load the docs index.
function mayBeDocsMarkdown(request: Request): boolean {
  const path = new URL(request.url).pathname;
  return path === "/docs" || path === "/docs.md" || path.startsWith("/docs/");
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      if (mayBeDocsMarkdown(request)) {
        const docs = await import("./lib/docs/agent.server");
        if (docs.isDocsMarkdownRequest(request)) return docs.docsMarkdownResponse(request);
      }
      const handler = await getServerEntry();
      const response = await normalizeCatastrophicSsrResponse(
        await handler.fetch(request, env, ctx),
      );
      if (isLabLogged(request)) {
        const { logLabRequest } = await import("./lib/lab/hits.server");
        await logLabRequest(request, response);
      }
      return response;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
