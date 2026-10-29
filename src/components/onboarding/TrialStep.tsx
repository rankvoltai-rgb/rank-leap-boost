/**
 * Onboarding's last step: the paywall.
 *
 * The plan is built and saved; this is where the card goes in and the 7-day
 * trial starts. It isn't skippable — /dashboard sends anyone who has never had
 * a subscription back here — so there is no "not yet", only a way to sign out.
 * The card form sits under the pitch, not instead of it: what's queued, what
 * it's projected to bring, and exactly what the card is used for — a $1 hold,
 * released at once, then the plan seven days from today unless cancelled.
 *
 * Reached two ways: straight from step 3, carrying the plan just confirmed;
 * or on a later visit (a refresh, a closed tab, an account from before the
 * paywall), when the plan is read back from the saved site.
 */
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CheckIcon } from "@/components/dashboard/icons";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { useSignOut } from "@/components/dashboard/use-sign-out";
import {
  confirmTrialCheckout,
  getSubscription,
  IS_MOCK,
  listBlogs,
  listSites,
  startTrial,
  type DraftKeyword,
  type DraftTitle,
} from "@/lib/data";
import { PLAN_PRICE_LOOKUP_KEY, TRIAL_DAYS, afterTrialCopy } from "@/data/pricing";
import { domainOf } from "@/lib/site-meta";
import { landingAfterOnboarding } from "@/lib/pending-intent";
import { OnboardingShell, PRIMARY_BUTTON, StepHeader } from "./shell";
import { PlanRail, ProjectionStrip } from "./TrafficProjection";

/** The plan as step 3 left it — enough to keep the rail's projection on screen. */
export interface TrialSnapshot {
  url: string;
  brandName: string;
  logoUrl: string | null;
  keywords: DraftKeyword[];
  titles: DraftTitle[];
}

/** The saved site's plan, for a visit that didn't come straight from step 3. */
async function loadSavedPlan(): Promise<TrialSnapshot> {
  const sites = await listSites();
  const site = sites.find((s) => s.kind === "primary") ?? sites[0];
  const blogs = site ? await listBlogs(site.id) : [];
  const titles: DraftTitle[] = blogs
    .filter((b) => b.status === "scheduled" || b.status === "opportunity")
    .map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      keyword: b.keyword ?? "",
      traffic_estimate: b.traffic_estimate,
      competition: b.competition ?? "",
      ai_signal: b.ai_signal,
    }));
  return {
    url: site?.website_url ?? "",
    brandName: site?.brand_name ?? "",
    logoUrl: site?.avatar_url ?? null,
    keywords: [],
    titles,
  };
}

const EMPTY: TrialSnapshot = { url: "", brandName: "", logoUrl: null, keywords: [], titles: [] };

export function TrialStep({ snapshot }: { snapshot?: TrialSnapshot }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const signOut = useSignOut();
  const [busy, setBusy] = useState(false);
  const { data: saved } = useQuery({
    queryKey: ["onboarding", "saved-plan"],
    queryFn: loadSavedPlan,
    enabled: !snapshot,
  });
  const plan = snapshot ?? saved ?? EMPTY;
  const domain = plan.url.trim() ? domainOf(plan.url) : "";
  const queued = plan.titles.length;
  const projection = { step: 4 as const, domain, keywords: plan.keywords, titles: plan.titles };

  /**
   * The card is in. Settle the subscription before leaving — the dashboard
   * route reads it, and a stale "no subscription" would bounce straight back
   * here — then say plainly if the card check failed: the trial exists, but
   * nothing writes until the card is updated.
   */
  async function finish(settle: () => Promise<{ cardVerified: boolean | null }>) {
    setBusy(true);
    try {
      const { cardVerified } = await settle();
      queryClient.removeQueries({ queryKey: ["subscription"] });
      const subscription = await queryClient.fetchQuery({
        queryKey: ["subscription"],
        queryFn: getSubscription,
      });
      if (!subscription) {
        throw new Error(
          "Your card went through, but the trial hasn't shown up yet. Refresh in a moment.",
        );
      }
      if (cardVerified === false) {
        toast.warning(
          "Your trial started, but we couldn't verify your card. Update it from the dashboard to start writing.",
        );
      } else {
        toast.success(`Your ${TRIAL_DAYS}-day trial is live. Welcome to Rankbox.`);
      }
      // Agencies from the white-label page go on to Studio to add client sites.
      navigate({ to: landingAfterOnboarding() });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't start the trial.");
      setBusy(false);
    }
  }

  return (
    <OnboardingShell
      active={4}
      onStep={() => undefined}
      rail={
        <PlanRail
          {...projection}
          brandName={plan.brandName}
          logoUrl={plan.logoUrl}
          onStep={() => undefined}
        />
      }
    >
      <ProjectionStrip {...projection} />
      <StepHeader
        n={4}
        title={`Start your ${TRIAL_DAYS}-day free trial`}
        subtitle={
          queued > 0
            ? `${queued} articles are planned and ready. Add a card and autopilot starts writing and publishing them today.`
            : "Your plan is ready. Add a card and autopilot starts writing and publishing today."
        }
      />

      <ul className="space-y-2.5">
        {[
          "Your first articles written and published for you during the trial",
          `Cancel any time in the next ${TRIAL_DAYS} days and you're never charged`,
          "Keep everything published during the trial, whatever you decide",
        ].map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-[0.95rem] text-ink">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
        <p className="text-sm leading-relaxed text-ink">
          A card is required to start. We place a <span className="font-semibold">$1 hold</span> to
          verify it and release it right away, so nothing is charged today. Your plan starts at{" "}
          <span className="font-semibold">{afterTrialCopy()}</span> {TRIAL_DAYS} days from today
          unless you cancel first.
        </p>
        <div className="mt-5">
          {IS_MOCK ? (
            <button
              type="button"
              className={`${PRIMARY_BUTTON} w-full`}
              disabled={busy}
              onClick={() =>
                void finish(async () => {
                  await startTrial();
                  return { cardVerified: true };
                })
              }
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Start free trial
            </button>
          ) : (
            <StripeEmbeddedCheckout
              priceId={PLAN_PRICE_LOOKUP_KEY}
              onComplete={(sessionId) => void finish(() => confirmTrialCheckout(sessionId))}
            />
          )}
        </div>
        {busy && !IS_MOCK && (
          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Starting your trial…
          </p>
        )}
      </div>

      <p className="mt-6 pb-10 text-center text-xs text-muted-foreground">
        Not the right account?{" "}
        <button
          type="button"
          onClick={() => void signOut()}
          className="font-medium text-ink underline-offset-4 hover:underline"
        >
          Sign out
        </button>
      </p>
    </OnboardingShell>
  );
}
