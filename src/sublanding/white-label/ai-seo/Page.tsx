import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ExploreMore } from "@/components/ExploreMore";
import { PATH } from "./content";
import { Closing } from "./Closing";
import { EngineNotes } from "./EngineNotes";
import { Explain } from "./Explain";
import { Hero } from "./Hero";
import { More } from "./More";
import { ProspectCheck } from "./ProspectCheck";
import { Questions } from "./Questions";
import { Reporting } from "./Reporting";
import { Scope } from "./Scope";

/** Pages the copy already links to, so "keep exploring" only adds new ones. */
const LINKED = [
  "/pricing",
  "/white-label",
  "/white-label/content-writing",
  "/white-label/pricing",
  "/ai-seo",
  "/solutions/autonomous-geo",
  "/features/answer-space-research",
  "/features/seo-geo-score",
  "/tools/ai-search-readiness-check",
  "/tools/ai-visibility-prompt-generator",
  "/blog/how-to-measure-geo",
  "/blog/how-to-track-ai-referral-traffic-in-ga4",
] as const;

/**
 * /white-label/ai-seo. The argument, in order: the client's question (hero),
 * the scope you send back (the focal visual), running its first line on a
 * prospect, what to say in the meeting, where the report's numbers come from,
 * what to set per engine, where to go next, the questions, and the close.
 */
export function WhiteLabelAiSeoPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Scope />
          <ProspectCheck />
          <Explain />
          <Reporting />
          <EngineNotes />
          <More />
          <Questions />
          <ExploreMore path={PATH} exclude={LINKED} />
          <Closing />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
