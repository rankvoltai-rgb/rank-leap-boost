import { useMemo, useState } from "react";
import { Field, TextInput, OutputBox, ToolGrid, Panel, Toggle } from "./shared";

interface Bot {
  agent: string;
  label: string;
  description: string;
}

const BOTS: Bot[] = [
  { agent: "GPTBot", label: "GPTBot", description: "OpenAI — powers ChatGPT search & browsing" },
  { agent: "OAI-SearchBot", label: "OAI-SearchBot", description: "OpenAI's search index crawler" },
  { agent: "ChatGPT-User", label: "ChatGPT-User", description: "ChatGPT live page fetches" },
  { agent: "ClaudeBot", label: "ClaudeBot", description: "Anthropic — powers Claude" },
  { agent: "PerplexityBot", label: "PerplexityBot", description: "Perplexity answer engine" },
  { agent: "Google-Extended", label: "Google-Extended", description: "Google AI (Gemini, AI Overviews)" },
  { agent: "Applebot-Extended", label: "Applebot-Extended", description: "Apple Intelligence" },
  { agent: "CCBot", label: "CCBot", description: "Common Crawl — trains many models" },
  { agent: "Bytespider", label: "Bytespider", description: "ByteDance / TikTok crawler" },
  { agent: "meta-externalagent", label: "Meta AI", description: "Meta's AI crawler" },
];

export function RobotsTxtGenerator() {
  const [allowed, setAllowed] = useState<Record<string, boolean>>(
    Object.fromEntries(BOTS.map((b) => [b.agent, true])),
  );
  const [allowAll, setAllowAll] = useState(true);
  const [sitemap, setSitemap] = useState("");

  const output = useMemo(() => {
    const blocks: string[] = [];
    blocks.push("# Standard crawlers", "User-agent: *", allowAll ? "Allow: /" : "Disallow: /");
    for (const bot of BOTS) {
      blocks.push("", `User-agent: ${bot.agent}`, allowed[bot.agent] ? "Allow: /" : "Disallow: /");
    }
    if (sitemap.trim()) {
      blocks.push("", `Sitemap: ${sitemap.trim()}`);
    }
    return blocks.join("\n") + "\n";
  }, [allowed, allowAll, sitemap]);

  return (
    <ToolGrid>
      <Panel title="Crawler access">
        <Toggle
          label="All standard crawlers (Google, Bing…)"
          description="Keep this on so search engines can index you"
          checked={allowAll}
          onChange={setAllowAll}
        />
        <div className="space-y-2.5">
          {BOTS.map((bot) => (
            <Toggle
              key={bot.agent}
              label={bot.label}
              description={bot.description}
              checked={allowed[bot.agent]}
              onChange={(next) => setAllowed((prev) => ({ ...prev, [bot.agent]: next }))}
            />
          ))}
        </div>
        <Field label="Sitemap URL" hint="Optional">
          <TextInput
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
            placeholder="https://yoursite.com/sitemap.xml"
          />
        </Field>
      </Panel>
      <Panel title="robots.txt">
        <OutputBox value={output} filename="robots.txt" language="robots.txt" />
      </Panel>
    </ToolGrid>
  );
}