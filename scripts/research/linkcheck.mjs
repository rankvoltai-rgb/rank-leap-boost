// B4 follow-up: for a random sample of llms.txt files, fetch up to 3 random absolute links
// from each and record the status. Seeded, so the sample is reproducible.
import { readFileSync, writeFileSync } from "node:fs";
import pLimit from "p-limit";

const UA =
  "RankboxResearchBot/1.0 (+https://rankbox.xyz/blog; one-time study of robots.txt and llms.txt files)";
const SAMPLE = 1000;
const PER_FILE = 3;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260928);
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

import { readJsonl } from "./jsonl.mjs";
const rows = [];
for await (const r of readJsonl("crawl.jsonl"))
  if (r.llms?.ok)
    rows.push({ host: r.host, llms: { text: r.llms.text, finalUrl: r.llms.finalUrl } });
const hosts = JSON.parse(readFileSync("hosts.json", "utf8"));
const adopters = new Set(hosts.filter((h) => h.llms === "file").map((h) => h.host));
const files = rows
  .filter((r) => adopters.has(r.host))
  .map((r) => {
    const text = r.llms.text.replace(/```[\s\S]*?```/g, "");
    const base = r.llms.finalUrl;
    const links = [...text.matchAll(/\[[^\]]*\]\(([^)\s]+)/g)]
      .map((m) => {
        try {
          return new URL(m[1], base).href;
        } catch {
          return null;
        }
      })
      .filter((u) => u && /^https?:/.test(u));
    return { host: r.host, links: [...new Set(links)] };
  })
  .filter((f) => f.links.length > 0);

const sample = shuffle(files).slice(0, SAMPLE);
console.log("adopters with links", files.length, "sample", sample.length);

async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const r = await fetch(url, {
        method,
        headers: {
          "user-agent": UA,
          accept: "text/markdown, text/plain;q=0.9, text/html;q=0.8, */*;q=0.5",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
      if (method === "GET") await r.body?.cancel();
      // Some servers reject HEAD; retry those with GET
      if (method === "HEAD" && [400, 403, 405, 406, 429, 501].includes(r.status)) continue;
      return { status: r.status, cfMitigated: r.headers.get("cf-mitigated"), finalUrl: r.url };
    } catch (e) {
      if (method === "GET")
        return { status: null, error: String(e?.cause?.code ?? e?.name ?? "error") };
    }
  }
}

const limit = pLimit(60);
const results = await Promise.all(
  sample.map((f) =>
    limit(async () => {
      const picks = shuffle(f.links).slice(0, PER_FILE);
      const out = [];
      for (const u of picks)
        out.push({
          url: u,
          sameHost: new URL(u).hostname.replace(/^www\./, "").endsWith(f.host),
          ...(await check(u)),
        });
      return { host: f.host, nLinks: f.links.length, checks: out };
    }),
  ),
);
writeFileSync("linkcheck.json", JSON.stringify(results));
const all = results.flatMap((r) => r.checks);
const broken = (c) => c.status === 404 || c.status === 410;
const summary = {
  files: results.length,
  links: all.length,
  ok2xx: all.filter((c) => c.status >= 200 && c.status < 300).length,
  notFound: all.filter(broken).length,
  otherClientErr: all.filter((c) => c.status >= 400 && c.status < 500 && !broken(c)).length,
  serverErr: all.filter((c) => c.status >= 500).length,
  netErr: all.filter((c) => c.status === null).length,
  filesWithBroken: results.filter((r) => r.checks.some(broken)).length,
  mdLinks: all.filter((c) => /\.md(#.*)?$/i.test(c.url)).length,
  mdBroken: all.filter((c) => /\.md(#.*)?$/i.test(c.url) && broken(c)).length,
};
writeFileSync("linkcheck-summary.json", JSON.stringify(summary, null, 1));
console.log(summary);
