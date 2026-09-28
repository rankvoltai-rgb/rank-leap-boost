import { readFileSync, writeFileSync } from "node:fs";
import pLimit from "p-limit";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const j = JSON.parse(readFileSync("f500-2026.json", "utf8"));
const items = j.items.filter((i) => i.rank <= 500);
const limit = pLimit(4);
const out = await Promise.all(
  items.map((it) =>
    limit(async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const r = await fetch("https://fortune.com" + it.slug, {
            headers: { "user-agent": UA },
            signal: AbortSignal.timeout(30000),
          });
          const html = await r.text();
          const m = html.match(/"Website":"([^"]+)"/);
          return {
            rank: it.rank,
            name: it.name,
            sector: it.data.Sector,
            industry: it.data.Industry,
            website: m ? m[1] : null,
          };
        } catch (e) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
      return {
        rank: it.rank,
        name: it.name,
        sector: it.data.Sector,
        industry: it.data.Industry,
        website: null,
      };
    }),
  ),
);
writeFileSync("f500.json", JSON.stringify(out, null, 1));
console.log(
  out.length,
  "missing",
  out.filter((o) => !o.website).map((o) => o.name),
);
