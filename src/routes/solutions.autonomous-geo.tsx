import { createFileRoute } from "@tanstack/react-router";
import { head } from "@/sublanding/solutions/autonomous-geo/head";
import { AutonomousGeoPage } from "@/sublanding/solutions/autonomous-geo/Page";

export const Route = createFileRoute("/solutions/autonomous-geo")({
  head,
  component: AutonomousGeoPage,
});
