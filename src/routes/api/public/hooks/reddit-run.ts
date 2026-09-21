import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron-triggered endpoint for Reddit presence: re-syncs the paid gate, runs
 * the weekly discovery sweep for accounts that are due, checks that posted
 * replies are still there, and re-measures the threads members are in. Run it
 * daily; the sweep stage paces itself. See runRedditCycle for the stages.
 *
 * Requires REDDIT_CRON_SECRET (falling back to AUTOPILOT_CRON_SECRET, so one
 * secret can serve every job), supplied as `Authorization: Bearer <secret>` or
 * `?secret=`. Fails CLOSED when neither is set: every run spends money at
 * Apify, so an open endpoint is a direct line into a metered account.
 */
function isAuthorized(request: Request): boolean {
  const expected = process.env.REDDIT_CRON_SECRET || process.env.AUTOPILOT_CRON_SECRET;
  if (!expected) return false;

  const header = request.headers.get("authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const fromQuery = new URL(request.url).searchParams.get("secret") ?? "";
  const supplied = bearer || fromQuery;
  if (!supplied || supplied.length !== expected.length) return false;

  // Constant-time-ish compare so a wrong secret cannot be recovered by timing.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  }
  return diff === 0;
}

export const Route = createFileRoute("/api/public/hooks/reddit-run")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthorized(request)) {
          return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
        }
        try {
          const { runRedditCycle } = await import("@/lib/reddit/cycle.server");
          const report = await runRedditCycle();
          return Response.json({ ok: true, ...report });
        } catch (err) {
          console.error("reddit-run failed", err);
          return Response.json(
            { ok: false, error: err instanceof Error ? err.message : "unknown" },
            { status: 500 },
          );
        }
      },
    },
  },
});
