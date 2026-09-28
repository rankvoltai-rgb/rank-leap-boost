import { writeFileSync } from "node:fs";
const UA = "RankboxResearch/1.0 (https://rankbox.xyz; research crawl for a public study)";
const all = [];
async function q(prop, cls) {
  const sparql = `SELECT DISTINCT ?item ?label ?website WHERE { ?item wdt:${prop} wd:${cls} . ?item wdt:P856 ?website . OPTIONAL { ?item rdfs:label ?label FILTER(LANG(?label)="en") } }`;
  for (let a = 0; a < 3; a++) {
    const r = await fetch("https://query.wikidata.org/sparql", {
      method: "POST",
      headers: {
        "user-agent": UA,
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/sparql-results+json",
      },
      body: "query=" + encodeURIComponent(sparql),
    });
    if (r.ok) {
      const j = await r.json();
      const rows = j.results.bindings.map((b) => ({
        item: b.item.value.split("/").pop(),
        label: b.label?.value ?? "",
        website: b.website.value,
        cls,
        prop,
      }));
      all.push(...rows);
      console.log(prop, cls, rows.length);
      return;
    }
    console.log(prop, cls, r.status, "retry");
    await new Promise((r) => setTimeout(r, 5000));
  }
}
for (const c of ["Q1254596", "Q880371", "Q638608", "Q483639", "Q11661", "Q7397", "Q3510521"])
  await q("P452", c);
for (const c of ["Q1058914", "Q1254596", "Q18388277", "Q3800506", "Q189210", "Q19967801"])
  await q("P31", c);
writeFileSync("wd-tech.json", JSON.stringify(all));
console.log("total", all.length);
