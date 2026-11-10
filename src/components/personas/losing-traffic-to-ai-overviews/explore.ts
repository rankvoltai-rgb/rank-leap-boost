/**
 * What the Keep exploring block leaves out on this page: the four picks,
 * which the page already links, and any feature or add-on that hasn't
 * shipped. The link graph only filters those on its claim-checked sections,
 * and this page says plainly that Rankbox doesn't track citations, so a card
 * offering Citation Tracking would contradict it.
 */
import { SHIPPED } from "@/data/competitors/shared";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import type { Persona } from "@/data/personas";

export function exploreExclude(persona: Persona): string[] {
  return [
    ...persona.picks.map((p) => `/features/${p.featureSlug}`),
    ...(SHIPPED.citationTracking ? [] : ["/features/citation-tracking"]),
    ...(PUBLISH_PLATFORMS.some((p) => p.addonLive) ? [] : ["/features/auto-publishing"]),
    ...PUBLISH_PLATFORMS.filter((p) => !p.addonLive).map((p) => `/integrations/${p.id}`),
  ];
}
