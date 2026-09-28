/**
 * Hand-built HTML for the /lab pages. These skip the React app on purpose:
 * each render variant must control exactly what's in the first HTML response,
 * and what only JavaScript adds.
 */
import {
  C1_SURFACES,
  FACT_PAGES,
  MARKDOWN_HTML_PHRASE,
  RENDER_VARIANTS,
  labProduct,
  type Experiment,
  type LabProduct,
  type RenderVariant,
} from "./experiments";

const SITE = "https://rankbox.xyz";

/** Headers every lab response carries: never indexed, never cached. */
export const LAB_HEADERS = {
  "x-robots-tag": "noindex",
  "cache-control": "no-store",
} as const;

export function htmlResponse(
  html: string,
  status = 200,
  extra: Record<string, string> = {},
): Response {
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", ...LAB_HEADERS, ...extra },
  });
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Posts one beacon when the page's JavaScript runs, so we can see who ran it. */
function beaconScript(experiment: Experiment, variant: string): string {
  const payload = JSON.stringify({ e: experiment, v: variant });
  return `<script>(function(){try{var d=${payload};d.ref=document.referrer;d.loc=location.href;d.w=window.innerWidth;var b=JSON.stringify(d);if(navigator.sendBeacon){navigator.sendBeacon("/lab/beacon",b)}else{fetch("/lab/beacon",{method:"POST",body:b,keepalive:true})}}catch(e){}})();</script>`;
}

/** GA4, only on the C1 referrer pages and only when GA4_LAB_ID is set. */
function ga4Snippet(id: string | undefined): string {
  if (!id || !/^G-[A-Z0-9]{4,16}$/.test(id)) return "";
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${id}");</script>`;
}

