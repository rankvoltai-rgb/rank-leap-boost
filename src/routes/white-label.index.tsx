import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/sublanding/white-label/_index/head";
import { WhiteLabelHubPage } from "@/sublanding/white-label/_index/Page";

export const Route = createFileRoute("/white-label/")({ head, component: WhiteLabelHubPage });
