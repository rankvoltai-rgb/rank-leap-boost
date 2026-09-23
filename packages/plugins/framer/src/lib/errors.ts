import { RankboxApiError } from "@rankbox/api-client";

export interface ErrorAction {
  label: string;
  /** An absolute URL to open, or a local intent the UI handles itself. */
  href?: string;
  intent?: "reconnect" | "retry" | "reset-fields";
}

export interface DescribedError {
  title: string;
  body: string;
  action?: ErrorAction;
}

export interface ErrorContext {
  baseUrl: string;
  /** What the plugin was doing, so a PATCH 400 can be explained properly. */
  phase?: "connect" | "sync" | "report";
  /** Domains named in an API rejection, for the mismatch message. */
  expectedDomains?: string[];
  actualDomain?: string;
}

/**
 * The API's 400 for an off-domain `published_url` names the allowed domains in
 * its message. Pull them out so the plugin can say which domain to fix rather
 * than echoing a raw error.
 */
export function parseAllowedDomains(message: string): string[] {
  const match = /must be on your own site \(([^)]+)\)/i.exec(message);
  if (!match) return [];
  return match[1]
    .split(/\s+or\s+|,\s*/)
    .map((d) => d.trim())
    .filter((d) => d && d.includes("."));
}

/** Map any thrown value onto specific, actionable copy. Pure and testable. */
export function describeError(err: unknown, ctx: ErrorContext): DescribedError {
  const base = ctx.baseUrl.replace(/\/+$/, "");

  if (err instanceof RankboxApiError) {
    switch (true) {
      case err.status === 0:
        return {
          title: "Couldn't reach Rankbox",
          body: "Check your connection and try again.",
          action: { label: "Try again", intent: "retry" },
        };

      case err.status === 401:
        return {
          title: "That key isn't valid any more",
          body: "It may have been revoked or replaced. Create a new one in Rankbox and paste it in.",
          action: { label: "Open Integrations", href: `${base}/dashboard/integrations` },
        };

      case err.status === 402 || err.code === "subscription_required":
        return {
          // The server's message already explains both causes (no plan, or the
          // site removed from Studio), so use it rather than inventing copy.
          title: "This site isn't on an active plan",
          body: err.message,
          action: { label: "Open billing", href: `${base}/dashboard/billing` },
        };

      case err.status === 429:
        return {
          title: "Rankbox is rate-limiting this key",
          body: "Too many requests in the last minute. Wait a moment, then run the sync again.",
          action: { label: "Try again", intent: "retry" },
        };

      case err.status === 400 && ctx.phase === "report": {
        const allowed = ctx.expectedDomains?.length
          ? ctx.expectedDomains
          : parseAllowedDomains(err.message);
        if (allowed.length && ctx.actualDomain) {
          return {
            title: "Your Framer domain doesn't match Rankbox",
            body: `Rankbox expects your articles on ${allowed.join(" or ")}, but this project publishes to ${ctx.actualDomain}. Publish to your own domain, or update your website in Rankbox settings.`,
            action: { label: "Open Rankbox settings", href: `${base}/dashboard/settings` },
          };
        }
        return { title: "Rankbox wouldn't accept that URL", body: err.message };
      }

      case err.status === 400:
        return { title: "Rankbox rejected the request", body: err.message };

      case err.status >= 500:
        return {
          title: "Rankbox had a problem",
          body: "Something went wrong on their side. Try again in a minute.",
          action: { label: "Try again", intent: "retry" },
        };

      default:
        return { title: "Something went wrong", body: err.message };
    }
  }

  const message = err instanceof Error ? err.message : String(err);

  // Framer rejects field changes when the collection's schema has drifted.
  if (/field/i.test(message) && /invalid|reject|mismatch|type/i.test(message)) {
    return {
      title: "Framer wouldn't accept the collection fields",
      body: "If you changed one of Rankbox's fields in the CMS, reset them and sync again.",
      action: { label: "Reset fields", intent: "reset-fields" },
    };
  }

  return { title: "Something went wrong", body: message || "Unknown error." };
}

/** The one-line form used in headless mode, where there is no UI to render. */
export function describeErrorLine(err: unknown, ctx: ErrorContext): string {
  const { title, body } = describeError(err, ctx);
  return `${title}. ${body}`;
}
