import { MARGIN } from "./content";
import { MarginCalculator } from "./MarginCalculator";
import { Lead, Section, SectionTitle } from "./parts";

/** The calculator, on the page's one grey band so it reads as the workbench. */
export function MarginSection() {
  return (
    <Section id="margin" className="border-y border-border/70 bg-surface/70">
      <SectionTitle id="margin" />
      <Lead>{MARGIN.intro}</Lead>
      <MarginCalculator />
    </Section>
  );
}
