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
} from "@/components/legal/legal-ui";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Rankvolt" },
      {
        name: "description",
        content:
          "How Autusus LLC (Rankvolt) collects, uses, shares, and protects your personal data, and the privacy rights available to you.",
      },
      { property: "og:title", content: "Privacy Policy — Rankvolt" },
      {
        property: "og:description",
        content: "Learn what data Rankvolt collects, how it is used, and your privacy rights.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rankvolt.top/legal/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/legal/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      current="/legal/privacy"
      title="Privacy Policy"
      summary="This policy explains what personal information we collect when you use Rankvolt, how we use it, who we share it with, and the choices and rights you have."
    >
      <Section title="1. Who we are">
        <P>
          Rankvolt is operated by <B>Autusus LLC</B> ("Rankvolt", "we", "us", or "our"). This
          Privacy Policy applies to our website, app, and related services (the "Service"). If you
          have any questions, contact us at <MailLink />.
        </P>
      </Section>

      <Section title="2. Information we collect">
        <Ul>
          <Li>
            <B>Account information</B> — your name, email address, and password (stored hashed) when
            you create an account.
          </Li>
          <Li>
            <B>Billing information</B> — handled by our third-party payment processor. We do not
            store full card numbers on our servers; we keep records such as plan, billing status,
            and transaction identifiers.
          </Li>
          <Li>
            <B>Content and configuration</B> — the websites, keywords, settings, and articles you
            create, generate, or publish through the Service.
          </Li>
          <Li>
            <B>Usage data</B> — log data, device and browser information, and analytics about how you
            interact with the Service.
          </Li>
          <Li>
            <B>Cookies</B> — see our <PolicyLink to="/legal/cookies">Cookie Policy</PolicyLink>.
          </Li>
        </Ul>
      </Section>

      <Section title="3. How we use your information">
        <Ul>
          <Li>To provide, operate, secure, and improve the Service.</Li>
          <Li>To generate, research, and publish content on your behalf.</Li>
          <Li>To process payments and manage your subscription.</Li>
          <Li>To communicate with you about your account, updates, and support requests.</Li>
          <Li>To detect, prevent, and address fraud, abuse, and security issues.</Li>
          <Li>To comply with legal obligations.</Li>
        </Ul>
      </Section>

      <Section title="4. Service providers we share data with">
        <P>
          We share data with trusted providers only as needed to run the Service. These currently
          include categories such as:
        </P>
        <Ul>
          <Li>Cloud hosting and database providers (to store and serve your data).</Li>
          <Li>A payment processor (to handle subscriptions and billing).</Li>
          <Li>AI model providers (to research and generate article content you request).</Li>
          <Li>Analytics and email providers (to operate and improve the Service).</Li>
        </Ul>
        <P>
          We do not sell your personal information. We may disclose information if required by law or
          to protect our rights, users, or the public.
        </P>
      </Section>

      <Section title="5. Data retention">
        <P>
          We retain personal information for as long as your account is active or as needed to
          provide the Service, comply with legal obligations, resolve disputes, and enforce our
          agreements. When you delete your account, we delete or anonymize your personal data within
          a reasonable period, except where retention is legally required.
        </P>
      </Section>

      <Section title="6. Your privacy rights">
        <P>
          Depending on where you live (for example, under the GDPR or CCPA), you may have the right
          to access, correct, export, or delete your personal data, and to object to or restrict
          certain processing. To exercise any of these rights, email us at <MailLink />. We will
          respond within the timeframe required by applicable law.
        </P>
      </Section>

      <Section title="7. Security">
        <P>
          We use technical and organizational measures to protect your data, including encryption in
          transit and access controls. No method of transmission or storage is completely secure, so
          we cannot guarantee absolute security.
        </P>
      </Section>

      <Section title="8. International transfers">
        <P>
          Your information may be processed in countries other than your own. Where required, we use
          appropriate safeguards for international data transfers.
        </P>
      </Section>

      <Section title="9. Children's privacy">
        <P>
          The Service is not directed to children under 16, and we do not knowingly collect personal
          data from them. If you believe a child has provided us data, contact us so we can remove
          it.
        </P>
      </Section>

      <Section title="10. Changes to this policy">
        <P>
          We may update this policy from time to time. When we do, we will revise the "Last updated"
          date above and, where appropriate, notify you. Continued use of the Service after changes
          means you accept the updated policy.
        </P>
      </Section>
    </LegalPage>
  );
}