import { useState } from "react";
import { cn } from "@/lib/utils";
import { Field, TextInput, TextArea, ToolGrid, Panel } from "./shared";

function Meter({
  label,
  count,
  min,
  max,
}: {
  label: string;
  count: number;
  min: number;
  max: number;
}) {
  const status = count === 0 ? "empty" : count < min ? "short" : count > max ? "long" : "good";
  const color =
    status === "good"
      ? "text-volt"
      : status === "empty"
        ? "text-muted-foreground"
        : "text-destructive";
  const note =
    status === "good"
      ? "Looks great"
      : status === "empty"
        ? "Add content"
        : status === "short"
          ? `Aim for ${min}+`
          : `Trim to ${max}`;
  const pct = Math.min(100, (count / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-ink">{label}</span>
        <span className={cn("font-medium", color)}>
          {count} chars · {note}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            status === "good" ? "bg-volt" : status === "empty" ? "bg-border" : "bg-destructive",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function SnippetPreview() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");

  const displayUrl = (url || "https://yoursite.com/page").replace(/^https?:\/\//, "");
  const breadcrumb = displayUrl.split("/").filter(Boolean).join(" › ");

  return (
    <ToolGrid>
      <Panel title="Your snippet">
        <Field label="Page title">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Free llms.txt Generator for AI Search | Rankvolt"
          />
        </Field>
        <Field label="URL">
          <TextInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yoursite.com/tools/llms-txt"
          />
        </Field>
        <Field label="Meta description">
          <TextArea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Generate a valid llms.txt file in seconds so AI engines understand and cite your site. Free, no signup."
          />
        </Field>
        <div className="space-y-3 pt-1">
          <Meter label="Title" count={title.length} min={30} max={60} />
          <Meter label="Description" count={desc.length} min={120} max={160} />
        </div>
      </Panel>
      <Panel title="Google preview">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-xs text-muted-foreground">{breadcrumb}</div>
          <div className="mt-1 text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
            {title || "Your page title appears here"}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {desc ||
              "Your meta description appears here. Keep it between 120 and 160 characters so it isn't truncated in search results."}
          </p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          This is an approximation. Google sometimes rewrites titles and descriptions based on the
          search query.
        </p>
      </Panel>
    </ToolGrid>
  );
}