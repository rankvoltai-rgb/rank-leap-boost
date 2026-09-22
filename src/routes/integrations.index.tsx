import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  ConnectionStatus,
  Directory,
  HubHero,
  IntegrationCTA,
  IntegrationFAQ,
  IntegrationSpecs,
  KeySecurity,
  PublishingLoop,
} from "@/components/integrations/IntegrationSections";
import { INTEGRATIONS, getIntegration, isAddon } from "@/data/integrations";
import { formatUsd, PLAN, STUDIO } from "@/data/pricing";

const SITE = "https://rankbox.xyz";
const TITLE = "Integrations — WordPress, Shopify, Webflow & More | Rankbox";
const DESCRIPTION =
  "Connect Rankbox to WordPress, Shopify, Webflow, Framer, or Square Online and publish fresh, optimized articles as native posts. Or pull them from the REST API.";

const ADDONS = INTEGRATIONS.filter(isAddon);

const HUB_SPECS = [
  { value: String(ADDONS.length), label: "platforms with a native app or plugin" },
  { value: "Any", label: "other stack, through the REST API" },
  { value: "1 key", label: "per site, revocable any time" },
  { value: "Included", label: "with every Rankbox plan" },
];

const platformList = (() => {
  const names = ADDONS.map((a) => (a.slug === "square" ? "Square Online" : a.name));
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
})();

const HUB_FAQS = [
  {
    q: "Which platforms does Rankbox publish to?",
    a: `${platformList} each have a Rankbox app or plugin. Any other site can pull articles from the REST API.`,
  },
  {
    q: "Do integrations cost extra?",
    a: "No. Every integration is included with your Rankbox plan, including the free trial.",
  },
  {
    q: "Do I need a developer?",
    a: "Not for the platform integrations: install, paste a key, and choose where posts go. The REST API is for sites built on their own code.",
  },
  {
    q: "Will articles match my site's design?",
    a: "Yes. They publish as native posts or CMS items, so your theme or template lays them out like anything else on your site.",
  },
  {
    q: "What happens if I edit an article after it's published?",
    a: "Your site picks up anything changed since its last sync, so the live post updates in place. Nothing is duplicated.",
  },
  {
    q: "How do I know articles are arriving?",
    a: "The Integrations page in your dashboard shows each site as Live, Waiting, or Idle, when it last synced, and how many published articles it has received.",
  },
  {
    q: "How many sites can I connect?",
    a: STUDIO.live
      ? `Every site on your account connects with its own publishing key and gets its own content plan and schedule. Your plan covers one; add more with ${STUDIO.name} at ${formatUsd(STUDIO.monthlyPerSite)} a month each.`
      : `Each Rankbox plan covers ${PLAN.sites === 1 ? "one website" : `${PLAN.sites} websites`}, with its own content plan and publishing schedule. Running several sites? Get in touch and we'll set it up with you.`,
  },
];

export const Route = createFileRoute("/integrations/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/integrations` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}/integrations` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${SITE}/integrations#webpage`,
              url: `${SITE}/integrations`,
              name: TITLE,
              description: DESCRIPTION,
              isPartOf: { "@id": `${SITE}/#website` },
              mainEntity: { "@id": `${SITE}/integrations#list` },
            },
            {
              "@type": "ItemList",
              "@id": `${SITE}/integrations#list`,
              itemListElement: INTEGRATIONS.map((i, n) => ({
                "@type": "ListItem",
                position: n + 1,
                name: i.name,
                url: `${SITE}/integrations/${i.slug}`,
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Integrations",
                  item: `${SITE}/integrations`,
                },
              ],
            },
            {
              "@type": "FAQPage",
              "@id": `${SITE}/integrations#faq`,
              mainEntity: HUB_FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: IntegrationsIndex,
});

function IntegrationsIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HubHero />
        <IntegrationSpecs specs={HUB_SPECS} label="Integrations at a glance" />
        <Directory />
        <PublishingLoop />
        <ConnectionStatus integration={getIntegration("wordpress")} />
        <KeySecurity />
        <IntegrationFAQ
          title="Integration questions"
          intro="How connecting your site works, what it costs, and what it can touch."
          faqs={HUB_FAQS}
        />
        <IntegrationCTA />
      </main>
      <Footer />
    </div>
  );
}
