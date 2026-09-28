/**
 * The dashboard calls a site connected from its key's last_used_at, so a
 * working key must actually stamp it. Supabase queries are lazy (they only run
 * when awaited), which is how a fire-and-forget `void` once left every key
 * unstamped.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const sent: { table: string; patch: Record<string, unknown> }[] = [];
let row: Record<string, unknown> | null = null;

/** A lazy builder like Supabase's: nothing happens until it is awaited. */
function builder(table: string) {
  let patch: Record<string, unknown> | null = null;
  const q = {
    select: () => q,
    eq: () => q,
    update: (p: Record<string, unknown>) => {
      patch = p;
      return q;
    },
    maybeSingle: () => Promise.resolve({ data: row, error: null }),
    then(ok: (v: { data: null; error: null }) => unknown) {
      if (patch) sent.push({ table, patch });
      return Promise.resolve({ data: null, error: null }).then(ok);
    },
  };
  return q;
}

vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: { from: (t: string) => builder(t) },
}));
vi.mock("@/lib/entitlement.server", () => ({
  hasGenerationEntitlement: async () => true,
}));

const { resolveApiKey } = await import("./api-keys.server");

beforeEach(() => {
  sent.length = 0;
  row = { id: "key-1", user_id: "user-1", site_id: "site-1", revoked_at: null };
});

describe("resolveApiKey", () => {
  it("stamps last_used_at for a working key", async () => {
    expect(await resolveApiKey("rv_live_abc")).toEqual({
      ok: true,
      userId: "user-1",
      siteId: "site-1",
    });
    expect(sent).toHaveLength(1);
    expect(sent[0].table).toBe("api_keys");
    expect(typeof sent[0].patch.last_used_at).toBe("string");
  });

  it("stamps nothing for a revoked or malformed key", async () => {
    row = { ...row, revoked_at: "2026-09-27T00:00:00.000Z" };
    expect(await resolveApiKey("rv_live_abc")).toEqual({ ok: false, reason: "invalid" });
    expect(await resolveApiKey("not-a-key")).toEqual({ ok: false, reason: "invalid" });
    expect(sent).toHaveLength(0);
  });
});
