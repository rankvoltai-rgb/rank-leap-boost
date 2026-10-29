import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/sublanding/white-label/pricing/head";
import { WhiteLabelPricingPage } from "@/sublanding/white-label/pricing/Page";

export const Route = createFileRoute("/white-label/pricing")({
  head,
  component: WhiteLabelPricingPage,
});
