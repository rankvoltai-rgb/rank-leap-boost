import { readFileSync, writeFileSync } from "node:fs";
const tranco = new Map();
for (const line of readFileSync("top-1m.csv", "utf8").split("\n")) {
  const [r, d] = line.trim().split(",");
  if (d) tranco.set(d, +r);
}
function host(website) {
  try {
    let h = new URL(website.trim()).hostname.toLowerCase().replace(/\.$/, "");
    h = h.replace(/^(www\d?|m)\./, "");
    if (!h.includes(".") || /^\d+\.\d+\.\d+\.\d+$/.test(h)) return null;
    return h;
  } catch {
    return null;
  }
}
function rankOf(h) {
  const parts = h.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    const d = parts.slice(i).join(".");
    if (tranco.has(d)) return tranco.get(d);
  }
  return null;
}
const PLATFORMS = new Set(
  "google.com facebook.com apple.com instagram.com linkedin.com x.com twitter.com youtube.com t.me telegram.org medium.com dropbox.com archive.org doi.org sciencedirect.com springer.com wiley.com issuu.com scribd.com substack.com wordpress.com blogspot.com blogger.com tumblr.com wixsite.com weebly.com squarespace.com fandom.com bing.com msn.com naver.com qq.com mail.ru wikipedia.org wikimedia.org wikidata.org github.com github.io gitlab.com vercel.app netlify.app pages.dev herokuapp.com notion.site tiktok.com pinterest.com reddit.com vk.com ok.ru line.me discord.com gosuslugi.ru tandfonline.com jstor.org cambridge.org oup.com sagepub.com jhu.edu elsevier.com ieee.org acm.org mdpi.com frontiersin.org plos.org nature.com researchgate.net academia.edu ssrn.com yumpu.com calameo.com flickr.com soundcloud.com spotify.com podcasts.apple.com anchor.fm bandcamp.com patreon.com ko-fi.com linktr.ee sites.google.com google.co.uk google.de wix.com shopify.com godaddy.com hostinger.com oracle.com ibm.com salesforce.com bigcommerce.com primevideo.com".split(
    " ",
  ),
);
const NON_COMMERCIAL_TLD =
  /\.(gov|edu|mil|int)(\.[a-z]{2})?$|\.(gov|gouv|gob|go|ac|edu)\.[a-z]{2}$|(^|\.)(un|worldbank|who|oecd|europa)\.(org|eu|int)$/;
function isPlatform(h) {
  const parts = h.split(".");
  for (let i = 0; i < parts.length - 1; i++)
    if (PLATFORMS.has(parts.slice(i).join("."))) return true;
  return NON_COMMERCIAL_TLD.test(h);
}
const EXCLUDE = {
  news: new Set(
    "unesco.org mckinsey.com chess.com myspace.com he.net avito.ru hotpepper.jp jw.org litnet.com property24.com tjk.org archive.is mpg.de gettyimages.com olympics.com iop.org usp.br worldcat.org vatican.va proquest.com porsche.com goethe.de purl.org ualberta.ca flipsnack.com boe.es aps.org kuleuven.be hindawi.com berlin.de qvc.com overdrive.com ebscohost.com asm.org scielo.br lexisnexis.com degruyter.com yorku.ca uni-hamburg.de churchofjesuschrist.org uni-koeln.de networksolutions.com scholastic.com csiro.au tate.org.uk stihi.ru uni-stuttgart.de kbb.com britishmuseum.org lego.com nba.com nfl.com op.gg boardgamegeek.com cell.com genius.com autotrader.co.uk kinopoisk.ru joyn.de adac.de".split(
      " ",
    ),
  ),
  ecom: new Set(
    "rokt.com trialpay.com riskified.com honeywell.com cyberfolks.pl bp.com inditex.com fastretailing.com gazprom-neft.ru infosys.com alarm.com trivago.com ostrovok.ru theculturetrip.com fotolia.com moneysupermarket.com channeladvisor.com richrelevance.com tiendanube.com shoplive.cloud 3dcart.com junglescout.com mondelezinternational.com alibabagroup.com lvmh.com gapinc.com express-scripts.com uswitch.com bc.game gg.deals 12go.asia onetwotrip.com whop.com aswatson.com clickbus.com.br wakacje.pl ambientweather.net ingka.com tjx.com cvshealth.com wine-searcher.com idealo.fr letyshops.com matsuyafoods.co.jp avito.ru nintendo.com mckinsey.com".split(
      " ",
    ),
  ),
};
const sites = new Map(); // host -> record
function add(h, seg, extra = {}) {
  if (!h) return;
  const s = sites.get(h) ?? { host: h, rank: rankOf(h), segs: {} };
  if (!s.segs[seg]) s.segs[seg] = extra;
  sites.set(h, s);
}
// Fortune 500
for (const f of JSON.parse(readFileSync("f500.json", "utf8")))
  add(host(f.website), "f500", {
    rank: f.rank,
    name: f.name,
    sector: f.sector,
    industry: f.industry,
  });
