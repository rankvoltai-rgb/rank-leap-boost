## Goal

Turn the onboarding "free trial" into a **card-validated trial**: charge **$1 immediately** to confirm the card has funds, **auto-refund it**, then start a **2-day trial** that rolls into **$49.50/month**.

## Why a rework is needed

The current checkout uses Stripe's native subscription trial (`trialDays={2}`), which charges **nothing** at signup — a trial subscription's first invoice isn't billed until the trial ends. Stripe also can't validate the card up front in that mode. To actually charge (and refund) $1 now, we switch to a **charge-then-subscribe** flow:

```text
1. User submits card in embedded checkout (mode: payment, $1)
2. Stripe charges $1  → card + funds validated, payment method saved
3. Webhook: create the real subscription with a 2-day trial on that card
4. Webhook: refund the $1 immediately
5. After 2 days → subscription bills $49.50/month automatically
```

The user still sees a single card form — only the backing mechanics change.

## Changes

### 1. Create a $1 validation product/price (Stripe)
- Product `card_validation` → price `card_validation_fee`, **$1.00 one-time**, single-purchase, SaaS tax code. Used only for the verification charge.

### 2. New server function — `createValidationCheckoutSession` (`src/lib/payments.functions.ts`)
- `mode: "payment"`, `ui_mode: "embedded_page"`, line item = `card_validation_fee`.
- `payment_intent_data`: `setup_future_usage: "off_session"` (saves the card) + `description: "Card validation (refunded)"`.
- Resolves/creates the Stripe customer with `metadata.userId` (reuse existing `resolveOrCreateCustomer`).
- Session `metadata`: `{ userId, flow: "trial_validation", planPriceId: "business_monthly", trialDays: "2" }`.
- Returns `{ clientSecret }` with the same error-handling pattern as the existing function. The existing `createCheckoutSession` stays as-is for any other use.

### 3. Webhook: handle `checkout.session.completed` (`src/routes/api/public/payments/webhook.ts`)
When `metadata.flow === "trial_validation"`:
1. Guard for idempotency (skip if a subscription already exists for this customer/user in this env).
2. Retrieve the session's PaymentIntent → set the saved payment method as the customer's default.
3. Create the subscription: `business_monthly` (resolved via `lookup_keys`), `trial_period_days: 2`, `default_payment_method`, `metadata.userId`. This fires `customer.subscription.created`, which the existing handler already stores + refills 30 credits — no change there.
4. **Refund the $1** PaymentIntent (`stripe.refunds.create`).
- Adds `createStripeClient` import to the webhook for the subscription-create + refund calls.

### 4. Checkout component (`src/components/StripeEmbeddedCheckout.tsx` + `Onboarding.tsx`)
- Point the onboarding checkout at the new validation session (either a `mode="validation"` prop on the component or a small dedicated wrapper). Drops the `trialDays`/`priceId="business_monthly"` subscription path in favor of the $1 validation session; the plan + trial length are carried in session metadata.

### 5. Copy updates (`src/components/auth/Onboarding.tsx`)
Reword the trial messaging to reflect the $1 validation, e.g.:
- Badge: "$1 to verify your card · refunded instantly".
- Checkout heading/subline: "We'll charge **$1 to confirm your card** and refund it right away. Free for 48 hours, then $49.50/month — cancel anytime."
- Trust chips: "$1 refundable check" instead of "48h free" where relevant.

### 6. Quiet fix (unrelated bug)
The footer Trustpilot widget renders a fallback `<a>` on the server and the Trustpilot script swaps in an `<iframe>` on the client, causing a **hydration mismatch** on the homepage. I'll make that widget client-only (render after mount) so SSR and client markup agree.

## Notes / trade-offs
- The $1 appears then disappears on the customer's statement (authorization + refund). This is standard for card-validation trials.
- In sandbox, test with card `4242 4242 4242 4242`; the $1 charge + refund both show in the payments dashboard.
- If a card has no funds, the $1 fails at checkout and no subscription is created — exactly the validation behavior requested.
