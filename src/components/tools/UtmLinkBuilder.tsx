import { useMemo, useState } from "react";
import {
  CheckList,
  CopyButton,
  Field,
  OutputBox,
  Pane,
  Presets,
  Segmented,
  TextArea,
  TextInput,
  Toggle,
  Workbench,
  lines,
  type CheckItem,
} from "./shared";

type PresetId = "newsletter" | "linkedin" | "x" | "facebook" | "google" | "partner";

const PRESETS: { value: PresetId; label: string; source: string; medium: string }[] = [
  { value: "newsletter", label: "Newsletter", source: "newsletter", medium: "email" },
  { value: "linkedin", label: "LinkedIn", source: "linkedin", medium: "social" },
  { value: "x", label: "X", source: "x", medium: "social" },
  { value: "facebook", label: "Facebook", source: "facebook", medium: "social" },
  { value: "google", label: "Google Ads", source: "google", medium: "cpc" },
  { value: "partner", label: "Partner", source: "partner", medium: "referral" },
];

function build(
  url: string,
  params: Record<string, string>,
  lower: boolean,
): { url: string; hadUtm: boolean; invalid: boolean } {
  let u: URL;
  try {
    u = new URL(/^[a-z]+:\/\//i.test(url) ? url : `https://${url}`);
  } catch {
    return { url, hadUtm: false, invalid: true };
  }
  const hadUtm = [...u.searchParams.keys()].some((k) => k.startsWith("utm_"));
  for (const [k, v] of Object.entries(params)) {
    const val = (lower ? v.toLowerCase() : v).trim().replace(/\s+/g, "-");
    if (val) u.searchParams.set(`utm_${k}`, val);
    else u.searchParams.delete(`utm_${k}`);
  }
  return { url: u.toString(), hadUtm, invalid: false };
}

export function UtmLinkBuilder() {
  const [urls, setUrls] = useState("");
  const [preset, setPreset] = useState<PresetId | null>(null);
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [lower, setLower] = useState(true);
  const [format, setFormat] = useState<"list" | "csv">("list");

  function choose(p: PresetId) {
    setPreset(p);
    const x = PRESETS.find((q) => q.value === p)!;
    setSource(x.source);
    setMedium(x.medium);
  }

  const results = useMemo(
    () =>
      lines(urls).map((u) => ({
        input: u,
        ...build(u, { source, medium, campaign, term, content }, lower),
      })),
    [urls, source, medium, campaign, term, content, lower],
  );
  const good = results.filter((r) => !r.invalid);

  const output = useMemo(() => {
    if (!good.length) return "";
    if (format === "list") return good.map((r) => r.url).join("\n");
    const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
    return [
      "original,tagged,source,medium,campaign,term,content",
      ...good.map((r) =>
        [r.input, r.url, source, medium, campaign, term, content].map(q).join(","),
      ),
    ].join("\n");
  }, [good, format, source, medium, campaign, term, content]);

  const checks = useMemo<CheckItem[]>(() => {
    const items: CheckItem[] = [];
    if (!source || !medium || !campaign)
      items.push({
        id: "req",
        status: "warn",
        label: "Source, medium and campaign are the minimum",
        fix: "Analytics tools group traffic on those three; leave one out and it lands in (not set).",
      });
    if (results.some((r) => r.invalid))
      items.push({
        id: "bad",
        status: "fail",
        label: `${results.filter((r) => r.invalid).length} line${results.filter((r) => r.invalid).length === 1 ? "" : "s"} not valid URLs`,
      });
    if (results.some((r) => r.hadUtm))
      items.push({
        id: "had",
        status: "info",
        label: "Some URLs already had UTM parameters — they were replaced.",
      });
    if (!lower && /[A-Z]/.test(source + medium + campaign + term + content))
      items.push({
        id: "case",
        status: "warn",
        label: "Mixed case",
        fix: "Reports treat Email and email as different sources. Keep everything lowercase.",
      });
    if (!items.length && good.length)
      items.push({
        id: "ok",
        status: "pass",
        label: `${good.length} link${good.length === 1 ? "" : "s"} tagged`,
      });
    return items;
  }, [source, medium, campaign, term, content, lower, results, good]);

  return (
    <Workbench
      input={
        <>
          <Pane title="Destination">
            <Field label="URL(s)" hint="One per line for bulk">
              <TextArea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder={"https://yoursite.com/pricing\nhttps://yoursite.com/blog/launch"}
                className="min-h-24"
                mono
                spellCheck={false}
              />
            </Field>
          </Pane>
          <Pane title="Campaign">
            <Presets
              value={preset}
              onChange={choose}
              options={PRESETS.map((p) => ({ value: p.value, label: p.label }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Source" required hint="utm_source">
                <TextInput
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setPreset(null);
                  }}
                  placeholder="newsletter"
                />
              </Field>
              <Field label="Medium" required hint="utm_medium">
                <TextInput
                  value={medium}
                  onChange={(e) => {
                    setMedium(e.target.value);
                    setPreset(null);
                  }}
                  placeholder="email"
                />
              </Field>
              <Field label="Campaign" required hint="utm_campaign">
                <TextInput
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="spring-launch"
                />
              </Field>
              <Field label="Term" hint="utm_term">
                <TextInput
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="ai seo tools"
                />
              </Field>
              <Field label="Content" hint="utm_content">
                <TextInput
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="hero-button"
                />
              </Field>
            </div>
            <Toggle
              label="Force lowercase"
              description="Prevents split rows in analytics"
              checked={lower}
              onChange={setLower}
            />
          </Pane>
        </>
      }
      output={
        <>
          {good[0] && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-1">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Tagged link
              </p>
              <p className="mt-1.5 break-all font-mono text-[0.85rem] leading-relaxed text-ink">
                {good[0].url}
              </p>
              <div className="mt-3">
                <CopyButton value={good[0].url} label="Copy link" />
              </div>
            </div>
          )}
          {good.length > 1 && (
            <Segmented
              value={format}
              onChange={setFormat}
              options={[
                { value: "list", label: `All ${good.length} links` },
                { value: "csv", label: "CSV" },
              ]}
            />
          )}
          {(good.length > 1 || !good.length) && (
            <OutputBox
              value={output}
              filename={format === "csv" ? "utm-links.csv" : "utm-links.txt"}
              language={format}
              placeholder="Add a URL and campaign details."
            />
          )}
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
