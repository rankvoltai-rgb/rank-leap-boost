import { createFileRoute, redirect } from "@tanstack/react-router";
import { Onboarding } from "@/components/onboarding";
import { getSessionUser } from "@/lib/auth";
import { clearOnboardingDraft, listSites } from "@/lib/data";
import { IS_MOCK } from "@/lib/mock/mode";

export const Route = createFileRoute("/onboarding")({
  // Client-only: progress is restored from localStorage in a state
  // initializer, so a server render would disagree with the first client
  // render and trip a hydration mismatch. Same reason /_authenticated opts out.
  ssr: false,
  // The URL captured on the landing page arrives here as ?url=. It is also
  // mirrored into localStorage (see src/lib/pending-site.ts) because OAuth and
  // email confirmation both drop the query string.
  validateSearch: (search: Record<string, unknown>): { url?: string } => ({
    url: typeof search.url === "string" ? search.url : undefined,
  }),
  // Mock data is stored per local account, so onboarding needs one signed in.
  // Real mode stays open: email confirmation arrives here before a session exists.
  beforeLoad: async ({ search }) => {
    // Reading the session also finishes an OAuth sign-in: Supabase takes the
    // tokens the sign-in redirect left in the URL when its client first loads.
    const user = await getSessionUser();
    if (IS_MOCK && !user) {
      throw redirect({ to: "/auth", search: { url: search.url } });
    }
    // OAuth sends returning users here too; anyone who already finished
    // onboarding — who has at least one site — goes on to the dashboard.
    if (!IS_MOCK && user && (await listSites()).length > 0) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Get Started — Rankbox" },
      {
        name: "description",
        content:
          "Add your website, let our AI analyze it, confirm the plan, and see your projected traffic before starting your free Rankbox trial.",
      },
      { property: "og:title", content: "Get Started — Rankbox" },
      {
        property: "og:description",
        content:
          "Enter your site, review the AI analysis, see your traffic forecast, and activate your engine in minutes.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: OnboardingRoute,
  errorComponent: OnboardingError,
});

function OnboardingRoute() {
  const { url } = Route.useSearch();
  return <Onboarding searchUrl={url} />;
}

/**
 * Onboarding's own error screen. Progress lives in this browser, so the one
 * recovery the root screen can't offer is dropping it and starting clean.
 */
function OnboardingError({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Setup hit a snag</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something in your saved progress didn't load. Start over and you'll be set up in a couple
          of minutes.
        </p>
        <button
          type="button"
          onClick={() => {
            clearOnboardingDraft();
            window.location.assign("/onboarding");
          }}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-cta px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cta-hover"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
