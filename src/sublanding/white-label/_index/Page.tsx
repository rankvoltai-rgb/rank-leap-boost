import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ExploreMore } from "@/components/ExploreMore";
import { Billing } from "./Billing";
import { Closing } from "./Closing";
import { PATH } from "./content";
import { Controls } from "./Controls";
import { DeepDives } from "./DeepDives";
import { Fit } from "./Fit";
import { Gaps } from "./Gaps";
import { Hero } from "./Hero";
import { Journey } from "./Journey";
import { Questions } from "./Questions";
import { Runbook } from "./Runbook";
import { Split } from "./Split";
import { StudioModel } from "./StudioModel";

/** Pages the copy already links to, so "keep exploring" only adds new ones. */
export const LINKED = [
  "/",
  "/pricing",
  "/legal/terms",
  "/integrations/api",
  "/docs/account/studio",
  "/white-label/content-writing",
  "/white-label/ai-seo",
  "/white-label/pricing",
] as const;

/**
 * /white-label, the program hub. The argument, in order: what it is (hero
 * and answer), who it's for, who does what, the client's side, how many
 * clients run from one account, adding a client, the controls, what isn't
 * built, billing, the deep dives, questions, and the close.
 */
export function WhiteLabelHubPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Fit />
          <Split />
          <Journey />
          <StudioModel />
          <Runbook />
          <Controls />
          <Gaps />
          <Billing />
          <DeepDives />
          <Questions />
          <Closing />
          <ExploreMore path={PATH} exclude={LINKED} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
