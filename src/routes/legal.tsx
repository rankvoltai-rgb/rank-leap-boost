import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/legal")({
  component: LegalLayout,
});

function LegalLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="border-t border-border bg-surface/30">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}