// SaaS: YC + Wikidata tech
const yc = JSON.parse(readFileSync("yc.json", "utf8"));
let ycSaas = 0;
for (const c of yc) {
  if (!["Active", "Public"].includes(c.status) || !c.website) continue;
  const tags = c.tags ?? [];
  const dev =
    tags.includes("Developer Tools") || c.subindustry === "B2B -> Engineering, Product and Design";
  const saas =
    c.industry === "B2B" ||
    c.industry === "Fintech" ||
    tags.includes("SaaS") ||
    tags.includes("B2B") ||
    dev;
  if (!saas) continue;
  ycSaas++;
  add(host(c.website), "saas", {
    src: "yc",
    name: c.name,
    seg: dev ? "devtools" : "b2b-saas",
    subindustry: c.subindustry,
    batch: c.batch,
  });
}
const saasCls = new Set(["Q1254596"]);
for (const r of JSON.parse(readFileSync("wd-tech.json", "utf8"))) {
  const h = host(r.website);
  if (!h || isPlatform(h)) continue;
  const prev = sites.get(h)?.segs.saas;
  if (prev?.src === "yc") continue;
  const seg = saasCls.has(r.cls) || prev?.seg === "b2b-saas" ? "b2b-saas" : "software";
  add(h, "saas", { src: "wikidata", name: r.label, seg, item: r.item });
  if (seg === "b2b-saas") sites.get(h).segs.saas.seg = "b2b-saas";
}
// Tranco top 10k baseline
for (const [d, r] of tranco) if (r <= 10000) add(d, "top10k", {});
// News/media and e-commerce: top 500 each by Tranco rank
for (const [file, seg] of [
  ["wd-news.json", "news"],
  ["wd-ecom.json", "ecom"],
]) {
  const best = new Map();
  for (const r of JSON.parse(readFileSync(file, "utf8"))) {
    const h = host(r.website);
    if (!h || isPlatform(h) || EXCLUDE[seg].has(h)) continue;
    const rank = tranco.get(h);
    if (!rank) continue;
    if (!best.has(h)) best.set(h, { rank, name: r.label, item: r.item });
  }
  // One site per registrable domain rank (drop subdomains that share a parent rank with a better-named entry)
  const sorted = [...best.entries()].sort((a, b) => a[1].rank - b[1].rank);
  const seenRank = new Set();
  let n = 0;
  for (const [h, v] of sorted) {
    if (seenRank.has(v.rank)) continue;
    seenRank.add(v.rank);
    add(h, seg, v);
    if (++n >= 500) break;
  }
}
const list = [...sites.values()];
const count = (seg) => list.filter((s) => s.segs[seg]).length;
console.log({
  total: list.length,
  f500: count("f500"),
  saas: count("saas"),
  ycSaas,
  top10k: count("top10k"),
  news: count("news"),
  ecom: count("ecom"),
});
const saas = list.filter((s) => s.segs.saas);
console.log(
  "saas segs",
  saas.reduce((a, s) => ((a[s.segs.saas.seg] = (a[s.segs.saas.seg] ?? 0) + 1), a), {}),
  "saas in tranco",
  saas.filter((s) => s.rank).length,
);
writeFileSync("domains.json", JSON.stringify(list));
