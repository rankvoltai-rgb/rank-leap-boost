import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "./shared";

const FAQS = [
  { q: "How quickly will I see results?", a: "Most users see their first articles getting views within two to three weeks. RankPill publishes daily using proven SEO practices, so your traffic builds faster than manual blogging alone. Stay consistent and you should see steady growth over the first few months." },
  { q: "How much does this actually cost?", a: "RankPill is $99 per month, or $990 per year on annual billing. You get 30 articles per month, keyword research, and full automation on every plan. That beats agency SEO at $5,000+ per month while saving you 20+ hours weekly." },
  { q: "Is AI content as good as human?", a: "Yes, and often better at scale for growing teams. Our AI researches top ranking articles, analyzes what works, and writes fresh content optimized to rank well. You get consistent 3,000+ word articles in minutes instead of days, with no writer burnout." },
  { q: "Do I need SEO experience?", a: "Not at all. RankPill is built for business owners who want traffic without any SEO background or technical setup required. We handle keyword research, optimization, linking, and publishing so you can focus on your business." },
  { q: "Will this work for AI search too?", a: "Yes, absolutely. ChatGPT, Claude, and other AI tools pull answers from the web, so your site needs strong content listed first. RankPill publishes targeted articles that rank for keywords your customers search and ask about in AI chats every day." },
  { q: "How do I publish articles?", a: "We connect to WordPress, Webflow, Shopify, Wix, and more with one-click publishing. Turn on auto publish and new articles go live on your schedule without extra manual steps. On any other site, copy the formatted content straight from the editor." },
  { q: "Is the content plagiarism-free?", a: "Yes. Every article is written from scratch using live research, not copied from existing pages. Content passes plagiarism checks and reads naturally for your audience. Search engines reward original, in-depth articles with better rankings over time." },
  { q: "Can I cancel anytime?", a: "Yes. There are no contracts, setup fees, or hidden charges on your subscription plan. Cancel anytime from your billing portal in one click. You keep full access until the end of your current billing period, monthly or annual." },
  { q: "What if I'm not sure it's right for me?", a: "Sign up with full access and generate real articles for your website today. Review the quality, test the full workflow, and see if RankPill fits how you work. Cancel anytime from billing settings if it's not the right fit." },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about pricing, features, and how RankPill helps you rank on Google and AI search engines."
        />
        <Reveal delay={0.08} className="mt-12">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-card px-5 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}