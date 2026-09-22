import { useMemo, useRef } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { createCheckoutSession } from "@/lib/payments.functions";

/**
 * customerEmail / userId / environment / trialDays used to be props sent to the
 * server. They are now derived server-side from the caller's session and env,
 * because trusting the client with them let a caller pick a test-mode
 * environment (or a longer trial) and get a real entitlement for free.
 */
interface StripeEmbeddedCheckoutProps {
  priceId: string;
  /**
   * Where Stripe sends the browser once payment succeeds. Omit it together
   * with an `onComplete` to keep the page put — the form is then replaced in
   * place by Stripe's confirmation and the caller takes over, which is what a
   * checkout inside a dialog wants.
   */
  returnUrl?: string;
  /** Called after a successful in-place completion. Requires no `returnUrl`. */
  onComplete?: (sessionId: string) => void;
}

export function StripeEmbeddedCheckout({
  priceId,
  returnUrl,
  onComplete,
}: StripeEmbeddedCheckoutProps) {
  // Stripe calls onComplete with no arguments, so the session id has to be
  // remembered from the moment we created it.
  const sessionId = useRef<string | null>(null);

  // getStripe() throws outright on a build with no publishable key. Caught
  // here because this renders inside a dialog: an uncaught throw takes the
  // whole dashboard down over a missing environment variable.
  const stripe = useMemo(() => {
    try {
      return getStripe();
    } catch (error) {
      return error instanceof Error ? error : new Error("Payments are not configured");
    }
  }, []);

  if (stripe instanceof Error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {stripe.message}
      </p>
    );
  }

  const fetchClientSecret = async (): Promise<string> => {
    const result = await createCheckoutSession({
      data: { priceId, ...(returnUrl && { returnUrl }) },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
    sessionId.current = result.sessionId;
    return result.clientSecret;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripe}
        options={{
          fetchClientSecret,
          ...(onComplete && { onComplete: () => onComplete(sessionId.current ?? "") }),
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
