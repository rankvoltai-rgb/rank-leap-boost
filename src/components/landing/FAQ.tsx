import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "./shared";

export const FAQS = [
  { q: "How fast will I see results?", a: "Most founders watch their first articles pick up views within two to three weeks. Because Rankvolt publishes a fresh, well-researched piece every day, momentum builds faster than manual blogging — and citations in AI answers tend to follow once the content base is in place." },
  { q: "What does Rankvolt cost?", a: "Rankvolt is $99 a month, or $990 a year on annual billing. Every plan includes 30 articles per month, answer-space research, and full automation. That's a fraction of an SEO agency while saving you 20+ hours a week." },
  { q: "Is AI content really good enough?", a: "Yes — and at scale it's hard to match by hand. Rankvolt studies the top results and AI answers, then writes fresh, source-backed pieces structured to rank and get quoted. You get consistent long-form articles in minutes, with no writer burnout." },
  { q: "What is GEO, and why does it matter?", a: "GEO is generative engine optimization — getting your brand cited inside answers from ChatGPT, Perplexity, and Google AI Overviews. Buyers increasingly ask AI instead of scrolling results, so being the recommended answer is quickly becoming as valuable as ranking #1." },
  { q: "Do I need any SEO experience?", a: "None at all. Rankvolt is built for founders who want growth without a technical background. It handles the research, optimization, internal linking, and publishing so you can stay focused on the business." },
  { q: "How do articles get published?", a: "Rankvolt connects to WordPress, Webflow, Shopify, Wix, and more for one-click publishing. Flip on auto-publish and new articles go live on your schedule. On any other platform, copy the formatted content straight from the editor." },
  { q: "Is the content original?", a: "Always. Every article is written from scratch using live web research — never copied from existing pages. It passes plagiarism checks and reads naturally, which is exactly what both search engines and AI models reward." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, setup fees, or hidden charges. Cancel in one click from your billing portal, and you keep full access until the end of your current billing period." },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about pricing, features, and how Rankvolt helps you rank on Google and AI search engines."
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