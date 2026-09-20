/**
 * Proving a member controls the domain they publish to.
 *
 * Nothing in the exchange happens for an unverified domain: a link earned by
 * a site nobody owns is worth nothing, and two accounts must not both earn
 * from one site. Three methods, any one of which passes, all fetched through
 * the SSRF-guarded client:
 *
 *   dns_txt     a TXT record at _rankbox.<domain>
 *   well_known  https://<domain>/.well-known/rankbox-verification containing the token
 *   meta_tag    <meta name="rankbox-site-verification" content="<token>"> on the home page
 *
 * DNS goes through Cloudflare's DNS-over-HTTPS endpoint because a Worker has
 * no resolver API; it is a fixed, public host, so the guard is happy with it.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { hasExchangeEntitlement } from "@/lib/entitlement.server";
import { safeFetchText } from "@/lib/safe-fetch.server";
import { normalizeDomain } from "./domain";
import { loadSite, siteFromRow, type SiteRow } from "./exchange.server";
import type { ExchangeSite, ExchangeVerifyMethod, VerificationResult } from "./types";

export const VERIFY_DNS_HOST_PREFIX = "_rankbox";
export const VERIFY_TXT_PREFIX = "rankbox-site-verification=";
export const VERIFY_META_NAME = "rankbox-site-verification";
export const VERIFY_WELL_KNOWN_PATH = "/.well-known/rankbox-verification";

/** A token that has been asked to prove itself this many times is being guessed at, not set up. */
const MAX_ATTEMPTS = 200;

/**
 * Claims a domain for the member. A verified site keeps its status when the
 * domain is unchanged; a different domain starts verification over.
 */
export async function startVerification(userId: string, rawDomain: string): Promise<ExchangeSite> {
  const domain = normalizeDomain(rawDomain);
  if (!domain) throw new Error("Enter the domain you publish to, like example.com.");

  const existing = await loadSite(userId);
  const paid = await hasExchangeEntitlement(supabaseAdmin, userId);

  if (existing && existing.domain === domain) {
    if (existing.paid_active !== paid) {
      await supabaseAdmin
        .from("exchange_sites")
        .update({ paid_active: paid, paid_checked_at: new Date().toISOString() })
        .eq("id", existing.id);
    }
    return siteFromRow({ ...existing, paid_active: paid });
  }

  const patch = {
    domain,
    status: "unverified" as const,
    verify_method: null,
    verified_at: null,
    verify_attempts: 0,
    paid_active: paid,
    paid_checked_at: new Date().toISOString(),
  };
  const result = existing
    ? await supabaseAdmin
        .from("exchange_sites")
        .update(patch)
        .eq("id", existing.id)
        .select("*")
        .single()
    : await supabaseAdmin
        .from("exchange_sites")
        .insert({ user_id: userId, ...patch })
        .select("*")
        .single();
  if (result.error) throw new Error(result.error.message);
  return siteFromRow(result.data);
}

/** The exact instructions for each method, for the dashboard to show. */
export function verificationInstructions(site: Pick<ExchangeSite, "domain" | "verifyToken">) {
  return {
    dns_txt: {
      host: `${VERIFY_DNS_HOST_PREFIX}.${site.domain}`,
      value: `${VERIFY_TXT_PREFIX}${site.verifyToken}`,
    },
    well_known: {
      url: `https://${site.domain}${VERIFY_WELL_KNOWN_PATH}`,
      body: site.verifyToken,
    },
    meta_tag: {
      tag: `<meta name="${VERIFY_META_NAME}" content="${site.verifyToken}">`,
    },
  };
}

interface Probe {
  method: ExchangeVerifyMethod;
  ok: boolean;
  seen: string;
}

async function probeDns(domain: string, token: string): Promise<Probe> {
  const name = `${VERIFY_DNS_HOST_PREFIX}.${domain}`;
  try {
    const res = await safeFetchText(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=TXT`,
      { accept: "application/dns-json", timeoutMs: 6000, maxBytes: 64 * 1024 },
    );
    if (res.status !== 200)
      return { method: "dns_txt", ok: false, seen: `DNS lookup returned ${res.status}` };
    const json = JSON.parse(res.body) as { Answer?: Array<{ type: number; data: string }> };
    const records = (json.Answer ?? [])
      .filter((a) => a.type === 16)
      .map((a) => a.data.replace(/^"|"$/g, "").replace(/"\s+"/g, ""));
    if (records.length === 0)
      return { method: "dns_txt", ok: false, seen: `no TXT record at ${name}` };
    const ok = records.some(
      (r) => r.trim() === `${VERIFY_TXT_PREFIX}${token}` || r.trim() === token,
    );
    return {
      method: "dns_txt",
      ok,
      seen: ok ? "TXT record matched" : `TXT at ${name} does not match the token`,
    };
  } catch (err) {
    return {
      method: "dns_txt",
      ok: false,
      seen: `DNS lookup failed (${err instanceof Error ? err.message : "error"})`,
    };
  }
}

async function fetchEither(domain: string, path: string) {
  // Most sites redirect http→https; the guard follows that itself. Try https
  // first, then plain http for the odd site that only answers there.
  for (const scheme of ["https", "http"] as const) {
    try {
      return await safeFetchText(`${scheme}://${domain}${path}`, {
        timeoutMs: 8000,
        maxBytes: 1_000_000,
      });
    } catch {
      // try the next scheme
    }
  }
  return null;
}

