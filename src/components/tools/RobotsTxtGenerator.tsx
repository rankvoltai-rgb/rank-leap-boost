import { useMemo, useState } from "react";
import { AI_BOTS, BOT_ROLES, type BotRole } from "@/lib/robots";
import {
  Field,
  OutputBox,
  Pane,
  Presets,
  Stat,
  StatGrid,
  TextArea,
  TextInput,
  Toggle,
  Workbench,
  lines,
} from "./shared";

type Preset = "all" | "search" | "none";

const PRESETS: { value: Preset; label: string; hint: string }[] = [
  { value: "all", label: "Allow all AI bots", hint: "Maximum visibility, including training" },
  {
    value: "search",
    label: "Search & live fetch only",
    hint: "Stay in AI answers, opt out of training",
  },
  { value: "none", label: "Block all AI bots", hint: "Google and Bing still allowed" },
];

const ROLES: BotRole[] = ["search", "user", "training"];

function applyPreset(p: Preset): Record<string, boolean> {
  return Object.fromEntries(
    AI_BOTS.map((b) => [
      b.token,
      p === "all" ? true : p === "search" ? b.role !== "training" : false,
    ]),
  );
}

export function RobotsTxtGenerator() {
  const [preset, setPreset] = useState<Preset | null>("all");
  const [allowed, setAllowed] = useState<Record<string, boolean>>(() => applyPreset("all"));
  const [searchEngines, setSearchEngines] = useState(true);
  const [privatePaths, setPrivatePaths] = useState("");
  const [sitemap, setSitemap] = useState("");

  function choose(p: Preset) {
    setPreset(p);
    setAllowed(applyPreset(p));
  }

  function toggle(token: string, next: boolean) {
    setPreset(null);
    setAllowed((prev) => ({ ...prev, [token]: next }));
  }

  const output = useMemo(() => {
    const disallows = lines(privatePaths).map((p) => (p.startsWith("/") ? p : `/${p}`));
    const out: string[] = [
      `# robots.txt — generated with rankbox.xyz/tools/ai-robots-txt-generator`,
      "",
    ];

    out.push("# Search engines (Google, Bing and everything not named below)", "User-agent: *");
    if (searchEngines) {
      out.push("Allow: /", ...disallows.map((d) => `Disallow: ${d}`));
    } else {
      out.push("Disallow: /");
    }

    for (const role of ROLES) {
      const bots = AI_BOTS.filter((b) => b.role === role);
      const yes = bots.filter((b) => allowed[b.token]);
      const no = bots.filter((b) => !allowed[b.token]);
      out.push("", `# ${BOT_ROLES[role].label}`);
      if (yes.length) {
        out.push(
          ...yes.map((b) => `User-agent: ${b.token}`),
          "Allow: /",
          ...disallows.map((d) => `Disallow: ${d}`),
        );
      }
      if (yes.length && no.length) out.push("");
      if (no.length) {
        out.push(...no.map((b) => `User-agent: ${b.token}`), "Disallow: /");
      }
    }

    if (sitemap.trim()) out.push("", `Sitemap: ${sitemap.trim()}`);
    return out.join("\n") + "\n";
  }, [allowed, searchEngines, privatePaths, sitemap]);

  const counts = useMemo(() => {
    const by = (role: BotRole) => {
      const bots = AI_BOTS.filter((b) => b.role === role);
      return { on: bots.filter((b) => allowed[b.token]).length, total: bots.length };
    };
    return { search: by("search"), user: by("user"), training: by("training") };
  }, [allowed]);

  return (
    <Workbench
      input={
        <>
          <Pane title="Start from a preset">
            <Presets value={preset} onChange={choose} options={PRESETS} />
            <Toggle
              label="Search engines (User-agent: *)"
              description="Keep this on. Google's AI Overviews and AI Mode ride on ordinary Googlebot."
              checked={searchEngines}
              onChange={setSearchEngines}
            />
          </Pane>

          {ROLES.map((role) => (
            <Pane key={role} title={BOT_ROLES[role].label} description={BOT_ROLES[role].blurb}>
              <div className="space-y-2">
                {AI_BOTS.filter((b) => b.role === role).map((b) => (
                  <Toggle
                    key={b.token}
                    label={b.token}
                    description={`${b.vendor} · ${b.purpose}`}
                    checked={!!allowed[b.token]}
                    onChange={(next) => toggle(b.token, next)}
                    badge={
                      b.ignoresRobots ? (
                        <span className="rounded-md bg-warning/15 px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide text-warning">
                          may ignore
                        </span>
                      ) : b.tokenOnly ? (
                        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide text-muted-foreground">
                          token
                        </span>
                      ) : null
                    }
                  />
                ))}
              </div>
            </Pane>
          ))}

          <Pane title="Paths & sitemap">
            <Field label="Private paths" hint="One per line — applied to every allowed bot">
              <TextArea
                value={privatePaths}
                onChange={(e) => setPrivatePaths(e.target.value)}
                placeholder={"/admin/\n/account/\n/api/"}
                className="min-h-20"
                mono
              />
            </Field>
            <Field label="Sitemap URL" hint="Optional">
              <TextInput
                value={sitemap}
                onChange={(e) => setSitemap(e.target.value)}
                placeholder="https://yoursite.com/sitemap.xml"
              />
            </Field>
          </Pane>
        </>
      }
      output={
        <>
          <StatGrid cols={3}>
            <Stat
              value={`${counts.search.on}/${counts.search.total}`}
              label="Search bots allowed"
              hint="What gets you cited"
            />
            <Stat value={`${counts.user.on}/${counts.user.total}`} label="Live fetchers allowed" />
            <Stat
              value={`${counts.training.on}/${counts.training.total}`}
              label="Training bots allowed"
            />
          </StatGrid>
          <OutputBox value={output} filename="robots.txt" language="robots.txt" lineNumbers />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Upload to the root of your domain so it's reachable at yoursite.com/robots.txt. Bots
            re-read it on their own schedule, usually within a day.
          </p>
        </>
      }
    />
  );
}
