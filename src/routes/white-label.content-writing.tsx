import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/sublanding/white-label/content-writing/head";
import { ContentWritingPage } from "@/sublanding/white-label/content-writing/Page";

export const Route = createFileRoute("/white-label/content-writing")({
  head,
  component: ContentWritingPage,
});
