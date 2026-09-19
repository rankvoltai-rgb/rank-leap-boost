import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-card">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-card">
        <TopBar />
        {/* relative: absolutely positioned bits inside (screen-reader labels,
            popovers' anchors) resolve against this scroller, so none can push
            the page itself taller than the screen. */}
        <main className="relative flex-1 overflow-y-auto p-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
