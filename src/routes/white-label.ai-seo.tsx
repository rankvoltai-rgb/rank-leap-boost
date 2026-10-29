import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/sublanding/white-label/ai-seo/head";
import { WhiteLabelAiSeoPage } from "@/sublanding/white-label/ai-seo/Page";

export const Route = createFileRoute("/white-label/ai-seo")({
  head,
  component: WhiteLabelAiSeoPage,
});
