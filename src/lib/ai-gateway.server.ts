/**
 * Server-only AI provider helper.
 *
 * Was hard-wired to the Lovable AI Gateway with the model id duplicated across
 * four files. It now delegates to ai-config.server.ts, so the vendor and model
 * are chosen from env in one place while call sites keep the same shape.
 */
import { getAiClient, resolveAiModel, resolveAiProvider } from "./ai-config.server";

/** The configured provider client. Call it with a model id. */
export function createAiProvider() {
  return getAiClient().client;
}

/**
 * The active model id.
 *
 * A function rather than a const because Cloudflare Workers bind env at
 * request time — a module-scope read would resolve to undefined.
 */
export function activeModelId(): string {
  return resolveAiModel(resolveAiProvider().provider);
}
