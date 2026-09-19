import { createFileRoute } from "@tanstack/react-router";
import { AuthSplit } from "@/components/auth/AuthSplit";

export const Route = createFileRoute("/auth")({
  // Forwarded from the landing hero so the URL survives into onboarding.
  validateSearch: (search: Record<string, unknown>): { url?: string } => ({
    url: typeof search.url === "string" ? search.url : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign Up — Rankbox" },
      {
        name: "description",
        content:
          "Start getting Google & ChatGPT traffic in the next 7 days. Sign in, connect your site, and let Rankbox publish SEO-optimized articles on autopilot.",
      },
      { property: "og:title", content: "Sign Up — Rankbox" },
      {
        property: "og:description",
        content:
          "Sign in → connect site → done. Automatically research, write, and publish SEO articles that rank on Google and get cited by AI.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AuthSplit,
});
