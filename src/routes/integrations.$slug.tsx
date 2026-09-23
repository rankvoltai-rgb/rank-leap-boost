import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  ConnectionStatus,
  IntegrationCTA,
  IntegrationFAQ,
  IntegrationHero,
  IntegrationHighlights,
  IntegrationSetup,
  IntegrationSpecs,
  KeySecurity,
  RelatedIntegrations,
} from "@/components/integrations/IntegrationSections";
import { getIntegration, isAddon, publishes } from "@/data/integrations";
import { aiToolPage, getAiTool } from "@/data/ai-integrations";
import { MCP_URL } from "@/data/connectors";
import {
  ToolBiggerPicture,
  ToolCTA,
  ToolHero,
  ToolHowItWorks,
  ToolPrivacy,
  ToolRelated,
  ToolSetup,
  ToolSubNav,
  ToolTryIt,
  ToolUseCases,
} from "@/components/integrations/ToolPage";
import { SubNav } from "@/components/integrations/SubNav";
import { IntegrationGlyph } from "@/components/integrations/visuals";

const SITE = "https://rankbox.xyz";

export const Route = createFileRoute("/integrations/$slug")({
  loader: ({ params }) => {
    if (!getIntegration(params.slug) && !getAiTool(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const url = `${SITE}/integrations/${params.slug}`;
    const integration = getIntegration(params.slug);
    const tool = integration ? undefined : getAiTool(params.slug);
    if (tool) return aiToolHead(url, tool);
    if (!integration) {
      return { meta: [{ title: "Integration not found — Rankbox" }] };
    }
    const headline = `${integration.headline.lead} ${integration.headline.accent}`;
    return {
      meta: [
        { title: integration.metaTitle },
        { name: "description", content: integration.metaDescription },
        { property: "og:title", content: integration.metaTitle },
        { property: "og:description", content: integration.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: integration.metaTitle },
        { name: "twitter:description", content: integration.metaDescription },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: integration.metaTitle,
                headline,
                description: integration.metaDescription,
                inLanguage: "en",
                isPartOf: { "@id": `${SITE}/#website` },
                breadcrumb: { "@id": `${url}#breadcrumb` },
                about: { "@id": `${url}#software` },
              },
              {
                "@type": "SoftwareApplication",
                "@id": `${url}#software`,
                name: isAddon(integration)
                  ? `Rankbox for ${integration.name}`
                  : `Rankbox ${integration.name}`,
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url,
                description: integration.subhead,
                featureList: integration.highlights.map((h) => `${h.title}: ${h.body}`),
                publisher: { "@id": `${SITE}/#organization` },
              },
              {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Integrations",
                    item: `${SITE}/integrations`,
                  },
                  { "@type": "ListItem", position: 3, name: integration.name, item: url },
                ],
              },
              {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: integration.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: IntegrationPage,
  notFoundComponent: IntegrationNotFound,
  errorComponent: IntegrationError,
});

/* Hero, facts, what lands where, setup, then — for anything that publishes —
   delivery status and key security, before the FAQ, related integrations, and
   the closing CTA. Section ids (top, setup, faq) are the page's anchors. */
function IntegrationPage() {
  const { slug } = Route.useParams();
  const integration = getIntegration(slug);
  if (!integration) return <AiToolPage slug={slug} />;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <IntegrationHero integration={integration} />
        <SubNav
          title={
            isAddon(integration) ? `Rankbox for ${integration.name}` : `Rankbox ${integration.name}`
          }
          mark={<IntegrationGlyph integration={integration} className="h-6 w-6" />}
          links={[
            { id: "overview", label: "Overview" },
            { id: "setup", label: "Setup" },
            ...(publishes(integration) ? [{ id: "status", label: "Status" }] : []),
            { id: "faq", label: "FAQ" },
          ]}
        />
        <IntegrationSpecs
          specs={integration.specs}
          label={`Rankbox for ${integration.name} at a glance`}
        />
        <IntegrationHighlights integration={integration} />
        <IntegrationSetup integration={integration} />
        {publishes(integration) && (
          <>
            <ConnectionStatus integration={integration} />
            <KeySecurity />
          </>
        )}
        <IntegrationFAQ
          title={
            isAddon(integration)
              ? `${integration.name} integration questions`
              : `${integration.name} questions`
          }
          intro={`Everything you need to know about connecting Rankbox with ${
            isAddon(integration) ? integration.name : `the ${integration.name}`
          }.`}
          faqs={integration.faqs}
        />
        <RelatedIntegrations integration={integration} />
        <IntegrationCTA integration={integration} />
      </main>
      <Footer />
    </div>
  );
}

function IntegrationNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Integration not found</h1>
      <p className="text-muted-foreground">That integration page doesn&rsquo;t exist.</p>
      <Link
        to="/integrations"
        className="rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-white hover:bg-cta-hover"
      >
        Browse all integrations
      </Link>
    </div>
  );
}

function IntegrationError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Something went wrong</h1>
      <Link
        to="/integrations"
        className="rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-white hover:bg-cta-hover"
      >
        Browse all integrations
      </Link>
    </div>
  );
}

/* ---------- AI tool pages ---------- */

/* The same order as the hand-written pages, minus what only publishing has:
   hero, facts, what it can do, setup, FAQ, related tools, then the CTA. */
function AiToolPage({ slug }: { slug: string }) {
  const tool = getAiTool(slug)!;
  const page = aiToolPage(tool);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ToolHero tool={tool} page={page} />
        <ToolSubNav tool={tool} />
        <IntegrationSpecs specs={page.specs} label={`Rankbox for ${tool.name} at a glance`} />
        <ToolHowItWorks tool={tool} />
        <ToolTryIt tool={tool} />
        <ToolUseCases tool={tool} />
        <ToolSetup tool={tool} />
        <ToolBiggerPicture tool={tool} />
        <ToolPrivacy tool={tool} />
        <IntegrationFAQ
          title={`Rankbox and ${tool.name}`}
          intro={`Connecting, plans, privacy, and what the tools can do in ${tool.name}.`}
          faqs={page.faqs}
        />
        <ToolRelated tool={tool} />
        <ToolCTA tool={tool} />
      </main>
      <Footer />
    </div>
  );
}

function aiToolHead(url: string, tool: NonNullable<ReturnType<typeof getAiTool>>) {
  const page = aiToolPage(tool);
  const headline = `${page.headline.lead} ${page.headline.accent}`;
  return {
    meta: [
      { title: page.metaTitle },
      { name: "description", content: page.metaDescription },
      { property: "og:title", content: page.metaTitle },
      { property: "og:description", content: page.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.metaTitle },
      { name: "twitter:description", content: page.metaDescription },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${url}#webpage`,
              url,
              name: page.metaTitle,
              headline,
              description: page.metaDescription,
              inLanguage: "en",
              isPartOf: { "@id": `${SITE}/#website` },
              breadcrumb: { "@id": `${url}#breadcrumb` },
              mainEntity: { "@id": `${url}#howto` },
            },
            {
              "@type": "HowTo",
              "@id": `${url}#howto`,
              name: `Connect Rankbox to ${tool.name}`,
              description: `Add the Rankbox MCP server (${MCP_URL}) to ${tool.name}.`,
              step: tool.steps.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                text:
                  s.snippet && s.snippet.kind !== "url" ? `${s.text} ${s.snippet.value}` : s.text,
              })),
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${url}#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Integrations",
                  item: `${SITE}/integrations`,
                },
                { "@type": "ListItem", position: 3, name: tool.name, item: url },
              ],
            },
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: page.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }),
      },
    ],
  };
}
