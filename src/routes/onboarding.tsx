import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "@/components/auth/Onboarding";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get Started — Rankvolt" },
      {
        name: "description",
        content:
          "Set up your brand, review your keywords, and choose your hosting to start your free Rankvolt trial.",
      },
      { property: "og:title", content: "Get Started — Rankvolt" },
      {
        property: "og:description",
        content:
          "Two quick steps: tell us about your brand, then review keywords and hosting to launch your traffic engine.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Onboarding,
});