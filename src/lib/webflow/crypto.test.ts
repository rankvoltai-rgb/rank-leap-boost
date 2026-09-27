import { describe, expect, it } from "vitest";
import { decryptToken, encryptToken, newNonce, signState, verifyState } from "./crypto";

// 32 bytes of base64, the shape `openssl rand -base64 32` prints.
const KEY = "q2Vz0bJx8m1K1bq3oZ7m0q6oQm3Yy5r3vM9pX7m1c2E=";
const OTHER_KEY = "Zm9vYmFyYmF6cXV4Zm9vYmFyYmF6cXV4Zm9vYmFyYmE=";

describe("token encryption", () => {
  it("round-trips", async () => {
    const blob = await encryptToken("wf-access-token", KEY);
    expect(blob).not.toContain("wf-access-token");
    expect(await decryptToken(blob, KEY)).toBe("wf-access-token");
  });

  it("uses a fresh IV, so the same token never encrypts the same way twice", async () => {
    expect(await encryptToken("t", KEY)).not.toBe(await encryptToken("t", KEY));
  });

  it("refuses the wrong key", async () => {
    const blob = await encryptToken("t", KEY);
    await expect(decryptToken(blob, OTHER_KEY)).rejects.toThrow();
  });

  it("refuses a tampered blob", async () => {
    const blob = await encryptToken("token", KEY);
    const [v, iv, sealed] = blob.split(".");
    const flipped = sealed.slice(0, -2) + (sealed.endsWith("A") ? "B" : "A") + sealed.slice(-1);
    await expect(decryptToken(`${v}.${iv}.${flipped}`, KEY)).rejects.toThrow();
  });

  it("refuses a key that is too short", async () => {
    await expect(encryptToken("t", "c2hvcnQ=")).rejects.toThrow(/32 bytes/);
  });
});

describe("OAuth state", () => {
  const base = { userId: "user-1", siteId: "site-1", nonce: "n1", expiresAt: 2_000 };

  it("verifies a state from this browser", async () => {
    const raw = await signState(base, KEY);
    expect(await verifyState(raw, "n1", KEY, 1_000)).toEqual(base);
  });

  it("rejects a state started in another browser", async () => {
    const raw = await signState(base, KEY);
    expect(await verifyState(raw, "someone-elses-nonce", KEY, 1_000)).toBeNull();
    expect(await verifyState(raw, null, KEY, 1_000)).toBeNull();
  });

  it("rejects an expired state", async () => {
    const raw = await signState(base, KEY);
    expect(await verifyState(raw, "n1", KEY, 2_000)).toBeNull();
  });

  it("rejects a state whose user was swapped", async () => {
    const raw = await signState(base, KEY);
    const [, mac] = raw.split(".");
    const forgedBody = Buffer.from(
      JSON.stringify({ u: "attacker", s: "site-1", n: "n1", e: 2_000 }),
    ).toString("base64url");
    expect(await verifyState(`${forgedBody}.${mac}`, "n1", KEY, 1_000)).toBeNull();
  });

  it("rejects a state signed with another key", async () => {
    const raw = await signState(base, OTHER_KEY);
    expect(await verifyState(raw, "n1", KEY, 1_000)).toBeNull();
  });

  it("never throws on garbage", async () => {
    for (const junk of ["", "x", "a.b", "a.b.c", "%%%.***", null, undefined]) {
      expect(await verifyState(junk, "n1", KEY, 1_000)).toBeNull();
    }
  });

  it("makes distinct nonces", () => {
    expect(newNonce()).not.toBe(newNonce());
    expect(newNonce()).toMatch(/^[A-Za-z0-9_-]{24}$/);
  });
});
