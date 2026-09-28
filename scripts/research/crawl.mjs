// One-time research crawl: /robots.txt, /llms.txt, /llms-full.txt for every host in domains.json.
// Resumable: appends one JSON line per host to crawl.jsonl and skips hosts already there.
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import pLimit from "p-limit";
import { readJsonl } from "./jsonl.mjs";

const UA =
  "RankboxResearchBot/1.0 (+https://rankbox.xyz/blog; one-time study of robots.txt and llms.txt files)";
const TIMEOUT = 15000;
const OUT = "crawl.jsonl";
const CONCURRENCY = Number(process.env.C ?? 48);

const domains = JSON.parse(readFileSync("domains.json", "utf8"));
const done = new Set();
if (existsSync(OUT)) {
  for await (const r of readJsonl(OUT)) done.add(r.host);
}
const todo = domains.filter((d) => !done.has(d.host));
console.log("hosts", domains.length, "done", done.size, "todo", todo.length);

async function readCapped(res, cap) {
  const reader = res.body?.getReader();
  if (!reader) return { text: "", bytes: 0, truncated: false };
  const chunks = [];
  let bytes = 0;
  let truncated = false;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes <= cap) chunks.push(value);
    else {
      truncated = true;
      // keep counting size up to 20 MB, then stop
      if (bytes > 20 * 1024 * 1024) {
        await reader.cancel();
        break;
      }
    }
  }
  const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
  return { text: buf.toString("utf8"), bytes, truncated };
}

async function get(url, cap) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": UA,
        accept: "text/plain, text/markdown;q=0.9, */*;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT),
    });
    const body = await readCapped(res, cap);
    return {
      ok: true,
      status: res.status,
      finalUrl: res.url,
      redirected: res.redirected,
      contentType: res.headers.get("content-type"),
      server: res.headers.get("server"),
      cfMitigated: res.headers.get("cf-mitigated"),
      bytes: body.bytes,
      truncated: body.truncated,
      text: body.text,
      ms: Date.now() - started,
    };
  } catch (e) {
    const cause = e?.cause?.code ?? e?.cause?.name ?? e?.name ?? "error";
    return { ok: false, error: String(cause), ms: Date.now() - started };
  }
}

const netFail = (r) => !r.ok;

async function crawlHost(d) {
  let base = `https://${d.host}`;
  let robots = await get(`${base}/robots.txt`, 512 * 1024);
  if (netFail(robots) && !d.host.startsWith("www.")) {
    const alt = `https://www.${d.host}`;
    const r2 = await get(`${alt}/robots.txt`, 512 * 1024);
    if (!netFail(r2)) {
      base = alt;
      robots = r2;
    }
  }
  const reachable = !netFail(robots);
  const llms = reachable ? await get(`${base}/llms.txt`, 256 * 1024) : null;
  const llmsFull = reachable ? await get(`${base}/llms-full.txt`, 8 * 1024) : null;
  const trim = (r, keep) => (r && r.ok ? { ...r, text: keep ? r.text : r.text.slice(0, 2048) } : r);
  appendFileSync(
    OUT,
    JSON.stringify({
      host: d.host,
      base,
      at: new Date().toISOString(),
      robots: trim(robots, true),
      llms: trim(llms, true),
      llmsFull: trim(llmsFull, false),
    }) + "\n",
  );
}

const limit = pLimit(CONCURRENCY);
let n = 0;
const t0 = Date.now();
await Promise.all(
  todo.map((d) =>
    limit(async () => {
      try {
        await crawlHost(d);
      } catch (e) {
        appendFileSync(OUT, JSON.stringify({ host: d.host, fatal: String(e) }) + "\n");
      }
      if (++n % 500 === 0)
        console.log(n, "of", todo.length, Math.round((Date.now() - t0) / 1000) + "s");
    }),
  ),
);
console.log("finished", n, Math.round((Date.now() - t0) / 1000) + "s");
