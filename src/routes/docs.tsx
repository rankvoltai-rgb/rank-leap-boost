import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Footer } from "@/components/landing/Footer";
import { DocsChrome } from "@/components/docs/DocsChrome";
import { docsNavQuery } from "@/lib/docs/queries";

/** /docs and everything under it: the docs header, search, and the site footer. */
export const Route = createFileRoute("/docs")({
  loader: ({ context }) => context.queryClient.ensureQueryData(docsNavQuery),
  component: DocsLayout,
});

function DocsLayout() {
  const { data } = useSuspenseQuery(docsNavQuery);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background">
      <DocsChrome sections={data.sections} pathname={pathname}>
        <Outlet />
      </DocsChrome>
      <Footer />
    </div>
  );
}
