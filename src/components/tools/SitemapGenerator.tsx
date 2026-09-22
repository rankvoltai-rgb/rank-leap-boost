import { useMemo, useState } from "react";
import {
  CheckList,
  Field,
  OutputBox,
  Pane,
  Select,
  Stat,
  StatGrid,
  TextArea,
  TextInput,
  Workbench,
  lines,
  type CheckItem,
} from "./shared";

const FREQS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

function xmlEsc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function SitemapGenerator() {
  const [base, setBase] = useState("");
  const [urls, setUrls] = useState("");
  const [lastmod, setLastmod] = useState(() => new Date().toISOString().slice(0, 10));
  const [freq, setFreq] = useState("weekly");
  const [priority, setPriority] = useState("0.5");

  const parsed = useMemo(() => {
    const b = base.trim().replace(/\/+$/, "");
    const seen = new Set<string>();
    const out: { loc: string; priority: string; freq: string; dupe: boolean; bad: boolean }[] = [];
    for (const line of lines(urls)) {
      const [raw = "", p = "", f = ""] = line.split("|").map((s) => s.trim());
      let loc = raw;
      if (!/^https?:\/\//i.test(loc)) loc = b ? `${b}${loc.startsWith("/") ? "" : "/"}${loc}` : loc;
      const bad = !/^https?:\/\/[^\s]+$/i.test(loc);
      const dupe = seen.has(loc);
      seen.add(loc);
      out.push({
        loc,
        priority: /^(0(\.\d)?|1(\.0)?)$/.test(p) ? p : priority,
        freq: FREQS.includes(f) ? f : freq,
        dupe,
        bad,
      });
    }
    return out;
  }, [base, urls, freq, priority]);

  const good = parsed.filter((u) => !u.bad && !u.dupe);

  const xml = useMemo(() => {
    if (!good.length) return "";
    return [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...good.map((u) =>
        [
          `  <url>`,
          `    <loc>${xmlEsc(u.loc)}</loc>`,
          lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
          `    <changefreq>${u.freq}</changefreq>`,
          `    <priority>${u.priority}</priority>`,
          `  </url>`,
        ]
          .filter(Boolean)
          .join("\n"),
      ),
      `</urlset>`,
    ].join("\n");
  }, [good, lastmod]);

  const checks = useMemo<CheckItem[]>(() => {
    const bad = parsed.filter((u) => u.bad);
    const dupes = parsed.filter((u) => u.dupe);
    const items: CheckItem[] = [];
    if (bad.length)
      items.push({
        id: "bad",
        status: "fail",
        label: `${bad.length} line${bad.length === 1 ? "" : "s"} not absolute URLs`,
        fix: "Set a base URL, or write full https:// URLs.",
      });
    if (dupes.length)
      items.push({
        id: "dupe",
        status: "warn",
        label: `${dupes.length} duplicate${dupes.length === 1 ? "" : "s"} removed`,
      });
    if (good.length > 50000)
      items.push({
        id: "max",
        status: "fail",
        label: "More than 50,000 URLs",
        fix: "Split into several sitemaps and list them in a sitemap index.",
      });
    if (!items.length && good.length)
      items.push({ id: "ok", status: "pass", label: `${good.length} URLs, valid sitemap` });
    items.push({
      id: "n1",
      status: "info",
      label: "Google reads lastmod only when it's accurate; keep it honest or leave it out.",
    });
    items.push({
      id: "n2",
      status: "info",
      label: "Reference the file in robots.txt: Sitemap: https://yoursite.com/sitemap.xml",
    });
    return items;
  }, [parsed, good]);

  return (
    <Workbench
      input={
        <Pane title="URLs">
          <Field label="Base URL" hint="For relative paths">
            <TextInput
              value={base}
              onChange={(e) => setBase(e.target.value)}
              placeholder="https://yoursite.com"
            />
          </Field>
          <Field label="URLs" hint="One per line — path | priority | changefreq">
            <TextArea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder={"/\n/pricing | 0.9\n/blog | 0.8 | daily\nhttps://yoursite.com/about"}
              className="min-h-56"
              mono
              spellCheck={false}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Last modified">
              <TextInput type="date" value={lastmod} onChange={(e) => setLastmod(e.target.value)} />
            </Field>
            <Field label="Default changefreq">
              <Select value={freq} onChange={(e) => setFreq(e.target.value)}>
                {FREQS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </Select>
            </Field>
            <Field label="Default priority">
              <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </Field>
          </div>
        </Pane>
      }
      output={
        <>
          <StatGrid cols={3}>
            <Stat value={good.length.toLocaleString()} label="URLs" />
            <Stat
              value={xml ? `${(new Blob([xml]).size / 1024).toFixed(1)} KB` : "—"}
              label="File size"
              hint="Limit 50 MB"
            />
            <Stat value={lastmod || "—"} label="lastmod" />
          </StatGrid>
          <OutputBox
            value={xml}
            filename="sitemap.xml"
            language="xml"
            mime="application/xml"
            placeholder="Paste URLs to build the sitemap."
          />
          <Pane title="Checks" flush>
            <CheckList items={checks} />
          </Pane>
        </>
      }
    />
  );
}
