import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "@/components/auth/Onboarding";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get Started — Rankvolt" },
      {
        name: "description",
        content:
          "Add your website, let our AI analyze it, confirm the plan, and see your projected traffic before starting your free Rankvolt trial.",
      },
      { property: "og:title", content: "Get Started — Rankvolt" },
      {
        property: "og:description",
        content:
          "Enter your site, review the AI analysis, see your traffic forecast, and activate your engine in minutes.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Onboarding,
});