import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, OutputBox, Pane, Select, TextArea, TextInput, Workbench } from "./shared";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function Img({ src, className }: { src: string; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-secondary to-border text-muted-foreground",
          className,
        )}
      >
        <ImageOff className="h-6 w-6" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setBroken(true)}
      className={cn("object-cover", className)}
    />
  );
}

export function OpenGraphGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [site, setSite] = useState("");
  const [type, setType] = useState("website");
  const [handle, setHandle] = useState("");
  const [card, setCard] = useState("summary_large_image");

  const host = useMemo(() => {
    try {
      return new URL(url.trim()).hostname.replace(/^www\./, "");
    } catch {
      return "yoursite.com";
    }
  }, [url]);

  const shownTitle = title || "Your page title";
  const shownDesc =
    desc || "Your description appears here. Keep it under 200 characters for the cleanest unfurl.";

  const tags = useMemo(() => {
    const out: string[] = ["<!-- Open Graph -->"];
    const og = (p: string, c: string) =>
      c && out.push(`<meta property="og:${p}" content="${esc(c)}">`);
    og("type", type);
    og("title", title);
    og("description", desc);
    og("url", url);
    og("image", image);
    if (image)
      out.push(
        `<meta property="og:image:width" content="1200">`,
        `<meta property="og:image:height" content="630">`,
      );
    og("site_name", site);
    out.push("", "<!-- Twitter / X -->");
    out.push(`<meta name="twitter:card" content="${card}">`);
    const tw = (p: string, c: string) =>
      c && out.push(`<meta name="twitter:${p}" content="${esc(c)}">`);
    tw("site", handle ? (handle.startsWith("@") ? handle : `@${handle}`) : "");
    tw("title", title);
    tw("description", desc);
    tw("image", image);
    return out.join("\n");
  }, [title, desc, url, image, site, type, handle, card]);

  return (
    <Workbench
      input={
        <Pane title="Page">
          <Field label="Title" hint={`${title.length}/70`}>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Free llms.txt Generator"
            />
          </Field>
          <Field label="Description" hint={`${desc.length}/200`}>
            <TextArea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="min-h-20"
              placeholder="Build a valid llms.txt in a minute so AI engines understand your site."
            />
          </Field>
          <Field label="Canonical URL">
            <TextInput
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursite.com/page"
            />
          </Field>
          <Field label="Image URL" hint="1200×630, absolute https">
            <TextInput
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://yoursite.com/og.png"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site name">
              <TextInput
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="Rankbox"
              />
            </Field>
            <Field label="Type">
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
              </Select>
            </Field>
            <Field label="X handle" hint="Optional">
              <TextInput
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@rankbox"
              />
            </Field>
            <Field label="Twitter card">
              <Select value={card} onChange={(e) => setCard(e.target.value)}>
                <option value="summary_large_image">Large image</option>
                <option value="summary">Small summary</option>
              </Select>
            </Field>
          </div>
        </Pane>
      }
      output={
        <>
          <Pane title="Previews">
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">X</p>
                <div className="overflow-hidden rounded-2xl border border-border bg-background">
                  {card === "summary_large_image" ? (
                    <>
                      <Img src={image} className="aspect-[1.91/1] w-full" />
                      <div className="px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-ink">{shownTitle}</p>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{shownDesc}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{host}</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex">
                      <Img src={image} className="h-28 w-28 shrink-0" />
                      <div className="min-w-0 px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-ink">{shownTitle}</p>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{shownDesc}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{host}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">LinkedIn</p>
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  <Img src={image} className="aspect-[1.91/1] w-full" />
                  <div className="bg-surface px-3 py-2.5">
                    <p className="line-clamp-2 text-sm font-semibold text-ink">{shownTitle}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{host}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">Slack</p>
                <div className="flex gap-3 border-l-4 border-border py-1 pl-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink">{site || host}</p>
                    <p className="text-sm font-semibold text-volt">{shownTitle}</p>
                    <p className="line-clamp-3 text-sm text-ink/80">{shownDesc}</p>
                  </div>
                  <Img src={image} className="h-20 w-20 shrink-0 rounded-lg" />
                </div>
              </div>
            </div>
          </Pane>
          <OutputBox value={tags} filename="og-tags.html" language="html" mime="text/html" />
        </>
      }
    />
  );
}
