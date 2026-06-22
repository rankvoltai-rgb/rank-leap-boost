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

export const Route = createFileRoute("/legal/refunds")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — Rankvolt" },
      {
        name: "description",
        content:
          "Rankvolt's refund and cancellation policy: subscriptions are non-refundable, you can cancel anytime, and access continues until the end of your paid billing period.",
      },
      { property: "og:title", content: "Refund & Cancellation Policy — Rankvolt" },
      {
        property: "og:description",
        content: "How cancellations and refunds work for Rankvolt subscriptions.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rankvolt.top/legal/refunds" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/legal/refunds" }],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <LegalPage
      current="/legal/refunds"
      title="Refund & Cancellation Policy"
      summary="We keep this simple: cancel anytime, no long-term contracts, and your access stays active until the end of the period you already paid for."
    >
      <Section title="1. Cancel anytime">
        <P>
          You can cancel your Rankvolt subscription at any time from your account billing settings.
          When you cancel, your plan will not renew, and you will keep access to paid features until
          the end of your current paid billing period.
        </P>
      </Section>

      <Section title="2. No refunds">
        <P>
          Subscription fees are <B>non-refundable</B>. We do not provide refunds or credits for
          partial billing periods, unused time, or features you did not use. This includes both
          monthly and any longer-term plans.
        </P>
      </Section>

      <Section title="3. Exceptions">
        <Ul>
          <Li>
            <B>Billing errors.</B> If you were charged in error or charged more than once for the
            same period, contact us and we will review and correct verified errors.
          </Li>
          <Li>
            <B>Where required by law.</B> If applicable consumer-protection law in your jurisdiction
            requires a refund, we will honor it.
          </Li>
        </Ul>
      </Section>

      <Section title="4. How to cancel or request a review">
        <P>
          Cancel from your billing settings inside the app, or email us at <MailLink /> and we will
          help. For billing-error reviews, include the email on your account and the approximate
          date and amount of the charge.
        </P>
      </Section>

      <Section title="5. Related terms">
        <P>
          This policy is part of, and should be read together with, our{" "}
          <PolicyLink to="/legal/terms">Terms of Service</PolicyLink>.
        </P>
      </Section>
    </LegalPage>
  );
}