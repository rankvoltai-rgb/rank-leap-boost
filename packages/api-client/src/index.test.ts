import { describe, expect, it, vi } from "vitest";
import { RankboxApiError, RankboxClient, backoffMs, parseRetryAfter } from "./index";

function response(status: number, body: unknown, headers: Record<string, string> = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (name: string) => headers[name] ?? null },
    json: async () => body,
  } as unknown as Response;
}

function client(fetchImpl: typeof fetch, retries = 0) {
  return new RankboxClient({
    apiKey: "rv_live_test",
    baseUrl: "https://rankbox.xyz",
    retries,
    // Injected, so a test can never reach the real API.
    fetch: fetchImpl,
  });
}

describe("RankboxClient", () => {
  it("sends the key as a bearer token", async () => {
    const fetchImpl = vi.fn(async () => response(200, { ok: true, service: "Rankbox" }));
    await client(fetchImpl as unknown as typeof fetch).ping();
    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer rv_live_test");
  });

  it("reportPublished PATCHes the URL and unwraps the article", async () => {
    const article = { id: "a1", published_url: "https://brightloop.app/blog/x" };
    const fetchImpl = vi.fn(async () => response(200, { article }));
    const result = await client(fetchImpl as unknown as typeof fetch).reportPublished(
      "a1",
      "https://brightloop.app/blog/x",
    );

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://rankbox.xyz/api/public/v1/articles/a1");
    expect(init.method).toBe("PATCH");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body as string)).toEqual({
      published_url: "https://brightloop.app/blog/x",
    });
    expect(result).toEqual(article);
  });

  it("surfaces the body's code so a 402 can be recognised", async () => {
    const fetchImpl = vi.fn(async () =>
      response(402, { error: "No plan.", code: "subscription_required" }),
    );
    await expect(client(fetchImpl as unknown as typeof fetch).ping()).rejects.toMatchObject({
      status: 402,
      code: "subscription_required",
      message: "No plan.",
    });
  });

  it("never retries a definitive 4xx", async () => {
    const fetchImpl = vi.fn(async () => response(400, { error: "bad" }));
    await expect(
      client(fetchImpl as unknown as typeof fetch, 2).reportPublished("a1", "https://x.test/a"),
    ).rejects.toBeInstanceOf(RankboxApiError);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("retries a 429 and then succeeds", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response(429, { error: "slow down" }, { "Retry-After": "0" }))
      .mockResolvedValueOnce(response(200, { ok: true, service: "Rankbox" }));
    const result = await client(fetchImpl as unknown as typeof fetch, 2).ping();
    expect(result.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("escapes the article id in the path", async () => {
    const fetchImpl = vi.fn(async () => response(200, { article: {} }));
    await client(fetchImpl as unknown as typeof fetch).getArticle("a/b");
    expect((fetchImpl.mock.calls[0] as unknown as [string])[0]).toContain("articles/a%2Fb");
  });

  it("reports a cancelled request rather than retrying it", async () => {
    const controller = new AbortController();
    controller.abort();
    const fetchImpl = vi.fn(async () => response(200, {}));
    await expect(
      client(fetchImpl as unknown as typeof fetch, 2).ping(controller.signal),
    ).rejects.toMatchObject({ status: 0, message: "Request cancelled." });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("omits a body on GET", async () => {
    const fetchImpl = vi.fn(async () => response(200, { articles: [], count: 0 }));
    await client(fetchImpl as unknown as typeof fetch).listArticles({ since: null, limit: 100 });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.body).toBeUndefined();
    expect(url).toContain("limit=100");
    // A null cursor must not be sent as the string "null".
    expect(url).not.toContain("since=");
  });
});

describe("backoffMs", () => {
  // The public API's limiter is a 60-second fixed window, so a sub-second
  // retry on a 429 is guaranteed to fail again.
  it("backs off in seconds for a 429", () => {
    expect(backoffMs(429, 0)).toBeGreaterThanOrEqual(2000);
    expect(backoffMs(429, 1)).toBeGreaterThanOrEqual(2000);
  });

  it("prefers the server's Retry-After", () => {
    expect(backoffMs(429, 0, 7000)).toBe(7000);
  });

  it("caps an absurd Retry-After", () => {
    expect(backoffMs(429, 0, 10 * 60_000)).toBe(60_000);
  });

  it("stays fast for transient 5xx and network errors", () => {
    expect(backoffMs(500, 0)).toBe(300);
    expect(backoffMs(0, 1)).toBe(600);
  });
});

describe("parseRetryAfter", () => {
  it("reads seconds", () => {
    expect(parseRetryAfter({ headers: { get: () => "30" } })).toBe(30_000);
  });

  it("reads an HTTP date", () => {
    const future = new Date(Date.now() + 5_000).toUTCString();
    const ms = parseRetryAfter({ headers: { get: () => future } });
    expect(ms).toBeGreaterThan(0);
    expect(ms).toBeLessThanOrEqual(6_000);
  });

  it("is undefined when absent or unparseable", () => {
    expect(parseRetryAfter({ headers: { get: () => null } })).toBeUndefined();
    expect(parseRetryAfter({ headers: { get: () => "soon" } })).toBeUndefined();
  });
});
