import { createFileRoute } from "@tanstack/react-router";
import { AuthSplit } from "@/components/auth/AuthSplit";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign Up — RankPill" },
      {
        name: "description",
        content:
          "Start getting Google & ChatGPT traffic in the next 7 days. Sign in, connect your site, and let RankPill publish SEO-optimized articles on autopilot.",
      },
      { property: "og:title", content: "Sign Up — RankPill" },
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