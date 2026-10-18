import { HelpCircle, Plus } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "./shared";
import { Band, LINE, Pill, Spacer } from "./frame";

export const FAQS = [
  {
    q: "How fast will I see results?",
    a: "Most founders watch their first articles pick up views within two to three weeks. Because Rankbox publishes a fresh, well-researched piece every day, momentum builds faster than manual blogging — and citations in AI answers tend to follow once the content base is in place.",
  },
  {
    q: "What does Rankbox cost?",
    a: "Rankbox is $49.50 a month. Every plan includes 30 articles per month, answer-space research, and full automation. That's a fraction of an SEO agency while saving you 20+ hours a week.",
  },
  {
    q: "Is AI content really good enough?",
    a: "Yes — and at scale it's hard to match by hand. Rankbox studies the top results and AI answers, then writes fresh, source-backed pieces structured to rank and get quoted. You get consistent long-form articles in minutes, with no writer burnout.",
  },
  {
    q: "What is GEO, and why does it matter?",
    a: "GEO is generative engine optimization — getting your brand cited inside answers from ChatGPT, Perplexity, and Google AI Overviews. Buyers increasingly ask AI instead of scrolling results, so being the recommended answer is quickly becoming as valuable as ranking #1.",
  },
  {
    q: "Do I need any SEO experience?",
    a: "None at all. Rankbox is built for founders who want growth without a technical background. It handles the research, optimization, internal linking, and publishing so you can stay focused on the business.",
  },
  {
    q: "How do articles get published?",
    a: "Rankbox connects to WordPress, Webflow, Shopify, Wix, and more for one-click publishing. Flip on auto-publish and new articles go live on your schedule. On any other platform, copy the formatted content straight from the editor.",
  },
  {
    q: "Is the content original?",
    a: "Always. Every article is written from scratch using live web research — never copied from existing pages. It passes plagiarism checks and reads naturally, which is exactly what both search engines and AI models reward.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, setup fees, or hidden charges. Cancel in one click from your billing portal, and you keep full access until the end of your current billing period.",
  },
];

/* Rankaria's FAQ: the title on the left, the questions down the right, each
   on a hairline with a plus that turns into a cross when open. */
export function FAQ() {
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2 className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
              Frequently asked questions
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              Everything you need to know about pricing, features, and how Rankbox helps you rank on
              Google and AI search engines.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-sm leading-relaxed text-muted-foreground"
                  >
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}
