import { useMemo, useState } from "react";
import { STOP_WORDS } from "@/lib/text-stats";
import {
  CheckList,
  CopyButton,
  Field,
  Pane,
  Select,
  TextInput,
  Toggle,
  Workbench,
  type CheckItem,
} from "./shared";

function slugify(input: string, opts: { stop: boolean; max: number }): string {
  let s = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/æ/gi, "ae")
    .replace(/ø/gi, "o")
    .replace(/&/g, " and ")
    .replace(/%/g, " percent ")
    .replace(/\+/g, " plus ")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  let parts = s.split(/\s+/).filter(Boolean);
  if (opts.stop) {
    const kept = parts.filter((p) => !STOP_WORDS.has(p));
    if (kept.length >= 2) parts = kept;
  }
  if (opts.max > 0) parts = parts.slice(0, opts.max);
  s = parts.join("-");
  return s;
}

export function UrlSlugGenerator() {
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [stop, setStop] = useState(true);
  const [max, setMax] = useState("6");
  const [prefix, setPrefix] = useState("");

  const r = useMemo(() => {
    const m = Number(max);
    const main = slugify(title, { stop, max: m });
    const full = slugify(title, { stop: false, max: 0 });
    const kw = slugify(keyword, { stop: false, max: 0 });
    const rest = main
      .split("-")
      .filter((p) => p && !kw.split("-").includes(p))
      .slice(0, Math.max(0, m - kw.split("-").length));
    const keywordFirst = kw ? [kw, ...rest].join("-") : "";
    const base = prefix.trim().replace(/\/+$/, "");
    const url = (s: string) => (s ? `${base || "https://yoursite.com"}/${s}` : "");
    return { main, full, keywordFirst, url };
  }, [title, keyword, stop, max, prefix]);

  const checks = useMemo<CheckItem[]>(() => {
    if (!r.main) return [];
    const parts = r.main.split("-");
    const items: CheckItem[] = [];
    items.push(
      parts.length <= 5
        ? { id: "len", status: "pass", label: `${parts.length} words — short and readable` }
        : {
            id: "len",
            status: "warn",
            label: `${parts.length} words`,
            fix: "Three to five meaningful words is the sweet spot.",
          },
    );
    if (/\b(19|20)\d{2}\b/.test(r.main))
      items.push({
        id: "year",
        status: "warn",
        label: "Contains a year",
        fix: "Leave the year out of the slug so you can update the article without changing its URL.",
      });
    const stopsLeft = parts.filter((p) => STOP_WORDS.has(p));
    if (stopsLeft.length)
      items.push({
        id: "stop",
        status: "info",
        label: `Keeps stop words: ${stopsLeft.join(", ")}`,
        detail: "Fine when removing them changes the meaning.",
      });
    if (r.main.length > 60)
      items.push({
        id: "chars",
        status: "warn",
        label: `${r.main.length} characters`,
        fix: "Under 60 characters keeps the full URL visible in results and citations.",
      });
    if (keyword.trim() && !r.main.includes(slugify(keyword, { stop: false, max: 0 })))
      items.push({
        id: "kw",
        status: "warn",
        label: "Target keyword not in the slug",
        fix: "Use the keyword-first version below.",
      });
    return items;
  }, [r, keyword]);

  return (
    <Workbench
      input={
        <Pane title="Title">
          <Field label="Page title or headline">
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Complete Guide to AI Crawlers (Updated for 2026)"
            />
          </Field>
          <Field label="Target keyword" hint="Optional">
            <TextInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ai crawlers"
            />
          </Field>
          <Field label="URL prefix" hint="Optional">
            <TextInput
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="https://yoursite.com/blog"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Max words">
              <Select value={max} onChange={(e) => setMax(e.target.value)}>
                {["3", "4", "5", "6", "8", "0"].map((n) => (
                  <option key={n} value={n}>
                    {n === "0" ? "No limit" : n}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Toggle
            label="Remove stop words"
            description="the, a, of, to, for…"
            checked={stop}
            onChange={setStop}
          />
        </Pane>
      }
      output={
        <>
          <Pane title="Slugs" flush>
            <ul className="divide-y divide-border">
              {[
                { k: "Recommended", v: r.main },
                { k: "Keyword first", v: r.keywordFirst },
                { k: "Full title", v: r.full },
              ]
                .filter((x) => x.v)
                .map((x) => (
                  <li key={x.k} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {x.k}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[0.95rem] font-semibold text-ink">
                        /{x.v}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{r.url(x.v)}</p>
                    </div>
                    <CopyButton value={x.v} />
                  </li>
                ))}
              {!r.main && (
                <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Type a title to see slugs.
                </li>
              )}
            </ul>
          </Pane>
          {checks.length > 0 && (
            <Pane title="Checks" flush>
              <CheckList items={checks} />
            </Pane>
          )}
        </>
      }
    />
  );
}
