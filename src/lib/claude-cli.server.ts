/**
 * Text generation through the locally installed Claude Code CLI.
 *
 * Runs `claude -p` as a child process, so requests go through whatever account
 * the CLI is logged in to (a Claude subscription) instead of spending API
 * credits. The flip side: it only works where that process can start — a Node
 * server on a machine with Claude Code installed and logged in, i.e. `npm run
 * dev` locally. The production build targets Cloudflare Workers, which cannot
 * spawn processes, so pin an API provider there.
 *
 * Only what the call sites use is implemented: text in, text out. No tools,
 * files or structured output — callers already parse JSON out of the text.
 *
 * Env (all optional, read per call):
 *   CLAUDE_CLI_PATH         binary to run (default "claude")
 *   CLAUDE_CLI_TIMEOUT_MS   per-call limit (default 15 minutes)
 *   CLAUDE_CLI_CONCURRENCY  CLI processes allowed at once (default 2)
 */
import type { LanguageModel } from "ai";

/** The AI SDK provider-spec model object: the non-string half of LanguageModel. */
export type LanguageModelV2 = Exclude<LanguageModel, string>;

type CallOptions = Parameters<LanguageModelV2["doGenerate"]>[0];
type GenerateResult = Awaited<ReturnType<LanguageModelV2["doGenerate"]>>;
type CallWarning = GenerateResult["warnings"][number];
type StreamPart =
  Awaited<ReturnType<LanguageModelV2["doStream"]>>["stream"] extends ReadableStream<infer P>
    ? P
    : never;

/** The final `result` event of `claude -p --output-format stream-json` — fields read here. */
interface CliResultEvent {
  type: "result";
  is_error?: boolean;
  result?: string;
  stop_reason?: string | null;
  session_id?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
}

interface CliAssistantEvent {
  type: "assistant";
  message?: { id?: string; content?: Array<{ type?: string; text?: string }> };
}

interface CliResult extends CliResultEvent {
  /** The answer's text, joined across every message it spanned. */
  text: string;
  /** How many assistant messages carried text; more than one means the CLI continued. */
  messages: number;
}

const DEFAULT_TIMEOUT_MS = 15 * 60_000;
const DEFAULT_CONCURRENCY = 2;

/**
 * The CLI's own default output budget. Thinking tokens count against it, and
 * when a reply outgrows it the CLI silently continues in a new message — so a
 * caller's small maxOutputTokens (sized for providers that don't think) is
 * never passed down as a cap, only raised above this.
 */
const CLI_OUTPUT_TOKENS = 32_000;
const CLI_OUTPUT_TOKENS_MAX = 64_000;

/**
 * Replaces the CLI's own coding-agent system prompt, which would otherwise
 * steer every article toward talking about code and files.
 */
const DEFAULT_SYSTEM_PROMPT =
  "You are a writing engine for a content platform. Follow the user's instructions exactly and output only the requested content, with no preamble or commentary.";

/** Call settings the CLI has no flag for. Reported as warnings, not errors. */
const UNSUPPORTED_SETTINGS = [
  "temperature",
  "topP",
  "topK",
  "stopSequences",
  "presencePenalty",
  "frequencyPenalty",
  "seed",
  "responseFormat",
] as const;

