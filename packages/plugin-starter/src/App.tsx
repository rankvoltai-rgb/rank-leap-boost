import { useState } from "react";
import type { PublishedArticle } from "@rankvolt/api-client";
import {
  DEFAULT_BASE_URL,
  clearConnection,
  loadConnection,
  makeClient,
  saveConnection,
} from "./rankvolt";

export function App() {
  const initial = loadConnection();
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [baseUrl, setBaseUrl] = useState(initial.baseUrl);
  const [connected, setConnected] = useState(false);
  const [brand, setBrand] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [articles, setArticles] = useState<PublishedArticle[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  async function connect() {
    if (!apiKey.trim().startsWith("rv_")) {
      setError("Enter a valid Rankvolt API key (starts with rv_).");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const client = makeClient(apiKey.trim(), baseUrl);
      const who = await client.ping(); // validates the key
      saveConnection(apiKey, baseUrl);
      setBrand(who.brand_name);
      setConnected(true);
      const page = await client.listArticles({ limit: 100 });
      setArticles(page.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't connect.");
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    clearConnection();
    setConnected(false);
    setArticles([]);
    setSelected(new Set());
    setBrand(null);
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Platform forks replace this with the CMS write-back (see the Framer plugin).
  function publish() {
    const chosen = articles.filter((a) => selected.has(a.id));
    // eslint-disable-next-line no-alert
    alert(
      `Starter stub: would publish ${chosen.length} article(s):\n` +
        chosen.map((a) => `• ${a.title}`).join("\n"),
    );
  }

  if (!connected) {
    return (
      <main className="app">
        <header className="header">
          <span className="logo">⚡ Rankvolt</span>
          <span className="tag">Plugin Starter</span>
        </header>
        <section className="card">
          <h2>Enter your API Key</h2>
          <label>
            Rankvolt API key
            <input
              type="password"
              value={apiKey}
              placeholder="rv_live_…"
              onChange={(e) => setApiKey(e.target.value)}
            />
          </label>
          <p className="muted small">
            Get your API key at{" "}
            <a href={`${baseUrl}/dashboard/integrations`} target="_blank" rel="noreferrer">
              Rankvolt → Integrations
            </a>
            .
          </p>
          <label>
            API base URL
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={DEFAULT_BASE_URL}
            />
          </label>
          <button className="primary" onClick={connect} disabled={busy}>
            {busy ? "Verifying…" : "Connect"}
          </button>
          {error && <p className="error">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="header">
        <span className="logo">⚡ Rankvolt</span>
        <span className="tag">{brand ?? "Connected"}</span>
        <button className="ghost push" onClick={disconnect}>
          Disconnect
        </button>
      </header>

      <section className="card">
        <div className="row between">
          <h2>Articles ({articles.length})</h2>
          <button className="primary" disabled={selected.size === 0} onClick={publish}>
            Publish {selected.size || ""}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {articles.length === 0 ? (
          <p className="muted">
            No finished articles yet. Generate some in the Rankvolt blog engine, then reconnect.
          </p>
        ) : (
          <ul className="list">
            {articles.map((a) => (
              <li key={a.id}>
                <label className="item">
                  <input
                    type="checkbox"
                    checked={selected.has(a.id)}
                    onChange={() => toggle(a.id)}
                  />
                  <span>
                    <strong>{a.title}</strong>
                    <span className="muted small"> · SEO {a.seo_score}</span>
                    <br />
                    <span className="muted small">{a.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="muted small">
        Fork this starter per platform — swap <code>publish()</code> for the platform CMS API.
      </footer>
    </main>
  );
}
