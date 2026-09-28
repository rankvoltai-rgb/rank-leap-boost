/**
 * The embedded app's page: one HTML document Shopify loads inside the admin.
 *
 * It's deliberately not a route of the Rankbox React app. The admin expects
 * App Bridge as the first script and Polaris web components for the look, and
 * the page has no Rankbox session: every call it makes carries the App Bridge
 * ID token instead (see app.server.ts). So it stays a small, self-contained
 * document with its script inline.
 */

function escapeAttr(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const RANKBOX = "https://rankbox.xyz";

/** The script, as a plain string: it runs in the admin iframe, not through the app's bundler. */
const SCRIPT = String.raw`
const RANKBOX = ${JSON.stringify(RANKBOX)};
const app = document.getElementById("app");
let state = null;

const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function toast(message, isError = false) {
  try { shopify.toast.show(message, { isError }); } catch { /* the banner still says it */ }
}

function busy(el, on) {
  if (!el) return;
  el.loading = on;
  if (on) el.setAttribute("loading", ""); else el.removeAttribute("loading");
}

async function api(path, { method = "GET", body } = {}) {
  const token = await shopify.idToken();
  const res = await fetch(path, {
    method,
    headers: {
      Authorization: "Bearer " + token,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong (" + res.status + ").");
  return data;
}

function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

function ago(iso) {
  if (!iso) return "";
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return minutes + " min ago";
  const hours = Math.round(minutes / 60);
  if (hours < 24) return plural(hours, "hour", "hours") + " ago";
  return plural(Math.round(hours / 24), "day", "days") + " ago";
}

function hostOf(url) {
  try { return new URL(/^https?:/i.test(url) ? url : "https://" + url).hostname.replace(/^www\./, ""); }
  catch { return ""; }
}

function errorView(message) {
  return '<s-banner tone="critical" heading="Rankbox couldn\'t load">' + esc(message) + '</s-banner>' +
    '<s-section><s-button id="retry" variant="primary">Try again</s-button></s-section>';
}

function linkView() {
  return '<s-section heading="Connect your Rankbox site"><s-stack gap="base">' +
    '<s-paragraph>Rankbox writes articles built to rank on Google and get cited by AI search, and publishes them as posts on this store\'s blog. Paste the API key of the Rankbox site that should publish here.</s-paragraph>' +
    '<s-password-field id="apiKey" label="Rankbox API key" placeholder="rv_live_…" autocomplete="off" details="In Rankbox, open Integrations, choose Shopify, and create a key."></s-password-field>' +
    '<s-stack direction="inline" gap="base">' +
      '<s-button id="connect" variant="primary">Connect</s-button>' +
      '<s-button href="' + RANKBOX + '/dashboard/integrations?connector=shopify&shopify=key" target="_blank" variant="secondary">Get a key in Rankbox</s-button>' +
    '</s-stack>' +
    '<s-paragraph>New to Rankbox? <s-link href="' + RANKBOX + '" target="_blank">Start a free trial</s-link>, then come back with your key.</s-paragraph>' +
  '</s-stack></s-section>';
}

function linkedView(s) {
  const setup = s.status === "setup";
  const parts = [];
  if (s.lastError && s.status === "error") {
    parts.push('<s-banner tone="critical" heading="Publishing needs attention">' + esc(s.lastError) + '</s-banner>');
  }
  if (!s.site.entitled) {
    parts.push('<s-banner tone="warning" heading="No active Rankbox plan">This Rankbox site has no active plan or trial, so nothing new is published until it has one.</s-banner>');
  }
  if (setup) {
    parts.push('<s-banner tone="info" heading="One step left">Pick the blog articles go to, then start publishing. New articles arrive from then on.</s-banner>');
  }

  const blogField = s.blogs.length
    ? '<s-select id="blog" label="Blog" details="Changing it later sends new articles to the new blog. Posts already published stay where they are.">' +
        s.blogs.map((b) => '<s-option value="' + esc(b.id) + '">' + esc(b.title) + '</s-option>').join("") +
      '</s-select>'
    : '<s-banner tone="warning" heading="This store has no blog yet">Add one in Online Store → Blog posts, then reload this page.</s-banner>';

  parts.push('<s-section heading="Publishing"><s-stack gap="base">' +
    blogField +
    '<s-select id="visibility" label="New articles">' +
      '<s-option value="visible">Visible: published right away</s-option>' +
      '<s-option value="hidden">Hidden: added unpublished, for you to review</s-option>' +
    '</s-select>' +
    '<s-text-field id="author" label="Author" value="' + esc(s.settings.author) + '" details="Shown as the author on each post."></s-text-field>' +
    '<s-stack direction="inline" gap="base"><s-button id="save" variant="primary"' + (s.blogs.length ? "" : " disabled") + '>' + (setup ? "Start publishing" : "Save") + '</s-button></s-stack>' +
  '</s-stack></s-section>');

  if (!setup) {
    const c = s.counts;
    const line = [plural(c.inShopify, "article", "articles") + " in this blog"];
    if (c.notYet) line.push(c.notYet + " finished in Rankbox but not here yet");
    if (c.editedInShopify) line.push(plural(c.editedInShopify, "post", "posts") + " edited here, which Rankbox leaves as you changed them");
    parts.push('<s-section heading="Articles"><s-stack gap="base">' +
      '<s-paragraph>' + esc(line.join(" · ")) + '.</s-paragraph>' +
      (s.lastPublishedAt ? '<s-paragraph>Last published ' + esc(ago(s.lastPublishedAt)) + '.</s-paragraph>' : "") +
      '<s-stack direction="inline" gap="base"><s-button id="sync" variant="secondary">Publish missing articles now</s-button></s-stack>' +
    '</s-stack></s-section>');
  }

  const brand = s.site.brandName || "your Rankbox site";
  const host = s.site.websiteUrl ? hostOf(s.site.websiteUrl) : "";
  parts.push('<s-section heading="Rankbox site"><s-stack gap="base">' +
    '<s-paragraph>Publishing for ' + esc(brand) + (host ? " (" + esc(host) + ")" : "") + '. Rankbox only creates and updates the blog posts it writes. It never reads your products, orders, or customers.</s-paragraph>' +
    '<s-stack direction="inline" gap="base">' +
      '<s-button href="' + RANKBOX + '/dashboard" target="_blank" variant="secondary">Open Rankbox</s-button>' +
      '<s-button id="unlink" variant="tertiary" tone="critical">Disconnect</s-button>' +
    '</s-stack>' +
  '</s-stack></s-section>');
  return parts.join("");
}

function render() {
  app.innerHTML = state.site ? linkedView(state) : linkView();
  if (state.site) {
    const blog = document.getElementById("blog");
    const chosen = state.settings.blogId || (state.blogs[0] && state.blogs[0].id) || "";
    if (blog) { blog.setAttribute("value", chosen); blog.value = chosen; }
    const vis = document.getElementById("visibility");
    const v = state.settings.visible ? "visible" : "hidden";
    vis.setAttribute("value", v); vis.value = v;
  }
  wire();
}

function wire() {
  const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener("click", () => fn(el)); };

  on("retry", () => load());

  on("connect", async (btn) => {
    const apiKey = (document.getElementById("apiKey").value || "").trim();
    if (!apiKey) return toast("Paste your Rankbox API key first.", true);
    busy(btn, true);
    try {
      state = await api("/api/public/shopify/link", { method: "POST", body: { apiKey } });
      render();
      toast("Connected to Rankbox.");
    } catch (err) {
      busy(btn, false);
      toast(err.message, true);
    }
  });

  on("save", async (btn) => {
    const blogId = document.getElementById("blog")?.value;
    if (!blogId) return toast("Pick a blog first.", true);
    const wasSetup = state.status === "setup";
    busy(btn, true);
    try {
      state = await api("/api/public/shopify/settings", {
        method: "POST",
        body: {
          blogId,
          visible: document.getElementById("visibility").value !== "hidden",
          author: document.getElementById("author").value || "",
        },
      });
      render();
      toast(wasSetup ? "Publishing is on. New articles arrive here from now on." : "Saved.");
    } catch (err) {
      busy(btn, false);
      toast(err.message, true);
    }
  });

  on("sync", async (btn) => {
    busy(btn, true);
    const total = { created: 0, updated: 0, failed: 0 };
    let errors = [];
    try {
      for (let round = 0; round < 10; round++) {
        const r = await api("/api/public/shopify/sync", { method: "POST" });
        total.created += r.created; total.updated += r.updated; total.failed += r.failed;
        errors = r.errors || [];
        if (!r.remaining) break;
      }
      if (total.failed) toast(errors[0] || plural(total.failed, "article", "articles") + " couldn't be published.", true);
      else if (total.created || total.updated) toast("Published " + total.created + " new, updated " + total.updated + ".");
      else toast("Everything is already here.");
    } catch (err) {
      toast(err.message, true);
    }
    await load();
  });

  on("unlink", async (btn) => {
    if (btn.dataset.armed !== "1") {
      btn.dataset.armed = "1";
      btn.textContent = "Click again to disconnect";
      setTimeout(() => { if (btn.isConnected) { btn.dataset.armed = ""; btn.textContent = "Disconnect"; } }, 5000);
      return;
    }
    busy(btn, true);
    try {
      state = await api("/api/public/shopify/link", { method: "DELETE" });
      render();
      toast("Disconnected. Posts already published stay in your blog.");
    } catch (err) {
      busy(btn, false);
      toast(err.message, true);
    }
  });
}

async function load() {
  try {
    state = await api("/api/public/shopify/app");
    render();
  } catch (err) {
    app.innerHTML = errorView(err.message);
    wire();
  }
}

load();
`;

export function embeddedAppHtml(apiKey: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="shopify-api-key" content="${escapeAttr(apiKey)}">
<script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
<script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
<title>Rankbox</title>
</head>
<body>
<s-page heading="Blog publishing">
<div id="app"><s-section><s-stack direction="inline" gap="base"><s-spinner accessibilityLabel="Loading"></s-spinner><s-text>Loading…</s-text></s-stack></s-section></div>
</s-page>
<script type="module">${SCRIPT}</script>
</body>
</html>`;
}

/** Shown when the page is opened outside a Shopify admin. */
export function outsideAdminHtml(message: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rankbox for Shopify</title>
<style>
  :root { color-scheme: light dark; --bg: #f6f7f9; --ink: #111827; --muted: #4b5563; --cta: #2563eb; }
  @media (prefers-color-scheme: dark) { :root { --bg: #0f1115; --ink: #f3f4f6; --muted: #9ca3af; --cta: #60a5fa; } }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: var(--bg); color: var(--ink);
    font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; padding: 0 16px; }
  main { max-width: 32rem; }
  h1 { font-size: 1.25rem; margin: 0 0 .5rem; }
  p { color: var(--muted); margin: 0 0 1rem; }
  a { color: var(--cta); }
</style>
</head>
<body>
<main>
<h1>Rankbox for Shopify</h1>
<p>${escapeAttr(message)}</p>
<p><a href="${RANKBOX}/integrations/shopify">How the Shopify app works</a></p>
</main>
</body>
</html>`;
}
