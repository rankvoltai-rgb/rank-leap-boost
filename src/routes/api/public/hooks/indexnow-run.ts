import { createFileRoute } from "@tanstack/react-router";

/**
 * Vercel Cron endpoint (vercel.json, daily): tells IndexNow which rankbox.xyz
 * pages are new or changed. See runIndexNow.
 *
 * Vercel Cron sends GET with `Authorization: Bearer $CRON_SECRET`. Fails
 * CLOSED when CRON_SECRET is unset. A run only announces what changed, so an
 * open endpoint couldn't spam IndexNow, but every call still fetches the
 * sitemap and reads the database.
 */
function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const header = request.headers.get("authorization") ?? "";
  const supplied = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  if (!supplied || supplied.length !== expected.length) return false;

  // Constant-time-ish compare so a wrong secret cannot be recovered by timing.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  }
  return diff === 0;
}

export const Route = createFileRoute("/api/public/hooks/indexnow-run")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isAuthorized(request)) {
          return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
        }
        try {
          const { runIndexNow } = await import("@/lib/indexnow.server");
          const report = await runIndexNow();
          return Response.json({ ok: true, ...report });
        } catch (err) {
          console.error("indexnow-run failed", err);
          return Response.json(
            { ok: false, error: err instanceof Error ? err.message : "unknown" },
            { status: 500 },
          );
        }
      },
    },
  },
});
