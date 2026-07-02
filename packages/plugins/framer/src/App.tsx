import { useState } from "react";
import { framer } from "framer-plugin";
import { RankvoltClient, type PublishedArticle } from "@rankvolt/api-client";
import { syncArticlesToCollection } from "./cms";

const BASE_URL = import.meta.env.VITE_RANKVOLT_BASE_URL ?? "https://rankvolt.top";
const KEY_STORAGE = "rankvolt.apiKey";

export function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem(KEY_STORAGE) ?? "");
  const [connected, setConnected] = useState(false);
  const [brand, setBrand] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [articles, setArticles] = useState<PublishedArticle[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function client() {
    return new RankvoltClient({ apiKey: apiKey.trim(), baseUrl: BASE_URL });
  }

  async function connect() {
    if (!apiKey.trim().startsWith("rv_")) {
      void framer.notify("Enter a valid Rankvolt key (rv_…)", { variant: "error" });
      return;
    }
    setBusy(true);
    try {
      const who = await client().ping();
      localStorage.setItem(KEY_STORAGE, apiKey.trim());
      setBrand(who.brand_name);
      setConnected(true);
      const page = await client().listArticles({ limit: 100 });
      setArticles(page.articles);
      if (page.articles.length === 0) {
        void framer.notify("Connected — no finished articles yet.", { variant: "info" });
      }
    } catch (err) {
      void framer.notify(err instanceof Error ? err.message : "Couldn't connect", {
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function publish() {
    const chosen = articles.filter((a) => selected.has(a.id));
    if (chosen.length === 0) return;
    setBusy(true);
    try {
      const count = await syncArticlesToCollection(chosen);
      void framer.notify(`Synced ${count} article(s) to the CMS collection.`, {
        variant: "success",
      });
      setSelected(new Set());
    } catch {
      // Managed-collection API is only available when the plugin is opened from
      // a CMS collection; guide the user instead of crashing.
      void framer.notify("Open this plugin from a CMS collection to sync articles.", {
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  if (!connected) {
    return (
      <main style={s.main}>
        <p style={s.muted}>Enter your Rankvolt API key.</p>
        <input
          style={s.input}
          type="password"
          value={apiKey}
          placeholder="rv_live_…"
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p style={s.muted}>
          Get your key at{" "}
          <a href={`${BASE_URL}/dashboard/integrations`} target="_blank" rel="noreferrer">
            Rankvolt → Integrations
          </a>
          .
        </p>
        <button style={s.primary} onClick={connect} disabled={busy}>
          {busy ? "Verifying…" : "Connect"}
        </button>
      </main>
    );
  }

  return (
    <main style={s.main}>
      <div style={s.row}>
        <strong>{brand ?? "Connected"}</strong>
        <span style={{ ...s.muted, marginLeft: "auto" }}>{articles.length} articles</span>
      </div>

      {articles.length === 0 ? (
        <p style={s.muted}>No finished articles yet. Generate some in Rankvolt, then reconnect.</p>
      ) : (
        <div style={s.list}>
          {articles.map((a) => (
            <label key={a.id} style={s.item}>
              <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggle(a.id)} />
              <span>
                <strong style={{ fontSize: 13 }}>{a.title}</strong>
                <br />
                <span style={s.muted}>SEO {a.seo_score}</span>
              </span>
            </label>
          ))}
        </div>
      )}

      <button style={s.primary} onClick={publish} disabled={busy || selected.size === 0}>
        {busy ? "Syncing…" : `Sync ${selected.size || ""} to CMS`}
      </button>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  main: { display: "flex", flexDirection: "column", gap: 10, padding: 12 },
  row: { display: "flex", alignItems: "center", gap: 8 },
  input: { height: 32, padding: "0 8px", borderRadius: 8 },
  primary: { height: 34, borderRadius: 8, fontWeight: 600, cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflow: "auto" },
  item: { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, cursor: "pointer" },
  muted: { color: "#888", fontSize: 12 },
};
