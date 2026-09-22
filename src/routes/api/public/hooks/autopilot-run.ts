import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron-triggered endpoint. Generates the next due article for every site with
 * autopilot enabled, paced by that site's weekly cadence.
 *
 * Requires AUTOPILOT_CRON_SECRET, supplied as `Authorization: Bearer <secret>`
 * or `?secret=`. This was previously unauthenticated: any anonymous POST
 * triggered paid LLM + Firecrawl work for every enabled account and consumed
 * their credits.
 *
 * Fails CLOSED when the secret is unset — an unset secret is exactly the state
 * that left it open, so refusing is the safe default. Set the env var and
 * point your scheduler at it.
 */
function isAuthorized(request: Request): boolean {
  const expected = process.env.AUTOPILOT_CRON_SECRET;
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

export const Route = createFileRoute("/api/public/hooks/autopilot-run")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthorized(request)) {
          return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
        }
        try {
          const { runAutopilot } = await import("@/lib/autopilot.server");
          const result = await runAutopilot();
          return Response.json({ ok: true, ...result });
        } catch (err) {
          console.error("autopilot-run failed", err);
          return Response.json(
            { ok: false, error: err instanceof Error ? err.message : "unknown" },
            { status: 500 },
          );
        }
      },
    },
  },
});
