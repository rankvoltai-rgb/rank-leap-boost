import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { IntegrationFAQ } from "@/components/integrations/IntegrationSections";
import { BlogCta } from "@/components/blog/ArticleChrome";
import { AboutHero, Contact, Library, Standards, Story } from "@/components/about/sections";
import { ABOUT_UPDATED, COMPANY, ORG_ID, SITE, organizationNode } from "@/data/company";
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";
import { formatDate } from "@/lib/format-date";

const URL = `${SITE}/about`;
const TITLE = "About Rankbox: Who We Are and How We Work";
const DESCRIPTION = `Rankbox is an AI search growth engine made by ${COMPANY.legalName}. Who we are, the editorial standards behind our guides, and how to reach us.`;

/* Written to be lifted whole: each answer stands on its own. */
const ABOUT_FAQS = [
  {
    q: "Who makes Rankbox?",
    a: `Rankbox is made and operated by ${COMPANY.legalName}. You can reach the company at ${COMPANY.email}.`,
  },
  {
    q: `Is Rankbox the same as ${COMPANY.formerName}?`,
    a: `Yes. The product was called ${COMPANY.formerName} until ${formatDate(COMPANY.renamedOn)}, when it was renamed Rankbox and moved to ${COMPANY.domain}. Same product, same company.`,
  },
  {
    q: "When did Rankbox start?",
    a: `Work on Rankbox began in ${COMPANY.foundingYear}, under the name ${COMPANY.formerName}.`,
  },
  {
    q: "What does Rankbox do?",
    a: COMPANY.description,
  },
  {
    q: "How much does Rankbox cost?",
    a: `${formatUsd(PLAN.monthly)} a month for one site, with ${PLAN.articlesPerMonth} articles a month and a ${TRIAL_DAYS}-day free trial.`,
  },
  {
    q: 'Who is the author when a post is signed "Rankbox"?',
    a: `The company. Posts signed Rankbox are published by ${COMPANY.legalName}, which answers for what they say. To report a mistake, email ${COMPANY.email}.`,
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": `${URL}#webpage`,
              url: URL,
              name: TITLE,
              description: DESCRIPTION,
              inLanguage: "en",
              dateModified: ABOUT_UPDATED,
              isPartOf: { "@id": `${SITE}/#website` },
              about: { "@id": ORG_ID },
              mainEntity: { "@id": ORG_ID },
            },
            organizationNode(),
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "About", item: URL },
              ],
            },
            {
              "@type": "FAQPage",
              "@id": `${URL}#faq`,
              mainEntity: ABOUT_FAQS.map((f) => ({
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
  component: AboutPage,
});

/* Who, then why, then the rules we hold ourselves to and what they've
   produced, then how to reach us. */
function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <AboutHero />
        <Story />
        <Standards />
        <Library />
        <Contact />
        <IntegrationFAQ
          title="Questions about Rankbox"
          intro="Who makes it, what it used to be called, and who stands behind what we publish."
          faqs={ABOUT_FAQS}
        />
        <BlogCta />
      </main>
      <Footer />
    </div>
  );
}