async function probeWellKnown(domain: string, token: string): Promise<Probe> {
  const res = await fetchEither(domain, VERIFY_WELL_KNOWN_PATH);
  if (!res)
    return {
      method: "well_known",
      ok: false,
      seen: `${VERIFY_WELL_KNOWN_PATH} could not be fetched`,
    };
  if (res.status !== 200)
    return {
      method: "well_known",
      ok: false,
      seen: `${VERIFY_WELL_KNOWN_PATH} returned ${res.status}`,
    };
  const ok = res.body.includes(token);
  return {
    method: "well_known",
    ok,
    seen: ok ? "verification file matched" : `${VERIFY_WELL_KNOWN_PATH} does not contain the token`,
  };
}

async function probeMeta(domain: string, token: string): Promise<Probe> {
  const res = await fetchEither(domain, "/");
  if (!res) return { method: "meta_tag", ok: false, seen: "the home page could not be fetched" };
  if (res.status !== 200)
    return { method: "meta_tag", ok: false, seen: `the home page returned ${res.status}` };
  const head = res.body.slice(0, 200_000);
  const tag = new RegExp(
    `<meta\\b[^>]*\\bname\\s*=\\s*["']${VERIFY_META_NAME}["'][^>]*\\bcontent\\s*=\\s*["']([^"']+)["']|<meta\\b[^>]*\\bcontent\\s*=\\s*["']([^"']+)["'][^>]*\\bname\\s*=\\s*["']${VERIFY_META_NAME}["']`,
    "i",
  );
  const m = head.match(tag);
  const found = (m?.[1] ?? m?.[2] ?? "").trim();
  if (!found)
    return { method: "meta_tag", ok: false, seen: "the home page has no verification meta tag" };
  const ok = found === token;
  return {
    method: "meta_tag",
    ok,
    seen: ok ? "meta tag matched" : "the home page's verification meta tag has a different token",
  };
}

/**
 * Runs every method and marks the site verified on the first that passes.
 * On failure the reason says exactly what was seen, so the member can fix it.
 */
export async function checkVerification(userId: string): Promise<VerificationResult> {
  const site = await loadSite(userId);
  if (!site) return { ok: false, reason: "Add the domain you publish to first." };
  if (site.status === "verified") return { ok: true, method: site.verify_method ?? undefined };
  if (site.status === "suspended") {
    return {
      ok: false,
      reason: "This site is suspended from the exchange. Contact support to review it.",
    };
  }
  if (site.verify_attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: "Too many verification attempts. Contact support to continue." };
  }

  await supabaseAdmin
    .from("exchange_sites")
    .update({ status: "verifying", verify_attempts: site.verify_attempts + 1 })
    .eq("id", site.id);

  const probes = await Promise.all([
    probeDns(site.domain, site.verify_token),
    probeWellKnown(site.domain, site.verify_token),
    probeMeta(site.domain, site.verify_token),
  ]);
  const passed = probes.find((p) => p.ok);

  if (!passed) {
    await supabaseAdmin.from("exchange_sites").update({ status: "unverified" }).eq("id", site.id);
    return {
      ok: false,
      reason: `We checked ${site.domain}: ${probes.map((p) => p.seen).join("; ")}.`,
    };
  }

  return markVerified(site, passed.method);
}

async function markVerified(
  site: SiteRow,
  method: ExchangeVerifyMethod,
): Promise<VerificationResult> {
  const { error } = await supabaseAdmin
    .from("exchange_sites")
    .update({ status: "verified", verify_method: method, verified_at: new Date().toISOString() })
    .eq("id", site.id);
  if (error) {
    await supabaseAdmin.from("exchange_sites").update({ status: "unverified" }).eq("id", site.id);
    // The partial unique index: one verified owner per domain.
    if (/exchange_sites_verified_domain_key/.test(error.message) || error.code === "23505") {
      return {
        ok: false,
        reason: `${site.domain} is already verified by another Rankbox account. If that's you, verify it from that account, or contact support.`,
      };
    }
    throw new Error(error.message);
  }
  return { ok: true, method };
}
