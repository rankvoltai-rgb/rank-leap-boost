/**
 * The hub's FAQ, in the landing's two-column form: title on the left, the
 * questions down the right. Answers are force-mounted, so every one is in the
 * server HTML and matches the FAQPage schema in the route's head; closed ones
 * are hidden with CSS. The first is open, so the section never looks empty.
 */
import { HelpCircle, Plus } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Md } from "@/components/ai-seo/kit";
import { Accent, Band, LINE, Pill } from "@/components/landing/frame";
import { OVERVIEW } from "@/data/ai-seo/overview";
import { cn } from "@/lib/utils";

export function HubFaq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "flex flex-col border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-24">
              <Pill icon={HelpCircle} className="w-fit">
                FAQ
              </Pill>
              <h2
                id="faq-title"
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
              >
                AI SEO questions, <Accent>answered</Accent>
              </h2>
              <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
                The cross-engine questions. Each guide answers the ones specific to its engine.
              </p>
            </div>
          </div>

          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="multiple"
              defaultValue={["faq-0"]}
              className="divide-y divide-ink/[0.07]"
            >
              {OVERVIEW.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header asChild>
                    <h3 className="flex">
                      <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                        {f.q}
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                      </AccordionPrimitive.Trigger>
                    </h3>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-[0.92rem] leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-cta [&_a]:underline [&_a]:decoration-cta/30 [&_a]:underline-offset-2 [&_code]:text-[0.8rem]"
                  >
                    <Md text={f.a} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Band>
    </section>
  );
}
