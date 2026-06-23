import { useMemo, useState } from "react";
import { Field, TextInput, TextArea, OutputBox, ToolGrid, Panel } from "./shared";

export function LlmsTxtGenerator() {
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [pages, setPages] = useState("");

  const output = useMemo(() => {
    const title = name.trim() || "Your Site";
    const lines: string[] = [`# ${title}`];
    if (summary.trim()) lines.push("", `> ${summary.trim()}`);
    if (siteUrl.trim()) lines.push("", `Website: ${siteUrl.trim()}`);

    const links = pages
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, url] = line.includes("|") ? line.split("|") : [line, line];
        const cleanUrl = (url ?? label).trim();
        const cleanLabel = label.trim();
        return `- [${cleanLabel}](${cleanUrl})`;
      });

    if (links.length) {
      lines.push("", "## Key pages", ...links);
    }
    lines.push("");
    return lines.join("\n");
  }, [name, summary, siteUrl, pages]);

  return (
    <ToolGrid>
      <Panel title="Your details">
        <Field label="Site name">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rankvolt"
          />
        </Field>
        <Field label="One-line description">
          <TextArea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="The AI search growth engine that gets your brand cited by ChatGPT and ranked on Google."
            className="min-h-20"
          />
        </Field>
        <Field label="Website URL">
          <TextInput
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://yoursite.com"
          />
        </Field>
        <Field label="Key pages" hint="One per line — Label | https://url">
          <TextArea
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder={"Pricing | https://yoursite.com/pricing\nDocs | https://yoursite.com/docs\nBlog | https://yoursite.com/blog"}
          />
        </Field>
      </Panel>
      <Panel title="llms.txt">
        <OutputBox value={output} filename="llms.txt" language="llms.txt" />
      </Panel>
    </ToolGrid>
  );
}