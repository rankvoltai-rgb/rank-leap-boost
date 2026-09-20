/**
 * The three-step onboarding: brand, then keywords, then the content plan, one
 * step on screen at a time, with a rail that keeps the projection and what's
 * been confirmed in view.
 *
 * The trial is not an onboarding step: step 3 confirms straight into the
 * dashboard, and generation is what prompts the trial later.
 *
 * Every change is written to a persisted draft — including the current step,
 * which lives in the draft rather than beside it, so a later field save can
 * never write a stale step back — and a refresh, an email-confirmation round
 * trip, or an accidental back button resumes where the user was.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  claimOnboardingDraft,
  clearOnboardingDraft,
  commitOnboarding,
  getCurrentUser,
  getOnboardingDraft,
  saveOnboardingDraft,
  type DraftTitle,
  type OnboardingDraft,
} from "@/lib/data";
import { firstNameOf } from "@/lib/auth";
import { clearPendingSiteUrl, resolvePendingSiteUrl } from "@/lib/pending-site";
import { domainOf } from "@/lib/site-meta";
import { reducedMotion } from "./constants";
import { OnboardingShell, StepHeader, type Step } from "./shell";
import { Part1Profile, type Part1Value } from "./Part1Profile";
import { Part2Analysis, type Part2Value } from "./Part2Analysis";
import { Part3Forecast } from "./Part3Forecast";
import { PlanRail, ProjectionStrip } from "./TrafficProjection";

function emptyDraft(url: string): OnboardingDraft {
  return {
    step: 1,
    url,
    brandName: "",
    description: "",
    logoUrl: null,
    firstName: "",
    niche: "",
    audience: "",
    brandTone: "",
    geo: "",
    services: [],
    competitors: [],
    semanticClusters: [],
    aiVisibility: [],
    missingOpportunities: [],
    keywords: [],
    analyzedUrl: "",
    titles: [],
    confirmedAt: null,
  };
}

/**
 * The saved draft, if it can be resumed.
 *
 * Drafts saved before the scan read real sites have no `analyzedUrl`; their
 * brand details and keywords are placeholders, so those restart from step 1
 * with only the URL carried over.
 */
function restorableDraft(): OnboardingDraft | null {
  const saved = getOnboardingDraft();
  if (!saved || saved.step === "done") return null;
  if (typeof saved.analyzedUrl !== "string") return emptyDraft(saved.url);
  return saved;
}

export function Onboarding({ searchUrl }: { searchUrl?: string }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  // Restore any saved progress; otherwise start from the carried URL.
  const [draft, setDraft] = useState<OnboardingDraft>(() => {
    const saved = restorableDraft();
    const url = resolvePendingSiteUrl(searchUrl);
    if (saved) {
      return url && !saved.url ? { ...saved, url } : saved;
    }
    return emptyDraft(url);
  });

  // A single persist point keeps every field, and the step, saved together.
  const patch = useCallback((next: Partial<OnboardingDraft>) => {
    setDraft((prev) => {
      const merged = { ...prev, ...next };
      saveOnboardingDraft(merged);
      return merged;
    });
  }, []);

  const step: Step = draft.step === "done" ? 1 : draft.step;
  const goTo = useCallback((s: Step) => patch({ step: s }), [patch]);

  // Each step opens at the top of the page, not wherever the last one ended.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [step]);

  // The name was given at sign-up, so it isn't asked for again here. A draft
  // left on this browser by a different account is dropped, not resumed.
  useEffect(() => {
    let active = true;
    void getCurrentUser().then(({ id, fullName }) => {
      if (!active) return;
      if (!claimOnboardingDraft(id)) {
        setDraft(emptyDraft(resolvePendingSiteUrl(searchUrl)));
      }
      patch({ firstName: firstNameOf(fullName) });
    });
    return () => {
      active = false;
    };
  }, [patch, searchUrl]);

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

  async function confirm() {
    setConfirming(true);
    try {
      await commitOnboarding(draft);
      clearPendingSiteUrl();
      clearOnboardingDraft();
      toast.success("You're set up. Welcome to Rankbox.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't finish setup.");
      setConfirming(false);
    }
  }

  const domain = draft.url.trim() ? domainOf(draft.url) : "";
  // Keywords analyzed for a different URL are stale; don't project from them.
  const keywords = draft.analyzedUrl === draft.url ? draft.keywords : [];
  const projection = { step, domain, keywords, titles: draft.titles };
  const reduced = reducedMotion();

  return (
    <OnboardingShell
      active={step}
      onStep={goTo}
      rail={
        <PlanRail
          {...projection}
          brandName={draft.brandName}
          logoUrl={draft.logoUrl}
          onStep={goTo}
        />
      }
    >
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
                title={domain ? "Is this your brand?" : "Start with your website"}
                subtitle={
                  domain
                    ? "We read your site and filled this in. Fix anything that's off. It briefs every article we write."
                    : "Enter your site and we'll fill in the rest: your brand name, what you do, and your logo."
                }
              />
              <Part1Profile value={part1} onChange={(p) => patch(p)} onNext={() => goTo(2)} />
            </>
          )}

          {step === 2 && (
            <Part2Analysis
              url={draft.url}
              brandName={draft.brandName}
              description={draft.description}
              value={part2}
              // A changed keyword set makes the planned articles stale; step 3
              // re-plans when it finds none.
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
              confirming={confirming}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </OnboardingShell>
  );
}
