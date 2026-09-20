import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron-triggered endpoint for the backlink exchange: re-syncs the paid gate,
 * finds where articles went live, verifies hosted links (which is what moves
 * credits), charges back links that vanished, and refunds what never shipped.
 * Run it daily; see runExchangeCycle for the stages.
 *
 * Requires EXCHANGE_CRON_SECRET (falling back to AUTOPILOT_CRON_SECRET, so one
 * secret can serve both jobs), supplied as `Authorization: Bearer <secret>` or
 * `?secret=`. Fails CLOSED when neither is set: every run makes outbound
 * fetches to member sites and moves credits, so an open endpoint is not an
 * option.
 */
function isAuthorized(request: Request): boolean {
  const expected = process.env.EXCHANGE_CRON_SECRET || process.env.AUTOPILOT_CRON_SECRET;
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

export const Route = createFileRoute("/api/public/hooks/exchange-run")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthorized(request)) {
          return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
        }
        try {
          const { runExchangeCycle } = await import("@/lib/exchange/cycle.server");
          const report = await runExchangeCycle();
          return Response.json({ ok: true, ...report });
        } catch (err) {
          console.error("exchange-run failed", err);
          return Response.json(
            { ok: false, error: err instanceof Error ? err.message : "unknown" },
            { status: 500 },
          );
        }
      },
    },
  },
});
