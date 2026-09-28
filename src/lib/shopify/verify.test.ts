import { describe, expect, it } from "vitest";
import { normalizeShop, verifyIdToken, verifyWebhook } from "./verify";

const APP = { apiKey: "client-id-123", apiSecret: "shpss_test_secret" };
const NOW = Date.parse("2026-09-28T12:00:00.000Z");
const S = NOW / 1000;

function b64url(bytes: Uint8Array | string): string {
  const raw = typeof bytes === "string" ? new TextEncoder().encode(bytes) : bytes;
  let bin = "";
  for (const b of raw) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(
  secret: string,
  data: string | Uint8Array<ArrayBuffer>,
): Promise<Uint8Array<ArrayBuffer>> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, bytes));
}

async function idToken(claims: Record<string, unknown>, secret = APP.apiSecret, alg = "HS256") {
  const head = b64url(JSON.stringify({ alg, typ: "JWT" }));
  const body = b64url(
    JSON.stringify({
      iss: "https://fernwood.myshopify.com/admin",
      dest: "https://fernwood.myshopify.com",
      aud: APP.apiKey,
      sub: "42",
      exp: S + 60,
      nbf: S - 5,
      iat: S - 5,
      jti: "abc",
      sid: "sid",
      ...claims,
    }),
  );
  return `${head}.${body}.${b64url(await hmac(secret, `${head}.${body}`))}`;
}

describe("verifyIdToken", () => {
  it("returns the store and user of a valid token", async () => {
    expect(await verifyIdToken(await idToken({}), APP, NOW)).toEqual({
      shop: "fernwood.myshopify.com",
      userId: "42",
    });
  });

  it("rejects a token signed with another secret", async () => {
    expect(await verifyIdToken(await idToken({}, "someone-else"), APP, NOW)).toBeNull();
  });

  it("rejects an expired token and one not valid yet", async () => {
    expect(await verifyIdToken(await idToken({ exp: S - 60 }), APP, NOW)).toBeNull();
    expect(await verifyIdToken(await idToken({ nbf: S + 60 }), APP, NOW)).toBeNull();
  });

  it("rejects a token for another app", async () => {
    expect(await verifyIdToken(await idToken({ aud: "other-app" }), APP, NOW)).toBeNull();
  });

  it("rejects a token whose issuer and destination are different stores", async () => {
    const token = await idToken({ iss: "https://evil.myshopify.com/admin" });
    expect(await verifyIdToken(token, APP, NOW)).toBeNull();
  });

  it("rejects a destination that isn't a myshopify store", async () => {
    const token = await idToken({
      iss: "https://example.com/admin",
      dest: "https://example.com",
    });
    expect(await verifyIdToken(token, APP, NOW)).toBeNull();
  });

  it("rejects alg none and garbage without throwing", async () => {
    expect(await verifyIdToken(await idToken({}, APP.apiSecret, "none"), APP, NOW)).toBeNull();
    expect(await verifyIdToken("not.a.jwt", APP, NOW)).toBeNull();
    expect(await verifyIdToken("", APP, NOW)).toBeNull();
    expect(await verifyIdToken(null, APP, NOW)).toBeNull();
  });
});

describe("verifyWebhook", () => {
  const body = new TextEncoder().encode('{"shop_domain":"fernwood.myshopify.com"}');

  it("accepts the base64 HMAC of the raw body", async () => {
    const header = btoa(String.fromCharCode(...(await hmac(APP.apiSecret, body))));
    expect(await verifyWebhook(body, header, APP.apiSecret)).toBe(true);
  });

  it("rejects a wrong or missing signature, and a changed body", async () => {
    const header = btoa(String.fromCharCode(...(await hmac(APP.apiSecret, body))));
    expect(await verifyWebhook(body, btoa("nope"), APP.apiSecret)).toBe(false);
    expect(await verifyWebhook(body, null, APP.apiSecret)).toBe(false);
    const changed = new TextEncoder().encode('{"shop_domain":"evil.myshopify.com"}');
    expect(await verifyWebhook(changed, header, APP.apiSecret)).toBe(false);
  });
});

describe("normalizeShop", () => {
  it("accepts permanent store domains only", () => {
    expect(normalizeShop("Fernwood.myshopify.com")).toBe("fernwood.myshopify.com");
    expect(normalizeShop("fernwood.myshopify.com.evil.com")).toBeNull();
    expect(normalizeShop("https://fernwood.myshopify.com")).toBeNull();
    expect(normalizeShop("fernwoodcoffee.com")).toBeNull();
    expect(normalizeShop(null)).toBeNull();
  });
});
