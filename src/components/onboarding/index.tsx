/**
 * The three-step onboarding, laid out as an accordion: brand, then keywords,
 * then the content plan, each closing as the next opens. Proof sits in the
 * left column and the live traffic projection in the right.
 *
 * Replaces the previous four-stage flow that ended in Stripe checkout. The
 * trial is no longer an onboarding step — step 3 confirms straight into the
 * dashboard, and generation is what prompts the trial later.
 *
 * Every field is written to a persisted draft on change, so a refresh, an
 * email-confirmation round trip, or an accidental back button doesn't discard
 * the analysis.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
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
import { OnboardingShell, StepSection, type Step } from "./shell";
import { Part1Profile, type Part1Value } from "./Part1Profile";
import { Part2Analysis, type Part2Value } from "./Part2Analysis";
import { Part3Forecast } from "./Part3Forecast";
import { ProofColumn } from "./ProofColumn";
import { TrafficProjection } from "./TrafficProjection";

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
 * brand details and keywords are placeholders, so those restart from Part 1
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

  const [step, setStep] = useState<Step>(() => {
    const saved = restorableDraft();
    return saved && saved.step !== "done" ? saved.step : 1;
  });

  // A single persist point keeps the draft and the step in lockstep.
  const patch = useCallback((next: Partial<OnboardingDraft>) => {
    setDraft((prev) => {
      const merged = { ...prev, ...next };
      saveOnboardingDraft(merged);
      return merged;
    });
  }, []);

  useEffect(() => {
    saveOnboardingDraft({ step });
  }, [step]);

  // The name was given at sign-up, so it isn't asked for again here.
  useEffect(() => {
    let active = true;
    void getCurrentUser().then(({ fullName }) => {
      if (active) patch({ firstName: firstNameOf(fullName) });
    });
    return () => {
      active = false;
    };
  }, [patch]);

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
      toast.success("You're set up. Welcome to Rankbox.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't finish setup.");
      setConfirming(false);
    }
  }

  const stateOf = (n: Step) => (n < step ? "done" : n === step ? "active" : "upcoming");
  const domain = draft.url.trim() ? domainOf(draft.url) : "";
  // Keywords analyzed for a different URL are stale; don't project from them.
  const keywords = draft.analyzedUrl === draft.url ? draft.keywords : [];
  const searches = keywords.reduce((sum, k) => sum + k.search_volume, 0);

  return (
    <OnboardingShell
      active={step}
      onStep={setStep}
      proof={<ProofColumn />}
      projection={
        <TrafficProjection step={step} domain={domain} keywords={keywords} titles={draft.titles} />
      }
    >
      <StepSection
        n={1}
        title="Your brand"
        subtitle="We read your site and filled this in. Change anything that isn't right."
        state={stateOf(1)}
        onEdit={() => setStep(1)}
        summary={
          <span className="flex min-w-0 items-center gap-2">
            {draft.logoUrl && (
              <img
                src={draft.logoUrl}
                alt=""
                className="h-4 w-4 shrink-0 rounded-sm object-contain"
              />
            )}
            <span className="truncate">
              {draft.brandName}
              {domain ? ` · ${domain}` : ""}
            </span>
          </span>
        }
      >
        <Part1Profile value={part1} onChange={(p) => patch(p)} onNext={() => setStep(2)} />
      </StepSection>

      <StepSection
        n={2}
        title="Keywords"
        subtitle="The searches we'll target. Remove any that don't fit, or add your own."
        state={stateOf(2)}
        onEdit={() => setStep(2)}
        summary={`${keywords.length} keywords · ${searches.toLocaleString()} monthly searches`}
      >
        <Part2Analysis
          url={draft.url}
          brandName={draft.brandName}
          description={draft.description}
          value={part2}
          // A changed keyword set makes the planned articles stale; step 3
          // re-plans when it finds none.
          onChange={(p) => patch(p.keywords ? { ...p, titles: [] } : p)}
          onNext={() => setStep(3)}
        />
      </StepSection>

      <StepSection
        n={3}
        title="Content plan"
        subtitle="Articles that fill your content gaps, in the order we'll publish them."
        state={stateOf(3)}
      >
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
          confirming={confirming}
        />
      </StepSection>
    </OnboardingShell>
  );
}
