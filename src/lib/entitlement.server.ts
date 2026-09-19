/**
 * Server-side generation entitlement.
 *
 * The product rule is "nothing generates until a trial is started", but until
 * now that was enforced nowhere: `generateBlogContent` is a plain POST server
 * function that only checked auth, and `runAutopilot` selected purely on
 * `content_settings.autopilot_enabled` (which defaults to true). Both the UI
 * checks and the credit check were bypassable — credits are granted during
 * onboarding, before any payment.
 *
 * Needs no schema change: `public.subscriptions` already exists and is written
 * by the Stripe webhook.
 */
import type { StripeEnv } from "@/lib/stripe.server";
import { getServerStripeEnv } from "@/lib/stripe.server";

/** Statuses that entitle a user to generate. */
const ENTITLED = new Set(["trialing", "active", "past_due"]);

export class TrialRequiredError extends Error {
  constructor() {
    super("Start your free trial to generate articles.");
    this.name = "TrialRequiredError";
  }
}

interface SubRow {
  status: string | null;
  current_period_end: string | null;
}

function rowEntitles(row: SubRow | null | undefined): boolean {
  if (!row?.status) return false;
  if (ENTITLED.has(row.status)) return true;
  // A cancelled plan still entitles until the paid period actually ends.
  if (row.status === "canceled" && row.current_period_end) {
    return new Date(row.current_period_end).getTime() > Date.now();
  }
  return false;
}

type MinimalClient = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (
        c: string,
        v: string,
      ) => {
        eq: (
          c: string,
          v: string,
        ) => {
          order: (
            c: string,
            o: { ascending: boolean },
          ) => {
            limit: (n: number) => {
              maybeSingle: () => PromiseLike<{ data: SubRow | null }>;
            };
          };
        };
      };
    };
  };
};

/**
 * Whether this user may generate.
 *
 * `environment` is taken from the server, never the caller — both Stripe keys
 * live on the same worker, so a client-chosen "sandbox" would otherwise let
 * someone complete a $0 test-mode checkout and unlock real generation.
 */
export async function hasGenerationEntitlement(
  supabase: unknown,
  userId: string,
  env: StripeEnv = getServerStripeEnv(),
): Promise<boolean> {
  const client = supabase as MinimalClient;
  const { data } = await client
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .eq("environment", env)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return rowEntitles(data);
}

/**
 * Throws unless the user may generate.
 *
 * Known race: `subscriptions` is written asynchronously by the Stripe webhook,
 * so a user who just completed checkout can briefly have no row and be told to
 * start a trial they already started. The UI softens this by only reaching here
 * on an explicit Generate click (well after the redirect back), but closing it
 * properly means reconciling against Stripe on miss — deliberately not done
 * here because that adds a Stripe round trip to every blocked call.
 */
export async function requireGenerationEntitlement(
  supabase: unknown,
  userId: string,
): Promise<void> {
  if (!(await hasGenerationEntitlement(supabase, userId))) {
    throw new TrialRequiredError();
  }
}
