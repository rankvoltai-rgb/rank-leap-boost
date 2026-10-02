import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/sublanding/solutions/_index/head";
import { SolutionsHubPage } from "@/sublanding/solutions/_index/Page";

export const Route = createFileRoute("/solutions/")({ head, component: SolutionsHubPage });
