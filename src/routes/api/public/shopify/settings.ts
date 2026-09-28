import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Settings = z.object({
  blogId: z
    .string()
    .trim()
    .regex(/^gid:\/\/shopify\/Blog\/\d+$/),
  visible: z.boolean(),
  author: z.string().max(200),
});

/** Which blog, visible or hidden, and the author name. Starts publishing. */
export const Route = createFileRoute("/api/public/shopify/settings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { authenticate, errorResponse, fail, json, saveSettings } =
          await import("@/lib/shopify/app.server");
        const session = await authenticate(request);
        if (session instanceof Response) return session;
        const parsed = Settings.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return fail("Pick a blog to publish to.");
        try {
          return json(await saveSettings(session, parsed.data));
        } catch (err) {
          return errorResponse(err, "settings");
        }
      },
    },
  },
});
