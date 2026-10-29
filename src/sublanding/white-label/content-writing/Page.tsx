import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ExploreMore } from "@/components/ExploreMore";
import { PATH } from "./content";
import { ArticleSpec } from "./ArticleSpec";
import { BriefComposer } from "./BriefComposer";
import { Checks } from "./Checks";
import { Close } from "./Close";
import { Hero } from "./Hero";
import { Questions } from "./Questions";
import { RosterPlanner } from "./RosterPlanner";
import { Scope } from "./Scope";
import { SignOff } from "./SignOff";
import { Stations } from "./Stations";

/** Pages the copy already links to, so "keep exploring" adds new ones. */
const LINKED = [
  "/pricing",
  "/white-label",
  "/white-label/ai-seo",
  "/white-label/pricing",
  "/features/brand-voice",
  "/features/citation-ready-writer",
  "/features/seo-geo-score",
  "/tools/ai-citation-readiness-checker",
] as const;

/**
 * /white-label/content-writing. One article down the line (hero ticket), then
 * the line itself: who works each station, the client's brief, the spec,
 * the checks against the editor's pass, sign-off, volume per client, scope,
 * the questions and the close.
 */
export function ContentWritingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Stations />
          <BriefComposer />
          <ArticleSpec />
          <Checks />
          <SignOff />
          <RosterPlanner />
          <Scope />
          <Questions />
          <Close />
          <ExploreMore path={PATH} exclude={LINKED} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
