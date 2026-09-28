import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { botFromUserAgent, experimentForPath, type Experiment } from "./experiments";

/**
 * Writes lab_hits rows for the Rankbox lab experiments. A logging failure
 * never breaks the page: it's caught and reported, and a slow insert is cut
 * off after a second so a bot's response isn't held up.
 */

const LOG_TIMEOUT_MS = 1000;

const clip = (value: string | null | undefined, max = 500) => (value ? value.slice(0, max) : null);

export interface LabHitRow {
  experiment: Experiment;
  kind: "request" | "beacon";
  path: string;
  query: string | null;
  status: number | null;
  bot: string | null;
  user_agent: string | null;
  referer: string | null;
  accept: string | null;
  ip: string | null;
  country: string | null;
  detail: Record<string, unknown>;
}

/** The client IP as Vercel reports it: the first x-forwarded-for entry. */
function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  return clip(forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip"), 64);
}

/** A lab_hits row for one request, from its headers alone. */
export function hitFromRequest(
  request: Request,
  experiment: Experiment,
  kind: LabHitRow["kind"],
  status: number | null,
  detail: Record<string, unknown> = {},
): LabHitRow {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent");
  const headers: Record<string, string> = {};
  // The headers that tell AI fetchers and agents apart, when present.
  for (const name of [
    "sec-fetch-site",
    "sec-fetch-mode",
    "sec-fetch-dest",
    "signature-agent",
    "signature-input",
    "from",
  ]) {
    const value = request.headers.get(name);
    if (value) headers[name] = value.slice(0, 300);
  }
  return {
    experiment,
    kind,
    path: url.pathname.slice(0, 300),
    query: clip(url.search.replace(/^\?/, ""), 500),
    status,
    bot: botFromUserAgent(ua),
    user_agent: clip(ua),
    referer: clip(request.headers.get("referer")),
    accept: clip(request.headers.get("accept"), 300),
    ip: clientIp(request),
    country: clip(request.headers.get("x-vercel-ip-country"), 8),
    detail: Object.keys(headers).length ? { ...detail, headers } : detail,
  };
}

export async function insertLabHit(row: LabHitRow): Promise<void> {
  const write = supabaseAdmin
    .from("lab_hits" as never)
    .insert(row as never)
    .then(({ error }: { error: { message: string } | null }) => {
      if (error) console.error("lab_hits insert failed", error.message);
    });
  await Promise.race([write, new Promise((resolve) => setTimeout(resolve, LOG_TIMEOUT_MS))]);
}

/**
 * Called by the server entry after it has a response. Logs every /lab page
 * request, and bot requests to blog posts (for the IndexNow trial). The
 * beacon endpoint logs itself, with the beacon's payload.
 */
export async function logLabRequest(request: Request, response: Response): Promise<void> {
  try {
    const path = new URL(request.url).pathname;
    if (path === "/lab/beacon") return;
    const experiment = experimentForPath(path);
    if (!experiment) return;
    if (experiment === "b6" && !botFromUserAgent(request.headers.get("user-agent"))) return;
    await insertLabHit(hitFromRequest(request, experiment, "request", response.status));
  } catch (error) {
    console.error("lab logging failed", error);
  }
}
