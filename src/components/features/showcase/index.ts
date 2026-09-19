/**
 * Each feature page's product visuals: the hero window and one panel per
 * benefit, in the same order as `feature.benefits`. Keyed by feature slug.
 */
import type { ComponentType } from "react";
import { ResearchHero, researchBenefits } from "./research";
import { WriterHero, writerBenefits } from "./writer";
import { PublishingHero, publishingBenefits } from "./publishing";
import { TrackingHero, trackingBenefits } from "./tracking";
import { BacklinksHero, backlinksBenefits } from "./backlinks";
import { RedditHero, redditBenefits } from "./reddit";
import { VoiceHero, voiceBenefits } from "./voice";
import { ScoreHero, scoreBenefits } from "./score";

export interface Showcase {
  Hero: ComponentType<{ className?: string }>;
  benefits: ComponentType[];
}

export const SHOWCASES: Record<string, Showcase> = {
  "answer-space-research": { Hero: ResearchHero, benefits: researchBenefits },
  "citation-ready-writer": { Hero: WriterHero, benefits: writerBenefits },
  "auto-publishing": { Hero: PublishingHero, benefits: publishingBenefits },
  "citation-tracking": { Hero: TrackingHero, benefits: trackingBenefits },
  "authority-backlinks": { Hero: BacklinksHero, benefits: backlinksBenefits },
  "reddit-presence": { Hero: RedditHero, benefits: redditBenefits },
  "brand-voice": { Hero: VoiceHero, benefits: voiceBenefits },
  "seo-geo-score": { Hero: ScoreHero, benefits: scoreBenefits },
};
