import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SITES_QUERY_KEY, useActiveSite } from "@/components/dashboard/site-context";
import { StudioCheckout } from "@/components/studio/StudioCheckout";
import { StudioGate } from "@/components/studio/StudioGate";
import { reducedMotion } from "@/components/onboarding/constants";
import { StepHeader, type Step } from "@/components/onboarding/shell";
import { Part1Profile, type Part1Value } from "@/components/onboarding/Part1Profile";
import { Part2Analysis, type Part2Value } from "@/components/onboarding/Part2Analysis";
import { Part3Forecast } from "@/components/onboarding/Part3Forecast";
import { PlanRail, ProjectionStrip } from "@/components/onboarding/TrafficProjection";
import { normalizeDomain } from "@/lib/exchange/domain";
import {
  addStudioSite,
  commitOnboarding,
  getCurrentUser,
  getSubscription,
  type DraftTitle,
} from "@/lib/data";
import { domainOf } from "@/lib/site-meta";
import { studioBlockFor } from "@/lib/studio";
import {
  clearStudioDraft,
  emptyStudioDraft,
  loadStudioDraft,
  saveStudioDraft,
  type StudioDraft,
} from "@/lib/studio-draft";

export const Route = createFileRoute("/_authenticated/dashboard/studio/new")({
  component: AddSitePage,
});

/**
 * Adding a site to Studio: the same three steps as onboarding — the site, its
 * keywords, its first month of content — so a client site starts exactly as
 * well set up as the account's own. The price appears once, at the end, in
 * the review before anything is charged.
 */
function AddSitePage() {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
  });
  const block = isLoading ? null : studioBlockFor(subscription);

  return (
    <div>
      <Link
        to="/dashboard/studio"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Studio
      </Link>
      {isLoading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : block ? (
        <div className="max-w-2xl space-y-4">
          <h1 className="text-[1.7rem] font-semibold tracking-tight text-ink">Add a site</h1>
          <StudioGate block={block} message={null} />
        </div>
      ) : (
        <AddSiteFlow />
      )}
    </div>
  );
}

