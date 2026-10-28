import { createFileRoute, Outlet, redirect, retainSearchParams } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { ActiveSiteProvider, useActiveSite } from "@/components/dashboard/site-context";
import { BillingProvider } from "@/components/dashboard/billing-context";
import { BillingBanner } from "@/components/dashboard/BillingBanner";
import { RemovalBanner } from "@/components/studio/RemovalBanner";
import { getSubscription } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  // Which of the account's sites is on screen (see site-context.tsx). Absent
  // for the primary, so a single-site account's URLs never change. `billing`
  // marks a return from the portal's card update (see billing-context.tsx).
  validateSearch: (search: Record<string, unknown>): { site?: string; billing?: "updated" } => ({
    site: typeof search.site === "string" && search.site ? search.site : undefined,
    billing: search.billing === "updated" ? "updated" : undefined,
  }),
  // Every link inside the dashboard keeps the site it was opened on.
  search: { middlewares: [retainSearchParams(["site"])] },
  // The trial is the last step of onboarding, and it isn't optional: an
  // account that has never had a subscription goes back to that step. One
  // whose plan failed or ended still gets in — the billing banner says why
  // nothing is writing. Cached, so moving between pages doesn't refetch.
  beforeLoad: async ({ context }) => {
    const subscription = await context.queryClient.ensureQueryData({
      queryKey: ["subscription"],
      queryFn: getSubscription,
    });
    if (subscription === null) throw redirect({ to: "/onboarding" });
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { site, billing } = Route.useSearch();
  return (
    <ActiveSiteProvider requested={site}>
      <BillingProvider returned={billing === "updated"}>
        <div className="flex h-screen w-full overflow-hidden bg-card">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col bg-card">
            <TopBar />
            {/* relative: absolutely positioned bits inside (screen-reader labels,
                popovers' anchors) resolve against this scroller, so none can push
                the page itself taller than the screen. */}
            <main className="relative flex-1 overflow-y-auto p-6">
              <div className="mx-auto w-full max-w-6xl">
                <BillingBanner />
                <RemovalBanner />
                <SiteOutlet />
              </div>
            </main>
          </div>
        </div>
      </BillingProvider>
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
