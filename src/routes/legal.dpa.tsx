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

export const Route = createFileRoute("/legal/dpa")({
  head: () => ({
    meta: [
      { title: "Data Processing Addendum — Rankvolt" },
      {
        name: "description",
        content:
          "Rankvolt's Data Processing Addendum for business customers: roles, data categories, subprocessors, security, and deletion commitments.",
      },
      { property: "og:title", content: "Data Processing Addendum — Rankvolt" },
      {
        property: "og:description",
        content: "How Autusus LLC processes personal data on behalf of business customers.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rankvolt.top/legal/dpa" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/legal/dpa" }],
  }),
  component: DpaPage,
});

function DpaPage() {
  return (
    <LegalPage
      current="/legal/dpa"
      title="Data Processing Addendum"
      summary="This plain-language addendum describes how Autusus LLC processes personal data on behalf of business customers. It is maintained by Autusus LLC and is not an independent certification."
    >
      <Section title="1. Roles of the parties">
        <P>
          For personal data you submit to the Service about your own end users, you are the{" "}
          <B>data controller</B> and Autusus LLC acts as a <B>data processor</B>, processing that
          data only on your documented instructions and to provide the Service.
        </P>
      </Section>

      <Section title="2. Categories of data and data subjects">
        <Ul>
          <Li>
            <B>Data subjects:</B> your authorized users and any individuals referenced in the content
            you process.
          </Li>
          <Li>
            <B>Data categories:</B> account identifiers, contact details, content and configuration
            you provide, and usage data generated through the Service.
          </Li>
        </Ul>
      </Section>

      <Section title="3. Subprocessors">
        <P>
          We engage vetted subprocessors to deliver the Service, including cloud hosting and
          database providers, a payment processor, AI model providers, and analytics and email
          providers. We require subprocessors to provide a level of data protection consistent with
          this addendum, and we remain responsible for their performance.
        </P>
      </Section>

      <Section title="4. Security measures">
        <P>
          We maintain technical and organizational measures appropriate to the risk, including
          encryption in transit, access controls, and logging. See our{" "}
          <PolicyLink to="/legal/privacy">Privacy Policy</PolicyLink> for more detail.
        </P>
      </Section>

      <Section title="5. Confidentiality and personnel">
        <P>
          Personnel authorized to process personal data are bound by appropriate confidentiality
          obligations and access data only as needed to provide the Service.
        </P>
      </Section>

      <Section title="6. Data subject requests and assistance">
        <P>
          We will provide reasonable assistance to help you respond to data subject requests and to
          meet your obligations regarding security, breach notification, and impact assessments,
          taking into account the nature of the processing.
        </P>
      </Section>

      <Section title="7. Return and deletion of data">
        <P>
          Upon termination of your account, and on your written request, we will delete or return
          personal data processed on your behalf within a reasonable period, except where retention
          is required by law.
        </P>
      </Section>

      <Section title="8. Contact">
        <P>
          For data processing requests or to put a signed agreement in place, email us at{" "}
          <MailLink />.
        </P>
      </Section>
    </LegalPage>
  );
}