function envInt(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/* Each call is a full CLI process, and the subscription has its own rate
   limits, so a burst of users queues here instead of spawning a process each. */
let running = 0;
const waiting: Array<() => void> = [];

async function withSlot<T>(task: () => Promise<T>): Promise<T> {
  if (running >= envInt("CLAUDE_CLI_CONCURRENCY", DEFAULT_CONCURRENCY)) {
    // Resolved by a finishing call that hands its slot over, so `running`
    // never dips and a newcomer cannot slip in ahead of the queue.
    await new Promise<void>((resolve) => waiting.push(resolve));
  } else {
    running += 1;
  }
  try {
    return await task();
  } finally {
    const next = waiting.shift();
    if (next) next();
    else running -= 1;
  }
}

/**
 * Flattens the SDK prompt into a system prompt plus one stdin payload.
 *
 * A single user turn — every current call site — goes through verbatim; a
 * multi-turn history becomes a labelled transcript.
 */
function toCliPrompt(prompt: CallOptions["prompt"]) {
  const system: string[] = [];
  const turns: Array<{ role: "user" | "assistant"; text: string }> = [];
  let droppedParts = false;

  for (const message of prompt) {
    if (message.role === "system") {
      system.push(message.content);
      continue;
    }
    if (message.role === "tool") {
      droppedParts = true;
      continue;
    }
    let text = "";
    for (const part of message.content) {
      if (part.type === "text") text += part.text;
      else droppedParts = true;
    }
    if (text) turns.push({ role: message.role, text });
  }

  const input =
    turns.length === 1
      ? turns[0].text
      : turns.map((t) => `${t.role === "user" ? "User" : "Assistant"}: ${t.text}`).join("\n\n");

  return { system: system.join("\n\n") || undefined, input, droppedParts };
}

function finishReason(stopReason: string | null | undefined): GenerateResult["finishReason"] {
  switch (stopReason) {
    case "end_turn":
    case "stop_sequence":
      return "stop";
    case "max_tokens":
      return "length";
    case "refusal":
      return "content-filter";
    default:
      return "other";
  }
}

async function runCli(
  args: string[],
  input: string,
  maxOutputTokens: number | undefined,
  abortSignal: AbortSignal | undefined,
): Promise<CliResult> {
  let spawn: typeof import("node:child_process").spawn;
  let tmpdir: typeof import("node:os").tmpdir;
  try {
    // Imported lazily so the Workers bundle never evaluates them unless this
    // provider is actually selected.
    ({ spawn } = await import("node:child_process"));
    ({ tmpdir } = await import("node:os"));
  } catch {
    throw new Error(
      'AI_PROVIDER "claude-cli" needs a Node.js server that can start processes. It works under `npm run dev`, not on Cloudflare Workers — pin an API provider there.',
    );
  }

  const bin = process.env.CLAUDE_CLI_PATH?.trim() || "claude";
  const env: NodeJS.ProcessEnv = { ...process.env };
  // With either of these set the CLI bills the key instead of the logged-in
  // subscription, which is exactly what this provider exists to avoid.
  delete env.ANTHROPIC_API_KEY;
  delete env.ANTHROPIC_AUTH_TOKEN;
  // Set when the dev server was itself started from a Claude Code session; the
  // CLI refuses to launch nested inside one.
  delete env.CLAUDECODE;
  delete env.CLAUDE_CODE_ENTRYPOINT;
  if (maxOutputTokens && maxOutputTokens > CLI_OUTPUT_TOKENS) {
    env.CLAUDE_CODE_MAX_OUTPUT_TOKENS = String(Math.min(maxOutputTokens, CLI_OUTPUT_TOKENS_MAX));
  }

  const timeoutMs = envInt("CLAUDE_CLI_TIMEOUT_MS", DEFAULT_TIMEOUT_MS);

  return new Promise<CliResult>((resolve, reject) => {
    // A neutral working directory keeps this repo's CLAUDE.md and .claude
    // settings out of the generation context.
    const child = spawn(bin, args, { cwd: tmpdir(), env, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (error: Error | null, result?: CliResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      abortSignal?.removeEventListener("abort", onAbort);
      if (error) reject(error);
      else resolve(result as CliResult);
    };

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      finish(new Error(`claude CLI timed out after ${Math.round(timeoutMs / 1000)}s.`));
    }, timeoutMs);

    const onAbort = () => {
      child.kill("SIGTERM");
      finish(abortSignal?.reason instanceof Error ? abortSignal.reason : new Error("Aborted."));
    };
    if (abortSignal?.aborted) return onAbort();
    abortSignal?.addEventListener("abort", onAbort, { once: true });

    child.stdout.setEncoding("utf8").on("data", (chunk: string) => (stdout += chunk));
    child.stderr.setEncoding("utf8").on("data", (chunk: string) => (stderr += chunk));

    child.on("error", (err: NodeJS.ErrnoException) => {
      finish(
        err.code === "ENOENT"
          ? new Error(
              `Claude Code CLI not found ("${bin}"). Install it, run \`claude\` once to log in, or set CLAUDE_CLI_PATH.`,
            )
          : err,
      );
    });

    child.on("close", (code) => {
      // stream-json, not json: when a reply outgrows the output budget the CLI
      // continues in further messages, and json mode's `result` holds only the
      // last one — the start of the answer is silently lost. The stream carries
      // every message, so the text is rebuilt from all of them.
      const textById = new Map<string, string>();
      let resultEvent: CliResultEvent | undefined;
      for (const line of stdout.split("\n")) {
        if (!line.trim()) continue;
        let event: CliAssistantEvent | CliResultEvent;
        try {
          event = JSON.parse(line) as CliAssistantEvent | CliResultEvent;
        } catch {
          continue;
        }
        if (event.type === "result") {
          resultEvent = event;
        } else if (event.type === "assistant") {
          const id = event.message?.id ?? `message-${textById.size}`;
          const text = (event.message?.content ?? [])
            .map((block) => (block.type === "text" ? (block.text ?? "") : ""))
            .join("");
          if (text) textById.set(id, (textById.get(id) ?? "") + text);
        }
      }

      if (!resultEvent) {
        const detail = (stderr || stdout).trim().slice(0, 500) || `exit code ${code}`;
        return finish(new Error(`claude CLI failed: ${detail}`));
      }
      if (resultEvent.is_error) {
        // Not-logged-in and usage-limit messages arrive here, in `result`.
        return finish(new Error(`claude CLI error: ${resultEvent.result ?? "unknown error"}`));
      }
      finish(null, {
        ...resultEvent,
        text: textById.size ? [...textById.values()].join("") : (resultEvent.result ?? ""),
        messages: textById.size,
      });
    });

    // The prompt goes over stdin: article prompts can exceed argv size limits.
    child.stdin.on("error", () => {
      // EPIPE when the process exits early; the close handler reports why.
    });
    child.stdin.end(input);
  });
}

/** Model factory with the same `provider(modelId)` shape as the API providers. */
export function createClaudeCli(): (modelId: string) => LanguageModelV2 {
  return (modelId) => {
    async function doGenerate(options: CallOptions): Promise<GenerateResult> {
      const warnings: CallWarning[] = [];
      for (const setting of UNSUPPORTED_SETTINGS) {
        if (options[setting] !== undefined) warnings.push({ type: "unsupported-setting", setting });
      }
      for (const tool of options.tools ?? []) {
        warnings.push({ type: "unsupported-tool", tool });
      }

      const { system, input, droppedParts } = toCliPrompt(options.prompt);
      if (droppedParts) {
        warnings.push({
          type: "other",
          message: "claude-cli only sends text parts; others were dropped.",
        });
      }

      const args = [
        "-p",
        "--output-format",
        "stream-json",
        // Required by the CLI for stream-json in print mode.
        "--verbose",
        "--model",
        modelId,
        "--system-prompt",
        system ?? DEFAULT_SYSTEM_PROMPT,
        // No tools, MCP servers, skills or user settings. Prompts carry scraped
        // website text, so the model gets nothing it could be talked into
        // running, and the CLI user's own connectors stay unreachable.
        "--tools",
        "",
        "--strict-mcp-config",
        "--setting-sources",
        "",
        "--disable-slash-commands",
        "--no-session-persistence",
      ];

      const result = await withSlot(() =>
        runCli(args, input, options.maxOutputTokens, options.abortSignal),
      );

      if (result.messages > 1) {
        warnings.push({
          type: "other",
          message: `claude-cli reply outgrew the output budget and spanned ${result.messages} messages; text was joined and may have a seam.`,
        });
      }

      const usage = result.usage ?? {};
      const cached = usage.cache_read_input_tokens ?? 0;
      const inputTokens =
        (usage.input_tokens ?? 0) + cached + (usage.cache_creation_input_tokens ?? 0);
      const outputTokens = usage.output_tokens ?? 0;

      return {
        content: [{ type: "text", text: result.text }],
        finishReason: result.messages > 1 ? "length" : finishReason(result.stop_reason),
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
          cachedInputTokens: cached,
        },
        response: { id: result.session_id, modelId, timestamp: new Date() },
        warnings,
      };
    }

    return {
      specificationVersion: "v2",
      provider: "claude-cli",
      modelId,
      supportedUrls: {},
      doGenerate,
      // The answer is collected whole before returning, so a stream is the
      // finished text replayed as a single delta.
      async doStream(options) {
        const { content, finishReason, usage, warnings, response } = await doGenerate(options);
        const text = content.map((part) => (part.type === "text" ? part.text : "")).join("");
        const stream = new ReadableStream<StreamPart>({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
            controller.enqueue({ type: "response-metadata", ...response });
            controller.enqueue({ type: "text-start", id: "0" });
            controller.enqueue({ type: "text-delta", id: "0", delta: text });
            controller.enqueue({ type: "text-end", id: "0" });
            controller.enqueue({ type: "finish", finishReason, usage });
            controller.close();
          },
        });
        return { stream };
      },
    };
  };
}