function shell(opts: {
  title: string;
  path: string;
  body: string;
  head?: string;
  tail?: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(opts.title)} | Rankbox Lab</title>
<link rel="canonical" href="${SITE}${opts.path}">
<style>
  body{font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;color:#121826;background:#f7f8fb;margin:0;padding:32px 16px}
  main{max-width:720px;margin:0 auto}
  .note{background:#fff6e5;border:1px solid #f0d9a8;border-radius:8px;padding:10px 14px;font-size:14px}
  table{border-collapse:collapse;width:100%;background:#fff}
  th,td{text-align:left;border-bottom:1px solid #e1e6ef;padding:8px}
  code{font-family:ui-monospace,Menlo,monospace}
  a{color:#1f6feb}
</style>
${opts.head ?? ""}
</head>
<body>
<main>
<p class="note">This is a Rankbox Lab test page for an experiment on how AI crawlers and assistants read the web. It isn't a product page. See <a href="${SITE}/lab">the lab index</a>.</p>
${opts.body}
</main>
${opts.tail ?? ""}
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* Lab index                                                           */
/* ------------------------------------------------------------------ */

export function labIndexPage(): string {
  return shell({
    title: "Lab",
    path: "/lab",
    body: `<h1>Rankbox Lab</h1>
<p>Live experiments behind upcoming Rankbox studies. Results will be published on the Rankbox blog.</p>
<ul>
<li><a href="/lab/render">Render test</a>: ten ways to put the same kind of text on a page, from server HTML to JavaScript, shadow DOM, JSON-LD and Markdown.</li>
<li><a href="/lab/facts">Fact pages</a>: ${FACT_PAGES} fictional product pages, half with JSON-LD and half without.</li>
</ul>`,
  });
}

/* ------------------------------------------------------------------ */
/* C1: referrer test                                                   */
/* ------------------------------------------------------------------ */

export function referrerPage(surface: string, ga4Id: string | undefined): string {
  return shell({
    title: `Referrer test: ${surface}`,
    path: `/lab/ref/${surface}`,
    head: ga4Snippet(ga4Id),
    body: `<h1>Referrer test</h1>
<p>Test surface: <code>${esc(surface)}</code>. Thanks for tapping through. This visit records whether the app you came from sent a Referer header or a UTM tag.</p>
<p>Other surfaces in this test: ${C1_SURFACES.map((s) => `<code>${s}</code>`).join(", ")}.</p>`,
    tail: beaconScript("c1", surface),
  });
}

/* ------------------------------------------------------------------ */
/* B3: render variants                                                 */
/* ------------------------------------------------------------------ */

export function renderIndexPage(): string {
  const rows = RENDER_VARIANTS.map(
    (v) =>
      `<tr><td><a href="/lab/render/${v.slug}">${esc(v.label)}</a></td><td>${esc(v.how)}</td></tr>`,
  ).join("\n");
  return shell({
    title: "Render test",
    path: "/lab/render",
    body: `<h1>Render test</h1>
<p>Each page below carries one test phrase, delivered a different way. Which phrases an AI crawler or assistant can repeat shows which delivery methods it reads.</p>
<table><thead><tr><th>Page</th><th>How the phrase arrives</th></tr></thead><tbody>
${rows}
</tbody></table>`,
  });
}

function phraseLine(phrase: string): string {
  return `The test phrase for this page is: <strong>${phrase}</strong>.`;
}

/** The body of one render variant. Scripts only ever add the phrase after load. */
export function renderVariantPage(v: RenderVariant): string {
  const intro = `<h1>Render test: ${esc(v.label)}</h1>
<p>How the phrase arrives on this page: ${esc(v.how)}</p>`;
  const target = `<p id="phrase">The test phrase has not loaded.</p>`;
  const set = (phrase: string) =>
    `document.getElementById("phrase").innerHTML=${JSON.stringify(phraseLine(phrase))};`;
  let body = "";
  let head = "";
  let tail = "";
  switch (v.slug) {
    case "ssr":
      body = `<p id="phrase">${phraseLine(v.phrase)}</p>`;
      break;
    case "csr":
      body = target;
      tail = `<script>document.addEventListener("DOMContentLoaded",function(){${set(v.phrase)}});</script>`;
      break;
    case "csr-delayed":
      body = target;
      tail = `<script>setTimeout(function(){${set(v.phrase)}},3000);</script>`;
      break;
    case "fetch":
      body = target;
      tail = `<script>fetch("/lab/render/fetch?data=1").then(function(r){return r.json()}).then(function(d){${`document.getElementById("phrase").innerHTML="The test phrase for this page is: <strong>"+d.phrase+"</strong>.";`}});</script>`;
      break;
    case "shadow-dom":
      body = `<div id="host"></div>`;
      tail = `<script>var r=document.getElementById("host").attachShadow({mode:"open"});r.innerHTML=${JSON.stringify(`<p>${phraseLine(v.phrase)}</p>`)};</script>`;
      break;
    case "declarative-shadow":
      body = `<div><template shadowrootmode="open"><p>${phraseLine(v.phrase)}</p></template></div>`;
      break;
    case "noscript":
      body = `${target}<noscript><p>${phraseLine(v.phrase)}</p></noscript>`;
      break;
    case "hidden":
      body = `<p>This page's phrase is in the HTML, but hidden from view.</p><p style="display:none">${phraseLine(v.phrase)}</p>`;
      break;
    case "json-ld":
      body = `<p>This page's phrase is only in its structured data.</p>`;
      head = `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Render test: JSON-LD only",
        description: `The test phrase for this page is: ${v.phrase}.`,
      })}</script>`;
      break;
    case "markdown":
      body = `<p id="phrase">${phraseLine(MARKDOWN_HTML_PHRASE)}</p><p>Clients that ask for Markdown get a different phrase.</p>`;
      head = `<link rel="alternate" type="text/markdown" href="/lab/render/markdown">`;
      break;
  }
  return shell({
    title: `Render test: ${v.label}`,
    path: `/lab/render/${v.slug}`,
    head,
    body: intro + body,
    tail: tail + beaconScript("b3", v.slug),
  });
}

/** The Markdown answer for the markdown variant, for Accept: text/markdown. */
export function renderMarkdown(v: RenderVariant): string {
  return `# Render test: ${v.label}

This is a Rankbox Lab test page for an experiment on how AI crawlers and assistants read the web.

How the phrase arrives on this page: ${v.how}

The test phrase for this page is: **${v.phrase}**.
`;
}

/** True when a client prefers Markdown over HTML. */
export function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const types = accept.split(",").map((part) => {
    const [type, ...params] = part.trim().toLowerCase().split(";");
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    return { type: type.trim(), q: q ? Number(q.slice(2)) : 1 };
  });
  const md = types.find((t) => t.type === "text/markdown");
  if (!md || !(md.q > 0)) return false;
  const html = types.find((t) => t.type === "text/html");
  return !html || md.q >= html.q;
}

/* ------------------------------------------------------------------ */
/* B5: fact pages                                                      */
/* ------------------------------------------------------------------ */

export function factsIndexPage(): string {
  const links = Array.from({ length: FACT_PAGES }, (_, i) => {
    const p = labProduct(i + 1)!;
    return `<li><a href="/lab/facts/${p.id}">${esc(p.name)}</a></li>`;
  }).join("\n");
  return shell({
    title: "Fact pages",
    path: "/lab/facts",
    body: `<h1>Fact pages</h1>
<p>${FACT_PAGES} fictional products for an AI fact-extraction experiment. None of them exist or are for sale.</p>
<ul>
${links}
</ul>`,
  });
}

function productJsonLd(p: LabProduct): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.model,
    category: p.category,
    color: p.color,
    releaseDate: p.releaseDate,
    weight: { "@type": "QuantitativeValue", value: p.weightGrams, unitCode: "GRM" },
    offers: {
      "@type": "Offer",
      price: p.priceUsd.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/Discontinued",
      warranty: {
        "@type": "WarrantyPromise",
        durationOfWarranty: {
          "@type": "QuantitativeValue",
          value: p.warrantyMonths,
          unitCode: "MON",
        },
      },
    },
  });
}

export function factPage(p: LabProduct): string {
  const rows: [string, string][] = [
    ["Model", p.model],
    ["Category", p.category],
    ["Color", p.color],
    ["Price", `$${p.priceUsd.toFixed(2)}`],
    ["Weight", `${p.weightGrams} g`],
    ["Release date", p.releaseDate],
  ];
  return shell({
    title: p.name,
    path: `/lab/facts/${p.id}`,
    head:
      p.arm === "jsonld" ? `<script type="application/ld+json">${productJsonLd(p)}</script>` : "",
    body: `<p class="note">Fictional product. It doesn't exist and isn't for sale.</p>
<h1>${esc(p.name)}</h1>
<table><tbody>
${rows.map(([k, val]) => `<tr><th scope="row">${k}</th><td>${esc(val)}</td></tr>`).join("\n")}
</tbody></table>`,
    tail: beaconScript("b5", String(p.id)),
  });
}
