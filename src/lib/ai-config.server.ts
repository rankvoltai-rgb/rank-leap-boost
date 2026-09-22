/**
 * Single source of truth for which LLM the server talks to.
 *
 * Before this, the model id was duplicated as a `MODEL` const in four files
 * (ai.functions, geo.server, tools.functions, autopilot.server) with no way to
 * override it, so changing model or provider meant editing all four.
 *
 * The API providers are OpenAI-compatible; "claude-cli" runs the local Claude
 * Code CLI instead (see claude-cli.server.ts). Either way callers keep using
 * the same `provider(model)` shape from the AI SDK.
 *
 * Cloudflare Workers bind env at request time, so everything below reads
 * process.env *inside* a function — never at module scope.
 */
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createClaudeCli, type LanguageModelV2 } from "./claude-cli.server";

type ApiProvider = "alibaba" | "cerebras" | "gemini" | "lovable";
export type AiProvider = ApiProvider | "claude-cli";

/**
 * Uses the machine's logged-in Claude subscription rather than an API key, so
 * it is never picked by fallback — only when AI_PROVIDER pins it.
 */
const CLAUDE_CLI = "claude-cli";
/** A CLI alias, so it tracks the current Sonnet without an id bump here. */
const CLAUDE_CLI_DEFAULT_MODEL = "sonnet";

interface ProviderSpec {
  /** Env var holding the key. */
  keyVar: string;
  baseURL: string;
  /** Env var that overrides baseURL, for vendors whose keys are per region. */
  baseURLVar?: string;
  /** Used when AI_MODEL is unset. */
  defaultModel: string;
  headers: (key: string) => Record<string, string>;
}

const PROVIDERS: Record<ApiProvider, ProviderSpec> = {
  alibaba: {
    // Model Studio (DashScope), Qwen models. Keys only work in the region
    // that issued them, so a non-Singapore account must set DASHSCOPE_BASE_URL.
    keyVar: "DASHSCOPE_API_KEY",
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    baseURLVar: "DASHSCOPE_BASE_URL",
    defaultModel: "qwen-plus",
    headers: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  cerebras: {
    keyVar: "CEREBRAS_API_KEY",
    baseURL: "https://api.cerebras.ai/v1",
    // Verified against /v1/models on this account — the catalogue is small and
    // does NOT include the llama-3.3 ids Cerebras is usually documented with.
    defaultModel: "gpt-oss-120b",
    headers: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  gemini: {
    keyVar: "GEMINI_API_KEY",
    // Google's OpenAI-compatible surface, so the same SDK client works.
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    // A *thinking* model: internal reasoning is billed against the output
    // budget. A trivial prompt spent ~75 tokens thinking before its 1-token
    // answer, and at maxOutputTokens 16 it returned finish_reason "length"
    // with empty content. Keep output budgets generous (>=1k) on this
    // provider or short-budget calls come back blank.
    defaultModel: "gemini-flash-latest",
    headers: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  lovable: {
    keyVar: "LOVABLE_API_KEY",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    defaultModel: "google/gemini-3-flash-preview",
    headers: (key) => ({
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    }),
  },
};

/**
 * Order tried when AI_PROVIDER is not pinned.
 *
 * Gemini leads because it is the one verified to serve requests on the current
 * credentials; Cerebras returns payment_required until its account has billing
 * enabled, and a key being *present* is not proof it is *usable*.
 */
const FALLBACK_ORDER: ApiProvider[] = ["gemini", "alibaba", "cerebras", "lovable"];

function isApiProvider(value: string | undefined): value is ApiProvider {
  return !!value && value in PROVIDERS;
}

type ResolvedProvider = { provider: typeof CLAUDE_CLI } | { provider: ApiProvider; apiKey: string };

/**
 * Resolves the provider to use.
 *
 * AI_PROVIDER pins one explicitly (and then its key is required, so a typo
 * fails loudly instead of silently falling back to a different vendor).
 * Otherwise the first provider with a configured key wins.
 */
export function resolveAiProvider(): ResolvedProvider {
  const pinned = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (pinned === CLAUDE_CLI) return { provider: CLAUDE_CLI };
  if (pinned) {
    if (!isApiProvider(pinned)) {
      throw new Error(
        `AI_PROVIDER="${pinned}" is not one of: ${[...Object.keys(PROVIDERS), CLAUDE_CLI].join(", ")}`,
      );
    }
    const key = process.env[PROVIDERS[pinned].keyVar];
    if (!key) {
      throw new Error(`AI_PROVIDER is "${pinned}" but ${PROVIDERS[pinned].keyVar} is not set`);
    }
    return { provider: pinned, apiKey: key };
  }

  for (const provider of FALLBACK_ORDER) {
    const key = process.env[PROVIDERS[provider].keyVar];
    if (key) return { provider, apiKey: key };
  }

  throw new Error(
    `No AI provider configured. Set one of: ${FALLBACK_ORDER.map((p) => PROVIDERS[p].keyVar).join(
      ", ",
    )}`,
  );
}

/** The model id for the active provider. AI_MODEL overrides the default. */
export function resolveAiModel(provider: AiProvider): string {
  const fallback =
    provider === CLAUDE_CLI ? CLAUDE_CLI_DEFAULT_MODEL : PROVIDERS[provider].defaultModel;
  return process.env.AI_MODEL?.trim() || fallback;
}

/**
 * The configured provider client, plus which model to ask it for.
 *
 * Call sites keep the existing `client(modelId)` shape, so switching vendor is
 * invisible to them.
 */
export function getAiClient(): {
  client: (modelId: string) => LanguageModelV2;
  provider: AiProvider;
  modelId: string;
} {
  const resolved = resolveAiProvider();
  const { provider } = resolved;
  if (resolved.provider === CLAUDE_CLI) {
    return { client: createClaudeCli(), provider, modelId: resolveAiModel(provider) };
  }
  const spec = PROVIDERS[resolved.provider];
  return {
    client: createOpenAICompatible({
      name: provider,
      baseURL: (spec.baseURLVar && process.env[spec.baseURLVar]?.trim()) || spec.baseURL,
      headers: spec.headers(resolved.apiKey),
    }),
    provider,
    modelId: resolveAiModel(provider),
  };
}

/** Convenience for call sites that just want a ready model handle. */
export function getAiModel() {
  const { client, provider, modelId } = getAiClient();
  return { model: client(modelId), provider, modelId };
}
