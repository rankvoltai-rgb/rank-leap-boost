## Goal

Add a complete set of customer-facing legal/policy pages for **Autusus LLC** (operating Rankvolt), wired into the footer, styled with the existing design system. Reduce legal exposure with clear, honest, app-accurate policies.

## Facts used (from you)
- **Entity:** Autusus LLC
- **Contact:** Rankvoltai@gmail.com (used for legal, privacy, and support)
- **Refunds:** No refunds; cancel anytime, access runs to end of the paid billing period
- **Governing law:** United States (state of formation left as a clearly-marked `[State]` placeholder for you to confirm — I won't invent a jurisdiction)

These are presentation/content pages only — no backend, schema, or auth changes.

## Pages (each its own route + SEO head)

```text
src/routes/legal.tsx              -> shared layout (<Outlet/>, prose styling, last-updated)
src/routes/legal.privacy.tsx      -> /legal/privacy
src/routes/legal.terms.tsx        -> /legal/terms
src/routes/legal.refunds.tsx      -> /legal/refunds
src/routes/legal.cookies.tsx      -> /legal/cookies
src/routes/legal.acceptable-use.tsx -> /legal/acceptable-use
src/routes/legal.dpa.tsx          -> /legal/dpa
```

A small shared `LegalLayout` (title, last-updated date, max-width prose column, back-to-home, cross-links between policies) keeps all pages visually consistent and reusing existing tokens/typography. Content rendered as normal JSX — no `dangerouslySetInnerHTML`.

### 1. Privacy Policy (`/legal/privacy`)
What data is collected (account/email via auth, billing handled by the payment processor, usage data, published-content data, cookies/analytics), how it's used, third-party processors (payment provider, hosting/database, AI providers used to generate articles), data retention, user rights (access/deletion/export — GDPR & CCPA framed generically), how to exercise them via the contact email, security practices stated factually (encryption in transit, access controls), children's data (not for under-13/16), and update notice.

### 2. Terms of Service (`/legal/terms`)
Acceptance, description of service (AI-generated SEO/GEO articles + publishing), account responsibilities, subscription & billing, **AI-content disclaimer** (output may contain inaccuracies; customer is responsible for reviewing/editing before publishing — important liability shield), acceptable use reference, intellectual property (customer owns published output; Rankvolt retains platform IP), third-party integrations (Framer/Shopify/WordPress etc.), disclaimers of warranty, limitation of liability, indemnification, termination, governing law (`[State]`, USA), changes to terms.

### 3. Refund & Cancellation Policy (`/legal/refunds`)
States plainly: subscriptions are non-refundable; cancel anytime; access continues until the end of the current paid billing period; no partial/prorated refunds. Matches existing "cancel anytime" site copy. How to cancel + contact email. Note on involuntary charges/billing errors handled case-by-case.

### 4. Cookie Policy (`/legal/cookies`)
Types of cookies used (essential/session/auth, analytics), purpose, how to control them in the browser, link to Privacy Policy.

### 5. Acceptable Use Policy (`/legal/acceptable-use`)
Prohibited uses: illegal content, spam/cloaking/black-hat SEO, malware, IP infringement, generating deceptive or harmful content, reverse engineering, abuse of the publishing API. Consequences (suspension/termination).

### 6. Data Processing Addendum (`/legal/dpa`)
Plain-language DPA for business customers: roles (customer = controller, Autusus LLC = processor), categories of data processed, subprocessors list, security commitments, data deletion on termination, contact for DPA requests. Marked as app-owner-maintained, not an independent certification.

## Wiring
- **Footer** (`src/components/landing/Footer.tsx`): replace the dead `#top` anchors in the **Legal** column with real `<Link>`s — Privacy → `/legal/privacy`, Terms → `/legal/terms`, Refunds → `/legal/refunds`, plus add Cookies / Acceptable Use / DPA. (Affiliates left as-is or removed since no affiliate program exists — I'll drop it to avoid implying a program that doesn't exist.)
- **Auth page** (`src/routes/auth.tsx`): add a small "By continuing you agree to our Terms & Privacy Policy" line linking the two pages (standard signup-consent practice).
- **Sitemap** (`src/routes/sitemap[.]xml.ts`): add the new legal routes so they're indexable.

## Qualifiers (compliance-safe)
- Each page carries a "Last updated" date and a line that it is maintained by Autusus LLC.
- No false certification claims (no "SOC 2 / GDPR certified", no "we never get breached"). Security described only as enabled, factual controls.
- Governing-law state left as `[State]` placeholder with a visible note for you to fill in.

## Out of scope
- No cookie-consent banner widget (can be a follow-up if you want active EU consent gating).
- No backend, billing, or auth logic changes.
- No new design language — reuses existing tokens, fonts, and layout primitives.

## Verification
- Build passes; visit each `/legal/*` route in the preview and confirm content renders, cross-links and footer links navigate correctly, and metadata/titles are unique per page.
