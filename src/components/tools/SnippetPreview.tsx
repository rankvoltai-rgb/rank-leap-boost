import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Field,
  Meter,
  Pane,
  Segmented,
  TextArea,
  TextInput,
  Toggle,
  Workbench,
  textWidth,
  truncateToWidth,
} from "./shared";

type Device = "desktop" | "mobile";

/* Google's rendering, September 2026: Arial, 20px titles and 14px descriptions on
   desktop; 16px / 14px on mobile. Limits are the widely measured cut-offs. */
const LIMITS = {
  desktop: {
    titleFont: "20px Arial",
    titlePx: 580,
    descFont: "14px Arial",
    descPx: 920,
    width: 600,
  },
  mobile: {
    titleFont: "16px Arial",
    titlePx: 660,
    descFont: "14px Arial",
    descPx: 680,
    width: 380,
  },
};

const PLACEHOLDER_TITLE = "Free llms.txt Generator for AI Search | Rankbox";
const PLACEHOLDER_DESC =
  "Generate a valid llms.txt file in seconds so AI engines like ChatGPT and Perplexity understand and cite your site. Free, no signup.";

function useMeasure(text: string, font: string) {
  const [w, setW] = useState(0);
  useEffect(() => setW(textWidth(text, font)), [text, font]);
  return w;
}

export function SnippetPreview() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [device, setDevice] = useState<Device>("desktop");
  const [dated, setDated] = useState(false);

  const L = LIMITS[device];
  const shownTitle = title || PLACEHOLDER_TITLE;
  const datePrefix = dated
    ? `${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — `
    : "";
  const shownDesc = datePrefix + (desc || PLACEHOLDER_DESC);

  const titlePx = useMeasure(title, L.titleFont);
  const descPx = useMeasure(desc, L.descFont);

  const [cutTitle, setCutTitle] = useState({ text: shownTitle, cut: false });
  const [cutDesc, setCutDesc] = useState({ text: shownDesc, cut: false });
  useEffect(
    () => setCutTitle(truncateToWidth(shownTitle, L.titleFont, L.titlePx)),
    [shownTitle, L],
  );
  useEffect(() => setCutDesc(truncateToWidth(shownDesc, L.descFont, L.descPx)), [shownDesc, L]);

  const { host, crumbs } = useMemo(() => {
    const raw = url.trim() || "https://yoursite.com/tools/llms-txt";
    try {
      const u = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
      const h = u.hostname.replace(/^www\./, "");
      const parts = u.pathname.split("/").filter(Boolean);
      return { host: h, crumbs: [h, ...parts].join(" › ") };
    } catch {
      return { host: "yoursite.com", crumbs: raw };
    }
  }, [url]);
  const brand = siteName.trim() || host.split(".")[0].replace(/^\w/, (c) => c.toUpperCase());
  const firstSentence = (desc || PLACEHOLDER_DESC).split(/(?<=[.!?])\s/)[0];

  return (
    <Workbench
      input={
        <Pane title="Your snippet">
          <Field label="Page title" hint={`${title.length} chars`}>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={PLACEHOLDER_TITLE}
            />
          </Field>
          <Field label="URL">
            <TextInput
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursite.com/tools/llms-txt"
            />
          </Field>
          <Field label="Site name" hint="Optional — shown above the title">
            <TextInput
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Rankbox"
            />
          </Field>
          <Field label="Meta description" hint={`${desc.length} chars`}>
            <TextArea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={PLACEHOLDER_DESC}
            />
          </Field>
          <Toggle
            label="Show a date before the description"
            description="Google adds one on time-sensitive pages; it eats ~110px."
            checked={dated}
            onChange={setDated}
          />
          <div className="space-y-3 border-t border-border pt-4">
            <Meter
              label="Title width"
              value={Math.round(titlePx)}
              max={L.titlePx}
              min={Math.round(L.titlePx * 0.45)}
              unit="px"
            />
            <Meter
              label="Description width"
              value={Math.round(descPx)}
              max={L.descPx}
              min={Math.round(L.descPx * 0.5)}
              unit="px"
            />
          </div>
        </Pane>
      }
      output={
        <>
          <Pane
            title="Google preview"
            actions={
              <Segmented
                size="sm"
                value={device}
                onChange={setDevice}
                options={[
                  { value: "desktop", label: "Desktop" },
                  { value: "mobile", label: "Mobile" },
                ]}
              />
            }
          >
            <div className="flex justify-center rounded-xl bg-surface/70 p-4 sm:p-6">
              <div
                className={cn(
                  "rounded-xl bg-white p-4 text-left shadow-1 ring-1 ring-black/5",
                  device === "mobile" && "rounded-2xl",
                )}
                style={{
                  width: "100%",
                  maxWidth: L.width,
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dadce0] bg-[#f1f3f4] text-[11px] font-bold text-[#202124]">
                    {brand[0]?.toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] leading-[18px] text-[#202124]">{brand}</span>
                    <span className="block truncate text-[12px] leading-[16px] text-[#4d5156]">
                      {crumbs}
                    </span>
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1.5 text-[#1a0dab]",
                    device === "desktop"
                      ? "text-[20px] leading-[26px]"
                      : "text-[16px] leading-[22px]",
                  )}
                  style={
                    device === "desktop" ? { whiteSpace: "nowrap", overflow: "hidden" } : undefined
                  }
                >
                  {cutTitle.text}
                </p>
                <p className="mt-1 text-[14px] leading-[22px] text-[#4d5156]">{cutDesc.text}</p>
              </div>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                {cutTitle.cut
                  ? "Title is truncated — distinctive words after the cut are lost."
                  : "Title fits on this device."}
              </li>
              <li>
                {cutDesc.cut
                  ? "Description is truncated at the pixel limit."
                  : "Description fits on this device."}
              </li>
            </ul>
          </Pane>

          <Pane
            title="AI Overview citation"
            description="How the same page reads as a cited source"
          >
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[0.95rem] leading-relaxed text-ink">{firstSentence}</p>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-ink">
                  {brand[0]?.toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.8rem] font-semibold text-ink">
                    {shownTitle}
                  </span>
                  <span className="block truncate text-[0.7rem] text-muted-foreground">{host}</span>
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Engines quote the first complete claim they find. If that sentence can't stand alone,
              rewrite it.
            </p>
          </Pane>
        </>
      }
    />
  );
}
