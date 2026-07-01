import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import {
  createCheckoutSession,
  createValidationCheckoutSession,
} from "@/lib/payments.functions";

interface StripeEmbeddedCheckoutProps {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  userId?: string;
  returnUrl?: string;
  trialDays?: number;
  /**
   * When set, charge a one-time validation fee (`priceId`) now, then let the
   * webhook create a trialing subscription for `planPriceId` and refund the fee.
   */
  validatePlanPriceId?: string;
}

export function StripeEmbeddedCheckout({
  priceId,
  quantity,
  customerEmail,
  userId,
  returnUrl,
  trialDays,
  validatePlanPriceId,
}: StripeEmbeddedCheckoutProps) {
  const fetchClientSecret = async (): Promise<string> => {
    const result = validatePlanPriceId
      ? await createValidationCheckoutSession({
          data: {
            validationPriceId: priceId,
            planPriceId: validatePlanPriceId,
            trialDays,
            customerEmail,
            userId,
            returnUrl: returnUrl || window.location.href,
            environment: getStripeEnvironment(),
          },
        })
      : await createCheckoutSession({
          data: {
            priceId,
            quantity,
            customerEmail,
            userId,
            returnUrl: returnUrl || window.location.href,
            environment: getStripeEnvironment(),
            trialDays,
          },
        });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
    return result.clientSecret;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}