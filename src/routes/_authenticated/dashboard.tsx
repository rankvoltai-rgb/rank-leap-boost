import { createFileRoute, Outlet, retainSearchParams } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { ActiveSiteProvider, useActiveSite } from "@/components/dashboard/site-context";
import { RemovalBanner } from "@/components/studio/RemovalBanner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  // Which of the account's sites is on screen (see site-context.tsx). Absent
  // for the primary, so a single-site account's URLs never change.
  validateSearch: (search: Record<string, unknown>): { site?: string } => ({
    site: typeof search.site === "string" && search.site ? search.site : undefined,
  }),
  // Every link inside the dashboard keeps the site it was opened on.
  search: { middlewares: [retainSearchParams(["site"])] },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { site } = Route.useSearch();
  return (
    <ActiveSiteProvider requested={site}>
      <div className="flex h-screen w-full overflow-hidden bg-card">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col bg-card">
          <TopBar />
          {/* relative: absolutely positioned bits inside (screen-reader labels,
              popovers' anchors) resolve against this scroller, so none can push
              the page itself taller than the screen. */}
          <main className="relative flex-1 overflow-y-auto p-6">
            <div className="mx-auto w-full max-w-6xl">
              <RemovalBanner />
              <SiteOutlet />
            </div>
          </main>
        </div>
      </div>
    </ActiveSiteProvider>
  );
}

/**
 * The page, remounted per site. Forms, open panels and one-time reveals hold
 * local state about the site they were opened on; switching sites starts them
 * fresh instead of carrying one site's state onto another.
 */
function SiteOutlet() {
  const { siteId } = useActiveSite();
  return <Outlet key={siteId} />;
}
