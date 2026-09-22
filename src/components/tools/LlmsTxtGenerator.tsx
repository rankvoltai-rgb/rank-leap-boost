import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  CheckList,
  Field,
  GhostButton,
  OutputBox,
  Pane,
  TextArea,
  TextInput,
  Workbench,
  lines,
  type CheckItem,
} from "./shared";

interface Section {
  id: number;
  title: string;
  pages: string;
}

function parsePages(text: string): { label: string; url: string; note: string }[] {
  return lines(text).map((line) => {
    const [a = "", b = "", c = ""] = line.split("|").map((s) => s.trim());
    // "Title | url | note", "Title | url", or a bare url.
    if (!b) return { label: a, url: a, note: "" };
    return { label: a, url: b, note: c };
  });
}

function renderLinks(text: string): string[] {
  return parsePages(text).map((p) => `- [${p.label}](${p.url})${p.note ? `: ${p.note}` : ""}`);
}

let nextId = 3;

export function LlmsTxtGenerator() {
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: "Docs", pages: "" },
    { id: 2, title: "Product", pages: "" },
  ]);
  const [optional, setOptional] = useState("");

  const output = useMemo(() => {
    const out: string[] = [`# ${name.trim() || "Your Site"}`];
    if (summary.trim()) out.push("", `> ${summary.trim().replace(/\s+/g, " ")}`);
    if (details.trim()) out.push("", details.trim());
    for (const s of sections) {
      const links = renderLinks(s.pages);
      if (!s.title.trim() || !links.length) continue;
      out.push("", `## ${s.title.trim()}`, "", ...links);
    }
    const opt = renderLinks(optional);
    if (opt.length) out.push("", "## Optional", "", ...opt);
    return out.join("\n") + "\n";
  }, [name, summary, details, sections, optional]);

  const checks = useMemo<CheckItem[]>(() => {
    const all = [...sections.flatMap((s) => parsePages(s.pages)), ...parsePages(optional)];
    const relative = all.filter((p) => !/^https?:\/\//i.test(p.url));
    const noNotes = all.filter((p) => !p.note);
    return [
      {
        id: "name",
        status: name.trim() ? "pass" : "fail",
        label: "Site name as the H1",
        fix: "The first line must be a single # heading with the site or project name.",
      },
      {
        id: "summary",
        status: summary.trim() ? "pass" : "warn",
        label: "One-line summary in a blockquote",
        fix: "Add a sentence that says what the site is and who it's for — it's what an assistant reads first.",
      },
      {
        id: "links",
        status: all.length ? "pass" : "fail",
        label: `${all.length} page${all.length === 1 ? "" : "s"} listed`,
        fix: "List at least the pages you'd want an assistant to read: docs, pricing, key guides.",
      },
      {
        id: "absolute",
        status: !all.length ? "info" : relative.length ? "warn" : "pass",
        label: relative.length
          ? `${relative.length} link${relative.length === 1 ? "" : "s"} not absolute`
          : "All links are absolute URLs",
        fix: "Use full https:// URLs so the file works when read away from your domain.",
      },
      {
        id: "notes",
        status: !all.length ? "info" : noNotes.length ? "warn" : "pass",
        label: noNotes.length
          ? `${noNotes.length} link${noNotes.length === 1 ? "" : "s"} without a note`
          : "Every link has a note",
        fix: "A short note after each link tells the assistant what it will find without fetching it.",
      },
    ];
  }, [name, summary, sections, optional]);

  function update(id: number, patch: Partial<Section>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <Workbench
      input={
        <>
          <Pane title="About the site">
            <Field label="Site name" required>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rankbox"
              />
            </Field>
            <Field label="One-line summary" hint="Becomes the blockquote">
              <TextArea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="The AI search growth engine: research, write and publish content that gets cited by ChatGPT and ranked on Google."
                className="min-h-20"
              />
            </Field>
            <Field label="Details" hint="Optional paragraph">
              <TextArea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Anything an assistant should know before reading the links: who it's for, what's free, where to start."
                className="min-h-20"
              />
            </Field>
          </Pane>

          <Pane
            title="Sections"
            description="One page per line: Title | https://url | short note"
            actions={
              <GhostButton
                onClick={() => setSections((p) => [...p, { id: nextId++, title: "", pages: "" }])}
              >
                <Plus className="h-3.5 w-3.5" />
                Add section
              </GhostButton>
            }
          >
            {sections.map((s, i) => (
              <div key={s.id} className="rounded-xl border border-border bg-background p-3.5">
                <div className="flex items-center gap-2">
                  <TextInput
                    value={s.title}
                    onChange={(e) => update(s.id, { title: e.target.value })}
                    placeholder={["Docs", "Product", "Blog", "Company"][i] ?? "Section title"}
                    className="font-semibold"
                    aria-label="Section title"
                  />
                  <GhostButton
                    onClick={() => setSections((p) => p.filter((x) => x.id !== s.id))}
                    aria-label="Remove section"
                    className="h-10 w-10 justify-center px-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </GhostButton>
                </div>
                <TextArea
                  value={s.pages}
                  onChange={(e) => update(s.id, { pages: e.target.value })}
                  placeholder={
                    "Getting started | https://yoursite.com/docs/start | Install and first run\nAPI reference | https://yoursite.com/docs/api | Every endpoint with examples"
                  }
                  className="mt-2 min-h-24"
                  aria-label="Pages in this section"
                />
              </div>
            ))}
            <Field label="Optional" hint="Pages an assistant can skip when short on context">
              <TextArea
                value={optional}
                onChange={(e) => setOptional(e.target.value)}
                placeholder={
                  "Changelog | https://yoursite.com/changelog | Release notes\nPress | https://yoursite.com/press"
                }
                className="min-h-20"
              />
            </Field>
          </Pane>
        </>
      }
      output={
        <>
          <OutputBox value={output} filename="llms.txt" language="markdown" mime="text/markdown" />
          <Pane title="Checks" flush>
            <CheckList items={checks} />
          </Pane>
        </>
      }
    />
  );
}
