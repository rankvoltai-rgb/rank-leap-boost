import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CheckList,
  GhostButton,
  OutputBox,
  Pane,
  Segmented,
  Workbench,
  inputBase,
  type CheckItem,
} from "./shared";

const LANGS = new Set(
  "aa ab af am ar as ay az ba be bg bh bi bn bo br ca co cs cy da de dz el en eo es et eu fa fi fj fo fr fy ga gd gl gn gu ha he hi hr hu hy ia id ie ik is it iu ja jv ka kk kl km kn ko ks ku ky la lb ln lo lt lv mg mi mk ml mn mo mr ms mt my na ne nl no oc om or pa pl ps pt qu rm rn ro ru rw sa sd sg sh si sk sl sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn to tr ts tt tw ug uk ur uz vi vo wo xh yi yo za zh zu".split(
    " ",
  ),
);

interface Row {
  id: number;
  lang: string;
  region: string;
  url: string;
}

let nextId = 4;

function code(r: Row): string {
  const l = r.lang.trim().toLowerCase();
  const g = r.region.trim().toUpperCase();
  return g ? `${l}-${g}` : l;
}

function valid(r: Row): string | null {
  const l = r.lang.trim().toLowerCase();
  const g = r.region.trim();
  if (!l) return "Missing language code";
  if (!LANGS.has(l)) return `"${l}" is not an ISO 639-1 language code`;
  if (g && !/^[A-Za-z]{2}$/.test(g)) return `"${g}" is not a two-letter region code`;
  if (!/^https?:\/\//i.test(r.url.trim())) return "URL must be absolute";
  return null;
}

export function HreflangGenerator() {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, lang: "en", region: "", url: "https://yoursite.com/" },
    { id: 2, lang: "en", region: "GB", url: "https://yoursite.com/uk/" },
    { id: 3, lang: "fr", region: "", url: "https://yoursite.com/fr/" },
  ]);
  const [xDefault, setXDefault] = useState<number>(1);
  const [format, setFormat] = useState<"html" | "xml">("html");

  function update(id: number, patch: Partial<Row>) {
    setRows((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const good = rows.filter((r) => !valid(r));
  const fallback = rows.find((r) => r.id === xDefault && !valid(r)) ?? good[0];

  const output = useMemo(() => {
    if (!good.length) return "";
    if (format === "html") {
      const out = good.map(
        (r) => `<link rel="alternate" hreflang="${code(r)}" href="${r.url.trim()}" />`,
      );
      if (fallback)
        out.push(`<link rel="alternate" hreflang="x-default" href="${fallback.url.trim()}" />`);
      return out.join("\n");
    }
    const alts = good.map(
      (r) => `    <xhtml:link rel="alternate" hreflang="${code(r)}" href="${r.url.trim()}" />`,
    );
    if (fallback)
      alts.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${fallback.url.trim()}" />`,
      );
    return [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
      `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
      ...good.map((r) =>
        [`  <url>`, `    <loc>${r.url.trim()}</loc>`, ...alts, `  </url>`].join("\n"),
      ),
      `</urlset>`,
    ].join("\n");
  }, [good, fallback, format]);

  const checks = useMemo<CheckItem[]>(() => {
    const items: CheckItem[] = rows
      .map((r) => ({ r, err: valid(r) }))
      .filter((x) => x.err)
      .map(({ r, err }) => ({
        id: `r${r.id}`,
        status: "fail" as const,
        label: `${code(r) || "row"}: ${err}`,
      }));
    const codes = good.map(code);
    const dupes = codes.filter((c, i) => codes.indexOf(c) !== i);
    if (dupes.length)
      items.push({
        id: "dupes",
        status: "fail",
        label: `Duplicate code: ${[...new Set(dupes)].join(", ")}`,
      });
    if (!fallback)
      items.push({
        id: "xd",
        status: "warn",
        label: "No x-default",
        fix: "Pick the version to show when no language matches.",
      });
    if (!items.length)
      items.push({
        id: "ok",
        status: "pass",
        label: `${good.length} versions, all reciprocal, x-default set`,
      });
    items.push({
      id: "n",
      status: "info",
      label: "Paste the same complete set into every language version, including itself.",
    });
    return items;
  }, [rows, good, fallback]);

  return (
    <Workbench
      ratio="wide-input"
      input={
        <Pane
          title="Versions"
          actions={
            <GhostButton
              onClick={() =>
                setRows((p) => [...p, { id: nextId++, lang: "", region: "", url: "" }])
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </GhostButton>
          }
          flush
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="text-left text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-2.5 font-semibold">Lang</th>
                  <th className="py-2.5 font-semibold">Region</th>
                  <th className="py-2.5 font-semibold">URL</th>
                  <th className="py-2.5 text-center font-semibold">x-default</th>
                  <th className="py-2.5" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const err = valid(r);
                  return (
                    <tr key={r.id} className="border-t border-border">
                      <td className="py-2 pl-5 pr-2">
                        <input
                          value={r.lang}
                          onChange={(e) => update(r.id, { lang: e.target.value })}
                          placeholder="en"
                          maxLength={3}
                          aria-label="Language code"
                          className={cn(
                            inputBase,
                            "w-16 font-mono",
                            err && !r.lang && "border-destructive/50",
                          )}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          value={r.region}
                          onChange={(e) => update(r.id, { region: e.target.value })}
                          placeholder="GB"
                          maxLength={2}
                          aria-label="Region code"
                          className={cn(inputBase, "w-16 font-mono uppercase")}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          value={r.url}
                          onChange={(e) => update(r.id, { url: e.target.value })}
                          placeholder="https://yoursite.com/fr/"
                          aria-label="URL"
                          className={cn(inputBase, "font-mono text-[0.8rem]")}
                        />
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="radio"
                          name="xdefault"
                          checked={xDefault === r.id}
                          onChange={() => setXDefault(r.id)}
                          aria-label="Use as x-default"
                          className="h-4 w-4 accent-[var(--ink)]"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <GhostButton
                          onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))}
                          aria-label="Remove"
                          className="h-9 w-9 justify-center px-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </GhostButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Pane>
      }
      output={
        <>
          <div className="flex items-center justify-between">
            <Segmented
              value={format}
              onChange={setFormat}
              options={[
                { value: "html", label: "HTML <head>" },
                { value: "xml", label: "XML sitemap" },
              ]}
            />
          </div>
          <OutputBox
            value={output}
            filename={format === "html" ? "hreflang.html" : "sitemap-hreflang.xml"}
            language={format}
            mime={format === "html" ? "text/html" : "application/xml"}
            lineNumbers
          />
          <Pane title="Checks" flush>
            <CheckList items={checks} />
          </Pane>
        </>
      }
    />
  );
}
