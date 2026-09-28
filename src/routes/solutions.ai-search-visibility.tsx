import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { ExploreMore } from "@/components/ExploreMore";
import {
  SignupForm,
  SolutionCTA,
  SolutionFAQ,
  SolutionHero,
  SpecsBand,
  StartNote,
} from "@/components/solutions/kit";
import {
  BuildLoop,
  CitationXray,
  GateLab,
  MeasureFree,
  TrackerContrast,
} from "@/components/solutions/visibility";
import { VISIBILITY, VISIBILITY_FAQS } from "@/data/solutions/ai-search-visibility";
import { GATES } from "@/data/solutions/gates";
import { loadPricing } from "@/data/solutions/market";
import { solutionHead } from "@/data/solutions/schema";

const PATH = `/solutions/${VISIBILITY.slug}`;

export const Route = createFileRoute("/solutions/ai-search-visibility")({
  loader: async () => ({ trackers: await loadPricing(["peec-ai", "profound"]) }),
  head: () =>
    solutionHead({
      slug: VISIBILITY.slug,
      name: "AI search visibility",
      title: VISIBILITY.metaTitle,
      description: VISIBILITY.metaDescription,
      headline: `${VISIBILITY.h1.lead} ${VISIBILITY.h1.accent}`,
      keywords: VISIBILITY.keywords,
      faqs: VISIBILITY_FAQS,
      featureList: GATES.map((g) => `${g.name}: ${g.rankbox}`),
    }),
  component: AiSearchVisibilityPage,
});

/* The argument, in order: why an answer named a brand (hero), what breaks it
   (lab), why a tracker alone doesn't fix it, how Rankbox does, and how to
   check for free. Section ids (top, pricing, faq) match the landing so the
   shared navbar's anchors work here. */
function AiSearchVisibilityPage() {
  const { trackers } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SolutionHero
          name="AI search visibility"
          icon={Eye}
          eyebrow={VISIBILITY.eyebrow}
          h1={VISIBILITY.h1}
          subhead={VISIBILITY.subhead}
          actions={
            <>
              <SignupForm />
              <StartNote />
            </>
          }
          aside={<CitationXray />}
        />
        <SpecsBand label="Rankbox at a glance" specs={VISIBILITY.specs} />
        <GateLab />
        <TrackerContrast trackers={[trackers["peec-ai"], trackers.profound]} />
        <BuildLoop />
        <MeasureFree />
        <ExploreMore path={PATH} />
        <div className="border-t border-border bg-surface/40">
          <Pricing />
        </div>
        <SolutionFAQ title="AI search visibility questions" faqs={VISIBILITY_FAQS} />
        <SolutionCTA title={VISIBILITY.ctaTitle} body={VISIBILITY.ctaBody} icon={Eye} />
      </main>
      <Footer />
    </div>
  );
}
