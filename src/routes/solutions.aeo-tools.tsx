import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Package } from "lucide-react";
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
import { Autopilot, Landscape, LiveScanner, Toolbox } from "@/components/solutions/aeo";
import {
  AEO,
  AEO_TOOL_COUNT,
  AEO_TOOL_SLUGS,
  LANDSCAPE,
  aeoFaqs,
} from "@/data/solutions/aeo-tools";
import { JOBS } from "@/data/solutions/gates";
import { cheapestOf, loadPricing } from "@/data/solutions/market";
import { SITE, solutionHead } from "@/data/solutions/schema";
import { getTool } from "@/data/tools";
import { PLAN, formatUsd } from "@/data/pricing";

const PATH = `/solutions/${AEO.slug}`;

export const Route = createFileRoute("/solutions/aeo-tools")({
  loader: async () => ({ priced: await loadPricing(LANDSCAPE.flatMap((r) => r.products)) }),
  head: ({ loaderData }) =>
    solutionHead({
      slug: AEO.slug,
      name: "AEO tools",
      title: AEO.metaTitle,
      description: AEO.metaDescription,
      headline: `${AEO.h1.lead} ${AEO.h1.accent}`,
      keywords: AEO.keywords,
      faqs: aeoFaqs(loaderData ? cheapestOf(loaderData.priced) : null),
      featureList: JOBS.map((j) => `${j.name}: ${j.rankbox}`),
      itemList: {
        name: "Free AEO tools",
        items: AEO_TOOL_SLUGS.map((slug) => {
          const tool = getTool(slug)!;
          return { name: tool.name, url: `${SITE}/tools/${slug}`, description: tool.tagline };
        }),
      },
    }),
  component: AeoToolsPage,
});

/* A tool page first: the hero runs a real AEO check, the body is the toolbox
   sorted by job, then the market and the plan that runs the jobs daily.
   Section ids (top, pricing, faq) match the landing for the navbar. */
function AeoToolsPage() {
  const { priced } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SolutionHero
          name="AEO tools"
          icon={Package}
          eyebrow={AEO.eyebrow}
          h1={AEO.h1}
          subhead={AEO.subhead}
          actions={
            <>
              <SignupForm />
              <StartNote />
              <a
                href="#toolbox"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                Or browse all {AEO_TOOL_COUNT} free AEO tools
                <ArrowDown className="h-4 w-4" />
              </a>
            </>
          }
          aside={<LiveScanner />}
        />
        <SpecsBand
          label="The AEO toolbox at a glance"
          specs={[
            { value: `${AEO_TOOL_COUNT}`, label: "free AEO tools, most with no signup" },
            { value: `${JOBS.length}`, label: "jobs they cover, from crawler access to measuring" },
            { value: "3", label: "ways they run: instant, AI-written, or a live fetch" },
            { value: formatUsd(PLAN.monthly), label: "a month to run three jobs on autopilot" },
          ]}
        />
        <Toolbox />
        <Landscape priced={priced} />
        <Autopilot />
        <Pricing />
        <ExploreMore path={PATH} />
        <SolutionFAQ title="AEO tool questions" faqs={aeoFaqs(cheapestOf(priced))} />
        <SolutionCTA title={AEO.ctaTitle} body={AEO.ctaBody} icon={Package} />
      </main>
      <Footer />
    </div>
  );
}