function AddSiteFlow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { allSites } = useActiveSite();
  const { data: user } = useQuery({ queryKey: ["auth", "user"], queryFn: getCurrentUser });
  const owner = user?.id ?? "";

  const [draft, setDraft] = useState<StudioDraft>(emptyStudioDraft);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Resume where this account left off, once we know whose browser this is.
  const restored = useRef(false);
  useEffect(() => {
    if (!owner || restored.current) return;
    restored.current = true;
    const saved = loadStudioDraft(owner);
    if (saved) setDraft(saved);
  }, [owner]);

  const patch = useCallback(
    (next: Partial<StudioDraft>) => {
      setDraft((prev) => {
        const merged = { ...prev, ...next };
        saveStudioDraft(owner, merged);
        return merged;
      });
    },
    [owner],
  );

  const step: Step = draft.step === "done" ? 1 : draft.step;
  const goTo = useCallback((s: Step) => patch({ step: s }), [patch]);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document
      .querySelector("main")
      ?.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [step]);

  const part1: Part1Value = useMemo(
    () => ({
      url: draft.url,
      brandName: draft.brandName,
      description: draft.description,
      logoUrl: draft.logoUrl,
      logoSource: null,
    }),
    [draft.url, draft.brandName, draft.description, draft.logoUrl],
  );

  const part2: Part2Value = useMemo(
    () => ({
      niche: draft.niche,
      audience: draft.audience,
      brandTone: draft.brandTone,
      geo: draft.geo,
      services: draft.services,
      competitors: draft.competitors,
      semanticClusters: draft.semanticClusters,
      aiVisibility: draft.aiVisibility,
      missingOpportunities: draft.missingOpportunities,
      keywords: draft.keywords,
      analyzedUrl: draft.analyzedUrl,
    }),
    [draft],
  );

  /** A site already on the account, live or archived, isn't added twice. */
  function duplicateOf(url: string) {
    const domain = normalizeDomain(url);
    if (!domain) return null;
    return (
      allSites.find(
        (s) => s.status !== "pending" && s.website_url && normalizeDomain(s.website_url) === domain,
      ) ?? null
    );
  }

  function next1() {
    if (draft.paidSiteId) return goTo(2);
    const clash = duplicateOf(draft.url);
    if (clash) {
      toast.error(
        clash.status === "archived"
          ? `${domainOf(draft.url)} is in your archived sites. Restore it from Studio instead.`
          : `${domainOf(draft.url)} is already one of your sites.`,
      );
      return;
    }
    goTo(2);
  }

  /** Writes the plan onto a site that's already paid for. Never charges. */
  async function finish(siteId: string) {
    setFinishing(true);
    try {
      await commitOnboarding(draft, siteId);
      clearStudioDraft();
      // The site list must hold the new site before the dashboard opens on it,
      // or `?site=` would be read as stale and dropped.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["subscription"] }),
      ]);
      toast.success(`${draft.brandName.trim() || domainOf(draft.url)} is live in Studio.`);
      void navigate({ to: "/dashboard", search: { site: siteId } });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? `The site is paid for, but its plan didn't save: ${err.message}`
          : "The site is paid for, but its plan didn't save. Try again.",
      );
      setFinishing(false);
    }
  }

  async function pay(prorationDate: number | undefined) {
    const { siteId } = await addStudioSite({
      url: draft.url.trim(),
      brandName: draft.brandName.trim(),
      description: draft.description.trim(),
      logoUrl: draft.logoUrl,
      prorationDate,
    });
    patch({ paidSiteId: siteId });
    await queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY });
    setCheckoutOpen(false);
    await finish(siteId);
  }

  function confirm() {
    if (draft.paidSiteId) void finish(draft.paidSiteId);
    else setCheckoutOpen(true);
  }

  const domain = draft.url.trim() ? domainOf(draft.url) : "";
  const keywords = draft.analyzedUrl === draft.url ? draft.keywords : [];
  const projection = { step, domain, keywords, titles: draft.titles };
  const reduced = reducedMotion();

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] xl:gap-16">
      <div className="min-w-0 max-w-[42rem]">
        {draft.paidSiteId && (
          <p className="mb-6 rounded-card border border-success/25 bg-success/10 px-4 py-3 text-sm text-ink">
            {domain || "This site"} is paid for and in Studio. Finish its plan to start publishing.
          </p>
        )}
        <ProjectionStrip {...projection} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}
          >
            {step === 1 && (
              <>
                <StepHeader
                  n={1}
                  title={domain ? "Is this the brand?" : "Which site are you adding?"}
                  subtitle={
                    domain
                      ? "We read the site and filled this in. Fix anything that's off — it briefs every article we write for it."
                      : "Enter the site's address and we'll fill in the rest: its brand name, what it does, and its logo."
                  }
                />
                <Part1Profile
                  value={part1}
                  onChange={(p) =>
                    // Once paid for, the site is fixed; its details are edited in Settings.
                    draft.paidSiteId ? undefined : patch(p)
                  }
                  onNext={next1}
                />
              </>
            )}

            {step === 2 && (
              <Part2Analysis
                url={draft.url}
                brandName={draft.brandName}
                description={draft.description}
                value={part2}
                onChange={(p) => patch(p.keywords ? { ...p, titles: [] } : p)}
                onNext={() => goTo(3)}
                onBack={() => goTo(1)}
              />
            )}

            {step === 3 && (
              <Part3Forecast
                plan={{
                  url: draft.url,
                  brandName: draft.brandName,
                  description: draft.description,
                  niche: draft.niche,
                  audience: draft.audience,
                  geo: draft.geo,
                  competitors: draft.competitors,
                  semanticClusters: draft.semanticClusters,
                  missingOpportunities: draft.missingOpportunities,
                  keywords: draft.keywords,
                }}
                titles={draft.titles}
                onTitles={(titles: DraftTitle[]) => patch({ titles })}
                onConfirm={confirm}
                onBack={() => goTo(2)}
                confirming={finishing}
                confirmLabel={draft.paidSiteId ? "Finish setup" : "Review & add site"}
                queueNote="published one a day once the site is added"
                footnote={
                  draft.paidSiteId
                    ? "Already paid for. This only saves the plan."
                    : "You'll see the price before anything is charged. Edit or remove any article later."
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-0">
          <PlanRail
            {...projection}
            brandName={draft.brandName}
            logoUrl={draft.logoUrl}
            onStep={goTo}
            proof={false}
          />
        </div>
      </aside>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add {domain || "this site"} to Studio</DialogTitle>
            <DialogDescription>
              Check the numbers, then confirm. The site goes live the moment the payment does.
            </DialogDescription>
          </DialogHeader>
          {checkoutOpen && (
            <StudioCheckout
              site={{ brand_name: draft.brandName, website_url: draft.url }}
              payLabel="Add site"
              onPay={pay}
              onCancel={() => setCheckoutOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
