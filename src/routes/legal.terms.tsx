import { createFileRoute } from "@tanstack/react-router";
import {
  LegalPage,
  Section,
  P,
  Ul,
  Li,
  B,
  MailLink,
  PolicyLink,
  Placeholder,
} from "@/components/legal/legal-ui";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Rankvolt" },
      {
        name: "description",
        content:
          "The terms and conditions governing your use of Rankvolt, operated by Autusus LLC, including billing, AI content, liability, and account terms.",
      },
      { property: "og:title", content: "Terms of Service — Rankvolt" },
      {
        property: "og:description",
        content: "The terms that govern your use of the Rankvolt service.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rankvolt.top/legal/terms" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/legal/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      current="/legal/terms"
      title="Terms of Service"
      summary="These Terms are a binding agreement between you and Autusus LLC. By creating an account or using Rankvolt, you agree to them."
    >
      <Section title="1. Acceptance of terms">
        <P>
          By accessing or using Rankvolt (the "Service"), you agree to be bound by these Terms of
          Service and our <PolicyLink to="/legal/privacy">Privacy Policy</PolicyLink>. If you do not
          agree, do not use the Service. If you use the Service on behalf of a company, you represent
          that you are authorized to bind that company.
        </P>
      </Section>

      <Section title="2. The Service">
        <P>
          Rankvolt is a software platform that uses artificial intelligence to research, write, and
          publish SEO and AI-search-optimized articles, and to connect with third-party publishing
          platforms. We may add, change, or remove features at any time.
        </P>
      </Section>

      <Section title="3. Accounts and responsibilities">
        <Ul>
          <Li>You must provide accurate information and keep your account secure.</Li>
          <Li>You are responsible for all activity that occurs under your account.</Li>
          <Li>You must be at least 18 years old to use the Service.</Li>
          <Li>
            Your use must comply with our{" "}
            <PolicyLink to="/legal/acceptable-use">Acceptable Use Policy</PolicyLink>.
          </Li>
        </Ul>
      </Section>

      <Section title="4. Subscriptions, billing, and cancellation">
        <P>
          Paid plans are billed in advance on a recurring basis through our payment processor. You
          can cancel at any time; your access continues until the end of the current paid billing
          period. Fees are <B>non-refundable</B> except where required by law — see our{" "}
          <PolicyLink to="/legal/refunds">Refund &amp; Cancellation Policy</PolicyLink>. We may
          change pricing with notice for future billing periods.
        </P>
      </Section>

      <Section title="5. AI-generated content disclaimer">
        <P>
          The Service uses AI to generate text. AI output <B>may be inaccurate, incomplete, biased,
          or unoriginal</B>. You are solely responsible for reviewing, editing, fact-checking, and
          approving any content before you publish or rely on it. You are responsible for ensuring
          that published content complies with applicable laws and the rules of any platform you
          publish to. Rankvolt does not guarantee any specific search ranking, traffic, citation, or
          business result.
        </P>
      </Section>

      <Section title="6. Intellectual property">
        <P>
          As between you and us, you own the content you create and publish through the Service,
          subject to these Terms. You grant us a limited license to process and store that content as
          needed to operate the Service. We retain all rights in the Rankvolt platform, software,
          branding, and underlying technology. You may not copy, resell, or reverse engineer the
          Service.
        </P>
      </Section>

      <Section title="7. Third-party integrations">
        <P>
          The Service may integrate with third-party platforms (such as Framer, Shopify, and
          WordPress) using API keys you provide or generate. Your use of those platforms is governed
          by their own terms, and we are not responsible for their availability or actions.
        </P>
      </Section>

      <Section title="8. Disclaimer of warranties">
        <P>
          The Service is provided "as is" and "as available" without warranties of any kind, whether
          express or implied, including merchantability, fitness for a particular purpose, and
          non-infringement, to the maximum extent permitted by law.
        </P>
      </Section>

      <Section title="9. Limitation of liability">
        <P>
          To the maximum extent permitted by law, Autusus LLC will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of profits, revenue,
          data, or goodwill. Our total liability for any claim relating to the Service is limited to
          the amount you paid us in the 12 months before the event giving rise to the claim.
        </P>
      </Section>

      <Section title="10. Indemnification">
        <P>
          You agree to indemnify and hold harmless Autusus LLC and its officers, employees, and
          agents from any claims, damages, or expenses arising out of your use of the Service, your
          content, or your violation of these Terms.
        </P>
      </Section>

      <Section title="11. Termination">
        <P>
          You may stop using the Service at any time. We may suspend or terminate your access if you
          violate these Terms or the Acceptable Use Policy, or to protect the Service or other users.
        </P>
      </Section>

      <Section title="12. Governing law">
        <P>
          These Terms are governed by the laws of the State of{" "}
          <Placeholder>[State of formation]</Placeholder>, United States, without regard to conflict
          of law rules. Any disputes will be resolved in the courts located in that jurisdiction.
        </P>
      </Section>

      <Section title="13. Changes to these terms">
        <P>
          We may update these Terms from time to time. We will revise the "Last updated" date above,
          and continued use of the Service after changes means you accept the updated Terms.
        </P>
      </Section>

      <Section title="14. Contact">
        <P>
          Questions about these Terms? Email us at <MailLink />.
        </P>
      </Section>
    </LegalPage>
  );
}