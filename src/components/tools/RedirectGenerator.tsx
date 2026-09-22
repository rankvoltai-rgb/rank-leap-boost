import { useMemo, useState } from "react";
import {
  CheckList,
  Field,
  OutputBox,
  Pane,
  Segmented,
  Stat,
  StatGrid,
  TextArea,
  TextInput,
  Toggle,
  Workbench,
  lines,
  type CheckItem,
} from "./shared";

type Platform = "htaccess" | "nginx" | "vercel" | "netlify" | "nextjs";
type Code = "301" | "308";

const PLATFORMS: { value: Platform; label: string; file: string }[] = [
  { value: "htaccess", label: "Apache", file: ".htaccess" },
  { value: "nginx", label: "Nginx", file: "nginx.conf" },
  { value: "vercel", label: "Vercel", file: "vercel.json" },
  { value: "netlify", label: "Netlify / CF Pages", file: "_redirects" },
  { value: "nextjs", label: "Next.js", file: "next.config.js" },
];

interface Pair {
  from: string;
  to: string;
  wildcard: boolean;
}

function parse(text: string): { pairs: Pair[]; bad: string[] } {
  const pairs: Pair[] = [];
  const bad: string[] = [];
  for (const line of lines(text)) {
    const m = line.split(/\s*(?:->|→|=>|\t|,|\|)\s*|\s{2,}|\s+(?=https?:\/\/|\/)/).filter(Boolean);
    if (m.length < 2) {
      bad.push(line);
      continue;
    }
    let from = m[0].trim();
    const to = m[1].trim();
    try {
      if (/^https?:\/\//i.test(from)) from = new URL(from).pathname;
    } catch {
      /* keep as typed */
    }
    if (!from.startsWith("/")) from = `/${from}`;
    pairs.push({ from, to, wildcard: from.endsWith("*") });
  }
  return { pairs, bad };
}

function render(
  pairs: Pair[],
  platform: Platform,
  code: Code,
  domain: { on: boolean; from: string; to: string },
): string {
  const status = code;
  const dom = domain.on && domain.from && domain.to;
  const dFrom = domain.from.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const dTo = domain.to.replace(/\/$/, "");

  if (platform === "htaccess") {
    const out = ["RewriteEngine On"];
    if (dom)
      out.push(
        "",
        `# Whole domain`,
        `RewriteCond %{HTTP_HOST} ^(www\\.)?${dFrom.replace(/\./g, "\\.")}$ [NC]`,
        `RewriteRule ^(.*)$ ${dTo}/$1 [R=${status},L]`,
      );
    if (pairs.length) out.push("", "# Individual URLs");
    for (const p of pairs) {
      if (p.wildcard)
        out.push(
          `RewriteRule ^${p.from.slice(1, -1).replace(/[.+?^${}()|[\]\\]/g, "\\$&")}(.*)$ ${p.to}$1 [R=${status},L]`,
        );
      else out.push(`Redirect ${status} ${p.from} ${p.to}`);
    }
    return out.join("\n");
  }
  if (platform === "nginx") {
    const out: string[] = [];
    if (dom)
      out.push(
        `server {`,
        `    listen 80;`,
        `    listen 443 ssl;`,
        `    server_name ${dFrom} www.${dFrom};`,
        `    return ${status} ${dTo}$request_uri;`,
        `}`,
        "",
      );
    if (pairs.length) out.push("# Inside your server { } block");
    for (const p of pairs) {
      if (p.wildcard)
        out.push(
          `location ^~ ${p.from.slice(0, -1)} { rewrite ^${p.from.slice(0, -1)}(.*)$ ${p.to}$1 permanent; }`,
        );
      else out.push(`location = ${p.from} { return ${status} ${p.to}; }`);
    }
    return out.join("\n");
  }
  if (platform === "vercel") {
    const redirects: Record<string, unknown>[] = [];
    if (dom)
      redirects.push({
        source: "/:path*",
        has: [{ type: "host", value: dFrom }],
        destination: `${dTo}/:path*`,
        permanent: true,
      });
    for (const p of pairs) {
      redirects.push(
        p.wildcard
          ? {
              source: `${p.from.slice(0, -1)}:path*`,
              destination: `${p.to}:path*`,
              permanent: true,
            }
          : { source: p.from, destination: p.to, permanent: true },
      );
    }
    return (
      JSON.stringify({ redirects }, null, 2) +
      (code === "301"
        ? '\n\n// Vercel uses 308 for permanent: true. For a literal 301 use "statusCode": 301 instead of permanent.'
        : "")
    );
  }
  if (platform === "netlify") {
    const out: string[] = [];
    if (dom)
      out.push(
        `https://${dFrom}/* ${dTo}/:splat ${status}!`,
        `https://www.${dFrom}/* ${dTo}/:splat ${status}!`,
        "",
      );
    for (const p of pairs) {
      out.push(
        p.wildcard
          ? `${p.from.slice(0, -1)}* ${p.to}:splat ${status}`
          : `${p.from} ${p.to} ${status}`,
      );
    }
    return out.join("\n");
  }
  // nextjs
  const items: string[] = [];
  if (dom)
    items.push(
      `    { source: '/:path*', has: [{ type: 'host', value: '${dFrom}' }], destination: '${dTo}/:path*', permanent: true },`,
    );
  for (const p of pairs) {
    items.push(
      p.wildcard
        ? `    { source: '${p.from.slice(0, -1)}:path*', destination: '${p.to}:path*', permanent: true },`
        : `    { source: '${p.from}', destination: '${p.to}', permanent: true },`,
    );
  }
  return [
    `// next.config.js`,
    `module.exports = {`,
    `  async redirects() {`,
    `    return [`,
    ...items.map((i) => `  ${i}`),
    `    ];`,
    `  },`,
    `};`,
    "",
    `// permanent: true sends a 308. For 301 use statusCode: 301 instead.`,
  ].join("\n");
}

export function RedirectGenerator() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState<Platform>("htaccess");
  const [code, setCode] = useState<Code>("301");
  const [domainOn, setDomainOn] = useState(false);
  const [domFrom, setDomFrom] = useState("");
  const [domTo, setDomTo] = useState("");

  const { pairs, bad } = useMemo(() => parse(text), [text]);
  const output = useMemo(
    () =>
      pairs.length || (domainOn && domFrom && domTo)
        ? render(pairs, platform, code, { on: domainOn, from: domFrom, to: domTo })
        : "",
    [pairs, platform, code, domainOn, domFrom, domTo],
  );
  const file = PLATFORMS.find((p) => p.value === platform)!.file;

  const checks = useMemo<CheckItem[]>(() => {
    const items: CheckItem[] = [];
    if (bad.length)
      items.push({
        id: "bad",
        status: "fail",
        label: `${bad.length} line${bad.length === 1 ? "" : "s"} couldn't be parsed`,
        detail: bad.slice(0, 2).join(" · "),
        fix: "Write each as `old-path -> new-url`.",
      });
    const froms = pairs.map((p) => p.from);
    const dupes = [...new Set(froms.filter((f, i) => froms.indexOf(f) !== i))];
    if (dupes.length)
      items.push({
        id: "dupe",
        status: "warn",
        label: `Duplicate source${dupes.length === 1 ? "" : "s"}: ${dupes.slice(0, 3).join(", ")}`,
        fix: "Only the first rule for a path fires; remove the others.",
      });
    const loops = pairs.filter(
      (p) => p.from === p.to || pairs.some((q) => q.from === p.to.replace(/^https?:\/\/[^/]+/, "")),
    );
    if (loops.length)
      items.push({
        id: "loop",
        status: "warn",
        label: `${loops.length} possible chain or loop`,
        fix: "Point every old URL at the final destination, not at another redirected URL.",
      });
    const rel = pairs.filter((p) => !/^https?:\/\//i.test(p.to) && !p.to.startsWith("/"));
    if (rel.length)
      items.push({
        id: "rel",
        status: "warn",
        label: `${rel.length} destination${rel.length === 1 ? "" : "s"} neither absolute nor rooted`,
        fix: "Destinations should start with / or https://.",
      });
    if (!items.length && pairs.length)
      items.push({
        id: "ok",
        status: "pass",
        label: `${pairs.length} redirect${pairs.length === 1 ? "" : "s"} ready`,
      });
    return items;
  }, [pairs, bad]);

  return (
    <Workbench
      input={
        <>
          <Pane title="Redirects">
            <Field label="Old → new" hint="One per line">
              <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  "/old-page -> /new-page\n/blog/2019/post -> https://yoursite.com/blog/post\n/docs/* -> /help/"
                }
                className="min-w-0 min-h-52"
                mono
                spellCheck={false}
              />
            </Field>
            <Toggle
              label="Also redirect a whole domain"
              description="olddomain.com/* → newdomain.com/*"
              checked={domainOn}
              onChange={setDomainOn}
            />
            {domainOn && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Old domain">
                  <TextInput
                    value={domFrom}
                    onChange={(e) => setDomFrom(e.target.value)}
                    placeholder="olddomain.com"
                  />
                </Field>
                <Field label="New origin">
                  <TextInput
                    value={domTo}
                    onChange={(e) => setDomTo(e.target.value)}
                    placeholder="https://newdomain.com"
                  />
                </Field>
              </div>
            )}
          </Pane>
          <Pane title="Target">
            <Field label="Platform">
              <Segmented
                value={platform}
                onChange={setPlatform}
                options={PLATFORMS.map((p) => ({ value: p.value, label: p.label }))}
              />
            </Field>
            <Field label="Status code">
              <Segmented
                value={code}
                onChange={setCode}
                options={[
                  { value: "301", label: "301 Moved Permanently" },
                  { value: "308", label: "308 Permanent (keeps method)" },
                ]}
              />
            </Field>
          </Pane>
        </>
      }
      output={
        <>
          <StatGrid cols={3}>
            <Stat value={pairs.length} label="Rules" />
            <Stat value={pairs.filter((p) => p.wildcard).length} label="Wildcards" />
            <Stat value={file} label="File" />
          </StatGrid>
          <OutputBox
            value={output}
            filename={file}
            language={platform}
            placeholder="Add redirects to see the rules."
            lineNumbers
          />
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
