import { createFileRoute } from "@tanstack/react-router";
import {
  LegalPage,
  Section,
  P,
  Ul,
  Li,
  B,
  PolicyLink,
} from "@/components/legal/legal-ui";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Rankvolt" },
      {
        name: "description",
        content:
          "How Rankvolt uses cookies and similar technologies, the types of cookies we use, and how to control them.",
      },
      { property: "og:title", content: "Cookie Policy — Rankvolt" },
      {
        property: "og:description",
        content: "Learn about the cookies Rankvolt uses and how to manage them.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rankvolt.top/legal/cookies" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/legal/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPage
      current="/legal/cookies"
      title="Cookie Policy"
      summary="This policy explains how Rankvolt uses cookies and similar technologies, and how you can control them."
    >
      <Section title="1. What are cookies?">
        <P>
          Cookies are small text files stored on your device when you visit a website. They help the
          site work, remember your preferences, and understand how it is used. We also use similar
          technologies such as local storage.
        </P>
      </Section>

      <Section title="2. Types of cookies we use">
        <Ul>
          <Li>
            <B>Essential cookies.</B> Required for the Service to function — for example, to keep you
            signed in and to secure your session. These cannot be turned off without breaking the
            Service.
          </Li>
          <Li>
            <B>Preference cookies.</B> Remember your settings and choices.
          </Li>
          <Li>
            <B>Analytics cookies.</B> Help us understand how the Service is used so we can improve it.
          </Li>
        </Ul>
      </Section>

      <Section title="3. How to control cookies">
        <P>
          Most browsers let you block or delete cookies through their settings. Blocking essential
          cookies may prevent parts of the Service from working. Refer to your browser's help pages
          for instructions specific to your device.
        </P>
      </Section>

      <Section title="4. More information">
        <P>
          For details on how we handle the data collected through cookies, see our{" "}
          <PolicyLink to="/legal/privacy">Privacy Policy</PolicyLink>.
        </P>
      </Section>
    </LegalPage>
  );
}