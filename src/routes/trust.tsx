import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  Section,
  P,
  Ul,
  Li,
  B,
  MailLink,
  PolicyLink,
  LEGAL_ENTITY,
  LEGAL_BRAND,
  LEGAL_UPDATED,
} from "@/components/legal/legal-ui";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust & Security — Rankvolt" },
      {
        name: "description",
        content:
          "How Rankvolt approaches security, privacy, and data protection — the controls we have in place and how responsibility is shared between us, our platform, and you.",
      },
      { property: "og:title", content: "Trust & Security — Rankvolt" },
      {
        property: "og:description",
        content:
          "Learn about Rankvolt's security and privacy practices: authentication, hosting, data handling, subprocessors, retention, and how to report a concern.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rankvolt.top/trust" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/trust" }],
  }),
  component: TrustPage,
});

function TrustPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="border-t border-border bg-surface/30">
        <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
          >
            ← Back to home
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-volt">
            Trust Center
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-ink">
            Trust &amp; Security
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            This page is maintained by {LEGAL_ENTITY} to answer common security and privacy
            questions about {LEGAL_BRAND}. It describes the controls and practices currently in
            place. It is editable project content, not an independent audit or certification.
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            Last updated {LEGAL_UPDATED} · Maintained by {LEGAL_ENTITY} (operator of {LEGAL_BRAND})
          </p>

          <div className="mt-10 space-y-9 text-[0.975rem] leading-relaxed text-muted-foreground">
            <Section title="Shared responsibility">
              <P>
                Security is a shared effort. Our cloud platform provider operates the underlying
                infrastructure; we configure and build the application securely; and you protect
                your account by using a strong, unique password and keeping your credentials
                private.
              </P>
            </Section>

            <Section title="Authentication & access">
              <Ul>
                <Li>
                  <B>Accounts</B> — access requires signing in. Passwords are handled by our
                  managed authentication provider and are never stored by us in plain text.
                </Li>
                <Li>
                  <B>Optional Google sign-in</B> — you can sign in with Google so credentials are
                  managed by your identity provider.
                </Li>
                <Li>
                  <B>Data isolation</B> — application data such as your articles, keywords,
                  settings, and billing records is scoped to your account so each user can only
                  access their own data.
                </Li>
                <Li>
                  <B>Credit integrity</B> — credit balances and transactions are read-only from the
                  app and can only be changed by trusted server-side processes, so balances cannot
                  be altered from the browser.
                </Li>
              </Ul>
            </Section>

            <Section title="Hosting & platform">
              <P>
                {LEGAL_BRAND} runs on Lovable Cloud, which provides managed hosting, database, and
                authentication on established cloud infrastructure. Traffic to the application is
                served over encrypted HTTPS connections.
              </P>
            </Section>

            <Section title="Data we collect & how we use it">
              <P>
                We collect the information needed to run the Service — such as account details, your
                brand and content settings, the articles and keywords you create, and billing
                status. We use it to operate, maintain, and improve the Service. For full detail,
                see our <PolicyLink to="/legal/privacy">Privacy Policy</PolicyLink>.
              </P>
            </Section>

            <Section title="Subprocessors & integrations">
              <P>
                We rely on a small set of trusted third parties to deliver the Service, including:
              </P>
              <Ul>
                <Li>
                  <B>Cloud platform & database</B> — hosting, storage, and authentication.
                </Li>
                <Li>
                  <B>Payment processing</B> — billing and subscription management. We do not store
                  full card numbers on our servers.
                </Li>
                <Li>
                  <B>AI providers</B> — to generate and score content.
                </Li>
                <Li>
                  <B>Publishing & research integrations</B> — to research topics and publish
                  articles to the destinations you connect.
                </Li>
              </Ul>
              <P>
                Business customers can review our{" "}
                <PolicyLink to="/legal/dpa">Data Processing Addendum</PolicyLink>.
              </P>
            </Section>

            <Section title="Cookies & analytics">
              <P>
                We use cookies and similar technologies to keep you signed in and to understand how
                the Service is used. You can control these as described in our{" "}
                <PolicyLink to="/legal/cookies">Cookie Policy</PolicyLink>.
              </P>
            </Section>

            <Section title="Data retention & deletion">
              <P>
                We keep your data for as long as your account is active or as needed to provide the
                Service and meet legal obligations. You can request deletion of your account and
                associated data by contacting us at <MailLink />.
              </P>
            </Section>

            <Section title="Your privacy rights">
              <P>
                Depending on where you live, you may have rights to access, correct, export, or
                delete your personal data. To exercise these rights, see our{" "}
                <PolicyLink to="/legal/privacy">Privacy Policy</PolicyLink> or contact us at{" "}
                <MailLink />.
              </P>
            </Section>

            <Section title="Reporting a security concern">
              <P>
                If you believe you have found a security vulnerability or have a concern about how
                your data is handled, please email <MailLink /> with the details. We review reports
                promptly and will work with you to understand and address the issue.
              </P>
            </Section>

            <nav className="mt-14 border-t border-border pt-8">
              <p className="text-sm font-semibold text-ink">Related policies</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <li>
                  <Link
                    to="/legal/privacy"
                    className="text-sm text-muted-foreground transition-colors hover:text-ink"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legal/terms"
                    className="text-sm text-muted-foreground transition-colors hover:text-ink"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legal/cookies"
                    className="text-sm text-muted-foreground transition-colors hover:text-ink"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legal/dpa"
                    className="text-sm text-muted-foreground transition-colors hover:text-ink"
                  >
                    Data Processing Addendum
                  </Link>
                </li>
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                Questions about security or privacy? Contact us at <MailLink />.
              </p>
            </nav>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
