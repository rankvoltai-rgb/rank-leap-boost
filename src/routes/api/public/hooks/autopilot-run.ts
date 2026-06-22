import { createFileRoute } from "@tanstack/react-router";

// Cron-triggered endpoint. Generates the next due article for every user who
// has autopilot enabled, paced by their weekly cadence. Called daily by pg_cron.
export const Route = createFileRoute("/api/public/hooks/autopilot-run")({
  server: {
    handlers: {
      POST: async () => {
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