/**
 * The /ai-seo hub's body, drawn in the landing page's frame: the hero with
 * the engine rail, the source map (the hub's focal visual), the cross-engine
 * matrix at its centre, the shared-versus-specific split, where to start,
 * the FAQ, the sources, the cross-site links and the closing band.
 *
 * The hub never loads a guide's body: the route ships only each guide's
 * `profile`, which the matrix reads.
 */
import { Network, Table2 } from "lucide-react";
import { ExploreMore } from "@/components/ExploreMore";
import { Md } from "@/components/ai-seo/kit";
import { Accent, Band, Spacer } from "@/components/landing/frame";
import { OVERVIEW } from "@/data/ai-seo/overview";
import { EngineMatrix } from "./EngineMatrix";
import { Foundations } from "./Foundations";
import { HubClosing } from "./HubClosing";
import { HubFaq } from "./HubFaq";
import { HubHero } from "./HubHero";
import { HubSources } from "./HubSources";
import { SourceLayers, SourceMap } from "./SourceMap";
import { WhereToStart } from "./WhereToStart";
import { HubHead, type ProfileRow } from "./shared";

export function AiSeoHub({ profiles, updated }: { profiles: ProfileRow[]; updated: string }) {
  const map = OVERVIEW.sourceMap;
  const matrix = OVERVIEW.matrix;
  return (
    <>
      <HubHero updated={updated} />

      <section id="where-answers-come-from" aria-labelledby="map-title" className="scroll-mt-16">
        <Spacer />
        <HubHead
          id="map-title"
          icon={Network}
          eyebrow="The source map"
          title={
            <>
              {map.title.lead} <Accent>{map.title.accent}</Accent>
            </>
          }
          subtitle={<Md text={map.intro} />}
        />
        <Band inner="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <SourceMap />
        </Band>
        <Band>
          <SourceLayers />
        </Band>
      </section>

      <section id="compare" aria-labelledby="compare-title" className="scroll-mt-16">
        <Spacer />
        <HubHead
          id="compare-title"
          icon={Table2}
          eyebrow="The matrix"
          title={
            <>
              {matrix.title.lead} <Accent>{matrix.title.accent}</Accent>
            </>
          }
          subtitle={<Md text={matrix.intro} />}
        />
        <Band>
          <EngineMatrix profiles={profiles} />
        </Band>
        <Band inner="px-6 py-4 sm:px-10 lg:px-12">
          <p className="text-[0.8rem] text-muted-foreground">
            <Md text={matrix.note} />
          </p>
        </Band>
      </section>

      <Spacer />
      <Foundations />
      <Spacer />
      <WhereToStart />
      <Spacer />
      <HubFaq />
      <Spacer />
      <HubSources />
      <ExploreMore path="/ai-seo" framed />
      <HubClosing />
    </>
  );
}
