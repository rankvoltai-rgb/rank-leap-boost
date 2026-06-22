import { createFileRoute } from "@tanstack/react-router";
import {
  LegalPage,
  Section,
  P,
  Ul,
  Li,
  MailLink,
  PolicyLink,
} from "@/components/legal/legal-ui";

export const Route = createFileRoute("/legal/acceptable-use")({
  head: () => ({
    meta: [
      { title: "Acceptable Use Policy — Rankvolt" },
      {
        name: "description",
        content:
          "The rules for using Rankvolt responsibly: prohibited content and conduct, and the consequences of violations.",
      },
      { property: "og:title", content: "Acceptable Use Policy — Rankvolt" },
      {
        property: "og:description",
        content: "What you may and may not do when using Rankvolt.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rankvolt.top/legal/acceptable-use" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/legal/acceptable-use" }],
  }),
  component: AcceptableUsePage,
});

function AcceptableUsePage() {
  return (
    <LegalPage
      current="/legal/acceptable-use"
      title="Acceptable Use Policy"
      summary="To keep Rankvolt safe and trustworthy for everyone, you agree to follow these rules when using the Service."
    >
      <Section title="1. Prohibited content">
        <P>You may not use the Service to create, publish, or distribute content that:</P>
        <Ul>
          <Li>Is illegal, fraudulent, defamatory, or infringes others' intellectual property.</Li>
          <Li>Is hateful, harassing, threatening, or promotes violence.</Li>
          <Li>Is sexually explicit involving minors, or otherwise exploits children.</Li>
          <Li>Is deliberately deceptive, misleading, or intended to manipulate or harm readers.</Li>
          <Li>Contains malware, phishing, or other malicious code.</Li>
        </Ul>
      </Section>

      <Section title="2. Prohibited conduct">
        <Ul>
          <Li>Spam, cloaking, link schemes, or other black-hat or manipulative SEO tactics.</Li>
          <Li>Attempting to reverse engineer, scrape, or disrupt the Service.</Li>
          <Li>Circumventing usage limits, credits, or security measures.</Li>
          <Li>Abusing, sharing, or misusing API keys, or accessing accounts that are not yours.</Li>
          <Li>Reselling or sublicensing the Service without our written permission.</Li>
        </Ul>
      </Section>

      <Section title="3. Your responsibility for output">
        <P>
          You are responsible for reviewing and approving all AI-generated content before publishing
          it, and for ensuring it complies with applicable laws and the rules of any platform you
          publish to.
        </P>
      </Section>

      <Section title="4. Consequences of violations">
        <P>
          We may remove content, throttle, suspend, or terminate accounts that violate this policy,
          with or without notice, and may report illegal activity to authorities. Repeated or severe
          violations may result in permanent termination without refund.
        </P>
      </Section>

      <Section title="5. Reporting and related terms">
        <P>
          To report abuse, email us at <MailLink />. This policy forms part of our{" "}
          <PolicyLink to="/legal/terms">Terms of Service</PolicyLink>.
        </P>
      </Section>
    </LegalPage>
  );
}