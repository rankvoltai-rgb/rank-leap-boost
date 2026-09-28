import { writeFileSync } from "node:fs";
const UA = "RankboxResearch/1.0 (https://rankbox.xyz; research crawl for a public study)";
async function q(name, sparql) {
  const r = await fetch("https://query.wikidata.org/sparql", {
    method: "POST",
    headers: {
      "user-agent": UA,
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/sparql-results+json",
    },
    body: "query=" + encodeURIComponent(sparql),
  });
  if (!r.ok) {
    console.log(name, r.status, (await r.text()).slice(0, 300));
    return [];
  }
  const j = await r.json();
  const rows = j.results.bindings.map((b) => ({
    item: b.item.value.split("/").pop(),
    label: b.label?.value ?? "",
    website: b.website.value,
    cls: b.cls?.value.split("/").pop() ?? "",
  }));
  writeFileSync(`wd-${name}.json`, JSON.stringify(rows));
  console.log(name, rows.length);
  return rows;
}
const lbl = `OPTIONAL { ?item rdfs:label ?label FILTER(LANG(?label)="en") }`;
await q(
  "saas",
  `SELECT DISTINCT ?item ?label ?website ?cls WHERE {
  { VALUES ?cls { wd:Q1254596 wd:Q880371 wd:Q638608 wd:Q483639 wd:Q11661 } ?item wdt:P452 ?cls . }
  UNION { VALUES ?cls { wd:Q1058914 wd:Q1254596 } ?item wdt:P31 ?cls . }
  ?item wdt:P856 ?website . ${lbl} }`,
);
await q(
  "news",
  `SELECT DISTINCT ?item ?label ?website ?cls WHERE {
  VALUES ?cls { wd:Q1153191 wd:Q17232649 wd:Q11032 wd:Q1110794 wd:Q192283 wd:Q1193236 wd:Q15265344 wd:Q141683 wd:Q41298 wd:Q1616075 }
  ?item wdt:P31 ?cls . ?item wdt:P856 ?website . ${lbl} }`,
);
await q(
  "ecom",
  `SELECT DISTINCT ?item ?label ?website ?cls WHERE {
  { VALUES ?cls { wd:Q4382945 wd:Q212930 } ?item wdt:P31 ?cls . }
  UNION { VALUES ?cls { wd:Q484847 wd:Q4382945 wd:Q126793 } ?item wdt:P452 ?cls . }
  ?item wdt:P856 ?website . ${lbl} }`,
);
