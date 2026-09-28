import { createFileRoute, redirect } from "@tanstack/react-router";

/* There's no /solutions hub yet: two pages don't make one. A visitor who trims
   a solutions URL lands on the features they're built from. */
export const Route = createFileRoute("/solutions/")({
  beforeLoad: () => {
    throw redirect({ to: "/features", statusCode: 301 });
  },
});
