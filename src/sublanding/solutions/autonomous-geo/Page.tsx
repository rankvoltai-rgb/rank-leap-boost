import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ExploreMore } from "@/components/ExploreMore";
import { PATH } from "./content";
import { FinishedAnswer } from "./FinishedAnswer";
import { HandOver } from "./HandOver";
import { Hero } from "./Hero";
import { Questions } from "./Questions";
import { StillYours } from "./StillYours";
import { WhereToolsStop } from "./WhereToolsStop";

/** Pages the copy already links to, so "keep exploring" adds new ones. */
const LINKED = [
  "/pricing",
  "/solutions/aeo-tools",
  "/solutions/ai-search-visibility",
  "/features/auto-publishing",
  "/integrations/api",
  "/blog/ai-search-optimization-tools",
  "/blog/how-to-measure-geo",
  "/tools/ai-visibility-prompt-generator",
  "/tools/ai-search-readiness-check",
] as const;

/**
 * /solutions/autonomous-geo. The argument, in order: the month as homework or
 * done (hero), where each kind of tool stops, what "done" means for one
 * answer, what's still yours, the close, and the questions.
 */
export function AutonomousGeoPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <WhereToolsStop />
          <FinishedAnswer />
          <StillYours />
          <HandOver />
          <Questions />
          <ExploreMore path={PATH} exclude={LINKED} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
